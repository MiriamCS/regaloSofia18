// Elementos del nivel: plataformas especiales, checkpoint, coleccionables, meta, Miriam, carteles,
// campanas y puertas-melodía, teclas de piano y peligros.
import Phaser from 'phaser';
import { JUEGO, TILE, texto } from '../config.js';
import { Audio, midi } from '../audio/Audio.js';
import { estiloTexto, FUENTE, COLOR } from '../estilo.js';

const ESC = 0.5; // texturas SVG rasterizadas al doble

// ---- Dibujo de bloques ----------------------------------------------------------

// Los bloques sólidos se componen de texturas repetidas (baratas de pintar en móvil)
// más un contorno; las nubes y plataformas musicales son gráficos sencillos.
function texturasBloque(scene, paleta) {
  const k = `bloque-${paleta.suelo.toString(16)}-${paleta.sueloBorde.toString(16)}`;
  if (!scene.textures.exists(`${k}-relleno`)) {
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(paleta.suelo, 1).fillRect(0, 0, 96, 96);
    g.fillStyle(paleta.sueloBorde, 0.12).fillCircle(22, 30, 4).fillCircle(70, 70, 4).fillCircle(60, 18, 3);
    g.generateTexture(`${k}-relleno`, 96, 96);
    g.clear();
    g.fillStyle(Phaser.Display.Color.ValueToColor(paleta.suelo).lighten(18).color, 1).fillRect(0, 0, 96, 14);
    g.generateTexture(`${k}-borde`, 96, 14);
    g.destroy();
  }
  return k;
}

export function dibujarBloque(scene, x, y, w, h, paleta, estilo = 'solido') {
  if (estilo === 'nube' || estilo === 'musical') {
    const g = scene.add.graphics();
    if (estilo === 'nube') {
      g.fillStyle(paleta.plataforma, 1);
      g.lineStyle(3, paleta.sueloBorde, 1);
      g.fillRoundedRect(0, 0, w, 22, 11);
      g.strokeRoundedRect(0, 0, w, 22, 11);
      g.fillStyle(0xffffff, 0.5);
      g.fillRoundedRect(8, 4, w - 16, 5, 3);
    } else {
      g.fillStyle(paleta.acento, 1);
      g.lineStyle(3, 0x1b2a4a, 1);
      g.fillRoundedRect(0, 0, w, h, 8);
      g.strokeRoundedRect(0, 0, w, h, 8);
      for (let i = 0; i < w / TILE; i++) {
        g.fillStyle(0x1b2a4a, 0.5);
        g.fillEllipse(i * TILE + 18, h / 2 + 3, 10, 8);
        g.fillRect(i * TILE + 22, 5, 2.5, h / 2);
      }
    }
    g.setPosition(x, y);
    return g;
  }
  const k = texturasBloque(scene, paleta);
  const c = scene.add.container(x, y);
  const relleno = scene.add.tileSprite(0, 0, w, h, `${k}-relleno`).setOrigin(0);
  relleno.tilePositionX = x;
  relleno.tilePositionY = y;
  const borde = scene.add.tileSprite(0, 0, w, Math.min(14, h), `${k}-borde`).setOrigin(0);
  const linea = scene.add.graphics();
  linea.lineStyle(3, paleta.sueloBorde, 1).strokeRoundedRect(1.5, 1.5, w - 3, h - 3, Math.min(6, h / 2 - 2));
  c.add([relleno, borde, linea]);
  return c;
}

