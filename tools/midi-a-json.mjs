// Convierte un MIDI (de dominio público, p.ej. de Mutopia Project o IMSLP) en datos de notas
// que el sintetizador de piano del juego puede tocar.
//
// Uso: node tools/midi-a-json.mjs archivo.mid clave [--desde 0] [--hasta 64] [--transponer 0] [--velocidad 1]
//   clave: inicio | bebe | nina | preado | adolescente | adulta | caminoBlanco | tarta | (o la propiedad 'musica' de un nivel)
//   --desde/--hasta: recorta en pulsos (negras) para hacer un bucle más corto
// Crea assets/music/<clave>.json y lo añade a assets/music/indice.json.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Uso: node tools/midi-a-json.mjs archivo.mid clave [--desde N] [--hasta N] [--transponer N] [--velocidad N]');
  process.exit(1);
}
const [archivo, clave] = args;
const opcion = (n, def) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};

const datos = readFileSync(archivo);
let pos = 0;
const u8 = () => datos[pos++];
const u16 = () => (u8() << 8) | u8();
const u32 = () => ((u8() << 24) | (u8() << 16) | (u8() << 8) | u8()) >>> 0;
const vlq = () => {
  let v = 0;
  let b;
  do {
    b = u8();
    v = (v << 7) | (b & 0x7f);
  } while (b & 0x80);
  return v;
};
const cadena = (n) => {
  const s = datos.toString('latin1', pos, pos + n);
  pos += n;
  return s;
};

if (cadena(4) !== 'MThd') throw new Error('No es un archivo MIDI');
const largoCab = u32();
const formato = u16();
const numPistas = u16();
const division = u16();
pos += largoCab - 6;
if (division & 0x8000) throw new Error('MIDI con división SMPTE no soportado');

let tempo = null; // microsegundos por negra
const notas = [];
for (let p = 0; p < numPistas; p++) {
  if (cadena(4) !== 'MTrk') throw new Error('Pista MIDI mal formada');
  const fin = u32() + pos;
  let tick = 0;
  let estado = 0;
  const abiertas = new Map();
  while (pos < fin) {
    tick += vlq();
    let b = u8();
    if (b === 0xff) {
      const tipo = u8();
      const len = vlq();
      if (tipo === 0x51 && tempo === null) tempo = (datos[pos] << 16) | (datos[pos + 1] << 8) | datos[pos + 2];
      pos += len;
      continue;
    }
    if (b === 0xf0 || b === 0xf7) {
      pos += vlq();
      continue;
    }
    if (b & 0x80) estado = b;
    else pos--; // running status
    const tipo = estado & 0xf0;
    const canal = estado & 0x0f;
    if (tipo === 0x90 || tipo === 0x80) {
      const nota = u8();
      const vel = u8();
      const k = `${canal}-${nota}`;
      if (tipo === 0x90 && vel > 0) {
        abiertas.set(k, { tick, vel });
      } else if (abiertas.has(k)) {
        const a = abiertas.get(k);
        abiertas.delete(k);
        if (canal !== 9) notas.push({ t: a.tick / division, nota, d: (tick - a.tick) / division, vel: a.vel / 127 });
      }
    } else if (tipo === 0xc0 || tipo === 0xd0) {
      pos += 1;
    } else {
      pos += 2;
    }
  }
  pos = fin;
}

const desde = opcion('desde', 0);
const hasta = opcion('hasta', Infinity);
const transponer = opcion('transponer', 0);
const velocidad = opcion('velocidad', 1);
const bpm = Math.round((60000000 / (tempo || 500000)) * velocidad * 10) / 10;
const elegidas = notas
  .filter((n) => n.t >= desde && n.t < hasta)
  .sort((a, b) => a.t - b.t)
  .map((n) => [Math.round((n.t - desde) * 1000) / 1000, n.nota + transponer, Math.round(Math.max(0.1, n.d) * 1000) / 1000, Math.round(Math.min(1, n.vel) * 0.8 * 100) / 100]);
const ultimo = elegidas.reduce((m, n) => Math.max(m, n[0] + n[2]), 0);
const duracion = Number.isFinite(hasta) ? hasta - desde : Math.ceil(ultimo);

const destino = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'music');
writeFileSync(join(destino, `${clave}.json`), JSON.stringify({ _origen: archivo.split('/').pop(), bpm, duracion, notas: elegidas }));
const indicePath = join(destino, 'indice.json');
const indice = existsSync(indicePath) ? JSON.parse(readFileSync(indicePath, 'utf8')) : { pistas: [] };
if (!indice.pistas.includes(clave)) indice.pistas.push(clave);
writeFileSync(indicePath, JSON.stringify(indice, null, 2));
console.log(`MIDI formato ${formato}, ${numPistas} pistas -> ${elegidas.length} notas, ${bpm} bpm, ${duracion} pulsos -> assets/music/${clave}.json`);
