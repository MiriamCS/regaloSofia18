// Sofía por piezas, redibujada a partir del concept art (docs/concept-art/sofia, hojas S1-S7).
// Todo se dibuja en "coordenadas de rig": origen en los pies, y hacia arriba negativo.
// Vista de tres cuartos mirando a la derecha: la oreja, la mejilla del lunar y el pelo largo quedan a la izquierda.
// Cada pieza se exporta con su caja y su punto de giro para animarla por código.
import { TRAZO, ANCHO_TRAZO, azar, f, claveSol } from './comun.mjs';

// Colores sacados de las hojas de personaje
const PIEL = '#efa56f';
const PIEL_SOMBRA = '#d4865a';
const MEJILLA = '#f07f6a';
const PELO = '#2b1d1a';
const PELO_BRILLO = '#5a3a2b';
const PELO_CONTORNO = '#1d1418';
const PELO_OSCURO = '#160e0d';
const IRIS = '#4f2a17';
const PUPILA = '#1b0f0a';
const PESTANAS = '#16100f';
const BOCA = '#7a2a26';
const LENGUA = '#d9606a';
const LUNAR = '#3a2018';
const DORADO = '#e8b84a';
const FLOR_CENTRO = '#f5d26b';

// Las medidas (piernas, torso, cabeza) no cambian respecto al diseño provisional: la física de los niveles depende de ellas.
// El bebé y la niña no están aquí: se animan solo con los fotogramas de sus vídeos (tools/video-a-sprites.mjs).
export const ETAPAS = {
  // S3: vestido de flores con rebeca azul marino, medias y botas con hebilla; melena ondulada con raya al medio
  preado: {
    piernas: 32, torso: 32, anchoTorso: 27, cabeza: 36,
    pelo: { estilo: 'ondulado', largo: 'pecho' },
    traje: 'rebeca',
  },
  // S1: camiseta azul marino con estrella, vaqueros anchos y zapatillas blancas; melena muy rizada hasta la cintura
  adolescente: {
    piernas: 36, torso: 34, anchoTorso: 27, cabeza: 36,
    pelo: { estilo: 'rizado', largo: 'cintura' },
    traje: 'camiseta',
  },
  // S2: vestido de concierto azul noche con cinturón dorado y pentagrama en el bajo, tacones con pulsera
  adulta: {
    piernas: 37, torso: 36, anchoTorso: 26, cabeza: 36,
    pelo: { estilo: 'rizado', largo: 'cintura' },
    traje: 'gala',
  },
};

// Colores de cada traje
const ROPA = {
  rebeca: { tela: '#1d2850', claro: '#2c3a6c', vestido: '#26325f', flores: ['#a99be8', '#7f9be6', '#c3b4f2'], medias: '#2b2d3f', bota: '#1b1d27', hebilla: '#aeb6c6' },
  camiseta: { tela: '#273461', claro: '#33427a', estrella: '#86a3c6', vaquero: '#283a58', costura: '#41587e', zapa: '#eef0f4', zapaDetalle: '#93afd3' },
  gala: { tela: '#1e2a55', claro: '#2b3a70', zapato: '#1d2853' },
};

function medidas(e) {
  const caderaY = -e.piernas;
  const cuelloY = caderaY - e.torso;
  const hombroY = cuelloY + 6;
  const cabezaR = e.cabeza / 2;
  const cabezaCY = cuelloY - cabezaR + 4;
  const cabezaTop = cabezaCY - cabezaR;
  return { caderaY, cuelloY, hombroY, cabezaR, cabezaCY, cabezaTop };
}

const trazo = (ancho = ANCHO_TRAZO) => `stroke="${TRAZO}" stroke-width="${ancho}" stroke-linejoin="round"`;

// ---- Geometría: curvas cerradas y bordes rizados ----------------------------------