// Dibuja todos los sólidos del nivel como una única forma: relleno continuo, franja clara
// arriba de cada superficie y contorno solo en los bordes que dan al aire.
// 'soloEstos': si se pasa, solo se dibujan esos rectángulos (con los bordes calculados sobre todos).
export function dibujarSuelos(scene, rects, paleta, anchoMundo, altoMundo, soloEstos = null) {
  const k = texturasBloque(scene, paleta);
  const cols = Math.ceil(anchoMundo / TILE) + 1;
  const filas = Math.ceil(altoMundo / TILE) + 1;
  const lleno = new Uint8Array(cols * filas);
  const marcar = (lista, valor) => {
    for (const r of lista) {
      for (let y = Math.floor(r.y / TILE); y < Math.ceil((r.y + r.h) / TILE); y++) {
        for (let x = Math.floor(r.x / TILE); x < Math.ceil((r.x + r.w) / TILE); x++) if (x >= 0 && y >= 0 && x < cols && y < filas) lleno[y * cols + x] |= valor;
      }
    }
  };
  marcar(rects, 1);
  if (soloEstos) marcar(soloEstos, 2);
  const en = (cx, cy) => cx >= 0 && cy >= 0 && cx < cols && cy < filas && (lleno[cy * cols + cx] & 1) === 1;
  // casillas que se pintan (todas, o solo las marcadas)
  const pinta = (cx, cy) => en(cx, cy) && (!soloEstos || (lleno[cy * cols + cx] & 2) === 2);
  const c = scene.add.container(0, 0);
  for (const r of soloEstos || rects) {
    const t = scene.add.tileSprite(r.x, r.y, r.w, r.h, `${k}-relleno`).setOrigin(0);
    t.tilePositionX = r.x;
    t.tilePositionY = r.y;
    c.add(t);
  }
  const g = scene.add.graphics();
  const claro = Phaser.Display.Color.ValueToColor(paleta.suelo).lighten(18).color;
  const G = 3;
  for (let y = 0; y < filas; y++) {
    // tramos horizontales con aire encima (superficie) o debajo
    let x = 0;
    while (x < cols) {
      if (pinta(x, y) && !en(x, y - 1)) {
        let x2 = x;
        while (pinta(x2 + 1, y) && !en(x2 + 1, y - 1)) x2++;
        g.fillStyle(claro, 1).fillRect(x * TILE, y * TILE, (x2 - x + 1) * TILE, 14);
        g.fillStyle(paleta.sueloBorde, 1).fillRect(x * TILE, y * TILE, (x2 - x + 1) * TILE, G);
        x = x2 + 1;
      } else x++;
    }
    x = 0;
    while (x < cols) {
      if (pinta(x, y) && !en(x, y + 1) && y + 1 < filas) {
        let x2 = x;
        while (pinta(x2 + 1, y) && !en(x2 + 1, y + 1)) x2++;
        g.fillStyle(paleta.sueloBorde, 1).fillRect(x * TILE, (y + 1) * TILE - G, (x2 - x + 1) * TILE, G);
        x = x2 + 1;
      } else x++;
    }
  }
  for (let x = 0; x < cols; x++) {
    for (const lado of [-1, 1]) {
      let y = 0;
      while (y < filas) {
        if (pinta(x, y) && !en(x + lado, y) && x + lado >= 0) {
          let y2 = y;
          while (pinta(x, y2 + 1) && !en(x + lado, y2 + 1)) y2++;
          const px = lado < 0 ? x * TILE : (x + 1) * TILE - G;
          g.fillStyle(paleta.sueloBorde, 1).fillRect(px, y * TILE, G, (y2 - y + 1) * TILE);
          y = y2 + 1;
        } else y++;
      }
    }
  }
  c.add(g);
  return c;
}

function cuerpoEstatico(scene, x, y, w, h) {
  const z = scene.add.zone(x + w / 2, y + h / 2, w, h);
  scene.physics.add.existing(z, true);
  return z;
}

function cuerpoMovil(scene, x, y, w, h) {
  const z = scene.add.zone(x + w / 2, y + h / 2, w, h);
  scene.physics.add.existing(z, false);
  z.body.setAllowGravity(false);
  z.body.setImmovable(true);
  z.body.pushable = false;
  return z;
}

// Un bloque visible con cuerpo: el gráfico sigue al cuerpo.
class Bloque {
  constructor(scene, o, paleta, { estilo = 'solido', movil = false, alto } = {}) {
    this.scene = scene;
    this.o = o;
    const h = alto ?? o.h;
    this.zona = movil ? cuerpoMovil(scene, o.x, o.y, o.w, h) : cuerpoEstatico(scene, o.x, o.y, o.w, h);
    this.zona.elemento = this;
    if (movil) this.zona.body.setFriction(0, 0); // el arrastre horizontal lo hace la escena
    this.g = dibujarBloque(scene, o.x, o.y, o.w, o.h, paleta, estilo);
    this.g.setDepth(20);
    this.base = { x: o.x, y: o.y };
    this.mundo = o.p.mundo;
  }
  // Las plataformas móviles se mueven por velocidad (no teletransportándose) para que
  // Arcade sostenga y arrastre bien a quien vaya encima, también al subir.
  mover(x, y, dt) {
    this.g.setPosition(x, y);
    const b = this.zona.body;
    if (!b.moves) return;
    if (!dt || Math.abs(x - b.x) > 200 || Math.abs(y - b.y) > 200) {
      b.reset(x + this.o.w / 2, y + this.zona.height / 2);
      return;
    }
    b.setVelocity((x - b.x) / dt, (y - b.y) / dt);
  }
  activo(si) {
    this.zona.body.enable = si && !this.zona.fueraDeMundo;
  }
  visible(alpha) {
    this.g.setAlpha(this.zona.fueraDeMundo ? Math.min(alpha, 0.12) : alpha);
  }
}

