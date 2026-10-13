// Nivel 18 — 18 años: la universidad (Informática) y el gran concierto. El nivel más difícil y el final abierto (SPEC §7).
// El escenario se va alternando (zonas 'fondo'): facultad → sala de conciertos (col. 57) → facultad (col. 120) →
// sala de conciertos (col. 196). Los carteles E e I marcan los dos primeros cambios.
// Tramos: (1) la facultad: caja + doble salto, foso de pinchos de 3 velas, plataformas que caen y aviones de papel;
// (2) la sala de conciertos: plataformas a ritmo, una mochila y la melodía más larga del juego, «Cumpleaños feliz»
// entera (sol sol la sol do si · sol sol la sol re do: 12 notas), con un despertador rondando las campanas;
// (3) la facultad: la clase de Física, gravedad invertida por el techo, luces temporizadas y un suelo «seguro»;
// (4) el escenario: nubes pequeñas sobre el abismo con aviones y notificaciones; aquí caer cuesta 3 velas.
// Donde debería estar la meta empieza la zona 'final': camino blanco, «Continuará...» y la tarta.
// Sin foto (aún no hay foto de los 18). Objeto (portátil): en una repisa escondida en el foso del tramo 2.
export default {
  props: { tema: 'universidad', edad: 18 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'inicio' },
    N: { tipo: 'miriam', pista: 'melodia' },
    R: { tipo: 'miriam', pista: 'ultimo' },
    Q: { tipo: 'cartel', pista: 'seguro' },
    E: { tipo: 'cartel', pista: 'sala' },
    I: { tipo: 'cartel', pista: 'facultad' },
    '%': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    '^': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    m: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 1, velocidad: 70 },
    z: { tipo: 'enemigo', clase: 'desafinado', sprite: 'despertador', rango: 1, velocidad: 30 },
    a: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', amplitud: 1.5, rango: 3, velocidad: 70, periodo: 2200 },
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 0 },
    u: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 2 },
    w: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1100, desfase: 0 },
    y: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1100, desfase: 1300 },
    g: { tipo: 'campana', nota: 'G4', grupo: 'feliz' },
    h: { tipo: 'campana', nota: 'A4', grupo: 'feliz' },
    k: { tipo: 'campana', nota: 'C5', grupo: 'feliz' },
    j: { tipo: 'campana', nota: 'B4', grupo: 'feliz' },
    l: { tipo: 'campana', nota: 'D5', grupo: 'feliz' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'feliz', secuencia: 'G4,G4,A4,G4,C5,B4,G4,G4,A4,G4,D5,C5', h: 3 },
  },
  objetos: [
    // la facultad y la sala de conciertos se van turnando
    { tipo: 'fondo', x: 57, y: 0, w: 1, h: 1, tema: 'escenario' },
    { tipo: 'fondo', x: 120, y: 0, w: 1, h: 1, tema: 'universidad' },
    { tipo: 'fondo', x: 196, y: 0, w: 1, h: 1, tema: 'escenario' },
    { tipo: 'gravedad', x: 137, y: 0, w: 35, h: 13, factor: -1 },
    { tipo: 'final', x: 262, y: 9, w: 2, h: 4 },
    // el último tramo: caer al abismo cuesta 3 velas
    { tipo: 'muerte', x: 207, y: 15, w: 50, h: 1, danio: 3 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 190, y: 6, velocidad: 80, rango: 3, amplitud: 1, periodo: 1400 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'notificacion', x: 230, y: 5, velocidad: 90, rango: 4, amplitud: 1, periodo: 1300 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 214, y: 8, velocidad: 70, rango: 3, amplitud: 1.5, periodo: 2000 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', x: 246, y: 6, velocidad: 80, rango: 3, amplitud: 1.5, periodo: 1800 },
  ],
  mapa: `
#                                                                                                                     #                 ############   #######   ###########
#                                                                                                                     #                 ############   #######   ###########
#                                                                                                                 l   #                 ############   #######   ###########
#                                                                                                                     #                                                                  
#                                                                                                                ===  #                                                               =====
#                                                                                                                     #                                                                                                                a
#                                                    a                                                     k          #                                                                                                                             a
#                                                                                                        =====        #                                                                     ==                             a                    ==
#                   #####                      a                                                                      #                                                                                                             ==
#                   #####                                                                            h                #                                                                                                 ==                                 ==
#                   #####                                                                          =====                                                                        www  yyy  www                                             ==          ==
#                   #####               vv   vv   vv   vv                                                                                                                                                         ==          ==
# S  M      B       #####                                    Cm    ttt   uuu   ttt   uuu       g  N       z      j    P   C                %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                     Q       C  R
#########################         ####                    #######            O               ##################################################################################                 ##XXX##########                                                 ##################################
#########################%%%%%%%%%####                    #######           ##               ##################################################################################%%%%%%%%%%%%%%%%%##   ##########                                                 ##################################
######################################                    #######                            #####################################################################################################^^^##########                                                 ##################################
`,
};