// Curva cerrada suave (Catmull-Rom) que pasa por los puntos, remuestreada a pasos iguales.
function curvaCerrada(pts, paso) {
  const densa = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    for (let k = 0; k < 12; k++) {
      const t = k / 12;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a, b, cc, d) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      densa.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  // remuestreo por longitud de arco
  let total = 0;
  const lon = [0];
  for (let i = 1; i <= densa.length; i++) {
    const a = densa[i - 1];
    const b = densa[i % densa.length];
    total += Math.hypot(b[0] - a[0], b[1] - a[1]);
    lon.push(total);
  }
  const m = Math.max(6, Math.round(total / paso));
  const out = [];
  let j = 0;
  for (let i = 0; i < m; i++) {
    const s = (i / m) * total;
    while (lon[j + 1] < s) j++;
    const a = densa[j];
    const b = densa[(j + 1) % densa.length];
    const t = (s - lon[j]) / (lon[j + 1] - lon[j] || 1);
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

function areaConSigno(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return a / 2;
}

// Borde de rizos: cada tramo se convierte en un bucle hacia fuera. amp(x, y) da la altura del bucle.
function festoneado(pts, amp, semilla) {
  const rnd = azar(semilla);
  const signo = areaConSigno(pts) > 0 ? 1 : -1;
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1;
    const nx = ((q[1] - p[1]) / l) * signo;
    const ny = (-(q[0] - p[0]) / l) * signo;
    const a = amp(mx, my) * 2 * (0.75 + rnd() * 0.5);
    d += ` Q ${f(mx + nx * a)} ${f(my + ny * a)} ${f(q[0])} ${f(q[1])}`;
  }
  return d + ' Z';
}

function dentro(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function caja(pts) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

// Textura de rizos: bucles cortos en espiral repartidos por dentro de la masa de pelo.
function bucles(pts, densidad, semilla, color = PELO_BRILLO, grosor = 1.1) {
  const rnd = azar(semilla);
  const [x0, y0, x1, y1] = caja(pts);
  const n = Math.round(((x1 - x0) * (y1 - y0)) / 30 * densidad);
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    if (!dentro(pts, x, y)) continue;
    const r = 1.8 + rnd() * 1.6;
    const a = rnd() * Math.PI * 2;
    const b = a + 2.4 + rnd() * 1.4;
    d += ` M ${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)} A ${f(r)} ${f(r)} 0 0 1 ${f(x + Math.cos(b) * r)} ${f(y + Math.sin(b) * r)}`;
  }
  return d ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round"/>` : '';
}

// Mechones verticales ondulados (tirabuzones si el paso es corto, ondas si es largo).
function mechones(xs, yArriba, yAbajo, paso, ancho, semilla, color = PELO_BRILLO, grosor = 1.2) {
  const rnd = azar(semilla);
  let d = '';
  for (const x of xs) {
    let y = yArriba(x) + rnd() * paso;
    const fin = yAbajo(x) - 1;
    let lado = rnd() < 0.5 ? 1 : -1;
    let cx = x + (rnd() - 0.5) * 2;
    d += ` M ${f(cx)} ${f(y)}`;
    while (y < fin) {
      const p = Math.min(paso, fin - y);
      d += ` Q ${f(cx + lado * ancho)} ${f(y + p / 2)} ${f(cx)} ${f(y + p)}`;
      y += p;
      lado = -lado;
    }
  }
  return d ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round"/>` : '';
}

let contadorClip = 0;
// Masa de pelo: relleno + textura recortada dentro + contorno por encima.
function masaPelo(pts, amp, semilla, textura) {
  const id = `p${contadorClip++}`;
  const d = festoneado(pts, amp, semilla);
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>` +
    `<path d="${d}" fill="${PELO}"/>` +
    `<g clip-path="url(#${id})">${textura}</g>` +
    `<path d="${d}" fill="none" stroke="${PELO_CONTORNO}" stroke-width="1.9" stroke-linejoin="round"/>`;
}

function estiloPelo(e) {
  const p = e.pelo;
  if (p.estilo === 'rizado') return { paso: 5.8, amp: 2.2 };
  return { paso: 9, amp: 2 };
}

function texturaPelo(e, pts, semilla, vertical) {
  const { estilo } = e.pelo;
  const [x0, y0, x1, y1] = caja(pts);
  let t = '';
  if (vertical) {
    const xs = [];
    const sep = estilo === 'rizado' ? 5.5 : 7;
    for (let x = x0 + 3; x < x1 - 2; x += sep) xs.push(x);
    const paso = estilo === 'rizado' ? 5 : 11;
    const ancho = estilo === 'rizado' ? 2.6 : 2.4;
    t += mechones(xs, () => y0 + 2, () => y1, paso, ancho, semilla);
    t += mechones(xs.map((x) => x + sep / 2), () => y0 + 6, () => y1, paso, ancho * 0.8, semilla + 1, PELO_OSCURO, 1.1);
  }
  if (estilo !== 'ondulado') t += bucles(pts, estilo === 'rizado' ? 0.45 : 0.7, semilla + 2, PELO_BRILLO, 1.1);
  return t;
}

// ---- Piernas -------------------------------------------------------------------------

function pie(x0, ancho, relleno, alto = 8.5) {
  // pie mirando hacia +x, apoyado en y = 0
  return `<path d="M ${f(x0 - 1)} ${f(1.5 - alto)} Q ${f(x0 - 1.5)} 0.5 ${f(x0 + 3)} 0.5 L ${f(x0 + ancho)} 0.5 Q ${f(x0 + ancho + 4)} 0.5 ${f(x0 + ancho + 2)} -4 Q ${f(x0 + ancho)} ${f(-alto)} ${f(x0 + 6)} ${f(-alto)} Z" fill="${relleno}" ${trazo()}/>`;
}

function pierna(e) {
  const { caderaY } = medidas(e);
  const L = e.piernas;
  let w = 10.5;
  let cuerpo = '';
  if (e.traje === 'rebeca') {
    const c = ROPA.rebeca;
    const x0 = -w / 2;
    const caña = 13;
    cuerpo += `<rect x="${f(x0)}" y="${f(caderaY - 2)}" width="${f(w)}" height="${f(L - 2)}" rx="${f(w / 2)}" fill="${c.medias}" ${trazo()}/>`;
    // bota: caña + pie
    cuerpo += `<path d="M ${f(x0 - 1)} ${f(-caña)} L ${f(x0 + w + 1)} ${f(-caña)} L ${f(x0 + w + 1)} -6 L ${f(x0 - 1)} -6 Z" fill="${c.bota}" ${trazo()}/>`;
    cuerpo += pie(x0, 16, c.bota, 9);
    cuerpo += `<path d="M ${f(x0 + 1)} -1.8 L ${f(x0 + 17)} -1.8" stroke="#3a3f55" stroke-width="1.3" stroke-linecap="round"/>`;
    // correa con hebilla
    cuerpo += `<path d="M ${f(x0 - 0.5)} ${f(-caña + 4)} L ${f(x0 + w + 0.5)} ${f(-caña + 4)}" stroke="#2c2f3d" stroke-width="2.4"/>`;
    cuerpo += `<rect x="${f(x0 + w - 3.5)}" y="${f(-caña + 2.4)}" width="3.4" height="3.2" fill="none" stroke="${c.hebilla}" stroke-width="1.1"/>`;
  } else if (e.traje === 'camiseta') {
    const c = ROPA.camiseta;
    const x0 = -w / 2;
    // zapatilla blanca con detalle azul claro
    cuerpo += pie(x0, 16, c.zapa, 8.5);
    cuerpo += `<path d="M ${f(x0 - 0.5)} -2 L ${f(x0 + 19)} -2" stroke="#c3c8d4" stroke-width="1.6" stroke-linecap="round"/>`;
    cuerpo += `<path d="M ${f(x0 + 5)} -5.5 q 4 2.2 9 -1" fill="none" stroke="${c.zapaDetalle}" stroke-width="2" stroke-linecap="round"/>`;
    // vaquero ancho que se abre hacia el bajo y tapa la parte de atrás de la zapatilla
    const bajo = -4.5;
    cuerpo += `<path d="M ${f(x0 - 0.5)} ${f(caderaY - 2)} L ${f(x0 + w + 0.5)} ${f(caderaY - 2)} L ${f(x0 + w + 3)} ${f(bajo)} Q ${f(x0 + w / 2)} ${f(bajo + 1.6)} ${f(x0 - 3)} ${f(bajo)} Z" fill="${c.vaquero}" ${trazo()}/>`;
    cuerpo += `<path d="M ${f(x0 + w / 2 + 1)} ${f(caderaY + 2)} L ${f(x0 + w / 2 + 2.2)} ${f(bajo - 1.5)}" stroke="${c.costura}" stroke-width="1.2" stroke-linecap="round"/>`;
    cuerpo += `<path d="M ${f(x0 - 2.6)} ${f(bajo - 2.2)} Q ${f(x0 + w / 2)} ${f(bajo - 0.8)} ${f(x0 + w + 2.6)} ${f(bajo - 2.2)}" fill="none" stroke="${c.costura}" stroke-width="1.1"/>`;
  } else if (e.traje === 'gala') {
    const c = ROPA.gala;
    w = 9;
    const x0 = -w / 2;
    cuerpo += `<rect x="${f(x0)}" y="${f(caderaY - 2)}" width="${f(w)}" height="${f(L - 1)}" rx="${f(w / 2)}" fill="${PIEL}" ${trazo()}/>`;
    // zapato de tacón con pulsera: el talón queda levantado y el tacón apoya detrás
    cuerpo += `<path d="M ${f(x0 - 0.5)} -5 Q ${f(x0 + 3)} -6.5 ${f(x0 + 7)} -4.6 Q ${f(x0 + 12)} -3.2 ${f(x0 + 16)} -3 Q ${f(x0 + 18.5)} -2.6 ${f(x0 + 18)} 0.5 L ${f(x0 + 7)} 0.5 Q ${f(x0 + 4)} -2.5 ${f(x0 + 1.8)} -2.2 L ${f(x0 + 1.8)} 0.5 L ${f(x0 - 1)} 0.5 Z" fill="${c.zapato}" ${trazo(2)}/>`;
    cuerpo += `<path d="M ${f(x0 - 0.4)} -7.6 L ${f(x0 + w + 0.4)} -7.6" stroke="${c.zapato}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  const x0 = -w / 2;
  return { cuerpo, caja: [x0 - 6, caderaY - 4, 16 + w + 12, L + 8], pivote: [0, caderaY] };
}

// ---- Brazos --------------------------------------------------------------------------

function mano(y) {
  return `<path d="M -4.8 ${f(y - 3)} Q -5.6 ${f(y + 4.6)} 0.4 ${f(y + 4.8)} Q 5.6 ${f(y + 4.6)} 5 ${f(y - 1)} Q 6.8 ${f(y - 2.6)} 5.4 ${f(y - 4.2)} Q 3.6 ${f(y - 5)} 2 ${f(y - 4)} Q -2 ${f(y - 6)} -4.8 ${f(y - 3)} Z" fill="${PIEL}" ${trazo()}/>`;
}

function brazo(e) {
  const { hombroY } = medidas(e);
  const L = e.torso * 0.86;
  const w = 9;
  const yMano = hombroY + L - 2;
  let cuerpo = '';
  const manga = (color, largo) => `<path d="M ${-w / 2 - 1} ${f(hombroY - 3)} h ${w + 2} v ${f(largo)} q ${f(-(w + 2) / 2)} 2 ${-w - 2} 0 Z" fill="${color}" ${trazo()}/>`;
  const brazoPiel = `<rect x="${-w / 2}" y="${f(hombroY - 3)}" width="${w}" height="${f(L - 2)}" rx="${w / 2}" fill="${PIEL}" ${trazo()}/>`;
  const largaEntera = (color) => `<rect x="${-w / 2}" y="${f(hombroY - 3)}" width="${w}" height="${f(L - 3)}" rx="${w / 2}" fill="${color}" ${trazo()}/>`;
  if (e.traje === 'rebeca') {
    const c = ROPA.rebeca;
    cuerpo += largaEntera(c.tela);
    cuerpo += mano(yMano);
    cuerpo += `<rect x="${-w / 2 - 0.5}" y="${f(yMano - 8)}" width="${w + 1}" height="4" rx="1.5" fill="${c.claro}" ${trazo(1.4)}/>`;
    cuerpo += `<path d="M -2.5 ${f(yMano - 7.5)} v 3 M 0 ${f(yMano - 7.5)} v 3 M 2.5 ${f(yMano - 7.5)} v 3" stroke="${c.tela}" stroke-width="0.8"/>`;
  } else if (e.traje === 'camiseta') {
    cuerpo += brazoPiel;
    cuerpo += manga(ROPA.camiseta.tela, L * 0.36);
    cuerpo += mano(yMano);
  } else {
    // vestido sin mangas: brazo al aire
    cuerpo += brazoPiel;
    cuerpo += mano(yMano);
  }
  return { cuerpo, caja: [-10, hombroY - 7, 20, L + 14], pivote: [0, hombroY] };
}

// ---- Torso ---------------------------------------------------------------------------

function tronco(W, arriba, abajo, relleno, ancho = ANCHO_TRAZO) {
  return `<path d="M ${f(-W / 2 + 3)} ${f(arriba)} Q ${f(-W / 2 - 1)} ${f(arriba + 2)} ${f(-W / 2)} ${f(arriba + 9)} L ${f(-W / 2 + 1)} ${f(abajo)} L ${f(W / 2 - 1)} ${f(abajo)} L ${f(W / 2)} ${f(arriba + 9)} Q ${f(W / 2 + 1)} ${f(arriba + 2)} ${f(W / 2 - 3)} ${f(arriba)} Z" fill="${relleno}" ${trazo(ancho)}/>`;
}

function florecita(x, y, r, color) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    s += `<circle cx="${f(x + Math.cos(a) * r)}" cy="${f(y + Math.sin(a) * r)}" r="${f(r * 0.75)}" fill="${color}"/>`;
  }
  return s + `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.5)}" fill="${FLOR_CENTRO}"/>`;
}

