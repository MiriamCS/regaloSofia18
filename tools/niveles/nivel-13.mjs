// Nivel 13 — 13 años: la habitación adolescente y el móvil gigante. 13 velas.
// Foco: enemigos notificación y «la interfaz que miente» (avisos falsos, meta falsa, paredes y suelos falsos).
// Tramos: (1) la habitación: notificaciones y suelo de Lego | (2) dentro del móvil: «¡Nivel completado!»
// falso, meta falsa y una pared «sin salida» que se atraviesa | (3) apps que se cierran (temporizadas) sobre
// el vacío y suelos que desaparecen | (4) modo avión: controles invertidos con notificaciones (se entra cayendo
// por detrás de un bloque y se sale por una zanja).
// Broma: «Batería baja: 1%»... y no se apaga nada. Foto: en la galería del móvil, tras una pared falsa
// (arriba, en el tramo 2). Objeto (primer móvil): en el cajón del escritorio, entre Legos y notificaciones.
// Miriam: al empezar y dentro del móvil (no te fíes de los avisos).
export default {
  props: { tema: 'habitacion', edad: 13 },
  leyenda: {
    K: { tipo: 'miriam', pista: 'hola' },
    M: { tipo: 'miriam', pista: 'movil' },
    n: { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', velocidad: 70, rango: 3, amplitud: 1, periodo: 1600 },
    u: { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', velocidad: 0, rango: 0, amplitud: 1.2, periodo: 1400 },
    N: { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', velocidad: 110, rango: 4, amplitud: 0.6, periodo: 1100, escala: 1.3, eliminable: 'salto', canto: 'huir' },
    d: { tipo: 'enemigo', clase: 'desafinado', sprite: 'despertador', velocidad: 45, rango: 2 },
    w: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    H: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'fantasma' },
    x: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', retardo: 300 },
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1600, off: 1400, desfase: 0 },
    y: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1600, off: 1400, desfase: 1500 },
    k: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1200, off: 800, desfase: 0 },
    j: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1200, off: 800, desfase: 1000 },
    m: { tipo: 'meta-falsa', dx: 12, pista: 'metaFalsa' },
    1: { tipo: 'cartel', pista: 'legos' },
    2: { tipo: 'cartel', pista: 'metaReal' },
  },
  objetos: [
    // el móvil gigante (decorado de fondo) y la nota dorada que delata la pared falsa
    { tipo: 'decorado', x: 74, y: 11, sprite: 'obj-movil', escala: 2.6 },
    { tipo: 'decorado', x: 110, y: 9, sprite: 'nota-dorada', escala: 0.5 },
    { tipo: 'decorado', x: 121, y: 3, sprite: 'nota-dorada', escala: 0.4 },
    // más notificaciones sobre las apps que se cierran y en el modo avión
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 160, y: 6, velocidad: 70, rango: 3, amplitud: 1, periodo: 1500 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 200, y: 5, velocidad: 80, rango: 3, amplitud: 1, periodo: 1300 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 240, y: 6, velocidad: 70, rango: 4, amplitud: 1.2, periodo: 1700 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 272, y: 7, velocidad: 90, rango: 3, amplitud: 0.8, periodo: 1200 },
    // avisos que mienten
    { tipo: 'aviso', x: 99, y: 6, w: 2, h: 6, pista: 'completado', duracion: 2600 },
    { tipo: 'aviso', x: 105, y: 0, w: 2, h: 12, pista: 'sinSalida', duracion: 2600 },
    { tipo: 'aviso', x: 129, y: 6, w: 2, h: 6, pista: 'bateria', duracion: 3800 },
    { tipo: 'aviso', x: 143, y: 0, w: 2, h: 12, pista: 'bateriaBroma', duracion: 3000 },
    { tipo: 'aviso', x: 170, y: 0, w: 2, h: 9, pista: 'actualizacion', duracion: 3000 },
    // modo avión: controles invertidos
    { tipo: 'aviso', x: 225, y: 6, w: 4, h: 2, pista: 'avion', duracion: 3000 },
    { tipo: 'invertir', x: 229, y: 0, w: 48, h: 12 },
    { tipo: 'aviso', x: 279, y: 12, w: 1, h: 2, pista: 'avionFuera', duracion: 2600 },
  ],
  mapa: `
#                                                                                                             HH         ###########                                                                                                                                                               #
#                                                                                                             HH         H         #                                                                                                                                                               #
#                                                                                                             HH         H         #                                                                                                                                                               #
#                                                                                                             HH       N H         #                                                                                                                                                               #
#                                N                                                                            HH         H      F  #                                                                                                                                                               #
#                                               n         n                                                   HH     ##############                                                                         n                                                                                      #
#                          #############                                                                      HH                                                                  n                                           n                                                                    #
#                                      #         ==                                              N            HH   yy                                                                           u                                                        u                                         #
#                 u                    #                   vv                              n                  HH           N            u                                                                jj                      ####      n        ###             n                              #
#                           u   u   u  #    ===        ==                                                     HH tt                u                                 tt   ##        vv   xx          kk      kk                  ####               ###                             u         n    #
#           ####     ##                #             u                                                        HH                                                yy        ##   vv             ####                               ####             #####                                            #
# S   K  d  ####     ##     w   w   w O# 1 wwwwwwwwwwwwwwwwww     C   www    M                      m         HH                             d      C      tt             ##                  ####                 d  C   d     ww###             #####   ww   d   wwww                      ww2 G #
################    #############################################################xxxx####     #####xxxx##################     ########    ###############                 ##                  ####               ########################    ##########     ###########xx  #####            ########
################wwww#############################################################    ####     #####    ##################     ########wwww###############                 ##                  ####               ########################    ##########     ###########    #####            ########
#################################################################################    ####     ###########################     ###########################                 ##                  ####               ########################    ##########     ###########    #########################
`,
};
