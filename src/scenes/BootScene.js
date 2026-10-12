// Carga los sprites SVG y los datos comunes. Los niveles se cargan aparte, uno a uno.
import Phaser from 'phaser';
import { OBJETOS } from '../config.js';
import { ESCALA_TEXTURAS, claveFotogramas } from '../entities/Sofia.js';
import { PISTAS } from '../audio/musica.js';
import { Guardado } from '../systems/Guardado.js';

const ETAPAS_MIRIAM = ['nina', 'preado', 'adolescente', 'adulta'];
const ENEMIGOS = ['pato', 'cochecito', 'mochila', 'mosquito', 'avion-papel', 'notificacion', 'profesor', 'examenes', 'urraca', 'metronomo', 'despertador'];
// Cosas que caen en las zonas de lluvia (texturas 'obj-*' de los niveles); no son los coleccionables
const LLUVIA = ['patito', 'sonajero', 'ceras', 'cubo', 'boligrafo', 'agenda'];
const ESCENARIO = ['vela-on', 'vela-off', 'vela-cuerpo', 'atril-off', 'atril-on', 'caja-juguete', 'caja-madera', 'caja-carton', 'caja-libros', 'mueble', 'pinchos', 'marco-foto', 'nota-azul', 'nota-dorada', 'nota-rosa', 'nota-verde', 'campana', 'meta', 'puerta', 'tarta', 'cartel-continuara', 'candado', 'icono-foto', 'icono-objeto', 'clave', 'boton-izq', 'boton-der', 'boton-saltar', 'boton-cantar', 'boton-pausa'];

// [clave de textura y animación, datos] de cada animación del índice de fotogramas
function animacionesFotogramas(indice) {
  const lista = [];
  for (const [etapa, modos] of Object.entries(indice || {})) {
    if (etapa.startsWith('_')) continue;
    for (const [modo, m] of Object.entries(modos)) {
      for (const [anim, a] of Object.entries(m.animaciones)) lista.push([claveFotogramas(etapa, modo, anim), { ...a, ancho: m.ancho, alto: m.alto }]);
    }
  }
  return lista;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { width: W, height: H } = this.scale;
    const barra = this.add.graphics();
    const texto = this.add.text(W / 2, H / 2 - 50, 'Cargando...', { fontFamily: 'Georgia', fontSize: '30px', color: '#ffffff' }).setOrigin(0.5);
    this.load.on('progress', (p) => {
      barra.clear();
      barra.fillStyle(0x1e4fa3, 1).fillRoundedRect(W / 2 - 250, H / 2, 500, 24, 12);
      barra.fillStyle(0xe8b84a, 1).fillRoundedRect(W / 2 - 248, H / 2 + 2, Math.max(20, 496 * p), 20, 10);
    });
    this.load.on('complete', () => texto.destroy());

    const S = { scale: ESCALA_TEXTURAS };
    this.load.json('rig-sofia', 'sprites/sofia/rig.json');
    this.load.json('rig-miriam', 'sprites/miriam/rig.json');
    this.load.json('indice-musica', 'music/indice.json');
    this.load.once('filecomplete-json-rig-sofia', (k, t, rig) => {
      // el bebé no tiene piezas: va solo con fotogramas de vídeo
      for (const e of Object.keys(rig.etapas)) {
        for (const pieza of Object.keys(rig.etapas[e].piezas)) this.load.svg(`sofia-${e}-${pieza}`, `sprites/sofia/${e}/${pieza}.svg`, S);
      }
    });
    // Animaciones sacadas de los vídeos (tools/video-a-sprites.mjs); las etapas sin vídeo se dibujan con el SVG por piezas
    this.load.json('fotogramas-sofia', 'sprites/sofia/fotogramas.json');
    this.load.once('filecomplete-json-fotogramas-sofia', (k, t, indice) => {
      for (const [clave, info] of animacionesFotogramas(indice)) {
        this.load.spritesheet(clave, `sprites/sofia/${info.archivo}`, { frameWidth: info.ancho, frameHeight: info.alto });
      }
    });
    for (const e of ETAPAS_MIRIAM) this.load.svg(`miriam-${e}`, `sprites/miriam/${e}/cuerpo.svg`, S);
    for (const n of ENEMIGOS) this.load.svg(n, `sprites/enemigos/${n}.svg`, S);
    for (const n of ESCENARIO) this.load.svg(n, `sprites/escenario/${n}.svg`, S);
    for (const o of OBJETOS.objetos) this.load.image(`obj-${o.sprite}`, `sprites/objetos/${o.sprite}.png`);
    for (const n of LLUVIA) this.load.svg(`obj-${n}`, `sprites/objetos/${n}.svg`, S);
    // Música: si existen JSON convertidos de MIDI (tools/midi-a-json.mjs) se usan en lugar de los provisionales
    this.load.once('filecomplete-json-indice-musica', (k, t, indice) => {
      for (const clave of indice.pistas || []) this.load.json(`musica-${clave}`, `music/${clave}.json`);
    });
  }

  create() {
    const indice = this.cache.json.get('indice-musica');
    for (const clave of indice?.pistas || []) {
      const p = this.cache.json.get(`musica-${clave}`);
      if (p) PISTAS[clave] = p;
    }
    for (const [clave, info] of animacionesFotogramas(this.cache.json.get('fotogramas-sofia'))) {
      if (!this.textures.exists(clave) || this.anims.exists(clave)) continue;
      this.anims.create({
        key: clave,
        frames: this.anims.generateFrameNumbers(clave, { start: 0, end: info.fotogramas - 1 }),
        frameRate: info.fps,
        repeat: info.bucle ? -1 : 0,
      });
    }
    // Partícula redonda para efectos
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1).fillCircle(8, 8, 8);
    g.generateTexture('punto', 16, 16);
    g.destroy();

    const params = new URLSearchParams(window.location.search);
    if (params.has('trucos')) Guardado.desbloquearTodo();
    if (params.has('nivel')) {
      this.scene.start('Transicion', { nivel: Number(params.get('nivel')) || 0 });
      return;
    }
    if (params.has('poses')) {
      this.scene.start('Poses');
      return;
    }
    if (params.has('tarta')) {
      this.scene.start('Tarta', {});
      return;
    }
    this.scene.start('Menu');
  }
}
