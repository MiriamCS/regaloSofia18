// Nivel 10 — 10 años: los volcanes. Foco: peligros de 2 velas (la lava) y plataformas temporizadas.
// Tramos: (1) las rocas que aparecen entre el humo (temporizadas) y el géiser | (2) rocas que se encienden y se
// apagan sobre ríos de lava de 2 velas | (3) aviones de papel entre las cumbres | (4) carrera por las coladas
// con piedras que se caen.
// Foto: en la cumbre más alta, encadenando tres rocas (p, q, k). Objeto (pendiente; de momento la pelota): en la
// grieta bajo la colada, entre lava de 2 velas. Broma: el géiser puntual (r), que casi nunca está.
// Aquí se estrenan las temporizadas y el daño de 2 velas (la lava naranja y el avión grande).
// Temporizadas: a/b se alternan (ciclo 3 s); d/e/f se encienden en ola, de izquierda a derecha (ciclo 2,7 s); p/q/k suben en cadena.
export default {
  props: { tema: 'volcan', edad: 10 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'cables' },
    1: { tipo: 'cartel', pista: 'semaforo' },
    2: { tipo: 'cartel', pista: 'naranja' },
    3: { tipo: 'cartel', pista: 'aviones' },
    W: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    a: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 1200, desfase: 0 },
    b: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 1200, desfase: 1500 },
    r: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 700, off: 4300 },
    p: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1500, desfase: 0 },
    q: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1500, desfase: 2000 },
    k: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1500, desfase: 1000 },
    d: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 900, desfase: 0 },
    e: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 900, desfase: 1800 },
    f: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 900, desfase: 900 },
    v: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 350 },
    u: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 350 },
    c: { tipo: 'enemigo', clase: 'patrullero', sprite: 'cochecito', rango: 3, velocidad: 80 },
  },
  objetos: [
    // el primero, junto al atril, vuela algo más alto: de pie en el suelo no te da (antes bajaba hasta la cabeza
    // de Sofía encima del hueco y, del golpe, se caía una y otra vez)
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 164, y: 5, velocidad: 50, rango: 2, amplitud: 1, periodo: 2000 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 176, y: 5, velocidad: 70, rango: 2, amplitud: 2, periodo: 1500 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 189, y: 4, velocidad: 60, rango: 2, amplitud: 2.5, periodo: 1900 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 201, y: 4, velocidad: 60, rango: 3, amplitud: 1, periodo: 1300 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 248, y: 5, velocidad: 60, rango: 2, amplitud: 2, periodo: 1600 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 264, y: 6, velocidad: 60, rango: 2, amplitud: 2.5, periodo: 2200, escala: 1.4, danio: 2 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 277, y: 4, velocidad: 80, rango: 2, amplitud: 1.5, periodo: 1400 },
  ],
  mapa: `
#                                                                      F                                                                                                                                                                                                                            #
#                                                                   ######                                                                                                                                                                                                                          #
#                                                                   ######                                                                                                                                                                                                                          #
#                                                                   ######                                                                                                                                                                                                                          #
#                                                             kk    ######                                                                                                                                                                                                                          #
#                                                                   ######                                                                                                                                                                                                                          #
#                                                                qq ######                                                                                                                                                                                                                          #
#                                                                                                                                                                                               #####  =======#########                            ====    vuvuvu                                   #
#                        c      aa  bb            1           pp                                                                 eee       ddd           3   C                     ########     #####         #########    N     C                                         aaa   vuvuvuv         G  #
# S   M        aa  ###########          ############# rrrr                 2  C                                             ddd       fff       eee  ############     ########     ########     #####         #####################=======vuvuvu                    ===                   ###########
#############      ###########          #############      #####################  aaa  bbb  aaa  ##  bbb  aaa  bbb  ######                           ############     ########     ########     #####        ######################                                                       ###########
#############      ###########          #############      #####################                 ##                 ######                           ############     ########     ########     #####         #####################                                                       ###########
#############      ###########          #############      ##############################WWWWWWWW##WWWWWWWWWWWW#####################WWWWWWWWW####################     ########     ########     #####   O     #####################                                                       ###########
#############      ###########          #############      ######################################################################################################     ########     ########     #####WWW##WWWW#####################                                                       ###########
#############      ###########          #############      ######################################################################################################     ########     ########     ###################################                                                       ###########
`,
};
