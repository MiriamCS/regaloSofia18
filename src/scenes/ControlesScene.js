// Controles: arriba, Sofía en cada edad (se elige tocándola); debajo, lo que sabe hacer en esa edad y cómo se hace
// con los botones de la pantalla táctil y con el teclado del ordenador.
import Phaser from 'phaser';
import { texto, JUEGO, NUM_NIVELES, etapaDeNivel } from '../config.js';
import { fondoMenu, cabecera, hacerPulsable, ALTO_TABLADO } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { Sofia } from '../entities/Sofia.js';
import { FUENTE, COLOR, HEX, ajustarTam } from '../estilo.js';

// Las edades de Sofía con los niveles que abarcan (solo el nivel 0 es a gatas)
const ETAPAS = [
  { id: 'gatas', etapa: 'bebe', gatas: true, desde: 0, hasta: 0 },
  { id: 'bebe', etapa: 'bebe', desde: 1, hasta: 2 },
  { id: 'nina', etapa: 'nina', desde: 3, hasta: 7 },
  { id: 'preado', etapa: 'preado', desde: 8, hasta: 12 },
  { id: 'adolescente', etapa: 'adolescente', desde: 13, hasta: 17 },
  { id: 'adulta', etapa: 'adulta', desde: 18, hasta: 18 },
];

// Cada acción: cómo se hace en el móvil y en el ordenador, como piezas puestas en fila:
// { boton } un botón táctil del juego, { tecla } una tecla, { t } un texto, { o: true } el «o» entre opciones.
// 'habilidad' = solo desde el nivel en que se desbloquea (config/juego.json)
const ACCIONES = [
  {
    id: 'andar',
    movil: [{ boton: 'boton-izq' }, { boton: 'boton-der' }],
    ordenador: [{ tecla: 'izq' }, { tecla: 'der' }, { o: true }, { tecla: 'A' }, { tecla: 'D' }],
  },
  {
    id: 'correr', habilidad: 'correr', sinGatas: true,
    movil: [{ t: 'mantenFlecha' }],
    ordenador: [{ t: 'mantenFlechaO' }, { tecla: 'Mayús' }],
  },
  {
    id: 'saltar',
    movil: [{ boton: 'boton-saltar' }],
    ordenador: [{ tecla: 'Espacio' }, { o: true }, { tecla: 'arriba' }, { o: true }, { tecla: 'W' }],
  },
  {
    id: 'dobleSalto', habilidad: 'dobleSalto',
    movil: [{ boton: 'boton-saltar' }, { t: 'otraVezAire' }],
    ordenador: [{ tecla: 'Espacio' }, { t: 'otraVezAire' }],
  },
  { id: 'empujar', movil: [{ t: 'contraCaja' }], ordenador: [{ t: 'contraCaja' }] },
  {
    id: 'cantar', habilidad: 'cantar',
    movil: [{ boton: 'boton-cantar' }],
    ordenador: [{ tecla: 'X' }, { o: true }, { tecla: 'K' }],
  },
  {
    id: 'pausa',
    movil: [{ boton: 'boton-pausa' }],
    ordenador: [{ tecla: 'Esc' }, { o: true }, { tecla: 'P' }],
  },
];

const MARGEN = 56;
const SEP = 14;
const TARJETA = { y: 96, alto: 176, pies: 116 };
const FILA = 36;

export class ControlesScene extends Phaser.Scene {
  constructor() {
    super('Controles');
  }

  create() {
    const { width: W } = this.scale;
    fondoMenu(this);
    cabecera(this, texto('controles.titulo'));

    // Sofía en cada edad, en su tarjeta
    const ancho = (W - MARGEN * 2 - SEP * (ETAPAS.length - 1)) / ETAPAS.length;
    this.tarjetas = ETAPAS.map((e, i) => this.tarjeta(MARGEN + ancho / 2 + i * (ancho + SEP), ancho, e));

    // Empieza en la edad del siguiente nivel por jugar (como en la pantalla de inicio)
    const n = Guardado.completado(NUM_NIVELES - 1) ? NUM_NIVELES - 1 : Guardado.siguienteNivel();
    const actual = n === 0 ? 'gatas' : etapaDeNivel(n);
    this.elegir(ETAPAS.findIndex((e) => e.id === actual));
  }

  tarjeta(x, ancho, e) {
    const { y, alto, pies } = TARJETA;
    const c = this.add.container(x, y + alto / 2);
    const fondo = this.add.graphics();
    const nombre = this.add.text(0, -alto / 2 + pies + 22, texto(`controles.etapas.${e.id}`), { fontFamily: FUENTE, fontSize: '20px', color: COLOR.blanco }).setOrigin(0.5);
    const niveles = e.desde === e.hasta ? texto('controles.nivel', { n: e.desde }) : texto('controles.niveles', { a: e.desde, b: e.hasta });
    const sub = this.add.text(0, nombre.y + 24, niveles, { fontFamily: FUENTE, fontSize: '16px', color: COLOR.azulClaro }).setOrigin(0.5);
    c.add([fondo, nombre, sub]);
    c.setSize(ancho, alto);
    const t = { c, fondo, nombre, sub, ancho, e };
    hacerPulsable(c, () => this.elegir(this.tarjetas.indexOf(t)), { escala: 1, nota: 'E5' });

    // Sofía de pie (o a gatas) sobre la tarjeta, quieta: solo anda la de la edad elegida
    const s = new Sofia(this, x, y + pies, e.etapa, { gatas: e.gatas });
    s.body.setAllowGravity(false);
    s.body.enable = false;
    t.sofia = s;
    return t;
  }

