// Busca zonas sin salida: sitios a los que Sofía puede llegar desde el inicio pero desde los que ya no
// puede llegar a la meta (solo saldría reiniciando o perdiendo velas).
// Simula los saltos con la física de config/juego.json (salto, doble salto, correr, nubes de un solo
// sentido, gravedad invertida, mundos día/noche...). Es una aproximación optimista: las puertas cuentan
// como abiertas, las cajas como escalones allí donde se pueden empujar, los enemigos se ignoran y las
// plataformas que aparecen o se mueven cuentan como si estuvieran siempre.
//
// Uso: npm run alcance            (todos)
//      npm run alcance -- 17      (solo el 17)
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const JUEGO = JSON.parse(readFileSync(join(raiz, 'config', 'juego.json'), 'utf8'));
const FOTOS = JSON.parse(readFileSync(join(raiz, 'assets', 'sprites', 'sofia', 'fotogramas.json'), 'utf8'));
const F = JUEGO.fisica;
const T = 48;
const DT = 1 / 60;

const etapaDeNivel = (n) => (n <= 2 ? 'bebe' : n <= 7 ? 'nina' : n <= 12 ? 'preado' : n <= 17 ? 'adolescente' : 'adulta');

// celdas: 0 vacío, 1 sólido, 2 de un solo sentido (nube y plataformas finas).
// mundo: 'A' o 'B' en los niveles con mundos (lo del otro mundo no existe); null en el resto.
function rasterizar(mapa, objetos, mundo) {
  const W = mapa.width;
  const H = mapa.height;
  const celdas = new Uint8Array(W * H);
  // zonas de daño en píxeles, como en JuegoScene: los pinchos solo pican en la franja de abajo
  const peligro = [];
  const gravedad = new Int8Array(W * H).fill(1);
  const pintar = (o, fn, dx = 0, dy = 0) => {
    const x0 = Math.round((o.x + dx) / T);
    const y0 = Math.round((o.y + dy) / T);
    const w = Math.max(1, Math.round(o.width / T));
    const h = Math.max(1, Math.round(o.height / T));
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (x >= 0 && y >= 0 && x < W && y < H) fn(y * W + x);
  };
  const fino = (o) => o.p.estilo !== 'solido';
  for (const o of objetos) {
    if (mundo && o.p.mundo && o.p.mundo !== mundo) continue;
    switch (o.type) {
      case 'solido':
      case 'tecla':
      case 'plataforma-cae':
        pintar(o, (i) => (celdas[i] = 1));
        break;
      case 'plataforma-falsa':
        if (o.p.modo !== 'fantasma') pintar(o, (i) => (celdas[i] = 1));
        break;
      case 'nube':
        pintar({ ...o, height: T }, (i) => (celdas[i] ||= 2));
        break;
      case 'plataforma-temporizada':
      case 'plataforma-musical':
        if (fino(o)) pintar({ ...o, height: T }, (i) => (celdas[i] ||= 2));
        else pintar(o, (i) => (celdas[i] = 1));
        break;
      case 'plataforma-movil':
        // la plataforma pasa por todo su recorrido: se marca en varios puntos
        for (const k of [0, 0.25, 0.5, 0.75, 1]) pintar({ ...o, height: T }, (i) => (celdas[i] ||= fino(o) ? 2 : 1), (o.p.dx || 0) * T * k, (o.p.dy || 0) * T * k);
        break;
      case 'pinchos':
        peligro.push({ l: o.x + 5, t: o.y + o.height - 20, r: o.x + o.width - 5, b: o.y + o.height });
        break;
      case 'muerte':
        peligro.push({ l: o.x, t: o.y, r: o.x + o.width, b: o.y + o.height });
        break;
      case 'gravedad':
        pintar(o, (i) => (gravedad[i] = o.p.factor < 0 ? -1 : 1));
        break;
    }
  }
  // cajas: en todos los sitios a los que se puede empujar una caja se puede subir como si fuera una nube;
  // si hay varias, también se pueden apilar
  const cajas = objetos.filter((o) => (o.type === 'caja' || o.type === 'mueble') && !o.p.fija);
  const sol = (x, y) => x < 0 || x >= W || (y >= 0 && y < H && celdas[y * W + x] === 1);
  const sostiene = (x, y) => y + 1 >= H || celdas[(y + 1) * W + x] !== 0;
  for (const o of cajas) {
    const x = Math.round(o.x / T);
    let y = Math.round(o.y / T);
    while (y + 1 < H && !sostiene(x, y)) y++;
    const vistos = new Set();
    const pila = [[x, y]];
    while (pila.length) {
      const [bx, by] = pila.pop();
      const k = by * W + bx;
      if (vistos.has(k)) continue;
      vistos.add(k);
      for (const d of [-1, 1]) {
        const nx = bx + d;
        // hace falta sitio para Sofía al otro lado para empujar
        if (sol(nx, by) || sol(bx - d, by)) continue;
        let ny = by;
        while (ny + 1 < H && !sostiene(nx, ny)) ny++;
        pila.push([nx, ny]);
      }
    }
    for (const k of vistos) {
      if (!celdas[k]) celdas[k] = 2;
      if (cajas.length > 1 && k >= W && !celdas[k - W]) celdas[k - W] = 2;
    }
  }
  return { celdas, peligro, gravedad };
}

