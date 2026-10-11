// Elementos del escenario e interfaz: atril (checkpoint), velas, cajas, meta, tarta, botones...
import { TRAZO, ANCHO_TRAZO as T, claveSol, f } from './comun.mjs';

const t = `stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round" stroke-linecap="round"`;
// trazo grueso (no repetir stroke-width tras ${t}: un atributo duplicado invalida el SVG entero)
const t4 = `stroke="${TRAZO}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
const DORADO = '#e8b84a';

function vela(encendida) {
  let s = `<rect x="9" y="22" width="12" height="32" rx="3" fill="#8fd0ff" ${t}/><path d="M 9 30 l 12 -4 M 9 40 l 12 -4 M 9 50 l 12 -4" stroke="#ffffff" stroke-width="2.2"/>`;
  s += `<path d="M 15 22 v -5" stroke="${TRAZO}" stroke-width="2" stroke-linecap="round"/>`;
  if (encendida) {
    s += `<path d="M 15 2 Q 23 12 15 18 Q 7 12 15 2 Z" fill="#ffb300" stroke="#e07b00" stroke-width="1.5"/><path d="M 15 8 Q 19 13 15 16 Q 11 13 15 8 Z" fill="#fff3b0"/>`;
  } else {
    s += `<path d="M 15 16 q -4 -5 1 -9 q 4 -3 0 -7" fill="none" stroke="#9aa7c7" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>`;
  }
  return { w: 30, h: 56, cuerpo: s };
}

function atril(encendido) {
  const papel = encendido ? '#fff6c8' : '#e6ebf5';
  let s = '';
  if (encendido) s += `<defs><radialGradient id="h"><stop offset="0" stop-color="#fff3a0" stop-opacity="0.9"/><stop offset="1" stop-color="#fff3a0" stop-opacity="0"/></radialGradient></defs><circle cx="40" cy="34" r="38" fill="url(#h)"/>`;
  s += `<path d="M 40 52 L 40 118 M 40 118 L 22 128 M 40 118 L 58 128 M 40 118 L 40 128" ${t4} fill="none"/>`;
  s += `<path d="M 10 20 L 70 20 L 64 54 L 16 54 Z" fill="#3b4256" ${t}/>`;
  s += `<rect x="18" y="14" width="44" height="34" rx="2" fill="${papel}" ${t}/>`;
  for (const y of [22, 28, 34, 40]) s += `<path d="M 22 ${y} h 36" stroke="#9aa7c7" stroke-width="1.2"/>`;
  s += claveSol(22, 17, 0.52, encendido ? DORADO : '#7e8aa8', 2.2);
  s += `<circle cx="44" cy="34" r="2.6" fill="${TRAZO}"/><path d="M 46.4 34 V 24" stroke="${TRAZO}" stroke-width="1.6"/><circle cx="52" cy="28" r="2.6" fill="${TRAZO}"/><path d="M 54.4 28 V 19" stroke="${TRAZO}" stroke-width="1.6"/>`;
  return { w: 80, h: 132, cuerpo: s };
}

function caja(color, claro, simbolo) {
  return { w: 48, h: 48, cuerpo:
    `<rect x="2" y="2" width="44" height="44" rx="5" fill="${color}" ${t}/>` +
    `<rect x="8" y="8" width="32" height="32" rx="3" fill="${claro}" stroke="${TRAZO}" stroke-width="1.6"/>` +
    `<text x="24" y="33" font-family="Georgia, serif" font-weight="bold" font-size="22" text-anchor="middle" fill="${color}">${simbolo}</text>` };
}

function notaMusical(color) {
  return { w: 32, h: 40, cuerpo: `<ellipse cx="11" cy="31" rx="8" ry="6" transform="rotate(-20 11 31)" fill="${color}" stroke="${TRAZO}" stroke-width="1.6"/><path d="M 18 29 V 5 Q 26 8 29 16" fill="none" stroke="${TRAZO}" stroke-width="2.6" stroke-linecap="round"/>` };
}

function tarta() {
  // 480x340. Las 18 velas se dibujan en el juego encima (posiciones en el código).
  let s = '';
  s += `<ellipse cx="240" cy="318" rx="230" ry="20" fill="#d9e3f5" ${t}/>`;
  // piso de abajo
  s += `<path d="M 40 190 L 40 300 Q 240 336 440 300 L 440 190 Z" fill="#7fb3ff" ${t}/>`;
  s += `<ellipse cx="240" cy="190" rx="200" ry="34" fill="#a9ccff" ${t}/>`;
  s += `<path d="M 40 196 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0 q 20 30 40 0" fill="#ffffff" ${t}/>`;
  // piso de arriba
  s += `<path d="M 100 110 L 100 196 Q 240 222 380 196 L 380 110 Z" fill="#3f7fe0" ${t}/>`;
  s += `<ellipse cx="240" cy="110" rx="140" ry="26" fill="#6fa0f0" ${t}/>`;
  s += `<path d="M 100 116 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0 q 14 24 28 0" fill="#ffffff" ${t}/>`;
  // claves de sol doradas en el lateral
  for (const x of [80, 170, 290, 380]) s += claveSol(x - 6, 228, 0.9, DORADO, 3.2);
  s += `<text x="240" y="176" font-family="Georgia, serif" font-weight="bold" font-size="40" text-anchor="middle" fill="${DORADO}" stroke="${TRAZO}" stroke-width="1.5">18</text>`;
  return { w: 480, h: 340, cuerpo: s };
}

function boton(simbolo) {
  return { w: 128, h: 128, cuerpo: `<circle cx="64" cy="64" r="58" fill="#0d1b3d" fill-opacity="0.35" stroke="#ffffff" stroke-width="5"/>${simbolo}` };
}

export function spritesEscenario() {
  return {
    'vela-on': vela(true),
    'vela-off': vela(false),
    'vela-cuerpo': { w: 30, h: 56, cuerpo: vela(false).cuerpo.replace(/<path d="M 15 16 q[^>]*>/, '') },
    'atril-off': atril(false),
    'atril-on': atril(true),
    'caja-juguete': caja('#3f8cff', '#bfe0ff', 'A'),
    'caja-madera': caja('#b07a45', '#e0b383', '♪'),
    'caja-carton': caja('#c8a26a', '#e6cc9e', '✉'),
    'caja-libros': caja('#2b3f8f', '#9fb5ff', '≡'),
    mueble: { w: 144, h: 96, cuerpo: `<rect x="3" y="3" width="138" height="88" rx="6" fill="#b07a45" ${t}/><rect x="12" y="12" width="56" height="70" rx="3" fill="#c9915a" ${t}/><rect x="76" y="12" width="56" height="70" rx="3" fill="#c9915a" ${t}/><circle cx="60" cy="47" r="4" fill="${DORADO}" ${t}/><circle cx="84" cy="47" r="4" fill="${DORADO}" ${t}/>` },
    pinchos: { w: 48, h: 24, cuerpo: `<path d="M 1 23 L 7 3 L 13 23 L 19 3 L 25 23 L 31 3 L 37 23 L 43 3 L 47 23 Z" fill="#c9d6f0" ${t}/>` },
    'marco-foto': { w: 64, h: 64, cuerpo: `<rect x="5" y="7" width="54" height="50" rx="3" fill="#ffffff" ${t} transform="rotate(-5 32 32)"/><rect x="12" y="13" width="40" height="30" fill="#8fd0ff" transform="rotate(-5 32 32)"/><path d="M 14 42 L 26 28 L 34 36 L 40 30 L 50 41 Z" fill="#3f8cff" transform="rotate(-5 32 32)"/><circle cx="44" cy="20" r="4" fill="#ffd23f" transform="rotate(-5 32 32)"/>` },
    'nota-azul': notaMusical('#3f8cff'),
    'nota-dorada': notaMusical(DORADO),
    'nota-rosa': notaMusical('#ff8fb1'),
    'nota-verde': notaMusical('#4cd964'),
    campana: { w: 56, h: 64, cuerpo: `<path d="M 28 4 v 6" ${t}/><path d="M 10 50 Q 10 12 28 10 Q 46 12 46 50 L 52 54 L 4 54 Z" fill="${DORADO}" ${t}/><circle cx="28" cy="58" r="5" fill="${DORADO}" ${t}/>` },
    meta: { w: 96, h: 144, cuerpo:
      `<path d="M 8 140 L 8 46 Q 8 6 48 6 Q 88 6 88 46 L 88 140 Z" fill="#1e4fa3" ${t}/>` +
      `<path d="M 20 140 L 20 50 Q 20 18 48 18 Q 76 18 76 50 L 76 140 Z" fill="#fff6c8" ${t}/>` +
      claveSol(36, 40, 1.15, DORADO, 4) + `<path d="M 30 130 h 36" stroke="${DORADO}" stroke-width="4" stroke-linecap="round"/>` },
    puerta: { w: 48, h: 144, cuerpo: `<rect x="3" y="3" width="42" height="138" rx="4" fill="#5d6b8a" ${t}/>${[0, 1, 2, 3, 4].map((i) => `<path d="M 10 ${20 + i * 26} h 28" stroke="#ffffff" stroke-width="1.8"/>`).join('')}<circle cx="24" cy="72" r="8" fill="${DORADO}" ${t}/>` },
    tarta: tarta(),
    'cartel-continuara': { w: 300, h: 190, cuerpo: `<rect x="138" y="90" width="22" height="98" fill="#b07a45" ${t}/><rect x="8" y="8" width="284" height="96" rx="10" fill="#ffffff" ${t}/><text x="150" y="70" font-family="Georgia, serif" font-style="italic" font-size="40" text-anchor="middle" fill="#1b2a4a">Continuará...</text>` },
    candado: { w: 48, h: 56, cuerpo: `<path d="M 14 26 V 18 Q 14 6 24 6 Q 34 6 34 18 V 26" fill="none" ${t4}/><rect x="6" y="24" width="36" height="28" rx="5" fill="#9aa7c7" ${t}/><circle cx="24" cy="36" r="4" fill="${TRAZO}"/><path d="M 24 38 v 7" stroke="${TRAZO}" stroke-width="3"/>` },
    'icono-foto': { w: 40, h: 40, cuerpo: `<rect x="3" y="8" width="34" height="26" rx="4" fill="#ffffff" ${t}/><circle cx="20" cy="21" r="7" fill="#8fd0ff" ${t}/><rect x="8" y="4" width="10" height="6" rx="2" fill="#ffffff" ${t}/>` },
    'icono-objeto': { w: 40, h: 40, cuerpo: `<path d="M 20 3 L 25 14 L 37 15 L 28 23 L 31 35 L 20 29 L 9 35 L 12 23 L 3 15 L 15 14 Z" fill="#ffd23f" ${t}/>` },
    clave: { w: 64, h: 128, cuerpo: claveSol(10, 6, 2.2, DORADO, 6) },
    'boton-izq': boton(`<path d="M 78 34 L 44 64 L 78 94" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
    'boton-der': boton(`<path d="M 50 34 L 84 64 L 50 94" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
    'boton-saltar': boton(`<path d="M 34 78 L 64 46 L 94 78" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
    'boton-cantar': boton(`<ellipse cx="52" cy="82" rx="14" ry="10" transform="rotate(-20 52 82)" fill="#ffffff"/><path d="M 64 80 V 34 Q 80 40 86 54" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>`),
    'boton-pausa': { w: 80, h: 80, cuerpo: `<circle cx="40" cy="40" r="34" fill="#0d1b3d" fill-opacity="0.35" stroke="#ffffff" stroke-width="4"/><rect x="27" y="24" width="9" height="32" rx="3" fill="#ffffff"/><rect x="44" y="24" width="9" height="32" rx="3" fill="#ffffff"/>` },
    // icono de la app (se rasteriza a PNG con tools/generar-iconos.mjs)
    icono: { w: 512, h: 512, cuerpo: `<defs><radialGradient id="f" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="#3f7fe0"/><stop offset="1" stop-color="#0d1b3d"/></radialGradient></defs><rect width="512" height="512" fill="url(#f)"/>${claveSol(175, 90, 6.2, DORADO, 15)}<text x="372" y="440" font-family="Georgia, serif" font-weight="bold" font-size="120" text-anchor="middle" fill="#ffffff">18</text>` },
  };
}
export { f };