// ---- Plataformas especiales -----------------------------------------------------

export class PlataformaMovil extends Bloque {
  // propiedades: dx, dy (en tiles), duracion (ms ida)
  constructor(scene, o, paleta) {
    super(scene, o, paleta, { estilo: o.p.estilo || 'nube', movil: true, alto: o.p.estilo === 'solido' ? o.h : 22 });
    this.dx = (o.p.dx || 0) * TILE;
    this.dy = (o.p.dy || 0) * TILE;
    this.dur = o.p.duracion || 2500;
    this.t0 = (o.p.desfase || 0);
    this.ultimo = { x: o.x, y: o.y };
    this.deltaX = 0;
    this.deltaY = 0;
  }
  actualizar(t, dt) {
    this.dtAnterior = dt;
    const fase = ((t + this.t0) % (this.dur * 2)) / this.dur;
    const k = fase < 1 ? fase : 2 - fase;
    const e = 0.5 - Math.cos(k * Math.PI) / 2;
    const x = this.base.x + this.dx * e;
    const y = this.base.y + this.dy * e;
    this.deltaX = x - this.ultimo.x;
    this.deltaY = y - this.ultimo.y;
    this.ultimo = { x, y };
    this.mover(x, y, this.dtAnterior);
  }
}

export class PlataformaCae extends Bloque {
  // modo 'cae': tiembla y cae; modo 'hunde': baja mientras la pisas y vuelve a subir
  constructor(scene, o, paleta) {
    super(scene, o, paleta, { estilo: o.p.estilo || 'solido', movil: true });
    this.modo = o.p.modo || 'cae';
    this.retardo = o.p.retardo || 450;
    this.estado = 'quieta';
    this.y = o.y;
    this.vy = 0;
  }
  pisada(t) {
    if (this.modo === 'cae' && this.estado === 'quieta') {
      this.estado = 'tiembla';
      this.tCae = t + this.retardo;
    }
    this.pisadaEn = t;
  }
  actualizar(t, dt) {
    if (this.modo === 'hunde') {
      const pisando = t - (this.pisadaEn || -1e9) < 80;
      const objetivo = pisando ? this.o.y + (this.o.p.profundidad || 4) * TILE : this.o.y;
      const vel = pisando ? (this.o.p.velocidad || 70) : 110;
      if (Math.abs(objetivo - this.y) < vel * dt) this.y = objetivo;
      else this.y += Math.sign(objetivo - this.y) * vel * dt;
      this.mover(this.o.x, this.y, dt);
      return;
    }
    if (this.estado === 'tiembla') {
      this.g.x = this.o.x + Math.sin(t / 25) * 2.5;
      if (t >= this.tCae) {
        this.estado = 'cae';
        this.vy = 0;
      }
    } else if (this.estado === 'cae') {
      this.vy += 1600 * dt;
      this.y += this.vy * dt;
      this.mover(this.o.x, this.y);
      if (this.y > this.o.y + 900) {
        this.estado = 'fuera';
        this.activo(false);
        this.g.setVisible(false);
        this.scene.time.delayedCall(2600, () => this.reaparecer());
      }
    }
  }
  reaparecer() {
    this.y = this.o.y;
    this.estado = 'quieta';
    this.mover(this.o.x, this.y);
    this.g.setVisible(true).setAlpha(0);
    this.scene.tweens.add({ targets: this.g, alpha: 1, duration: 300 });
    this.activo(true);
  }
  reiniciar() {
    if (this.estado !== 'quieta') this.reaparecer();
  }
}

export class PlataformaFalsa extends Bloque {
  // Trampa: parece suelo normal. 'desaparece' al pisarla; 'fantasma' no tiene cuerpo.
  constructor(scene, o, paleta) {
    super(scene, o, paleta, { estilo: o.p.estilo || 'solido' });
    this.modo = o.p.modo || 'desaparece';
    if (this.modo === 'fantasma') this.activo(false);
  }
  pisada() {
    if (this.modo !== 'desaparece' || this.ida) return;
    this.ida = true;
    this.scene.time.delayedCall(this.o.p.retardo || 120, () => {
      this.activo(false);
      Audio.efecto('pop');
      this.scene.tweens.add({ targets: this.g, alpha: 0, y: this.g.y + 30, duration: 250 });
    });
  }
  reiniciar() {
    if (!this.ida) return;
    this.ida = false;
    this.activo(true);
    this.g.setAlpha(1).setPosition(this.o.x, this.o.y);
  }
}

