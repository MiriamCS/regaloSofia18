// Marca M. Llorens dentro del juego: la corona (isotipo, sin texto), la joya saltarina de la carga y el pie de página.
import { HEX } from '../estilo.js';

export const FUNDIDO = 200;
export const ANCHO_CORONA = 260;
export const MOVIMIENTO_REDUCIDO = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const RGB_TINTA =[(HEX.tinta >> 16) & 255, (HEX.tinta >> 8) & 255, HEX.tinta & 255];

// Lienzo de assets/sprites/escenario/isotipo-*.svg y punta de sus cuatro picos (de izquierda a derecha)
const LIENZO = { w: 1124.92, h: 456.6 };
const PICOS = [[28, 62], [363, 26], [754, 24], [1097, 62]];
const MEDIO_TRAZO = 24;
const RADIO_JOYA = 32;
const SALTO = 300; // ms por salto entre picos vecinos
const SALTO_VUELTA = 450; // el 4 → 1, el más largo
const PAUSA = 80; // al aterrizar en cada pico

// Corona sobre fondo oscuro (M/L en blanco) o claro (M/L en negro tinta)
export function corona(scene, x, y, ancho, claro = false) {
  const img = scene.add.image(x, y, claro ? 'isotipo-claro' : 'isotipo-oscuro');
  return img.setScale(ancho / img.width);
}

// Joya saltarina: círculo amarillo que salta 1 → 2 → 3 → 4 → 1 en bucle sobre una corona ya dibujada.
// Cada arco mide de alto lo mismo que el salto en horizontal: con x lineal y y parabólica,
// sube desacelerando y baja acelerando. Con «reducir movimiento» se queda quieta en el primer pico.
// esperar(fn) llama a fn la próxima vez que la joya aterriza (o enseguida si está quieta).
export function joyaSaltarina(scene, img) {
  const s = img.displayWidth / LIENZO.w;
  const r = RADIO_JOYA * s;
  const picos = PICOS.map(([px, py]) => ({ x: img.x + (px - LIENZO.w / 2) * s, y: img.y + (py - LIENZO.h / 2) * s - MEDIO_TRAZO * s - r }));
  const joya = scene.add.circle(picos[0].x, picos[0].y, r, HEX.amarillo);
  const quieta = MOVIMIENTO_REDUCIDO;
  let alAterrizar = null;
  const control = {
    joya,
    esperar(fn) {
      if (quieta) fn();
      else alAterrizar = fn;
    },
  };
  if (quieta) return control;

  let i = 0;
  let t = 0;
  let aterrizada = false;
  const actualizar = (_tiempo, delta) => {
    const dur = i === 3 ? SALTO_VUELTA : SALTO;
    const a = picos[i];
    const b = picos[(i + 1) % 4];
    t += delta;
    const k = Math.min(1, t / dur);
    joya.x = a.x + (b.x - a.x) * k;
    joya.y = a.y + (b.y - a.y) * k - 4 * Math.abs(b.x - a.x) * k * (1 - k);
    if (k === 1 && !aterrizada) {
      aterrizada = true;
      if (alAterrizar) {
        const fn = alAterrizar;
        alAterrizar = null;
        scene.events.off('update', actualizar);
        fn();
        return;
      }
    }
    if (t >= dur + PAUSA) {
      i = (i + 1) % 4;
      t = 0;
      aterrizada = false;
    }
  };
  scene.events.on('update', actualizar);
  scene.events.once('shutdown', () => scene.events.off('update', actualizar));
  return control;
}

// Pie de página: la corona pequeña y centrada abajo, en todas las pantallas que no son un nivel
export function pieMarca(scene, claro = false) {
  const { width: W, height: H } = scene.scale;
  const alto = 22;
  const img = corona(scene, W / 2, H - alto / 2 - 14, (alto * LIENZO.w) / LIENZO.h, claro);
  return img.setScrollFactor(0).setDepth(50);
}
