// Nivel de PRUEBAS de mecánicas (no forma parte del juego): ?nivel=99
// Ejemplos de: plataforma a ritmo, mundos A/B, meta falsa, campanas + puerta, gravedad invertida, peligro que sube.
export default {
  props: { tema: 'instituto', etapa: 'preado', mundos: true, velas: 5 },
  leyenda: {
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 2, off: 2 },
    a: { tipo: 'solido', capa: 'solidos', fusion: 'h', mundo: 'A' },
    b: { tipo: 'nube', capa: 'solidos', fusion: 'h', mundo: 'B' },
    m: { tipo: 'meta-falsa', dx: 6, texto: '¡Jaja, todavía no!' },
    c: { tipo: 'campana', nota: 'C5', grupo: 'g1' },
    e: { tipo: 'campana', nota: 'E5', grupo: 'g1' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'g1', secuencia: 'C5,E5', h: 3 },
  },
  objetos: [
    { tipo: 'gravedad', x: 40, y: 0, w: 10, h: 12, factor: -1 },
    { tipo: 'peligro-movil', x: 60, y: 14, w: 20, h: 2, dir: 'arriba', velocidad: 30, desdeX: 60 },
    { tipo: 'miriam', x: 4, y: 11, pista: 'x', texto: 'Prueba' },
  ],
  mapa: `
##########################################################################################
#                                       ##########
#
#
#
#
#
#
#                                                                      bbbb
#                        ttt                                    aaaa
#
# S   m   C    c  e  P                          C       F O                       G
##################  #######   ##################################################  ######
##################  #######   ##################################################  ######
##################  #######   ##################################################  ######
`,
};
