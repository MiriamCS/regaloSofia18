// Enemigos: estorban más que atacan. Al derrotarlos desaparecen en una nube de notas.
//
// Propiedades (desde Tiled):
//   clase: patrullero | volador | bloqueador | ladron | desafinado
//   sprite: textura (pato, cochecito, mochila, mosquito, avion-papel, notificacion, boligrafo, examenes, urraca, metronomo, despertador);
//           hacia dónde mira cada dibujo y su tamaño están en config/enemigos.json
//   velocidad, rango (tiles), amplitud (tiles, voladores), periodo (ms, voladores)
//   eliminable: lista con 'salto', 'caja', 'canto' (p.ej. "salto,caja")
//   canto: reacción al cantar cerca: dormir | huir | enfadar | apartar | invertir | nada
//   danio: velas que quita (voladores; por defecto 1)
//   dormirMs: cuánto duerme al cantarle (por defecto JUEGO.canto.dormirMs)
//   embiste: acelera cuando ve a Sofía delante y cerca (patrulleros)
//   insistente: se acerca despacio a Sofía cuando la tiene cerca (voladores que se mueven)
//   empujable: Sofía lo empuja despacio, como una caja pesada (bloqueadores)
import Phaser from 'phaser';
import { JUEGO, TILE, ENEMIGOS } from '../config.js';
import { FUENTE } from '../estilo.js';
import { Audio } from '../audio/Audio.js';

const ESC = 0.5;

const POR_DEFECTO = {
  patrullero: { sprite: 'pato', velocidad: 70, rango: 3, eliminable: 'salto,caja', canto: 'dormir' },
  // al cantarles, los voladores huyen (salvo el mosquito, que se duerme): solo se eliminan saltándoles encima
  volador: { sprite: 'mosquito', velocidad: 60, rango: 3, amplitud: 1, periodo: 1800, eliminable: 'salto', canto: 'huir' },
  bloqueador: { sprite: 'boligrafo', eliminable: '', canto: 'apartar' },
  ladron: { sprite: 'urraca', velocidad: 110, rango: 4, eliminable: '', canto: 'enfadar' },
  desafinado: { sprite: 'metronomo', velocidad: 40, rango: 2, eliminable: 'caja', canto: 'invertir' },
};

// Lo que distingue a monstruos de la misma clase (se aplica antes que las propiedades del nivel)
const POR_SPRITE = {
  cochecito: { embiste: true },
  mochila: { dormirMs: 7000 },
  mosquito: { canto: 'dormir' },
  notificacion: { insistente: true },
  // al cantarle desaparece del todo: aunque la hayas empujado a un mal sitio, nunca bloquea el nivel
  examenes: { empujable: true, eliminable: 'canto' },
};
// Embestida del cochecito: a qué distancia te ve (tiles por delante, y de alto) y cuánto acelera
const EMBESTIDA = { lejos: 4, alto: 1, factor: 1.8 };
// Notificación insistente: a qué distancia te nota (tiles), cuánto se aleja de su ruta para seguirte y a qué parte de su velocidad
const INSISTENTE = { radio: 5, correa: 3, factor: 0.6 };

export class Enemigo extends Phaser.Physics.Arcade.Image {
  constructor(scene, o) {
    const tipo = o.p.clase || 'patrullero';
    const def = { ...POR_DEFECTO[tipo], ...POR_SPRITE[o.p.sprite || POR_DEFECTO[tipo].sprite], ...o.p };
    super(scene, o.pieX, o.pieY, def.sprite);
    this.tipo = tipo;
    this.def = def;
    this.o = o;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setScale(ESC * (def.escala || 1)).setDepth(40);
    this.inicioX = o.pieX;
    this.inicioY = o.pieY;
    this.mira = ENEMIGOS[def.sprite]?.mira || 'derecha';
    this.dir = def.dir === 'izq' ? -1 : 1;
    this.vel = def.velocidad || 0;
    this.rango = (def.rango || 0) * TILE;
    this.eliminable = String(def.eliminable || '').split(',').map((s) => s.trim());
    this.reaccion = def.canto || 'nada';
    this.dormidoHasta = 0;
    this.vivo = true;
    this.t0 = Math.random() * 1000;
    const b = this.body;
    // cuerpo algo más pequeño que el dibujo
    b.setSize(this.width * 0.75, this.height * 0.8);
    b.setOffset(this.width * 0.125, this.height * 0.2);
    b.pushable = false;
    if (tipo === 'volador') {
      b.setAllowGravity(false);
      this.amplitud = (def.amplitud || 0) * TILE;
      this.periodo = def.periodo || 1800;
    }
    if (tipo === 'bloqueador' && def.empujable) {
      // como las cajas: cae, frena en seco al dejar de empujarlo y Sofía va lenta al empujar (pesada)
      b.pushable = true;
      b.setDragX(3000);
      b.setMaxVelocity(400, 1000);
      this.pesada = true;
    } else if (tipo === 'bloqueador') {
      b.setAllowGravity(false);
      b.setImmovable(true);
    }
    if (tipo === 'ladron') {
      this.botin = null;
      this.iconoBotin = scene.add.image(this.x, this.y, 'marco-foto').setScale(ESC * 0.6).setDepth(41).setVisible(false);
    }
    this.zzz = scene.add.text(this.x, this.y, 'z z z', { fontFamily: FUENTE, fontSize: '18px', color: '#ffffff', stroke: '#1b2a4a', strokeThickness: 4 }).setDepth(42).setVisible(false);
  }

