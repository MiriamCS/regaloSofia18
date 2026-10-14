// Carga los sprites SVG y los datos comunes. Los niveles se cargan aparte, uno a uno.
import Phaser from 'phaser';
import { OBJETOS, ENEMIGOS, claveObjeto } from '../config.js';
import { ESCALA_TEXTURAS, claveFotogramas } from '../entities/Sofia.js';
import { PISTAS } from '../audio/musica.js';
import { Guardado } from '../systems/Guardado.js';
import { HEX } from '../estilo.js';
import { ANCHO_CORONA, FUNDIDO, RGB_TINTA, corona, joyaSaltarina } from '../ui/Marca.js';
import { svgVela } from '../ui/velaSvg.js';

// Iconos de línea de los menús (blancos, se tiñen al usarlos): textura 'ic-<nombre>'
export const ICONOS = ['play', 'niveles', 'albumes', 'controles', 'ajustes', 'volver', 'tarta'];

// Velas de la pantalla de Niveles: cuerpo y mecha dibujados a la altura de cada año (las rayas se repiten, no se
// estiran) y sin márgenes a los lados. La llama es la de vela-on.svg.
export const ANCHO_VELA = 16;
export const altoVela = (n) => 120 + n * 12;
export const claveVela = (n) => `vela-alto-${n}`;
const VELAS_NIVELES = 19;
// Edades de Miriam dibujadas en SVG (la niña va con los fotogramas de su vídeo)
const ETAPAS_MIRIAM = ['preado', 'adolescente', 'adulta'];
const PERSONAJES_VIDEO = ['sofia', 'miriam'];
// Sofía de frente, recortada de su hoja de personaje (tools/sofia-frente.mjs): textura 'sofia-frente-<edad>'
const ETAPAS_FRENTE = ['bebe', 'nina', 'preado', 'adolescente', 'adulta'];
// Cosas que caen en las zonas de lluvia (texturas 'obj-*'). Si alguna es también un coleccionable, ya se carga con ellos
const LLUVIA = ['pelota', 'libros'];
const ESCENARIO = ['vela-on', 'vela-off', 'vela-cuerpo', 'atril-off', 'atril-on', 'caja-juguete', 'caja-madera', 'caja-carton', 'caja-libros', 'mueble', 'pinchos', 'marco-foto', 'nota-azul', 'nota-dorada', 'nota-rosa', 'nota-verde', 'campana', 'meta', 'puerta', 'tarta', 'cartel-continuara', 'candado', 'icono-objeto', 'clave', 'boton-izq', 'boton-der', 'boton-saltar', 'boton-cantar', 'boton-pausa'];

