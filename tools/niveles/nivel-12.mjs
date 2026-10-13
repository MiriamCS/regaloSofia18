// Nivel 12 — 12 años: primer día de instituto. Foco: gravedad y controles cambiantes (estilo That Level Again).
// Tramos: (1) pasillo con zonas de controles invertidos (en la segunda, un examen obliga a pararse y cantar; la
// última empieza en mitad de un salto) |
// (2) el gimnasio con gravedad baja (factor 0,4) | (3) la escalera al revés: gravedad invertida, se anda por
// el techo y los huecos del techo son precipicios hacia el cielo | (4) todo mezclado, con exámenes bloqueadores
// (cantarles los aparta) y metrónomos que invierten los controles si cantas cerca.
// Foto: en un hueco del techo del gimnasio; se llega saltando (doble) hasta la canasta antigravedad.
// Objeto: en la taquilla del fondo de la zona invertida: una ventana de gravedad normal te deja caer hasta ella.
// Broma: el cartel «Por aquí no» con la flecha al revés, dentro del pasillo invertido.
// Las zonas (invertir, gravedad) van en 'objetos'; si se solapan dos de gravedad, manda la última de la lista.
// Monstruo nuevo: la pila de exámenes (se presenta en el cartel 3, justo antes de la primera). Desde el nivel 10 los
// pinchos quitan 2 velas.
export default {
  props: { tema: 'instituto', edad: 12 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'alreves' },
    1: { tipo: 'cartel', pista: 'poraquino' },
    2: { tipo: 'cartel', pista: 'final' },
    3: { tipo: 'cartel', pista: 'examenes' },
    '^': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    E: { tipo: 'enemigo', clase: 'bloqueador', sprite: 'examenes', canto: 'apartar' },
    T: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 1, velocidad: 35 },
  },
  objetos: [
    { tipo: 'invertir', x: 12, y: 2, w: 13, h: 10 },
    { tipo: 'invertir', x: 32, y: 2, w: 14, h: 10 },
    { tipo: 'invertir', x: 49, y: 2, w: 12, h: 10 },
    { tipo: 'gravedad', x: 66, y: 2, w: 74, h: 10, factor: 0.4 },
    { tipo: 'gravedad', x: 110, y: -8, w: 13, h: 14, factor: -1 },
    { tipo: 'gravedad', x: 148, y: -8, w: 62, h: 23, factor: -1 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 186, y: 8, amplitud: 0.8, periodo: 1800, rango: 2, velocidad: 60 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 170, y: 7, amplitud: 0.6, periodo: 1500, rango: 2, velocidad: 50 },
    { tipo: 'gravedad', x: 201, y: 7, w: 3, h: 5, factor: 1 },
    { tipo: 'gravedad', x: 231, y: 2, w: 19, h: 10, factor: 0.4 },
    { tipo: 'invertir', x: 236, y: 2, w: 14, h: 10 },
    { tipo: 'gravedad', x: 253, y: 2, w: 8, h: 10, factor: -1 },
    { tipo: 'invertir', x: 264, y: 2, w: 17, h: 10 },
  ],
  mapa: `
###################################################################################################################  ########################################################   ########    ########  ##################################################################################################
###################################################################################################################  ###F####################################################   ########    ########  ##################################################################################################
#                                                                                                                                                              ##############   ########    ########  ############                                                                                     #
#                                                                                                                                                              ##############   ########    ########  ############                                                                                     #
#                                                                                                                                                                      ######   ########                                                                        ##                                     #
#                                                                                      ##                                                                              ######   ########                                                                        ##                                     #
#                                                                                      ##                                                                                                                                                                       ##                                     #
#                                                                                      ##          ===                                                                                                                                             ==           ##                                     #
#                                                                                  === ##     ===                              ===                                                                                                            ==                ##                                     #
#                                                                                      ##                                               ##                                                                                                                      ##                                     #
#                                                                                      ##                                               ##                                                                                                                      ##                                     #
# S  M       1  ^^   ^^       3   E        ^^          ^^        C    ^^^^^^^^   ^     ##  ^^^^^^^^^                        ^^^^^^^^^^  ##      C N                                                  ^^   O   ^^^   C   T     E ^^##^^    ^^^^^^^^^^            ##              E T         2     G    #
###########################   ########   #######   ######################################################################################################################################################################################################################    ##########  ###############
###########################   ########   #######   ######################################################################################################################################################################################################################    ##########  ###############
###########################   ########   #######   ######################################################################################################################################################################################################################    ##########  ###############
`,
};
