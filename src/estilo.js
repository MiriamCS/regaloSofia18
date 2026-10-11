// Paletas por etapa (sección 8 de SPEC.md) y estilos de texto comunes.
export const PALETAS = {
  bebe:        { cielo: [0xcfe9ff, 0xf4fbff], lejos: 0xb5dcf7, medio: 0x9ccbee, suelo: 0xe8f4ff, sueloBorde: 0x7fb3e6, acento: 0xffffff, plataforma: 0xffffff },
  nina:        { cielo: [0x6fb6ff, 0xd4ecff], lejos: 0x8cc4ff, medio: 0x4f97ef, suelo: 0x2f6fdc, sueloBorde: 0x1d3b8a, acento: 0xffd23f, plataforma: 0xfff3c4 },
  preado:      { cielo: [0x5ad1d6, 0xd6fbf5], lejos: 0x7fd8c9, medio: 0x2bb3a0, suelo: 0x1e8c96, sueloBorde: 0x0f5560, acento: 0x7bdc6b, plataforma: 0xd8fff4 },
  adolescente: { cielo: [0x1a1f5c, 0x5b3c9e], lejos: 0x3a2f7a, medio: 0x2a2468, suelo: 0x23356e, sueloBorde: 0x7df9ff, acento: 0xff7df0, plataforma: 0x3a3f9e },
  adulta:      { cielo: [0x0a1030, 0x1b2b6b], lejos: 0x16245a, medio: 0x101a44, suelo: 0x1b2b6b, sueloBorde: 0xe8b84a, acento: 0xe8b84a, plataforma: 0x2b3f8f },
  blanco:      { cielo: [0xffffff, 0xffffff], lejos: 0xffffff, medio: 0xffffff, suelo: 0xf2f4f8, sueloBorde: 0xd5dbe8, acento: 0xffffff, plataforma: 0xffffff },
};

export const FUENTE = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';
export const FUENTE_TITULO = 'Georgia, "Times New Roman", serif';

export const COLOR = {
  marino: '#0d1b3d',
  azul: '#1e4fa3',
  azulClaro: '#8fb8ff',
  blanco: '#ffffff',
  dorado: '#e8b84a',
  texto: '#1b2a4a',
};

export function estiloTexto(tam = 28, color = COLOR.blanco, extra = {}) {
  return { fontFamily: FUENTE, fontSize: `${tam}px`, color, ...extra };
}
