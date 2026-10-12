// Prepara las fotos, los objetos, los enemigos y el escenario para el juego a partir de los originales.
// Uso: npm run imagenes
//   originales/fotos/SofiaN.jpg|png    -> assets/photos/SofiaN.jpg   (máx. 1200 px, girada según EXIF)
//   originales/objetos/<nombre>.png    -> assets/sprites/objetos/<nombre>.png (256x256, fondo transparente)
//   originales/enemigos/<nombre>.svg|png -> assets/sprites/enemigos/<nombre>.svg (recortado, al alto de config/enemigos.json)
//   originales/escenario/<nombre>.svg  -> assets/sprites/escenario/<nombre>.svg (encajado en el lienzo de ESCENARIO)
// Los originales no van a git (pesan mucho); se pueden sustituir y volver a ejecutar.
// El fondo de los objetos se quita solo: croma verde o el color liso del borde (p. ej. blanco).
// Si un objeto ya tiene su SVG en assets/sprites/objetos, se usa ese y no se genera el PNG.
import { mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIG_FOTOS = join(raiz, 'originales', 'fotos');
const ORIG_OBJETOS = join(raiz, 'originales', 'objetos');
const ORIG_ENEMIGOS = join(raiz, 'originales', 'enemigos');
const ORIG_ESCENARIO = join(raiz, 'originales', 'escenario');
const DEST_FOTOS = join(raiz, 'assets', 'photos');
const DEST_OBJETOS = join(raiz, 'assets', 'sprites', 'objetos');
const DEST_ENEMIGOS = join(raiz, 'assets', 'sprites', 'enemigos');
const DEST_ESCENARIO = join(raiz, 'assets', 'sprites', 'escenario');
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

// Enemigos: el dibujo se recorta, se reduce al doble de su alto en pantalla (el juego carga los SVG
// al doble para verse nítidos) y se guarda como SVG con la imagen dentro, del tamaño final.
// Así el cuerpo de colisión se ajusta al dibujo y no a los márgenes transparentes.
async function enemigo(f, alto) {
  const { data, info } = await sharp(join(ORIG_ENEMIGOS, f), { density: 144 }).trim().png().toBuffer({ resolveWithObject: true });
  const ancho = Math.round((alto * info.width) / info.height);
  const png = await sharp(data).resize(ancho * 2, alto * 2).png({ compressionLevel: 9 }).toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}"><image width="${ancho}" height="${alto}" xlink:href="data:image/png;base64,${png.toString('base64')}"/></svg>
`;
  const destino = join(DEST_ENEMIGOS, `${parse(f).name}.svg`);
  writeFileSync(destino, svg);
  console.log(`enemigo ${f} -> ${parse(destino).base} (${ancho}x${alto}, ${Math.round(svg.length / 1024)} KB)`);
}

if (existsSync(ORIG_ENEMIGOS)) {
  const config = JSON.parse(readFileSync(join(raiz, 'config', 'enemigos.json'), 'utf8')).enemigos;
  for (const f of readdirSync(ORIG_ENEMIGOS).filter((f) => /\.(svg|png|webp)$/i.test(f))) {
    const c = config[parse(f).name];
    if (!c) console.log(`enemigo ${f}: no está en config/enemigos.json, se omite`);
    else await enemigo(f, c.alto);
  }
}

// Escenario: el código del juego cuenta con estas medidas (lienzo en px; se carga al doble).
//   llenar: el dibujo ocupa todo el lienzo (cajas, mueble, pinchos y puerta deben coincidir con su colisión)
//   abajo:  se apoya en el suelo (origen abajo en el juego); si no, va centrado
//   grupo:  los dibujos que se intercambian en el mismo sitio se recortan juntos para no dar saltos
const ESCENARIO = {
  'atril-off': { w: 80, h: 132, abajo: true, grupo: 'atril' },
  'atril-on': { w: 80, h: 132, abajo: true, grupo: 'atril' },
  'caja-carton': { w: 48, h: 48, llenar: true },
  'caja-juguete': { w: 48, h: 48, llenar: true },
  'caja-libros': { w: 48, h: 48, llenar: true },
  'caja-madera': { w: 48, h: 48, llenar: true },
  mueble: { w: 144, h: 96, llenar: true },
  pinchos: { w: 48, h: 24, llenar: true },
  puerta: { w: 48, h: 144, llenar: true },
  campana: { w: 56, h: 64 },
  candado: { w: 48, h: 56 },
  'cartel-continuara': { w: 300, h: 190, abajo: true },
  clave: { w: 64, h: 128 },
  'icono-foto': { w: 40, h: 40 },
  'icono-objeto': { w: 40, h: 40 },
  'marco-foto': { w: 64, h: 64 },
  meta: { w: 96, h: 144, abajo: true },
  'nota-azul': { w: 32, h: 40, abajo: true },
  'nota-dorada': { w: 32, h: 40, abajo: true },
  'nota-rosa': { w: 32, h: 40, abajo: true },
  'nota-verde': { w: 32, h: 40, abajo: true },
  tarta: { w: 480, h: 340, abajo: true },
  'vela-on': { w: 30, h: 56, abajo: true, grupo: 'vela' },
  'vela-off': { w: 30, h: 56, abajo: true, grupo: 'vela' },
  'vela-cuerpo': { w: 30, h: 56, abajo: true, grupo: 'vela' },
};

// Caja del dibujo (sin márgenes transparentes) en unidades del SVG original
async function cajaDibujo(ruta) {
  const meta = await sharp(ruta).metadata();
  const { info } = await sharp(ruta).trim().toBuffer({ resolveWithObject: true });
  return { x: -info.trimOffsetLeft, y: -info.trimOffsetTop, w: info.width, h: info.height, lienzo: [meta.width, meta.height] };
}

// Recuadro del original que se ve en el lienzo final: la caja del dibujo, ampliada a la proporción del lienzo
function recuadro(caja, c) {
  if (c.llenar) return caja;
  const k = Math.max(caja.w / c.w, caja.h / c.h);
  const w = c.w * k, h = c.h * k;
  return { x: caja.x - (w - caja.w) / 2, y: c.abajo ? caja.y + caja.h - h : caja.y - (h - caja.h) / 2, w, h };
}

async function escenario(nombre, c, caja) {
  const ruta = join(ORIG_ESCENARIO, `${nombre}.svg`);
  const texto = readFileSync(ruta, 'utf8');
  const r = recuadro(caja, c);
  const ajuste = c.llenar ? ' preserveAspectRatio="none"' : '';
  let svg;
  if (!/<image\b/.test(texto)) {
    // vectorial: basta con cambiar el lienzo y el recuadro visible
    const vb = [r.x, r.y, r.w, r.h].map((v) => Math.round(v * 100) / 100).join(' ');
    svg = texto.replace(/<svg\b[^>]*>/, (t) => t.replace(/\s(width|height|viewBox|preserveAspectRatio)="[^"]*"/g, '').replace(/>$/, ` width="${c.w}" height="${c.h}" viewBox="${vb}"${ajuste}>`));
  } else {
    // con imagen incrustada: se recorta y se reduce al doble del lienzo (el juego carga los SVG al doble)
    const [lw, lh] = caja.lienzo;
    const izq = Math.max(0, -Math.floor(r.x)), arr = Math.max(0, -Math.floor(r.y));
    const der = Math.max(0, Math.ceil(r.x + r.w) - lw), aba = Math.max(0, Math.ceil(r.y + r.h) - lh);
    const png = await sharp(await sharp(ruta).extend({ top: arr, bottom: aba, left: izq, right: der, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer())
      .extract({ left: Math.floor(r.x) + izq, top: Math.floor(r.y) + arr, width: Math.round(r.w), height: Math.round(r.h) })
      // al doble como mucho, y sin pasar de la resolución del original (ampliar no añade detalle)
      .resize(Math.round(c.w * Math.min(2, r.w / c.w)), Math.round(c.h * Math.min(2, r.h / c.h)), { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${c.w}" height="${c.h}" viewBox="0 0 ${c.w} ${c.h}"><image width="${c.w}" height="${c.h}" preserveAspectRatio="none" xlink:href="data:image/png;base64,${png.toString('base64')}"/></svg>
`;
  }
  writeFileSync(join(DEST_ESCENARIO, `${nombre}.svg`), svg);
  console.log(`escenario ${nombre}.svg (${c.w}x${c.h}${c.llenar ? ', relleno' : ''}, ${Math.round(svg.length / 1024)} KB)`);
}