function analizar(n) {
  const ruta = join(raiz, 'assets', 'levels', `nivel-${String(n).padStart(2, '0')}.json`);
  if (!existsSync(ruta)) return null;
  const mapa = JSON.parse(readFileSync(ruta, 'utf8'));
  const W = mapa.width;
  const H = mapa.height;
  const props = Object.fromEntries((mapa.properties || []).map((p) => [p.name, p.value]));
  const objetos = mapa.layers.flatMap((l) => (l.objects || []).map((o) => ({ ...o, p: Object.fromEntries((o.properties || []).map((p) => [p.name, p.value])) })));
  const MUNDOS = props.mundos ? ['A', 'B'] : [null];
  const capas = Object.fromEntries(MUNDOS.map((m) => [m, rasterizar(mapa, objetos, m)]));
  const otro = (m) => (m === 'A' ? 'B' : 'A');

  const etapa = props.etapa || etapaDeNivel(n);
  const gatas = !!props.gatas;
  const alto = FOTOS[etapa][gatas ? 'gatas' : 'pie'].altoJuego;
  const BW = gatas ? 46 : 26;
  const BH = gatas ? 40 : Math.round(alto * 0.9);
  const hab = JUEGO.habilidades;
  const puedeCorrer = n >= hab.correr;
  const puedeDoble = n >= hab.dobleSalto;
  const vAndar = gatas ? F.velocidadGatas : F.velocidadAndar;
  const vMax = gatas ? F.velocidadGatas : puedeCorrer ? F.velocidadCorrer : F.velocidadAndar;
  const salto = gatas ? F.saltoBebe : F.salto;

  const cel = (m, x, y) => (x < 0 || x >= W ? 1 : y < 0 || y >= H ? 0 : capas[m].celdas[y * W + x]);
  const grav = (m, px, py) => {
    const x = Math.floor(px / T);
    const y = Math.floor(py / T);
    return x < 0 || y < 0 || x >= W || y >= H ? 1 : capas[m].gravedad[y * W + x];
  };
  const tocaPeligro = (m, l, t, r, b) => capas[m].peligro.some((z) => l < z.r && r > z.l && t < z.b && b > z.t);
  const cabe = (m, x, y) => {
    for (let yy = Math.floor(y / T); yy <= Math.floor((y + BH - 1) / T); yy++)
      for (let xx = Math.floor((x - BW / 2) / T); xx <= Math.floor((x + BW / 2 - 0.001) / T); xx++) if (cel(m, xx, yy) === 1) return false;
    return true;
  };

  // Sofía: x = centro, y = borde superior del cuerpo. Devuelve dónde acaba un salto o una caída.
  function simular(x0, y0, g0, m0, v0, plan) {
    let x = x0;
    let y = y0;
    let vx = v0;
    let vy = 0;
    let g = g0;
    let m = m0;
    let saltosAire = 0;
    let suelo = true;
    for (let f = 0; f < 240; f++) {
      // cantar en el aire cambia de mundo (si no se queda dentro de algo)
      if (f === plan.cantar && m && cabe(otro(m), x, y)) m = otro(m);
      g = grav(m, x, y + BH / 2);
      const dir = f < plan.cambio ? plan.d1 : plan.d2;
      if (f === 0 && plan.saltar) {
        vy = -salto * g;
        suelo = false;
      }
      if (puedeDoble && saltosAire === 0 && f === plan.doble) {
        vy = -F.dobleSalto * g;
        saltosAire = 1;
      }
      // salto corto: soltar el botón corta la subida
      if (plan.corto && f >= plan.corto && vy * g < 0) vy *= 1 - (1 - F.cortarSalto) * Math.min(1, DT * 20);
      const vObj = dir * (Math.abs(v0) > vAndar ? vMax : vAndar);
      const ac = (suelo ? F.aceleracionSuelo : F.aceleracionAire) * DT;
      if (dir) vx = Math.abs(vObj - vx) <= ac ? vObj : vx + Math.sign(vObj - vx) * ac;
      else if (suelo) vx = Math.abs(vx) <= F.frenadoSuelo * DT ? 0 : vx - Math.sign(vx) * F.frenadoSuelo * DT;
      vy += F.gravedad * g * DT;
      vy = Math.max(-F.velocidadMaxCaida, Math.min(F.velocidadMaxCaida, vy));
      // eje X
      let nx = x + vx * DT;
      const ty = Math.floor(y / T);
      const by = Math.floor((y + BH - 1) / T);
      if (vx > 0) {
        const cx = Math.floor((nx + BW / 2 - 0.001) / T);
        for (let cy = ty; cy <= by; cy++) if (cel(m, cx, cy) === 1) { nx = cx * T - BW / 2; vx = 0; break; }
      } else if (vx < 0) {
        const cx = Math.floor((nx - BW / 2) / T);
        for (let cy = ty; cy <= by; cy++) if (cel(m, cx, cy) === 1) { nx = (cx + 1) * T + BW / 2; vx = 0; break; }
      }
      x = nx;
      // eje Y (las nubes solo frenan desde arriba)
      let ny = y + vy * DT;
      suelo = false;
      const lx = Math.floor((x - BW / 2) / T);
      const rx = Math.floor((x + BW / 2 - 0.001) / T);
      if (vy > 0) {
        const cy = Math.floor((ny + BH - 0.001) / T);
        for (let cx = lx; cx <= rx; cx++) {
          const c = cel(m, cx, cy);
          if (c === 1 || (c === 2 && g > 0 && y + BH <= cy * T + 8)) {
            ny = cy * T - BH;
            vy = 0;
            if (g > 0) suelo = true;
            break;
          }
        }
      } else if (vy < 0) {
        const cy = Math.floor(ny / T);
        for (let cx = lx; cx <= rx; cx++) {
          if (cel(m, cx, cy) === 1) {
            ny = (cy + 1) * T;
            vy = 0;
            if (g < 0) suelo = true;
            break;
          }
        }
      }
      y = ny;
      if (y > H * T + 200 || y < -400) return { muere: true };
      if (tocaPeligro(m, x - BW / 2, y, x + BW / 2, y + BH)) return { muere: true };
      if (suelo && f > 0 && Math.abs(vx) < 1) return { x, y, g, m };
      if (suelo && f > 2 && plan.d2 === 0 && plan.d1 === 0) return { x, y, g, m };
      // al andar sin saltar, basta con haber cambiado de casilla
      if (suelo && !plan.saltar && f > 0 && Math.floor(x / T) !== Math.floor(x0 / T)) return { x, y, g, m };
    }
    return null;
  }

  // estado: casilla horizontal del centro, fila de los pies (de la cabeza si g < 0), gravedad y mundo
  const clave = (x, y, g, m) => `${Math.floor(x / T)},${g > 0 ? Math.round((y + BH) / T) : Math.round(y / T)},${g},${m}`;
  const posicion = (k) => {
    const [cx, fila, g, m] = k.split(',');
    return { cx: +cx, fila: +fila, g: +g, m: m === 'null' ? null : m };
  };

  const cantos = props.mundos ? [-1, 4, 14, 26] : [-1];
  const planes = [];
  for (const d1 of [-1, 0, 1])
    for (const d2 of [-1, 0, 1])
      for (const cambio of d1 === d2 ? [999] : [0, 8, 16, 26, 40])
        for (const doble of puedeDoble ? [-1, 6, 14, 22, 32] : [-1])
          for (const corto of [0, 6, 12])
            for (const rapido of puedeCorrer ? [false, true] : [false])
              for (const cantar of corto ? [-1] : cantos) planes.push({ d1, d2, cambio, doble, corto, saltar: true, rapido, cantar });
  for (const d of [-1, 1]) for (const rapido of [false, true]) planes.push({ d1: d, d2: d, cambio: 999, doble: -1, corto: 0, saltar: false, rapido, cantar: -1 });
  for (const d of [-1, 1]) for (const doble of puedeDoble ? [6, 14, 22, 32] : []) planes.push({ d1: d, d2: d, cambio: 999, doble, corto: 0, saltar: false, rapido: false, cantar: -1 });

  const vecinos = new Map();
  const peligroso = new Set();
  function expandir(k) {
    if (vecinos.has(k)) return vecinos.get(k);
    const { cx, fila, g, m } = posicion(k);
    const res = new Set();
    for (const off of [BW / 2 + 1, T / 2, T - BW / 2 - 1]) {
      const x0 = cx * T + off;
      const y0 = g > 0 ? fila * T - BH : fila * T;
      if (!cabe(m, x0, y0)) continue;
      // cantar quieta: cambia de mundo sin moverse
      if (m && cabe(otro(m), x0, y0)) {
        const r = simular(x0, y0, g, otro(m), 0, { d1: 0, d2: 0, cambio: 999, doble: -1, corto: 0, saltar: false, cantar: -1 });
        if (r && !r.muere) res.add(clave(r.x, r.y, r.g, r.m));
      }
      for (const p of planes) {
        const r = simular(x0, y0, g, m, p.rapido ? p.d1 * vMax : 0, p);
        if (!r) continue;
        if (r.muere) {
          peligroso.add(k);
          continue;
        }
        res.add(clave(r.x, r.y, r.g, r.m));
      }
    }
    res.delete(k);
    vecinos.set(k, res);
    return res;
  }

  const inicio = objetos.find((o) => o.type === 'inicio');
  const meta = objetos.find((o) => o.type === 'meta' || o.type === 'final');
  const k0 = clave(inicio.x + T / 2, inicio.y + T - BH, 1, MUNDOS[0]);
  // la meta se alcanza si se está en su casilla o a su lado
  const mx0 = Math.floor(meta.x / T) - 1;
  const mx1 = Math.floor((meta.x + meta.width) / T);
  const my0 = Math.floor(meta.y / T) - 1;
  const my1 = Math.ceil((meta.y + meta.height) / T) + 2;
  const enMeta = (k) => {
    const { cx, fila } = posicion(k);
    return cx >= mx0 && cx <= mx1 && fila >= my0 && fila <= my1;
  };

  const alcanzados = new Set([k0]);
  const cola = [k0];
  while (cola.length) {
    const k = cola.shift();
    for (const k2 of expandir(k)) if (!alcanzados.has(k2)) { alcanzados.add(k2); cola.push(k2); }
  }
  // hacia atrás: desde qué sitios se llega a la meta
  const inversa = new Map();
  for (const k of alcanzados)
    for (const k2 of vecinos.get(k) || []) {
      if (!inversa.has(k2)) inversa.set(k2, []);
      inversa.get(k2).push(k);
    }
  const salen = new Set([...alcanzados].filter(enMeta));
  const cola2 = [...salen];
  while (cola2.length) {
    const k = cola2.shift();
    for (const k2 of inversa.get(k) || []) if (!salen.has(k2)) { salen.add(k2); cola2.push(k2); }
  }
  // agrupar los sitios sin salida contiguos en zonas (sin distinguir mundo)
  const atrapados = new Set([...alcanzados].filter((k) => !salen.has(k)));
  const sinMundo = (k) => k.split(',').slice(0, 3).join(',');
  const porCasilla = new Map();
  for (const k of atrapados) {
    const c = sinMundo(k);
    if (!porCasilla.has(c)) porCasilla.set(c, []);
    porCasilla.get(c).push(k);
  }
  const zonas = [];
  const visto = new Set();
  for (const c0 of porCasilla.keys()) {
    if (visto.has(c0)) continue;
    const zona = [];
    const pila = [c0];
    visto.add(c0);
    while (pila.length) {
      const c = pila.pop();
      zona.push(c);
      const [cx, fila, g] = c.split(',').map(Number);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const b = `${cx + dx},${fila + dy},${g}`;
        if (!visto.has(b) && porCasilla.has(b)) { visto.add(b); pila.push(b); }
      }
    }
    const cs = zona.map((c) => c.split(',').map(Number));
    zonas.push({
      x0: Math.min(...cs.map((c) => c[0])),
      x1: Math.max(...cs.map((c) => c[0])),
      f0: Math.min(...cs.map((c) => c[1])),
      f1: Math.max(...cs.map((c) => c[1])),
      casillas: zona.length,
      conPeligro: zona.some((c) => porCasilla.get(c).some((k) => peligroso.has(k))),
      g: cs[0][2],
    });
  }
  return { metaAlcanzable: [...alcanzados].some(enMeta), alcanzados: alcanzados.size, zonas };
}

const pedidos = process.argv.slice(2).map(Number);
let problemas = 0;
for (let n = 0; n <= 18; n++) {
  if (pedidos.length && !pedidos.includes(n)) continue;
  const r = analizar(n);
  if (!r) continue;
  if (!r.metaAlcanzable || r.zonas.length) problemas++;
  console.log(`Nivel ${n}: ${r.alcanzados} sitios alcanzables${r.metaAlcanzable ? '' : '  ✗ ¡NO SE LLEGA A LA META!'}${r.zonas.length ? '' : '  ✓'}`);
  for (const z of r.zonas)
    console.log(`  ✗ sin salida: columnas ${z.x0}-${z.x1}, filas ${z.f0}-${z.f1}${z.g < 0 ? ' (gravedad invertida)' : ''} — ${z.casillas} sitios${z.conPeligro ? ' (solo se sale perdiendo velas)' : ''}`);
}
console.log(`\n${problemas} niveles con problemas`);
process.exit(problemas ? 1 : 0);
