// Convierte los vídeos de Sofía (docs/videos, fondo verde croma) en hojas de sprites para el juego.
// Uso: npm run fotogramas
// Lee tools/fotogramas-sofia.json (qué fotogramas van a cada animación) y genera:
//   assets/sprites/sofia/<etapa>/fotogramas/<modo>-<animacion>.png  (rejilla de fotogramas)
//   assets/sprites/sofia/fotogramas.json                              (índice que carga el juego)
// Todos los fotogramas de un mismo modo (p. ej. bebé a gatas) comparten tamaño y punto de apoyo (los pies),
// así el personaje no baila al cambiar de animación, aunque vengan de vídeos distintos: cada vídeo se calibra
// con su propia pose de referencia.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const VIDEOS = join(RAIZ, 'docs', 'videos');
const SALIDA = join(RAIZ, 'assets', 'sprites', 'sofia');
const ESCALA_TEX = 2; // como en src/entities/Sofia.js: las texturas van al doble de resolución
const ANCHO_MAX = 2048; // ancho máximo de textura seguro en móviles
const MARGEN = 6; // píxeles de vídeo alrededor del personaje

const config = JSON.parse(readFileSync(join(RAIZ, 'tools', 'fotogramas-sofia.json'), 'utf8'));

// Quita el verde: transparencia según cuánto domina el verde y elimina el halo verde de los bordes.
function quitarVerde(data, W, H) {
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const k = g - Math.max(r, b);
    let a = 1;
    if (k > 70) a = 0;
    else if (k > 25) a = 1 - (k - 25) / 45;
    data[p + 1] = Math.min(g, Math.max(r, b));
    const x = i % W;
    const y = (i / W) | 0;
    if (x < 2 || y < 2 || x >= W - 2 || y >= H - 2) a = 0;
    data[p + 3] = Math.round(a * 255);
  }
  return data;
}

function cajaOpaca(data, W, H) {
  let x0 = W;
  let y0 = H;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1, y1 };
}

const mediana = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];

const numeros = (a) => {
  const lista = [];
  for (let n = a.de; n <= a.a; n += a.paso || 1) lista.push(n);
  return lista;
};

