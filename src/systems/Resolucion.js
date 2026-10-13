// Nitidez: el juego trabaja en coordenadas de 720 de alto, pero el navegador estira el lienzo hasta el tamaño real de
// la pantalla (y en móviles, con 2 o 3 píxeles físicos por punto), y por eso letras y trazos salían borrosos.
// Phaser 3.90 no tiene opción de resolución, así que se parchea el renderizador WebGL: la proyección sigue en
// coordenadas del juego (las escenas no cambian), y el lienzo, el viewport y los recortes van en píxeles reales.
// Los textos se rasterizan a esa misma resolución. Con el renderizador Canvas (?canvas) todo queda como antes.
import Phaser from 'phaser';

const MAXIMO = 3;
let factor = 1;

// Píxeles reales por unidad del juego (1 = sin cambios)
export const resolucion = () => factor;

function calcular(juego) {
  const alto = juego.scale.displaySize.height || juego.scale.height;
  const f = ((window.devicePixelRatio || 1) * alto) / juego.scale.height;
  return Phaser.Math.Clamp(Math.round(f * 100) / 100, 1, MAXIMO);
}

// Todos los textos nuevos se rasterizan a la resolución actual (salvo que pidan otra)
const fabrica = Phaser.GameObjects.GameObjectFactory.prototype;
const textoOriginal = fabrica.text;
fabrica.text = function (x, y, contenido, estilo) {
  return textoOriginal.call(this, x, y, contenido, { resolution: factor, ...estilo });
};

export function activarResolucion(juego) {
  const r = juego.renderer;
  if (!(r instanceof Phaser.Renderer.WebGL.WebGLRenderer)) return;
  const gl = r.gl;
  const lienzo = juego.canvas;
  const principal = () => !r.currentFramebuffer;
  const px = (v) => Math.round(v * factor);

  // recorte (en coordenadas del juego) convertido a píxeles del lienzo
  const recortar = (x, y, w, h) => gl.scissor(px(x), Math.round(gl.drawingBufferHeight - (y + h) * factor), px(w), px(h));

  const ajustarLienzo = () => {
    const w = px(r.width);
    const h = px(r.height);
    if (lienzo.width !== w || lienzo.height !== h) {
      lienzo.width = w;
      lienzo.height = h;
    }
    gl.viewport(0, 0, w, h);
    r.drawingBufferHeight = gl.drawingBufferHeight;
    gl.scissor(0, 0, w, h);
  };

  const resize = r.resize;
  r.resize = function (w, h) {
    resize.call(this, w, h);
    ajustarLienzo();
    return this;
  };

  const setScissor = r.setScissor;
  r.setScissor = function (x, y, w, h, dbh) {
    if (!principal()) return setScissor.call(this, x, y, w, h, dbh);
    if (!(w > 0 && h > 0)) return;
    const c = this.currentScissor;
    if (c && c[0] === x && c[1] === y && c[2] === w && c[3] === h) return;
    this.flush();
    recortar(x, y, w, h);
  };

  const resetScissor = r.resetScissor;
  r.resetScissor = function () {
    if (!principal()) return resetScissor.call(this);
    gl.enable(gl.SCISSOR_TEST);
    const c = this.currentScissor;
    if (c && c[2] > 0 && c[3] > 0) recortar(c[0], c[1], c[2], c[3]);
  };

  const resetViewport = r.resetViewport;
  r.resetViewport = function () {
    if (!principal()) return resetViewport.call(this);
    gl.viewport(0, 0, lienzo.width, lienzo.height);
    this.drawingBufferHeight = gl.drawingBufferHeight;
  };

  // al volver de un framebuffer al lienzo, el original deja viewport y recorte en coordenadas del juego
  const setFramebuffer = r.setFramebuffer;
  r.setFramebuffer = function (...args) {
    const res = setFramebuffer.apply(this, args);
    if (principal()) {
      gl.viewport(0, 0, lienzo.width, lienzo.height);
      this.drawingBufferHeight = gl.drawingBufferHeight;
      this.resetScissor();
    }
    return res;
  };

  const preRender = r.preRender;
  r.preRender = function () {
    preRender.call(this);
    if (this.game.scene.customViewports) gl.scissor(0, 0, lienzo.width, lienzo.height);
  };

  factor = calcular(juego);
  ajustarLienzo();
  // al cambiar el tamaño de la ventana o girar el móvil
  juego.scale.on(Phaser.Scale.Events.RESIZE, () => {
    const f = calcular(juego);
    if (f === factor) return;
    factor = f;
    ajustarLienzo();
  });
}
