// Logo e iconos de la app a partir de los dibujos de originales/logo/:
//   logo-completo.png -> assets/logo.png             (pantalla de inicio, recortado sin márgenes)
//   logo-simple.png   -> assets/icons/icono-*.png    (iconos de la PWA, sobre fondo azul)
//                     -> assets/icons/favicon.png    (pestaña del navegador, fondo transparente)
// Uso: npm run iconos
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIG = join(raiz, 'originales', 'logo');
const ICONOS = join(raiz, 'assets', 'icons');
mkdirSync(ICONOS, { recursive: true });

const completo = join(ORIG, 'logo-completo.png');
const simple = join(ORIG, 'logo-simple.png');
for (const f of [completo, simple]) if (!existsSync(f)) throw new Error(`Falta ${f}`);

await sharp(completo).trim().png().toFile(join(raiz, 'assets', 'logo.png'));

// Dibujo sin márgenes y encajado en un cuadrado de lado `tam` (centrado, transparente alrededor)
async function encajado(tam) {
  const recortado = await sharp(simple).trim().toBuffer();
  return sharp(recortado).resize(tam, tam, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

function fondo(tam) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}"><defs><radialGradient id="f" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="#3f7fe0"/><stop offset="1" stop-color="#0d1b3d"/></radialGradient></defs><rect width="${tam}" height="${tam}" fill="url(#f)"/></svg>`;
  return sharp(Buffer.from(svg));
}

// ocupa: parte del lado que llena el dibujo (el maskable deja margen para el recorte redondo de Android)
for (const [nombre, tam, ocupa] of [['icono-192', 192, 0.82], ['icono-512', 512, 0.82], ['icono-512-maskable', 512, 0.62]]) {
  const dibujo = await encajado(Math.round(tam * ocupa));
  await fondo(tam).composite([{ input: dibujo, gravity: 'center' }]).png().toFile(join(ICONOS, `${nombre}.png`));
}
await sharp(await encajado(64)).toFile(join(ICONOS, 'favicon.png'));

console.log('Logo en assets/logo.png e iconos en assets/icons');
