// Piezas comunes de los menús, en estilo «programa de concierto»: escenario azul quieto, papel claro para lo que se
// toca, el amarillo solo para lo principal y la joya de la marca como aviso de novedades.
import Phaser from 'phaser';
import { FUENTE, COLOR, HEX, ajustarTam } from '../estilo.js';
import { Audio } from '../audio/Audio.js';
import { pieMarca, MOVIMIENTO_REDUCIDO } from './Marca.js';

// Alto del tablado (la franja oscura de abajo donde se apoya Sofía y va la corona)
export const ALTO_TABLADO = 100;

// Respuesta común al tocar algo: se encoge un poco al apretar y suena una nota al soltar
export function hacerPulsable(obj, alPulsar, { escala = 0.96, nota = 'G5', redibujar = null, activo = () => true } = {}) {
  obj.setInteractive({ useHandCursor: true });
  obj.on('pointerdown', () => {
    if (!activo()) return;
    redibujar?.(true);
    obj.setScale(escala);
  });
  obj.on('pointerout', () => {
    redibujar?.(false);
    obj.setScale(1);
  });
  obj.on('pointerup', () => {
    redibujar?.(false);
    obj.setScale(1);
    if (!activo()) return;
    Audio.iniciar();
    Audio.efecto('nota', nota);
    alPulsar?.();
  });
  return obj;
}

// Icono de línea (assets/sprites/iconos) teñido de un color
export function icono(scene, x, y, nombre, tam, color) {
  return ajustarTam(scene.add.image(x, y, `ic-${nombre}`), tam).setTint(color);
}

export class Boton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, etiqueta, alPulsar, { ancho = 360, alto = 72, tam = 30, color = HEX.papel, borde = null, colorTexto = COLOR.tinta, deshabilitado = false } = {}) {
    super(scene, x, y);
    this.fondo = scene.add.graphics();
    this.ancho = ancho;
    this.alto = alto;
    this.color = color;
    this.borde = borde;
    this.texto = scene.add.text(0, 0, etiqueta, { fontFamily: FUENTE, fontSize: `${tam}px`, color: colorTexto }).setOrigin(0.5);
    this.add([this.fondo, this.texto]);
    this.setSize(ancho, alto);
    this.deshabilitado = deshabilitado;
    this.dibujar(false);
    hacerPulsable(this, alPulsar, { redibujar: (p) => this.dibujar(p), activo: () => !this.deshabilitado });
    scene.add.existing(this);
  }

  // Plano, sin sombra: píldora de color y, si se pide, un borde fino
  dibujar(pulsado) {
    const g = this.fondo;
    const w = this.ancho;
    const h = this.alto;
    const base = this.deshabilitado ? HEX.superficie : this.color;
    g.clear();
    g.fillStyle(pulsado ? Phaser.Display.Color.ValueToColor(base).darken(8).color : base, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    if (this.borde !== null) g.lineStyle(3, this.borde, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    this.texto?.setAlpha(this.deshabilitado ? 0.6 : 1);
  }

  setTexto(t) {
    this.texto.setText(t);
    return this;
  }
}

// Escenario de todos los menús: azul noche liso y el tablado abajo, con la corona de M. Llorens como pie.
// Está quieto a propósito: solo se mueve lo que responde a un toque.
export function fondoMenu(scene, { pie = true } = {}) {
  const { width: W, height: H } = scene.scale;
  const g = scene.add.graphics();
  g.fillStyle(HEX.noche, 1).fillRect(0, 0, W, H);
  g.fillStyle(HEX.tinta, 1).fillRect(0, H - ALTO_TABLADO, W, ALTO_TABLADO);
  if (pie) pieMarca(scene);
  return g;
}

// Aviso de algo nuevo sin ver: la joya de la marca, que da un único salto al aparecer
export function insignia(scene, x, y, radio = 9) {
  const joya = scene.add.circle(x, y, radio, HEX.amarillo);
  if (!MOVIMIENTO_REDUCIDO) scene.tweens.add({ targets: joya, y: y - 12, duration: 220, delay: 350, yoyo: true, ease: 'Sine.out' });
  return joya;
}

// Botón redondo de volver, siempre arriba a la izquierda
export function botonVolver(scene, destino = 'Menu') {
  const c = scene.add.container(60, 56);
  c.add([scene.add.circle(0, 0, 30, HEX.superficie), icono(scene, -2, 0, 'volver', 30, HEX.blanco)]);
  c.setSize(60, 60);
  return hacerPulsable(c, () => scene.scene.start(destino), { escala: 0.92 });
}

// Cabecera de las pantallas interiores: volver, título a su lado y, si se da, un total a la derecha
export function cabecera(scene, titulo, { destino = 'Menu', total = null } = {}) {
  const { width: W } = scene.scale;
  botonVolver(scene, destino);
  scene.add.text(108, 56, titulo, { fontFamily: FUENTE, fontSize: '40px', color: COLOR.blanco }).setOrigin(0, 0.5);
  if (total) scene.add.text(W - 56, 56, total, { fontFamily: FUENTE, fontSize: '22px', color: COLOR.azulClaro }).setOrigin(1, 0.5);
}
