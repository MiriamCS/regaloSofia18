// Menú de niveles (las velas de la tarta), álbumes (entradas de concierto para el álbum de fotos, los coleccionables y
// la enciclopedia de monstruos) y configuración.
import Phaser from 'phaser';
import { texto, NUM_NIVELES, FOTOS, OBJETOS, TEXTOS, claveObjeto } from '../config.js';
import { Boton, fondoMenu, cabecera, insignia, hacerPulsable, ALTO_TABLADO } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { FUENTE, FUENTE_TITULO, COLOR, HEX, ajustarTam } from '../estilo.js';
import { MOVIMIENTO_REDUCIDO } from '../ui/Marca.js';
import { ANCHO_VELA, altoVela, claveVela } from './BootScene.js';
import { Audio } from '../audio/Audio.js';

// Rejilla en dos filas: 10 arriba y el resto abajo (19 casillas, o 20 en el álbum)
function posicionCasilla(scene, n, tam, total = NUM_NIVELES) {
  const { width: W, height: H } = scene.scale;
  const fila = n < 10 ? 0 : 1;
  const col = n < 10 ? n : n - 10;
  const porFila = fila === 0 ? 10 : total - 10;
  const sep = Math.min(tam + 18, (W - 80) / 10);
  const x = W / 2 + (col - (porFila - 1) / 2) * sep;
  const y = H * 0.38 + fila * (tam + 60);
  return { x, y };
}

// Casilla de las colecciones: papel si ya se tiene, azul si falta. Cuadrada salvo que se le dé otro alto.
function casilla(scene, x, y, tam, { activa, alPulsar, alto = tam, radio = 18 }) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(activa ? HEX.papel : HEX.superficie, 1).fillRoundedRect(-tam / 2, -alto / 2, tam, alto, radio);
  c.add(g);
  c.setSize(tam, alto);
  if (alPulsar) hacerPulsable(c, alPulsar, { escala: 0.94, nota: 'E5' });
  return c;
}

// Aviso de nuevo en la esquina de una casilla (si lo conseguido aún no se ha abierto)
function avisoNuevo(scene, c, tam, coleccion, id, alto = tam) {
  if (!Guardado.esNuevo(coleccion, id)) return null;
  const a = insignia(scene, tam / 2 - 14, -alto / 2 + 14);
  c.add(a);
  return a;
}

// Al abrir la ficha o verlo en grande deja de ser nuevo
function quitarAviso(aviso, coleccion, id) {
  Guardado.marcarVisto(coleccion, id);
  aviso?.destroy();
}

const completados = () => Array.from({ length: NUM_NIVELES }, (_, n) => n).filter((n) => Guardado.completado(n)).length;

// ---- Niveles: la tarta vista de frente, una vela por año -------------------------------

export class NivelesScene extends Phaser.Scene {
  constructor() {
    super('Niveles');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    cabecera(this, texto('galerias.niveles'), { total: texto('galerias.superados', { n: completados(), total: NUM_NIVELES }) });
    const base = H - ALTO_TABLADO - 66;
    const col = (W - 128) / NUM_NIVELES;
    // la bandeja de la tarta, de la que salen todas las velas
    this.add.graphics().fillStyle(HEX.azulClaro, 1).fillRoundedRect(52, base, W - 104, 6, 3);
    for (let n = 0; n < NUM_NIVELES; n++) this.vela(64 + col * (n + 0.5), base, n, col);
  }