// Estampado de flores pequeñas dentro de un polígono
function estampado(pts, n, colores, semilla, r = 1.1) {
  const rnd = azar(semilla);
  const [x0, y0, x1, y1] = caja(pts);
  let s = '';
  let puestos = 0;
  for (let i = 0; i < n * 6 && puestos < n; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    if (!dentro(pts, x, y)) continue;
    s += florecita(x, y, r, colores[Math.floor(rnd() * colores.length)]);
    puestos++;
  }
  return s;
}

// Falda acampanada: de la cintura (y0) al bajo (y1), con el bajo ligeramente curvo
function poligonoFalda(W, y0, y1, vuelo) {
  return [[-W / 2 + 1, y0], [W / 2 - 1, y0], [W / 2 + vuelo, y1], [0, y1 + 3], [-W / 2 - vuelo, y1]];
}

function caminoFalda(W, y0, y1, vuelo) {
  return `M ${f(-W / 2 + 1)} ${f(y0)} L ${f(W / 2 - 1)} ${f(y0)} L ${f(W / 2 + vuelo)} ${f(y1)} Q 0 ${f(y1 + 5)} ${f(-W / 2 - vuelo)} ${f(y1)} Z`;
}

function torso(e) {
  const { caderaY, cuelloY } = medidas(e);
  const W = e.anchoTorso;
  const arriba = cuelloY + 3;
  const abajoY = caderaY + 4;
  let cuerpo = '';
  // cuello
  cuerpo += `<rect x="-5" y="${f(cuelloY - 4)}" width="10" height="10" fill="${PIEL_SOMBRA}" ${trazo()}/>`;
  let bajoFalda = abajoY;

  if (e.traje === 'rebeca') {
    const c = ROPA.rebeca;
    // falda del vestido de flores
    const y0 = caderaY - 5;
    const y1 = caderaY + e.piernas * 0.45;
    bajoFalda = y1 + 5;
    cuerpo += `<path d="${caminoFalda(W, y0, y1, 5)}" fill="${c.vestido}" ${trazo()}/>`;
    cuerpo += estampado(poligonoFalda(W, y0 + 1, y1 - 1, 4), 9, c.flores, 61, 1.1);
    // rebeca abierta: se ve el vestido por el centro
    cuerpo += tronco(W, arriba, caderaY - 1, c.tela);
    const panel = [[-3, arriba + 1], [6, arriba + 1], [7, caderaY - 1], [-4, caderaY - 1]];
    cuerpo += `<path d="M -3 ${f(arriba + 1)} Q 1.5 ${f(arriba + 4)} 6 ${f(arriba + 1)} L 7 ${f(caderaY - 1)} L -4 ${f(caderaY - 1)} Z" fill="${c.vestido}" ${trazo(1.4)}/>`;
    cuerpo += estampado(panel, 4, c.flores, 67, 1);
    cuerpo += `<path d="M ${f(-W / 2 + 1)} ${f(caderaY - 2.5)} L -4 ${f(caderaY - 2.5)} M 7 ${f(caderaY - 2.5)} L ${f(W / 2 - 1)} ${f(caderaY - 2.5)}" stroke="${c.claro}" stroke-width="2.6"/>`;
    for (const dy of [9, 16]) cuerpo += `<circle cx="-5.2" cy="${f(arriba + dy)}" r="1" fill="${c.claro}"/>`;
  } else if (e.traje === 'camiseta') {
    const c = ROPA.camiseta;
    // cadera del vaquero (entre las dos piernas)
    cuerpo += `<rect x="${f(-W / 2 + 1)}" y="${f(caderaY - 4)}" width="${f(W - 2)}" height="${f(abajoY - caderaY + 4)}" rx="3" fill="${c.vaquero}" ${trazo()}/>`;
    cuerpo += tronco(W, arriba, caderaY + 1.5, c.tela);
    cuerpo += `<path d="M -6 ${f(arriba + 0.5)} Q 0.5 ${f(arriba + 5)} 7 ${f(arriba + 0.5)}" fill="none" stroke="${c.claro}" stroke-width="1.8" stroke-linecap="round"/>`;
    // estrella azul claro en el pecho
    const cx = -2.5;
    const cy = arriba + 15;
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 ? 2.3 : 5.4;
      d += `${i ? 'L' : 'M'} ${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)} `;
    }
    cuerpo += `<path d="${d}Z" fill="${c.estrella}" stroke-linejoin="round"/>`;
  } else if (e.traje === 'gala') {
    const c = ROPA.gala;
    const cintura = caderaY - 6;
    // falda hasta la rodilla con pentagrama dorado en el bajo
    const y1 = caderaY + e.piernas * 0.55;
    bajoFalda = y1 + 6;
    cuerpo += `<path d="${caminoFalda(W, cintura, y1, 8)}" fill="${c.tela}" ${trazo()}/>`;
    for (let i = 0; i < 3; i++) {
      const y = y1 - 7 + i * 1.8;
      cuerpo += `<path d="M ${f(-W / 2 - 4.5)} ${f(y)} q 6 -2.4 12 0 t 12 0 t 10 0" fill="none" stroke="${DORADO}" stroke-width="0.7" opacity="0.9"/>`;
    }
    for (const [nx, ny] of [[-10, y1 - 5.8], [-1, y1 - 6.8], [8, y1 - 5]]) {
      cuerpo += `<ellipse cx="${nx}" cy="${f(ny)}" rx="1.5" ry="1.1" fill="${DORADO}" transform="rotate(-20 ${nx} ${f(ny)})"/>`;
      cuerpo += `<path d="M ${nx + 1.3} ${f(ny)} v -5" stroke="${DORADO}" stroke-width="0.8"/>`;
    }
    cuerpo += `<path d="M ${f(W / 2 + 7)} ${f(y1 - 1)} Q 0 ${f(y1 + 3.6)} ${f(-W / 2 - 7)} ${f(y1 - 1)}" fill="none" stroke="${DORADO}" stroke-width="1.4"/>`;
    // hombros y escote al aire
    cuerpo += tronco(W, arriba, cintura + 2, PIEL);
    // cuerpo del vestido con escote corazón y tirantes
    const top = arriba + 8;
    cuerpo += `<path d="M ${f(-W / 2 + 0.2)} ${f(top - 1)} Q -6 ${f(top - 3.5)} -2 ${f(top - 0.5)} Q 1.5 ${f(top + 2.6)} 1.5 ${f(top + 2.6)} Q 2 ${f(top - 0.5)} 6 ${f(top - 3)} Q ${f(W / 2 - 2)} ${f(top - 3)} ${f(W / 2 - 0.2)} ${f(top - 1)} L ${f(W / 2 - 0.5)} ${f(cintura + 1)} L ${f(-W / 2 + 0.5)} ${f(cintura + 1)} Z" fill="${c.tela}" ${trazo()}/>`;
    cuerpo += `<path d="M ${f(-W / 2 + 4.5)} ${f(top - 2.5)} L ${f(-W / 2 + 4)} ${f(arriba + 0.5)} M ${f(W / 2 - 4)} ${f(top - 2.5)} L ${f(W / 2 - 4)} ${f(arriba + 0.5)}" stroke="${c.tela}" stroke-width="2.2" stroke-linecap="round"/>`;
    // cinturón dorado
    cuerpo += `<rect x="${f(-W / 2 + 0.4)}" y="${f(cintura - 0.5)}" width="${f(W - 0.8)}" height="2.8" fill="${DORADO}" ${trazo(1.2)}/>`;
  }
  const alto = bajoFalda - (cuelloY - 6) + 4;
  return { cuerpo, caja: [-W / 2 - 14, cuelloY - 6, W + 28, alto], pivote: [0, caderaY] };
}

