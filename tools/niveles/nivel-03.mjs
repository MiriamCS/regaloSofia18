// Nivel 3 — 3 años: la guardería. Foco: puzles de cajas básicos (empujar, apilar, tirar a un foso). 3 velas.
// Tramos: (1) torre de cubos: dos cajas para un muro de 4 | (2) caja-puente: un foso de pinchos de 7 que solo se
// salta con dos cajas dentro | (3) mochilas patrulleras que empujan hacia los pinchos, y el mueble pesado |
// (4) gran puzle: tres cajas a tres alturas (suelo, repisa de 4 y repisa de 6) que hay que bajar de una en una:
// una rellena el hueco al pie del muro y otra queda encima como escalón (la tercera es de repuesto).
// Foto: sobre la mitad de la repisa larga; solo se alcanza subida a la caja media, empujada justo debajo (en vez de tirarla).
// Objeto (ceras): en el nicho bajo el tejadillo; una caja tapa la entrada y hay que empujarla hasta que cae al hueco.
// Broma: el mueble «que no se mueve ni a la de tres»... y que se mueve (despacito) si lo empujas.
export default {
  props: { tema: 'guarderia', edad: 3 },
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