// [clave de textura y animación, datos] de cada animación del índice de fotogramas de un personaje
function animacionesFotogramas(indice, personaje) {
  const lista = [];
  for (const [etapa, modos] of Object.entries(indice || {})) {
    if (etapa.startsWith('_')) continue;
    for (const [modo, m] of Object.entries(modos)) {
      for (const [anim, a] of Object.entries(m.animaciones)) lista.push([claveFotogramas(etapa, modo, anim, personaje), { ...a, ancho: m.ancho, alto: m.alto }]);
    }
  }
  return lista;
}

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Carga: la joya saltarina sobre la misma corona de la firma de inicio
    const { width: W, height: H } = this.scale;
    this.cameras.main.setBackgroundColor(HEX.tinta);
    this.joya = joyaSaltarina(this, corona(this, W / 2, H / 2, ANCHO_CORONA));

    const S = { scale: ESCALA_TEXTURAS };
    this.load.json('rig-sofia', 'sprites/sofia/rig.json');
    this.load.json('rig-miriam', 'sprites/miriam/rig.json');
    this.load.json('indice-musica', 'music/indice.json');
    this.load.once('filecomplete-json-rig-sofia', (k, t, rig) => {
      // el bebé, la niña y la preadolescente no tienen piezas: van solo con fotogramas de vídeo
      for (const e of Object.keys(rig.etapas)) {
        for (const pieza of Object.keys(rig.etapas[e].piezas)) this.load.svg(`sofia-${e}-${pieza}`, `sprites/sofia/${e}/${pieza}.svg`, S);
      }
    });
    // Animaciones sacadas de los vídeos (tools/video-a-sprites.mjs); las etapas sin vídeo se dibujan con SVG
    for (const p of PERSONAJES_VIDEO) {
      this.load.json(`fotogramas-${p}`, `sprites/${p}/fotogramas.json`);
      this.load.once(`filecomplete-json-fotogramas-${p}`, (k, t, indice) => {
        for (const [clave, info] of animacionesFotogramas(indice, p)) {
          this.load.spritesheet(clave, `sprites/${p}/${info.archivo}`, { frameWidth: info.ancho, frameHeight: info.alto });
        }
      });
    }
    for (const e of ETAPAS_FRENTE) this.load.image(`sofia-frente-${e}`, `sprites/sofia/${e}/frente.png`);
    for (const e of ETAPAS_MIRIAM) this.load.svg(`miriam-${e}`, `sprites/miriam/${e}/cuerpo.svg`, S);
    for (const n of Object.keys(ENEMIGOS)) this.load.svg(n, `sprites/enemigos/${n}.svg`, S);
    for (const n of ESCENARIO) this.load.svg(n, `sprites/escenario/${n}.svg`, S);
    for (const o of OBJETOS.objetos) {
      const ruta = `sprites/objetos/${o.sprite}`;
      if (ruta.endsWith('.svg')) this.load.svg(claveObjeto(o), ruta, S);
      else this.load.image(claveObjeto(o), ruta);
    }
    for (const n of LLUVIA) if (!OBJETOS.objetos.some((o) => claveObjeto(o) === `obj-${n}`)) this.load.svg(`obj-${n}`, `sprites/objetos/${n}.svg`, S);
    this.load.image('logo', 'logo.png');
    for (let n = 0; n < VELAS_NIVELES; n++) {
      const svg = svgVela({ alto: altoVela(n), recorte: true, escala: ESCALA_TEXTURAS });
      this.load.svg(claveVela(n), URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })));
    }
    for (const n of ICONOS) this.load.svg(`ic-${n}`, `sprites/iconos/${n}.svg`, { width: 96, height: 96 });
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
    for (const p of PERSONAJES_VIDEO) {
      for (const [clave, info] of animacionesFotogramas(this.cache.json.get(`fotogramas-${p}`), p)) {
        if (!this.textures.exists(clave) || this.anims.exists(clave)) continue;
        this.anims.create({
          key: clave,
          frames: this.anims.generateFrameNumbers(clave, { start: 0, end: info.fotogramas - 1 }),
          frameRate: info.fps,
          repeat: info.bucle ? -1 : 0,
          yoyo: !!info.vaiven,
        });
      }
    }
    // La llama de vela-on.svg sola (las 28 primeras filas de su textura), para encender velas de cualquier altura
    const velaOn = this.textures.get('vela-on');
    velaOn.add('llama', 0, 0, 0, 60, 28);
    velaOn.firstFrame = '__BASE'; // Phaser convierte el primer fotograma añadido en el de por defecto: se deja la vela entera

    // Partícula redonda para efectos
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 1).fillCircle(8, 8, 8);
    g.generateTexture('punto', 16, 16);
    g.destroy();

    // Quicksand tiene que estar lista antes del primer texto (Phaser no repinta si llega después)
    const fuente = Promise.race([document.fonts?.load('700 32px Quicksand') ?? Promise.resolve(), new Promise((r) => setTimeout(r, 3000))]);
    // la joya termina su salto, la pantalla funde y se entra al juego
    this.joya.esperar(() => fuente.finally(() => {
      this.cameras.main.fadeOut(FUNDIDO, ...RGB_TINTA);
      this.cameras.main.once('camerafadeoutcomplete', () => this.entrar());
    }));
  }

  entrar() {
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
    if (params.has('controles')) {
      this.scene.start('Controles');
      return;
    }
    if (params.has('tarta')) {
      this.scene.start('Tarta', {});
      return;
    }
    this.scene.start('Menu');
  }
}
