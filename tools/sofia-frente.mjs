// Sofía de frente: recorta la primera figura (la vista de frente) de cada hoja de personaje de docs/concept-art/sofia,
// le quita el fondo blanco y la deja al tamaño del juego en assets/sprites/sofia/<edad>/frente.png.
// La usa la pantalla de Controles para las edades que no están elegidas. Uso: npm run frente
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const ESCALA_TEX = 2;
// hoja de cada edad y zona de la hoja donde está la figura de frente [x, y, ancho, alto]
const HOJAS = {
  bebe: { hoja: 'S5-bebe.png', zona: [0, 0, 440, 660] },
  nina: { hoja: 'S4-nina.png', zona: [0, 0, 440, 1024] },
  preado: { hoja: 'S3-preadolescente.png', zona: [0, 0, 440, 1024] },
  adolescente: { hoja: 'S1-adolescente.png', zona: [0, 0, 440, 1024] },
  adulta: { hoja: 'S2-adulta.png', zona: [0, 0, 440, 1024] },
};

// Lo que mide cada edad en el juego (el mismo alto que de lado)
const fotos = JSON.parse(readFileSync(join(RAIZ, 'assets/sprites/sofia/fotogramas.json'), 'utf8'));
const altoJuego = (e) => fotos[e].pie.altoJuego;

const esFondo = (d, i) => {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  return Math.min(r, g, b) > 228 && Math.max(r, g, b) - Math.min(r, g, b) < 24;
};

async function recortar(etapa, { hoja, zona }) {
  const [zx, zy, w, h] = zona;
  const { data } = await sharp(join(RAIZ, 'docs/concept-art/sofia', hoja))
    .extract({ left: zx, top: zy, width: w, height: h })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = w * h;
  // 1. fondo: blanco unido al borde (relleno por inundación), para no borrar los blancos de dentro (ojos, zapatillas)
  const fondo = new Uint8Array(n);
  const pila = [];
  for (let x = 0; x < w; x++) pila.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) pila.push(y * w, y * w + w - 1);
  while (pila.length) {
    const p = pila.pop();
    if (fondo[p] || !esFondo(data, p * 4)) continue;
    fondo[p] = 1;
    const x = p % w;
    if (x > 0) pila.push(p - 1);
    if (x < w - 1) pila.push(p + 1);
    if (p >= w) pila.push(p - w);
    if (p < n - w) pila.push(p + w);
  }
  // 2. trozos sueltos: se queda con la figura (el trozo más grande) y los que sean de buen tamaño junto a ella;
  // así no se cuela ningún pelo de la figura de al lado
  const trozo = new Int32Array(n).fill(-1);
  const trozos = [];
  for (let s = 0; s < n; s++) {
    if (fondo[s] || trozo[s] >= 0) continue;
    const id = trozos.length;
    let area = 0, minX = w;
    pila.push(s);
    trozo[s] = id;
    while (pila.length) {
      const p = pila.pop();
      area++;
      const x = p % w;
      if (x < minX) minX = x;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (q >= 0 && q < n && !fondo[q] && trozo[q] < 0) {
          trozo[q] = id;
          pila.push(q);
        }
      }
    }
    trozos.push({ area, minX });
  }
  const mayor = Math.max(...trozos.map((t) => t.area));
  const vale = trozos.map((t) => t.area === mayor || (t.area > mayor * 0.002 && t.minX < w * 0.85));
  for (let p = 0; p < n; p++) if (!vale[trozo[p]]) data[p * 4 + 3] = 0;

  const alto = altoJuego(etapa) * ESCALA_TEX;
  const salida = join(RAIZ, 'assets/sprites/sofia', etapa, 'frente.png');
  const recorte = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 0 }).png().toBuffer();
  const info = await sharp(recorte).resize({ height: alto, kernel: 'lanczos3' }).png().toFile(salida);
  console.log(`${etapa}: ${info.width}×${info.height} → ${salida}`);
}

for (const [etapa, h] of Object.entries(HOJAS)) await recortar(etapa, h);
