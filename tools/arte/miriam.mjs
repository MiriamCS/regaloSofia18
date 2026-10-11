// Miriam (PROVISIONAL: falta su foto o descripción y la diferencia de edad).
// De momento es un diseño neutro en el mismo estilo, con ropa amarilla para distinguirla de Sofía.
import { TRAZO, ANCHO_TRAZO as T, f } from './comun.mjs';

const PIEL = '#e7b590';
const PELO = '#5a3a28';

const ETAPAS = {
  nina: { piernas: 34, torso: 32, cabeza: 36, ropa: '#f5c542', abajo: '#4f7fd8' },
  adolescente: { piernas: 40, torso: 36, cabeza: 36, ropa: '#f5c542', abajo: '#3a4f8a' },
  adulta: { piernas: 42, torso: 38, cabeza: 36, ropa: '#f5c542', abajo: '#2b3a6b' },
};

function cuerpoMiriam(e) {
  const cad = -e.piernas;
  const cue = cad - e.torso;
  const R = e.cabeza / 2;
  const cy = cue - R + 4;
  let s = '';
  // coleta detrás
  s += `<path d="M ${f(-R + 2)} ${f(cy - 6)} Q ${f(-R - 16)} ${f(cy + 4)} ${f(-R - 10)} ${f(cy + 26)} Q ${f(-R - 2)} ${f(cy + 14)} ${f(-R + 6)} ${f(cy + 2)} Z" fill="${PELO}" stroke="${TRAZO}" stroke-width="${T}"/>`;
  // piernas
  for (const x of [-6, 4]) {
    s += `<rect x="${x - 5}" y="${cad - 2}" width="10.5" height="${e.piernas - 2}" rx="5" fill="${e.abajo}" stroke="${TRAZO}" stroke-width="${T}"/>`;
    s += `<path d="M ${x - 6} -6 Q ${x - 6} 0.5 ${x - 2} 0.5 L ${x + 10} 0.5 Q ${x + 13} 0 ${x + 11} -4 Q ${x + 9} -8 ${x} -8 Z" fill="#ffffff" stroke="${TRAZO}" stroke-width="${T}"/>`;
  }
  // torso
  s += `<rect x="-5" y="${cue - 4}" width="10" height="10" fill="#cf9b78" stroke="${TRAZO}" stroke-width="${T}"/>`;
  s += `<path d="M -12 ${cue + 3} Q -15 ${cue + 5} -14.5 ${cue + 12} L -13 ${cad + 4} L 13 ${cad + 4} L 14.5 ${cue + 12} Q 15 ${cue + 5} 12 ${cue + 3} Z" fill="${e.ropa}" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>`;
  // brazos
  const bl = e.torso * 0.86;
  for (const x of [-15, 15]) {
    s += `<rect x="${x - 4.5}" y="${cue + 4}" width="9" height="${f(bl)}" rx="4.5" fill="${PIEL}" stroke="${TRAZO}" stroke-width="${T}"/>`;
    s += `<rect x="${x - 5}" y="${cue + 3}" width="10" height="${f(bl * 0.4)}" rx="3" fill="${e.ropa}" stroke="${TRAZO}" stroke-width="${T}"/>`;
  }
  // cabeza
  s += `<path d="M ${-R} ${cy - 2} C ${-R} ${cy - R - 2} ${R} ${cy - R - 2} ${R} ${cy - 2} C ${R} ${f(cy + R * 0.8)} ${f(R * 0.45)} ${cy + R + 1} 0 ${cy + R + 1} C ${f(-R * 0.45)} ${cy + R + 1} ${-R} ${f(cy + R * 0.8)} ${-R} ${cy - 2} Z" fill="${PIEL}" stroke="${TRAZO}" stroke-width="${T}"/>`;
  // pelo liso con flequillo de lado
  s += `<path d="M ${-R - 2} ${cy + 4} C ${-R - 4} ${cy - R - 6} ${R + 4} ${cy - R - 8} ${R + 2} ${cy + 2} Q ${R - 4} ${cy - 10} ${-2} ${cy - 11} Q ${-R + 4} ${cy - 8} ${-R - 2} ${cy + 4} Z" fill="${PELO}" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>`;
  // ojos y sonrisa pícara
  for (const x of [-R * 0.3, R * 0.43]) {
    s += `<ellipse cx="${f(x)}" cy="${cy + 2}" rx="3.6" ry="4.6" fill="#2b1a10"/><circle cx="${f(x + 1.4)}" cy="${cy}" r="1.2" fill="#fff"/>`;
  }
  s += `<path d="M ${f(-R * 0.55)} ${cy - 6} q 4 -2 8 0 M ${f(R * 0.22)} ${cy - 6.5} q 4 -2.5 8 -0.5" fill="none" stroke="${PELO}" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M ${f(-4)} ${f(cy + R * 0.5)} Q ${f(2)} ${f(cy + R * 0.5 + 6)} ${f(8)} ${f(cy + R * 0.5 - 2)}" fill="none" stroke="${TRAZO}" stroke-width="2.2" stroke-linecap="round"/>`;
  const top = cy - R - 12;
  return { cuerpo: s, caja: [-R - 26, top, 2 * R + 46, -top + 6], pivote: [0, 0] };
}

export function piezasMiriam(etapa) {
  const e = ETAPAS[etapa];
  return { piezas: { cuerpo: cuerpoMiriam(e) }, medidas: { alto: e.piernas + e.torso + e.cabeza } };
}
