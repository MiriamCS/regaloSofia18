// Fondos con 2-3 capas de parallax, dibujados por código según la etapa y el tema del nivel.
// Cada capa es un patrón que se repite (TileSprite), así pesa poco y va fluido en móvil.
import Phaser from 'phaser';
import { PALETAS } from '../estilo.js';

const ANCHO_PATRON = 1536;

function rnd(semilla) {
  let s = semilla >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Dibuja 'fn' tres veces (desplazado ±ancho) para que el patrón empalme sin costuras
function envolver(fn, x, w) {
  fn(x);
  if (x + w > ANCHO_PATRON) fn(x - ANCHO_PATRON);
  if (x < 0) fn(x + ANCHO_PATRON);
}

const DECORADOS = {
  colinas(g, h, color, r, { base = 0.72, amp = 0.1 } = {}) {
    g.fillStyle(color, 1);
    const n = 6;
    for (let i = 0; i < n; i++) {
      const cx = (i / n) * ANCHO_PATRON + r() * 120;
      const rx = 220 + r() * 160;
      const ry = h * (amp + r() * amp);
      envolver((x) => g.fillEllipse(x, h * base, rx * 2, ry * 2), cx - rx, rx * 2);
    }
    g.fillRect(0, h * base, ANCHO_PATRON, h);
  },
  nubes(g, h, color, r, { alto = 0.25, n = 7, alpha = 0.9 } = {}) {
    g.fillStyle(color, alpha);
    for (let i = 0; i < n; i++) {
      const cx = r() * ANCHO_PATRON;
      const cy = h * (alto * 0.4 + r() * alto);
      const s = 0.7 + r() * 0.8;
      envolver((x) => {
        g.fillEllipse(x, cy, 110 * s, 46 * s);
        g.fillEllipse(x - 38 * s, cy + 8 * s, 70 * s, 34 * s);
        g.fillEllipse(x + 40 * s, cy + 6 * s, 80 * s, 38 * s);
        g.fillEllipse(x + 6 * s, cy - 16 * s, 64 * s, 40 * s);
      }, cx - 80 * s, 160 * s);
    }
  },
  estrellas(g, h, color, r, { n = 60, alto = 0.6 } = {}) {
    for (let i = 0; i < n; i++) {
      g.fillStyle(color, 0.4 + r() * 0.6);
      g.fillCircle(r() * ANCHO_PATRON, r() * h * alto, 1 + r() * 2.2);
    }
  },
  edificios(g, h, color, r, { ventanas = 0xfff3a0, base = 1 } = {}) {
    let x = 0;
    while (x < ANCHO_PATRON) {
      const w = 70 + r() * 90;
      const alto = h * (0.25 + r() * 0.35);
      const y = h * base - alto;
      g.fillStyle(color, 1);
      g.fillRect(x, y, w - 6, alto);
      if (r() < 0.4) g.fillTriangle(x, y, x + (w - 6) / 2, y - 30, x + w - 6, y);
      g.fillStyle(ventanas, 0.75);
      for (let vy = y + 14; vy < h * base - 20; vy += 26) {
        for (let vx = x + 10; vx < x + w - 22; vx += 20) if (r() < 0.45) g.fillRect(vx, vy, 9, 12);
      }
      x += w;
    }
  },
  arboles(g, h, color, r, { n = 9, base = 0.86 } = {}) {
    for (let i = 0; i < n; i++) {
      const cx = (i / n) * ANCHO_PATRON + r() * 80;
      const s = 0.7 + r() * 0.7;
      envolver((x) => {
        g.fillStyle(Phaser.Display.Color.ValueToColor(color).darken(25).color, 1);
        g.fillRect(x - 8 * s, h * base - 90 * s, 16 * s, 90 * s);
        g.fillStyle(color, 1);
        g.fillCircle(x, h * base - 120 * s, 50 * s);
        g.fillCircle(x - 38 * s, h * base - 95 * s, 36 * s);
        g.fillCircle(x + 38 * s, h * base - 98 * s, 38 * s);
      }, cx - 90 * s, 180 * s);
    }
  },
  peluches(g, h, color, r, { n = 5 } = {}) {
    for (let i = 0; i < n; i++) {
      const cx = (i / n) * ANCHO_PATRON + r() * 150;
      const s = 0.9 + r() * 0.8;
      const by = h * 0.9;
      envolver((x) => {
        g.fillStyle(color, 1);
        g.fillCircle(x - 34 * s, by - 150 * s, 22 * s);
        g.fillCircle(x + 34 * s, by - 150 * s, 22 * s);
        g.fillCircle(x, by - 120 * s, 46 * s);
        g.fillEllipse(x, by - 45 * s, 120 * s, 110 * s);
      }, cx - 70 * s, 140 * s);
    }
  },
  estanterias(g, h, color, r, { base = 0.95 } = {}) {
    let x = 0;
    while (x < ANCHO_PATRON) {
      const w = 220;
      g.fillStyle(color, 1);
      g.fillRect(x + 10, h * 0.2, w - 20, h * base - h * 0.2);
      const c2 = Phaser.Display.Color.ValueToColor(color).lighten(12).color;
      for (let y = h * 0.24; y < h * base - 60; y += 70) {
        let bx = x + 20;
        while (bx < x + w - 40) {
          const bw = 10 + r() * 14;
          const bh = 40 + r() * 20;
          g.fillStyle(c2, 1);
          g.fillRect(bx, y + 60 - bh, bw, bh);
          bx += bw + 3;
        }
        g.fillStyle(Phaser.Display.Color.ValueToColor(color).darken(20).color, 1);
        g.fillRect(x + 10, y + 60, w - 20, 8);
      }
      x += w + 40;
    }
  },
  olas(g, h, color, r, { base = 0.78 } = {}) {
    g.fillStyle(color, 1);
    g.fillRect(0, h * base, ANCHO_PATRON, h);
    for (let x = 0; x < ANCHO_PATRON; x += 64) g.fillCircle(x + 32, h * base + 4, 34);
    g.fillStyle(0xffffff, 0.35);
    for (let x = 0; x < ANCHO_PATRON; x += 64) g.fillRect(x + 12, h * base + 30 + (x % 128 ? 10 : 0), 30, 4);
  },
  sol(g, h, color) {
    g.fillStyle(color, 0.9);
    g.fillCircle(ANCHO_PATRON * 0.7, h * 0.2, 60);
    g.fillStyle(color, 0.25);
    g.fillCircle(ANCHO_PATRON * 0.7, h * 0.2, 90);
  },
  luna(g, h, color) {
    g.fillStyle(color, 0.95);
    g.fillCircle(ANCHO_PATRON * 0.3, h * 0.18, 44);
    g.fillStyle(0x000000, 0.12);
    g.fillCircle(ANCHO_PATRON * 0.3 + 12, h * 0.18 - 6, 10);
  },
  pentagrama(g, h, color, r) {
    g.lineStyle(3, color, 0.5);
    for (let i = 0; i < 5; i++) {
      const y = h * 0.3 + i * 18;
      g.beginPath();
      for (let x = 0; x <= ANCHO_PATRON; x += 32) {
        const yy = y + Math.sin((x / ANCHO_PATRON) * Math.PI * 4) * 30;
        if (x === 0) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.strokePath();
    }
    g.fillStyle(color, 0.6);
    for (let i = 0; i < 14; i++) {
      const x = (i / 14) * ANCHO_PATRON + 30;
      const y = h * 0.3 + Math.sin((x / ANCHO_PATRON) * Math.PI * 4) * 30 + Math.floor(r() * 5) * 9;
      g.fillEllipse(x, y, 20, 14);
      g.fillRect(x + 7, y - 44, 3, 44);
    }
  },
  globos(g, h, color, r, { n = 12 } = {}) {
    const cols = [0xffd23f, 0xff8fb1, 0x3f8cff, 0x4cd964, 0xffffff];
    for (let i = 0; i < n; i++) {
      const x = r() * ANCHO_PATRON;
      const y = h * (0.15 + r() * 0.45);
      g.lineStyle(2, 0xffffff, 0.6);
      g.lineBetween(x, y + 34, x + Math.sin(i) * 10, y + 110);
      g.fillStyle(cols[i % cols.length], 0.85);
      g.fillEllipse(x, y, 52, 64);
    }
  },
  guirnalda(g, h, color) {
    const cols = [0xffd23f, 0xff8fb1, 0x3f8cff, 0x4cd964];
    for (let x = 0; x < ANCHO_PATRON; x += 48) {
      const y = h * 0.1 + Math.sin((x / ANCHO_PATRON) * Math.PI * 6) * 20;
      g.fillStyle(cols[(x / 48) % 4], 1);
      g.fillTriangle(x, y, x + 40, y, x + 20, y + 40);
    }
    void color;
  },
  telon(g, h, color) {
    g.fillStyle(color, 1);
    for (let x = 0; x < ANCHO_PATRON; x += 60) {
      g.fillRect(x, 0, 52, h * 0.16);
      g.fillCircle(x + 26, h * 0.16, 26);
    }
  },
  focos(g, h, color, r) {
    for (let i = 0; i < 6; i++) {
      const x = (i / 6) * ANCHO_PATRON + 120;
      g.fillStyle(color, 0.08);
      g.fillTriangle(x, 0, x - 160 - r() * 60, h, x + 160 + r() * 60, h);
    }
  },
  montanas(g, h, color, r) {
    g.fillStyle(color, 1);
    let x = -100;
    while (x < ANCHO_PATRON + 100) {
      const w = 260 + r() * 200;
      const alto = h * (0.3 + r() * 0.25);
      envolver((xx) => g.fillTriangle(xx, h * 0.85, xx + w / 2, h * 0.85 - alto, xx + w, h * 0.85), x, w);
      x += w * 0.6;
    }
    g.fillRect(0, h * 0.85, ANCHO_PATRON, h);
  },
  columnas(g, h, color) {
    g.fillStyle(color, 1);
    for (let x = 60; x < ANCHO_PATRON; x += 256) {
      g.fillRect(x, h * 0.18, 46, h * 0.82);
      g.fillRect(x - 14, h * 0.15, 74, 18);
    }
    g.fillRect(0, h * 0.1, ANCHO_PATRON, 22);
  },
};

// Qué se dibuja en cada capa según el tema (las ambientaciones de la SPEC)
const TEMAS = {
  cuna: { lejos: [['nubes', { alto: 0.4 }], ['estrellas', { n: 30 }]], medio: [['peluches']] },
  parque: { lejos: [['nubes'], ['colinas', { base: 0.7 }]], medio: [['arboles']] },
  casa: { lejos: [['estanterias']], medio: [] },
  guarderia: { lejos: [['nubes'], ['colinas']], medio: [['estanterias', { base: 1 }]] },
  playa: { lejos: [['sol'], ['nubes']], medio: [['olas']] },
  fiesta: { lejos: [['guirnalda'], ['globos']], medio: [['globos', { n: 6 }]] },
  colegio: { lejos: [['nubes'], ['edificios', { ventanas: 0xffffff }]], medio: [['arboles']] },
  'clase-musica': { lejos: [['pentagrama']], medio: [['estanterias']] },
  bosque: { lejos: [['colinas', { base: 0.6 }], ['arboles', { base: 0.7 }]], medio: [['arboles', { n: 14 }]] },
  conservatorio: { lejos: [['pentagrama']], medio: [['columnas']] },
  'ciudad-noche': { lejos: [['estrellas'], ['luna'], ['edificios', { base: 0.92 }]], medio: [['edificios']] },
  verano: { lejos: [['sol'], ['nubes'], ['colinas']], medio: [['olas', { base: 0.85 }]] },
  instituto: { lejos: [['nubes'], ['edificios', { ventanas: 0xd8fff4 }]], medio: [['arboles']] },
  habitacion: { lejos: [['estrellas', { n: 40 }], ['estanterias']], medio: [] },
  concierto: { lejos: [['focos'], ['telon']], medio: [['columnas']] },
  examenes: { lejos: [['estanterias']], medio: [['columnas']] },
  viaje: { lejos: [['nubes'], ['montanas']], medio: [['arboles', { n: 6 }]] },
  biblioteca: { lejos: [['estanterias']], medio: [['estanterias', { base: 1 }]] },
  escenario: { lejos: [['estrellas'], ['focos']], medio: [['telon']] },
  blanco: { lejos: [], medio: [] },
};

function texturaCapa(scene, clave, h, elementos, color, semilla) {
  if (scene.textures.exists(clave)) return clave;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const r = rnd(semilla);
  for (const [nombre, op] of elementos) DECORADOS[nombre]?.(g, h, color, r, op || {});
  g.generateTexture(clave, ANCHO_PATRON, h);
  g.destroy();
  return clave;
}

export class Fondo {
  constructor(scene, etapa, tema, mundo) {
    this.scene = scene;
    const cam = scene.cameras.main;
    const W = cam.width;
    const H = cam.height;
    this.mundo = mundo;
    const pal = PALETAS[tema === 'blanco' ? 'blanco' : etapa];
    this.cielo = scene.add.graphics().setScrollFactor(0).setDepth(-100);
    this.cielo.fillGradientStyle(pal.cielo[0], pal.cielo[0], pal.cielo[1], pal.cielo[1], 1);
    this.cielo.fillRect(0, 0, W, H);
    const def = TEMAS[tema] || TEMAS.parque;
    const semilla = [...String(tema)].reduce((a, c) => a + c.charCodeAt(0), 0);
    this.capas = [];
    const colLejos = pal.lejos;
    const colMedio = pal.medio;
    if (def.lejos.length) {
      const k = texturaCapa(scene, `fondo-${etapa}-${tema}-lejos`, H, def.lejos, colLejos, semilla);
      this.capas.push({ s: scene.add.tileSprite(0, 0, W, H, k).setOrigin(0).setScrollFactor(0).setDepth(-90), f: 0.15 });
    }
    if (def.medio.length) {
      const k = texturaCapa(scene, `fondo-${etapa}-${tema}-medio`, H, def.medio, colMedio, semilla + 7);
      this.capas.push({ s: scene.add.tileSprite(0, 0, W, H, k).setOrigin(0).setScrollFactor(0).setDepth(-80).setAlpha(0.85), f: 0.4 });
    }
  }

  actualizar() {
    const cam = this.scene.cameras.main;
    const fondoY = this.mundo.alto - cam.height;
    for (const c of this.capas) {
      c.s.tilePositionX = cam.scrollX * c.f;
      c.s.y = Math.max(-60, (fondoY - cam.scrollY) * c.f * 0.5);
    }
  }

  desvanecer(duracion) {
    const objetivos = [this.cielo, ...this.capas.map((c) => c.s)];
    this.scene.tweens.add({ targets: objetivos, alpha: 0, duration: duracion });
  }
}