function collar(e) {
  const { cuelloY } = medidas(e);
  const y = cuelloY + 3;
  let cuerpo = `<path d="M -7 ${f(y)} Q 0 ${f(y + 11)} 7 ${f(y)}" fill="none" stroke="${DORADO}" stroke-width="1.2"/>`;
  cuerpo += claveSol(-2.6, y + 7, 0.24, DORADO, 1.9);
  return { cuerpo, caja: [-10, y - 3, 20, 24], pivote: [0, medidas(e).caderaY] };
}

function brilloCollar(e) {
  const { cuelloY } = medidas(e);
  const cy = cuelloY + 14;
  const cuerpo = `<defs><radialGradient id="g"><stop offset="0" stop-color="#fff6c8" stop-opacity="0.95"/><stop offset="0.4" stop-color="${DORADO}" stop-opacity="0.55"/><stop offset="1" stop-color="${DORADO}" stop-opacity="0"/></radialGradient></defs><circle cx="0" cy="${f(cy)}" r="16" fill="url(#g)"/>`;
  return { cuerpo, caja: [-16, cy - 16, 32, 32], pivote: [0, medidas(e).caderaY] };
}

// ---- Cabeza y cara -------------------------------------------------------------------

// Posiciones de la cara (vista de tres cuartos): ojo cercano a la izquierda, lejano a la derecha
function cara(e) {
  const { cabezaR: R, cabezaCY } = medidas(e);
  const ojoY = cabezaCY + 2;
  return { R, ojoY, ojos: [[-R * 0.3, 1], [R * 0.43, 0.9]], bocaX: R * 0.12, bocaY: cabezaCY + R * 0.56 };
}

