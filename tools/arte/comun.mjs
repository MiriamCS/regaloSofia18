// Utilidades compartidas por los generadores de SVG.
export const TRAZO = '#1b2a4a'; // contorno azul marino oscuro, común a todo el juego
export const ANCHO_TRAZO = 2.4;

export function svg(w, h, cuerpo, extra = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"${extra}>\n${cuerpo}\n</svg>\n`;
}

export function f(n) {
  return Math.round(n * 100) / 100;
}

// Camino de clave de sol estilizado (caja aproximada 0..20 x 0..52).
export const CLAVE_SOL =
  'M11.5 50 C 6 52 3 47 7 44.5 C 9.5 43 12 45 11 47.5 ' +
  'M11.5 50 L 10 6 C 9.8 2 13.5 0.5 15 3 C 17.5 7.5 13 13 9 17.5 C 3 24 1 29 3.5 34 ' +
  'C 6 39 14 39.5 16.5 34.5 C 18.5 30.5 15.5 26 11.5 26 C 7.5 26 6.5 30.5 9 32.5';

export function claveSol(x, y, escala, color, grosor = 2.6) {
  return `<path transform="translate(${x} ${y}) scale(${escala})" d="${CLAVE_SOL}" fill="none" stroke="${color}" stroke-width="${grosor / escala}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