  // Vela del año n (vela-cuerpo.svg a medida, más alta cuanto mayor es Sofía) con la llama de vela-on.svg.
  // Superada: encendida. Disponible sin superar (la que toca jugar): aro amarillo y llama que tiembla.
  // Bloqueada: apagada, más tenue y con el candado.
  vela(x, base, n, col) {
    const hecho = Guardado.completado(n);
    const disponible = Guardado.disponible(n);
    const toca = disponible && !hecho;
    const alto = altoVela(n);
    const c = this.add.container(x, base);
    if (toca) c.add(this.add.graphics().lineStyle(4, HEX.amarillo, 1).strokeRoundedRect(-ANCHO_VELA / 2 - 9, -alto - 8, ANCHO_VELA + 18, alto + 14, 12));
    const cuerpo = this.add.image(0, 0, claveVela(n)).setOrigin(0.5, 1).setDisplaySize(ANCHO_VELA, alto);
    if (!disponible) cuerpo.setAlpha(0.35);
    c.add(cuerpo);
    let cima = -alto;
    if (hecho || toca) {
      const llama = this.add.image(0, -alto + 3, 'vela-on', 'llama').setOrigin(0.5, 1).setScale(ANCHO_VELA / 18);
      c.add(llama);
      cima = llama.y - llama.displayHeight;
      if (toca && !MOVIMIENTO_REDUCIDO) this.tweens.add({ targets: llama, scaleY: llama.scaleY * 0.88, scaleX: llama.scaleX * 1.06, duration: 520, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    } else {
      c.add(ajustarTam(this.add.image(0, -alto - 22, 'candado'), 30));
      cima = -alto - 40;
    }
    // encima de las superadas: si se consiguieron la foto y el objeto de ese año
    if (hecho) {
      c.add(ajustarTam(this.add.image(0, cima - 18, 'marco-foto'), 30).setAlpha(Guardado.tieneFoto(n) ? 1 : 0.25));
      c.add(ajustarTam(this.add.image(0, cima - 50, 'icono-objeto'), 28).setAlpha(Guardado.tieneObjeto(n) ? 1 : 0.25));
    }
    c.add(this.add.text(0, 32, String(n), { fontFamily: FUENTE, fontSize: '24px', color: disponible ? COLOR.blanco : COLOR.azulClaro }).setOrigin(0.5).setAlpha(disponible ? 1 : 0.6));
    if (!disponible) return;
    // zona táctil de toda la columna, de los iconos al número (el contenedor encoge hacia la bandeja)
    const arriba = alto + 130;
    const alturaZona = arriba + 50;
    c.setSize(col, alturaZona);
    c.setInteractive(new Phaser.Geom.Rectangle(0, alturaZona / 2 - arriba, col, alturaZona), Phaser.Geom.Rectangle.Contains);
    hacerPulsable(c, () => this.scene.start('Transicion', { nivel: n }), { escala: 0.95, nota: 'E5' });
  }
}

// ---- Álbumes: tres entradas de concierto ----------------------------------------------

// icono: textura del dibujo de la entrada (provisional hasta tener los definitivos)
export const COLECCIONES = [
  { titulo: 'galerias.album', escena: 'Album', coleccion: 'fotos', icono: 'marco-foto', talon: 'galerias.talonFotos' },
  { titulo: 'galerias.vitrina', escena: 'Vitrina', coleccion: 'objetos', icono: 'icono-objeto', talon: 'galerias.talonObjetos' },
  { titulo: 'galerias.monstruos', escena: 'Monstruos', coleccion: 'monstruos', icono: 'pato', talon: 'galerias.talonMonstruos' },
];

// Conseguidos y total de cada colección (y la suma), para el inicio y las entradas
export function progresoColecciones() {
  const nace = FOTOS.nacimiento;
  const fotos = [FOTOS.fotos.filter((f) => Guardado.tieneFoto(f.nivel)).length + (nace && Guardado.tieneFotoNacimiento() ? 1 : 0), FOTOS.fotos.length + (nace ? 1 : 0)];
  const objetos = [OBJETOS.objetos.filter((o) => Guardado.tieneObjeto(o.nivel)).length, OBJETOS.objetos.length];
  const ids = Object.keys(TEXTOS.monstruos);
  const monstruos = [ids.filter((id) => Guardado.tieneMonstruo(id)).length, ids.length];
  return { fotos, objetos, monstruos, conseguidos: fotos[0] + objetos[0] + monstruos[0], total: fotos[1] + objetos[1] + monstruos[1] };
}

export class AlbumesScene extends Phaser.Scene {
  constructor() {
    super('Albumes');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    const p = progresoColecciones();
    cabecera(this, texto('galerias.albumes'), { total: texto('galerias.conseguidos', { n: p.conseguidos, total: p.total }) });
    // tres entradas en vertical, una al lado de la otra
    const margen = 58;
    const sep = 32;
    const arriba = 124;
    const abajo = H - ALTO_TABLADO - 36;
    const ancho = (W - margen * 2 - sep * 2) / 3;
    COLECCIONES.forEach((col, i) => this.entrada(margen + ancho / 2 + i * (ancho + sep), (arriba + abajo) / 2, ancho, abajo - arriba, col, p[col.coleccion]));
  }

  // Entrada de concierto: cuerpo con icono y título; talón, tras la línea de puntos, con el recuento
  entrada(x, y, w, h, col, [tiene, total]) {
    const c = this.add.container(x, y);
    const g = this.add.graphics();
    const corte = -h / 2 + h * 0.76;
    g.fillStyle(HEX.papel, 1).fillRoundedRect(-w / 2, -h / 2, w, h, 20);
    // muescas a los lados, del color del escenario
    g.fillStyle(HEX.noche, 1).fillCircle(-w / 2, corte, 18).fillCircle(w / 2, corte, 18);
    g.lineStyle(3, HEX.azulClaro, 1);
    for (let xx = -w / 2 + 28; xx < w / 2 - 28; xx += 18) g.lineBetween(xx, corte, Math.min(xx + 10, w / 2 - 28), corte);
    c.add(g);
    const yIcono = -h / 2 + (corte + h / 2) * 0.44;
    c.add(ajustarTam(this.add.image(0, yIcono, col.icono), 124));
    c.add(this.add.text(0, yIcono + 96, texto(col.titulo), { fontFamily: FUENTE, fontSize: '30px', color: COLOR.tinta, align: 'center', wordWrap: { width: w - 48 } }).setOrigin(0.5));
    const yTalon = corte + (h / 2 - corte) / 2;
    c.add(this.add.text(-w / 2 + 30, yTalon, texto(col.talon), { fontFamily: FUENTE, fontSize: '20px', color: COLOR.real }).setOrigin(0, 0.5));
    c.add(this.add.text(w / 2 - 30, yTalon, `${tiene} / ${total}`, { fontFamily: FUENTE, fontSize: '20px', color: COLOR.real }).setOrigin(1, 0.5));
    if (Guardado.hayNuevos(col.coleccion)) c.add(insignia(this, w / 2 - 28, -h / 2 + 28));
    c.setSize(w, h);
    hacerPulsable(c, () => this.scene.start(col.escena), { escala: 0.97 });
  }
}

// ---- Álbum de fotos ---------------------------------------------------------------

export const CLAVE_FOTO_NACIMIENTO = 'foto-nacimiento';

// Escala la imagen para cubrir w x h y recorta lo que sobra (centrado). Funciona aunque se gire.
export function recortarCubriendo(img, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const cw = w / s;
  const ch = h / s;
  img.setScale(s);
  img.setCrop((img.width - cw) / 2, (img.height - ch) / 2, cw, ch);
}

export class AlbumScene extends Phaser.Scene {
  constructor() {
    super('Album');
  }

  preload() {
    // Solo se cargan las fotos conseguidas. Si falta el archivo se usa un marco con placeholder.
    this.load.on('loaderror', () => {});
    for (const f of this.fotos()) {
      if (f.tiene && f.archivo && !this.textures.exists(f.clave)) this.load.image(f.clave, f.archivo);
    }
  }

  // La foto del nacimiento va la primera, antes de las de cada año
  fotos() {
    const nace = FOTOS.nacimiento;
    const lista = FOTOS.fotos.map((f) => ({ ...f, id: f.nivel, clave: `foto-${f.nivel}`, tiene: Guardado.tieneFoto(f.nivel), etiqueta: texto('galerias.nivel', { n: f.nivel }) }));
    if (nace) lista.unshift({ ...nace, id: 'nacimiento', clave: CLAVE_FOTO_NACIMIENTO, tiene: Guardado.tieneFotoNacimiento(), etiqueta: texto('galerias.nacimiento') });
    return lista;
  }

  create() {
    fondoMenu(this);
    cabecera(this, texto('galerias.album'), { destino: 'Albumes' });
    // Cada hueco tiene la forma de su foto (medidas en photos.json), se tenga o no: cabe en anchoMax × altoMax
    const anchoMax = 104;
    const altoMax = 120;
    const marco = 6;
    const fotos = this.fotos();
    fotos.forEach((f, i) => {
      const { x, y } = posicionCasilla(this, i, anchoMax, fotos.length);
      const tiene = f.tiene;
      const img = tiene && this.textures.exists(f.clave) ? this.add.image(0, 0, f.clave) : null;
      const [mw, mh] = img ? [img.width, img.height] : f.medidas || [4, 3];
      const s = Math.min((anchoMax - marco * 2) / mw, (altoMax - marco * 2) / mh);
      const fw = Math.round(mw * s);
      const fh = Math.round(mh * s);
      const c = casilla(this, x, y, fw + marco * 2, { activa: tiene, alto: fh + marco * 2, radio: 4, alPulsar: tiene ? () => this.ver(f, aviso) : null });
      const aviso = avisoNuevo(this, c, fw + marco * 2, 'fotos', f.id, fh + marco * 2);
      if (img) {
        img.setDisplaySize(fw, fh);
        c.addAt(img, 1);
      } else if (tiene) {
        c.addAt(ajustarTam(this.add.image(0, 0, 'marco-foto'), Math.min(fw, fh) * 0.8), 1);
      } else {
        // silueta con interrogación
        c.addAt(this.add.graphics().fillStyle(HEX.noche, 1).fillRect(-fw / 2, -fh / 2, fw, fh), 1);
        c.add(this.add.text(0, 0, '?', { fontFamily: FUENTE_TITULO, fontSize: '38px', color: COLOR.azulClaro }).setOrigin(0.5));
      }
      this.add.text(x, y + altoMax / 2 + 8, f.etiqueta, { fontFamily: FUENTE, fontSize: '15px', color: tiene ? COLOR.blanco : COLOR.azulClaro }).setOrigin(0.5, 0);
    });
  }

  ver(f, aviso) {
    quitarAviso(aviso, 'fotos', f.id);
    const { width: W, height: H } = this.scale;
    const cfg = FOTOS.visualizacion;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, HEX.tinta, 0.85).setOrigin(0).setInteractive();
    capa.add(velo);
    // ancho y alto son el máximo: el marco toma las proporciones de la foto, que se ve entera
    let aw = Math.min(cfg.ancho, W - 120);
    let ah = Math.min(cfg.alto, H - 170);
    const marco = cfg.marco;
    const hueco = 14; // entre la foto y el pie
    const img = this.textures.exists(f.clave) ? this.add.image(0, 0, f.clave) : null;
    // el pie va debajo, en el papel, ajustado al ancho de la foto (nunca más estrecho que 340)
    const pie = this.add.text(0, 0, f.pie || '', { fontFamily: FUENTE, fontSize: '24px', color: COLOR.tinta, align: 'center', wordWrap: { width: Math.max(aw, 340) } }).setOrigin(0.5, 0);
    const altoPapel = () => marco + ah + hueco + pie.height + marco * 1.5;
    if (img) {
      // si el pie no cabe en la pantalla, la foto encoge (y el pie se vuelve a repartir en su nuevo ancho)
      let s = Math.min(aw / img.width, ah / img.height);
      for (let i = 0; i < 4; i++) {
        aw = img.width * s;
        ah = img.height * s;
        pie.setWordWrapWidth(Math.max(aw, 340));
        const sobra = altoPapel() - (H - 40);
        if (sobra <= 0) break;
        s *= (ah - sobra) / ah;
      }
      img.setScale(s);
    }
    const ancho = Math.max(aw, pie.width) + marco * 2;
    const alto = altoPapel();
    const arriba = -alto / 2;
    const yFoto = arriba + marco + ah / 2;
    const giro = Phaser.Math.Between(-cfg.giroMaxGrados, cfg.giroMaxGrados);
    const foto = this.add.container(W / 2, H / 2).setAngle(giro);
    const papel = this.add.graphics();
    papel.fillStyle(HEX.blanco, 1).fillRect(-ancho / 2, arriba, ancho, alto);
    foto.add(papel);
    if (img) {
      foto.add(img.setY(yFoto));
    } else {
      const g = this.add.graphics();
      g.fillStyle(HEX.hielo, 1).fillRect(-aw / 2, yFoto - ah / 2, aw, ah);
      g.lineStyle(4, HEX.azulClaro, 1).strokeRect(-aw / 2 + 20, yFoto - ah / 2 + 20, aw - 40, ah - 40);
      foto.add(g);
      foto.add(this.add.image(0, yFoto - 20, 'marco-foto').setScale(1.4));
      foto.add(this.add.text(0, yFoto + 70, `${f.etiqueta}: foto pendiente`, { fontFamily: FUENTE, fontSize: '24px', color: COLOR.real }).setOrigin(0.5));
    }
    foto.add(pie.setY(yFoto + ah / 2 + hueco));
    capa.add(foto);
    foto.setScale(0.6).setAlpha(0);
    this.tweens.add({ targets: foto, scale: 1, alpha: 1, duration: 260, ease: 'Back.out' });
    const cerrar = () => capa.destroy();
    velo.on('pointerup', cerrar);
  }
}

// ---- Vitrina de objetos -------------------------------------------------------------

export class VitrinaScene extends Phaser.Scene {
  constructor() {
    super('Vitrina');
  }