export class PlataformaTemporizada extends Bloque {
  // Aparece y desaparece en ciclo: on/off en ms (o en pulsos si 'ritmo' = true)
  constructor(scene, o, paleta) {
    super(scene, o, paleta, { estilo: o.p.estilo || 'nube', alto: o.p.estilo === 'solido' ? o.h : 22 });
    this.on = o.p.on || (o.p.ritmo ? 2 : 1800);
    this.off = o.p.off || (o.p.ritmo ? 2 : 1400);
    this.desfase = o.p.desfase || 0;
  }
  actualizar(t) {
    let f;
    let ciclo;
    let aviso = 450;
    const pulso = this.o.p.ritmo ? Audio.pulso() : null;
    if (pulso !== null) {
      // a ritmo: on/off/desfase en pulsos (negras) de la música
      ciclo = this.on + this.off;
      f = (((pulso + this.desfase) % ciclo) + ciclo) % ciclo;
      aviso = 0.5;
    } else if (this.o.p.ritmo) {
      // sin música sonando: se usa un tempo de 100 bpm (600 ms por pulso)
      ciclo = this.on + this.off;
      f = (((t / 600 + this.desfase) % ciclo) + ciclo) % ciclo;
      aviso = 0.5;
    } else {
      ciclo = this.on + this.off;
      f = (t + this.desfase) % ciclo;
    }
    const encendida = f < this.on;
    const avisando = encendida && f > this.on - aviso;
    this.activo(encendida);
    this.visible(encendida ? (avisando ? (Math.floor(t / 70) % 2 ? 0.4 : 1) : 1) : 0.15);
  }
}

export class PlataformaMusical extends Bloque {
  // Solo existe un rato después de cantar cerca. modo 'aparece' o 'mueve' (con dx, dy)
  constructor(scene, o, paleta) {
    super(scene, o, paleta, { estilo: 'musical', movil: o.p.modo === 'mueve' });
    this.modo = o.p.modo || 'aparece';
    this.hasta = 0;
    this.dx = (o.p.dx || 0) * TILE;
    this.dy = (o.p.dy || 0) * TILE;
    this.prog = 0;
    if (this.modo === 'aparece') {
      this.activo(false);
      this.visible(0.22);
    }
  }
  oir(t) {
    this.hasta = t + (this.o.p.duracion || JUEGO.canto.duracionPlataformaMs || 3800);
  }
  actualizar(t, dt) {
    const activa = t < this.hasta;
    if (this.modo === 'aparece') {
      this.activo(activa);
      const avisando = activa && this.hasta - t < 700;
      this.visible(activa ? (avisando ? (Math.floor(t / 80) % 2 ? 0.45 : 1) : 1) : 0.22);
    } else {
      // se desplaza mientras dura la canción y vuelve poco a poco
      const obj = activa ? 1 : 0;
      this.prog = Phaser.Math.Clamp(this.prog + Math.sign(obj - this.prog) * dt * (activa ? 0.8 : 0.35), 0, 1);
      this.mover(this.base.x + this.dx * this.prog, this.base.y + this.dy * this.prog, dt);
    }
  }
}

// ---- Teclas de piano gigantes ---------------------------------------------------

export class TeclaPiano {
  constructor(scene, o) {
    this.scene = scene;
    this.o = o;
    this.nota = o.p.nota || 'C4';
    this.grupo = o.p.grupo || 'teclas';
    this.negra = /#|b\d/.test(this.nota);
    this.zona = cuerpoEstatico(scene, o.x, o.y, o.w, o.h);
    this.zona.elemento = this;
    const g = scene.add.graphics().setDepth(20);
    g.fillStyle(this.negra ? 0x1d2233 : 0xfafcff, 1);
    g.lineStyle(3, 0x1b2a4a, 1);
    g.fillRoundedRect(0, 0, o.w, o.h, { tl: 2, tr: 2, bl: 8, br: 8 });
    g.strokeRoundedRect(0, 0, o.w, o.h, { tl: 2, tr: 2, bl: 8, br: 8 });
    g.setPosition(o.x, o.y);
    this.g = g;
    this.etiqueta = scene.add.text(o.x + o.w / 2, o.y + o.h - 18, nombreNota(this.nota), estiloTexto(14, this.negra ? '#cfd8ff' : '#7e8aa8')).setOrigin(0.5).setDepth(21);
    this.pisadaAntes = false;
  }
  pisada(t) {
    this.ultimaPisada = t;
  }
  actualizar(t) {
    const pisando = t - (this.ultimaPisada || -1e9) < 60;
    if (pisando && !this.pisadaAntes) {
      Audio.piano(this.nota, { dur: 0.8, vel: 0.8 });
      this.g.y = this.o.y + 5;
      this.scene.events.emit('nota', { grupo: this.grupo, nota: this.nota, x: this.o.x + this.o.w / 2, y: this.o.y });
    }
    if (!pisando && this.pisadaAntes) this.g.y = this.o.y;
    this.pisadaAntes = pisando;
  }
}

