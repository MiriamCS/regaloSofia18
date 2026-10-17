// Genera los SVG del juego en assets/sprites a partir del código de tools/arte.
// Uso: npm run sprites
// OJO: sobrescribe los SVG. Si se retoca alguno en Inkscape, quítalo de la lista o cópialo aparte.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg } from './arte/comun.mjs';
import { spritesObjetos } from './arte/objetos.mjs';
import { spritesEscenario } from './arte/escenario.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sprites');

function escribir(ruta, texto) {
  mkdirSync(dirname(ruta), { recursive: true });
  writeFileSync(ruta, texto);
}

// Los enemigos y casi todo el escenario son dibujos de Miriam (originales/ -> npm run imagenes); aquí
// solo se generan los botones táctiles, para no sobrescribirlos.
const DEL_CODIGO = (grupo, nombre) => grupo !== 'escenario' || nombre.startsWith('boton-');
for (const [grupo, sprites] of [['objetos', spritesObjetos()], ['escenario', spritesEscenario()]]) {
  for (const [nombre, s] of Object.entries(sprites)) {
    if (!DEL_CODIGO(grupo, nombre)) continue;
    escribir(join(raiz, grupo, `${nombre}.svg`), svg(s.w, s.h, s.cuerpo));
  }
}
console.log('Sprites generados en', raiz);
