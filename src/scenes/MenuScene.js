// Pantalla de inicio: Jugar/Continuar, Niveles, Álbum, Objetos, Opciones (y la tarta cuando se ha visto).
import Phaser from 'phaser';
import { texto, NUM_NIVELES, etapaDeNivel } from '../config.js';
import { Boton, fondoMenu } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { Audio } from '../audio/Audio.js';
import { PISTAS } from '../audio/musica.js';
import { FUENTE_TITULO, FUENTE } from '../estilo.js';
import { Sofia } from '../entities/Sofia.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    Audio.tocarMusica(PISTAS.inicio);

    const clave = this.add.image(W * 0.2, H * 0.5, 'clave').setScale(1.4).setAlpha(0.18);
    this.tweens.add({ targets: clave, angle: { from: -3, to: 3 }, duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    this.add.text(W * 0.3, H * 0.2, texto('titulo'), { fontFamily: FUENTE_TITULO, fontSize: '96px', color: '#ffffff', fontStyle: 'bold italic', stroke: '#0d1b3d', strokeThickness: 8 }).setOrigin(0.5);
    this.add.text(W * 0.3, H * 0.2 + 74, texto('subtitulo'), { fontFamily: FUENTE_TITULO, fontSize: '32px', color: '#e8b84a', fontStyle: 'italic' }).setOrigin(0.5);

    // Sofía adulta saludando en el menú
    // Sofía aparece con la edad del siguiente nivel por jugar
    const etapa = Guardado.completado(NUM_NIVELES - 1) ? 'adulta' : etapaDeNivel(Guardado.siguienteNivel());
    this.sofia = new Sofia(this, W * 0.3, H * 0.86, etapa, {});
    this.sofia.body.setAllowGravity(false);
    this.sofia.setScale(1.9);
    this.sofia.body.enable = false;

    const x = W * 0.72;
    let y = H * 0.2;
    const paso = 86;
    const hay = Guardado.hayPartida();
    new Boton(this, x, y, hay ? texto('menu.continuar') : texto('menu.jugar'), () => {
      this.scene.start('Transicion', { nivel: Guardado.siguienteNivel() });
    }, { ancho: 400, alto: 76, tam: 34, color: 0xe8b84a, borde: 0xffffff });
    y += paso + 6;
    new Boton(this, x, y, texto('menu.niveles'), () => this.scene.start('Niveles'), { ancho: 400 });
    y += paso;
    new Boton(this, x, y, texto('menu.album'), () => this.scene.start('Album'), { ancho: 400 });
    y += paso;
    new Boton(this, x, y, texto('menu.objetos'), () => this.scene.start('Vitrina'), { ancho: 400 });
    y += paso;
    new Boton(this, x, y, texto('menu.opciones'), () => this.scene.start('Opciones'), { ancho: 400 });
    if (Guardado.datos.tartaVista) {
      y += paso;
      new Boton(this, x, y, `🎂 ${texto('menu.tarta')}`, () => this.scene.start('Tarta', { desdeMenu: true }), { ancho: 400, color: 0x7c4dff });
    }

    if (!Audio.ctx) {
      const aviso = this.add.text(W * 0.3, H - 30, texto('menu.tocaParaEmpezar'), { fontFamily: FUENTE, fontSize: '22px', color: '#cfe0ff' }).setOrigin(0.5);
      this.tweens.add({ targets: aviso, alpha: 0.3, duration: 900, yoyo: true, repeat: -1 });
      this.input.once('pointerdown', () => aviso.destroy());
    }
  }

  update(t, d) {
    // Sofía en reposo (parpadea y respira) en el menú
    this.sofia.animar(t, d / 1000, true, 0);
  }
}
