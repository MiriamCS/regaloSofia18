// Escena de revisión del personaje: ?poses en la URL.
// Muestra a Sofía en cada etapa y animación para aprobar el diseño en el móvil.
import Phaser from 'phaser';
import { Sofia } from '../entities/Sofia.js';
import { FUENTE } from '../estilo.js';

const ETAPAS = ['bebe', 'nina', 'preado', 'adolescente', 'adulta'];
const ESTADOS = ['reposo', 'andar', 'correr', 'saltar', 'caer', 'doble', 'empujar', 'cantar', 'danio', 'celebrar', 'soplar'];

export class PosesScene extends Phaser.Scene {
  constructor() {
    super('Poses');
  }

  create() {
    const { width: W, height: H } = this.scale;
    this.cameras.main.setBackgroundColor('#cfe0ff');
    this.indice = 0;
    this.titulo = this.add.text(W / 2, 30, '', { fontFamily: FUENTE, fontSize: '26px', color: '#1b2a4a' }).setOrigin(0.5);
    this.add.text(W / 2, H - 24, 'Toca para cambiar de animación · ?poses&gatas para el bebé a gatas', { fontFamily: FUENTE, fontSize: '18px', color: '#1b2a4a' }).setOrigin(0.5);
    const gatas = new URLSearchParams(location.search).has('gatas');
    this.sofias = ETAPAS.map((e, i) => {
      const s = new Sofia(this, (W / (ETAPAS.length + 1)) * (i + 1), H * 0.72, e, { gatas: gatas && e === 'bebe', habilidades: {} });
      s.body.enable = false;
      s.setScale(2);
      this.add.text(s.x, H * 0.78, e, { fontFamily: FUENTE, fontSize: '20px', color: '#1b2a4a' }).setOrigin(0.5);
      return s;
    });
    this.input.on('pointerup', () => (this.indice = (this.indice + 1) % ESTADOS.length));
  }

  update(t, d) {
    const estado = ESTADOS[this.indice];
    this.titulo.setText(`Animación: ${estado}`);
    for (const s of this.sofias) {
      s.estadoForzado = estado;
      // simular velocidad para andar/correr
      s.body.velocity.x = estado === 'andar' ? 200 : estado === 'correr' ? 380 : estado === 'empujar' ? 100 : 0;
      s.corriendo = estado === 'correr';
      s.cantando = estado === 'cantar';
      s.animar(t, d / 1000, true, 0);
    }
  }
}
