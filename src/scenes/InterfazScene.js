// Interfaz encima del juego: velas, coleccionables, avisos, pausa y controles táctiles.
import Phaser from 'phaser';
import { JUEGO, texto } from '../config.js';
import { Controles } from '../systems/Controles.js';
import { FUENTE, FUENTE_TITULO } from '../estilo.js';
import { Audio } from '../audio/Audio.js';
import { Boton } from '../ui/Boton.js';

const ESC = 0.5;

export class InterfazScene extends Phaser.Scene {
  constructor() {
    super('Interfaz');
  }

  init(data) {
    this.juego = data.juego;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.input.addPointer(3);
    this.raiz = this.add.container(0, 0);
    this.crearVelas();
    // coleccionables del intento (aparecen al cogerlos)
    this.iconoFoto = this.add.image(0, 0, 'icono-foto').setScale(0.8).setVisible(false);
    this.iconoObjeto = this.add.image(0, 0, 'icono-objeto').setScale(0.8).setVisible(false);
    // pausa
    this.botonPausa = this.add.image(W - 52, 52, 'boton-pausa').setScale(ESC * 1.1).setAlpha(0.8).setInteractive();
    this.botonPausa.on('pointerup', () => {
      Audio.iniciar();
      this.juego.pausar();
    });
    this.crearControles();
    // avisos
    this.aviso = this.add.text(W / 2, H * 0.2, '', { fontFamily: FUENTE, fontSize: '34px', color: '#ffffff', fontStyle: 'bold', stroke: '#0d1b3d', strokeThickness: 7, align: 'center', wordWrap: { width: W * 0.7 } }).setOrigin(0.5).setAlpha(0);

    const ev = this.juego.events;
    ev.on('velas', this.alCambiarVelas, this);
    ev.on('aviso', this.mostrarAviso, this);
    ev.on('completado', this.alCompletar, this);
    ev.on('final', this.alFinal, this);
    this.events.once('shutdown', () => {
      ev.off('velas', this.alCambiarVelas, this);
      ev.off('aviso', this.mostrarAviso, this);
      ev.off('completado', this.alCompletar, this);
      ev.off('final', this.alFinal, this);
      Controles.soltarTodo();
    });
  }

  // ---- Velas ------------------------------------------------------------------------
  crearVelas() {
    const total = this.juego.velasTotal;
    this.velas = [];
    if (total === Infinity) {
      this.velas.push(this.add.image(36, 44, 'vela-on').setScale(ESC * 1.1));
      this.add.text(62, 44, '∞', { fontFamily: FUENTE_TITULO, fontSize: '40px', color: '#ffd23f', stroke: '#0d1b3d', strokeThickness: 5 }).setOrigin(0, 0.5);
      this.finVelas = { x: 122, y: 44 };
      return;
    }
    // más de 10 velas: dos filas
    const porFila = total > 10 ? Math.ceil(total / 2) : total;
    for (let i = 0; i < total; i++) {
      const fila = Math.floor(i / porFila);
      const col = i % porFila;
      this.velas.push(this.add.image(30 + col * 26, 38 + fila * 44, 'vela-on').setScale(ESC * 0.95));
    }
    this.finVelas = { x: 40 + porFila * 26, y: 44 };
  }

  alCambiarVelas(actual, antes) {
    // al volver a un atril se reencienden las velas que se tenían al activarlo
    for (let i = antes; i < actual; i++) {
      const v = this.velas[i];
      if (!v) continue;
      this.time.delayedCall((i - antes) * 120, () => {
        v.setTexture('vela-on');
        this.tweens.add({ targets: v, scaleX: ESC * 1.3, scaleY: ESC * 1.3, duration: 120, yoyo: true });
      });
    }
    for (let i = actual; i < antes; i++) {
      const v = this.velas[i];
      if (!v) continue;
      this.time.delayedCall((i - actual) * 220, () => {
        v.setTexture('vela-off');
        this.tweens.add({ targets: v, scaleX: ESC * 1.3, scaleY: ESC * 1.3, duration: 120, yoyo: true });
        const humo = this.add.image(v.x, v.y - 20, 'punto').setTint(0xcfd8ee).setAlpha(0.7);
        this.tweens.add({ targets: humo, y: humo.y - 30, alpha: 0, scale: 2.5, duration: 700, onComplete: () => humo.destroy() });
      });
    }
  }

