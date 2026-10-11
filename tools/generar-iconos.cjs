// Rasteriza el icono SVG a los PNG de la PWA. Necesita Playwright (no es dependencia del juego):
//   npx -y playwright@1.56.1 install chromium   (si no lo tienes)
//   node tools/generar-iconos.cjs
const path = require('path');
const fs = require('fs');
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }
(async () => {
  const raiz = path.join(__dirname, '..', 'assets');
  const svg = fs.readFileSync(path.join(raiz, 'sprites/escenario/icono.svg'), 'utf8');
  const opciones = fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' } : {};
  const b = await pw.chromium.launch(opciones);
  for (const [nombre, tam, margen] of [['icono-192', 192, 0], ['icono-512', 512, 0], ['icono-512-maskable', 512, 0.1]]) {
    const pg = await b.newPage({ viewport: { width: tam, height: tam } });
    const dentro = Math.round(tam * (1 - margen * 2));
    await pg.setContent(`<body style="margin:0;background:#0d1b3d;display:flex;align-items:center;justify-content:center;width:${tam}px;height:${tam}px">${svg.replace(/<\?xml[^>]*>/, '').replace('<svg ', `<svg style="width:${dentro}px;height:${dentro}px" `)}</body>`);
    await pg.screenshot({ path: path.join(raiz, 'icons', `${nombre}.png`) });
    await pg.close();
  }
  await b.close();
  console.log('Iconos generados en assets/icons');
})();
