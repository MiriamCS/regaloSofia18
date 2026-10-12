// Nivel 7 — 7 años: la clase de música. Foco: teclas de piano gigantes (suelo que suena y abre caminos).
// Tramos: (1) teclado-escalera y la puerta «sol-mi-do» (hay que tocarla al revés) | (2) el himno de la alegría:
// la puerta se abre... y es un armario con un metrónomo; la segunda mitad del himno abre el fondo del armario
// | (3) «teclas» que se hunden sobre pinchos, plataformas musicales y metrónomos desafinados (no cantes cerca)
// | (4) el gran piano: teclas en dos alturas. «Estrellita» (do do sol sol la la) abre la salida;
// «Cumpleaños feliz» (sol sol la sol do si) abre la puerta secreta de arriba, donde está la foto.
// Foto: en el cuarto encima del gran piano (melodía secreta). Objeto: en el foso del piano, entre pinchos.
// Broma: el armario del metrónomo. Las teclas que se hunden son plataformas 'hunde' (no hay teclas que se hundan).
export default {
  props: { tema: 'clase-musica' },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'piano' },
    1: { tipo: 'cartel', pista: 'teclas' },
    6: { tipo: 'cartel', pista: 'metronomo' },
    // tramo 1 (grupo t1)
    c: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'C4', grupo: 't1' },
    d: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'D4', grupo: 't1' },
    e: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'E4', grupo: 't1' },
    f: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'F4', grupo: 't1' },
    g: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'G4', grupo: 't1' },
    a: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'A4', grupo: 't1' },
    k: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'C5', grupo: 't1' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 't1', secuencia: 'G4,E4,C4', h: 3 },
    p: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', rango: 3, amplitud: 1.2, periodo: 2200, velocidad: 55 },
    // tramo 2 (grupo himno): mi mi fa sol | sol fa mi re
    5: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'D4', grupo: 'himno' },
    2: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'E4', grupo: 'himno' },
    3: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'F4', grupo: 'himno' },
    4: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'G4', grupo: 'himno' },
    z: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h', modo: 'aparece' },
    m: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 3, velocidad: 40 },
    l: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 1, velocidad: 40 },
    n: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', rango: 1, velocidad: 50, escala: 1.15, eliminable: 'salto,caja' },
    Q: { tipo: 'puerta', capa: 'solidos', grupo: 'himno', secuencia: 'E4,E4,F4,G4', h: 3 },
    R: { tipo: 'puerta', capa: 'solidos', grupo: 'himno', secuencia: 'G4,F4,E4,D4', h: 3 },
    // tramo 3
    h: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 3, velocidad: 55 },
    // tramo 4 (grupo piano)
    q: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'C4', grupo: 'piano' },
    w: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'D4', grupo: 'piano' },
    r: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'E4', grupo: 'piano' },
    t: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'F4', grupo: 'piano' },
    y: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'G4', grupo: 'piano' },
    u: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'A4', grupo: 'piano' },
    i: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'B4', grupo: 'piano' },
    o: { tipo: 'tecla', capa: 'solidos', fusion: 'h', nota: 'C5', grupo: 'piano' },
    T: { tipo: 'puerta', capa: 'solidos', grupo: 'piano', secuencia: 'G4,G4,A4,G4,C5,B4', oculta: true, h: 3 },
    U: { tipo: 'puerta', capa: 'solidos', grupo: 'piano', secuencia: 'C4,C4,G4,G4,A4,A4', h: 3 },
  },
  objetos: [
    { tipo: 'aviso', x: 99, y: 8, w: 4, h: 4, pista: 'armario', duracion: 3500 },
  ],
  mapa: `
#                                                               #                                 ######                                                                                                        #                          #
#                                                               #                                 ######                                                                                                        #                          #
#                                                               #                                 ######                                                                                ########                #                          #
#                                                               #                                 ######                                                                                #                       #                          #
#                                                               #                                 ######                                                                                #                       #                          #
#                                   p                           #                                 ######                                            p                                   # F    T                #                          #
#                                                               #                                 ######                                                                                ########=========                                  #
#                   gg####                                      #                          44     ######                                        zz                                                                                         #
#                 ff######  kk                                  #                                 #    #                           l        zz       ######                                                     U                          #
#               ee########       aa    ff                                                                                         ########           ######                         ============yy uu ii oo ###########                    #
#             dd##########                  dd                                        zzz                               zzz   hh  ########                   hhh                                            ###########                    #
# S  M   1  cc############                                      P   C  6                 m        Q n  R      C    hhh                                                    C   N                      O      ###########             G      #
##########################^^^^^^^^^^^^^^^^^^^^^^####cc##ee##gg##############55#22#33#############################^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^###############qq ww rr tt        #      ################################
####################################################################################################################################################################################^##^##^##^^^^^^^^#^^^^^^################################
############################################################################################################################################################################################################################################
`,
};
