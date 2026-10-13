// Paletas por etapa (sección 8 de SPEC.md) y estilos de texto comunes.
export const PALETAS = {
  bebe:        { cielo: [0xcfe9ff, 0xf4fbff], lejos: 0xb5dcf7, medio: 0x9ccbee, suelo: 0xe8f4ff, sueloBorde: 0x7fb3e6, acento: 0xffffff, plataforma: 0xffffff },
  nina:        { cielo: [0x6fb6ff, 0xd4ecff], lejos: 0x8cc4ff, medio: 0x4f97ef, suelo: 0x2f6fdc, sueloBorde: 0x1d3b8a, acento: 0xffd23f, plataforma: 0xfff3c4 },
  preado:      { cielo: [0x5ad1d6, 0xd6fbf5], lejos: 0x7fd8c9, medio: 0x2bb3a0, suelo: 0x1e8c96, sueloBorde: 0x0f5560, acento: 0x7bdc6b, plataforma: 0xd8fff4 },
  adolescente: { cielo: [0x1a1f5c, 0x5b3c9e], lejos: 0x3a2f7a, medio: 0x2a2468, suelo: 0x23356e, sueloBorde: 0x7df9ff, acento: 0xff7df0, plataforma: 0x3a3f9e },
  adulta:      { cielo: [0x0a1030, 0x1b2b6b], lejos: 0x16245a, medio: 0x101a44, suelo: 0x1b2b6b, sueloBorde: 0xe8b84a, acento: 0xe8b84a, plataforma: 0x2b3f8f },
  blanco:      { cielo: [0xffffff, 0xffffff], lejos: 0xffffff, medio: 0xffffff, suelo: 0xf2f4f8, sueloBorde: 0xd5dbe8, acento: 0xffffff, plataforma: 0xffffff },
};

// Quicksand Bold en todo el juego (se carga en index.html; cualquier peso usa la cara Bold)
export const FUENTE = '"Quicksand", "Nunito", system-ui, sans-serif';
export const FUENTE_TITULO = FUENTE;

// Paleta del juego: azules sacados del logo de Sofía y el amarillo de marca M. Llorens como único acento
// (reparto aproximado 60 % azul, 30 % blancos y claros, 10 % amarillo; el amarillo nunca para texto).
export const COLOR = {
  tinta: '#071A3D', // texto sobre claro, fondo más oscuro
  noche: '#0B2A66', // fondo oscuro
  superficie: '#12367D', // botones y tarjetas sobre noche
  real: '#1550C8', // azul principal
  vivo: '#2F6FEB', // variación
  azulClaro: '#A9C3F5', // texto secundario sobre oscuro
  hielo: '#DCE8FD', // superficie clara
  papel: '#F4F7FE', // fondo claro
  amarillo: '#F5C242', // acento de marca
  rojo: '#A1243A', // solo para acciones que borran
  blanco: '#ffffff',
};
// Los mismos colores como número, para Graphics
export const HEX = Object.fromEntries(Object.entries(COLOR).map(([k, v]) => [k, parseInt(v.slice(1), 16)]));

// Ajusta una imagen a un tamaño en px (el lado mayor), sea cual sea el lienzo de su textura
export function ajustarTam(img, px) {
  return img.setScale(px / Math.max(img.width, img.height));
}

export function estiloTexto(tam = 28, color = COLOR.blanco, extra = {}) {
  return { fontFamily: FUENTE, fontSize: `${tam}px`, color, ...extra };
}