  get dormido() {
    return this.scene.time.now < this.dormidoHasta;
  }

  actualizar(t, dt, sofia) {
    if (!this.vivo) return;
    const b = this.body;
    this.zzz.setVisible(this.dormido).setPosition(this.x - 10, this.y - this.displayHeight - 22 + Math.sin(t / 300) * 4);
    if (this.dormido) {
      b.setVelocityX(0);
      if (this.tipo === 'volador') b.setVelocityY(0);
      this.setAngle(0);
      return;
    }
    const enfado = this.enfadadoHasta > t ? 2.2 : 1;
    // encerrado entre dos paredes (o entre una caja y un muro): se queda quieto en vez de darse la vuelta sin parar
    const patrulla = this.tipo === 'patrullero' || this.tipo === 'desafinado' || (this.tipo === 'ladron' && !this.botin);
    this.encerrado = patrulla && (this.encerrado || b.blocked.left || b.blocked.right) && this.sinSitio(-1) && this.sinSitio(1);
    const encerrado = this.encerrado;
    switch (this.tipo) {
      case 'patrullero':
      case 'desafinado': {
        if (encerrado) {
          b.setVelocityX(0);
          this.mirarHacia(sofia.x - this.x);
          break;
        }
        if (b.blocked.left) this.dir = 1;
        else if (b.blocked.right) this.dir = -1;
        else if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
        else if (b.blocked.down && !this.haySueloDelante()) this.dir *= -1;
        const embiste = this.def.embiste && this.teVeDelante(sofia) ? EMBESTIDA.factor : 1;
        b.setVelocityX(this.dir * this.vel * enfado * embiste);
        this.mirarHacia(this.dir);
        this.setAngle(Math.sin(t / (embiste > 1 ? 50 : 110) + this.t0) * 5);
        if (this.tipo === 'desafinado') this.setAngle(Math.sin(t / 90) * 14);
        break;
      }
      case 'volador': {
        const tt = t + this.t0;
        if (this.huyendoHasta > t) {
          b.setVelocity(Math.sign(this.x - sofia.x) * 260, -140);
        } else if (this.def.insistente && this.vel && this.tienesCerca(sofia, INSISTENTE.radio * TILE)) {
          // va hacia Sofía, sin alejarse demasiado de su ruta
          const correa = this.rango + INSISTENTE.correa * TILE;
          const ox = Phaser.Math.Clamp(sofia.x, this.inicioX - correa, this.inicioX + correa);
          const oy = Phaser.Math.Clamp(sofia.y - 30, this.inicioY - 2 * TILE, this.inicioY + 2 * TILE);
          const v = new Phaser.Math.Vector2(ox - this.x, oy - this.y);
          if (v.length() > 4) v.setLength(this.vel * INSISTENTE.factor);
          else v.reset();
          b.setVelocity(v.x, v.y);
          if (v.x) this.dir = Math.sign(v.x);
        } else {
          const objetivoY = this.inicioY + Math.sin((tt / this.periodo) * Math.PI * 2) * this.amplitud;
          if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
          b.setVelocityX(this.dir * this.vel * enfado);
          b.setVelocityY((objetivoY - this.y) * 4);
        }
        this.mirarHacia(b.velocity.x);
        break;
      }
      case 'ladron': {
        if (this.botin) {
          // huye de Sofía, saltando si choca; al borde de un hueco se queda acorralada (si salta, se cae al vacío con lo robado)
          const lejos = Math.sign(this.x - sofia.x) || 1;
          const borde = b.blocked.down && !this.haySueloDelante(lejos);
          b.setVelocityX(borde ? 0 : lejos * this.vel * 1.6 * enfado);
          if ((b.blocked.left || b.blocked.right) && b.blocked.down) b.setVelocityY(-620);
          this.mirarHacia(lejos);
          this.iconoBotin.setPosition(this.x, this.y - this.displayHeight - 8);
        } else if (encerrado) {
          b.setVelocityX(0);
          this.mirarHacia(sofia.x - this.x);
        } else {
          if (b.blocked.left) this.dir = 1;
          else if (b.blocked.right) this.dir = -1;
          else if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
          b.setVelocityX(this.dir * this.vel * 0.6 * enfado);
          this.mirarHacia(this.dir);
        }
        this.setAngle(Math.sin(t / 80) * 6);
        break;
      }
      case 'bloqueador':
        // empujado a un hueco: se pierde (como si le hubieras cantado)
        if (this.def.empujable && this.y > this.scene.datos.alto + 200) this.derrotar();
        // no se mueve solo, pero mira a Sofía
        this.mirarHacia(sofia.x - this.x);
        this.setAngle(Math.sin(t / 500) * 1.5);
        break;
      default:
        break;
    }
  }

