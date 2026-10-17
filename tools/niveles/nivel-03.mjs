// Nivel 3 — 3 años: la fiesta de disfraces. Foco: puzles de cajas básicos (empujar, apilar, tirar a un foso). 3 velas.
// Las cajas son los regalos de la fiesta. Tramos: (1) torre de regalos: dos cajas para un muro de 4 | (2) regalo-puente:
// un foso de pinchos de 7 que solo se salta con dos cajas dentro | (3) las mochilas de los invitados, que empujan
// hacia los pinchos, y la mesa de la tarta | (4) gran puzle: tres cajas a tres alturas (suelo, repisa de 4 y repisa
// de 6) que hay que bajar de una en una: una rellena el hueco al pie del muro y otra queda encima como escalón.
// Foto: sobre la mitad de la repisa larga; solo se alcanza subida a la caja media, empujada justo debajo (en vez de tirarla).
// Objeto (piano): en el nicho bajo el tejadillo; una caja tapa la entrada y hay que empujarla hasta que cae al hueco.
// Broma: la mesa de la tarta «que no se mueve ni a la de tres»... y que se mueve (despacito) si la empujas.
export default {
  props: { tema: 'fiesta', edad: 3 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'puzle', radio: 230 },
    m: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 2, velocidad: 55 },
    n: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', velocidad: 50 },
    u: { tipo: 'mueble' },
    1: { tipo: 'cartel', pista: 'cubos' },
    2: { tipo: 'cartel', pista: 'puente' },
    3: { tipo: 'cartel', pista: 'mochilas' },
    4: { tipo: 'cartel', pista: 'mueble' },
    5: { tipo: 'cartel', pista: 'final' },
  },
  objetos: [
    // cajas empujadas contra una pared sin sitio para ponerse al otro lado: vuelven a su sitio
    // (tramo 1: contra el escalón de la col. 13; tramo 2: contra el muro de la col. 33)
    { tipo: 'devolver-cajas', capa: 'zonas', x: 14, y: 10, w: 1, h: 1 },
    { tipo: 'devolver-cajas', capa: 'zonas', x: 34, y: 11, w: 1, h: 1 },
  ],
  mapa: `
#                                                        ########                                                                                                                                                  #
#                                                        ########                                                                                                                                                  #
#                                                        ########                                                                                                        F                                         #
#                                                        ########                                                                                                                                                  #
#                                                        ########                                                                                                                                                  #
#                                                    B                                                                                                                          B                                  #
#                                                ########                                                                                                                     ####                                 #
#                                                                                                                                                                   B                                              #
#                            #####            ==                                                                                                  ############    ###########                                      #
#                            #####                                                                               #####                            ############                           #####                     #
#            #    B   B      #####         ===                                                                   #####     n    n              ===           #  ==                       #####                     #
# S M   1    ############### #####    C  2         B                    C 3    m   ^   m   ^    m    4  u   m    #####    ===  ===  ==        C   B          # N                     B   #####  5            G     #
########################################################^^^^^^^#############################################################^^^^^^^^#################      O ########################### ###########################
####################################################################################################################################################################################################################
####################################################################################################################################################################################################################
####################################################################################################################################################################################################################
`,
};
