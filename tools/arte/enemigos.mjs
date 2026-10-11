// Enemigos: graciosos, nunca violentos. Todos miran hacia la derecha (el juego los voltea).
import { TRAZO, ANCHO_TRAZO as T } from './comun.mjs';

const ojo = (x, y, r = 4) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${TRAZO}" stroke-width="1.6"/><circle cx="${x + r * 0.3}" cy="${y + r * 0.15}" r="${r * 0.5}" fill="${TRAZO}"/>`;

export function spritesEnemigos() {
  const s = {};

  // --- Patrulleros
  s.pato = { w: 64, h: 56, cuerpo:
    `<path d="M 8 34 Q 6 52 30 52 Q 56 52 56 36 Q 56 26 46 26 Q 50 6 34 6 Q 20 6 22 22 Q 10 20 8 34 Z" fill="#ffd23f" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<path d="M 44 18 Q 60 16 62 22 Q 56 26 44 24 Z" fill="#ff8c2a" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<path d="M 16 36 Q 26 44 38 36" fill="none" stroke="#e0a800" stroke-width="3" stroke-linecap="round"/>` + ojo(36, 15, 4.5) };

  s.cochecito = { w: 72, h: 52, cuerpo:
    `<rect x="6" y="14" width="58" height="24" rx="8" fill="#ff5d5d" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 18 14 L 24 4 L 46 4 L 52 14" fill="#bfe3ff" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<circle cx="20" cy="40" r="9" fill="#2b2b3a" stroke="${TRAZO}" stroke-width="${T}"/><circle cx="20" cy="40" r="3" fill="#ddd"/>` +
    `<circle cx="52" cy="40" r="9" fill="#2b2b3a" stroke="${TRAZO}" stroke-width="${T}"/><circle cx="52" cy="40" r="3" fill="#ddd"/>` +
    ojo(56, 22, 4) + ojo(46, 22, 4) };

  s.mochila = { w: 60, h: 66, cuerpo:
    `<path d="M 10 22 Q 10 6 30 6 Q 50 6 50 22 L 52 54 Q 52 60 46 60 L 14 60 Q 8 60 8 54 Z" fill="#7c4dff" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<rect x="16" y="34" width="28" height="18" rx="5" fill="#9f7bff" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 22 6 Q 30 -2 38 6" fill="none" stroke="${TRAZO}" stroke-width="3"/>` +
    `<path d="M 18 64 L 18 56 M 42 64 L 42 56" stroke="${TRAZO}" stroke-width="4" stroke-linecap="round"/>` +
    ojo(24, 22, 4.5) + ojo(38, 22, 4.5) + `<path d="M 24 30 q 7 4 14 0" fill="none" stroke="${TRAZO}" stroke-width="2" stroke-linecap="round"/>` };

  // --- Voladores
  s.mosquito = { w: 60, h: 48, cuerpo:
    `<ellipse cx="22" cy="12" rx="14" ry="9" fill="#e6f4ff" fill-opacity="0.8" stroke="${TRAZO}" stroke-width="1.8"/>` +
    `<ellipse cx="34" cy="10" rx="12" ry="8" fill="#e6f4ff" fill-opacity="0.8" stroke="${TRAZO}" stroke-width="1.8"/>` +
    `<ellipse cx="26" cy="28" rx="16" ry="10" fill="#6b5b8f" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 40 26 L 58 30" stroke="${TRAZO}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M 18 36 L 12 46 M 26 38 L 24 47 M 34 36 L 38 46" stroke="${TRAZO}" stroke-width="2" stroke-linecap="round"/>` + ojo(36, 24, 4) };

  s['avion-papel'] = { w: 70, h: 40, cuerpo:
    `<path d="M 2 20 L 68 6 L 26 36 Z" fill="#ffffff" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<path d="M 26 36 L 30 22 L 68 6" fill="#dfe8ff" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` + ojo(46, 15, 3.5) };

  s.notificacion = { w: 74, h: 44, cuerpo:
    `<rect x="4" y="4" width="66" height="34" rx="12" fill="#ffffff" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<circle cx="20" cy="21" r="9" fill="#ff4d6d"/><text x="20" y="26" font-family="Arial" font-weight="bold" font-size="13" text-anchor="middle" fill="#fff">9+</text>` +
    `<rect x="34" y="14" width="28" height="4" rx="2" fill="#9aa7c7"/><rect x="34" y="23" width="20" height="4" rx="2" fill="#c3cce3"/>` };

  // --- Bloqueadores
  s.profesor = { w: 96, h: 150, cuerpo:
    `<rect x="22" y="56" width="52" height="70" rx="10" fill="#6d7a99" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 40 56 L 48 80 L 56 56" fill="#fff" stroke="${TRAZO}" stroke-width="2"/><path d="M 48 62 L 45 74 L 48 80 L 51 74 Z" fill="#c0392b"/>` +
    `<rect x="28" y="124" width="16" height="24" fill="#3b4256" stroke="${TRAZO}" stroke-width="${T}"/><rect x="52" y="124" width="16" height="24" fill="#3b4256" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<circle cx="48" cy="32" r="24" fill="#e8b48c" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 26 26 Q 30 6 48 8 Q 66 6 70 26 Q 60 16 48 18 Q 36 16 26 26 Z" fill="#9b9b9b" stroke="${TRAZO}" stroke-width="2"/>` +
    `<circle cx="40" cy="32" r="6" fill="none" stroke="${TRAZO}" stroke-width="2"/><circle cx="58" cy="32" r="6" fill="none" stroke="${TRAZO}" stroke-width="2"/>` +
    `<circle cx="40" cy="33" r="2" fill="${TRAZO}"/><circle cx="58" cy="33" r="2" fill="${TRAZO}"/>` +
    `<path d="M 34 22 L 46 25 M 64 22 L 52 25" stroke="${TRAZO}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M 40 46 L 56 46" stroke="${TRAZO}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<rect x="70" y="70" width="22" height="30" fill="#fff" stroke="${TRAZO}" stroke-width="2"/><path d="M 74 78 h 14 M 74 84 h 14 M 74 90 h 9" stroke="#c0392b" stroke-width="2"/>` };

  s.examenes = { w: 70, h: 110, cuerpo:
    [0, 1, 2, 3, 4, 5].map((i) => {
      const y = 92 - i * 16;
      const dx = (i % 2 ? 3 : -3);
      return `<rect x="${8 + dx}" y="${y}" width="54" height="15" fill="#fbfbff" stroke="${TRAZO}" stroke-width="2"/><text x="${14 + dx}" y="${y + 12}" font-family="Arial" font-weight="bold" font-size="11" fill="#c0392b">${['3,5', '4', '2', '?', '5', '1'][i]}</text>`;
    }).join('') + ojo(42, 22, 5) + ojo(54, 22, 5) };

  // --- Ladrón
  s.urraca = { w: 72, h: 58, cuerpo:
    `<path d="M 6 30 L 22 26 L 20 36 Z" fill="#1d2233" stroke="${TRAZO}" stroke-width="2" stroke-linejoin="round"/>` +
    `<ellipse cx="38" cy="32" rx="20" ry="14" fill="#1d2233" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<ellipse cx="36" cy="36" rx="12" ry="7" fill="#f2f4ff"/>` +
    `<path d="M 30 22 Q 40 6 50 24" fill="#3355aa" stroke="${TRAZO}" stroke-width="2"/>` +
    `<circle cx="54" cy="22" r="11" fill="#1d2233" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<path d="M 63 20 L 72 24 L 63 27 Z" fill="#ffb347" stroke="${TRAZO}" stroke-width="1.6"/>` + ojo(57, 19, 3.4) +
    `<path d="M 34 46 L 32 56 M 42 46 L 44 56" stroke="#ffb347" stroke-width="2.4" stroke-linecap="round"/>` };

  // --- Desafinados
  s.metronomo = { w: 60, h: 84, cuerpo:
    `<path d="M 30 4 L 54 78 L 6 78 Z" fill="#a0522d" stroke="${TRAZO}" stroke-width="${T}" stroke-linejoin="round"/>` +
    `<path d="M 30 18 L 44 70 L 16 70 Z" fill="#f5deb3" stroke="${TRAZO}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<path d="M 30 68 L 40 22" stroke="${TRAZO}" stroke-width="3" stroke-linecap="round"/><rect x="34" y="34" width="9" height="7" fill="#c0392b" transform="rotate(14 38 37)"/>` +
    ojo(24, 56, 4) + ojo(34, 56, 4) + `<path d="M 22 64 q 7 -4 14 0" fill="none" stroke="${TRAZO}" stroke-width="2"/>` };

  s.despertador = { w: 66, h: 70, cuerpo:
    `<circle cx="16" cy="12" r="9" fill="#ffd23f" stroke="${TRAZO}" stroke-width="${T}"/><circle cx="50" cy="12" r="9" fill="#ffd23f" stroke="${TRAZO}" stroke-width="${T}"/>` +
    `<circle cx="33" cy="38" r="26" fill="#ff6b6b" stroke="${TRAZO}" stroke-width="${T}"/><circle cx="33" cy="38" r="19" fill="#fff" stroke="${TRAZO}" stroke-width="2"/>` +
    `<path d="M 33 38 L 33 26 M 33 38 L 42 42" stroke="${TRAZO}" stroke-width="2.6" stroke-linecap="round"/>` +
    `<path d="M 16 62 L 10 68 M 50 62 L 56 68" stroke="${TRAZO}" stroke-width="3.4" stroke-linecap="round"/>` };

  return s;
}
