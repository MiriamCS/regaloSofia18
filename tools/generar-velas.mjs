// Velas vectoriales a partir de src/ui/velaSvg.js:
//   vela-on.svg     (encendida: interfaz del nivel, transición, menú)
//   vela-off.svg    (apagada, con humo)
//   vela-cuerpo.svg (solo cuerpo y mecha: velas por encender del menú y tarta final)
// Uso: npm run velas
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgVela } from '../src/ui/velaSvg.js';

const DESTINO = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sprites', 'escenario');

for (const [nombre, llama] of [['vela-on', 'on'], ['vela-off', 'off'], ['vela-cuerpo', null]]) {
  writeFileSync(join(DESTINO, `${nombre}.svg`), `${svgVela({ llama })}\n`);
}
console.log('Velas en assets/sprites/escenario');