if (existsSync(ORIG_ESCENARIO)) {
  const nombres = readdirSync(ORIG_ESCENARIO).filter((f) => f.endsWith('.svg')).map((f) => parse(f).name);
  const cajas = {};
  for (const n of nombres) if (ESCENARIO[n]) cajas[n] = await cajaDibujo(join(ORIG_ESCENARIO, `${n}.svg`));
  // los de un mismo grupo comparten caja (la unión de todas)
  const grupos = {};
  for (const n of Object.keys(cajas)) if (ESCENARIO[n].grupo) (grupos[ESCENARIO[n].grupo] = grupos[ESCENARIO[n].grupo] || []).push(n);
  for (const miembros of Object.values(grupos)) {
    const x0 = Math.min(...miembros.map((n) => cajas[n].x)), y0 = Math.min(...miembros.map((n) => cajas[n].y));
    const x1 = Math.max(...miembros.map((n) => cajas[n].x + cajas[n].w)), y1 = Math.max(...miembros.map((n) => cajas[n].y + cajas[n].h));
    for (const n of miembros) cajas[n] = { ...cajas[n], x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  for (const n of nombres) {
    if (!ESCENARIO[n]) console.log(`escenario ${n}.svg: no está en ESCENARIO, se omite`);
    else await escenario(n, ESCENARIO[n], cajas[n]);
  }
}
