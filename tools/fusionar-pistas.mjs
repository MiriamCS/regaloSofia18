// Copia los textos de tools/niveles/pistas-XX.json a config/texts.json (niveles[N]).
// Uso: node tools/fusionar-pistas.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const rutaTextos = join(raiz, 'config', 'texts.json');
const textos = JSON.parse(readFileSync(rutaTextos, 'utf8'));
for (const f of readdirSync(join(raiz, 'tools', 'niveles')).filter((f) => /^pistas-\d\d\.json$/.test(f))) {
  const n = Number(f.slice(7, 9));
  const p = JSON.parse(readFileSync(join(raiz, 'tools', 'niveles', f), 'utf8'));
  textos.niveles[n] = { ...(textos.niveles[n] || {}), ...(p.nombre ? { nombre: p.nombre } : {}), pistas: { ...(textos.niveles[n]?.pistas || {}), ...(p.pistas || {}) } };
  console.log(`nivel ${n}: ${Object.keys(p.pistas || {}).length} textos`);
}
writeFileSync(rutaTextos, JSON.stringify(textos, null, 2) + '\n');
