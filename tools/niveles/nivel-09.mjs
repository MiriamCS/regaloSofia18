// Nivel 9 — 9 años: verano en la playa y la piscina. Foco: combinación de cajas + canto + enemigos.
// Tramos: (1) la piscina: cajas flotantes que se hunden (h/k), patos y la piscina de buceo | (2) el chiringuito:
// caja en un estante alto (se sube con la plataforma musical m) para saltar la barra; la gaviota ladrona |
// (3) el camping: puente musical con un metrónomo que desafina, mochilas, mosquitos, erizos y metrónomos |
// (4) la puesta de sol: puerta-melodía de 5 notas con las campanas sobre plataformas que caen y se hunden.
// Foto: en la sombrilla más alta (desde la caja, cantar y saltar a la plataforma musical j). Objeto (equipo de buceo): en el fondo de la
// piscina de buceo (zona de gravedad baja), entre erizos. Broma: cantarle la nana al pato del medio (P)
// enfada a los otros dos (Q). El agua es un 'peligro-movil' quieto (velocidad casi 0).
// La puerta pide do, mi, re, sol, la: hay que volver atrás a por el re.
export default {
  props: { tema: 'verano', edad: 9 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'chiringuito' },
    L: { tipo: 'miriam', pista: 'atardecer' },
    Y: { tipo: 'cartel', pista: 'pato' },
    Z: { tipo: 'cartel', pista: 'buceo' },
    h: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 4, velocidad: 75 },
    k: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 4, velocidad: 75 },
    u: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 600 },
    m: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h' },
    n: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h' },
    j: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h' },
    P: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 1, velocidad: 45, eliminable: '', canto: 'dormir' },
    Q: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 1.5, velocidad: 55, eliminable: '', canto: 'enfadar' },
    U: { tipo: 'enemigo', clase: 'ladron', sprite: 'urraca', rango: 3 },
    K: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 2, velocidad: 70 },
    T: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 2, velocidad: 40 },
    V: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 1, velocidad: 35 },
    o: { tipo: 'decorado', sprite: 'nota-azul', escala: 0.35 },
    1: { tipo: 'campana', nota: 'C5', grupo: 'atardecer' },
    2: { tipo: 'campana', nota: 'D5', grupo: 'atardecer' },
    3: { tipo: 'campana', nota: 'E5', grupo: 'atardecer' },
    4: { tipo: 'campana', nota: 'G5', grupo: 'atardecer' },
    5: { tipo: 'campana', nota: 'A5', grupo: 'atardecer' },
    R: { tipo: 'puerta', capa: 'solidos', grupo: 'atardecer', secuencia: 'C5,E5,D5,G5,A5', h: 3 },
  },
  objetos: [
    // cajas que se quedarían inservibles: la del estante, si cae a la piscina de buceo; la de la foto, contra la
    // barra o contra la pared del fondo. Vuelven a su sitio
    { tipo: 'devolver-cajas', capa: 'zonas', x: 59, y: 13, w: 15, h: 5 },
    { tipo: 'devolver-cajas', capa: 'zonas', x: 106, y: 11, w: 1, h: 1 },
    { tipo: 'devolver-cajas', capa: 'zonas', x: 126, y: 11, w: 1, h: 1 },
    { tipo: 'peligro-movil', x: 11, y: 13, w: 22, h: 6, dir: 'arriba', velocidad: 0.001, color: '#4fc3e8', margen: 0 },
    { tipo: 'peligro-movil', x: 38, y: 13, w: 2, h: 6, dir: 'arriba', velocidad: 0.001, color: '#4fc3e8', margen: 0 },
    { tipo: 'peligro-movil', x: 51, y: 13, w: 2, h: 6, dir: 'arriba', velocidad: 0.001, color: '#4fc3e8', margen: 0 },
    { tipo: 'gravedad', x: 59, y: 3, w: 14, h: 15, factor: 0.4 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 178, y: 8, amplitud: 1.5, periodo: 1500, rango: 2, velocidad: 50 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 193, y: 8, amplitud: 1.5, periodo: 1300, rango: 2, velocidad: 60 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 206, y: 7, amplitud: 2, periodo: 1700, rango: 1, velocidad: 40 },
    // más mosquitos: sobre los puentes musicales del camping y sobre las colchonetas del atardecer
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 150, y: 8, amplitud: 1, periodo: 1600, rango: 3, velocidad: 55 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 192, y: 8, amplitud: 1.5, periodo: 1900, rango: 2, velocidad: 50 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 240, y: 6, amplitud: 1.5, periodo: 2000, rango: 3, velocidad: 55 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 262, y: 6, amplitud: 1.5, periodo: 1800, rango: 3, velocidad: 55 },
    { tipo: 'peligro-movil', x: 225, y: 13, w: 50, h: 6, dir: 'arriba', velocidad: 0.001, color: '#4fc3e8', margen: 0 },
  ],
  mapa: `
#                                                                                                                                                                                                                                                                                              #
#                                                                                                                                                                                                                                                                                              #
#                                                                                                                  F                                                                                                                                                                           #
#                                                                                               #######          ====                                                                                                                                                                          #
#                                                                                                                                                                                                                                                                                              #
#                                                                                               B                                                                                                                                                                                              #
#                                                                                            #####                                                                                                                                                                                             #
#                                                             o                                        ###      jj                                                                                                                                                                             #
#                                                                                                      ###                                                                                                                                  2                       4                          #
#                                                                     o                   mm           ###                     #                                                                       ###                          1               3                       5                  #
#                                                                                                      ###                     #                              nnn         ##                           ###                                 uu          uu          kk          uu              #
# S   M      hh  kk  hh  kk  hh    Y      Q  P  Q        Z      o                   C              N   ###  B            U     #    ^^      K     C      mmm         V    ##  K       ^^   V           ### K       ^^  V    L  C   uu  hh      ##  kk      hh  ##      uu  hh         R     G  #
###########                      #####  ###########  ######              ##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  ######              ##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  ######  o           ##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  #######        o    ##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  ######              ##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  ######^^^^^^O ^^^^^^##############################################################################             #############    ##########     #########    ################                                                  #############
###########                      #####  ###########  ##################################################################################################             #############    ##########     #########    ################                                                  #############
`,
};
