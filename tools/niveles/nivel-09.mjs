// Nivel 9 — 9 años: el conservatorio. Foco: melodías largas bajo presión.
// El conservatorio tiene dos pisos. Tramo 1 (arriba): pasillo de campanas
// «do-re-mi-fa-sol» con las campanas desordenadas, y la broma de las dos puertas («mi-re-do-re-mi»: la que
// enseña las notas no se abre nunca; se abre la de encima). Tramo 2 (abajo): la sala
// de ensayo (se baja por el hueco del final), «Para Elisa» (9 notas) mientras la profe de solfeo con prisa
// (peligro que avanza por la franja del piso de abajo, filas 21-33) te pisa los talones.
// Tramo 3: escalera de teclas, «do-mi-sol-do» saltándose las teclas equivocadas por las nubes temporizadas.
// Tramo 4: la audición, «Oda a la alegría» (7 notas) con campanas en lo alto a las que se llega por plataformas musicales (cantar cerca de una campana la hace sonar).
// Foto: al salir de la sala, un desvío de vuelta por lo alto de la sala, hacia la profe que avanza.
// Objeto (metrónomo): en la taquilla del conserje, tras una puerta oculta de 5 notas («sol-mi-do-mi-sol», con las campanas del tramo 1).
export default {
  props: { tema: 'conservatorio' },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'audicion' },
    K: { tipo: 'cartel', pista: 'taquilla' },
    L: { tipo: 'cartel', pista: 'puerta' },
    Z: { tipo: 'meta' },
    // tramo 1 (grupo g1): campanas do re mi fa sol
    c: { tipo: 'campana', nota: 'C5', grupo: 'g1' },
    d: { tipo: 'campana', nota: 'D5', grupo: 'g1' },
    e: { tipo: 'campana', nota: 'E5', grupo: 'g1' },
    f: { tipo: 'campana', nota: 'F5', grupo: 'g1' },
    g: { tipo: 'campana', nota: 'G5', grupo: 'g1' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'g1', secuencia: 'C5,D5,E5,F5,G5', h: 3 },
    Y: { tipo: 'puerta', capa: 'solidos', grupo: 'g1', secuencia: 'G5,E5,C5,E5,G5', oculta: true, h: 3 },
    t: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1300, off: 1700 },
    // la broma (grupo g2): mi re do re mi. La puerta A no escucha a nadie; la Q (encima, oculta) sí.
    1: { tipo: 'campana', nota: 'C5', grupo: 'g2' },
    2: { tipo: 'campana', nota: 'D5', grupo: 'g2' },
    3: { tipo: 'campana', nota: 'E5', grupo: 'g2' },
    A: { tipo: 'puerta', capa: 'solidos', grupo: 'nadie', secuencia: 'E5,D5,C5,D5,E5', h: 3 },
    Q: { tipo: 'puerta', capa: 'solidos', grupo: 'g2', secuencia: 'E5,D5,C5,D5,E5', oculta: true, h: 3 },
    // tramo 2 (grupo elisa): mi re# mi re# mi si re do la
    4: { tipo: 'campana', nota: 'E5', grupo: 'elisa' },
    5: { tipo: 'campana', nota: 'D#5', grupo: 'elisa' },
    6: { tipo: 'campana', nota: 'B4', grupo: 'elisa' },
    7: { tipo: 'campana', nota: 'D5', grupo: 'elisa' },
    8: { tipo: 'campana', nota: 'C5', grupo: 'elisa' },
    9: { tipo: 'campana', nota: 'A4', grupo: 'elisa' },
    R: { tipo: 'puerta', capa: 'solidos', grupo: 'elisa', secuencia: 'E5,D#5,E5,D#5,E5,B4,D5,C5,A4', h: 3 },
    // tramo 3 (grupo escalera): do mi sol do
    h: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'C4', grupo: 'escalera' },
    i: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'D4', grupo: 'escalera' },
    j: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'E4', grupo: 'escalera' },
    k: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'F4', grupo: 'escalera' },
    l: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'G4', grupo: 'escalera' },
    n: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'A4', grupo: 'escalera' },
    o: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'B4', grupo: 'escalera' },
    q: { tipo: 'tecla', capa: 'solidos', w: 2, nota: 'C5', grupo: 'escalera' },
    x: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 1500, off: 1500 },
    y: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', on: 2200, off: 1400, desfase: 700 },
    T: { tipo: 'puerta', capa: 'solidos', grupo: 'escalera', secuencia: 'C4,E4,G4,C5', h: 3 },
    w: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', rango: 4, amplitud: 1, periodo: 2000, velocidad: 60 },
    // tramo 4 (grupo audicion): mi mi fa sol sol fa mi
    E: { tipo: 'campana', nota: 'E5', grupo: 'audicion' },
    G: { tipo: 'campana', nota: 'F5', grupo: 'audicion' },
    H: { tipo: 'campana', nota: 'G5', grupo: 'audicion' },
    z: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h', modo: 'aparece' },
    p: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', rango: 3, amplitud: 1.5, periodo: 2400, velocidad: 50 },
    U: { tipo: 'puerta', capa: 'solidos', grupo: 'audicion', secuencia: 'E5,E5,F5,G5,G5,F5,E5', h: 3 },
  },
  objetos: [
    // la profe de solfeo con prisa: espera dentro de la pared y avanza por el piso de abajo en cuanto entras
    // en la sala de ensayo; los tramos 3 y 4 están por encima de su franja
    { tipo: 'peligro-movil', x: 60, y: 21, w: 4, h: 13, dir: 'derecha', velocidad: 90, desdeX: 79, margen: 12, color: '#ff8fb1' },
  ],
  mapa: `
#######################################################################    ###########################################################                                              #                                          #          #
#######################################################################    ###########################################################                                              #                                          #          #
#######################################################################    ###########################################################                                              #                                          #          #
#      #                                      #                #           ###########################################################                                              #                                          #          #
#      #                                      #                #           ###########################################################                                              #                                          #          #
#      #                                      #                #           ###########################################################                                              #                                          #          #
#      #  O  Y                                #                #           ###########################################################                                              #                                 H        #          #
#      ########                               #                            ###########################################################                                   w          #                                ###       #          #
#                                    d        #                            ###########################################################                                              #                                          #          #
#                tt                 ###       #                Q           ###########################################################                                                                            zz           #          #
#                               g                           ### #######    ###########################################################                                  yyyyyy                                G                #          #
#                              ###                              #######    ###########################################################                                              T                        ###               #          #
# S  M          K     e    c   ###        f   P   1   2   3  L A#######    ###########################################################                               l  n  o  q ###########                              p     #          #
#######################################################################    ###########################################################                                                                    zz                              #
#######################################################################    ###########################################################                         xx k                        ===                                            #
#######################################################################    ###########################################################                                                        C  N    E                        U     Z    #
#######################################################################    ###########################################################                      j                             #################################################
#######################################################################    ###########################################################                                                    #################################################
#######################################################################    ###########################################################                xx i                                #################################################
#######################################################################    ###########################################################         C                                          #################################################
#######################################################################    ###########################################################      #######h                                      #################################################
#######################################################################                                                                                                                   #################################################
#######################################################################                                                                  ===                                              #################################################
#######################################################################                                                                                                                   #################################################
#######################################################################                                                                                                                   #################################################
#######################################################################                                             F                 ===                                                 #################################################
#######################################################################                                           ===== ===== #=====                                                      #################################################
#######################################################################                                                       #                                                           #################################################
#######################################################################                                                       #          ===                                              #################################################
#######################################################################                          6                            #                                                           #################################################
#######################################################################                         ###             8             #                                                           #################################################
#######################################################################                                        ###                    ===                                                 #################################################
#######################################################################                                                                                                                   #################################################
#######################################################################     C       4    5                7            9      R                                                           #################################################
#####################################################################################################  ###############################                                                    #################################################
#####################################################################################################  ###############################                                                    #################################################
#####################################################################################################  ###############################                                                    #################################################
`,
};
