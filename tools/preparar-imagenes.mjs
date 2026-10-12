// Prepara las fotos y los objetos para el juego a partir de los originales.
// Uso: npm run imagenes
//   originales/fotos/SofiaN.jpg|png    -> assets/photos/SofiaN.jpg   (máx. 1200 px, girada según EXIF)
//   originales/objetos/<nombre>.png    -> assets/sprites/objetos/<nombre>.png (256x256, fondo transparente)
// Los originales no van a git (pesan mucho); se pueden sustituir y volver a ejecutar.
// El fondo de los objetos se quita solo: croma verde o el color liso del borde (p. ej. blanco).
// Si un objeto ya tiene su SVG en assets/sprites/objetos, se usa ese y no se genera el PNG.
import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIG_FOTOS = join(raiz, 'originales', 'fotos');
const ORIG_OBJETOS = join(raiz, 'originales', 'objetos');
const DEST_FOTOS = join(raiz, 'assets', 'photos');
const DEST_OBJETOS = join(raiz, 'assets', 'sprites', 'objetos');
const LADO_FOTO = 1200;
const LADO_OBJETO = 256;
const MARGEN_OBJETO = 0.04;
const esImagen = (f) => /\.(jpe?g|png|webp)$/i.test(f);

async function fotos() {
  if (!existsSync(ORIG_FOTOS)) return;
  mkdirSync(DEST_FOTOS, { recursive: true });
  for (const f of readdirSync(ORIG_FOTOS).filter(esImagen)) {
    const destino = join(DEST_FOTOS, `${parse(f).name}.jpg`);
    const info = await sharp(join(ORIG_FOTOS, f))
      .rotate()
      .resize(LADO_FOTO, LADO_FOTO, { fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(destino);
    console.log(`foto   ${f} -> ${parse(destino).base} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  }
}

// Color de fondo: mediana de los píxeles del borde
function colorBorde(px, W, H) {
  const rs = [], gs = [], bs = [];
  const toma = (x, y) => {
    const i = (y * W + x) * 3;
    rs.push(px[i]); gs.push(px[i + 1]); bs.push(px[i + 2]);
  };
  for (let x = 0; x < W; x += 3) { toma(x, 0); toma(x, H - 1); }
  for (let y = 0; y < H; y += 3) { toma(0, y); toma(W - 1, y); }
  const med = (l) => l.sort((a, b) => a - b)[l.length >> 1];
  return [med(rs), med(gs), med(bs)];
}

// Máscara de fondo. Croma verde: cualquier píxel parecido al verde (también los huecos cerrados).
// Fondo liso de otro color: solo lo conectado con el borde, para no borrar los blancos del dibujo.
function mascaraFondo(px, W, H, fondo) {
  const [fr, fg, fb] = fondo;
  const croma = fg > fr + 80 && fg > fb + 80;
  const dist = (i) => Math.hypot(px[i] - fr, px[i + 1] - fg, px[i + 2] - fb);
  const esFondo = (p) => {
    const i = p * 3;
    if (croma) return dist(i) < 70 || (px[i + 1] > 150 && px[i + 1] - Math.max(px[i], px[i + 2]) > 130);
    return dist(i) < 40;
  };
  const m = new Uint8Array(W * H);
  if (croma) {
    for (let p = 0; p < W * H; p++) m[p] = esFondo(p) ? 1 : 0;
    return { m, croma };
  }
  const pila = [];
  for (let x = 0; x < W; x++) pila.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) pila.push(y * W, y * W + W - 1);
  while (pila.length) {
    const p = pila.pop();
    if (m[p] || !esFondo(p)) continue;
    m[p] = 1;
    const x = p % W;
    if (x > 0) pila.push(p - 1);
    if (x < W - 1) pila.push(p + 1);
    if (p >= W) pila.push(p - W);
    if (p < W * (H - 1)) pila.push(p + W);
  }
  return { m, croma };
}

async function objeto(f) {
  const { data: px, info } = await sharp(join(ORIG_OBJETOS, f)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const fondo = colorBorde(px, W, H);
  const { m, croma } = mascaraFondo(px, W, H, fondo);
  const verdeFondo = fondo[1] - Math.max(fondo[0], fondo[2]);
  const rgba = Buffer.alloc(W * H * 4);
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      let [r, g, b] = [px[p * 3], px[p * 3 + 1], px[p * 3 + 2]];
      let a = m[p] ? 0 : 255;
      if (a) {
        // borde con el fondo: semitransparente y sin el reflejo verde del croma
        let vecinos = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const xx = x + dx, yy = y + dy;
            if (xx >= 0 && yy >= 0 && xx < W && yy < H && m[yy * W + xx]) vecinos++;
          }
        }
        if (vecinos) {
          if (croma) g = Math.min(g, Math.max(r, b) + 10);
          a = Math.round(255 * (1 - (vecinos / 25) * 0.6));
        }
        // cristal o reflejo sobre el croma (verde muy brillante): se separa del fondo y queda translúcido
        const verde = g - Math.max(r, b);
        if (croma && g >= 215 && verde > 50) {
          const al = Math.max(0.15, 1 - verde / verdeFondo);
          [r, g, b] = [r, g, b].map((c, k) => Math.max(0, Math.min(255, Math.round((c - (1 - al) * fondo[k]) / al))));
          a = Math.round(a * al);
        }
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
      rgba.set([r, g, b, a], p * 4);
    }
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const lado = Math.round(Math.max(w, h) * (1 + MARGEN_OBJETO * 2));
  const recorte = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract({ left: x0, top: y0, width: w, height: h }).png().toBuffer();
  const destino = join(DEST_OBJETOS, `${parse(f).name}.png`);
  const res = await sharp({ create: { width: lado, height: lado, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: recorte, left: Math.round((lado - w) / 2), top: Math.round((lado - h) / 2) }])
    .png()
    .toBuffer()
    .then((b) => sharp(b).resize(LADO_OBJETO, LADO_OBJETO).png({ compressionLevel: 9 }).toFile(destino));
  console.log(`objeto ${f} -> ${parse(destino).base} (fondo ${croma ? 'croma verde' : 'liso'}, ${Math.round(res.size / 1024)} KB)`);
}

await fotos();
if (existsSync(ORIG_OBJETOS)) {
  mkdirSync(DEST_OBJETOS, { recursive: true });
  for (const f of readdirSync(ORIG_OBJETOS).filter(esImagen)) {
    if (existsSync(join(DEST_OBJETOS, `${parse(f).name}.svg`))) console.log(`objeto ${f}: ya tiene SVG, se omite`);
    else await objeto(f);
  }
}
