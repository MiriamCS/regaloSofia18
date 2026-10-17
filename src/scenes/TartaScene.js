// La tarta: 18 velas que se apagan deslizando el dedo, confeti de notas y el mensaje de Miriam.
import Phaser from 'phaser';
import { JUEGO, MENSAJE_FINAL, texto } from '../config.js';
import { Audio } from '../audio/Audio.js';
import { PISTAS } from '../audio/musica.js';
import { Guardado } from '../systems/Guardado.js';
import { Sofia } from '../entities/Sofia.js';
import { Boton } from '../ui/Boton.js';
import { FUENTE, FUENTE_TITULO, COLOR, HEX } from '../estilo.js';
import { pieMarca } from '../ui/Marca.js';

const NUM_VELAS = 18;
// Superficie de arriba de la tarta, en px del lienzo de tarta.svg (480x340): las velas se reparten
// en dos filas (la de atrás y la de delante) sobre esta elipse. Si cambia el dibujo, hay que ajustarla.
const SUPERFICIE = { x: 240, y: 60, filaAtras: { rx: 100, ry: 10, dy: -6 }, filaDelante: { rx: 114, ry: 14, dy: 10 } };

// Escala de la tarta en esta escena; la de las velas y las llamas va en proporción
const ESCALA_TARTA = 0.72;

export function crearTexturaLlama(scene) {
  if (scene.textures.exists('llama')) return;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  g.fillStyle(0xffe08a, 0.35).fillCircle(20, 26, 18);
  g.fillStyle(0xffb300, 1).fillEllipse(20, 30, 16, 28);
  g.fillStyle(0xfff3b0, 1).fillEllipse(20, 34, 8, 14);
  g.generateTexture('llama', 40, 46);
  g.destroy();
}

// Pone las 18 velas encendidas en dos filas sobre una imagen 'tarta' (origen abajo en el centro). La usan esta
// escena y el final del nivel 18, para que la tarta tenga sus velas desde que aparece en el camino.
export function velasSobreTarta(scene, tarta) {
  crearTexturaLlama(scene);
  const k = tarta.scaleX / ESCALA_TARTA;
  const tw = tarta.displayWidth;
  const th = tarta.displayHeight;
  const ox = tarta.x - tw / 2;
  const oy = tarta.y - th;
  const svgAPantalla = (sx, sy) => ({ x: ox + (sx / 480) * tw, y: oy + (sy / 340) * th });
  const velas = [];
  for (let i = 0; i < NUM_VELAS; i++) {
    const fila = i < 9 ? 0 : 1;
    const j = fila === 0 ? i : i - 9;
    const a = Math.PI * (0.12 + (j / 8) * 0.76);
    const f = fila === 0 ? SUPERFICIE.filaAtras : SUPERFICIE.filaDelante;
    const sx = SUPERFICIE.x - Math.cos(a) * f.rx;
    const sy = SUPERFICIE.y + f.dy + (fila === 0 ? -1 : 1) * Math.sin(a) * f.ry;
    const p = svgAPantalla(sx, sy);
    const cuerpo = scene.add.image(p.x, p.y + 4 * k, 'vela-cuerpo').setOrigin(0.5, 1).setScale(0.62 * k).setDepth(tarta.depth + (fila === 0 ? 1 : 3));
    const yLlama = p.y + (4 + 6) * k - cuerpo.displayHeight;
    const llama = scene.add.image(p.x, yLlama, 'llama').setOrigin(0.5, 1).setScale(k).setDepth(tarta.depth + (fila === 0 ? 2 : 4));
    scene.tweens.add({ targets: llama, scaleX: { from: 0.9 * k, to: 1.1 * k }, scaleY: { from: 1.05 * k, to: 0.9 * k }, duration: 120 + Math.random() * 120, yoyo: true, repeat: -1 });
    velas.push({ cuerpo, llama, x: p.x, y: yLlama - 14 * k, encendida: true });
  }
  return velas;
}

function distanciaASegmento(p, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Phaser.Math.Clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, 0, 1);
  return Phaser.Math.Distance.Between(p.x, p.y, a.x + t * dx, a.y + t * dy);
}

