// Controles: a la izquierda, lo que sabe hacer Sofía (se elige tocándolo); a la derecha, Sofía en cada edad haciéndolo
// y, debajo, cómo se hace con los botones de la pantalla táctil y con el teclado del ordenador.
import Phaser from 'phaser';
import { texto, JUEGO } from '../config.js';
import { fondoMenu, cabecera, hacerPulsable, ALTO_TABLADO } from '../ui/Boton.js';
import { Sofia } from '../entities/Sofia.js';
import { FUENTE, COLOR, HEX, ajustarTam } from '../estilo.js';

// Las edades de Sofía con los niveles que abarcan (solo el nivel 0 es a gatas) y la caja que empuja en cada una
const ETAPAS = [
  { id: 'gatas', etapa: 'bebe', gatas: true, desde: 0, hasta: 0, caja: 'juguete' },
  { id: 'bebe', etapa: 'bebe', desde: 1, hasta: 2, caja: 'juguete' },
  { id: 'nina', etapa: 'nina', desde: 3, hasta: 7, caja: 'juguete' },
  { id: 'preado', etapa: 'preado', desde: 8, hasta: 12, caja: 'madera' },
  { id: 'adolescente', etapa: 'adolescente', desde: 13, hasta: 17, caja: 'libros' },
  { id: 'adulta', etapa: 'adulta', desde: 18, hasta: 18, caja: 'libros' },
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
const SEP = 16;
const LISTA = { x: MARGEN, y: 100, ancho: 260, alto: 60, sep: 10 };
const ESCENARIO = { y: 100, alto: 384, pies: 320 }; // pies: línea del suelo desde arriba del escenario
const ESCALA = 1.8; // Sofía más grande que en el juego para que se aprecie bien
// Saltos de mentira (en px de pantalla): altura de cada impulso y cuándo llega, dentro de un ciclo que se repite
const GRAVEDAD = 1900;
const SALTOS = {
  saltar: { ciclo: 1.5, impulsos: [[0.35, 48]] },
  dobleSalto: { ciclo: 2.1, impulsos: [[0.35, 48], [0.65, 40]] },
};
const BORDE_CAJA = 9; // de los pies al borde visible de la caja al empujarla (como en el juego)
const CAJA = 0.75; // la caja, algo más pequeña que en el juego para que quepa junto a Sofía

export class ControlesScene extends Phaser.Scene {
  constructor() {
    super('Controles');
  }

  create() {
    const { width: W } = this.scale;
    fondoMenu(this);
    cabecera(this, texto('controles.titulo'));

    this.botones = ACCIONES.map((a, i) => this.botonAccion(a, i));

    // Escenario con Sofía en cada edad
    const x0 = LISTA.x + LISTA.ancho + SEP;
    const ancho = W - MARGEN - x0;
    const { y, alto, pies } = ESCENARIO;
    const g = this.add.graphics();
    g.fillStyle(HEX.superficie, 1).fillRoundedRect(x0, y, ancho, alto, 24);
    g.fillStyle(HEX.noche, 1).fillRect(x0 + 24, y + pies, ancho - 48, 3);
    const hueco = (ancho - 32) / ETAPAS.length;
    this.sofias = ETAPAS.map((e, i) => this.personaje(x0 + 16 + hueco * (i + 0.5), y + pies, e));

    // Cómo se hace: debajo del escenario
    this.comoY = y + alto + SEP;
    this.comoX = x0;
    this.comoAncho = ancho;

    this.input.keyboard?.on('keydown-UP', () => this.elegir((this.elegida + ACCIONES.length - 1) % ACCIONES.length));
    this.input.keyboard?.on('keydown-DOWN', () => this.elegir((this.elegida + 1) % ACCIONES.length));
    this.elegir(0);
  }

  botonAccion(a, i) {
    const { x, y, ancho, alto, sep } = LISTA;
    const c = this.add.container(x + ancho / 2, y + alto / 2 + i * (alto + sep));
    const fondo = this.add.graphics();
    const nombre = this.add.text(0, 0, texto(`controles.acciones.${a.id}`), { fontFamily: FUENTE, fontSize: '24px', color: COLOR.blanco }).setOrigin(0.5);
    c.add([fondo, nombre]);
    c.setSize(ancho, alto);
    hacerPulsable(c, () => this.elegir(i), { nota: 'E5' });
    return { fondo, nombre };
  }

  personaje(x, pies, e) {
    const s = new Sofia(this, x, pies, e.etapa, { gatas: e.gatas });
    s.body.setAllowGravity(false);
    s.body.enable = false;
    s.setScale(ESCALA);
    const caja = this.add.image(0, pies, `caja-${e.caja}`).setOrigin(0, 1).setScale(0.5 * ESCALA * CAJA).setDepth(49);
    const nombre = this.add.text(x, pies + 22, texto(`controles.etapas.${e.id}`), { fontFamily: FUENTE, fontSize: '19px', color: COLOR.blanco }).setOrigin(0.5);
    const sub = this.add.text(x, nombre.y + 24, '', { fontFamily: FUENTE, fontSize: '16px', color: COLOR.azulClaro }).setOrigin(0.5);
    return { s, e, x, pies, caja, nombre, sub, alto: 0, vy: 0, t: 0 };
  }

  elegir(i) {
    this.elegida = i;
    const a = ACCIONES[i];
    for (const [j, b] of this.botones.entries()) {
      const sel = j === i;
      b.fondo.clear().fillStyle(sel ? HEX.papel : HEX.superficie, 1).fillRoundedRect(-LISTA.ancho / 2, -LISTA.alto / 2, LISTA.ancho, LISTA.alto, LISTA.alto / 2);
      b.nombre.setColor(sel ? COLOR.tinta : COLOR.blanco);
    }
    for (const p of this.sofias) {
      const { e } = p;
      // ¿lo sabe hacer en esta edad? Si la habilidad llega a mitad de la edad, se dice desde qué nivel
      const nivel = a.habilidad ? JUEGO.habilidades[a.habilidad] : 0;
      p.puede = !(a.sinGatas && e.gatas) && nivel <= e.hasta;
      const niveles = e.desde === e.hasta ? texto('controles.nivel', { n: e.desde }) : texto('controles.niveles', { a: e.desde, b: e.hasta });
      const aviso = !p.puede ? texto('controles.todaviaNo') : nivel > e.desde ? texto('controles.desdeNivel', { n: nivel }) : null;
      p.sub.setText(aviso || niveles).setColor(aviso && p.puede ? COLOR.amarillo : COLOR.azulClaro);
      p.nombre.setAlpha(p.puede ? 1 : 0.5);
      p.s.visual.setAlpha(p.puede ? 1 : 0.4); // (el alfa del contenedor lo usa el parpadeo de los golpes)
      // al empujar, Sofía se echa atrás para que quepa la caja delante
      const empuja = a.id === 'empujar';
      p.s.x = empuja ? p.x - (e.gatas ? 6 : 24) : p.x;
      p.s.bordeEmpuje = empuja ? BORDE_CAJA : null;
      p.caja.setVisible(empuja).setX(p.s.x + BORDE_CAJA * ESCALA);
      p.s.y = p.pies;
      p.alto = 0;
      p.vy = 0;
      p.t = 0;
      p.s.vuelta = 0;
      p.s.visual.rotation = 0;
      p.siguiente = 0;
    }
    this.como(a);
  }

  // Cómo se hace la acción elegida: en el móvil y en el ordenador
  como(a) {
    this.capaComo?.destroy();
    const capa = this.add.container(0, 0);
    this.capaComo = capa;
    const { comoX: x0, comoY: y0, comoAncho: ancho } = this;
    const alto = this.scale.height - ALTO_TABLADO - 16 - y0;
    capa.add(this.add.graphics().fillStyle(HEX.superficie, 1).fillRoundedRect(x0, y0, ancho, alto, 24));
    const filas = [['movil', a.movil], ['ordenador', a.ordenador]];
    filas.forEach(([k, piezas], i) => {
      const y = y0 + (alto / filas.length) * (i + 0.5);
      if (i > 0) capa.add(this.add.graphics().fillStyle(HEX.noche, 1).fillRect(x0 + 24, y0 + alto / 2 - 1, ancho - 48, 2));
      capa.add(this.add.text(x0 + 32, y, texto(`controles.${k}`).toUpperCase(), { fontFamily: FUENTE, fontSize: '16px', color: COLOR.azulClaro, letterSpacing: 3 }).setOrigin(0, 0.5));
      this.piezas(capa, x0 + 260, y, piezas);
    });
  }

  // Pone en fila botones, teclas y textos
  piezas(capa, x, y, lista) {
    for (const p of lista) {
      let w;
      if (p.boton) {
        const img = ajustarTam(this.add.image(x + 21, y, p.boton), 42);
        capa.add(img);
        w = 42;
      } else if (p.tecla) {
        w = this.tecla(capa, x, y, p.tecla);
      } else {
        const t = this.add.text(x, y, texto(p.o ? 'controles.o' : `controles.${p.t}`), { fontFamily: FUENTE, fontSize: '22px', color: p.o ? COLOR.azulClaro : COLOR.blanco }).setOrigin(0, 0.5);
        capa.add(t);
        w = t.width;
      }
      x += w + 10;
    }
  }

  // Tecla de papel con su nombre; las flechas se dibujan (la fuente no las tiene)
  tecla(capa, x, y, nombre) {
    const flecha = { izq: [-1, 0], der: [1, 0], arriba: [0, -1] }[nombre];
    const t = flecha ? null : this.add.text(0, y, nombre, { fontFamily: FUENTE, fontSize: '20px', color: COLOR.tinta }).setOrigin(0.5);
    const w = Math.max(34, t ? t.width + 20 : 34);
    const h = 34;
    const g = this.add.graphics().fillStyle(HEX.papel, 1).fillRoundedRect(x, y - h / 2, w, h, 8);
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
      g.moveTo(cx - dx * 4 + px * 7, y - dy * 4 + py * 7);
      g.lineTo(cx + dx * 4, y + dy * 4);
      g.lineTo(cx - dx * 4 - px * 7, y - dy * 4 - py * 7);
      g.strokePath();
    }
    return w;
  }

  update(t, d) {
    const dt = d / 1000;
    const a = ACCIONES[this.elegida];
    for (const p of this.sofias) {
      const { s } = p;
      s.body.velocity.x = 0;
      s.corriendo = false;
      s.cantando = false;
      let estado = 'frente'; // lo que todavía no sabe hacer (y la pausa): de frente, mirando
      if (p.puede && a.id !== 'pausa') {
        if (SALTOS[a.id]) estado = this.saltar(p, a.id, t, dt);
        else if (a.id === 'cantar') {
          estado = 'cantar';
          s.cantando = true;
        } else {
          estado = a.id;
          const F = JUEGO.fisica;
          s.body.velocity.x = a.id === 'correr' ? F.velocidadCorrer : a.id === 'empujar' ? F.empujeCaja : s.gatas ? F.velocidadGatas : F.velocidadAndar;
          s.corriendo = a.id === 'correr';
        }
      }
      s.estadoForzado = estado;
      s.animar(t, dt, true, 0);
    }
  }

  // Salto (o doble salto) que se repite: sube con cada impulso y cae con gravedad
  saltar(p, id, tiempo, dt) {
    const { s } = p;
    const { ciclo, impulsos } = SALTOS[id];
    const escala = s.gatas ? 0.55 : 1;
    p.t += dt;
    if (p.t >= ciclo) {
      p.t -= ciclo;
      p.siguiente = 0;
    }
    const imp = impulsos[p.siguiente];
    if (imp && p.t >= imp[0]) {
      p.vy = Math.sqrt(2 * GRAVEDAD * imp[1] * escala);
      if (p.siguiente === 0) s.estirar = 1;
      else {
        // segundo salto: voltereta con los fotogramas del vídeo, o pirueta con las piezas
        const doble = s.infoFotos?.animaciones.doble;
        if (doble) s.dobleHasta = tiempo + (doble.fotogramas / doble.fps) * 1000;
        else s.vuelta = 1;
      }
      p.siguiente++;
    }
    if (p.alto > 0 || p.vy > 0) {
      p.alto += p.vy * dt;
      p.vy -= GRAVEDAD * dt;
      if (p.alto <= 0) {
        p.alto = 0;
        p.vy = 0;
        s.squash = 1;
      }
    }
    s.y = p.pies - p.alto;
    if (p.alto <= 0) return 'reposo';
    if (tiempo < (s.dobleHasta || 0)) return 'doble';
    return p.vy > 0 ? 'saltar' : 'caer';
  }
}
