// Prólogo de la primera partida: «¡Has encontrado una foto!» con la foto del nacimiento,
// que queda guardada en el álbum, y la meta del juego (llegar de los 0 a los 18 años).
import Phaser from 'phaser';
import { texto, FOTOS } from '../config.js';
import { Boton, fondoMenu } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { Audio } from '../audio/Audio.js';
import { FUENTE, FUENTE_TITULO } from '../estilo.js';
import { recortarCubriendo, CLAVE_FOTO_NACIMIENTO } from './MenusScene.js';

export class PrologoScene extends Phaser.Scene {
  constructor() {
    super('Prologo');
  }

  preload() {
    this.load.on('loaderror', () => {});
    const f = FOTOS.nacimiento;
    if (f?.archivo && !this.textures.exists(CLAVE_FOTO_NACIMIENTO)) this.load.image(CLAVE_FOTO_NACIMIENTO, f.archivo);
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    Guardado.conseguirFotoNacimiento();

    const cabecera = this.add.text(W / 2, 64, texto('prologo.encontrada'), { fontFamily: FUENTE_TITULO, fontSize: '52px', color: '#ffd23f', fontStyle: 'bold italic', stroke: '#0d1b3d', strokeThickness: 7 }).setOrigin(0.5).setAlpha(0);

    // Foto con marco de papel y el título escrito a mano debajo
    const aw = Math.min(480, W * 0.36);
    const ah = Math.round(aw * 0.68);
    const marco = 16;
    const foto = this.add.container(W * 0.31, H * 0.55).setAngle(-3);
    const papel = this.add.graphics();
    papel.fillStyle(0x000000, 0.3).fillRect(-aw / 2 - marco + 6, -ah / 2 - marco + 8, aw + marco * 2, ah + marco * 2 + 60);
    papel.fillStyle(0xffffff, 1).fillRect(-aw / 2 - marco, -ah / 2 - marco, aw + marco * 2, ah + marco * 2 + 60);
    foto.add(papel);
    if (this.textures.exists(CLAVE_FOTO_NACIMIENTO)) {
      const img = this.add.image(0, 0, CLAVE_FOTO_NACIMIENTO);
      recortarCubriendo(img, aw, ah);
      foto.add(img);
    } else {
      foto.add(this.add.rectangle(0, 0, aw, ah, 0xdbe7ff));
      foto.add(this.add.image(0, 0, 'marco-foto').setScale(1.2));
    }
    foto.add(this.add.text(0, ah / 2 + marco + 26, texto('prologo.titulo'), { fontFamily: '"Comic Sans MS", "Chalkboard SE", ' + FUENTE, fontSize: '28px', color: '#1b2a4a' }).setOrigin(0.5));
    foto.setScale(0.3).setAlpha(0);

    // Historia y botón para empezar
    const xd = W * 0.73;
    const historia = this.add.text(xd, H * 0.44, texto('prologo.historia'), { fontFamily: FUENTE, fontSize: '27px', color: '#ffffff', align: 'center', lineSpacing: 10, wordWrap: { width: Math.min(500, W * 0.4) } }).setOrigin(0.5).setAlpha(0);
    const guardada = this.add.text(xd, historia.y + historia.height / 2 + 34, `📷 ${texto('prologo.guardada')}`, { fontFamily: FUENTE, fontSize: '20px', color: '#cfe0ff', fontStyle: 'italic' }).setOrigin(0.5).setAlpha(0);
    const boton = new Boton(this, xd, H * 0.84, texto('prologo.empezar'), () => this.empezar(), { ancho: 340, alto: 76, tam: 34, color: 0xe8b84a, borde: 0xffffff });
    boton.setAlpha(0);

    this.tweens.add({ targets: cabecera, alpha: 1, y: { from: 40, to: 64 }, duration: 500, ease: 'Back.out' });
    this.tweens.add({ targets: foto, scale: 1, alpha: 1, angle: -3, duration: 700, delay: 250, ease: 'Back.out' });
    this.time.delayedCall(350, () => Audio.efecto('coleccionable'));
    this.tweens.add({ targets: [historia, guardada], alpha: 1, duration: 700, delay: 900 });
    this.tweens.add({ targets: boton, alpha: 1, duration: 500, delay: 1500 });
    this.chispas(foto.x, foto.y, aw);
  }

  // destellos dorados alrededor de la foto al aparecer
  chispas(x, y, ancho) {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const p = this.add.image(x, y, 'punto').setTint(0xffd23f).setScale(0.6).setAlpha(0);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(a) * ancho * 0.65,
        y: y + Math.sin(a) * ancho * 0.5,
        alpha: { from: 1, to: 0 },
        scale: 0.2,
        duration: 900,
        delay: 300 + Math.random() * 200,
        ease: 'Cubic.out',
        onComplete: () => p.destroy(),
      });
    }
  }

  empezar() {
    this.cameras.main.fadeOut(400, 13, 27, 61);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Transicion', { nivel: 0 }));
  }
}
