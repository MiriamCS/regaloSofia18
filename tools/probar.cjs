// Prueba automática en Chromium sin ventana (requiere Playwright; solo para desarrollo).
// Uso: node tools/probar.cjs "http://localhost:5173/?nivel=3&canvas" salida acción1 acción2 ...
// Acciones:
//   esperar:ms            espera
//   shot:nombre           captura -> salida-nombre.png
//   ArrowRight:ms         mantiene una tecla (combinar con +: ArrowRight+ArrowUp:400)
//   tp:x,y                coloca a Sofía en (x, y) px (pies)
//   tpc:col,fila          coloca a Sofía de pie en la casilla (col, fila)
//   estado                imprime posición, velas, coleccionables...
//   eval:codigo           evalúa JS (URL-encoded) y lo imprime
//   clic:x,y              toca la pantalla en (x, y)
//   arrastrar:x1,y1,x2,y2 arrastra el ratón/dedo (p.ej. soplar las velas de la tarta)
// Teclas: flechas o A/D, saltar = ArrowUp/Space, cantar = x, correr = Shift.
// Consejo: usa &canvas en la URL; en este entorno WebGL va a pocos fps.
const path = require('path');
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
(async () => {
  const [url, base, ...acc] = process.argv.slice(2);
  const fs = require('fs');
  const opciones = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } : {};
  const b = await pw.chromium.launch(opciones);
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errores = [];
  pg.on('pageerror', (e) => errores.push('ERROR ' + e.message));
  pg.on('console', (m) => { if (m.type() === 'error') errores.push('consola ' + m.text()); });
  await pg.goto(url);
  // esperar a que exista la escena de juego
  if (/nivel=/.test(url)) await pg.waitForFunction(() => window.juego && window.juego.scene.getScene('Juego') && window.juego.scene.getScene('Juego').sofia && window.juego.scene.isActive('Juego'), null, { timeout: 20000 }).catch(() => errores.push('la escena de juego no arrancó'));
  else await pg.waitForTimeout(2500);
  await pg.waitForTimeout(400);
  const estado = () => pg.evaluate(() => {
    const s = window.juego.scene.getScene('Juego');
    const c = s.sofia;
    return { x: Math.round(c.x), y: Math.round(c.y), col: Math.floor(c.x / 48), fila: Math.floor((c.y - 1) / 48), anim: c.estado, velas: s.velas, foto: s.tieneFoto, objeto: s.tieneObjeto, completado: s.terminado, final: s.enFinal, fps: Math.round(window.juego.loop.actualFps) };
  });
  for (const a of acc) {
    const i = a.indexOf(':');
    const k = i < 0 ? a : a.slice(0, i);
    const v = i < 0 ? '' : a.slice(i + 1);
    if (k === 'esperar') await pg.waitForTimeout(Number(v));
    else if (k === 'shot') await pg.screenshot({ path: `${base}-${v}.png` });
    else if (k === 'clic') {
      const [x, y] = v.split(',').map(Number);
      await pg.mouse.click(x, y);
    } else if (k === 'arrastrar') {
      // arrastrar:x1,y1,x2,y2[,pasos]  (coordenadas de pantalla 1280x720)
      const [x1, y1, x2, y2, pasos = 20] = v.split(',').map(Number);
      await pg.mouse.move(x1, y1);
      await pg.mouse.down();
      await pg.mouse.move(x2, y2, { steps: pasos });
      await pg.mouse.up();
    } else if (k === 'estado') console.log('ESTADO', JSON.stringify(await estado()));
    else if (k === 'eval') console.log('EVAL', JSON.stringify(await pg.evaluate(decodeURIComponent(v))));
    else if (k === 'tp' || k === 'tpc') {
      let [x, y] = v.split(',').map(Number);
      if (k === 'tpc') { x = x * 48 + 24; y = (y + 1) * 48 - 1; }
      await pg.evaluate(([x, y]) => { const s = window.juego.scene.getScene('Juego'); s.sofia.colocar(x, y); s.cameras.main.centerOn(x, y); }, [x, y]);
      await pg.waitForTimeout(150);
    } else {
      const teclas = k.split('+');
      for (const t of teclas) await pg.keyboard.down(t);
      await pg.waitForTimeout(Number(v));
      for (const t of teclas) await pg.keyboard.up(t);
    }
  }
  if (errores.length) console.log(errores.slice(0, 20).join('\n'));
  await b.close();
})();