function cabeza(e) {
  const { cuelloY, cabezaR: R, cabezaCY } = medidas(e);
  const { ojoY, ojos: xs } = cara(e);
  let cuerpo = '';
  // oreja (lado cercano)
  cuerpo += `<ellipse cx="${f(-R + 1)}" cy="${f(cabezaCY + 3)}" rx="4" ry="5.5" fill="${PIEL}" ${trazo()}/>`;
  cuerpo += `<path d="M ${f(-R + 0.4)} ${f(cabezaCY + 1)} q -1.8 2 0 4" fill="none" stroke="${PIEL_SOMBRA}" stroke-width="1.3" stroke-linecap="round"/>`;
  // cara redonda; la barbilla se va un poco hacia la derecha (tres cuartos)
  cuerpo += `<path d="M ${f(-R)} ${f(cabezaCY - 2)} C ${f(-R)} ${f(cabezaCY - R - 2)} ${f(R)} ${f(cabezaCY - R - 2)} ${f(R)} ${f(cabezaCY - 2)} C ${f(R)} ${f(cabezaCY + R * 0.75)} ${f(R * 0.5)} ${f(cabezaCY + R + 1)} ${f(R * 0.08)} ${f(cabezaCY + R + 1)} C ${f(-R * 0.5)} ${f(cabezaCY + R + 1)} ${f(-R)} ${f(cabezaCY + R * 0.8)} ${f(-R)} ${f(cabezaCY - 2)} Z" fill="${PIEL}" ${trazo()}/>`;
  // coloretes suaves
  cuerpo += `<ellipse cx="${f(-R * 0.5)}" cy="${f(cabezaCY + R * 0.45)}" rx="4.2" ry="2.6" fill="${MEJILLA}" opacity="0.35"/>`;
  cuerpo += `<ellipse cx="${f(R * 0.72)}" cy="${f(cabezaCY + R * 0.45)}" rx="3.4" ry="2.3" fill="${MEJILLA}" opacity="0.35"/>`;
  // cejas marcadas
  const [[x1], [x2]] = xs;
  cuerpo += `<path d="M ${f(x1 - 5.4)} ${f(ojoY - 8.4)} Q ${f(x1 - 1)} ${f(ojoY - 12.2)} ${f(x1 + 4.6)} ${f(ojoY - 10.2)}" fill="none" stroke="${PELO}" stroke-width="2.3" stroke-linecap="round"/>`;
  cuerpo += `<path d="M ${f(x2 - 3.6)} ${f(ojoY - 10.4)} Q ${f(x2 + 1)} ${f(ojoY - 12)} ${f(x2 + 4.8)} ${f(ojoY - 8.8)}" fill="none" stroke="${PELO}" stroke-width="2.1" stroke-linecap="round"/>`;
  // nariz pequeña
  cuerpo += `<path d="M ${f(R * 0.12)} ${f(ojoY + 5)} q 2.6 1.6 0.2 3.2" fill="none" stroke="${PIEL_SOMBRA}" stroke-width="1.7" stroke-linecap="round"/>`;
  // el lunar pequeño, en la mejilla del lado cercano, bajo el ojo
  cuerpo += `<circle cx="${f(-R * 0.52)}" cy="${f(ojoY + 6.5)}" r="1.25" fill="${LUNAR}"/>`;
  return { cuerpo, caja: [-R - 7, cabezaCY - R - 4, 2 * R + 14, 2 * R + 10], pivote: [0, cuelloY] };
}

