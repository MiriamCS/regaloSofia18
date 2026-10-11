// Pantalla entre niveles: «Sofía cumple N años». Mientras se ve, se carga el JSON del nivel.
import Phaser from 'phaser';
import { texto } from '../config.js';
import { FUENTE_TITULO } from '../estilo.js';
import { Audio } from '../audio/Audio.js';

export const claveNivel = (n) => `nivel-${String(n).padStart(2, '0')}`;

export class TransicionScene extends Phaser.Scene {
  constructor() {
    super('Transicion');
  }

  init(data) {
    this.nivel = data.nivel ?? 0;
  }

  preload() {
    const k = claveNivel(this.nivel);
    if (!this.cache.json.exists(k)) this.load.json(k, `levels/${k}.json`);
  }

  create() {
    const { width: W, height: H } = this.scale;
    const n = this.nivel;
    this.cameras.main.setBackgroundColor('#0d1b3d');
    Audio.fundirMusica(0.8);
    const frase = n === 0 ? texto('transicion.nacer') : n === 1 ? texto('transicion.uno') : texto('transicion.varios', { n });
    const t = this.add.text(W / 2, H / 2, frase, { fontFamily: FUENTE_TITULO, fontSize: '64px', color: '#ffffff', fontStyle: 'italic' }).setOrigin(0.5).setAlpha(0);
    const clave = this.add.image(W / 2, H / 2 - 150, 'clave').setScale(0.6).setAlpha(0);
    // velas del nivel (hasta 18)
    const velas = [];
    for (let i = 0; i < n; i++) {
      const v = this.add.image(W / 2 + (i - (n - 1) / 2) * 34, H / 2 + 110, 'vela-off').setScale(0.55).setAlpha(0);
      velas.push(v);
    }
    this.tweens.add({ targets: [t, clave], alpha: 1, duration: 700 });
    velas.forEach((v, i) => {
      this.time.delayedCall(500 + i * 90, () => {
        v.setTexture('vela-on').setAlpha(1);
        Audio.piano(['C5', 'D5', 'E5', 'G5', 'A5', 'C6'][i % 6], { dur: 0.25, vel: 0.35 });
      });
    });
    if (n === 0) {
      const inf = this.add.text(W / 2, H / 2 + 110, '∞', { fontFamily: FUENTE_TITULO, fontSize: '54px', color: '#ffd23f' }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: inf, alpha: 1, duration: 700, delay: 400 });
    }
    const espera = 2000 + n * 90;
    this.time.delayedCall(espera, () => {
      this.cameras.main.fadeOut(400, 13, 27, 61);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        if (!this.cache.json.exists(claveNivel(n))) {
          // nivel aún no creado: vuelve al menú de niveles
          this.scene.start('Niveles');
          return;
        }
        this.scene.start('Juego', { nivel: n });
      });
    });
  }
}
