// Enemigos: estorban más que atacan. Al derrotarlos desaparecen en una nube de notas.
//
// Propiedades (desde Tiled):
//   clase: patrullero | volador | bloqueador | ladron | desafinado
//   sprite: textura (pato, cochecito, mochila, mosquito, avion-papel, notificacion, profesor, examenes, urraca, metronomo, despertador)
//   velocidad, rango (tiles), amplitud (tiles, voladores), periodo (ms, voladores)
//   eliminable: lista con 'salto', 'caja', 'canto' (p.ej. "salto,caja")
//   canto: reacción al cantar cerca: dormir | huir | enfadar | apartar | invertir | nada
//   danio: velas que quita (voladores; por defecto 1)
import Phaser from 'phaser';
import { JUEGO, TILE } from '../config.js';
import { Audio } from '../audio/Audio.js';

const ESC = 0.5;

const POR_DEFECTO = {
  patrullero: { sprite: 'pato', velocidad: 70, rango: 3, eliminable: 'salto,caja', canto: 'dormir' },
  volador: { sprite: 'mosquito', velocidad: 60, rango: 3, amplitud: 1, periodo: 1800, eliminable: 'salto,canto', canto: 'huir' },
  bloqueador: { sprite: 'profesor', eliminable: '', canto: 'apartar' },
  ladron: { sprite: 'urraca', velocidad: 110, rango: 4, eliminable: '', canto: 'enfadar' },
  desafinado: { sprite: 'metronomo', velocidad: 40, rango: 2, eliminable: 'caja', canto: 'invertir' },
};

export class Enemigo extends Phaser.Physics.Arcade.Image {
  constructor(scene, o) {
    const tipo = o.p.clase || 'patrullero';
    const def = { ...POR_DEFECTO[tipo], ...o.p };
    super(scene, o.pieX, o.pieY, def.sprite);
    this.tipo = tipo;
    this.def = def;
    this.o = o;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setScale(ESC * (def.escala || 1)).setDepth(40);
    this.inicioX = o.pieX;
    this.inicioY = o.pieY;
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
    if (tipo === 'bloqueador') {
      b.setAllowGravity(false);
      b.setImmovable(true);
    }
    if (tipo === 'ladron') {
      this.botin = null;
      this.iconoBotin = scene.add.image(this.x, this.y, 'marco-foto').setScale(ESC * 0.6).setDepth(41).setVisible(false);
    }
    this.zzz = scene.add.text(this.x, this.y, 'z z z', { fontFamily: 'Georgia', fontSize: '18px', color: '#ffffff', stroke: '#1b2a4a', strokeThickness: 4 }).setDepth(42).setVisible(false);
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
    switch (this.tipo) {
      case 'patrullero':
      case 'desafinado': {
        if (b.blocked.left) this.dir = 1;
        else if (b.blocked.right) this.dir = -1;
        else if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
        else if (b.blocked.down && !this.haySueloDelante()) this.dir *= -1;
        b.setVelocityX(this.dir * this.vel * enfado);
        this.setFlipX(this.dir < 0);
        this.setAngle(Math.sin(t / 110 + this.t0) * 5);
        if (this.tipo === 'desafinado') this.setAngle(Math.sin(t / 90) * 14);
        break;
      }
      case 'volador': {
        const tt = t + this.t0;
        if (this.huyendoHasta > t) {
          b.setVelocity(Math.sign(this.x - sofia.x) * 260, -140);
        } else {
          const objetivoY = this.inicioY + Math.sin((tt / this.periodo) * Math.PI * 2) * this.amplitud;
          if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
          b.setVelocityX(this.dir * this.vel * enfado);
          b.setVelocityY((objetivoY - this.y) * 4);
        }
        this.setFlipX(b.velocity.x < 0);
        break;
      }
      case 'ladron': {
        if (this.botin) {
          // huye de Sofía, saltando si choca
          const lejos = Math.sign(this.x - sofia.x) || 1;
          b.setVelocityX(lejos * this.vel * 1.6 * enfado);
          if ((b.blocked.left || b.blocked.right || !this.haySueloDelante(lejos)) && b.blocked.down) b.setVelocityY(-620);
          this.setFlipX(lejos < 0);
          this.iconoBotin.setPosition(this.x, this.y - this.displayHeight - 8);
        } else {
          if (b.blocked.left) this.dir = 1;
          else if (b.blocked.right) this.dir = -1;
          else if (this.rango && Math.abs(this.x - this.inicioX) > this.rango) this.dir = this.x > this.inicioX ? -1 : 1;
          b.setVelocityX(this.dir * this.vel * 0.6 * enfado);
          this.setFlipX(this.dir < 0);
        }
        this.setAngle(Math.sin(t / 80) * 6);
        break;
      }
      case 'bloqueador':
        this.setAngle(Math.sin(t / 500) * 1.5);
        break;
      default:
        break;
    }
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
        this.dormidoHasta = t + (JUEGO.canto.dormirMs || 3500);
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
    this.iconoBotin.setTexture(tipo === 'foto' ? 'marco-foto' : `obj-${this.scene.spriteObjeto}`);
    this.iconoBotin.setScale(tipo === 'foto' ? ESC * 0.6 : 0.16).setVisible(true);
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
    this.body.enable = false;
    this.zzz.setVisible(false);
    this.iconoBotin?.setVisible(false);
    this.scene.nubeDeNotas?.(this.x, this.y - this.displayHeight / 2);
    Audio.efecto('pop');
    this.scene.tweens.add({ targets: this, scale: 0, alpha: 0, angle: 180, duration: 260, onComplete: () => this.setVisible(false) });
  }
}