function ojos(e, cerrados) {
  const { cuelloY, cabezaR: R } = medidas(e);
  const { ojoY: y, ojos: xs } = cara(e);
  let cuerpo = '';
  for (const [x, k] of xs) {
    const rx = 4.6 * k;
    const ry = 5.7;
    const ext = x < 0 ? -1 : 1; // lado del rabito del eyeliner (rabillo exterior)
    const xe = x + ext * rx;
    if (cerrados) {
      cuerpo += `<path d="M ${f(x - rx)} ${f(y)} Q ${f(x)} ${f(y + 3.8)} ${f(x + rx)} ${f(y)}" fill="none" stroke="${PESTANAS}" stroke-width="2.2" stroke-linecap="round"/>`;
      cuerpo += `<path d="M ${f(xe)} ${f(y)} l ${f(ext * 2)} -1.6" stroke="${PESTANAS}" stroke-width="1.6" stroke-linecap="round"/>`;
    } else {
      cuerpo += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="#ffffff" stroke="${TRAZO}" stroke-width="1.1"/>`;
      cuerpo += `<ellipse cx="${f(x + 0.7)}" cy="${f(y + 0.7)}" rx="${f(rx * 0.8)}" ry="${f(ry * 0.8)}" fill="${IRIS}"/>`;
      cuerpo += `<ellipse cx="${f(x + 0.9)}" cy="${f(y + 1)}" rx="${f(rx * 0.42)}" ry="${f(ry * 0.45)}" fill="${PUPILA}"/>`;
      cuerpo += `<circle cx="${f(x + 2)}" cy="${f(y - 1.6)}" r="1.5" fill="#ffffff"/>`;
      cuerpo += `<circle cx="${f(x - 0.9)}" cy="${f(y + 2.6)}" r="0.7" fill="#ffffff"/>`;
      // raya de arriba gruesa con rabito hacia fuera
      cuerpo += `<path d="M ${f(x - rx - 0.3)} ${f(y - 1.2)} Q ${f(x)} ${f(y - ry - 2.2)} ${f(x + rx + 0.3)} ${f(y - 1.2)}" fill="none" stroke="${PESTANAS}" stroke-width="2.3" stroke-linecap="round"/>`;
      cuerpo += `<path d="M ${f(xe)} ${f(y - 1.6)} l ${f(ext * 2.4)} -2" stroke="${PESTANAS}" stroke-width="1.7" stroke-linecap="round"/>`;
    }
  }
  return { cuerpo, caja: [-R, y - 10, 2 * R, 20], pivote: [0, cuelloY] };
}

function boca(e, tipo) {
  const { cuelloY, cabezaR: R } = medidas(e);
  const { bocaX: x, bocaY: y } = cara(e);
  let cuerpo = '';
  if (tipo === 'sonrisa') {
    // sonrisa amplia con la boca un poco abierta
    cuerpo += `<path d="M ${f(x - 6)} ${f(y - 1.2)} Q ${f(x)} ${f(y + 6.4)} ${f(x + 6)} ${f(y - 1.2)} Q ${f(x)} ${f(y + 1.4)} ${f(x - 6)} ${f(y - 1.2)} Z" fill="${BOCA}" stroke="${TRAZO}" stroke-width="1.3" stroke-linejoin="round"/>`;
    cuerpo += `<path d="M ${f(x - 4.6)} ${f(y - 0.3)} Q ${f(x)} ${f(y + 1.9)} ${f(x + 4.6)} ${f(y - 0.3)} L ${f(x + 4)} ${f(y + 1)} Q ${f(x)} ${f(y + 2.8)} ${f(x - 4)} ${f(y + 1)} Z" fill="#ffffff"/>`;
    cuerpo += `<path d="M ${f(x - 7)} ${f(y - 2)} q 0.6 0.5 1 1.2 M ${f(x + 7)} ${f(y - 2)} q -0.6 0.5 -1 1.2" stroke="${PIEL_SOMBRA}" stroke-width="1.1" stroke-linecap="round"/>`;
  } else if (tipo === 'canta') {
    cuerpo += `<ellipse cx="${f(x)}" cy="${f(y + 1)}" rx="3.8" ry="4.8" fill="${BOCA}" stroke="${TRAZO}" stroke-width="1.4"/>`;
    cuerpo += `<ellipse cx="${f(x)}" cy="${f(y + 3.4)}" rx="2.4" ry="1.6" fill="${LENGUA}"/>`;
  } else if (tipo === 'ay') {
    // mueca con los dientes apretados
    cuerpo += `<path d="M ${f(x - 6)} ${f(y + 1)} Q ${f(x - 3)} ${f(y - 2.6)} ${f(x)} ${f(y - 0.4)} Q ${f(x + 3)} ${f(y - 2.6)} ${f(x + 6)} ${f(y + 1)} Q ${f(x + 3)} ${f(y + 4.4)} ${f(x)} ${f(y + 3)} Q ${f(x - 3)} ${f(y + 4.6)} ${f(x - 6)} ${f(y + 1)} Z" fill="#ffffff" stroke="${TRAZO}" stroke-width="1.4" stroke-linejoin="round"/>`;
    cuerpo += `<path d="M ${f(x - 5)} ${f(y + 1.2)} Q ${f(x)} ${f(y + 0.4)} ${f(x + 5)} ${f(y + 1.2)} M ${f(x - 2)} ${f(y - 1)} v 3.6 M ${f(x + 2)} ${f(y - 1)} v 3.6" fill="none" stroke="#9aa3b8" stroke-width="0.8"/>`;
  } else if (tipo === 'sopla') {
    // mofletes hinchados que se salen de la cara y labios en «o»
    // cada moflete: relleno de piel y solo el arco de fuera con contorno
    for (const [cx, r, lado] of [[-R * 0.72, 4.8, -1], [R * 0.84, 4, 1]]) {
      const cy = y - 0.5;
      cuerpo += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${PIEL}"/>`;
      cuerpo += `<path d="M ${f(cx)} ${f(cy - r)} A ${r} ${r} 0 0 ${lado > 0 ? 1 : 0} ${f(cx)} ${f(cy + r)}" fill="none" stroke="${TRAZO}" stroke-width="1.8" stroke-linecap="round"/>`;
      cuerpo += `<circle cx="${f(cx - lado)}" cy="${f(cy)}" r="${f(r * 0.6)}" fill="${MEJILLA}" opacity="0.45"/>`;
    }
    cuerpo += `<ellipse cx="${f(x + 1.5)}" cy="${f(y + 1)}" rx="2.6" ry="2.4" fill="#c4574f" stroke="${TRAZO}" stroke-width="1.3"/>`;
    cuerpo += `<ellipse cx="${f(x + 1.5)}" cy="${f(y + 1)}" rx="1" ry="0.9" fill="${BOCA}"/>`;
  }
  return { cuerpo, caja: [-R - 2, y - 10, 2 * R + 4, 18], pivote: [0, cuelloY] };
}

