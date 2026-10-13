// Firma de inicio de M. Llorens: la corona sobre el azul más oscuro durante ~1 s, con fundido de entrada de 200 ms.
// Después, BootScene carga el juego con la joya saltarina sobre la misma corona y funde al terminar.
import Phaser from 'phaser';
import { HEX } from '../estilo.js';
import { ANCHO_CORONA, FUNDIDO, RGB_TINTA, corona } from '../ui/Marca.js';

const RETENCION = 1000;

export class FirmaScene extends Phaser.Scene {
  constructor() {
    super('Firma');
  }

  preload() {
    this.load.svg('isotipo-oscuro', 'sprites/escenario/isotipo-oscuro.svg', { scale: 0.5 });
    this.load.svg('isotipo-claro', 'sprites/escenario/isotipo-claro.svg', { scale: 0.5 });
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.cameras.main.setBackgroundColor(HEX.tinta);
    // los parámetros de depuración (?nivel, ?trucos...) se saltan la firma
    if (window.location.search) {
      this.scene.start('Boot');
      return;
    }
    corona(this, W / 2, H / 2, ANCHO_CORONA);
    this.cameras.main.fadeIn(FUNDIDO, ...RGB_TINTA);
    // la carga continúa sobre la misma corona (solo aparece la joya), así que aquí no hay fundido de salida
    this.time.delayedCall(FUNDIDO + RETENCION, () => this.scene.start('Boot'));
  }
}
