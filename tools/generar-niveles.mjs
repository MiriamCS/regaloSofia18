// Convierte los diseños de tools/niveles/nivel-XX.mjs (mapas ASCII) en JSON de Tiled
// dentro de assets/levels/nivel-XX.json.
//
// Uso: npm run niveles            (todos)
//      npm run niveles -- 0 3     (solo los niveles 0 y 3)
//
// Si un nivel se ha retocado a mano en Tiled, añade al mapa la propiedad booleana
// "editadoAMano" = true y este script ya no lo sobrescribirá.
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const T = 48;
const aqui = dirname(fileURLToPath(import.meta.url));
const salida = join(aqui, '..', 'assets', 'levels');

// Leyenda común a todos los niveles. Cada nivel puede añadir o sobrescribir caracteres.
const LEYENDA_BASE = {
  '#': { tipo: 'solido', capa: 'solidos', fusion: '2d' },
  '=': { tipo: 'nube', capa: 'solidos', fusion: 'h' },
  X: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h' },
  v: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h' },
  '^': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 1 },
  S: { tipo: 'inicio' },
  G: { tipo: 'meta' },
  C: { tipo: 'checkpoint' },
  F: { tipo: 'foto' },
  O: { tipo: 'objeto' },
  B: { tipo: 'caja' },
};

function tipoProp(v) {
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'float';
  return 'string';
}

function props(obj) {
  return Object.entries(obj)
    .filter(([k, v]) => v !== undefined && !['tipo', 'capa', 'fusion', 'w', 'h', 'dx', 'dy', 'nombre'].includes(k))
    .map(([name, value]) => ({ name, type: tipoProp(value), value }));
}

function construir(diseno, numero) {
  const filas = diseno.mapa.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
  const alto = filas.length;
  const ancho = Math.max(...filas.map((f) => f.length));
  const leyenda = { ...LEYENDA_BASE, ...(diseno.leyenda || {}) };
  const capas = { solidos: [], entidades: [], zonas: [] };
  let id = 1;
  const usado = filas.map((f) => Array(ancho).fill(false));
  const car = (x, y) => (filas[y] && filas[y][x]) || ' ';

  const anadir = (def, x, y, w, h) => {
    const capa = def.capa || 'entidades';
    capas[capa].push({
      id: id++,
      name: def.nombre || '',
      type: def.tipo,
      x: (x + (def.dx || 0)) * T,
      y: (y + (def.dy || 0)) * T,
      width: (def.w || w) * T,
      height: (def.h || h) * T,
      rotation: 0,
      visible: true,
      properties: props(def),
    });
  };

  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const c = car(x, y);
      if (c === ' ' || c === '.' || usado[y][x]) continue;
      const def = leyenda[c];
      if (!def) throw new Error(`Nivel ${numero}: carácter '${c}' sin leyenda en (${x}, ${y})`);
      if (def.fusion === 'h' || def.fusion === '2d') {
        let w = 0;
        while (car(x + w, y) === c && !usado[y][x + w]) w++;
        let h = 1;
        if (def.fusion === '2d') {
          // crecer hacia abajo mientras la fila entera sea del mismo carácter
          while (y + h < alto) {
            let ok = true;
            for (let i = 0; i < w; i++) if (car(x + i, y + h) !== c || usado[y + h][x + i]) ok = false;
            // no fusionar si la fila de abajo sigue más allá (evita rectángulos raros)
            if (ok && (car(x - 1, y + h) === c || car(x + w, y + h) === c)) ok = false;
            if (!ok) break;
            h++;
          }
        }
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) usado[y + j][x + i] = true;
        anadir(def, x, y, w, h);
      } else {
        usado[y][x] = true;
        anadir(def, x, y, 1, 1);
      }
    }
  }
  for (const o of diseno.objetos || []) {
    anadir(o, o.x, o.y, o.w || 1, o.h || 1);
  }

  const capasTiled = Object.entries(capas).map(([name, objects], i) => ({
    id: i + 1, name, type: 'objectgroup', draworder: 'topdown', opacity: 1, visible: true, x: 0, y: 0, objects,
  }));
  return {
    type: 'map', version: '1.10', tiledversion: '1.11.0', orientation: 'orthogonal', renderorder: 'right-down',
    width: ancho, height: alto, tilewidth: T, tileheight: T, infinite: false,
    nextlayerid: capasTiled.length + 1, nextobjectid: id,
    properties: props({ nivel: numero, ...(diseno.props || {}) }),
    layers: capasTiled, tilesets: [],
  };
}

const pedidos = process.argv.slice(2).map(Number);
const archivos = readdirSync(join(aqui, 'niveles')).filter((f) => /^nivel-\d\d\.mjs$/.test(f)).sort();
for (const archivo of archivos) {
  const n = Number(archivo.slice(6, 8));
  if (pedidos.length && !pedidos.includes(n)) continue;
  const destino = join(salida, `nivel-${String(n).padStart(2, '0')}.json`);
  if (existsSync(destino)) {
    const previo = JSON.parse(readFileSync(destino, 'utf8'));
    if ((previo.properties || []).some((p) => p.name === 'editadoAMano' && p.value)) {
      console.log(`nivel ${n}: editado a mano en Tiled, no se toca`);
      continue;
    }
  }
  const diseno = (await import(pathToFileURL(join(aqui, 'niveles', archivo)).href)).default;
  const mapa = construir(diseno, n);
  writeFileSync(destino, JSON.stringify(mapa, null, 1));
  console.log(`nivel ${n}: ${mapa.width}x${mapa.height} tiles, ${mapa.nextobjectid - 1} objetos`);
}
