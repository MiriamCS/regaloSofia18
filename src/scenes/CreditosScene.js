// Créditos: la corona de M. Llorens como cierre y autoría, con el título del juego y las líneas de config/texts.json.
import Phaser from 'phaser';
import { texto, TEXTOS } from '../config.js';
import { Boton, fondoMenu } from '../ui/Boton.js';
import { FUENTE, COLOR } from '../estilo.js';
import { FUNDIDO, RGB_TINTA, corona } from '../ui/Marca.js';

export class CreditosScene extends Phaser.Scene {
  constructor() {
    super('Creditos');
  }

  init(data) {
    // desde Configuración se vuelve allí; al terminar la tarta, al menú
    this.destino = data?.destino ?? 'Opciones';
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this, { pie: false }); // la corona grande ya firma la pantalla
    this.cameras.main.fadeIn(FUNDIDO, ...RGB_TINTA);
    corona(this, W / 2, H * 0.3, 240);
    let y = H * 0.48;
    const titulo = this.add.text(W / 2, y, `${texto('titulo')}: ${texto('subtitulo')}`, { fontFamily: FUENTE, fontSize: '34px', color: COLOR.blanco }).setOrigin(0.5, 0);
    y += titulo.height + 22;
    for (const linea of TEXTOS.creditos.lineas) {
      const t = this.add.text(W / 2, y, linea, { fontFamily: FUENTE, fontSize: '24px', color: COLOR.azulClaro }).setOrigin(0.5, 0);
      y += t.height + 10;
    }
    new Boton(this, W / 2, H * 0.84, texto('creditos.volver'), () => this.scene.start(this.destino), { ancho: 260, alto: 64, tam: 26 });
  }
}