  // ---- Controles táctiles -----------------------------------------------------------
  crearControles() {
    const { width: W, height: H } = this.scale;
    const c = JUEGO.controles;
    const tam = c.tamBoton;
    const op = c.opacidadBotones;
    const sc = tam / 128;
    const m = 24;
    this.botones = {
      izq: this.add.image(m + tam / 2, H - m - tam / 2, 'boton-izq').setScale(sc).setAlpha(op),
      der: this.add.image(m + tam * 1.5 + 22, H - m - tam / 2, 'boton-der').setScale(sc).setAlpha(op),
      saltar: this.add.image(W - m - tam * 0.6, H - m - tam * 0.6, 'boton-saltar').setScale(sc * 1.2).setAlpha(op),
    };
    if (this.juego.sofia.habilidades.cantar) {
      this.botones.cantar = this.add.image(W - m - tam * 1.9, H - m - tam * 0.45, 'boton-cantar').setScale(sc).setAlpha(op);
      this.recarga = this.add.graphics();
    }
    // Zonas táctiles algo más grandes que los botones dibujados
    this.zonasTactiles = {
      dpad: new Phaser.Geom.Rectangle(0, H - tam * 2.1, tam * 2.6 + 40, tam * 2.1),
      saltar: new Phaser.Geom.Circle(this.botones.saltar.x, this.botones.saltar.y, tam * 0.8),
      cantar: this.botones.cantar ? new Phaser.Geom.Circle(this.botones.cantar.x, this.botones.cantar.y, tam * 0.65) : null,
    };
    this.esTactil = this.sys.game.device.input.touch;
    if (!this.esTactil) for (const b of Object.values(this.botones)) b.setAlpha(op * 0.5);
  }

  leerToques() {
    const tactil = { izq: false, der: false, saltar: false, cantar: false };
    const z = this.zonasTactiles;
    const centroDpad = this.botones.izq.x + (this.botones.der.x - this.botones.izq.x) / 2;
    for (const p of this.input.manager.pointers) {
      if (!p.isDown || p.wasCanceled) continue;
      // ratón en escritorio: solo cuenta si se hace clic sobre un botón
      const x = p.x;
      const y = p.y;
      if (z.dpad.contains(x, y)) {
        if (x < centroDpad) tactil.izq = true;
        else tactil.der = true;
      } else if (z.saltar.contains(x, y)) tactil.saltar = true;
      else if (z.cantar && z.cantar.contains(x, y)) tactil.cantar = true;
    }
    Controles._tactil = tactil;
    const op = JUEGO.controles.opacidadBotones;
    for (const [k, b] of Object.entries(this.botones)) {
      const activo = tactil[k];
      b.setAlpha(activo ? Math.min(1, op + 0.35) : this.esTactil ? op : op * 0.5);
    }
  }

  // ---- Avisos y fin -------------------------------------------------------------------
  mostrarAviso(contenido, duracion = 2000) {
    this.aviso.setText(contenido);
    this.tweens.killTweensOf(this.aviso);
    this.aviso.setAlpha(0).setScale(0.8);
    this.tweens.add({ targets: this.aviso, alpha: 1, scale: 1, duration: 220, ease: 'Back.out' });
    this.tweens.add({ targets: this.aviso, alpha: 0, delay: duracion, duration: 400 });
  }

