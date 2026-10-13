// Fondos con 2-3 capas de parallax, dibujados por código según la etapa y el tema del nivel.
// Cada capa es un patrón que se repite (TileSprite), así pesa poco y va fluido en móvil.
import Phaser from 'phaser';
import { PALETAS } from '../estilo.js';

const ANCHO_PATRON = 1536;
// Altura de la línea del suelo en un nivel de 15 filas (el suelo del juego tapa lo que queda por debajo)
const SUELO = 0.8;

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
  // ---- casa ----
  paredCasa(g, h, color, r) {
    const oscuro = Phaser.Display.Color.ValueToColor(color).darken(18).color;
    g.fillStyle(oscuro, 1);
    g.fillRect(0, h * 0.9, ANCHO_PATRON, 14);
    for (let x = 0; x < ANCHO_PATRON; x += 512) {
      // ventana con cortinas
      g.fillStyle(oscuro, 1);
      g.fillRect(x + 60, h * 0.18, 170, 200);
      g.fillStyle(0xffffff, 0.55);
      g.fillRect(x + 70, h * 0.18 + 10, 70, 85);
      g.fillRect(x + 150, h * 0.18 + 10, 70, 85);
      g.fillRect(x + 70, h * 0.18 + 105, 70, 85);
      g.fillRect(x + 150, h * 0.18 + 105, 70, 85);
      g.fillStyle(0xff9fb8, 0.9);
      g.fillTriangle(x + 40, h * 0.15, x + 95, h * 0.15, x + 40, h * 0.18 + 230);
      g.fillTriangle(x + 250, h * 0.15, x + 195, h * 0.15, x + 250, h * 0.18 + 230);
      g.fillStyle(oscuro, 1);
      g.fillRect(x + 30, h * 0.15 - 6, 230, 8);
      // cuadros
      g.fillStyle(0xffd23f, 0.9);
      g.fillRect(x + 300, h * 0.2, 90, 70);
      g.fillStyle(0xffffff, 0.8);
      g.fillRect(x + 308, h * 0.2 + 8, 74, 54);
      g.fillStyle(0x7bdc6b, 0.9);
      g.fillTriangle(x + 312, h * 0.2 + 58, x + 340, h * 0.2 + 24, x + 368, h * 0.2 + 58);
      g.fillStyle(0xffd23f, 0.9);
      g.fillCircle(x + 365, h * 0.2 + 22, 7);
      g.fillStyle(oscuro, 1);
      g.fillRect(x + 410, h * 0.24, 56, 56);
      g.fillStyle(0xff9fb8, 0.8);
      g.fillCircle(x + 438, h * 0.24 + 28, 16);
      // reloj
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(x + 350, h * 0.1, 24);
      g.lineStyle(3, oscuro, 1);
      g.lineBetween(x + 350, h * 0.1, x + 350, h * 0.1 - 14);
      g.lineBetween(x + 350, h * 0.1, x + 360, h * 0.1 + 6);
    }
    void r;
  },
  mueblesCasa(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 0; x < ANCHO_PATRON; x += 512) {
      // sofá
      g.fillStyle(0x5d93ff, 1);
      g.fillRoundedRect(x + 40, b - 130, 240, 70, 18);
      g.fillRoundedRect(x + 30, b - 80, 260, 60, 14);
      g.fillRoundedRect(x + 20, b - 110, 40, 90, 14);
      g.fillRoundedRect(x + 260, b - 110, 40, 90, 14);
      g.fillStyle(0xffd23f, 1);
      g.fillRoundedRect(x + 80, b - 112, 46, 40, 10);
      g.fillStyle(color, 1);
      g.fillRect(x + 40, b - 20, 12, 20);
      g.fillRect(x + 268, b - 20, 12, 20);
      // lámpara de pie
      g.fillStyle(color, 1);
      g.fillRect(x + 340, b - 190, 8, 190);
      g.fillRect(x + 320, b - 6, 48, 6);
      g.fillStyle(0xfff3a0, 1);
      g.fillTriangle(x + 310, b - 180, x + 378, b - 180, x + 360, b - 230);
      g.fillTriangle(x + 310, b - 180, x + 328, b - 230, x + 360, b - 230);
      g.fillStyle(0xfff3a0, 0.18);
      g.fillCircle(x + 344, b - 170, 70);
      // mesita con planta
      g.fillStyle(color, 1);
      g.fillRect(x + 410, b - 70, 70, 10);
      g.fillRect(x + 418, b - 60, 8, 60);
      g.fillRect(x + 464, b - 60, 8, 60);
      g.fillStyle(0xff8c2a, 1);
      g.fillRect(x + 432, b - 100, 26, 30);
      g.fillStyle(0x4cbf5a, 1);
      g.fillEllipse(x + 436, b - 116, 18, 36);
      g.fillEllipse(x + 454, b - 118, 18, 40);
    }
    void r;
  },
  // ---- juegos infantiles ----
  columpios(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 0; x < ANCHO_PATRON; x += 768) {
      // columpio
      g.lineStyle(10, 0xff5d5d, 1);
      g.lineBetween(x + 40, b, x + 80, b - 200);
      g.lineBetween(x + 120, b, x + 80, b - 200);
      g.lineBetween(x + 260, b, x + 300, b - 200);
      g.lineBetween(x + 340, b, x + 300, b - 200);
      g.lineBetween(x + 80, b - 200, x + 300, b - 200);
      g.lineStyle(3, 0x1b2a4a, 0.7);
      for (const sx of [140, 220]) {
        g.lineBetween(x + sx, b - 200, x + sx, b - 70);
        g.lineBetween(x + sx + 40, b - 200, x + sx + 40, b - 70);
      }
      g.fillStyle(0xffd23f, 1);
      g.fillRect(x + 134, b - 72, 52, 10);
      g.fillRect(x + 214, b - 72, 52, 10);
      // tobogán
      g.fillStyle(0x3f8cff, 1);
      g.fillRect(x + 420, b - 170, 10, 170);
      g.fillRect(x + 470, b - 170, 10, 170);
      for (let y = b - 150; y < b; y += 30) g.fillRect(x + 420, y, 60, 6);
      g.fillStyle(0xffd23f, 1);
      g.fillRect(x + 410, b - 180, 80, 14);
      g.fillStyle(0xff8c2a, 1);
      g.fillTriangle(x + 480, b - 172, x + 640, b - 6, x + 610, b - 6);
      g.fillTriangle(x + 480, b - 172, x + 500, b - 172, x + 640, b - 6);
      // balancín
      g.fillStyle(0x7bdc6b, 1);
      g.fillTriangle(x + 690, b, x + 710, b - 40, x + 730, b);
      g.lineStyle(10, 0xff5d5d, 1);
      g.lineBetween(x + 640, b - 20, x + 780, b - 60);
    }
    void r;
    void color;
  },
  piscinaBolas(g, h, color, r) {
    const b = h * SUELO;
    const cols = [0xff5d5d, 0xffd23f, 0x3f8cff, 0x7bdc6b, 0xff9fb8];
    for (let x = 300; x < ANCHO_PATRON; x += 768) {
      g.fillStyle(0xffffff, 0.25);
      g.fillRect(x, b - 120, 260, 120);
      for (let k = 0; k < 70; k++) {
        g.fillStyle(cols[k % cols.length], 1);
        g.fillCircle(x + 12 + r() * 236, b - 10 - r() * 70, 11);
      }
      g.lineStyle(6, color, 1);
      g.strokeRect(x, b - 120, 260, 120);
      g.lineStyle(2, color, 0.6);
      for (let k = 20; k < 260; k += 20) g.lineBetween(x + k, b - 120, x + k, b - 60);
    }
  },
  // ---- colegio e instituto ----
  escuela(g, h, color, r, { pisos = 2, reloj = true } = {}) {
    const oscuro = Phaser.Display.Color.ValueToColor(color).darken(15).color;
    for (let x = 60; x < ANCHO_PATRON; x += 768) {
      const w = 620;
      const alto = 90 + pisos * 70;
      const y = h * SUELO - alto;
      g.fillStyle(color, 1);
      g.fillRect(x, y, w, alto);
      g.fillTriangle(x - 20, y, x + w / 2, y - 60, x + w + 20, y);
      // torre central con reloj y bandera
      g.fillRect(x + w / 2 - 60, y - 110, 120, 110);
      g.fillTriangle(x + w / 2 - 75, y - 110, x + w / 2, y - 170, x + w / 2 + 75, y - 110);
      if (reloj) {
        g.fillStyle(0xffffff, 0.95);
        g.fillCircle(x + w / 2, y - 60, 30);
        g.lineStyle(4, oscuro, 1);
        g.lineBetween(x + w / 2, y - 60, x + w / 2, y - 82);
        g.lineBetween(x + w / 2, y - 60, x + w / 2 + 14, y - 52);
      }
      g.fillStyle(oscuro, 1);
      g.fillRect(x + w / 2 - 3, y - 230, 6, 70);
      g.fillStyle(0xff5d5d, 1);
      g.fillTriangle(x + w / 2 + 3, y - 230, x + w / 2 + 60, y - 215, x + w / 2 + 3, y - 200);
      // ventanas en fila y puerta
      g.fillStyle(0xffffff, 0.6);
      for (let p = 0; p < pisos; p++) {
        for (let k = 0; k < 8; k++) {
          const vx = x + 30 + k * 74;
          if (Math.abs(vx + 20 - (x + w / 2)) < 50) continue;
          g.fillRect(vx, y + 30 + p * 70, 40, 44);
        }
      }
      g.fillStyle(oscuro, 1);
      g.fillRect(x + w / 2 - 34, h * SUELO - 80, 68, 80);
    }
    void r;
  },
  patio(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 0; x < ANCHO_PATRON; x += 768) {
      // canasta
      g.fillStyle(color, 1);
      g.fillRect(x + 100, b - 230, 12, 230);
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(x + 70, b - 260, 90, 60);
      g.lineStyle(4, 0xff5d5d, 1);
      g.strokeRect(x + 98, b - 236, 34, 24);
      g.lineStyle(5, 0xff8c2a, 1);
      g.lineBetween(x + 96, b - 200, x + 136, b - 200);
      // portería
      g.lineStyle(10, 0xffffff, 0.9);
      g.lineBetween(x + 420, b, x + 420, b - 110);
      g.lineBetween(x + 640, b, x + 640, b - 110);
      g.lineBetween(x + 420, b - 110, x + 640, b - 110);
      g.lineStyle(2, 0xffffff, 0.4);
      for (let k = 440; k < 640; k += 20) g.lineBetween(x + k, b - 110, x + k, b);
      // rayuela
      g.fillStyle(0xffd23f, 0.8);
      for (let k = 0; k < 4; k++) g.fillRect(x + 220 + k * 40, b - 8, 34, 8);
    }
    void r;
  },
  // ---- habitación ----
  paredCuarto(g, h, color, r, { arcoiris = false } = {}) {
    const oscuro = Phaser.Display.Color.ValueToColor(color).darken(18).color;
    for (let x = 0; x < ANCHO_PATRON; x += 512) {
      // ventana (de noche o con el arcoíris de «Todo saldrá bien»)
      g.fillStyle(oscuro, 1);
      g.fillRect(x + 50, h * 0.14, 180, 190);
      g.fillStyle(arcoiris ? 0xdff3ff : 0x1b2a4a, 0.9);
      g.fillRect(x + 60, h * 0.14 + 10, 160, 170);
      if (arcoiris) {
        const cols = [0xff5d5d, 0xff8c2a, 0xffd23f, 0x7bdc6b, 0x3f8cff, 0xc59bff];
        cols.forEach((c, k) => {
          g.fillStyle(c, 1);
          g.fillEllipse(x + 140, h * 0.14 + 150, 140 - k * 18, 140 - k * 18);
        });
        g.fillStyle(0xdff3ff, 1);
        g.fillEllipse(x + 140, h * 0.14 + 150, 30, 30);
        g.fillRect(x + 60, h * 0.14 + 150, 160, 30);
      } else {
        g.fillStyle(0xfff3a0, 0.9);
        g.fillCircle(x + 180, h * 0.14 + 50, 18);
        g.fillStyle(0xffffff, 0.8);
        for (let k = 0; k < 6; k++) g.fillCircle(x + 70 + r() * 140, h * 0.14 + 20 + r() * 140, 2);
      }
      g.fillStyle(oscuro, 1);
      g.fillRect(x + 136, h * 0.14 + 10, 8, 170);
      g.fillStyle(0xc59bff, 0.9);
      g.fillRect(x + 30, h * 0.12, 40, 230);
      g.fillRect(x + 210, h * 0.12, 40, 230);
      // pósters
      g.fillStyle(0xff8fb1, 0.9);
      g.fillRect(x + 290, h * 0.16, 80, 110);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(x + 330, h * 0.16 + 45, 22);
      g.fillStyle(0x8fd0ff, 0.9);
      g.fillRect(x + 390, h * 0.2, 90, 70);
      g.fillStyle(0xffffff, 0.8);
      g.fillEllipse(x + 425, h * 0.2 + 46, 18, 12);
      g.fillRect(x + 431, h * 0.2 + 14, 4, 32);
      // lucecitas
      const cols = [0xffd23f, 0xff8fb1, 0x8fd0ff];
      for (let k = 0; k < 14; k++) {
        g.fillStyle(cols[k % 3], 0.95);
        g.fillCircle(x + 270 + k * 18, h * 0.1 + Math.sin(k / 2) * 8, 5);
      }
    }
  },
  muebleCuarto(g, h, color, r, { videollamada = false } = {}) {
    const b = h * SUELO;
    for (let x = 0; x < ANCHO_PATRON; x += 512) {
      // cama
      g.fillStyle(color, 1);
      g.fillRect(x + 20, b - 120, 16, 120);
      g.fillRect(x + 20, b - 50, 260, 30);
      g.fillStyle(0xffffff, 0.9);
      g.fillRoundedRect(x + 40, b - 78, 70, 28, 10);
      g.fillStyle(0xc59bff, 1);
      g.fillRoundedRect(x + 110, b - 82, 170, 36, 8);
      // escritorio con pantalla y flexo
      g.fillStyle(color, 1);
      g.fillRect(x + 320, b - 90, 170, 12);
      g.fillRect(x + 330, b - 78, 10, 78);
      g.fillRect(x + 470, b - 78, 10, 78);
      g.fillRoundedRect(x + 360, b - 170, 100, 70, 6);
      g.fillRect(x + 405, b - 100, 10, 10);
      if (videollamada) {
        const caras = [0xffd23f, 0xff8fb1, 0x8fd0ff, 0x7bdc6b];
        for (let k = 0; k < 4; k++) {
          const cx = x + 366 + (k % 2) * 46, cy = b - 164 + Math.floor(k / 2) * 30;
          g.fillStyle(0xffffff, 0.85);
          g.fillRect(cx, cy, 42, 26);
          g.fillStyle(caras[k], 1);
          g.fillCircle(cx + 21, cy + 13, 8);
        }
      } else {
        g.fillStyle(0x8fd0ff, 0.85);
        g.fillRect(x + 368, b - 162, 84, 54);
      }
      g.lineStyle(6, color, 1);
      g.lineBetween(x + 340, b - 90, x + 330, b - 140);
      g.lineBetween(x + 330, b - 140, x + 350, b - 160);
      g.fillStyle(0xfff3a0, 0.9);
      g.fillCircle(x + 352, b - 158, 10);
    }
    void r;
  },
  avisosPandemia(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 0; x < ANCHO_PATRON; x += 384) {
      // cartel de mascarilla obligatoria
      g.fillStyle(0xffffff, 0.92);
      g.fillRoundedRect(x + 40, b - 230, 110, 130, 10);
      g.fillStyle(0x3f8cff, 1);
      g.fillRoundedRect(x + 62, b - 190, 66, 40, 12);
      g.lineStyle(4, 0x3f8cff, 1);
      g.lineBetween(x + 62, b - 182, x + 50, b - 196);
      g.lineBetween(x + 128, b - 182, x + 140, b - 196);
      g.fillStyle(0x3f8cff, 1);
      g.fillRect(x + 60, b - 135, 70, 8);
      g.fillStyle(color, 1);
      g.fillRect(x + 90, b - 100, 10, 100);
      // marcas de distancia en el suelo
      g.fillStyle(0xffd23f, 0.9);
      g.fillEllipse(x + 240, b - 4, 90, 16);
      g.fillStyle(color, 1);
      g.fillEllipse(x + 240, b - 4, 64, 10);
      // gel
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(x + 320, b - 120, 30, 50);
      g.fillStyle(0x7bdc6b, 1);
      g.fillRect(x + 326, b - 110, 18, 24);
      g.fillStyle(color, 1);
      g.fillRect(x + 330, b - 70, 10, 70);
    }
    void r;
  },
  // ---- conciertos ----
  telonRojo(g, h, color, r) {
    for (let x = 0; x < ANCHO_PATRON; x += 768) {
      g.fillStyle(0xc0304a, 1);
      g.fillRect(x, 0, 120, h);
      g.fillRect(x + 648, 0, 120, h);
      g.fillStyle(0x8e1f36, 1);
      for (let k = 0; k < 4; k++) {
        g.fillRect(x + 18 + k * 28, 0, 8, h);
        g.fillRect(x + 666 + k * 28, 0, 8, h);
      }
      g.fillStyle(0xc0304a, 1);
      g.fillRect(x, 0, 768, h * 0.07);
      for (let k = 0; k < 768; k += 48) g.fillCircle(x + k + 24, h * 0.07, 24);
      g.fillStyle(0xffd23f, 1);
      g.fillRect(x, h * 0.07 - 6, 768, 5);
    }
    void r;
    void color;
  },
  focosColor(g, h, color, r) {
    const cols = [0xfff3a0, 0xff8fb1, 0x8fd0ff];
    for (let i = 0; i < 6; i++) {
      const x = (i / 6) * ANCHO_PATRON + 128;
      g.fillStyle(cols[i % 3], 0.16);
      g.fillTriangle(x, h * 0.06, x - 120 - r() * 50, h * SUELO, x + 120 + r() * 50, h * SUELO);
      g.fillStyle(cols[i % 3], 0.9);
      g.fillCircle(x, h * 0.06 + 6, 12);
    }
    void color;
  },
  pianoCola(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 200; x < ANCHO_PATRON; x += 768) {
      g.fillStyle(0x161a2c, 1);
      g.fillTriangle(x, b - 110, x + 230, b - 110, x + 230, b - 70);
      g.fillRect(x, b - 110, 230, 40);
      g.fillStyle(0xffffff, 0.9);
      g.fillRect(x + 160, b - 76, 70, 12);
      g.fillStyle(0x161a2c, 1);
      for (let k = 0; k < 7; k++) g.fillRect(x + 164 + k * 10, b - 76, 4, 7);
      g.fillRect(x + 10, b - 70, 10, 70);
      g.fillRect(x + 200, b - 70, 10, 70);
      g.lineStyle(4, 0x161a2c, 1);
      g.lineBetween(x + 20, b - 110, x + 90, b - 190);
      g.fillTriangle(x + 20, b - 110, x + 210, b - 110, x + 90, b - 190);
      // atriles
      for (const ax of [360, 470]) {
        g.fillStyle(color, 1);
        g.fillRect(x + ax, b - 90, 6, 90);
        g.fillRect(x + ax - 24, b - 110, 54, 30);
        g.fillStyle(0xffffff, 0.75);
        g.fillRect(x + ax - 18, b - 106, 42, 22);
      }
    }
    void r;
  },
  publico(g, h, color, r) {
    const b = h * SUELO;
    const oscuro = Phaser.Display.Color.ValueToColor(color).darken(25).color;
    for (let fila = 0; fila < 2; fila++) {
      g.fillStyle(fila ? oscuro : color, 1);
      for (let x = (fila ? 0 : 22); x < ANCHO_PATRON; x += 44) {
        const y = b - 10 - fila * 0 + (fila ? 0 : -24);
        g.fillCircle(x, y - 26 - r() * 6, 15);
        g.fillEllipse(x, y, 40, 36);
      }
    }
    // móviles encendidos y varitas de luz
    for (let k = 0; k < 18; k++) {
      g.fillStyle(k % 2 ? 0xfff3a0 : 0x8fd0ff, 0.9);
      g.fillRect(r() * ANCHO_PATRON, b - 90 - r() * 30, 6, 10);
    }
  },
  // ---- la cita ----
  farolas(g, h, color, r) {
    const b = h * SUELO;
    for (let x = 80; x < ANCHO_PATRON; x += 384) {
      g.fillStyle(color, 1);
      g.fillRect(x, b - 220, 10, 220);
      g.fillRect(x - 14, b - 230, 38, 12);
      g.fillStyle(0xfff3a0, 1);
      g.fillCircle(x + 5, b - 214, 12);
      g.fillStyle(0xfff3a0, 0.15);
      g.fillCircle(x + 5, b - 180, 80);
      // banco
      g.fillStyle(color, 1);
      g.fillRect(x + 120, b - 50, 130, 10);
      g.fillRect(x + 120, b - 82, 130, 8);
      g.fillRect(x + 128, b - 82, 8, 82);
      g.fillRect(x + 234, b - 82, 8, 82);
      // corazón
      g.fillStyle(0xff8fb1, 0.85);
      g.fillCircle(x + 176, b - 140, 12);
      g.fillCircle(x + 196, b - 140, 12);
      g.fillTriangle(x + 165, b - 136, x + 207, b - 136, x + 186, b - 112);
    }
    void r;
  },
  // ---- nieve ----
  montanasNevadas(g, h, color, r) {
    let x = -100;
    while (x < ANCHO_PATRON + 100) {
      const w = 280 + r() * 220;
      const alto = h * (0.32 + r() * 0.22);
      const cima = h * 0.85 - alto;
      envolver((xx) => {
        g.fillStyle(color, 1);
        g.fillTriangle(xx, h * 0.85, xx + w / 2, cima, xx + w, h * 0.85);
        g.fillStyle(0xffffff, 0.9);
        g.fillTriangle(xx + w / 2 - w * 0.12, cima + alto * 0.24, xx + w / 2, cima, xx + w / 2 + w * 0.12, cima + alto * 0.24);
      }, x, w);
      x += w * 0.6;
    }
    g.fillStyle(color, 1);
    g.fillRect(0, h * 0.85, ANCHO_PATRON, h);
  },
  copos(g, h, color, r, { n = 70 } = {}) {
    for (let i = 0; i < n; i++) {
      g.fillStyle(0xffffff, 0.5 + r() * 0.5);
      g.fillCircle(r() * ANCHO_PATRON, r() * h * 0.8, 1.5 + r() * 2.5);
    }
    void color;
  },
  pinos(g, h, color, r, { n = 12, base = SUELO + 0.02 } = {}) {
    for (let i = 0; i < n; i++) {
      const cx = (i / n) * ANCHO_PATRON + r() * 70;
      const s = 0.7 + r() * 0.6;
      envolver((x) => {
        const b = h * base;
        g.fillStyle(color, 1);
        g.fillRect(x - 7 * s, b - 30 * s, 14 * s, 30 * s);
        for (let k = 0; k < 3; k++) {
          const y = b - 30 * s - k * 46 * s;
          const a = (70 - k * 16) * s;
          g.fillStyle(color, 1);
          g.fillTriangle(x - a, y, x, y - 70 * s, x + a, y);
          g.fillStyle(0xffffff, 0.85);
          g.fillTriangle(x - a * 0.35, y - 46 * s, x, y - 70 * s, x + a * 0.35, y - 46 * s);
        }
      }, cx - 80 * s, 160 * s);
    }
  },
  // ---- pista de patinaje y jardín ----
  bombillas(g, h, color, r, { alto = 0.12 } = {}) {
    const cols = [0xffd23f, 0xff8fb1, 0x8fd0ff, 0x7bdc6b];
    for (let tramo = 0; tramo < ANCHO_PATRON; tramo += 256) {
      g.lineStyle(2, color, 0.8);
      g.beginPath();
      for (let k = 0; k <= 16; k++) {
        const x = tramo + k * 16;
        const y = h * alto + Math.sin((k / 16) * Math.PI) * 40;
        if (k === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.strokePath();
      for (let k = 1; k < 16; k += 2) {
        const x = tramo + k * 16;
        const y = h * alto + Math.sin((k / 16) * Math.PI) * 40 + 8;
        g.fillStyle(cols[(k + tramo / 256) % 4], 0.95);
        g.fillCircle(x, y, 6);
      }
    }
    void r;
  },
  bolaDisco(g, h, color, r) {
    for (const cx of [ANCHO_PATRON * 0.25, ANCHO_PATRON * 0.75]) {
      g.lineStyle(3, color, 1);
      g.lineBetween(cx, 0, cx, h * 0.2);
      g.fillStyle(0xdfe8ff, 1);
      g.fillCircle(cx, h * 0.2 + 44, 46);
      g.fillStyle(0x8fa4d8, 0.8);
      for (let k = -2; k <= 2; k++) g.fillRect(cx - 44, h * 0.2 + 44 + k * 16 - 1, 88, 3);
      for (let k = -2; k <= 2; k++) g.fillRect(cx + k * 16 - 1, h * 0.2 + 2, 3, 84);
      for (let k = 0; k < 10; k++) {
        g.fillStyle(0xffffff, 0.5 + r() * 0.4);
        g.fillCircle(cx + (r() - 0.5) * 600, h * (0.35 + r() * 0.4), 3 + r() * 3);
      }
    }
  },
  barandilla(g, h, color, r, { base = 0.78 } = {}) {
    g.fillStyle(color, 1);
    g.fillRect(0, h * base, ANCHO_PATRON, 10);
    g.fillRect(0, h * base + 40, ANCHO_PATRON, 6);
    for (let x = 20; x < ANCHO_PATRON; x += 96) g.fillRect(x, h * base, 10, h);
    g.fillStyle(0xffffff, 0.35);
    for (let x = 0; x < ANCHO_PATRON; x += 192) g.fillRect(x + 40, h * base + 70, 90, 8);
    void r;
  },
  carpa(g, h, color, r, { n = 4 } = {}) {
    for (let i = 0; i < n; i++) {
      const cx = (i / n) * ANCHO_PATRON + r() * 120;
      const w = 260 + r() * 80;
      envolver((x) => {
        const b = h * SUELO;
        g.fillStyle(color, 1);
        g.fillRect(x - w / 2, b - 120, w, 120);
        g.fillTriangle(x - w / 2 - 20, b - 120, x, b - 210, x + w / 2 + 20, b - 120);
        g.fillStyle(0xffffff, 0.3);
        for (let k = 0; k < 4; k++) g.fillRect(x - w / 2 + 20 + (k * (w - 40)) / 3 - 4, b - 120, 8, 120);
        g.fillStyle(0xffffff, 0.45);
        for (let k = 0; k < 8; k++) g.fillTriangle(x - w / 2 + k * (w / 8), b - 120, x - w / 2 + (k + 0.5) * (w / 8), b - 100, x - w / 2 + (k + 1) * (w / 8), b - 120);
      }, cx - w / 2 - 30, w + 60);
    }
  },
  // ---- danza ----
  espejos(g, h, color, r) {
    for (let x = 30; x < ANCHO_PATRON; x += 300) {
      g.fillStyle(color, 1);
      g.fillRect(x, h * 0.15, 260, h * 0.62);
      g.fillStyle(0xffffff, 0.22);
      g.fillRect(x + 12, h * 0.15 + 12, 236, h * 0.62 - 24);
      g.fillStyle(0xffffff, 0.35);
      g.fillTriangle(x + 40, h * 0.7, x + 120, h * 0.2, x + 150, h * 0.2);
    }
    void r;
  },
  barra(g, h, color, r) {
    g.fillStyle(color, 1);
    g.fillRect(0, h * 0.62, ANCHO_PATRON, 12);
    for (let x = 60; x < ANCHO_PATRON; x += 240) g.fillRect(x, h * 0.62, 10, h * 0.4);
    void r;
  },
  // ---- huerto ----
  valla(g, h, color, r, { base = SUELO - 0.12 } = {}) {
    g.fillStyle(color, 1);
    g.fillRect(0, h * base, ANCHO_PATRON, 10);
    g.fillRect(0, h * base + 50, ANCHO_PATRON, 10);
    for (let x = 0; x < ANCHO_PATRON; x += 32) {
      g.fillRect(x + 6, h * base - 30, 18, 120);
      g.fillTriangle(x + 6, h * base - 30, x + 15, h * base - 44, x + 24, h * base - 30);
    }
    void r;
  },
  bancales(g, h, color, r) {
    const tierra = Phaser.Display.Color.ValueToColor(color).darken(30).color;
    for (let x = 0; x < ANCHO_PATRON; x += 256) {
      g.fillStyle(tierra, 1);
      g.fillRect(x + 10, h * SUELO, 236, h * 0.2);
      for (let k = 0; k < 6; k++) {
        const px = x + 30 + k * 38;
        g.fillStyle(0x7bdc6b, 0.9);
        g.fillEllipse(px - 8, h * SUELO - 14, 18, 30);
        g.fillEllipse(px + 8, h * SUELO - 16, 18, 32);
        if (r() < 0.4) {
          g.fillStyle(0xff6b8a, 0.9);
          g.fillCircle(px, h * SUELO - 2, 8);
        }
      }
    }
  },
  // ---- volcán ----
  volcanes(g, h, color, r) {
    let x = 0;
    while (x < ANCHO_PATRON) {
      const w = 420 + r() * 200;
      const alto = h * (0.35 + r() * 0.2);
      const cima = h * 0.85 - alto;
      envolver((xx) => {
        g.fillStyle(color, 1);
        g.fillTriangle(xx, h * 0.85, xx + w * 0.4, cima, xx + w * 0.6, cima);
        g.fillTriangle(xx + w * 0.6, cima, xx + w, h * 0.85, xx, h * 0.85);
        g.fillStyle(0xff8c2a, 0.8);
        g.fillRect(xx + w * 0.42, cima - 4, w * 0.16, 8);
        g.fillStyle(0xffffff, 0.22);
        for (let k = 0; k < 4; k++) g.fillCircle(xx + w * 0.5 + (k % 2 ? 26 : -18), cima - 40 - k * 46, 30 + k * 10);
      }, x, w);
      x += w * 0.9;
    }
    g.fillStyle(color, 1);
    g.fillRect(0, h * 0.85, ANCHO_PATRON, h);
  },
  rocas(g, h, color, r) {
    g.fillStyle(color, 1);
    for (let x = 0; x < ANCHO_PATRON; x += 90) {
      const rh = 40 + r() * 70;
      envolver((xx) => g.fillTriangle(xx, h, xx + 50, h * SUELO - rh, xx + 120, h), x, 120);
    }
    g.fillStyle(0xff8c2a, 0.5);
    for (let x = 30; x < ANCHO_PATRON; x += 210) g.fillRect(x, h * SUELO + 4, 80, 6);
  },
  // ---- redes sociales ----
  apps(g, h, color, r) {
    const cols = [0xff8fb1, 0x8fd0ff, 0xffd23f, 0x7bdc6b, 0xc59bff];
    for (let x = 30; x < ANCHO_PATRON; x += 120) {
      for (let y = h * 0.12; y < h * 0.8; y += 120) {
        g.fillStyle(color, 1);
        g.fillRoundedRect(x, y, 84, 84, 20);
        g.fillStyle(cols[Math.floor(r() * cols.length)], 0.55);
        g.fillCircle(x + 42, y + 42, 18);
      }
    }
  },
  corazones(g, h, color, r, { n = 14 } = {}) {
    for (let i = 0; i < n; i++) {
      const x = r() * ANCHO_PATRON;
      const y = h * (0.2 + r() * 0.6);
      const s = 0.6 + r() * 0.8;
      g.fillStyle(i % 3 ? 0xff8fb1 : 0xffffff, 0.75);
      g.fillCircle(x - 12 * s, y, 14 * s);
      g.fillCircle(x + 12 * s, y, 14 * s);
      g.fillTriangle(x - 25 * s, y + 5 * s, x + 25 * s, y + 5 * s, x, y + 34 * s);
    }
    void color;
  },
  // ---- aulas de examen ----
  ventanas(g, h, color, r) {
    for (let x = 40; x < ANCHO_PATRON; x += 380) {
      g.fillStyle(color, 1);
      g.fillRect(x, h * 0.12, 150, h * 0.42);
      g.fillStyle(0xffffff, 0.25);
      g.fillRect(x + 10, h * 0.12 + 10, 60, h * 0.42 - 20);
      g.fillRect(x + 80, h * 0.12 + 10, 60, h * 0.42 - 20);
    }
    void r;
  },
  pizarra(g, h, color, r) {
    for (let x = 230; x < ANCHO_PATRON; x += 380) {
      g.fillStyle(Phaser.Display.Color.ValueToColor(color).darken(25).color, 1);
      g.fillRect(x, h * 0.16, 130, h * 0.32);
      g.lineStyle(3, 0xffffff, 0.5);
      for (let k = 0; k < 4; k++) g.lineBetween(x + 14, h * 0.2 + k * 26, x + 30 + r() * 80, h * 0.2 + k * 26);
    }
  },
  pupitres(g, h, color, r) {
    g.fillStyle(color, 1);
    for (let x = 20; x < ANCHO_PATRON; x += 170) {
      const b = h * SUELO;
      g.fillRect(x, b - 70, 110, 12);
      g.fillRect(x + 8, b - 58, 10, 58);
      g.fillRect(x + 92, b - 58, 10, 58);
      g.fillRect(x + 122, b - 40, 34, 8);
      g.fillRect(x + 150, b - 80, 8, 80);
      g.fillRect(x + 124, b - 32, 8, 32);
    }
    void r;
  },
  // ---- universidad ----
  pantallas(g, h, color, r) {
    const cols = [0x7df9ff, 0xffd23f, 0xff8fb1, 0x7bdc6b];
    for (let x = 40; x < ANCHO_PATRON; x += 260) {
      const b = h * SUELO;
      g.fillStyle(color, 1);
      g.fillRoundedRect(x, b - 150, 170, 110, 8);
      g.fillRect(x + 76, b - 40, 18, 30);
      g.fillRect(x + 50, b - 12, 70, 10);
      for (let k = 0; k < 5; k++) {
        g.fillStyle(cols[(k + Math.floor(r() * 4)) % 4], 0.7);
        g.fillRect(x + 14 + (k % 2) * 16, b - 136 + k * 18, 40 + r() * 80, 7);
      }
    }
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
  casa: { lejos: [['paredCasa']], medio: [['mueblesCasa']] },
  juegos: { lejos: [['nubes'], ['colinas', { base: 0.74 }], ['arboles', { base: 0.8, n: 6 }]], medio: [['columpios'], ['piscinaBolas']] },
  guarderia: { lejos: [['nubes'], ['colinas']], medio: [['estanterias', { base: 1 }]] },
  playa: { lejos: [['sol'], ['nubes']], medio: [['olas']] },
  fiesta: { lejos: [['guirnalda'], ['globos']], medio: [['globos', { n: 6 }]] },
  colegio: { lejos: [['nubes'], ['escuela']], medio: [['patio']] },
  'clase-musica': { lejos: [['pentagrama']], medio: [['estanterias']] },
  bosque: { lejos: [['colinas', { base: 0.6 }], ['arboles', { base: 0.7 }]], medio: [['arboles', { n: 14 }]] },
  conservatorio: { lejos: [['pentagrama']], medio: [['columnas']] },
  'ciudad-noche': { lejos: [['estrellas'], ['luna'], ['edificios', { base: 0.92 }]], medio: [['edificios']] },
  verano: { lejos: [['sol'], ['nubes'], ['colinas']], medio: [['olas', { base: 0.85 }]] },
  instituto: { lejos: [['nubes'], ['escuela', { pisos: 3 }]], medio: [['arboles', { n: 5 }]] },
  'insti-pandemia': { lejos: [['nubes'], ['escuela', { pisos: 3 }]], medio: [['avisosPandemia']] },
  confinamiento: { lejos: [['paredCuarto', { arcoiris: true }]], medio: [['muebleCuarto', { videollamada: true }]] },
  habitacion: { lejos: [['paredCuarto']], medio: [['muebleCuarto']] },
  concierto: { lejos: [['focosColor'], ['telonRojo']], medio: [['pianoCola']] },
  examenes: { lejos: [['estanterias']], medio: [['columnas']] },
  viaje: { lejos: [['nubes'], ['montanas']], medio: [['arboles', { n: 6 }]] },
  biblioteca: { lejos: [['estanterias']], medio: [['estanterias', { base: 1 }]] },
  escenario: { lejos: [['focosColor'], ['telonRojo']], medio: [['publico']] },
  cita: { lejos: [['estrellas'], ['luna'], ['edificios', { base: 0.92 }]], medio: [['farolas']] },
  nieve: { lejos: [['montanasNevadas'], ['copos']], medio: [['pinos']] },
  patinaje: { lejos: [['bombillas'], ['focos'], ['bolaDisco']], medio: [['barandilla']] },
  danza: { lejos: [['espejos']], medio: [['barra']] },
  huerto: { lejos: [['sol'], ['nubes'], ['colinas', { base: 0.76 }]], medio: [['valla'], ['bancales']] },
  jardin: { lejos: [['arboles', { base: 0.8 }], ['bombillas', { alto: 0.08 }]], medio: [['carpa']] },
  volcan: { lejos: [['nubes', { alpha: 0.5 }], ['volcanes']], medio: [['rocas']] },
  redes: { lejos: [['apps']], medio: [['corazones']] },
  aulas: { lejos: [['ventanas'], ['pizarra']], medio: [['pupitres']] },
  universidad: { lejos: [['edificios', { ventanas: 0xd8e6ff, base: 0.95 }]], medio: [['pantallas']] },
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

// Fundido entre el fondo de un tramo y el del siguiente (px de recorrido de la cámara)
const FUNDIDO = 420;

export class Fondo {
  // 'tramos': [{ x, tema }] (zonas 'fondo' del mapa): a partir de x, el fondo pasa a ese tema con un fundido suave
  constructor(scene, etapa, tema, mundo, tramos = []) {
    this.scene = scene;
    const cam = scene.cameras.main;
    const W = cam.width;
    const H = cam.height;
    this.mundo = mundo;
    const pal = PALETAS[tema === 'blanco' ? 'blanco' : etapa];
    this.cielo = scene.add.graphics().setScrollFactor(0).setDepth(-100);
    this.cielo.fillGradientStyle(pal.cielo[0], pal.cielo[0], pal.cielo[1], pal.cielo[1], 1);
    this.cielo.fillRect(0, 0, W, H);
    this.tramos = [{ x: -Infinity, tema }, ...tramos.filter((t) => TEMAS[t.tema]).sort((a, b) => a.x - b.x)];
    this.capas = [];
    this.porTema = {};
    for (const t of new Set(this.tramos.map((tr) => tr.tema))) {
      const def = TEMAS[t] || TEMAS.parque;
      const semilla = [...String(t)].reduce((a, c) => a + c.charCodeAt(0), 0);
      const capas = [];
      if (def.lejos.length) {
        const k = texturaCapa(scene, `fondo-${etapa}-${t}-lejos`, H, def.lejos, pal.lejos, semilla);
        capas.push({ s: scene.add.tileSprite(0, 0, W, H, k).setOrigin(0).setScrollFactor(0).setDepth(-90), f: 0.15, alfa: 1 });
      }
      if (def.medio.length) {
        const k = texturaCapa(scene, `fondo-${etapa}-${t}-medio`, H, def.medio, pal.medio, semilla + 7);
        capas.push({ s: scene.add.tileSprite(0, 0, W, H, k).setOrigin(0).setScrollFactor(0).setDepth(-80).setAlpha(0.85), f: 0.4, alfa: 0.85 });
      }
      this.porTema[t] = capas;
      this.capas.push(...capas);
    }
    this.multiple = this.tramos.length > 1;
  }

  // Peso de cada tema según por dónde va la cámara (1 = se ve entero)
  pesos(cx) {
    const pesos = Object.fromEntries(Object.keys(this.porTema).map((t) => [t, 0]));
    let i = 0;
    while (i + 1 < this.tramos.length && cx >= this.tramos[i + 1].x) i++;
    const actual = this.tramos[i];
    const k = i > 0 ? Math.min(1, (cx - actual.x) / FUNDIDO) : 1;
    pesos[actual.tema] += k;
    if (k < 1) pesos[this.tramos[i - 1].tema] += 1 - k;
    return pesos;
  }

  actualizar() {
    const cam = this.scene.cameras.main;
    const fondoY = this.mundo.alto - cam.height;
    for (const c of this.capas) {
      c.s.tilePositionX = cam.scrollX * c.f;
      c.s.y = Math.max(-60, (fondoY - cam.scrollY) * c.f * 0.5);
    }
    if (!this.multiple || this.desvaneciendo) return;
    const pesos = this.pesos(cam.scrollX + cam.width / 2);
    for (const [t, capas] of Object.entries(this.porTema)) {
      for (const c of capas) c.s.setVisible(pesos[t] > 0).setAlpha(c.alfa * pesos[t]);
    }
  }

  desvanecer(duracion) {
    this.desvaneciendo = true;
    const objetivos = [this.cielo, ...this.capas.map((c) => c.s)];
    this.scene.tweens.add({ targets: objetivos, alpha: 0, duration: duracion });
  }
}
