// Nivel 0 — Año 0: la habitación del bebé. Tutorial a gatas: moverse, saltar y empujar.
// Velas infinitas. Tramos: primeros pasos | la caja | el pato y la broma | el puzle de las dos cajas.
// Foto: en lo alto de la escalera de nubes (saltos precisos). Objeto: tras la pared falsa del final.
export default {
  props: { tema: 'cuna', gatas: true, edad: 0 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'cajas' },
    p: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 3, velocidad: 55 },
    H: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'fantasma' },
    n: { tipo: 'decorado', sprite: 'nota-dorada', escala: 0.6 },
    1: { tipo: 'cartel', pista: 'mover' },
    2: { tipo: 'cartel', pista: 'saltar' },
    3: { tipo: 'cartel', pista: 'hueco' },
    4: { tipo: 'cartel', pista: 'empujar' },
    5: { tipo: 'cartel', pista: 'pato' },
    6: { tipo: 'cartel', pista: 'seguro' },
    7: { tipo: 'cartel', pista: 'meta' },
  },
  mapa: `
#                                                                                                                                                    #
#                                                                                                                                                    #
#                                                                                                                                                    #
#                                                                                                                                                    #
#                                                                                                                                                    #
#                                                                                                                                                    #
#                                                                          F                                                                         #
#                                                                         ==                                                                         #
#                                                                      ==                                  C                                         #
#                                             C                     ==                                #######################                        #
#                                       ###########              ==                              #  B #################     H                        #
# S M    1  2 ####3            4  B     ###########  5    p   ==               6         C   N  #####B################# O   H  n     7        G      #
#################### #############################################################XXXX################################################################
#################### #############################################################   #################################################################
#################### #################################################################################################################################
`,
};