  create() {
    fondoMenu(this);
    cabecera(this, texto('galerias.vitrina'), { destino: 'Albumes' });
    const tam = 104;
    for (const o of OBJETOS.objetos) {
      const n = o.nivel;
      const { x, y } = posicionCasilla(this, n, tam);
      const tiene = Guardado.tieneObjeto(n);
      const c = casilla(this, x, y, tam, { activa: tiene, alPulsar: tiene ? () => this.ver(o, aviso) : null });
      const img = this.add.image(0, -8, claveObjeto(o));
      img.setScale(72 / Math.max(img.width, img.height));
      if (!tiene) img.setTintFill(HEX.tinta).setAlpha(0.75);
      c.add(img);
      c.add(this.add.text(0, tam / 2 - 14, texto('galerias.nivel', { n }), { fontFamily: FUENTE, fontSize: '15px', color: tiene ? COLOR.tinta : COLOR.azulClaro }).setOrigin(0.5));
      const aviso = avisoNuevo(this, c, tam, 'objetos', n);
    }
  }

  ver(o, aviso) {
    quitarAviso(aviso, 'objetos', o.nivel);
    const { width: W, height: H } = this.scale;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, HEX.tinta, 0.85).setOrigin(0).setInteractive();
    // el texto va bajo el nombre; si ocupa muchas líneas, el panel crece hacia abajo y todo sube para seguir centrado
    const desc = this.add.text(W / 2, 0, o.texto, { fontFamily: FUENTE, fontSize: '22px', color: COLOR.tinta, align: 'center', wordWrap: { width: 640 } }).setOrigin(0.5, 0);
    const abajo = Math.max(230, 104 + desc.height + 28);
    const y0 = H / 2 - (abajo - 230) / 2;
    desc.setY(y0 + 104);
    const panel = this.add.graphics();
    panel.fillStyle(HEX.papel, 1).fillRoundedRect(W / 2 - 360, y0 - 230, 720, 230 + abajo, 24);
    panel.lineStyle(5, HEX.amarillo, 1).strokeRoundedRect(W / 2 - 360, y0 - 230, 720, 230 + abajo, 24);
    const img = this.add.image(W / 2, y0 - 80, claveObjeto(o));
    img.setScale(220 / Math.max(img.width, img.height));
    this.tweens.add({ targets: img, angle: { from: -5, to: 5 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const nombre = this.add.text(W / 2, y0 + 60, o.nombre, { fontFamily: FUENTE_TITULO, fontSize: '36px', color: COLOR.real, fontStyle: 'bold' }).setOrigin(0.5);
    capa.add([velo, panel, img, nombre, desc]);
    velo.on('pointerup', () => capa.destroy());
  }
}

// ---- Colección de monstruos -----------------------------------------------------------

export class MonstruosScene extends Phaser.Scene {
  constructor() {
    super('Monstruos');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    cabecera(this, texto('galerias.monstruos'), { destino: 'Albumes' });
    // en el orden de config/texts.json (el de aparición en el juego), en dos filas
    const ids = Object.keys(TEXTOS.monstruos);
    const tam = 120;
    const porFila = Math.ceil(ids.length / 2);
    const sep = Math.min(tam + 44, (W - 60) / porFila);
    ids.forEach((id, i) => {
      const fila = i < porFila ? 0 : 1;
      const col = fila ? i - porFila : i;
      const enFila = fila ? ids.length - porFila : porFila;
      const x = W / 2 + (col - (enFila - 1) / 2) * sep;
      const y = H * 0.33 + fila * (tam + 96);
      const tiene = Guardado.tieneMonstruo(id);
      const c = casilla(this, x, y, tam, { activa: tiene, alPulsar: tiene ? () => this.ver(id, aviso) : null });
      const img = ajustarTam(this.add.image(0, 0, id), tam - 28);
      if (!tiene) img.setTintFill(HEX.tinta).setAlpha(0.75);
      c.add(img);
      this.add.text(x, y + tam / 2 + 12, tiene ? texto(`monstruos.${id}.nombre`) : '', { fontFamily: FUENTE, fontSize: '17px', color: COLOR.blanco, align: 'center', wordWrap: { width: sep - 8 } }).setOrigin(0.5, 0);
      const aviso = avisoNuevo(this, c, tam, 'monstruos', id);
    });
  }

  ver(id, aviso) {
    quitarAviso(aviso, 'monstruos', id);
    const { width: W, height: H } = this.scale;
    const pw = Math.min(900, W - 60);
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, HEX.tinta, 0.85).setOrigin(0).setInteractive();
    const panel = this.add.graphics();
    capa.add([velo, panel]);
    // ficha a la derecha del dibujo: nombre, qué te hace, cómo librarte y, si hay, las variantes de algunos niveles
    const x = W / 2 - pw / 2 + 330;
    const ancho = pw - 330 - 40;
    const textos = [];
    let y = 0;
    const linea = (txt, estilo, hueco) => {
      const t = this.add.text(x, y, txt, { fontFamily: FUENTE, wordWrap: { width: ancho }, lineSpacing: 2, ...estilo });
      textos.push(t);
      y += t.height + hueco;
    };
    const ficha = TEXTOS.monstruos[id];
    linea(ficha.nombre, { fontFamily: FUENTE_TITULO, fontSize: '34px', color: COLOR.real, fontStyle: 'bold' }, 16);
    linea(texto('galerias.queHace'), { fontSize: '19px', color: COLOR.vivo, fontStyle: 'bold' }, 2);
    linea(ficha.efecto, { fontSize: '20px', color: COLOR.tinta }, 14);
    linea(texto('galerias.comoLibrarte'), { fontSize: '19px', color: COLOR.vivo, fontStyle: 'bold' }, 2);
    linea(ficha.truco, { fontSize: '20px', color: COLOR.tinta }, 14);
    if (ficha.ojo) {
      linea(texto('galerias.ojo'), { fontSize: '19px', color: COLOR.vivo, fontStyle: 'bold' }, 2);
      linea(ficha.ojo, { fontSize: '20px', color: COLOR.tinta }, 14);
    }
    // el panel crece con el texto (sin pasar de la pantalla) y queda centrado
    const ph = Math.min(H - 20, Math.max(380, y - 14 + 64));
    const arriba = H / 2 - ph / 2;
    panel.fillStyle(HEX.papel, 1).fillRoundedRect(W / 2 - pw / 2, arriba, pw, ph, 24);
    panel.lineStyle(5, HEX.amarillo, 1).strokeRoundedRect(W / 2 - pw / 2, arriba, pw, ph, 24);
    const img = ajustarTam(this.add.image(W / 2 - pw / 2 + 170, H / 2, id), 240);
    this.tweens.add({ targets: img, angle: { from: -5, to: 5 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    capa.add(img);
    for (const t of textos) t.y += arriba + 32;
    capa.add(textos);
    velo.on('pointerup', () => capa.destroy());
  }
}

// ---- Opciones -----------------------------------------------------------------------

export class OpcionesScene extends Phaser.Scene {
  constructor() {
    super('Opciones');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    cabecera(this, texto('opciones.titulo'));
    this.deslizador(W / 2, H * 0.22, texto('opciones.musica'), 'musica');
    this.deslizador(W / 2, H * 0.34, texto('opciones.efectos'), 'efectos');
    new Boton(this, W / 2, H * 0.48, texto('opciones.pantallaCompleta'), () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    }, { ancho: 420 });
    new Boton(this, W / 2, H * 0.6, texto('opciones.creditos'), () => this.scene.start('Creditos'), { ancho: 420 });
    new Boton(this, W / 2, H * 0.74, texto('opciones.borrar'), () => this.confirmarBorrar(), { ancho: 420, color: HEX.rojo, colorTexto: COLOR.blanco });
  }

  deslizador(x, y, etiqueta, opcion) {
    const ancho = 420;
    this.add.text(x - ancho / 2 - 30, y, etiqueta, { fontFamily: FUENTE, fontSize: '28px', color: COLOR.blanco }).setOrigin(1, 0.5);
    const g = this.add.graphics();
    const pomo = this.add.circle(0, y, 20, HEX.amarillo); // la joya de la marca hace de pomo
    const pinta = (v) => {
      g.clear();
      g.fillStyle(HEX.superficie, 1).fillRoundedRect(x - ancho / 2, y - 8, ancho, 16, 8);
      g.fillStyle(HEX.azulClaro, 1).fillRoundedRect(x - ancho / 2, y - 8, Math.max(16, ancho * v), 16, 8);
      pomo.x = x - ancho / 2 + ancho * v;
    };
    pinta(Guardado.opcion(opcion));
    const zona = this.add.zone(x, y, ancho + 60, 70).setInteractive({ draggable: false });
    const mover = (p) => {
      if (!p.isDown) return;
      const v = Phaser.Math.Clamp((p.x - (x - ancho / 2)) / ancho, 0, 1);
      Guardado.opcion(opcion, Math.round(v * 100) / 100);
      Audio.iniciar();
      Audio.aplicarVolumenes();
      pinta(v);
    };
    zona.on('pointerdown', mover);
    zona.on('pointermove', mover);
    zona.on('pointerup', () => opcion === 'efectos' && Audio.efecto('nota', 'C5'));
  }

  confirmarBorrar() {
    const { width: W, height: H } = this.scale;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, HEX.tinta, 0.85).setOrigin(0).setInteractive();
    const panel = this.add.graphics().fillStyle(HEX.superficie, 1).fillRoundedRect(W / 2 - 330, H / 2 - 150, 660, 300, 24);
    const t = this.add.text(W / 2, H / 2 - 60, texto('opciones.confirmarBorrar'), { fontFamily: FUENTE, fontSize: '28px', color: COLOR.blanco, align: 'center', wordWrap: { width: 580 } }).setOrigin(0.5);
    capa.add([velo, panel, t]);
    const si = new Boton(this, W / 2 - 150, H / 2 + 70, texto('opciones.si'), () => {
      Guardado.borrar();
      capa.destroy();
      const aviso = this.add.text(W / 2, H * 0.9, texto('opciones.borrado'), { fontFamily: FUENTE, fontSize: '26px', color: COLOR.hielo }).setOrigin(0.5);
      this.tweens.add({ targets: aviso, alpha: 0, delay: 1500, duration: 600 });
    }, { ancho: 240, color: HEX.rojo, colorTexto: COLOR.blanco });
    const no = new Boton(this, W / 2 + 150, H / 2 + 70, texto('opciones.no'), () => capa.destroy(), { ancho: 240 });
    capa.add([si, no]);
  }
}
