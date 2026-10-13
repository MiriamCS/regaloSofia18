// Nivel 6 — 6 años: el primer cole. Se desbloquea CANTAR (tecla de la nota). 6 velas.
// Tramos: (1) el patio: plataformas musicales que solo existen si les cantas cerca
//         | (2) el pasillo: puertas-melodía de 2 y 3 notas (Simón dice) con campanas
//         | (3) mochilas dormilonas sobre pinchos (cantar las duerme), el profe que se aparta al cantarle
//           y el profe dormilón (broma: se duerme justo delante de la salida y hay que dar la vuelta por arriba)
//         | (4) el aula: puerta de 4 notas con las campanas en salientes sobre pinchos, a distintas alturas.
// Foto: en lo alto de la cadena de plataformas musicales del patio (col. 34-45).
// Objeto (mochila): en el armario de la puerta-melodía oculta (sin notas a la vista; el cartel da la adivinanza:
// de la campana más alta a la más baja; la más alta solo suena cantando en lo alto de un doble salto).
// Ojo: cantar cerca de una campana siempre la hace sonar; cada campana está lejos (>190 px) de las demás.
// Monstruo nuevo: el bolígrafo gigante del profe (se presenta en el cartel 5, antes del primero).
export default {
  props: { tema: 'colegio', edad: 6 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'cantar' },
    N: { tipo: 'miriam', pista: 'pasillo' },
    L: { tipo: 'miriam', pista: 'aula' },
    n: { tipo: 'plataforma-musical', capa: 'solidos', fusion: 'h', modo: 'aparece' },
    a: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', rango: 3, amplitud: 1, periodo: 1700, velocidad: 70 },
    b: { tipo: 'enemigo', clase: 'patrullero', sprite: 'mochila', rango: 2, velocidad: 75, canto: 'dormir' },
    T: { tipo: 'enemigo', clase: 'bloqueador', sprite: 'boligrafo', canto: 'apartar' },
    Z: { tipo: 'enemigo', clase: 'bloqueador', sprite: 'boligrafo', canto: 'dormir' },
    // pasillo: puerta 1 (sol, do) y puerta 2 (mi, la, re)
    c: { tipo: 'campana', nota: 'C5', grupo: 'p1' },
    g: { tipo: 'campana', nota: 'G5', grupo: 'p1' },
    P: { tipo: 'puerta', capa: 'solidos', grupo: 'p1', secuencia: 'G5,C5', h: 3 },
    e: { tipo: 'campana', nota: 'E5', grupo: 'p2' },
    A: { tipo: 'campana', nota: 'A5', grupo: 'p2' },
    D: { tipo: 'campana', nota: 'D5', grupo: 'p2' },
    Q: { tipo: 'puerta', capa: 'solidos', grupo: 'p2', secuencia: 'E5,A5,D5', h: 3 },
    // aula: do, mi, sol, do agudo
    k: { tipo: 'campana', nota: 'C5', grupo: 'aula' },
    E: { tipo: 'campana', nota: 'E5', grupo: 'aula' },
    q: { tipo: 'campana', nota: 'G5', grupo: 'aula' },
    K: { tipo: 'campana', nota: 'C6', grupo: 'aula' },
    R: { tipo: 'puerta', capa: 'solidos', grupo: 'aula', secuencia: 'C5,E5,G5,C6', h: 3 },
    // armario secreto: de la campana más alta a la más baja (la, fa, re)
    d: { tipo: 'campana', nota: 'D5', grupo: 'armario' },
    f: { tipo: 'campana', nota: 'F5', grupo: 'armario' },
    h: { tipo: 'campana', nota: 'A5', grupo: 'armario' },
    U: { tipo: 'puerta', capa: 'solidos', grupo: 'armario', secuencia: 'A5,F5,D5', oculta: true, h: 3 },
    1: { tipo: 'cartel', pista: 'musical' },
    2: { tipo: 'cartel', pista: 'profe' },
    3: { tipo: 'cartel', pista: 'armario' },
    4: { tipo: 'cartel', pista: 'recreo' },
    5: { tipo: 'cartel', pista: 'boligrafo' },
  },
  mapa: `
#                                                                           #                      #                                  #########                                                                    #                                     #
#                                                                           #                      #                                  #########                                                                    #                                     #
#                                  F                                        #                      #                                  #########                                                                    #                                     #
#                                 ===                                       #                      #                                  #########                                                 q                  #                    h                #
#                                        nn                                 #                      #                                  #########                                                ###                 #                                     #
#                                                                           #           A          #                        a         #########            ###########                                             #                                     #
#                                                      a                    #           ##         #                                  #########            ###########                 E  nn                       #           f                         #
#                                           nn                              #                      #                                  #########         nn ###########                ###               K          #                                     #
#                                                                           #                      #                     b            #########            ###########                                 ###         #        ########                     #
#                                                        nn                         nn                            b    ####    b                     nn                                                                            #                     #
#                        nn              nn          nn                                                         ####          ###                                                 nn                                     ##        #                     #
#  S   M        1    nn                  ^^^                   C N  c   g   P    e             D   Q   C                             5    T       b          2   Z       C L   k                                   R 3 d ## U    O #            4    G   #
###################            ###################            ########################^^^^^^#####################^^^^^^^^^^^^^^##########################################################^^^^^^^^^^^^^^^##################################################
###################            ###################            ############################################################################################################################################################################################
###################            ###################            ############################################################################################################################################################################################
`,
};