// Recorta y escala los fotogramas de un vídeo. Cada uno queda colocado respecto a los pies de la pose de referencia
// del vídeo (x = centro, y = suelo), en píxeles de textura.
async function procesarVideo(nombreVideo, cfg, alto) {
  const video = join(VIDEOS, nombreVideo);
  if (!existsSync(video)) {
    console.log(`  (falta ${nombreVideo}, se omite)`);
    return null;
  }
  const tmp = mkdtempSync(join(tmpdir(), 'fotogramas-'));
  try {
    execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-i', video, '-start_number', '0', join(tmp, '%04d.png')]);
    const usados = new Set();
    for (let n = cfg.referencia[0]; n <= cfg.referencia[1]; n++) usados.add(n);
    for (const a of Object.values(cfg.animaciones)) for (const n of numeros(a)) usados.add(n);

    // 1. Quitar el fondo y medir cada fotograma
    const fot = new Map();
    let W = 0;
    let H = 0;
    for (const n of [...usados].sort((a, b) => a - b)) {
      const { data, info } = await sharp(join(tmp, `${String(n).padStart(4, '0')}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      W = info.width;
      H = info.height;
      quitarVerde(data, W, H);
      fot.set(n, { data, caja: cajaOpaca(data, W, H) });
    }

    // 2. Línea de los pies y escala (a partir de la pose de referencia)
    const ref = [];
    for (let n = cfg.referencia[0]; n <= cfg.referencia[1]; n++) ref.push(fot.get(n).caja);
    const suelo = mediana(ref.map((c) => c.y1));
    const centro = mediana(ref.map((c) => (c.x0 + c.x1) / 2));
    const altoVideo = mediana(ref.map((c) => c.y1 - c.y0));
    const escala = (alto * ESCALA_TEX) / altoVideo;

    // 3. Cada fotograma usado, recortado a su caja y escalado
    const animaciones = {};
    for (const [nombre, a] of Object.entries(cfg.animaciones)) {
      const lista = [];
      for (const n of numeros(a)) {
        const { data, caja } = fot.get(n);
        const x0 = Math.max(0, caja.x0 - MARGEN);
        const y0 = Math.max(0, caja.y0 - MARGEN);
        const x1 = Math.min(W - 1, caja.x1 + MARGEN);
        const y1 = Math.min(H - 1, caja.y1 + MARGEN);
        const w = Math.max(1, Math.round((x1 - x0 + 1) * escala));
        const h = Math.max(1, Math.round((y1 - y0 + 1) * escala));
        const img = await sharp(data, { raw: { width: W, height: H, channels: 4 } })
          .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
          .resize(w, h, { kernel: 'lanczos3' })
          .png()
          .toBuffer();
        lista.push({ img, x: Math.round((x0 - centro) * escala), y: Math.round((y0 - suelo) * escala), w, h });
      }
      animaciones[nombre] = { lista, fps: a.fps, bucle: !!a.bucle };
    }
    return animaciones;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function procesarModo(etapa, modo, cfg, indice) {
  // 1. Fotogramas de todos los vídeos del modo
  const anims = {};
  for (const [nombreVideo, cv] of Object.entries(cfg.videos)) {
    console.log(`  <- ${nombreVideo}`);
    Object.assign(anims, await procesarVideo(nombreVideo, cv, cfg.alto));
  }
  if (!Object.keys(anims).length) return;

  // 2. Caja común a todos los fotogramas del modo, con los pies en el mismo punto
  let L = 0;
  let T = 0;
  let R = 0;
  let B = 0;
  for (const a of Object.values(anims)) {
    for (const p of a.lista) {
      L = Math.min(L, p.x);
      T = Math.min(T, p.y);
      R = Math.max(R, p.x + p.w);
      B = Math.max(B, p.y + p.h);
    }
  }
  const fw = R - L;
  const fh = B - T;
  const origen = [Math.round((-L / fw) * 1000) / 1000, Math.round((-T / fh) * 1000) / 1000];

  // 3. Una rejilla por animación
  const dirSalida = join(SALIDA, etapa, 'fotogramas');
  mkdirSync(dirSalida, { recursive: true });
  // altoJuego: lo que mide Sofía en el juego en la pose neutra (sirve para su cuerpo físico)
  const info = { ancho: fw, alto: fh, origen, altoJuego: cfg.alto, animaciones: {} };
  for (const [nombre, a] of Object.entries(anims)) {
    const total = a.lista.length;
    const columnas = Math.max(1, Math.min(total, Math.floor(ANCHO_MAX / fw)));
    const filas = Math.ceil(total / columnas);
    const piezas = a.lista.map((p, k) => ({
      input: p.img,
      left: (k % columnas) * fw + p.x - L,
      top: Math.floor(k / columnas) * fh + p.y - T,
    }));
    const archivo = `${modo}-${nombre}.png`;
    await sharp({ create: { width: columnas * fw, height: filas * fh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(piezas)
      .png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 })
      .toFile(join(dirSalida, archivo));
    info.animaciones[nombre] = { archivo: `${etapa}/fotogramas/${archivo}`, fotogramas: total, fps: a.fps, bucle: a.bucle };
    console.log(`  ${etapa}/${archivo}: ${total} fotogramas de ${fw}x${fh}`);
  }
  indice[etapa] = indice[etapa] || {};
  indice[etapa][modo] = info;
}

const indice = { _comentario: 'Generado por tools/video-a-sprites.mjs a partir de tools/fotogramas-sofia.json.' };
for (const [etapa, modos] of Object.entries(config)) {
  if (etapa.startsWith('_')) continue;
  for (const [modo, cfg] of Object.entries(modos)) {
    console.log(`${etapa} (${modo})`);
    await procesarModo(etapa, modo, cfg, indice);
  }
}
writeFileSync(join(SALIDA, 'fotogramas.json'), JSON.stringify(indice, null, 2) + '\n');
console.log('Índice escrito en assets/sprites/sofia/fotogramas.json');