const NOMBRE_NOTA = ['do', 'do#', 're', 'mi♭', 'mi', 'fa', 'fa#', 'sol', 'sol#', 'la', 'si♭', 'si'];
export function nombreNota(n) {
  return NOMBRE_NOTA[midi(n) % 12];
}

// ---- Campanas y puertas-melodía -------------------------------------------------

export class Campana {
  // Suena al cantar cerca. Su nota se suma a la secuencia de su grupo.
  constructor(scene, o) {
    this.scene = scene;
    this.o = o;
    this.nota = o.p.nota || 'C5';
    this.grupo = o.p.grupo || 'campanas';
    this.x = o.pieX;
    this.y = o.pieY - 40;
    const colores = [0x3f8cff, 0xff8fb1, 0x4cd964, 0xffd23f, 0xb07cff, 0xff8c2a, 0x5ad1d6];
    this.color = colores[midi(this.nota) % 7];
    this.img = scene.add.image(this.x, this.y, 'campana').setScale(ESC).setDepth(25).setTint(this.color);
    this.etiqueta = scene.add.text(this.x, this.y + 26, nombreNota(this.nota), estiloTexto(16, '#ffffff', { stroke: '#1b2a4a', strokeThickness: 4 })).setOrigin(0.5).setDepth(26);
    scene.tweens.add({ targets: this.img, angle: { from: -4, to: 4 }, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  tocar() {
    Audio.piano(this.nota, { dur: 1.2, vel: 0.85 });
    this.scene.tweens.add({ targets: this.img, scale: ESC * 1.3, duration: 120, yoyo: true });
    this.scene.events.emit('nota', { grupo: this.grupo, nota: this.nota, x: this.x, y: this.y });
  }
}

export class PuertaMelodia {
  // Se abre al reproducir 'secuencia' (p.ej. "C5,E5,G5") en su grupo. Muestra la melodía como pista.
  constructor(scene, o) {
    this.scene = scene;
    this.o = o;
    this.grupo = o.p.grupo || 'campanas';
    this.secuencia = String(o.p.secuencia || '').split(',').map((s) => s.trim()).filter(Boolean);
    this.oculta = !!o.p.oculta; // si es true, no se enseñan las notas (hay que escucharlas)
    this.zona = cuerpoEstatico(scene, o.x, o.y, o.w, o.h);
    this.img = scene.add.tileSprite(o.x + o.w / 2, o.y + o.h / 2, o.w * 2, o.h * 2, 'puerta').setScale(ESC).setDepth(22);
    this.progreso = 0;
    this.abierta = false;
    // indicador de notas encima de la puerta
    this.marcas = this.secuencia.map((n, i) => {
      const x = o.x + o.w / 2 + (i - (this.secuencia.length - 1) / 2) * 26;
      const t = scene.add.text(x, o.y - 22, this.oculta ? '?' : nombreNota(n), estiloTexto(14, '#ffffff', { stroke: '#1b2a4a', strokeThickness: 4 })).setOrigin(0.5).setDepth(26);
      return t;
    });
    this.reproducirPista = () => {
      const t0 = Audio.t + 0.1;
      this.secuencia.forEach((n, i) => Audio.piano(n, { cuando: t0 + i * 0.45, dur: 0.4, vel: 0.6 }));
    };
    scene.events.on('nota', this.onNota, this);
  }
  onNota({ grupo, nota }) {
    if (this.abierta || grupo !== this.grupo) return;
    if (midi(nota) === midi(this.secuencia[this.progreso])) {
      this.marcas[this.progreso].setColor('#ffd23f');
      this.progreso++;
      if (this.progreso >= this.secuencia.length) this.abrir();
    } else {
      const habiaEmpezado = this.progreso > 0;
      this.progreso = midi(nota) === midi(this.secuencia[0]) ? 1 : 0;
      this.marcas.forEach((m, i) => m.setColor(i < this.progreso ? '#ffd23f' : '#ffffff'));
      if (habiaEmpezado) Audio.efecto('mal');
    }
  }
  abrir() {
    this.abierta = true;
    this.zona.body.enable = false;
    Audio.efecto('puerta');
    this.scene.mostrarAviso?.(texto('juego.puertaAbierta'));
    this.scene.tweens.add({ targets: this.img, y: this.img.y - this.o.h, alpha: 0, duration: 700, ease: 'Cubic.in' });
    this.marcas.forEach((m) => this.scene.tweens.add({ targets: m, alpha: 0, duration: 500 }));
  }
}

// ---- Checkpoint (atril) ---------------------------------------------------------

export class Checkpoint {
  constructor(scene, o) {
    this.scene = scene;
    this.x = o.pieX;
    this.y = o.pieY;
    this.img = scene.add.image(this.x, this.y, 'atril-off').setOrigin(0.5, 1).setScale(ESC).setDepth(24);
    this.zona = scene.add.zone(this.x, this.y - 50, 60, 100);
    scene.physics.add.existing(this.zona, true);
    this.activo = false;
  }
  activar() {
    if (this.activo) return false;
    this.activo = true;
    this.img.setTexture('atril-on');
    this.scene.tweens.add({ targets: this.img, scaleX: ESC * 1.15, scaleY: ESC * 1.15, duration: 140, yoyo: true });
    Audio.efecto('checkpoint');
    return true;
  }
  apagar() {
    this.activo = false;
    this.img.setTexture('atril-off');
  }
}

// ---- Coleccionables y meta ------------------------------------------------------

export class Coleccionable {
  // tipo: 'foto' u 'objeto'
  constructor(scene, o, tipo, textura) {
    this.scene = scene;
    this.tipo = tipo;
    this.x = o.pieX;
    this.y = o.pieY - 30;
    const esc = tipo === 'objeto' ? 0.5 * ESC * 2 * 0.55 : ESC * 1.1;
    this.halo = scene.add.circle(this.x, this.y, 30, 0xfff3a0, 0.35).setDepth(23);
    this.img = scene.add.image(this.x, this.y, textura).setScale(esc).setDepth(24);
    this.zona = scene.add.zone(this.x, this.y, 52, 52);
    scene.physics.add.existing(this.zona, true);
    scene.tweens.add({ targets: [this.img], y: this.y - 8, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    scene.tweens.add({ targets: this.halo, scale: 1.25, alpha: 0.15, duration: 900, yoyo: true, repeat: -1 });
    this.cogido = false;
  }
  coger() {
    this.cogido = true;
    this.zona.body.enable = false;
    this.img.setVisible(false);
    this.halo.setVisible(false);
  }
  devolver(x, y) {
    // vuelve a su sitio (si se reinicia el intento) o aparece donde se soltó
    this.cogido = false;
    if (x !== undefined) {
      this.zona.body.reset(x, y);
      this.img.setPosition(x, y);
      this.halo.setPosition(x, y);
    }
    this.zona.body.enable = true;
    this.img.setVisible(true);
    this.halo.setVisible(true);
  }
}

export class Meta {
  constructor(scene, o) {
    this.x = o.pieX;
    this.y = o.pieY;
    this.img = scene.add.image(this.x, this.y, 'meta').setOrigin(0.5, 1).setScale(ESC * 1.1).setDepth(19);
    this.zona = scene.add.zone(this.x, this.y - 50, 50, 100);
    scene.physics.add.existing(this.zona, true);
    scene.tweens.add({ targets: this.img, scaleX: ESC * 1.14, scaleY: ESC * 1.14, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}

// ---- Bocadillos (Miriam y carteles) ---------------------------------------------

export class Bocadillo {
  constructor(scene, x, y, contenido, { ancho = 330, color = 0xffffff, colorTexto = COLOR.texto } = {}) {
    this.scene = scene;
    this.c = scene.add.container(x, y).setDepth(90).setAlpha(0);
    this.t = scene.add.text(0, 0, '', { fontFamily: FUENTE, fontSize: '20px', color: colorTexto, wordWrap: { width: ancho - 28 }, lineSpacing: 2 }).setOrigin(0.5, 1);
    this.fondo = scene.add.graphics();
    this.c.add([this.fondo, this.t]);
    this.completo = contenido;
    this.ancho = ancho;
    this.color = color;
    this.visible = false;
    this.mostrado = 0;
  }
  dibujarFondo() {
    const tb = this.t.getBounds();
    const w = Math.max(80, this.t.width + 28);
    const h = this.t.height + 22;
    this.fondo.clear();
    this.fondo.fillStyle(this.color, 0.97);
    this.fondo.lineStyle(3, 0x1b2a4a, 1);
    this.fondo.fillRoundedRect(-w / 2, -h - 1 + 11, w, h, 14);
    this.fondo.strokeRoundedRect(-w / 2, -h - 1 + 11, w, h, 14);
    this.fondo.fillTriangle(-10, 9, 10, 9, 0, 24);
    this.fondo.lineBetween(-10, 10, 0, 24);
    this.fondo.lineBetween(10, 10, 0, 24);
    this.t.setY(0);
    void tb;
  }
  mostrar(si) {
    if (si === this.visible) return;
    this.visible = si;
    this.scene.tweens.killTweensOf(this.c);
    this.scene.tweens.add({ targets: this.c, alpha: si ? 1 : 0, duration: 200 });
    if (si && this.mostrado === 0) this.mostrado = 0.01;
  }
  actualizar(dt) {
    if (!this.visible || this.mostrado >= this.completo.length) return;
    const antes = Math.floor(this.mostrado);
    this.mostrado = Math.min(this.completo.length, this.mostrado + dt * 45);
    if (Math.floor(this.mostrado) !== antes) {
      this.t.setText(this.completo.slice(0, Math.ceil(this.mostrado)));
      this.dibujarFondo();
      if (antes % 3 === 0) Audio.efecto('tic');
    }
  }
}

export class Miriam {
  constructor(scene, o, etapa, textoPista) {
    this.scene = scene;
    this.x = o.pieX;
    this.y = o.pieY;
    this.img = scene.add.image(this.x, this.y, `miriam-${etapa}`).setOrigin(0.5, 1).setScale(ESC).setDepth(45);
    const alto = this.img.displayHeight;
    this.bocadillo = new Bocadillo(scene, this.x, this.y - alto - 12, textoPista);
    this.radio = o.p.radio || 170;
    scene.tweens.add({ targets: this.img, scaleY: ESC * 1.03, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  actualizar(sofia, dt, hablando) {
    this.img.setFlipX(sofia.x < this.x);
    this.bocadillo.mostrar(hablando);
    this.bocadillo.actualizar(dt);
  }
}

export class Cartel {
  // Cartel de madera con texto (tutorial o broma). Se lee al acercarse.
  constructor(scene, o, contenido) {
    this.x = o.pieX;
    this.y = o.pieY;
    const g = scene.add.graphics().setDepth(18);
    g.fillStyle(0xb07a45, 1).lineStyle(3, 0x1b2a4a, 1);
    g.fillRect(this.x - 4, this.y - 46, 8, 46).strokeRect(this.x - 4, this.y - 46, 8, 46);
    g.fillRoundedRect(this.x - 24, this.y - 70, 48, 30, 5).strokeRoundedRect(this.x - 24, this.y - 70, 48, 30, 5);
    g.fillStyle(0x1b2a4a, 1).fillRect(this.x - 14, this.y - 60, 28, 3).fillRect(this.x - 14, this.y - 52, 20, 3);
    this.bocadillo = new Bocadillo(scene, this.x, this.y - 82, contenido, { ancho: 360, color: 0xfff6e0 });
    this.radio = o.p.radio || 150;
  }
  actualizar(sofia, dt, hablando) {
    this.bocadillo.mostrar(hablando);
    this.bocadillo.actualizar(dt);
  }
}

// ---- Meta falsa (niveles-trampa) -------------------------------------------------

export class MetaFalsa {
  // Igual que la meta... hasta que la tocas: sale corriendo 'dx' tiles y desaparece.
  constructor(scene, o) {
    this.scene = scene;
    this.o = o;
    this.x = o.pieX;
    this.y = o.pieY;
    this.img = scene.add.image(this.x, this.y, 'meta').setOrigin(0.5, 1).setScale(ESC * 1.1).setDepth(19);
    this.zona = scene.add.zone(this.x, this.y - 50, 50, 100);
    scene.physics.add.existing(this.zona, true);
    scene.tweens.add({ targets: this.img, scaleX: ESC * 1.14, scaleY: ESC * 1.14, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.usada = false;
  }
  tocar(contenido) {
    if (this.usada) return;
    this.usada = true;
    this.zona.body.enable = false;
    Audio.efecto('invertir');
    this.scene.globo?.(this.x, this.y - 150, contenido || '¡Todavía no!');
    const dx = (this.o.p.dx ?? 8) * TILE;
    this.scene.tweens.add({ targets: this.img, x: this.x + dx, angle: 360, duration: 900, ease: 'Cubic.in' });
    this.scene.tweens.add({ targets: this.img, alpha: 0, delay: 700, duration: 300 });
  }
}

// ---- Peligro que avanza (marea, papeles...) para escapes ---------------------------

export class PeligroMovil {
  // Rectángulo que avanza a 'velocidad' px/s (dir: arriba, derecha). Mata al tocarlo.
  constructor(scene, o) {
    this.scene = scene;
    this.o = o;
    this.dir = o.p.dir || 'arriba';
    this.vel = o.p.velocidad || 40;
    this.danio = o.p.danio || 1;
    this.margen = (o.p.margen ?? 7) * TILE;
    this.color = Phaser.Display.Color.HexStringToColor(o.p.color || '#3f8cff').color;
    this.zona = scene.add.zone(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h);
    scene.physics.add.existing(this.zona, true);
    this.zona.danio = this.danio;
    this.g = scene.add.graphics().setDepth(65);
    this.pos = { x: o.x, y: o.y };
    this.activo = !o.p.desdeX;
    // 'hastaX' / 'hastaY' (casillas): donde se detiene el frente
    this.hasta = this.dir === 'arriba' ? (o.p.hastaY !== undefined ? o.p.hastaY * TILE : -Infinity) : (o.p.hastaX !== undefined ? o.p.hastaX * TILE : Infinity);
    this.zona.body.enable = this.activo;
    this.dibujar(0);
  }
  dibujar(t) {
    const { w, h } = this.o;
    const g = this.g;
    g.clear();
    if (!this.activo) return;
    g.fillStyle(this.color, 0.85);
    if (this.dir === 'arriba') {
      g.fillRect(this.pos.x, this.pos.y + 10, w, h + Math.max(0, this.o.y - this.pos.y));
      for (let x = 0; x < w; x += 40) g.fillCircle(this.pos.x + x + 20, this.pos.y + 12 + Math.sin(t / 300 + x) * 4, 22);
    } else {
      const cola = Math.max(0, this.pos.x - this.o.x);
      g.fillRect(this.pos.x - cola, this.pos.y, w + cola - 10, h);
      for (let y = 0; y < h; y += 40) g.fillCircle(this.pos.x + w - 12 + Math.sin(t / 300 + y) * 4, this.pos.y + y + 20, 22);
    }
  }
  actualizar(t, dt) {
    const s = this.scene.sofia;
    if (!this.activo && s.x >= this.o.p.desdeX * TILE) {
      this.activo = true;
      this.zona.body.enable = true;
    }
    if (this.activo && !this.scene.muriendo && !this.scene.terminado) {
      if (this.dir === 'arriba') this.pos.y = Math.max(this.hasta, this.pos.y - this.vel * dt);
      else this.pos.x = Math.min(this.hasta - this.o.w, this.pos.x + this.vel * dt);
      this.zona.body.reset(this.pos.x + this.o.w / 2, this.pos.y + this.o.h / 2);
    }
    this.dibujar(t);
  }
  reiniciar(punto) {
    // vuelve a quedar a 'margen' de donde reaparece Sofía (nunca más adelante de su inicio)
    if (this.dir === 'arriba') this.pos.y = Math.max(this.pos.y, Math.min(this.o.y, punto.y + this.margen));
    else this.pos.x = Math.min(this.pos.x, Math.max(this.o.x, punto.x - this.margen - this.o.w));
    this.zona.body.reset(this.pos.x + this.o.w / 2, this.pos.y + this.o.h / 2);
  }
}

// ---- Lluvia de objetos ----------------------------------------------------------

export class LluviaObjetos {
  // Zona desde cuyo techo caen objetos cada 'intervalo' ms. Hacen daño al tocar a Sofía.
  constructor(scene, o, grupoPeligros) {
    this.scene = scene;
    this.o = o;
    this.intervalo = o.p.intervalo || 1100;
    this.texturas = String(o.p.texturas || 'obj-patito,obj-sonajero,obj-ceras').split(',');
    this.grupo = grupoPeligros;
    this.siguiente = (o.p.desfase || 0);
  }
  actualizar(t) {
    if (t < this.siguiente) return;
    this.siguiente = t + this.intervalo * (0.7 + Math.random() * 0.6);
    const x = this.o.x + 20 + Math.random() * (this.o.w - 40);
    const tex = Phaser.Utils.Array.GetRandom(this.texturas);
    const s = this.scene.physics.add.image(x, this.o.y + 24, tex).setScale(0.32).setDepth(40);
    s.body.setCircle(60, 36, 36);
    s.setAngularVelocity((Math.random() - 0.5) * 300);
    s.body.setMaxVelocityY(this.o.p.velocidad || 520);
    s.danio = this.o.p.danio || 1;
    this.grupo.add(s);
    this.scene.time.delayedCall(6000, () => s.destroy());
  }
}