export class TartaScene extends Phaser.Scene {
  constructor() {
    super('Tarta');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.cameras.main.setBackgroundColor('#ffffff');
    this.cameras.main.fadeIn(900, 255, 255, 255);
    Audio.pararMusica();
    // la corona de M. Llorens como pie (versión para fondo claro), por encima del velo del mensaje final
    pieMarca(this, true).setDepth(60);

    // suelo blanco del camino
    const g = this.add.graphics();
    g.fillStyle(0xf2f4f8, 1).fillRect(0, H * 0.9, W, H * 0.1);
    g.lineStyle(3, 0xd5dbe8, 1).lineBetween(0, H * 0.9, W, H * 0.9);

    // tarta grande (la cámara "se ha acercado"), ya con sus velas encendidas
    this.tarta = this.add.image(W * 0.56, H * 0.9 + 4, 'tarta').setOrigin(0.5, 1).setScale(ESCALA_TARTA);
    this.velas = velasSobreTarta(this, this.tarta);

    // Sofía adulta al lado de la tarta
    this.sofia = new Sofia(this, W * 0.2, H * 0.9, 'adulta', {});
    this.sofia.body.enable = false;
    // del mismo tamaño que al llegar por el camino blanco, en el que ha ido creciendo hasta la altura de las velas
    this.sofia.setScale(2.2 * (JUEGO.final.crecerSofia || 1));
    this.sofia.mirando = 1;

    this.instruccion = this.add.text(W / 2, H * 0.09, texto('final.soplar'), { fontFamily: FUENTE, fontSize: '30px', color: '#1e4fa3', fontStyle: 'bold' }).setOrigin(0.5);
    this.tweens.add({ targets: this.instruccion, alpha: 0.4, duration: 900, yoyo: true, repeat: -1 });

    this.apagadas = 0;
    this.terminado = false;
    this.input.on('pointerdown', (p) => {
      Audio.iniciar();
      this.anterior = { x: p.x, y: p.y };
    });
    this.input.on('pointermove', (p) => {
      if (!p.isDown || this.terminado) return;
      const prev = this.anterior || { x: p.x, y: p.y };
      this.soplar(prev, { x: p.x, y: p.y });
      this.anterior = { x: p.x, y: p.y };
    });
    this.input.on('pointerup', () => (this.anterior = null));
  }

