// Sofía por piezas (PROVISIONAL hasta tener el concept art de ChatGPT).
// Todo se dibuja en "coordenadas de rig": origen en los pies, y hacia arriba negativo.
// Cada pieza se exporta con su caja y su punto de giro para animarla por código.
import { TRAZO, ANCHO_TRAZO, azar, f, claveSol } from './comun.mjs';

const PIEL = '#eab894';
const PIEL_SOMBRA = '#d49f7c';
const PELO = '#17161c';
const PELO_BRILLO = '#4b4a5e';
const OJOS = '#3a2215';
const BOCA = '#8f2a36';
const DORADO = '#e8b84a';

export const ETAPAS = {
  bebe: {
    piernas: 16, torso: 26, anchoTorso: 30, cabeza: 38, pelo: 'corto',
    ropa: { arriba: '#a8d4f5', abajo: '#a8d4f5', manga: '#a8d4f5', mangaLarga: true, pie: '#a8d4f5', pierna: '#a8d4f5', detalle: '#ffffff', falda: null },
  },
  nina: {
    piernas: 26, torso: 28, anchoTorso: 26, cabeza: 37, pelo: 'medio',
    ropa: { arriba: '#ffffff', abajo: '#2f6fdc', manga: '#ffffff', mangaLarga: false, pie: '#1d3b8a', pierna: PIEL, calcetin: '#ffffff', detalle: '#f5c542', falda: '#2f6fdc', pichi: true },
  },
  preado: {
    piernas: 32, torso: 32, anchoTorso: 27, cabeza: 36, pelo: 'largo',
    ropa: { arriba: '#2bb3c0', abajo: '#3e64a8', manga: '#2bb3c0', mangaLarga: true, pie: '#f4f6fb', pierna: '#3e64a8', detalle: '#ffffff', falda: null, capucha: true },
  },
  adolescente: {
    piernas: 36, torso: 34, anchoTorso: 27, cabeza: 36, pelo: 'largo',
    ropa: { arriba: '#3a3f9e', abajo: '#1e2440', manga: '#3a3f9e', mangaLarga: false, pie: '#e9ecff', pierna: '#1e2440', detalle: '#7df9ff', falda: null, estrella: true },
  },
  adulta: {
    piernas: 37, torso: 36, anchoTorso: 26, cabeza: 36, pelo: 'largo',
    ropa: { arriba: '#1b2b6b', abajo: '#1b2b6b', manga: '#1b2b6b', mangaLarga: false, pie: '#0e1640', pierna: PIEL, detalle: DORADO, falda: '#1b2b6b', vestido: true },
  },
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

// ---- Piezas ---------------------------------------------------------------

function pierna(e) {
  const { caderaY } = medidas(e);
  const L = e.piernas;
  const r = e.ropa;
  const w = e === ETAPAS.bebe ? 13 : 10.5;
  const x0 = -w / 2;
  let cuerpo = '';
  // pierna
  cuerpo += `<rect x="${f(x0)}" y="${f(caderaY - 2)}" width="${f(w)}" height="${f(L - 2)}" rx="${f(w / 2)}" fill="${r.pierna}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  if (r.calcetin) {
    cuerpo += `<rect x="${f(x0 + 0.6)}" y="${f(-L * 0.42)}" width="${f(w - 1.2)}" height="${f(L * 0.36)}" fill="${r.calcetin}"/>`;
  }
  // pie (apunta hacia +x)
  const pieW = e === ETAPAS.bebe ? 15 : 16;
  cuerpo += `<path d="M ${f(x0 - 1)} -7 Q ${f(x0 - 1)} 0.5 ${f(x0 + 3)} 0.5 L ${f(x0 + pieW)} 0.5 Q ${f(x0 + pieW + 4)} 0.5 ${f(x0 + pieW + 2)} -4 Q ${f(x0 + pieW)} -8 ${f(x0 + 6)} -8.5 Z" fill="${r.pie}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}" stroke-linejoin="round"/>`;
  if (r.pie === '#f4f6fb' || r.pie === '#e9ecff') {
    cuerpo += `<path d="M ${f(x0 + 4)} -3 L ${f(x0 + pieW)} -3" stroke="${r.detalle === '#ffffff' ? '#2f6fdc' : '#8b6cff'}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return { cuerpo, caja: [x0 - 4, caderaY - 4, pieW + w + 8, L + 8], pivote: [0, caderaY] };
}

function brazo(e) {
  const { hombroY } = medidas(e);
  const L = e.torso * 0.86;
  const r = e.ropa;
  const w = 9;
  let cuerpo = '';
  cuerpo += `<rect x="${-w / 2}" y="${f(hombroY - 3)}" width="${w}" height="${f(L)}" rx="${w / 2}" fill="${r.mangaLarga ? r.manga : PIEL}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  if (!r.mangaLarga) {
    cuerpo += `<path d="M ${-w / 2 - 1} ${f(hombroY - 3)} h ${w + 2} v ${f(L * 0.38)} h ${-w - 2} Z" fill="${r.manga}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}" stroke-linejoin="round"/>`;
  }
  // mano
  cuerpo += `<circle cx="0.5" cy="${f(hombroY + L - 2)}" r="5.6" fill="${PIEL}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  return { cuerpo, caja: [-10, hombroY - 7, 20, L + 14], pivote: [0, hombroY] };
}

function torso(e) {
  const { caderaY, cuelloY } = medidas(e);
  const r = e.ropa;
  const W = e.anchoTorso;
  const arriba = cuelloY + 3;
  let cuerpo = '';
  // cuello
  cuerpo += `<rect x="-5" y="${f(cuelloY - 4)}" width="10" height="10" fill="${PIEL_SOMBRA}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  // tronco base
  const abajoY = caderaY + 4;
  cuerpo += `<path d="M ${f(-W / 2 + 3)} ${f(arriba)} Q ${f(-W / 2 - 1)} ${f(arriba + 2)} ${f(-W / 2)} ${f(arriba + 9)} L ${f(-W / 2 + 1)} ${f(abajoY)} L ${f(W / 2 - 1)} ${f(abajoY)} L ${f(W / 2)} ${f(arriba + 9)} Q ${f(W / 2 + 1)} ${f(arriba + 2)} ${f(W / 2 - 3)} ${f(arriba)} Z" fill="${r.arriba}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}" stroke-linejoin="round"/>`;
  if (r.pichi) {
    // pichi del uniforme escolar
    cuerpo += `<path d="M ${f(-W / 2 + 4)} ${f(arriba + 9)} L ${f(W / 2 - 4)} ${f(arriba + 9)} L ${f(W / 2 - 1)} ${f(abajoY)} L ${f(-W / 2 + 1)} ${f(abajoY)} Z" fill="${r.abajo}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}" stroke-linejoin="round"/>`;
    cuerpo += `<path d="M ${f(-W / 2 + 6)} ${f(arriba + 9)} L ${f(-W / 2 + 7)} ${f(arriba)} M ${f(W / 2 - 6)} ${f(arriba + 9)} L ${f(W / 2 - 7)} ${f(arriba)}" stroke="${r.abajo}" stroke-width="3" stroke-linecap="round"/>`;
  }
  if (r.capucha) {
    cuerpo += `<path d="M -9 ${f(arriba)} Q 0 ${f(arriba + 9)} 9 ${f(arriba)}" fill="none" stroke="${TRAZO}" stroke-width="2"/>`;
    cuerpo += `<path d="M -4 ${f(arriba + 5)} v 9 M 4 ${f(arriba + 5)} v 9" stroke="${r.detalle}" stroke-width="1.8" stroke-linecap="round"/>`;
    cuerpo += `<rect x="${f(-W / 2 + 4)}" y="${f(abajoY - 10)}" width="${f(W - 8)}" height="7" rx="3" fill="none" stroke="${TRAZO}" stroke-width="1.6"/>`;
  }
  if (r.estrella) {
    const cy = arriba + 15;
    cuerpo += `<path d="M 3 ${f(cy - 5)} L 4.6 ${f(cy - 1.4)} L 8.5 ${f(cy - 1)} L 5.6 ${f(cy + 1.6)} L 6.5 ${f(cy + 5.4)} L 3 ${f(cy + 3.4)} L -0.5 ${f(cy + 5.4)} L 0.4 ${f(cy + 1.6)} L -2.5 ${f(cy - 1)} L 1.4 ${f(cy - 1.4)} Z" fill="${r.detalle}" opacity="0.9"/>`;
  }
  if (r.vestido) {
    cuerpo += `<path d="M ${f(-W / 2 + 1)} ${f(caderaY - 6)} L ${f(W / 2 - 1)} ${f(caderaY - 6)}" stroke="${r.detalle}" stroke-width="2.4"/>`;
  }
  if (e === ETAPAS.bebe) {
    // botones del pelele
    cuerpo += `<circle cx="0" cy="${f(arriba + 10)}" r="1.8" fill="${r.detalle}"/><circle cx="0" cy="${f(arriba + 17)}" r="1.8" fill="${r.detalle}"/>`;
  }
  // falda o vestido (vuela un poco por fuera de la cadera)
  if (r.falda) {
    const largo = r.vestido ? e.piernas * 0.55 : e.piernas * 0.32;
    const y0 = caderaY - 4;
    cuerpo += `<path d="M ${f(-W / 2 + 1)} ${f(y0)} L ${f(W / 2 - 1)} ${f(y0)} L ${f(W / 2 + 7)} ${f(y0 + largo)} Q 0 ${f(y0 + largo + 4)} ${f(-W / 2 - 7)} ${f(y0 + largo)} Z" fill="${r.falda}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}" stroke-linejoin="round"/>`;
    if (r.vestido) {
      cuerpo += `<path d="M ${f(W / 2 + 5.5)} ${f(y0 + largo - 2.5)} Q 0 ${f(y0 + largo + 1.5)} ${f(-W / 2 - 5.5)} ${f(y0 + largo - 2.5)}" fill="none" stroke="${r.detalle}" stroke-width="1.8"/>`;
    }
  }
  const alto = caderaY - cuelloY + e.piernas * 0.6 + 16;
  return { cuerpo, caja: [-W / 2 - 10, cuelloY - 6, W + 20, alto], pivote: [0, caderaY] };
}

function collar(e) {
  const { cuelloY } = medidas(e);
  const y = cuelloY + 3;
  let cuerpo = `<path d="M -7 ${f(y)} Q 0 ${f(y + 11)} 7 ${f(y)}" fill="none" stroke="${DORADO}" stroke-width="1.4"/>`;
  cuerpo += claveSol(-2.6, y + 7, 0.24, DORADO, 1.9);
  return { cuerpo, caja: [-10, y - 3, 20, 24], pivote: [0, medidas(e).caderaY] };
}

function brilloCollar(e) {
  const { cuelloY } = medidas(e);
  const cy = cuelloY + 14;
  const cuerpo = `<defs><radialGradient id="g"><stop offset="0" stop-color="#fff6c8" stop-opacity="0.95"/><stop offset="0.4" stop-color="${DORADO}" stop-opacity="0.55"/><stop offset="1" stop-color="${DORADO}" stop-opacity="0"/></radialGradient></defs><circle cx="0" cy="${f(cy)}" r="16" fill="url(#g)"/>`;
  return { cuerpo, caja: [-16, cy - 16, 32, 32], pivote: [0, medidas(e).caderaY] };
}

function cabeza(e) {
  const { cuelloY, cabezaR, cabezaCY } = medidas(e);
  const R = cabezaR;
  let cuerpo = '';
  // orejas
  cuerpo += `<ellipse cx="${f(-R + 1)}" cy="${f(cabezaCY + 3)}" rx="4" ry="5.5" fill="${PIEL}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  // cara (un pelín más ancha abajo, cartoon)
  cuerpo += `<path d="M ${f(-R)} ${f(cabezaCY - 2)} C ${f(-R)} ${f(cabezaCY - R - 2)} ${f(R)} ${f(cabezaCY - R - 2)} ${f(R)} ${f(cabezaCY - 2)} C ${f(R)} ${f(cabezaCY + R * 0.8)} ${f(R * 0.45)} ${f(cabezaCY + R + 1)} 0 ${f(cabezaCY + R + 1)} C ${f(-R * 0.45)} ${f(cabezaCY + R + 1)} ${f(-R)} ${f(cabezaCY + R * 0.8)} ${f(-R)} ${f(cabezaCY - 2)} Z" fill="${PIEL}" stroke="${TRAZO}" stroke-width="${ANCHO_TRAZO}"/>`;
  // mejillas sonrosadas
  cuerpo += `<ellipse cx="${f(-R * 0.42)}" cy="${f(cabezaCY + R * 0.42)}" rx="4.2" ry="2.6" fill="#f2907e" opacity="0.45"/>`;
  cuerpo += `<ellipse cx="${f(R * 0.72)}" cy="${f(cabezaCY + R * 0.42)}" rx="3.6" ry="2.4" fill="#f2907e" opacity="0.45"/>`;
  // cejas marcadas
  const ojoY = cabezaCY + 2;
  cuerpo += `<path d="M ${f(-R * 0.55)} ${f(ojoY - 9)} q 4.5 -3.4 8.5 -0.6" fill="none" stroke="${PELO}" stroke-width="2.8" stroke-linecap="round"/>`;
  cuerpo += `<path d="M ${f(R * 0.2)} ${f(ojoY - 9.6)} q 4.5 -3 8 0" fill="none" stroke="${PELO}" stroke-width="2.8" stroke-linecap="round"/>`;
  // nariz
  cuerpo += `<path d="M ${f(R * 0.3)} ${f(ojoY + 4)} q 2.5 2.4 -0.4 3.6" fill="none" stroke="${PIEL_SOMBRA}" stroke-width="1.8" stroke-linecap="round"/>`;
  // lunar pequeño en la mejilla
  cuerpo += `<circle cx="${f(R * 0.62)}" cy="${f(cabezaCY + R * 0.3)}" r="1.15" fill="#5a3322"/>`;
  return { cuerpo, caja: [-R - 7, cabezaCY - R - 4, 2 * R + 14, 2 * R + 10], pivote: [0, cuelloY] };
}

function ojos(e, cerrados) {
  const { cuelloY, cabezaR: R, cabezaCY } = medidas(e);
  const y = cabezaCY + 2;
  const xs = [-R * 0.3, R * 0.43];
  let cuerpo = '';
  for (const x of xs) {
    if (cerrados) {
      cuerpo += `<path d="M ${f(x - 4)} ${f(y + 0.5)} q 4 3.2 8 0" fill="none" stroke="${OJOS}" stroke-width="2.2" stroke-linecap="round"/>`;
    } else {
      cuerpo += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="4.4" ry="5.6" fill="#ffffff" stroke="${TRAZO}" stroke-width="1.4"/>`;
      cuerpo += `<ellipse cx="${f(x + 0.9)}" cy="${f(y + 0.6)}" rx="3.2" ry="4.4" fill="${OJOS}"/>`;
      cuerpo += `<circle cx="${f(x + 2)}" cy="${f(y - 1.4)}" r="1.4" fill="#ffffff"/>`;
      // pestaña de arriba
      cuerpo += `<path d="M ${f(x - 4.6)} ${f(y - 3)} q 4.6 -4.6 9.4 -0.4" fill="none" stroke="${TRAZO}" stroke-width="1.9" stroke-linecap="round"/>`;
    }
  }
  return { cuerpo, caja: [-R, y - 9, 2 * R, 18], pivote: [0, cuelloY] };
}

function boca(e, tipo) {
  const { cuelloY, cabezaR: R, cabezaCY } = medidas(e);
  const x = R * 0.12;
  const y = cabezaCY + R * 0.56;
  let cuerpo = '';
  if (tipo === 'sonrisa') {
    // sonrisa amplia
    cuerpo += `<path d="M ${f(x - 7.5)} ${f(y - 1.5)} Q ${f(x)} ${f(y + 8)} ${f(x + 7.5)} ${f(y - 1.5)} Q ${f(x)} ${f(y + 1.6)} ${f(x - 7.5)} ${f(y - 1.5)} Z" fill="${BOCA}" stroke="${TRAZO}" stroke-width="1.5" stroke-linejoin="round"/>`;
    cuerpo += `<path d="M ${f(x - 5.8)} ${f(y - 0.6)} Q ${f(x)} ${f(y + 1.8)} ${f(x + 5.8)} ${f(y - 0.6)} L ${f(x + 5)} ${f(y + 0.9)} Q ${f(x)} ${f(y + 2.8)} ${f(x - 5)} ${f(y + 0.9)} Z" fill="#ffffff"/>`;
  } else if (tipo === 'canta') {
    cuerpo += `<ellipse cx="${f(x)}" cy="${f(y + 1)}" rx="4.4" ry="5.4" fill="${BOCA}" stroke="${TRAZO}" stroke-width="1.5"/>`;
    cuerpo += `<ellipse cx="${f(x)}" cy="${f(y + 3.4)}" rx="2.6" ry="1.8" fill="#e0606e"/>`;
  } else if (tipo === 'ay') {
    cuerpo += `<path d="M ${f(x - 6)} ${f(y + 2)} q 3 -4 6 0 q 3 4 6 0" fill="none" stroke="${TRAZO}" stroke-width="2" stroke-linecap="round"/>`;
  } else if (tipo === 'sopla') {
    cuerpo += `<ellipse cx="${f(x + 1)}" cy="${f(y + 1)}" rx="2.4" ry="2.2" fill="${BOCA}" stroke="${TRAZO}" stroke-width="1.5"/>`;
    // mofletes hinchados
    cuerpo += `<circle cx="${f(-R * 0.45)}" cy="${f(y - 2)}" r="5" fill="#f2907e" opacity="0.35"/><circle cx="${f(R * 0.72)}" cy="${f(y - 2)}" r="4.5" fill="#f2907e" opacity="0.35"/>`;
  }
  return { cuerpo, caja: [-R, y - 8, 2 * R, 16], pivote: [0, cuelloY] };
}

function gafas(e) {
  const { cuelloY, cabezaR: R, cabezaCY } = medidas(e);
  const y = cabezaCY + 2;
  const xs = [-R * 0.3, R * 0.43];
  let cuerpo = '';
  for (const x of xs) cuerpo += `<circle cx="${f(x)}" cy="${f(y)}" r="6.6" fill="#cfe6ff" fill-opacity="0.25" stroke="#1d3b8a" stroke-width="1.9"/>`;
  cuerpo += `<path d="M ${f(xs[0] + 6.6)} ${f(y - 1)} Q ${f((xs[0] + xs[1]) / 2)} ${f(y - 4)} ${f(xs[1] - 6.6)} ${f(y - 1)}" fill="none" stroke="#1d3b8a" stroke-width="1.9"/>`;
  cuerpo += `<path d="M ${f(xs[0] - 6.6)} ${f(y - 1)} L ${f(-R)} ${f(y - 3)}" stroke="#1d3b8a" stroke-width="1.9"/>`;
  return { cuerpo, caja: [-R - 2, y - 9, 2 * R + 4, 18], pivote: [0, cuelloY] };
}

// Pelo muy rizado: muchos círculos con contorno común y brillos en espiral.
function rizos(circulos, semilla) {
  const rnd = azar(semilla);
  let contorno = '';
  let relleno = '';
  let brillos = '';
  for (const [x, y, r] of circulos) {
    contorno += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + ANCHO_TRAZO)}" fill="${TRAZO}"/>`;
    relleno += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${PELO}"/>`;
    if (rnd() < 0.55) {
      const a = rnd() * Math.PI * 2;
      const rr = r * 0.55;
      const x1 = x + Math.cos(a) * rr;
      const y1 = y + Math.sin(a) * rr;
      const x2 = x + Math.cos(a + 2.2) * rr;
      const y2 = y + Math.sin(a + 2.2) * rr;
      brillos += `<path d="M ${f(x1)} ${f(y1)} A ${f(rr)} ${f(rr)} 0 0 1 ${f(x2)} ${f(y2)}" fill="none" stroke="${PELO_BRILLO}" stroke-width="1.5" stroke-linecap="round"/>`;
    }
  }
  return contorno + relleno + brillos;
}

function masaRizos(cx, cy, rx, ry, radio, semilla, densidad = 1) {
  // rellena una elipse con rizos: anillo exterior + interior
  const rnd = azar(semilla);
  const c = [];
  const nBorde = Math.round(((rx + ry) / radio) * 2.6 * densidad);
  for (let i = 0; i < nBorde; i++) {
    const a = (i / nBorde) * Math.PI * 2 + rnd() * 0.2;
    const r = radio * (0.8 + rnd() * 0.45);
    c.push([cx + Math.cos(a) * (rx - r * 0.5), cy + Math.sin(a) * (ry - r * 0.5), r]);
  }
  const nDentro = Math.round(((rx * ry) / (radio * radio)) * 0.9 * densidad);
  for (let i = 0; i < nDentro; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 0.75;
    c.push([cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, radio * (0.85 + rnd() * 0.4)]);
  }
  return c;
}

function peloAtras(e) {
  const { cabezaR: R, cabezaCY, cabezaTop, hombroY, cuelloY } = medidas(e);
  let c;
  let bajo;
  if (e.pelo === 'corto') {
    c = masaRizos(-1, cabezaCY - 3, R + 5, R + 2, 6.5, 11);
    bajo = cabezaCY + R;
  } else if (e.pelo === 'medio') {
    bajo = hombroY + 6;
    c = masaRizos(-3, (cabezaTop + bajo) / 2 + 2, R + 9, (bajo - cabezaTop) / 2 + 3, 7.5, 21);
  } else {
    bajo = hombroY + 12;
    c = masaRizos(-4, (cabezaTop + bajo) / 2 + 2, R + 11, (bajo - cabezaTop) / 2 + 4, 8, 31);
  }
  const pivY = cabezaTop + 8;
  const top = cabezaTop - 16;
  return { cuerpo: rizos(c, 5), caja: [-R - 26, top, 2 * R + 46, bajo - top + 22], pivote: [0, pivY], _bajo: bajo, _cuello: cuelloY };
}

function peloPuntas(e) {
  const { cabezaR: R, hombroY, caderaY, cuelloY } = medidas(e);
  if (e.pelo === 'corto') return null;
  const arriba = e.pelo === 'medio' ? hombroY : hombroY + 4;
  const bajo = e.pelo === 'medio' ? hombroY + 14 : cuelloY + e.torso * 0.72;
  const c = masaRizos(-7, (arriba + bajo) / 2, R + 5, (bajo - arriba) / 2 + 4, 7.5, 41, 1.1);
  return { cuerpo: rizos(c, 9), caja: [-R - 24, arriba - 18, 2 * R + 34, bajo - arriba + 38], pivote: [-4, arriba] };
}

function peloDelante(e) {
  const { cabezaR: R, cabezaCY, cabezaTop, cuelloY } = medidas(e);
  // Raya al medio: dos mechones que bajan desde la raya hacia los lados.
  const rnd = azar(77);
  const c = [];
  const raya = 1.5;
  for (const lado of [-1, 1]) {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const a = -Math.PI / 2 + lado * (0.25 + t * 1.45);
      const r = 6 + rnd() * 2.2;
      c.push([raya + Math.cos(a) * (R + 1.5) - lado * 0.5, cabezaCY - 2 + Math.sin(a) * (R + 1), r]);
    }
  }
  // mechones laterales que enmarcan la cara (más largos con la edad)
  const largo = e.pelo === 'corto' ? 0 : e.pelo === 'medio' ? 2 : 3;
  for (let i = 0; i < largo; i++) {
    c.push([-R - 2, cabezaCY + 6 + i * 9, 6.5 + rnd() * 1.5]);
  }
  let cuerpo = rizos(c, 13);
  // la raya al medio
  cuerpo += `<path d="M ${f(raya)} ${f(cabezaTop - 3)} q -0.8 5 -3 8" fill="none" stroke="${PIEL_SOMBRA}" stroke-width="1.6" stroke-linecap="round"/>`;
  return { cuerpo, caja: [-R - 12, cabezaTop - 14, 2 * R + 24, 2 * R + 14 + largo * 9], pivote: [0, cuelloY] };
}

export function piezasSofia(nombreEtapa) {
  const e = ETAPAS[nombreEtapa];
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
