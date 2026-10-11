// Nivel 18 — 18 años: el gran concierto. El nivel más difícil y el final abierto (SPEC §7).
// Tramos: (1) bastidores: caja + doble salto, foso de pinchos de 3 velas, plataformas que caen y aviones de papel;
// (2) el foso: plataformas a ritmo y la melodía de «Cumpleaños feliz» con campanas (sol sol la sol do si);
// (3) el escenario: gravedad invertida por el techo, luces temporizadas y un suelo «seguro»;
// (4) el último tramo: nubes pequeñas sobre el abismo con aviones de papel.
// Donde debería estar la meta empieza la zona 'final': camino blanco, «Continuará...» y la tarta.
// Foto: en el palco (sobre las luces temporizadas). Objeto: en una repisa escondida en el foso del tramo 2.
export default {
  props: { tema: 'escenario', edad: 18 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'inicio' },
    N: { tipo: 'miriam', pista: 'melodia' },
    R: { tipo: 'miriam', pista: 'ultimo' },
    Q: { tipo: 'cartel', pista: 'seguro' },
    '%': { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    a: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', amplitud: 1.5, rango: 3, velocidad: 70, periodo: 2200 },
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 0 },
    u: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 2 },
    w: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1100, desfase: 0 },
    y: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1100, desfase: 1300 },
    g: { tipo: 'campana', nota: 'G4', grupo: 'feliz' },
    h: { tipo: 'campana', nota: 'A4', grupo: 'feliz' },
    k: { tipo: 'campana', nota: 'C5', grupo: 'feliz' },
    j: { tipo: 'campana', nota: 'B4', grupo: 'feliz' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'feliz', secuencia: 'G4,G4,A4,G4,C5,B4', h: 3 },
  },
  objetos: [
    { tipo: 'gravedad', x: 137, y: 0, w: 35, h: 13, factor: -1 },
    { tipo: 'final', x: 262, y: 9, w: 2, h: 4 },
  ],
  mapa: `
#                                                                                                                     #                 ############   #######   ###########
#                                                                                                                     #                 ############   #######   ###########
#                                                                                                                     #                 ############   #######   ###########
#                                                                                                                     #                                                                 F
#                                                                                                                     #                                                               =====
#                                                                                                                     #                                                                                                                a
#                                                    a                                                     k          #                                                                                                                             a
#                                                                                                        =====        #                                                                     ==                             a                    ==
#                   #####                      a                                                                      #                                                                                                             ==
#                   #####                                                                            h                #                                                                                                 ==                                 ==
#                   #####                                                                          =====                                                                        www  yyy  www                                             ==          ==
#                   #####               vv   vv   vv   vv                                                                                                                                                         ==          ==
# S  M      B       #####                                    C     ttt   uuu   ttt   uuu       g  N              j    P   C                %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                     Q       C  R
#########################         ####                    #######            O               ##################################################################################                 ##XXX##########                                                 ##################################
#########################%%%%%%%%%####                    #######           ##               ##################################################################################%%%%%%%%%%%%%%%%%##   ##########                                                 ##################################
######################################                    #######                            #####################################################################################################^^^##########                                                 ##################################
`,
};
