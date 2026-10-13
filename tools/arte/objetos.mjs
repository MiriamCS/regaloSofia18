// Cosas que caen en las zonas de lluvia (texturas obj-*). Los coleccionables son SVG aparte (la pelota es uno de ellos).
// Cada uno en 96x96, mismo contorno y paleta.
import { TRAZO, ANCHO_TRAZO as T } from './comun.mjs';

const W = 96;
const o = (cuerpo) => ({ w: W, h: W, cuerpo });
const t = `stroke="${TRAZO}" stroke-width="${T + 0.6}" stroke-linejoin="round" stroke-linecap="round"`;

export function spritesObjetos() {
  return {
    agenda: o(`<rect x="18" y="10" width="60" height="78" rx="6" fill="#2bb3c0" ${t}/><rect x="18" y="10" width="12" height="78" fill="#1e8c96" ${t}/><rect x="40" y="26" width="30" height="16" rx="3" fill="#fff" ${t}/><path d="M 48 60 l 4 8 l 9 1 l -7 6 l 2 9 l -8 -5 l -8 5 l 2 -9 l -7 -6 l 9 -1 Z" fill="#ffd23f" ${t}/>`),
    boligrafo: o(`<path d="M 70 10 L 86 26 L 34 78 L 16 82 L 20 64 Z" fill="#3f8cff" ${t}/><path d="M 20 64 L 34 78" ${t}/><path d="M 16 82 L 22 76" stroke="${TRAZO}" stroke-width="4" stroke-linecap="round"/><path d="M 62 18 L 78 34" stroke="#fff" stroke-width="3"/><path d="M 56 6 l 3 7 l 7 1 l -5 5 l 1 7 l -6 -3 l -6 3 l 1 -7 l -5 -5 l 7 -1 Z" fill="#ffd23f" ${t}/>`),
  };
}
