// Nivel 15 — 15 años: la audición. 15 velas. Música de la etapa adolescente (120 bpm: un pulso = 0,5 s).
// Foco: ritmo. Casi todas las plataformas van a compás de la música (plataforma-temporizada con ritmo: on/off en pulsos).
// Tramos: (1) entre bastidores: plataformas a negras que se alternan (salta cuando la tuya empieza a parpadear)
// | (2) el foso de la orquesta: un suelo que «late» (desaparece medio pulso cada dos: hay que saltar a compás) y
// plataformas que solo están un pulso de cada dos | (3) el escenario: campanas sobre plataformas que laten;
// la puerta pide mi-sol-la-do (hay una campana «si» de despiste) | (4) la ovación: carrera a ritmo sobre pinchos de 3 velas, con aviones.
// Broma: el metrónomo desafinado no invierte los controles: si le cantas se acelera («cambia el tempo»).
// Foto: en el palco, subiendo por plataformas a contratiempo. Objeto (entrada): en el sótano del escenario, tras
// una pared falsa a la que se llega dejándose caer a una cornisa del foso.
// Miriam: entre bastidores, de cartón porque la de verdad está de Erasmus («cuenta...»), y junto a la puerta, ya de vuelta.
export default {
  props: { tema: 'concierto', edad: 15, gafas: true },
  leyenda: {
    M: { tipo: 'miriam', pista: 'cuenta', sprite: 'carton' }, // la de cartón: la de verdad está de Erasmus
    N: { tipo: 'miriam', pista: 'puerta' },
    // negras: 2 pulsos encendida, 2 apagada; 'a' y 'b' se alternan
    a: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 2, off: 2, desfase: 0 },
    b: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 2, off: 2, desfase: 2 },
    // el suelo que late: 1,5 pulsos sí, medio no ('d' a contratiempo de 'c')
    c: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 1.5, off: 0.5, desfase: 0 },
    d: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 1.5, off: 0.5, desfase: 1 },
    // un pulso sí, uno no (todas a la vez)
    e: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 1, off: 1, desfase: 0 },
    // contratiempo (palco)
    i: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 1, off: 1, desfase: 0.5 },
    // la ovación: suelos sólidos que se van un pulso de cada cuatro
    g: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 0, estilo: 'solido' },
    h: { tipo: 'plataforma-temporizada', capa: 'solidos', fusion: 'h', ritmo: true, on: 3, off: 1, desfase: 2, estilo: 'solido' },
    w: { tipo: 'pinchos', capa: 'zonas', fusion: 'h', danio: 3 },
    H: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'fantasma' },
    k: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', velocidad: 40, rango: 2, canto: 'enfadar' },
    q: { tipo: 'enemigo', clase: 'desafinado', sprite: 'metronomo', velocidad: 35, rango: 1.5, canto: 'enfadar' },
    p: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', velocidad: 80, rango: 3, amplitud: 1, periodo: 2000 },
    r: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', velocidad: 90, rango: 4, amplitud: 0.3, periodo: 1500 },
    5: { tipo: 'campana', nota: 'E5', grupo: 'escenario' },
    6: { tipo: 'campana', nota: 'G5', grupo: 'escenario' },
    7: { tipo: 'campana', nota: 'A5', grupo: 'escenario' },
    8: { tipo: 'campana', nota: 'C6', grupo: 'escenario' },
    9: { tipo: 'campana', nota: 'B5', grupo: 'escenario' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'escenario', secuencia: 'E5,G5,A5,C6', h: 3 },
    1: { tipo: 'cartel', pista: 'metronomo' },
    2: { tipo: 'cartel', pista: 'ovacion' },
  },
  objetos: [
    { tipo: 'aviso', x: 217, y: 0, w: 1, h: 12, pista: 'avisoOvacion', duracion: 2600 },
  ],
  mapa: `
#                                                                                                                                                                                                             #                                                                #
#                                                                                                                                         ######                                                              #                                                                #
#                                                                                                                                         #                                                                   #                                                                #
#                                                                                                                                         #                                                                   #                                                                #
#                                                                                                                                         # F                                                                 #                                                                #
#                                                                                                                                         ######                                  r                           #                                  r                             #
#                                          p                          p                                           p                              ii                                                           #        p                                      p                #
#                                                                                                                               p                    ii                                 9                     #                                  p                             #
#                                  aa                                                      p                                                             ii                 5       6       7       8         #                       p                      p                 #
#                     aa  bb  ##                                                                                ee  ee                                       ii                 bb      bb      bb                                                                             #
#                 bb          ##        bb   aa                                     k             ####  ee  ee          ee                             #################### aa      aa      aa      aa                                                                         #
# S   M       aa              ##                  bb    www k   C  1  cccccccccccc####dddddddddddd####                            k  wwwC              ##                ##                               N   P    C   wwww                                             2  G   #
#############                 ##                       ###############            ####            ####                      #############################        r       HH                             ####################ggghhhggghhh##hhhggghhhggg##ggghhhggghhh############
#############                 ##                       ###############            ####            ####                      ############################# O   q     q    HH                             ####################wwwwwwwwwwww##wwwwwwwwwwww##wwwwwwwwwwww############
#############                 ##                       ###############            ####            ####                      ################################################                            ########################################################################
`,
};
