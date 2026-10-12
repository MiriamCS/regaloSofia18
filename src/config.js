// Toda la configuración editable vive en /config. Aquí solo se reexporta.
import juego from '../config/juego.json';
import textos from '../config/texts.json';
import fotos from '../config/photos.json';
import objetos from '../config/objetos.json';
import enemigos from '../config/enemigos.json';
import mensajeFinal from '../config/mensaje-final.txt?raw';

export const JUEGO = juego;
export const TEXTOS = textos;
export const FOTOS = fotos;
export const OBJETOS = objetos;
export const ENEMIGOS = enemigos.enemigos;
export const MENSAJE_FINAL = mensajeFinal;

export const NUM_NIVELES = 19;

// Textura de un objeto coleccionable ('chupete.svg' -> 'obj-chupete')
export const claveObjeto = (o) => `obj-${o.sprite.replace(/\.\w+$/, '')}`;
export const TILE = juego.tile;

// Etapa de edad (aspecto de Sofía y paleta) según el nivel.
export function etapaDeNivel(n) {
  if (n <= 2) return 'bebe';
  if (n <= 7) return 'nina';
  if (n <= 12) return 'preado';
  if (n <= 17) return 'adolescente';
  return 'adulta';
}

// Miriam es 5 años mayor: en el nivel N tiene N + 5 años.
export function etapaMiriam(n) {
  const edad = n + 5;
  if (edad <= 7) return 'nina';
  if (edad <= 12) return 'preado';
  if (edad <= 17) return 'adolescente';
  return 'adulta';
}

export function velasDeNivel(n) {
  return n === 0 ? Infinity : n;
}

export function tieneHabilidad(nivel, habilidad) {
  return nivel >= (juego.habilidades[habilidad] ?? 0);
}

// Sustituye {n}, {nombre}... en los textos.
export function texto(clave, vars = {}) {
  const partes = clave.split('.');
  let v = textos;
  for (const p of partes) v = v?.[p];
  if (typeof v !== 'string') return clave;
  return v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}