  elegir(i) {
    if (i < 0) i = 0;
    this.elegida = i;
    for (const [j, t] of this.tarjetas.entries()) {
      const sel = j === i;
      const { alto } = TARJETA;
      t.fondo.clear().fillStyle(sel ? HEX.papel : HEX.superficie, 1).fillRoundedRect(-t.ancho / 2, -alto / 2, t.ancho, alto, 20);
      t.nombre.setColor(sel ? COLOR.tinta : COLOR.blanco);
      t.sub.setColor(sel ? COLOR.real : COLOR.azulClaro);
      t.sofia.estadoForzado = sel ? 'andar' : 'reposo';
    }
    this.tabla(ETAPAS[i]);
  }

  // Tabla de acciones de una edad: acción, móvil y ordenador
  tabla(e) {
    const { width: W, height: H } = this.scale;
    this.capaTabla?.destroy();
    const capa = this.add.container(0, 0);
    this.capaTabla = capa;
    const x0 = MARGEN;
    const ancho = W - MARGEN * 2;
    const y0 = TARJETA.y + TARJETA.alto + 16;
    const alto = H - ALTO_TABLADO - 16 - y0;
    capa.add(this.add.graphics().fillStyle(HEX.superficie, 1).fillRoundedRect(x0, y0, ancho, alto, 24));

    const cols = [x0 + 32, x0 + ancho * 0.36, x0 + ancho * 0.66];
    let y = y0 + 24;
    ['accion', 'movil', 'ordenador'].forEach((k, i) => {
      capa.add(this.add.text(cols[i], y, texto(`controles.${k}`).toUpperCase(), { fontFamily: FUENTE, fontSize: '16px', color: COLOR.azulClaro, letterSpacing: 3 }).setOrigin(0, 0.5));
    });
    y += 20;

    const acciones = ACCIONES.filter((a) => !(a.sinGatas && e.gatas) && (!a.habilidad || JUEGO.habilidades[a.habilidad] <= e.hasta));
    for (const a of acciones) {
      capa.add(this.add.graphics().fillStyle(HEX.noche, 1).fillRect(x0 + 24, y, ancho - 48, 2));
      const yc = y + FILA / 2 + 1;
      const nombre = this.add.text(cols[0], yc, texto(`controles.acciones.${a.id === 'andar' && e.gatas ? 'gatear' : a.id}`), { fontFamily: FUENTE, fontSize: '22px', color: COLOR.blanco }).setOrigin(0, 0.5);
      capa.add(nombre);
      // la habilidad llega a mitad de esta edad: se dice desde qué nivel
      const nivel = a.habilidad ? JUEGO.habilidades[a.habilidad] : 0;
      if (nivel > e.desde) {
        capa.add(this.add.text(nombre.x + nombre.width + 12, yc + 1, texto('controles.desdeNivel', { n: nivel }), { fontFamily: FUENTE, fontSize: '16px', color: COLOR.azulClaro }).setOrigin(0, 0.5));
      }
      this.piezas(capa, cols[1], yc, a.movil);
      this.piezas(capa, cols[2], yc, a.ordenador);
      y += FILA;
    }
  }

  // Pone en fila botones, teclas y textos
  piezas(capa, x, y, lista) {
    for (const p of lista) {
      let w;
      if (p.boton) {
        const img = ajustarTam(this.add.image(x + 17, y, p.boton), 34);
        capa.add(img);
        w = 34;
      } else if (p.tecla) {
        w = this.tecla(capa, x, y, p.tecla);
      } else {
        const t = this.add.text(x, y, texto(p.o ? 'controles.o' : `controles.${p.t}`), { fontFamily: FUENTE, fontSize: '20px', color: p.o ? COLOR.azulClaro : COLOR.blanco }).setOrigin(0, 0.5);
        capa.add(t);
        w = t.width;
      }
      x += w + 8;
    }
  }

  // Tecla de papel con su nombre; las flechas se dibujan (la fuente no las tiene)
  tecla(capa, x, y, nombre) {
    const flecha = { izq: [-1, 0], der: [1, 0], arriba: [0, -1] }[nombre];
    const t = flecha ? null : this.add.text(0, y, nombre, { fontFamily: FUENTE, fontSize: '18px', color: COLOR.tinta }).setOrigin(0.5);
    const w = Math.max(30, t ? t.width + 18 : 30);
    const h = 30;
    const g = this.add.graphics().fillStyle(HEX.papel, 1).fillRoundedRect(x, y - h / 2, w, h, 7);
    capa.add(g);
    const cx = x + w / 2;
    if (t) {
      t.x = cx;
      capa.add(t);
    } else {
      // punta de flecha, como en los botones del juego
      const [dx, dy] = flecha;
      const px = -dy;
      const py = dx;
      g.lineStyle(3, HEX.tinta, 1);
      g.beginPath();
      g.moveTo(cx - dx * 3 + px * 6, y - dy * 3 + py * 6);
      g.lineTo(cx + dx * 4, y + dy * 4);
      g.lineTo(cx - dx * 3 - px * 6, y - dy * 3 - py * 6);
      g.strokePath();
    }
    return w;
  }

  update(t, d) {
    for (const { sofia } of this.tarjetas) sofia.animar(t, d / 1000, true, 0);
  }
}
