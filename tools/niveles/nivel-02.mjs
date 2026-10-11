// Nivel 2 — 2 años: la casa vista a ras de suelo. Foco: CORRER (mantener la flecha 0,5 s) y objetos que caen. 2 velas.
// Tramos: (1) el pasillo: huecos de 4-5 entre muebles | (2) la cocina: lluvia de juguetes desde la encimera,
// con baldas donde refugiarse | (3) el salón: sofá y estanterías con cajas | (4) la escalera: carrera final.
// Foto: en lo alto de la estantería, pasando por una repisa que se cae.
// Objeto (patito): en la bañera, al fondo del pasillo lateral del baño con lluvia de juguetes muy densa.
// Broma: el cartel «No corras por casa» justo antes del hueco que solo se salta corriendo.
export default {
  props: { tema: 'casa', edad: 2 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'cajas', radio: 220 },
    1: { tipo: 'cartel', pista: 'correr' },
    2: { tipo: 'cartel', pista: 'nocorras' },
    3: { tipo: 'cartel', pista: 'cocina' },
    4: { tipo: 'cartel', pista: 'escalera' },
  },
  objetos: [
    // lluvia de juguetes: caen desde el borde superior de la zona (x, y = esquina superior izquierda)
    { tipo: 'lluvia', x: 67, y: 4, w: 11, h: 1, intervalo: 700, texturas: 'obj-patito,obj-sonajero,obj-cubo' },
    { tipo: 'lluvia', x: 81, y: 4, w: 13, h: 1, intervalo: 600, texturas: 'obj-patito,obj-ceras,obj-cubo' },
    { tipo: 'lluvia', x: 97, y: 4, w: 13, h: 1, intervalo: 520, texturas: 'obj-sonajero,obj-ceras,obj-patito' },
    // el baño: lluvia muy densa sobre el pasillo lateral
    { tipo: 'lluvia', x: 115, y: 0, w: 9, h: 1, intervalo: 300, texturas: 'obj-cubo,obj-sonajero' },
    // escalera: juguetes que bajan rodando del piso de arriba
    { tipo: 'lluvia', x: 213, y: 0, w: 12, h: 1, intervalo: 900, texturas: 'obj-cubo,obj-sonajero' },
  ],
  mapa: `
#                                                               #################################################                                                                                                                      #
#                                                               #################################################                                          F                                                                           #
#                                                               #################################################                                        vvv                                                                           #
#                                                                                                                           #                                                                                                          #
#                                                                                                                           #                          ==                                                                              #
#                                                                                                                           #                                                                                                          #
#                                                                                                                         O #                      ####     #####                                                                      #
#                                                                                                                ############                      ####         #                                                                      #
#                                                                             ###             ###             ===############                  B   ####         #                                                                  G   #
#                                                                                                                                           ###########         #                                       ####  vvv   ####################
#                                                         C                                              =====                              ###########         #                       ####     ###    ####        ####################
# S M  1          ######            2                  ########## 3                                                            C  N    B    ###########         #     C 4        ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
`,
};