  soplar(a, b) {
    const t = this.time.now;
    this.soplandoHasta = t + 250;
    // ráfaga de aire por donde pasa el dedo
    if (Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y) > 4) {
      const dir = Math.atan2(b.y - a.y, b.x - a.x);
      for (let i = 0; i < 2; i++) {
        const r = this.add.image(b.x, b.y, 'punto').setTint(0xcfe0ff).setAlpha(0.6).setScale(0.6 + Math.random());
        this.tweens.add({ targets: r, x: b.x + Math.cos(dir) * 60 + Math.random() * 20, y: b.y + Math.sin(dir) * 60 + Math.random() * 20, alpha: 0, scale: 0.2, duration: 420, onComplete: () => r.destroy() });
      }
      if (Math.random() < 0.15) Audio.efecto('soplo');
    }
    for (const v of this.velas) {
      if (v.encendida && distanciaASegmento(v, a, b) < 34) this.apagar(v);
    }
  }

  apagar(v) {
    v.encendida = false;
    this.tweens.killTweensOf(v.llama);
    this.tweens.add({ targets: v.llama, scaleY: 0, alpha: 0, duration: 160 });
    const humo = this.add.image(v.x, v.y, 'punto').setTint(0xb8c4da).setAlpha(0.7).setDepth(5);
    this.tweens.add({ targets: humo, y: v.y - 60, x: v.x + 10, alpha: 0, scale: 3, duration: 1100, onComplete: () => humo.destroy() });
    Audio.efecto('vela');
    this.apagadas++;
    if (this.apagadas >= NUM_VELAS) this.time.delayedCall(500, () => this.celebrar());
  }

  celebrar() {
    if (this.terminado) return;
    this.terminado = true;
    const { width: W, height: H } = this.scale;
    this.instruccion.destroy();
    Guardado.marcarTartaVista();
    Audio.tocarMusica(PISTAS.tarta, { bucle: false });
    this.sofia.estadoForzado = 'celebrar';
    // confeti de notas musicales
    const texturas = ['nota-azul', 'nota-dorada', 'nota-rosa', 'nota-verde'];
    const lluvia = this.time.addEvent({
      delay: 60,
      repeat: 120,
      callback: () => {
        const n = this.add.image(Math.random() * W, -30, texturas[Math.floor(Math.random() * 4)]).setScale(0.4 + Math.random() * 0.5).setDepth(20);
        this.tweens.add({ targets: n, y: H + 40, x: n.x + (Math.random() - 0.5) * 200, angle: (Math.random() - 0.5) * 540, duration: 2600 + Math.random() * 1800, onComplete: () => n.destroy() });
      },
    });
    void lluvia;
    this.time.delayedCall(2600, () => this.mensaje());
  }

  mensaje() {
    const { width: W, height: H } = this.scale;
    const capa = this.add.container(0, 0).setDepth(50).setAlpha(0);
    const velo = this.add.rectangle(0, 0, W, H, HEX.tinta, 0.55).setOrigin(0);
    const pw = Math.min(980, W - 80);
    const ph = H - 80;
    const panel = this.add.graphics();
    panel.fillStyle(HEX.papel, 1).fillRoundedRect(W / 2 - pw / 2, 40, pw, ph, 28);
    panel.lineStyle(6, HEX.amarillo, 1).strokeRoundedRect(W / 2 - pw / 2, 40, pw, ph, 28);
    const tit = this.add.text(W / 2, 100, texto('final.felicidades'), { fontFamily: FUENTE_TITULO, fontSize: '50px', color: COLOR.real, fontStyle: 'bold' }).setOrigin(0.5);
    const zonaTexto = { x: W / 2 - pw / 2 + 50, y: 160, w: pw - 100, h: ph - 230 };
    const cuerpo = this.add.text(W / 2, zonaTexto.y, MENSAJE_FINAL.trim(), { fontFamily: FUENTE, fontSize: '26px', color: COLOR.tinta, align: 'center', lineSpacing: 8, wordWrap: { width: zonaTexto.w } }).setOrigin(0.5, 0);
    const mascara = this.make.graphics({}, false).fillRect(zonaTexto.x, zonaTexto.y, zonaTexto.w, zonaTexto.h);
    cuerpo.setMask(mascara.createGeometryMask());
    capa.add([velo, panel, tit, cuerpo]);
    // si el mensaje es largo se puede deslizar
    const sobra = Math.max(0, cuerpo.height - zonaTexto.h);
    if (sobra > 0) {
      let y0 = null;
      this.input.on('pointerdown', (p) => (y0 = p.y));
      this.input.on('pointermove', (p) => {
        if (!p.isDown || y0 === null) return;
        cuerpo.y = Phaser.Math.Clamp(cuerpo.y + (p.y - y0), zonaTexto.y - sobra, zonaTexto.y);
        y0 = p.y;
      });
      this.input.on('wheel', (p, o, dx, dy) => (cuerpo.y = Phaser.Math.Clamp(cuerpo.y - dy, zonaTexto.y - sobra, zonaTexto.y)));
    }
    const volver = new Boton(this, W / 2, 40 + ph - 45, texto('opciones.creditos'), () => this.scene.start('Creditos', { destino: 'Menu' }), { ancho: 380, alto: 64, tam: 26, color: HEX.real, colorTexto: COLOR.blanco });
    capa.add(volver);
    this.tweens.add({ targets: capa, alpha: 1, duration: 900 });
  }

  update(t, d) {
    if (!this.terminado) this.sofia.estadoForzado = t < (this.soplandoHasta || 0) ? 'soplar' : 'reposo';
    this.sofia.animar(t, d / 1000, true, 0);
  }
}
