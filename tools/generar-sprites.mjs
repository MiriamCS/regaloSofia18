// Genera los SVG del juego en assets/sprites a partir del código de tools/arte.
// Uso: npm run sprites
// OJO: sobrescribe los SVG. Si se retoca alguno en Inkscape, quítalo de la lista o cópialo aparte.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg, f } from './arte/comun.mjs';
import { ETAPAS, piezasSofia } from './arte/sofia.mjs';
import { piezasMiriam } from './arte/miriam.mjs';
import { spritesEnemigos } from './arte/enemigos.mjs';
import { spritesObjetos } from './arte/objetos.mjs';
import { spritesEscenario } from './arte/escenario.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sprites');

function escribir(ruta, texto) {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, texto);
}

// Personajes por piezas: cada pieza va en su caja con su punto de giro.
function exportarRig(nombre, etapas, generador) {
  const rig = { _comentario: 'Generado por tools/generar-sprites.mjs. Coordenadas con origen en los pies (y negativa hacia arriba).', etapas: {} };
  for (const etapa of etapas) {
    const { piezas, medidas } = generador(etapa);
    const info = { medidas, piezas: {} };
    for (const [pieza, p] of Object.entries(piezas)) {
      const [x, y, w, h] = p.caja;
      const cuerpo = `<g transform="translate(${f(-x)} ${f(-y)})">${p.cuerpo}</g>`;
      escribir(join(raiz, nombre, etapa, `${pieza}.svg`), svg(Math.ceil(w), Math.ceil(h), cuerpo));
      info.piezas[pieza] = {
        w: Math.ceil(w), h: Math.ceil(h),
        pivote: p.pivote,
        origen: [f((p.pivote[0] - x) / Math.ceil(w)), f((p.pivote[1] - y) / Math.ceil(h))],
      };
    }
    rig.etapas[etapa] = info;
  }
  escribir(join(raiz, nombre, 'rig.json'), JSON.stringify(rig, null, 2));
}

exportarRig('sofia', Object.keys(ETAPAS), piezasSofia);
exportarRig('miriam', ['nina', 'preado', 'adolescente', 'adulta'], piezasMiriam);

for (const [grupo, sprites] of [['enemigos', spritesEnemigos()], ['objetos', spritesObjetos()], ['escenario', spritesEscenario()]]) {
  for (const [nombre, s] of Object.entries(sprites)) {
    escribir(join(raiz, grupo, `${nombre}.svg`), svg(s.w, s.h, s.cuerpo));
  }
}
console.log('Sprites generados en', raiz);