function gafas(e) {
  const { cuelloY, cabezaR: R } = medidas(e);
  const { ojoY: y, ojos: xs } = cara(e);
  const color = '#24335f';
  let cuerpo = '';
  for (const [x, k] of xs) cuerpo += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(6.6 * k)}" ry="6.6" fill="#cfe6ff" fill-opacity="0.2" stroke="${color}" stroke-width="1.7"/>`;
  const a = xs[0][0] + 6.6;
  const b = xs[1][0] - 6.6 * xs[1][1];
  cuerpo += `<path d="M ${f(a)} ${f(y - 1)} Q ${f((a + b) / 2)} ${f(y - 3.5)} ${f(b)} ${f(y - 1)}" fill="none" stroke="${color}" stroke-width="1.7"/>`;
  cuerpo += `<path d="M ${f(xs[0][0] - 6.6)} ${f(y - 1)} L ${f(-R + 1)} ${f(y - 2.5)}" stroke="${color}" stroke-width="1.7"/>`;
  return { cuerpo, caja: [-R - 2, y - 9, 2 * R + 4, 18], pivote: [0, cuelloY] };
}

// ---- Pelo ----------------------------------------------------------------------------

// Hasta dónde llega la melena por detrás
function bajoMelena(e) {
  const { hombroY, caderaY, cabezaCY, cabezaR: R } = medidas(e);
  const l = e.pelo.largo;
  if (l === 'cintura') return caderaY - 1;
  if (l === 'pecho') return hombroY + e.torso * 0.5;
  return cabezaCY + R * 0.7;
}

// Masa de detrás de la cabeza: de la coronilla a los hombros
function peloAtras(e) {
  const { cabezaR: R, cabezaCY, cabezaTop, hombroY, cuelloY } = medidas(e);
  const { paso, amp } = estiloPelo(e);
  const H = (dx, dy) => [dx, cabezaCY + dy];
  const vol = e.pelo.estilo === 'rizado' ? 1 : 0.7; // los rizos abultan más
  const bajo = hombroY + 8 - cabezaCY;
  const base = [
    H(0, -R - 4 - vol * 2), H(R * 0.78, -R * 0.85), H(R + 4 + vol * 3, -R * 0.15), H(R + 5 + vol * 4, R * 0.65),
    H(R + 3 + vol * 4, bajo - 3), H(R * 0.35, bajo + 2), H(-R * 0.45, bajo + 2), H(-R - 8 - vol * 4, bajo - 2),
    H(-R - 9 - vol * 6, R * 0.35), H(-R - 6 - vol * 5, -R * 0.55), H(-R * 0.6, -R - 2 - vol * 2),
  ];
  const pts = curvaCerrada(base, paso);
  const cuerpo = masaPelo(pts, () => amp, 101, texturaPelo(e, pts, 7, true));
  const pivY = cabezaTop + 8;
  const [x0, y0, x1, y1] = caja(pts);
  return { cuerpo, caja: [x0 - 8, y0 - 8, x1 - x0 + 16, y1 - y0 + 16], pivote: [0, pivY], _cuello: cuelloY };
}

