// Nivel 10 — 10 años: la ciudad de noche. Foco: peligros de 2 velas y plataformas temporizadas.
// Tramos: (1) azoteas con farolas temporizadas y el semáforo | (2) carteles luminosos sobre pinchos de 2 velas
// | (3) aviones de papel entre azoteas | (4) carrera por los cables con plataformas que caen.
// Foto: en la azotea de la torre, encadenando tres farolas (p, q, k). Objeto: en el callejón bajo el cable,
// entre pinchos de 2 velas. Broma: el semáforo para peatones (r) casi siempre está en rojo.
// Temporizadas: a/b se alternan (ciclo 3 s); d/e/f se encienden en ola, de izquierda a derecha (ciclo 2,7 s); p/q/k suben en cadena.
export default {
  props: { tema: 'ciudad-noche' },
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
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 163, y: 6, velocidad: 60, rango: 2, amplitud: 1.5, periodo: 1700, eliminable: 'salto', canto: 'dormir' },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 176, y: 5, velocidad: 70, rango: 2, amplitud: 2, periodo: 1500, eliminable: 'salto', canto: 'dormir' },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 189, y: 4, velocidad: 60, rango: 2, amplitud: 2.5, periodo: 1900, eliminable: 'salto', canto: 'dormir' },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 201, y: 4, velocidad: 60, rango: 3, amplitud: 1, periodo: 1300, eliminable: 'salto', canto: 'dormir' },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 248, y: 5, velocidad: 60, rango: 2, amplitud: 2, periodo: 1600, eliminable: 'salto', canto: 'dormir' },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 264, y: 6, velocidad: 60, rango: 2, amplitud: 2.5, periodo: 2200, eliminable: 'salto', canto: 'dormir', escala: 1.4, danio: 2 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 277, y: 4, velocidad: 80, rango: 2, amplitud: 1.5, periodo: 1400, eliminable: 'salto', canto: 'dormir' },
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
#############      ###########          #############      #####################WWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWW######WWWWWWWWWWWWWWWWWWWWWWWWWWW############     ########     ########     #####   O     #####################                                                       ###########
#############      ###########          #############      ######################################################################################################     ########     ########     #####WWW##WWWW#####################                                                       ###########
#############      ###########          #############      ######################################################################################################     ########     ########     ###################################                                                       ###########
`,
};
