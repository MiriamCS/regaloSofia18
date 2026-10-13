// Velas dibujadas en SVG. Al alargar el cuerpo las rayas se repiten en vez de estirarse, así que una vela alta
// conserva el dibujo de una baja. Lo usan tools/generar-velas.mjs (vela-on, vela-off y vela-cuerpo.svg) y la
// pantalla de Niveles (una vela a medida por año).
// Unidades: lienzo de 30 de ancho; cuerpo de x 8 a 22; la mecha mide 5 y entra 1 en el cuerpo.
import { COLOR } from '../estilo.js';

const X0 = 8;
const X1 = 22;
const RAYA = 9; // separación vertical entre rayas
const INCLINACION = 6; // lo que baja cada raya de izquierda a derecha
const GROSOR = 4.5;

// Llama: 14 de alto, de y 0 a 14 (la pantalla de Niveles recorta esa franja de vela-on.svg)
const LLAMA = `<path d="M15 0.6C17.4 3.8 20 6.4 20 8.6a5 5 0 0 1-10 0C10 6.4 12.6 3.8 15 0.6z" fill="${COLOR.amarillo}" stroke="#D9A21E" stroke-width="1"/>`
  + '<path d="M15 5c1.3 1.7 2.6 3 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.4 1.3-2.7 2.6-4.4z" fill="#FFF6DC"/>';
// Humo de la vela apagada, en la misma franja que la llama
const HUMO = '<path d="M15 12.5c-2.6-1.8 2.4-3.6 0-5.6s2.2-3.6 0.4-5.6" fill="none" stroke-linecap="round"'
  + ` stroke="${COLOR.azulClaro}" stroke-width="3.4"/>`
  + '<path d="M15 12.5c-2.6-1.8 2.4-3.6 0-5.6s2.2-3.6 0.4-5.6" fill="none" stroke-linecap="round" stroke="#ffffff" stroke-width="1.8"/>';

// Cuerpo con su mecha. `arriba`: y donde empieza la mecha; `abajo`: y de la base.
function cuerpo(arriba, abajo, mechaQuemada) {
  const y0 = arriba + 4;
  const alto = abajo - y0;
  let rayas = '';
  for (let y = y0 - INCLINACION - GROSOR; y < abajo; y += RAYA) {
    rayas += `<path d="M${X0} ${y}L${X1} ${y + INCLINACION}v${GROSOR}L${X0} ${y + GROSOR}z"/>`;
  }
  const mecha = mechaQuemada ? COLOR.tinta : COLOR.noche;
  return `<line x1="15" y1="${arriba + 0.8}" x2="15" y2="${y0 + 1}" stroke="${mecha}" stroke-width="1.8" stroke-linecap="round"/>`
    + `<clipPath id="c"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${alto}" rx="2.5"/></clipPath>`
    + `<g clip-path="url(#c)"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${alto}" fill="${COLOR.papel}"/>`
    + `<g fill="${COLOR.vivo}">${rayas}</g>`
    + `<rect x="${X1 - 3.5}" y="${y0}" width="3.5" height="${alto}" fill="${COLOR.tinta}" fill-opacity="0.16"/>`
    + `<rect x="${X0 + 1.8}" y="${y0 + 2}" width="1.6" height="${alto - 4}" rx="0.8" fill="#ffffff" fill-opacity="0.55"/></g>`
    + `<rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${alto}" rx="2.5" fill="none" stroke="${COLOR.tinta}" stroke-width="1.4"/>`;
}

// llama: 'on' (encendida), 'off' (apagada, con humo) o null (solo cuerpo y mecha, sin hueco arriba).
// alto: alto total en unidades. recorte: sin márgenes a los lados (16 de ancho), para la pantalla de Niveles.
// escala: px por unidad.
export function svgVela({ llama = null, alto = 56, recorte = false, escala = 1 } = {}) {
  const arriba = llama ? 13 : 0;
  const dentro = cuerpo(arriba, alto - 0.8, llama === 'off')
    + (llama === 'on' ? LLAMA : llama === 'off' ? HUMO : '');
  const [vx, vw] = recorte ? [X0 - 1, X1 - X0 + 2] : [0, 30];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${vw * escala}" height="${alto * escala}" viewBox="${vx} 0 ${vw} ${alto}">${dentro}</svg>`;
}
