// Convierte los vídeos de los personajes (docs/videos, fondo verde croma) en hojas de sprites para el juego.
// Uso: npm run fotogramas              (Sofía y Miriam)
//      npm run fotogramas -- miriam    (solo un personaje)
// Lee tools/fotogramas-<personaje>.json (qué fotogramas van a cada animación) y genera:
//   assets/sprites/<personaje>/<etapa>/fotogramas/<modo>-<animacion>.png  (rejilla de fotogramas)
//   assets/sprites/<personaje>/fotogramas.json                              (índice que carga el juego)
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
const ESCALA_TEX = 2; // como en src/entities/Sofia.js: las texturas van al doble de resolución
const ANCHO_MAX = 2048; // ancho máximo de textura seguro en móviles
const MARGEN = 6; // píxeles de vídeo alrededor del personaje

const PERSONAJES = ['sofia', 'miriam'];

// Color del fondo: la mediana de los píxeles del borde del fotograma (no todos los vídeos salen con el verde puro)
function colorFondo(data, W, H) {
  const rs = [];
  const gs = [];
  const bs = [];
  const tomar = (x, y) => {
    const p = (y * W + x) * 4;
    rs.push(data[p]);
    gs.push(data[p + 1]);
    bs.push(data[p + 2]);
  };
  for (let x = 0; x < W; x += 8) {
    tomar(x, 4);
    tomar(x, H - 5);
  }
  for (let y = 0; y < H; y += 8) {
    tomar(4, y);
    tomar(W - 5, y);
  }
  return [mediana(rs), mediana(gs), mediana(bs)];
}

// Quita el fondo verde: transparencia según cuánto domina el verde y cuánto se parece el píxel al color del fondo
// (así también se va la sombra verde oscura bajo los pies), y elimina el halo verde de los bordes.
function quitarVerde(data, W, H) {
  const [fr, fg, fb] = colorFondo(data, W, H);
  for (let i = 0; i < W * H; i++) {
    const p = i * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const k = g - Math.max(r, b);
    let a = 1;
    if (k > 70) a = 0;
    else if (k > 25) a = 1 - (k - 25) / 45;
    const dist = Math.hypot(r - fr, g - fg, b - fb);
    if (k > 0) a = Math.min(a, Math.max(0, Math.min(1, (dist - 45) / 45)));
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

// En la 'zona' [x0, y0, x1, y1] borra todo menos los colores de 'conservar' (p. ej. una caja que aparece en el vídeo
// y las manos que se apoyan en ella: se queda la piel y se va la caja)
function limpiar(data, W, H, { zona: [x0, y0, x1, y1], conservar, tolerancia = 60 }) {
  for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
      const p = (y * W + x) * 4;
      if (!conservar.some(([r, g, b]) => Math.hypot(data[p] - r, data[p + 1] - g, data[p + 2] - b) <= tolerancia)) data[p + 3] = 0;
    }
  }
}

// 'sueltos': borra los trozos que no están unidos al cuerpo y son pequeños (menos de esa fracción del trozo más
// grande), p. ej. un rizo que el vídeo dibuja suelto junto a la coleta
function quitarSueltos(data, W, H, fraccion) {
  const marca = new Int32Array(W * H).fill(-1);
  const tamanos = [];
  const pila = [];
  for (let i = 0; i < W * H; i++) {
    if (marca[i] !== -1 || data[i * 4 + 3] < 40) continue;
    const id = tamanos.length;
    let n = 0;
    marca[i] = id;
    pila.push(i);
    while (pila.length) {
      const p = pila.pop();
      n++;
      const x = p % W;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W]) {
        if (q < 0 || q >= W * H || marca[q] !== -1 || data[q * 4 + 3] < 40) continue;
        marca[q] = id;
        pila.push(q);
      }
    }
    tamanos.push(n);
  }
  const minimo = Math.max(...tamanos, 0) * fraccion;
  for (let i = 0; i < W * H; i++) if (marca[i] !== -1 && tamanos[marca[i]] < minimo) data[i * 4 + 3] = 0;
}

const mediana = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];

// Fotogramas de una animación: de 'de' a 'a' cada 'paso', sin el tramo 'sin' ([desde, hasta]) si lo hay
const numeros = (a) => {
  const lista = [];
  for (let n = a.de; n <= a.a; n += a.paso || 1) if (!a.sin || n < a.sin[0] || n > a.sin[1]) lista.push(n);
  return lista;
};