  // Los dibujos de lado se dan la vuelta según hacia dónde van; los de frente, nunca
  mirarHacia(dir) {
    if (this.mira === 'frente' || !dir) return;
    this.setFlipX(this.mira === 'derecha' ? dir < 0 : dir > 0);
  }

  // Sofía está por delante, cerca y más o menos a su altura
  teVeDelante(sofia) {
    const dx = (sofia.x - this.x) * this.dir;
    return dx > 0 && dx < EMBESTIDA.lejos * TILE && Math.abs(sofia.y - this.y) < EMBESTIDA.alto * TILE;
  }

  tienesCerca(sofia, radio) {
    return Phaser.Math.Distance.Between(sofia.x, sofia.y - 30, this.x, this.y - this.displayHeight / 2) < radio;
  }

  // ¿hay una pared o una caja pegada a ese lado?
  sinSitio(dir) {
    const b = this.body;
    const x = dir > 0 ? b.right : b.left - 4;
    const escena = this.scene;
    return escena.physics.overlapRect(x, b.y, 4, b.height - 4, true, true)
      .some((c) => c.gameObject !== this && (escena.solidos.contains(c.gameObject) || escena.cajas.contains(c.gameObject)));
  }

  haySueloDelante(dir = this.dir) {
    const x = this.x + dir * (this.body.width / 2 + 6);
    const cuerpos = this.scene.physics.overlapRect(x - 2, this.y + 2, 4, 10, false, true);
    return cuerpos.length > 0;
  }

  // Sofía ha cantado a 'distancia'
  oirCanto(t, sofia) {
    if (!this.vivo) return;
    if (this.eliminable.includes('canto')) {
      this.derrotar();
      return;
    }
    switch (this.reaccion) {
      case 'dormir':
        this.dormidoHasta = t + (this.def.dormirMs || JUEGO.canto.dormirMs || 3500);
        break;
      case 'huir':
        this.huyendoHasta = t + 1500;
        this.dir = Math.sign(this.x - sofia.x) || 1;
        break;
      case 'enfadar':
        this.enfadadoHasta = t + 4000;
        this.setTint(0xff8080);
        this.scene.time.delayedCall(4000, () => this.vivo && this.clearTint());
        this.scene.globo?.(this.x, this.y - this.displayHeight, '😠');
        break;
      case 'apartar':
        this.apartar(sofia);
        break;
      case 'invertir':
        this.scene.invertirControles?.();
        break;
      default:
        break;
    }
  }

  apartar(sofia) {
    if (this.apartado) return;
    this.apartado = true;
    this.body.enable = false;
    const lado = Math.sign(this.x - sofia.x) || 1;
    this.scene.tweens.add({ targets: this, x: this.x + lado * 30, y: this.y - 10, alpha: 0.35, duration: 700, ease: 'Back.out' });
    this.scene.globo?.(this.x, this.y - this.displayHeight, 'Uy, perdón...');
  }

  // Robar un coleccionable a Sofía (solo ladrones)
  robar(tipo) {
    this.botin = tipo;
    this.iconoBotin.setTexture(tipo === 'foto' ? 'marco-foto' : this.scene.texturaObjeto);
    const b = this.iconoBotin;
    b.setScale(tipo === 'foto' ? ESC * 0.6 : 32 / Math.max(b.width, b.height)).setVisible(true);
    Audio.efecto('robo');
  }

  soltarBotin() {
    const b = this.botin;
    this.botin = null;
    this.iconoBotin.setVisible(false);
    this.body.setVelocityX(0);
    this.dormidoHasta = this.scene.time.now + 1500;
    return b;
  }

  derrotar() {
    if (!this.vivo) return;
    this.vivo = false;
    this.derrotadoEn = this.scene.time.now;
    this.body.enable = false;
    this.zzz.setVisible(false);
    this.iconoBotin?.setVisible(false);
    this.scene.nubeDeNotas?.(this.x, this.y - this.displayHeight / 2);
    Audio.efecto('pop');
    this.scene.tweens.add({ targets: this, scale: 0, alpha: 0, angle: 180, duration: 260, onComplete: () => this.setVisible(false) });
  }

  // Vuelve a su sitio de partida como al empezar el nivel (al reaparecer Sofía en un atril)
  revivir() {
    this.scene.tweens.killTweensOf(this);
    this.vivo = true;
    this.setVisible(true).setAlpha(1).setAngle(0).setScale(ESC * (this.def.escala || 1)).clearTint();
    this.body.enable = true;
    this.body.reset(this.inicioX, this.inicioY);
    this.dir = this.def.dir === 'izq' ? -1 : 1;
    this.dormidoHasta = 0;
    this.huyendoHasta = 0;
    this.enfadadoHasta = 0;
  }
}
