// Nivel 2 — 2 años: los juegos infantiles. Foco: CORRER (mantener la flecha 0,5 s) y objetos que caen. 2 velas.
// Tramos: (1) las pasarelas del parque: huecos de 4-5 | (2) la piscina de bolas: lluvia de pelotas, con pasarelas
// donde refugiarse | (3) la casita: cajas para subir | (4) la torre del tobogán: carrera final.
// Foto: en lo alto de la casita, pasando por una repisa que se cae.
// Objeto (peluche): en el rincón de la piscina de bolas, al fondo del pasillo lateral con lluvia de pelotas muy densa.
// Broma: el cartel «Prohibido correr» justo antes del hueco que solo se salta corriendo.
// Monstruo nuevo: la urraca (se presenta en el cartel 5). Es la rápida: huye más deprisa de lo que anda Sofía, así que
// para recuperar la foto hay que correr. Está en la explanada final, cerrada por la pared: no puede caerse a un hueco.
export default {
  props: { tema: 'juegos', edad: 2 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'cajas', radio: 220 },
    1: { tipo: 'cartel', pista: 'correr' },
    2: { tipo: 'cartel', pista: 'nocorras' },
    3: { tipo: 'cartel', pista: 'cocina' },
    4: { tipo: 'cartel', pista: 'escalera' },
    5: { tipo: 'cartel', pista: 'urraca' },
    U: { tipo: 'enemigo', clase: 'ladron', sprite: 'urraca', rango: 4, velocidad: 170 },
  },
  objetos: [
    // lluvia de pelotas: caen desde el borde superior de la zona (x, y = esquina superior izquierda)
    { tipo: 'lluvia', x: 67, y: 4, w: 11, h: 1, intervalo: 700, texturas: 'obj-pelota' },
    { tipo: 'lluvia', x: 81, y: 4, w: 13, h: 1, intervalo: 600, texturas: 'obj-pelota' },
    { tipo: 'lluvia', x: 97, y: 4, w: 13, h: 1, intervalo: 520, texturas: 'obj-pelota' },
    // el rincón de la piscina de bolas: lluvia muy densa sobre el pasillo lateral
    { tipo: 'lluvia', x: 115, y: 0, w: 9, h: 1, intervalo: 300, texturas: 'obj-pelota' },
    // la torre del tobogán: pelotas que bajan rodando desde arriba
    { tipo: 'lluvia', x: 213, y: 0, w: 12, h: 1, intervalo: 900, texturas: 'obj-pelota' },
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
#                                                                             ###             ###             ===############                  B   ####  ==     #                                                     5      U     G   #
#                                                                                                                                           ###########         #                                       ####  vvv   ####################
#                                                         C                                              =====                              ###########      == #                       ####     ###    ####        ####################
# S M  1          ######            2                  ########## 3                                                            C  N    B    ###########         #     C 4        ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
##############    ######    ###########     #######    #############################   #############   ######################################################################    ###    ####     ###    ####        ####################
`,
};