// Deja transparente lo que queda fuera del 'recorte' [x0, y0, x1, y1] (p. ej. un suelo o un dibujo que se cuela)
function recortar(data, W, H, [x0, y0, x1, y1]) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) if (x < x0 || x >= x1 || y < y0 || y >= y1) data[(y * W + x) * 4 + 3] = 0;
  }
}

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
      if (cfg.recorte) recortar(data, W, H, cfg.recorte);
      if (cfg.limpiar) limpiar(data, W, H, cfg.limpiar);
      if (cfg.sueltos) quitarSueltos(data, W, H, cfg.sueltos);
      fot.set(n, { data, caja: cajaOpaca(data, W, H) });
    }

    // 2. Línea de los pies y escala (a partir de la pose de referencia)
    const ref = [];
    for (let n = cfg.referencia[0]; n <= cfg.referencia[1]; n++) ref.push(fot.get(n).caja);
    const suelo = mediana(ref.map((c) => c.y1));
    const centro = mediana(ref.map((c) => (c.x0 + c.x1) / 2));
    const altoVideo = mediana(ref.map((c) => c.y1 - c.y0));
    const escala = (alto * ESCALA_TEX) / altoVideo;

    // 3. Cada fotograma usado, recortado a su caja y escalado.
    // 'anclar': 'pies' pone los pies de cada fotograma en el suelo (saltos: la altura la da el juego);
    // 'centro' centra cada fotograma en el cuerpo (voltereta). 'centrar' mueve en horizontal toda la animación
    // para que quede centrada como la referencia (si en ese tramo del vídeo el personaje se ha desplazado).
    const centroY = suelo - altoVideo / 2;
    const animaciones = {};
    for (const [nombre, a] of Object.entries(cfg.animaciones)) {
      const lista = [];
      const frentes = [];
      const dxAnim = a.centrar ? centro - mediana(numeros(a).map((n) => (fot.get(n).caja.x0 + fot.get(n).caja.x1) / 2)) : 0;
      for (const n of numeros(a)) {
        const { data, caja } = fot.get(n);
        let dx = dxAnim;
        let dy = 0;
        if (a.anclar === 'pies') dy = suelo - caja.y1;
        else if (a.anclar === 'centro') {
          dx = centro - (caja.x0 + caja.x1) / 2;
          dy = centroY - (caja.y0 + caja.y1) / 2;
        }
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
        lista.push({ img, x: Math.round((x0 + dx - centro) * escala), y: Math.round((y0 + dy - suelo) * escala), w, h });
        frentes.push((caja.x1 + 1 + dx - centro) * escala);
      }
      // alcance: hasta dónde llega por delante en cada fotograma (las manos al empujar), en unidades del juego
      // desde el centro de los pies
      animaciones[nombre] = { lista, fps: a.fps, bucle: !!a.bucle, vaiven: !!a.vaiven, alcance: frentes.map((x) => Math.round((x / ESCALA_TEX) * 10) / 10) };
    }
    return animaciones;
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function procesarModo(salida, etapa, modo, cfg, indice) {
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
  const dirSalida = join(salida, etapa, 'fotogramas');
  mkdirSync(dirSalida, { recursive: true });
  // altoJuego: lo que mide el personaje en el juego en la pose neutra (sirve para su cuerpo físico)
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
    // el juego retrasa el dibujo al empujar para que las manos se queden en el borde de la caja
    if (nombre === 'empujar') info.animaciones[nombre].alcance = a.alcance;
    // 'vaiven': el bucle va y vuelve (para tramos que no acaban en la misma postura en que empiezan)
    if (a.vaiven) info.animaciones[nombre].vaiven = true;
    console.log(`  ${etapa}/${archivo}: ${total} fotogramas de ${fw}x${fh}`);
  }
  indice[etapa] = indice[etapa] || {};
  indice[etapa][modo] = info;
}

const pedidos = process.argv.slice(2);
for (const personaje of PERSONAJES) {
  if (pedidos.length && !pedidos.includes(personaje)) continue;
  const nombreConfig = `fotogramas-${personaje}.json`;
  const config = JSON.parse(readFileSync(join(RAIZ, 'tools', nombreConfig), 'utf8'));
  const salida = join(RAIZ, 'assets', 'sprites', personaje);
  const indice = { _comentario: `Generado por tools/video-a-sprites.mjs a partir de tools/${nombreConfig}.` };
  for (const [etapa, modos] of Object.entries(config)) {
    if (etapa.startsWith('_')) continue;
    for (const [modo, cfg] of Object.entries(modos)) {
      console.log(`${personaje}: ${etapa} (${modo})`);
      await procesarModo(salida, etapa, modo, cfg, indice);
    }
  }
  writeFileSync(join(salida, 'fotogramas.json'), JSON.stringify(indice, null, 2) + '\n');
  console.log(`Índice escrito en assets/sprites/${personaje}/fotogramas.json`);
}
