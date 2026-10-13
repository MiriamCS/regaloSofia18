// Interfaz encima del juego: velas, coleccionables, avisos, pausa y controles táctiles.
import Phaser from 'phaser';
import { JUEGO, FOTOS, OBJETOS, texto } from '../config.js';
import { Controles } from '../systems/Controles.js';
import { FUENTE, FUENTE_TITULO, COLOR, HEX, ajustarTam } from '../estilo.js';
import { Audio } from '../audio/Audio.js';
import { Boton } from '../ui/Boton.js';

const ESC = 0.5;
const TAM_ICONO = 40; // px en pantalla de los coleccionables junto a las velas

// Coleccionable conseguido a color o, si falta, solo su silueta
function marcarConseguido(img, tiene) {
  if (tiene) img.clearTint().setAlpha(1);
  else img.setTintFill(0x0d1b3d).setAlpha(0.45);
  return img;
}

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
    // coleccionables del intento: siluetas que se colorean al cogerlos
    const x = this.finVelas.x + TAM_ICONO / 2;
    this.iconoFoto = ajustarTam(this.add.image(x, this.finVelas.y, 'marco-foto'), TAM_ICONO);
    this.iconoObjeto = ajustarTam(this.add.image(x + TAM_ICONO + 8, this.finVelas.y, 'icono-objeto'), TAM_ICONO);
    marcarConseguido(this.iconoFoto, false);
    marcarConseguido(this.iconoObjeto, false);
    this.teniaFoto = this.teniaObjeto = false;
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

  alCambiarColeccionable(img, tiene) {
    marcarConseguido(img, tiene);
    const base = TAM_ICONO / Math.max(img.width, img.height);
    this.tweens.killTweensOf(img);
    img.setScale(base);
    this.tweens.add({ targets: img, scale: base * 1.4, duration: 140, yoyo: true });
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

  // Al completar el nivel: ventana con la foto y el objeto del año (lo que falte, en silueta)
  alCompletar({ nivel, foto, objeto }) {
    for (const b of Object.values(this.botones)) b.setVisible(false);
    this.botonPausa.setVisible(false).disableInteractive();
    this.recarga?.clear();
    this.sinCanto = true;
    const datosFoto = FOTOS.fotos.find((f) => f.nivel === nivel);
    const claveFoto = `foto-${nivel}`; // la misma clave que el álbum
    const mostrar = () => this.mostrarResumen({ nivel, foto, objeto, datosFoto, claveFoto });
    // un momento para ver a Sofía celebrar; mientras, se carga la foto si se ha conseguido
    this.time.delayedCall(900, () => {
      if (foto && datosFoto?.archivo && !this.textures.exists(claveFoto)) {
        this.load.image(claveFoto, datosFoto.archivo);
        this.load.once('complete', mostrar);
        this.load.start();
      } else mostrar();
    });
  }

  mostrarResumen({ nivel, foto, objeto, datosFoto, claveFoto }) {
    const { width: W, height: H } = this.scale;
    const pw = Math.min(840, W - 60);
    const ph = 540;
    this.add.rectangle(0, 0, W, H, 0x0d1b3d, 0.6).setOrigin(0).setInteractive();
    const v = this.add.container(W / 2, H / 2);
    const panel = this.add.graphics();
    panel.fillStyle(0xfffaf0, 1).fillRoundedRect(-pw / 2, -ph / 2, pw, ph, 24);
    panel.lineStyle(5, 0xe8b84a, 1).strokeRoundedRect(-pw / 2, -ph / 2, pw, ph, 24);
    v.add(panel);
    v.add(this.add.text(0, -ph / 2 + 56, texto('juego.nivelCompletado'), { fontFamily: FUENTE_TITULO, fontSize: '52px', color: '#1e4fa3', fontStyle: 'bold' }).setOrigin(0.5));

    // el nivel 18 no tiene foto: solo se enseña el objeto
    const xObjeto = datosFoto ? pw / 4 : 0;
    const yCentro = -20;
    const yEtiqueta = 140;
    const etiqueta = (x, txt, tiene) => this.add.text(x, yEtiqueta, txt, { fontFamily: FUENTE, fontSize: '26px', color: tiene ? '#1e4fa3' : '#8c95ab', fontStyle: 'bold', align: 'center', wordWrap: { width: pw / 2 - 40 } }).setOrigin(0.5, 0);
    if (datosFoto) {
      const x = -pw / 4;
      let fw = 260;
      let fh = 195;
      const marco = 12;
      const polaroid = this.add.container(x, yCentro).setAngle(-3);
      const papel = this.add.graphics();
      if (foto) {
        // la foto se ve entera y el marco toma sus proporciones, sin pasar de 300×250
        const img = this.textures.exists(claveFoto) ? this.add.image(0, 0, claveFoto) : null;
        if (img) {
          img.setScale(Math.min(300 / img.width, 250 / img.height));
          fw = img.displayWidth;
          fh = img.displayHeight;
        }
        papel.fillStyle(0xffffff, 1).fillRect(-fw / 2 - marco, -fh / 2 - marco, fw + marco * 2, fh + marco * 2);
        papel.lineStyle(2, 0xd5dbe8, 1).strokeRect(-fw / 2 - marco, -fh / 2 - marco, fw + marco * 2, fh + marco * 2);
        polaroid.add(papel);
        if (img) polaroid.add(img);
        else polaroid.add(ajustarTam(this.add.image(0, 0, 'marco-foto'), 150));
      } else {
        // silueta de la foto
        papel.fillStyle(0x0d1b3d, 0.45).fillRect(-fw / 2 - marco, -fh / 2 - marco, fw + marco * 2, fh + marco * 2);
        polaroid.add(papel);
        polaroid.add(this.add.text(0, 0, '?', { fontFamily: FUENTE_TITULO, fontSize: '80px', color: '#fffaf0', fontStyle: 'bold' }).setOrigin(0.5).setAlpha(0.8));
      }
      v.add(polaroid);
      v.add(etiqueta(x, foto ? texto('juego.fotoConseguida') : texto('juego.fotoNoEncontrada'), foto));
    }
    const datosObjeto = OBJETOS.objetos.find((o) => o.nivel === nivel);
    const img = marcarConseguido(ajustarTam(this.add.image(xObjeto, yCentro, this.juego.texturaObjeto), 210), objeto);
    v.add(img);
    if (objeto) this.tweens.add({ targets: img, angle: { from: -5, to: 5 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    v.add(etiqueta(xObjeto, objeto ? datosObjeto?.nombre || texto('juego.objetoConseguido') : texto('juego.objetoNoEncontrado'), objeto));

    let pulsado = false;
    const continuar = () => {
      if (pulsado) return;
      pulsado = true;
      this.juego.continuarTrasNivel();
    };
    v.add(new Boton(this, 0, ph / 2 - 56,texto('juego.continuar'), continuar, { ancho: 320, alto: 68, color: HEX.amarillo, colorTexto: COLOR.tinta }));
    // en el ordenador también con Intro o Espacio (tras un momento, para no saltarla sin querer)
    this.time.delayedCall(700, () => {
      this.input.keyboard?.once('keydown-ENTER', continuar);
      this.input.keyboard?.once('keydown-SPACE', continuar);
    });

    v.setScale(0.7).setAlpha(0);
    this.tweens.add({ targets: v, scale: 1, alpha: 1, duration: 320, ease: 'Back.out' });
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
    // coleccionables cogidos en este intento (un enemigo puede robarlos y vuelven a silueta)
    if (j.tieneFoto !== this.teniaFoto) {
      this.teniaFoto = j.tieneFoto;
      this.alCambiarColeccionable(this.iconoFoto, j.tieneFoto);
    }
    if (j.tieneObjeto !== this.teniaObjeto) {
      this.teniaObjeto = j.tieneObjeto;
      this.alCambiarColeccionable(this.iconoObjeto, j.tieneObjeto);
    }
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
    this.add.text(W / 2, H * 0.2, texto('pausa.titulo'), { fontFamily: FUENTE_TITULO, fontSize: '60px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    new Boton(this, W / 2, H * 0.4, texto('pausa.reanudar'), () => this.salir(() => {
      this.scene.resume('Juego');
      this.scene.stop();
    }), { ancho: 420, color: HEX.amarillo, colorTexto: COLOR.tinta });
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
