// Nivel 17 — 17 años: Selectividad y biblioteca. 17 velas. Foco: TODAS las mecánicas juntas y un laberinto.
// Tramos: (1) el laberinto de estanterías: cuatro pisos, escaleras de nubes, callejones sin salida,
// suelo falso, caja y el «temario», una pared gigante que es falsa | (2) la sala de estudio: puente de
// plataformas musicales, campanas en repisas (una sobre escalera musical, otra temporizada, otra con caja),
// metrónomo desafinado | (3) el examen: plataformas temporizadas con notificaciones, montón de exámenes
// (bloqueador), gravedad invertida con controles invertidos y huecos al cielo, plataformas que caen |
// (4) la nota: escape por el pasillo de abajo huyendo de la marea de apuntes (peligro que avanza), con
// dos puertas-melodía (campanas y teclas) y plataformas que caen.
// Foto: en el centro del laberinto (piso 2 izquierdo, sobre pinchos con plataformas temporizadas).
// Objeto (auriculares): sala secreta tras una puerta de melodía oculta (teclas en el estante alto).
// Broma: el temario. Miriam: en el laberinto, en la sala de estudio y al empezar la escapada.
// Sin mundos A/B: cantar sirve para campanas, plataformas musicales y enemigos.
export default {
  props: { tema: 'biblioteca', edad: 17, gafas: true },
  leyenda: {
    H: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'fantasma' },
    w: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    W: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    '^': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 2 },
    u: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h', modo: 'aparece' },
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 1400, desfase: 0 },
    y: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 1400, desfase: 2100 },
    r: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1800, off: 1400, desfase: 1000 },
    T: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 2000, off: 1500, estilo: 'solido' },
    M: { tipo: 'miriam', pista: 'perdi' },
    N: { tipo: 'miriam', pista: 'estudio' },
    L: { tipo: 'miriam', pista: 'nota' },
    i: { tipo: 'cartel', pista: 'temario' },
    n: { tipo: 'cartel', pista: 'atajo' },
    o: { tipo: 'cartel', pista: 'nada' },
    h: { tipo: 'cartel', pista: 'silencio' },
    f: { tipo: 'cartel', pista: 'examen' },
    g: { tipo: 'cartel', pista: 'aprobada' },
    m: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 3, velocidad: 70 },
    z: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 2, velocidad: 40, canto: 'invertir' },
    E: { tipo: 'enemigo', clase: 'bloqueador', sprite: 'examenes', canto: 'apartar' },
    1: { tipo: 'campana', nota: 'C5', grupo: 'sala' },
    2: { tipo: 'campana', nota: 'E5', grupo: 'sala' },
    3: { tipo: 'campana', nota: 'G5', grupo: 'sala' },
    4: { tipo: 'campana', nota: 'A5', grupo: 'sala' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'sala', secuencia: 'A5,C5,E5,G5', h: 3 },
    k: { tipo: 'tecla', capa: 'solidos', nota: 'D5', grupo: 'secreto' },
    l: { tipo: 'tecla', capa: 'solidos', nota: 'F5', grupo: 'secreto' },
    j: { tipo: 'tecla', capa: 'solidos', nota: 'A5', grupo: 'secreto' },
    Q: { tipo: 'puerta', capa: 'solidos', grupo: 'secreto', secuencia: 'A5,D5,F5', oculta: true, h: 3 },
    5: { tipo: 'campana', nota: 'C5', grupo: 'nota1' },
    6: { tipo: 'campana', nota: 'E5', grupo: 'nota1' },
    R: { tipo: 'puerta', capa: 'solidos', grupo: 'nota1', secuencia: 'E5,C5', h: 3 },
    a: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'C5', grupo: 'nota2' },
    b: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'D5', grupo: 'nota2' },
    c: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'E5', grupo: 'nota2' },
    d: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'F5', grupo: 'nota2' },
    e: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'G5', grupo: 'nota2' },
    U: { tipo: 'puerta', capa: 'solidos', grupo: 'nota2', secuencia: 'G5,E5,C5', h: 3 },
  },
  objetos: [
    // el examen: gravedad invertida (con controles invertidos en el centro) y un aviso
    { tipo: 'gravedad', x: 158, y: 0, w: 20, h: 17, factor: -1 },
    { tipo: 'invertir', x: 171, y: 0, w: 7, h: 17 },
    { tipo: 'aviso', x: 152, y: 12, w: 2, h: 6, pista: 'vuelta', duracion: 2600 },
    // la nota: la marea de apuntes espera en el foso de las plataformas que caen y avanza por el pasillo de abajo
    { tipo: 'peligro-movil', x: 184, y: 20, w: 2, h: 6, dir: 'derecha', velocidad: 100, desdeX: 196, margen: 6, color: '#e8ecf8', danio: 2 },
    // notificaciones del móvil
    { tipo: 'enemigo', x: 60, y: 10, clase: 'volador', sprite: 'notificacion', rango: 3, velocidad: 60, amplitud: 1 },
    { tipo: 'enemigo', x: 34, y: 9, clase: 'volador', sprite: 'notificacion', rango: 3, velocidad: 50, amplitud: 1 },
    { tipo: 'enemigo', x: 144, y: 12, clase: 'volador', sprite: 'notificacion', rango: 2, velocidad: 60, amplitud: 1 },
    { tipo: 'enemigo', x: 150, y: 12, clase: 'volador', sprite: 'notificacion', rango: 2, velocidad: 50, amplitud: 1, periodo: 1400 },
    { tipo: 'enemigo', x: 175, y: 11, clase: 'volador', sprite: 'notificacion', rango: 3, velocidad: 50, amplitud: 1 },
  ],
  mapa: `
################################################################################                                                 #                                                                                                                       #
#                                           ####                                                                                 #                                                                                                                       #
#                                           ####                                                                                 #                                                                                                                       #
#                                           ####                                                                                 #                                                                                                                       #
#                                           ####                                                                                 ###########                                                                                                             #
#                                           ####                                                                                           #                                                                                                             #
#                             o             ####                                  C h                                                      #                                                                                                             #
####==############################################==########tt yy ####################                                           Q   O     #                                                                                                             #
#   ==                                    HHHHHH  ==                           #######  uuu                                #k#l#j###########                                                                                                             #
#                                         HHHHHH                               #######       uuu                  2    3           #                          ########TTT###  ####                                                                       #
#   ==                                    HHHHHH  ==                           #######            uuu                    ==  4     #                                                                                                                     #
#                                         HHHHHH                               #######                    1                        #                                                                                                                     #
#   ==                       tt yy rr     HHHHHH  ==                           #######                                TTT          #                                                                                                                     #
#                           wwwwwwwwww  F HHHHHH          ^^^   ^^             #######                           uuu        ===    #                                                                                                                     #
#########################==###############HHHHHH######################==##############                   ===                       #                                                                                                                     #
#                                         HHHHHH                      ==       #######                       uuu                                                                                                                                         #
#                        ==               HHHHHH                               #######                                                                                                                                                                   #
#                                         HHHHHH                      ==       #######                 N            z    B         P  C f                  E    WWWWWWWWWWWWWWWWWW             C L                                                       #
#                                         HHHHHH                               #######                #####################################  tt  yy  rr #############################vvv  vvv #####  #####################################################
#                                         HHHHHH                      ==       #######                #####################################             #############################         #####  #####################################################
#                  B             m     i  HHHHHH   C                           #######                #####################################             #############################         #####          #                          #                #
##########==#############################################XXXX###############==########                #####################################             #############################         #####          #                          #                #
#         ==                   #                                            == #######                #####################################             #############################         #####    5  6  #                          #                #
#                              #                                               #######                #####################################             #############################         #####                                                      #
#         ==                   #                                            == #######                #####################################             #############################         #####                                                      #
# S   M                     n  #                    ^^^^^^^^^^^^^^^            #######wwwwwwwwwwwwwwww#####################################wwwwwwwwwwwww#############################wwwwwwwww#####          R                          U   WWW    g  G  #
############################################################################################################################################################################################################### vvv vvv vvv #aabbccddee###################
###############################################################################################################################################################################################################             ##############################
`,
};
