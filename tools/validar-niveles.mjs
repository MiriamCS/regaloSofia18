// Comprueba que los niveles de assets/levels cumplen las reglas de diseño de SPEC.md.
// Uso: npm run validar   (o: node tools/validar-niveles.mjs 3 4)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const textos = JSON.parse(readFileSync(join(raiz, 'config', 'texts.json'), 'utf8'));
const conFoto = new Set(JSON.parse(readFileSync(join(raiz, 'config', 'photos.json'), 'utf8')).fotos.map((f) => f.nivel));
const juego = JSON.parse(readFileSync(join(raiz, 'config', 'juego.json'), 'utf8'));
const SPRITES_ENEMIGOS = Object.keys(JSON.parse(readFileSync(join(raiz, 'config', 'enemigos.json'), 'utf8')).enemigos);
const TIPOS = new Set(['solido', 'nube', 'plataforma-movil', 'plataforma-cae', 'plataforma-falsa', 'plataforma-temporizada', 'plataforma-musical', 'tecla', 'campana', 'puerta', 'checkpoint', 'foto', 'objeto', 'meta', 'meta-falsa', 'miriam', 'cartel', 'caja', 'mueble', 'enemigo', 'pinchos', 'lluvia', 'peligro-movil', 'muerte', 'invertir', 'gravedad', 'final', 'aviso', 'decorado', 'inicio']);

const pedidos = process.argv.slice(2).map(Number);
let errores = 0;
let avisos = 0;
for (let n = 0; n <= 18; n++) {
  if (pedidos.length && !pedidos.includes(n)) continue;
  const ruta = join(raiz, 'assets', 'levels', `nivel-${String(n).padStart(2, '0')}.json`);
  const err = (m) => {
    errores++;
    console.log(`  ✗ ${m}`);
  };
  const aviso = (m) => {
    avisos++;
    console.log(`  · ${m}`);
  };
  console.log(`Nivel ${n}`);
  const erroresAntes = errores;
  if (!existsSync(ruta)) {
    err('no existe el archivo');
    continue;
  }
  const mapa = JSON.parse(readFileSync(ruta, 'utf8'));
  const objetos = mapa.layers.flatMap((l) => (l.objects || []).map((o) => ({ ...o, p: Object.fromEntries((o.properties || []).map((p) => [p.name, p.value])) })));
  const cuenta = (t) => objetos.filter((o) => o.type === t).length;
  for (const o of objetos) if (!TIPOS.has(o.type)) err(`tipo desconocido '${o.type}' (id ${o.id})`);
  if (cuenta('inicio') !== 1) err(`debe haber 1 inicio (hay ${cuenta('inicio')})`);
  if (n < 18 && cuenta('meta') !== 1) err(`debe haber 1 meta (hay ${cuenta('meta')})`);
  if (n === 18 && cuenta('final') !== 1) err('el nivel 18 necesita una zona "final"');
  // los niveles sin entrada en config/photos.json (el 18) no llevan foto
  const fotos = conFoto.has(n) ? 1 : 0;
  if (cuenta('foto') !== fotos) err(`debe haber ${fotos} foto (hay ${cuenta('foto')})`);
  if (cuenta('objeto') !== 1) err(`debe haber 1 objeto (hay ${cuenta('objeto')})`);
  if (cuenta('miriam') < 1) err('Miriam debe aparecer al menos una vez');
  const cps = cuenta('checkpoint');
  if (cps < 2 || cps > 4) err(`debe haber entre 2 y 4 checkpoints (hay ${cps})`);
  // pistas: config/texts.json y, si existe, tools/niveles/pistas-XX.json (se fusiona con tools/fusionar-pistas.mjs)
  const rutaPistas = join(raiz, 'tools', 'niveles', `pistas-${String(n).padStart(2, '0')}.json`);
  const extra = existsSync(rutaPistas) ? JSON.parse(readFileSync(rutaPistas, 'utf8')).pistas || {} : {};
  const pistas = { ...(textos.niveles?.[n]?.pistas || {}), ...extra };
  for (const o of objetos) {
    if ((o.type === 'miriam' || o.type === 'cartel' || o.type === 'aviso' || o.type === 'meta-falsa') && o.p.pista && !pistas[o.p.pista]) err(`falta el texto de la pista '${o.p.pista}' en config/texts.json (niveles[${n}].pistas)`);
    if (o.type === 'miriam' && !o.p.pista) err(`Miriam (id ${o.id}) sin pista`);
    if (o.type === 'enemigo' && o.p.sprite && !SPRITES_ENEMIGOS.includes(o.p.sprite)) err(`sprite de enemigo desconocido '${o.p.sprite}'`);
    if (o.type === 'puerta' && !o.p.secuencia) err(`puerta (id ${o.id}) sin secuencia`);
    if (o.type === 'pinchos' && o.p.danio >= 2 && n < 10) err(`peligro de ${o.p.danio} velas antes del nivel 10`);
    if (o.type === 'pinchos' && o.p.danio >= 3 && n < 15) err(`peligro de 3 velas antes del nivel 15`);
    if (o.type === 'enemigo' && o.p.clase === 'desafinado' && n < juego.habilidades.cantar) aviso('enemigo desafinado antes de poder cantar');
  }
  const usaCanto = objetos.some((o) => ['plataforma-musical', 'campana'].includes(o.type));
  if (usaCanto && n < juego.habilidades.cantar) err('usa canto antes de desbloquearlo');
  const anchoTiles = mapa.width;
  if (n > 0 && anchoTiles < 120) aviso(`nivel corto (${anchoTiles} casillas de ancho)`);
  // distancia entre checkpoints (aprox. por posición horizontal: nunca más de ~3 min)
  const xs = [objetos.find((o) => o.type === 'inicio')?.x || 0, ...objetos.filter((o) => o.type === 'checkpoint').map((o) => o.x).sort((a, b) => a - b)];
  for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] > 110 * 48) aviso(`tramo largo entre checkpoints (${Math.round((xs[i] - xs[i - 1]) / 48)} casillas)`);
  if (errores === erroresAntes) console.log('  ✓ correcto');
}
console.log(`\n${errores} errores, ${avisos} avisos`);
process.exit(errores ? 1 : 0);