  alCompletar({ foto, objeto }) {
    const { width: W, height: H } = this.scale;
    const t = this.add.text(W / 2, H * 0.35, texto('juego.nivelCompletado'), { fontFamily: FUENTE_TITULO, fontSize: '64px', color: '#ffd23f', fontStyle: 'bold italic', stroke: '#0d1b3d', strokeThickness: 8 }).setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: t, scale: 1, duration: 500, ease: 'Back.out' });
    const fila = this.add.container(W / 2, H * 0.5);
    const f = this.add.image(-50, 0, 'icono-foto').setScale(1.5).setAlpha(foto ? 1 : 0.2);
    const o = this.add.image(50, 0, 'icono-objeto').setScale(1.5).setAlpha(objeto ? 1 : 0.2);
    fila.add([f, o]);
    fila.setAlpha(0);
    this.tweens.add({ targets: fila, alpha: 1, delay: 500, duration: 400 });
    for (const b of Object.values(this.botones)) b.setVisible(false);
  }

  alFinal() {
    // En el camino blanco solo queda el suelo: se ocultan velas y coleccionables
    const cosas = [...this.velas, this.iconoFoto, this.iconoObjeto, ...this.children.list.filter((c) => c.type === 'Text' && c !== this.aviso)];
    this.tweens.add({ targets: cosas, alpha: 0, duration: 2500 });
    if (this.botones.cantar) this.botones.cantar.setVisible(false);
    this.recarga?.clear();
    this.sinCanto = true;
  }

  update() {
    if (!this.juego || !this.juego.sys.isActive()) {
      Controles._tactil = { izq: false, der: false, saltar: false, cantar: false };
      return;
    }
    this.leerToques();
    const j = this.juego;
    // coleccionables cogidos en este intento
    let x = this.finVelas.x + 20;
    this.iconoFoto.setVisible(j.tieneFoto && !j.enFinal).setPosition(x, this.finVelas.y);
    if (j.tieneFoto) x += 46;
    this.iconoObjeto.setVisible(j.tieneObjeto && !j.enFinal).setPosition(x, this.finVelas.y);
    // recarga del canto alrededor del botón
    if (this.recarga && !this.sinCanto) {
      const r = j.sofia.recargaCanto(j.time.now);
      const b = this.botones.cantar;
      this.recarga.clear();
      if (r < 1) {
        this.recarga.lineStyle(6, 0xffd23f, 0.9);
        this.recarga.beginPath();
        this.recarga.arc(b.x, b.y, JUEGO.controles.tamBoton * 0.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * r);
        this.recarga.strokePath();
      }
    }
  }
}

// ---- Pausa -----------------------------------------------------------------------------

export class PausaScene extends Phaser.Scene {
  constructor() {
    super('Pausa');
  }

  init(data) {
    this.nivel = data.nivel;
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.add.rectangle(0, 0, W, H, 0x0d1b3d, 0.7).setOrigin(0).setInteractive();
    this.add.text(W / 2, H * 0.2, texto('pausa.titulo'), { fontFamily: FUENTE_TITULO, fontSize: '60px', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5);
    new Boton(this, W / 2, H * 0.4, texto('pausa.reanudar'), () => this.salir(() => {
      this.scene.resume('Juego');
      this.scene.stop();
    }), { ancho: 420, color: 0xe8b84a, borde: 0xffffff });
    new Boton(this, W / 2, H * 0.4 + 96, texto('pausa.reiniciar'), () => this.salir(() => {
      this.scene.stop('Juego');
      this.scene.start('Juego', { nivel: this.nivel });
    }), { ancho: 420 });
    new Boton(this, W / 2, H * 0.4 + 192, texto('pausa.menu'), () => this.salir(() => {
      this.scene.stop('Juego');
      this.scene.start('Menu');
    }), { ancho: 420 });
    Audio.ctx?.suspend();
  }

  salir(accion) {
    Audio.ctx?.resume();
    accion();
  }
}
