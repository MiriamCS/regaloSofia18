// Lee un mapa exportado de Tiled (JSON) y lo convierte en una lista de objetos del juego.
// Solo se usan capas de objetos: así el mapa se puede retocar en Tiled sin tileset.
import { TILE } from '../config.js';

function propiedades(lista) {
  const p = {};
  for (const prop of lista || []) p[prop.name] = prop.value;
  return p;
}

export function leerNivel(mapa) {
  const props = propiedades(mapa.properties);
  const objetos = [];
  for (const capa of mapa.layers || []) {
    if (capa.type !== 'objectgroup' || capa.visible === false) continue;
    for (const o of capa.objects || []) {
      objetos.push({
        id: o.id,
        tipo: o.type || o.class || capa.name,
        nombre: o.name || '',
        capa: capa.name,
        x: o.x,
        y: o.y,
        w: o.width || TILE,
        h: o.height || TILE,
        // punto de apoyo: centro inferior del rectángulo
        pieX: o.x + (o.width || TILE) / 2,
        pieY: o.y + (o.height || TILE),
        p: propiedades(o.properties),
      });
    }
  }
  return {
    ancho: mapa.width * mapa.tilewidth,
    alto: mapa.height * mapa.tileheight,
    props,
    objetos,
  };
}