// Melena larga que cae por la espalda y se balancea
function peloPuntas(e) {
  const { cabezaR: R, hombroY } = medidas(e);
  const { paso, amp } = estiloPelo(e);
  const rizado = e.pelo.estilo === 'rizado';
  const arriba = hombroY - 6;
  const bajo = bajoMelena(e);
  const ancho = rizado ? 1 : 0.75;
  const base = [
    [-R * 0.9, arriba], [4, arriba], [7, (arriba + bajo) / 2], [4, bajo - 3], [-6, bajo + 1],
    [-R - 4 * ancho, bajo], [-R - 12 * ancho, bajo - 6], [-R - 15 * ancho, (arriba + bajo) / 2], [-R - 12 * ancho, arriba + 4],
  ];
  const pts = curvaCerrada(base, paso);
  // en el bajo los rizos son más grandes (puntas)
  const cuerpo = masaPelo(pts, (x, y) => (y > bajo - 6 ? amp * 1.35 : amp), 202, texturaPelo(e, pts, 13, true));
  const [x0, y0, x1, y1] = caja(pts);
  return { cuerpo, caja: [x0 - 8, y0 - 8, x1 - x0 + 16, y1 - y0 + 16], pivote: [-4, hombroY] };
}

// Casquete con la raya al medio y los mechones que enmarcan la cara
function peloDelante(e) {
  const { cabezaR: R, cabezaCY, cabezaTop, cuelloY } = medidas(e);
  const { paso, amp } = estiloPelo(e);
  const { estilo, largo } = e.pelo;
  const H = (dx, dy) => [dx, cabezaCY + dy];
  const rizado = estilo === 'rizado';
  // hasta dónde baja el mechón del lado lejano (por delante del hombro)
  const mechon = largo === 'cintura' ? cuelloY + 16 - cabezaCY : largo === 'pecho' ? cuelloY + 10 - cabezaCY : R * 0.45;
  const ext = rizado ? 3 : 1.5;
  const lineaPelo = [H(R * 0.62, -R * 0.42), H(R * 0.25, -R * 0.62), H(2, -R * 0.7), H(-R * 0.3, -R * 0.6), H(-R * 0.75, -R * 0.32)];
  const base = [
    H(1, -R - 4 - ext * 0.6), H(R * 0.75, -R * 0.82 - ext * 0.3), H(R + 3 + ext, -R * 0.1),
    H(R + 4 + ext, R * 0.6), H(R + 3 + ext, mechon - 2), H(R * 0.62, mechon + 1),
    H(R * 0.66, Math.min(R * 0.8, mechon - 3)), H(R * 0.82, R * 0.1),
    ...lineaPelo,
    H(-R - 1, R * 0.1), H(-R - 4 - ext * 0.6, -R * 0.1), H(-R - 3 - ext * 0.6, -R * 0.62), H(-R * 0.6, -R - 2 - ext * 0.6),
  ];
  const pts = curvaCerrada(base, paso * 0.85);
  // la línea del nacimiento del pelo va casi lisa
  const enCara = (x, y) => y > cabezaCY - R * 0.75 && x > -R * 0.85 && x < R * 0.85 && y < cabezaCY + R * 0.15;
  const ampl = (x, y) => (enCara(x, y) ? 0.4 : amp);
  let textura = '';
  // mechones que salen de la raya hacia los lados
  const rnd = azar(303);
  let d = '';
  for (let i = 0; i < 6; i++) {
    const lado = i % 2 ? 1 : -1;
    const t = 0.3 + rnd() * 0.6;
    const x0 = 1 + lado * (1 + rnd() * 3);
    const y0 = cabezaCY - R - 2 + rnd() * 3;
    d += ` M ${f(x0)} ${f(y0)} Q ${f(x0 + lado * R * t)} ${f(y0 + 1)} ${f(lado * (R * 0.7 + rnd() * 5))} ${f(cabezaCY - R * (0.1 + rnd() * 0.4))}`;
  }
  textura += `<path d="${d}" fill="none" stroke="${PELO_BRILLO}" stroke-width="1.3" stroke-linecap="round"/>`;
  textura += mechones([R * 0.85, R + 3.5], () => cabezaCY, () => cabezaCY + mechon, rizado ? 5 : 10, 2.2, 31);
  if (estilo !== 'ondulado') textura += bucles(pts, 0.35, 41);
  let cuerpo = masaPelo(pts, ampl, 404, textura);
  // la raya al medio
  cuerpo += `<path d="M 2 ${f(cabezaTop + 1.5)} Q 1.6 ${f(cabezaTop + 4)} 2 ${f(cabezaCY - R * 0.68)}" fill="none" stroke="${PIEL_SOMBRA}" stroke-width="1.3" stroke-linecap="round"/>`;
  const [x0, y0, x1, y1] = caja(pts);
  const top = Math.min(y0, cabezaTop - 14);
  return { cuerpo, caja: [x0 - 8, top - 6, x1 - x0 + 16, y1 - top + 14], pivote: [0, cuelloY] };
}

export function piezasSofia(nombreEtapa) {
  const e = ETAPAS[nombreEtapa];
  contadorClip = 0;
  const piezas = {
    'pelo-puntas': peloPuntas(e),
    'pelo-atras': peloAtras(e),
    pierna: pierna(e),
    brazo: brazo(e),
    torso: torso(e),
    collar: collar(e),
    'collar-brillo': brilloCollar(e),
    cabeza: cabeza(e),
    ojos: ojos(e, false),
    'ojos-cerrados': ojos(e, true),
    'boca-sonrisa': boca(e, 'sonrisa'),
    'boca-canta': boca(e, 'canta'),
    'boca-ay': boca(e, 'ay'),
    'boca-sopla': boca(e, 'sopla'),
    gafas: gafas(e),
    'pelo-delante': peloDelante(e),
  };
  for (const k of Object.keys(piezas)) if (!piezas[k]) delete piezas[k];
  return { piezas, medidas: { ...medidas(e), piernas: e.piernas, torso: e.torso, alto: -medidas(e).cabezaTop } };
}
