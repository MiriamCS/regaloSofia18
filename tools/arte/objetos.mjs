// Objetos coleccionables (PROVISIONALES: genéricos por edad hasta tener la lista de Miriam).
// Cada uno en 96x96, mismo contorno y paleta.
import { TRAZO, ANCHO_TRAZO as T, claveSol } from './comun.mjs';

const W = 96;
const o = (cuerpo) => ({ w: W, h: W, cuerpo });
const t = `stroke="${TRAZO}" stroke-width="${T + 0.6}" stroke-linejoin="round" stroke-linecap="round"`;

export function spritesObjetos() {
  return {
    chupete: o(`<ellipse cx="48" cy="54" rx="30" ry="18" fill="#8fd0ff" ${t}/><circle cx="48" cy="26" r="13" fill="none" ${t}/><path d="M 40 70 Q 48 92 56 70" fill="#ffe6a8" ${t}/>`),
    sonajero: o(`<circle cx="36" cy="36" r="24" fill="#ffd23f" ${t}/><circle cx="28" cy="30" r="5" fill="#fff"/><circle cx="44" cy="42" r="4" fill="#ff8fb1"/><rect x="50" y="52" width="12" height="40" rx="6" transform="rotate(-40 56 72)" fill="#8fd0ff" ${t}/>`),
    patito: o(`<path d="M 14 58 Q 12 84 46 84 Q 82 84 82 60 Q 82 46 66 46 Q 72 14 50 14 Q 30 14 32 38 Q 16 36 14 58 Z" fill="#ffd23f" ${t}/><path d="M 64 30 Q 86 28 88 36 Q 80 42 64 40 Z" fill="#ff8c2a" ${t}/><circle cx="52" cy="28" r="4.5" fill="${TRAZO}"/>`),
    ceras: o([['#ff5d5d', 18], ['#ffd23f', 36], ['#3f8cff', 54], ['#4cd964', 72]].map(([c, x]) => `<path d="M ${x} 84 L ${x} 30 L ${x + 6} 14 L ${x + 12} 30 L ${x + 12} 84 Z" fill="${c}" ${t}/><rect x="${x}" y="46" width="12" height="16" fill="#fff" opacity="0.6"/>`).join('')),
    cubo: o(`<path d="M 18 36 L 78 36 L 70 86 L 26 86 Z" fill="#3f8cff" ${t}/><path d="M 18 36 Q 48 4 78 36" fill="none" ${t}/><path d="M 24 50 L 72 50" stroke="#fff" stroke-width="4"/><path d="M 60 80 L 82 30 L 90 34 L 70 82" fill="#ffd23f" ${t}/>`),
    corona: o(`<path d="M 12 72 L 16 28 L 34 50 L 48 18 L 62 50 L 80 28 L 84 72 Z" fill="#ffd23f" ${t}/><rect x="12" y="70" width="72" height="14" rx="3" fill="#ffb300" ${t}/><circle cx="48" cy="56" r="6" fill="#3f8cff" ${t}/>`),
    mochila: o(`<path d="M 20 34 Q 20 12 48 12 Q 76 12 76 34 L 78 82 Q 78 88 72 88 L 24 88 Q 18 88 18 82 Z" fill="#2f6fdc" ${t}/><rect x="28" y="52" width="40" height="26" rx="6" fill="#5d93ff" ${t}/><path d="M 38 12 Q 48 0 58 12" fill="none" ${t}/>`),
    partituras: o(`<rect x="14" y="14" width="68" height="72" rx="4" fill="#fffaf0" ${t}/>${[30, 44, 58, 72].map((y) => `<path d="M 22 ${y} h 52" stroke="#9aa7c7" stroke-width="1.6"/>`).join('')}${claveSol(22, 22, 1.05, '#1e4fa3', 3)}<circle cx="56" cy="58" r="5" fill="${TRAZO}"/><path d="M 61 58 V 32" stroke="${TRAZO}" stroke-width="2.6"/>`),
    brujula: o(`<circle cx="48" cy="50" r="34" fill="#f5deb3" ${t}/><circle cx="48" cy="50" r="26" fill="#fff" ${t}/><path d="M 48 28 L 56 50 L 48 72 L 40 50 Z" fill="#ff5d5d" ${t}/><path d="M 48 50 L 56 50 L 48 72 L 40 50 Z" fill="#3f8cff"/><circle cx="48" cy="14" r="5" fill="none" ${t}/>`),
    metronomo: o(`<path d="M 48 8 L 80 88 L 16 88 Z" fill="#a0522d" ${t}/><path d="M 48 26 L 66 80 L 30 80 Z" fill="#f5deb3" ${t}/><path d="M 48 78 L 62 30" ${t}/><rect x="54" y="42" width="10" height="8" fill="#c0392b"/>`),
    farolillo: o(`<path d="M 40 10 h 16" ${t}/><path d="M 48 10 v 8" ${t}/><path d="M 30 26 Q 48 14 66 26 L 70 70 Q 48 84 26 70 Z" fill="#ffcf5c" ${t}/><path d="M 34 34 Q 48 28 62 34 M 30 52 Q 48 46 66 52" fill="none" stroke="#e09a00" stroke-width="2.4"/><rect x="38" y="76" width="20" height="10" fill="#c0392b" ${t}/>`),
    'gafas-sol': o(`<path d="M 8 38 h 80" ${t}/><path d="M 12 38 Q 12 66 30 66 Q 44 66 44 38 Z" fill="#1d3b8a" ${t}/><path d="M 52 38 Q 52 66 66 66 Q 84 66 84 38 Z" fill="#1d3b8a" ${t}/><path d="M 20 46 l 8 -4 M 60 46 l 8 -4" stroke="#8fd0ff" stroke-width="3"/>`),
    agenda: o(`<rect x="18" y="10" width="60" height="78" rx="6" fill="#2bb3c0" ${t}/><rect x="18" y="10" width="12" height="78" fill="#1e8c96" ${t}/><rect x="40" y="26" width="30" height="16" rx="3" fill="#fff" ${t}/><path d="M 48 60 l 4 8 l 9 1 l -7 6 l 2 9 l -8 -5 l -8 5 l 2 -9 l -7 -6 l 9 -1 Z" fill="#ffd23f" ${t}/>`),
    movil: o(`<rect x="26" y="6" width="44" height="84" rx="9" fill="#2d2f45" ${t}/><rect x="31" y="14" width="34" height="64" rx="3" fill="#8fd0ff"/><circle cx="48" cy="84" r="3" fill="#9aa7c7"/><path d="M 40 34 h 16 M 40 44 h 10" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
    entrada: o(`<path d="M 8 26 h 80 v 14 a 8 8 0 0 0 0 16 v 14 h -80 v -14 a 8 8 0 0 0 0 -16 Z" fill="#ffcf5c" ${t}/><path d="M 64 26 v 44" stroke="${TRAZO}" stroke-width="2" stroke-dasharray="4 4"/>${claveSol(26, 30, 0.7, '#1e4fa3', 3)}<path d="M 72 40 h 8 M 72 48 h 8 M 72 56 h 8" stroke="${TRAZO}" stroke-width="2"/>`),
    boligrafo: o(`<path d="M 70 10 L 86 26 L 34 78 L 16 82 L 20 64 Z" fill="#3f8cff" ${t}/><path d="M 20 64 L 34 78" ${t}/><path d="M 16 82 L 22 76" stroke="${TRAZO}" stroke-width="4" stroke-linecap="round"/><path d="M 62 18 L 78 34" stroke="#fff" stroke-width="3"/><path d="M 56 6 l 3 7 l 7 1 l -5 5 l 1 7 l -6 -3 l -6 3 l 1 -7 l -5 -5 l 7 -1 Z" fill="#ffd23f" ${t}/>`),
    maleta: o(`<rect x="12" y="30" width="72" height="54" rx="8" fill="#5d93ff" ${t}/><path d="M 36 30 V 20 Q 36 14 42 14 H 54 Q 60 14 60 20 V 30" fill="none" ${t}/><path d="M 30 30 V 84 M 66 30 V 84" stroke="#2f6fdc" stroke-width="5"/><circle cx="24" cy="70" r="6" fill="#ffd23f" ${t}/><rect x="52" y="44" width="22" height="14" rx="3" fill="#ff8fb1" ${t}/>`),
    auriculares: o(`<path d="M 18 60 Q 14 14 48 14 Q 82 14 78 60" fill="none" stroke="${TRAZO}" stroke-width="9" stroke-linecap="round"/><path d="M 18 60 Q 14 14 48 14 Q 82 14 78 60" fill="none" stroke="#7c4dff" stroke-width="5" stroke-linecap="round"/><rect x="8" y="52" width="22" height="34" rx="9" fill="#7c4dff" ${t}/><rect x="66" y="52" width="22" height="34" rx="9" fill="#7c4dff" ${t}/><circle cx="19" cy="69" r="4" fill="#7df9ff"/><circle cx="77" cy="69" r="4" fill="#7df9ff"/>`),
    llave: o(`<circle cx="30" cy="34" r="20" fill="#e8b84a" ${t}/><circle cx="30" cy="34" r="8" fill="#0d1b3d" ${t}/><path d="M 44 48 L 86 88 M 70 72 l -8 8 M 78 80 l -8 8" stroke="${TRAZO}" stroke-width="11" stroke-linecap="round"/><path d="M 44 48 L 86 88 M 70 72 l -8 8 M 78 80 l -8 8" stroke="#e8b84a" stroke-width="6" stroke-linecap="round"/>`),
  };
}
