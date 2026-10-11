// Estado de los controles compartido entre la escena de interfaz (botones táctiles)
// y la escena de juego. También lee el teclado para probar en el ordenador.
import Phaser from 'phaser';
import { JUEGO } from '../config.js';

export const Controles = {
  izq: false,
  der: false,
  correr: false,
  saltar: false, // pulsado en este frame
  saltarMantenido: false,
  cantar: false, // pulsado en este frame
  pausa: false,
  // internos
  _tactil: { izq: false, der: false, saltar: false, cantar: false },
  _teclas: null,
  _desdeDir: 0,
  _dirAnterior: 0,
  _saltarAntes: false,
  _cantarAntes: false,

  conectarTeclado(scene) {
    const K = Phaser.Input.Keyboard.KeyCodes;
    this._teclas = scene.input.keyboard.addKeys({
      izq: K.LEFT, der: K.RIGHT, a: K.A, d: K.D,
      arriba: K.UP, w: K.W, espacio: K.SPACE, z: K.Z,
      cantar: K.X, k: K.K, correr: K.SHIFT, pausa: K.ESC, p: K.P,
    });
  },

  // Se llama una vez por frame desde la escena de juego.
  actualizar(tiempo) {
    const t = this._teclas;
    const tec = (n) => !!(t && t[n] && t[n].isDown);
    const izq = this._tactil.izq || tec('izq') || tec('a');
    const der = this._tactil.der || tec('der') || tec('d');
    const saltar = this._tactil.saltar || tec('arriba') || tec('w') || tec('espacio') || tec('z');
    const cantar = this._tactil.cantar || tec('cantar') || tec('k');
    this.pausa = tec('pausa') || tec('p');

    const dir = izq && !der ? -1 : der && !izq ? 1 : 0;
    if (dir !== this._dirAnterior) {
      this._desdeDir = tiempo;
      this._dirAnterior = dir;
    }
    this.izq = izq;
    this.der = der;
    // Mantener la dirección más de 0,5 s = correr (o Mayúsculas en teclado)
    this.correr = dir !== 0 && (tiempo - this._desdeDir >= JUEGO.controles.msParaCorrer || tec('correr'));
    this.saltar = saltar && !this._saltarAntes;
    this.saltarMantenido = saltar;
    this.cantar = cantar && !this._cantarAntes;
    this._saltarAntes = saltar;
    this._cantarAntes = cantar;
  },

  soltarTodo() {
    this._tactil = { izq: false, der: false, saltar: false, cantar: false };
    this.izq = this.der = this.correr = this.saltar = this.saltarMantenido = this.cantar = false;
  },
};
