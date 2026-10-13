// Botón de menú grande y táctil con el estilo del juego.
import Phaser from 'phaser';
import { FUENTE, COLOR } from '../estilo.js';
import { Audio } from '../audio/Audio.js';

export class Boton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, etiqueta, alPulsar, { ancho = 360, alto = 72, tam = 30, color = 0x1e4fa3, borde = 0xe8b84a, deshabilitado = false } = {}) {
    super(scene, x, y);
    this.fondo = scene.add.graphics();
    this.ancho = ancho;
    this.alto = alto;
    this.color = color;
    this.borde = borde;
    this.texto = scene.add.text(0, 0, etiqueta, { fontFamily: FUENTE, fontSize: `${tam}px`, color: COLOR.blanco, fontStyle: 'bold' }).setOrigin(0.5);
    this.add([this.fondo, this.texto]);
    this.setSize(ancho, alto);
    this.deshabilitado = deshabilitado;
    this.dibujar(false);
    this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      if (this.deshabilitado) return;
      this.dibujar(true);
      this.setScale(0.96);
    });
    this.on('pointerout', () => {
      this.dibujar(false);
      this.setScale(1);
    });
    this.on('pointerup', () => {
      this.dibujar(false);
      this.setScale(1);
      if (this.deshabilitado) return;
      Audio.iniciar();
      Audio.efecto('nota', 'G5');
      alPulsar?.();
    });
    scene.add.existing(this);
  }

  dibujar(pulsado) {
    const g = this.fondo;
    const w = this.ancho;
    const h = this.alto;
    g.clear();
    g.fillStyle(0x000000, 0.25);
    g.fillRoundedRect(-w / 2 + 3, -h / 2 + 6, w, h, h / 2);
    g.fillStyle(this.deshabilitado ? 0x56607a : pulsado ? Phaser.Display.Color.ValueToColor(this.color).darken(15).color : this.color, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    g.lineStyle(4, this.deshabilitado ? 0x8c95ab : this.borde, 1);
    g.strokeRoundedRect(-w / 2, -h / 2, w, h, h / 2);
    this.texto?.setAlpha(this.deshabilitado ? 0.6 : 1);
  }

  setTexto(t) {
    this.texto.setText(t);
    return this;
  }
}

// Fondo azul con notas musicales flotando, usado en todos los menús.
export function fondoMenu(scene) {
  const { width: W, height: H } = scene.scale;
  const g = scene.add.graphics();
  g.fillGradientStyle(0x1e4fa3, 0x1e4fa3, 0x0d1b3d, 0x0d1b3d, 1);
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) {
    const nota = scene.add.image(Math.random() * W, Math.random() * H, i % 3 ? 'nota-azul' : 'nota-dorada').setScale(0.4 + Math.random() * 0.4).setAlpha(0.25);
    scene.tweens.add({ targets: nota, y: nota.y - 60 - Math.random() * 60, angle: Math.random() * 40 - 20, duration: 3000 + Math.random() * 3000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  return g;
}

export function botonVolver(scene, destino = 'Menu', etiqueta = 'Volver') {
  return new Boton(scene, 110, 52, `‹ ${etiqueta}`, () => scene.scene.start(destino), { ancho: 180, alto: 60, tam: 24 });
}
