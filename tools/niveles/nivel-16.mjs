// Nivel 16 — 16 años: la cita romántica. 16 velas. Foco: el mundo cambia al cantar (A = día, B = noche): la cita
// empieza por la tarde y acaba de noche. Cada vez que Sofía canta se alterna el mundo; lo del otro mundo se ve
// transparente y no existe.
// Tramos: (1) la estación: puentes de un solo mundo | (2) el tren: pinchos de un solo mundo en el techo
// de los vagones (y un túnel) | (3) el mirador del monte: cambiar de mundo en el aire, muros de un mundo a mitad de
// salto y un teleférico con postes | (4) la ciudad: puerta-melodía con campanas en repisas de
// mundos distintos (cada campana tocada también cambia el mundo).
// Foto: mirador de noche en lo alto del monte, rodeado de pinchos de día.
// Objeto (ramo de rosas): andén alto sobre el tren, por nubes alternas de día y de noche.
// Broma: el reloj de la estación (siempre llegas tarde... aunque llegues puntual). Miriam: estación y campanas.
// Leyenda: a/b sólido de día/noche · d/n nube de día/noche · p/q pinchos (3 velas) de día/noche · ^ pinchos de 2 velas.
export default {
  props: { tema: 'cita', mundos: true, edad: 16 },
  leyenda: {
    a: { tipo: 'solido', capa: 'solidos', fusion: 'h', mundo: 'A' },
    b: { tipo: 'solido', capa: 'solidos', fusion: 'h', mundo: 'B' },
    d: { tipo: 'nube', capa: 'solidos', fusion: 'h', mundo: 'A' },
    n: { tipo: 'nube', capa: 'solidos', fusion: 'h', mundo: 'B' },
    p: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3, mundo: 'A' },
    q: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3, mundo: 'B' },
    '^': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    Y: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    M: { tipo: 'miriam', pista: 'mundos' },
    N: { tipo: 'miriam', pista: 'campanas' },
    K: { tipo: 'cartel', pista: 'consigna' },
    k: { tipo: 'cartel', pista: 'puentes' },
    j: { tipo: 'cartel', pista: 'tren' },
    R: { tipo: 'enemigo', clase: 'bloqueador', sprite: 'boligrafo', canto: 'apartar' },
    m: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 2, velocidad: 70 },
    z: { tipo: 'enemigo', clase: 'desafinado', sprite: 'despertador', rango: 1, velocidad: 30, canto: 'invertir' },
    1: { tipo: 'campana', nota: 'C5', grupo: 'ciudad' },
    2: { tipo: 'campana', nota: 'E5', grupo: 'ciudad' },
    3: { tipo: 'campana', nota: 'G5', grupo: 'ciudad' },
    4: { tipo: 'campana', nota: 'A5', grupo: 'ciudad' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'ciudad', secuencia: 'G5,E5,A5,C5', h: 3 },
  },
  objetos: [
    // teleférico entre las dos rocas
    { tipo: 'plataforma-movil', x: 228, y: 14, w: 3, h: 1, dx: 11, duracion: 5200, estilo: 'solido' },
    // aviones de papel
    { tipo: 'enemigo', x: 98, y: 9, clase: 'volador', sprite: 'avion-papel', rango: 4, velocidad: 70, amplitud: 1, eliminable: 'salto', canto: 'huir' },
    { tipo: 'enemigo', x: 148, y: 9, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 60, amplitud: 1, eliminable: 'salto', canto: 'huir' },
    { tipo: 'enemigo', x: 186, y: 14, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 50, amplitud: 1, eliminable: 'salto', canto: 'huir' },
    { tipo: 'enemigo', x: 290, y: 13, clase: 'volador', sprite: 'avion-papel', rango: 4, velocidad: 70, amplitud: 1.5, eliminable: 'salto', canto: 'huir' },
    { tipo: 'enemigo', x: 130, y: 9, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 70, amplitud: 1 },
    { tipo: 'enemigo', x: 200, y: 6, clase: 'volador', sprite: 'avion-papel', rango: 4, velocidad: 60, amplitud: 1.5 },
    { tipo: 'enemigo', x: 240, y: 10, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 70, amplitud: 1 },
    { tipo: 'enemigo', x: 266, y: 8, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 80, amplitud: 1 },
    { tipo: 'enemigo', x: 40, y: 12, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 60, amplitud: 1 },
    { tipo: 'enemigo', x: 80, y: 9, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 70, amplitud: 1 },
    { tipo: 'enemigo', x: 170, y: 8, clase: 'volador', sprite: 'avion-papel', rango: 4, velocidad: 70, amplitud: 1.5 },
    { tipo: 'enemigo', x: 252, y: 10, clase: 'volador', sprite: 'avion-papel', rango: 3, velocidad: 80, amplitud: 1 },
  ],
  mapa: `
#                                                                                                                                                                                                                                                                                                          #
#                                                                                                                                                                                                                                                                                                          #
#                                                                                                            ##############                                                                                                                                                              #                 #
#                                                                                                            ##############                p                                          p  F p                                                                                             #                 #
#                                                                                                            ##############                                                            bbbb                                                                                              #                 #
#                                                                                                            ##############                      O p                                                                                                                                     #                 #
#                                                                                                            ##############                 bbbbbbb                                                                                                                                      #                 #
#                                                                                                            ##############                                                        dd                          a         b                                                               #                 #
#                                                                                                            ##############             dd                                     ####                            a         b             a      b                                          #                 #
#                                                                                                            ##############                                               ddd  ####                            a         b             a      b                                          #                 #
#                                                           #####                                                                   nn                                         ####   nnn                      a         b             a      b                                          #                 #
#                                                           #####                                                                                                    nnn                                       a         b             a      b               1      2      3      4     #                 #
#                                                        nn #####                                                               dd                                                         ddd                 a         b             a      b                                          #                 #
#                                                           ##### C    j   qqq   ppp       pppqqq    R        ppp  Y   qqq         qq   m   pp       qq    C    ddd                                    C       a         b             a      b     C                                    #                 #
#                                                    ddd    ##########  ###############  ################  ##################  ################  ##############                                 nnn  ####aaa   a   nnn   b   ddd ###              #####      ddd    nnn    ddd    nnn                      #
#                                                           ##########  ###############  ################  ##################  ################  ##############                                      ####      a         b       ###              #####                                                    #
#  S  M  ^^  K                   k                  YYYYYYYY##########  ###############  ################  ##################  ################  ##############                                      ####                        ###              #####  N   ppp    qqq    ppp    qqq  z P               G #
###############aaaaaaaaaa###bbbbbbbbbb###aaaaabbbbb###################  ###############  ################  ##################  ################  ##############                                      ####                        ###              ##########################################aaa  bbb  aa####
###############          ###          ###          ###################  ###############  ################  ##################  ################  ##############                                      ####                        ###              ##########################################            ####
###############          ###          ###          ###################  ###############  ################  ##################  ################  ##############                                      ####                        ###              ##########################################            ####
`,
};
