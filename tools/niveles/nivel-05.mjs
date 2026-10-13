// Nivel 5 — 5 años: la pista de patinaje sobre ruedas. Primer nivel-trampa: nada es lo que parece. 5 velas.
// Tramos: (1) la salida está al principio... y sale patinando; rampa que se desmorona y pared que no existe
//         | (2) la pista: los bloques con pinta de sólidos (x) se esfuman y las nubes sí aguantan
//         | (3) la zona de saltos: conos «de decoración» (pican) y la caja de los patines de alquiler, que hay
//           que tirar y empujar hasta el muro para subirlo (si se empuja hacia atrás cae al hueco y vuelve)
//         | (4) la salida de mentira: zona de controles invertidos y una segunda meta falsa que se mete en la
//           pared del final... que también es falsa: la meta de verdad está dentro.
// Foto: dentro del montículo del tramo 2 (pared fantasma por la derecha, col. 108-113; la delata una nota dorada).
// Objeto (patines): arriba a la izquierda del inicio, por plataformas que caen al pisarlas y reaparecen, sobre
// pinchos. Las temporizadas no se estrenan hasta el nivel 10.
// Monstruo nuevo: el avión de papel (se presenta en el cartel 7, antes del primero).
export default {
  props: { tema: 'patinaje', edad: 5 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'confia' },
    N: { tipo: 'miriam', pista: 'confiesa' },
    m: { tipo: 'meta-falsa', dx: 24, pista: 'huye' },
    w: { tipo: 'meta-falsa', dx: 9, pista: 'otra' },
    x: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'desaparece', retardo: 280 },
    H: { tipo: 'plataforma-falsa', capa: 'solidos', fusion: 'h', modo: 'fantasma' },
    T: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 450 },
    U: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 450 },
    V: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 450 },
    c: { tipo: 'enemigo', clase: 'patrullero', sprite: 'cochecito', rango: 3, velocidad: 85 },
    a: { tipo: 'enemigo', clase: 'volador', sprite: 'avion-papel', rango: 3, amplitud: 1, periodo: 1600, velocidad: 70 },
    n: { tipo: 'decorado', sprite: 'nota-dorada', escala: 0.6 },
    1: { tipo: 'cartel', pista: 'corto' },
    2: { tipo: 'cartel', pista: 'puente' },
    3: { tipo: 'cartel', pista: 'pared' },
    4: { tipo: 'cartel', pista: 'decoracion' },
    5: { tipo: 'cartel', pista: 'atras' },
    6: { tipo: 'cartel', pista: 'fin' },
    7: { tipo: 'cartel', pista: 'aviones' },
  },
  objetos: [
    // la tarta de mentira: aquí izquierda y derecha van al revés
    { tipo: 'invertir', x: 196, y: 0, w: 33, h: 15 },
    // dentro de paredes fantasma: van aquí para no agujerear el dibujo de la pared
    { tipo: 'foto', x: 109, y: 11 },
    { tipo: 'pinchos', x: 111, y: 11, danio: 1 },
    { tipo: 'meta', x: 241, y: 11 },
  ],
  mapa: `
#                                                                                                                                                                                                                                           HHHHHHHHH#
# O                                                                                                                                                                                                                                         HHHHHHHHH#
# ==                                                                                                                                                                                                                                        HHHHHHHHH#
#                                                                                                                                                                                                                                           HHHHHHHHH#
#      VV                                                                                                                                                                                                                                   HHHHHHHHH#
#                                                                                                                                                                                                                                           HHHHHHHHH#
#                                     HH                                      ===              ==                                                                                                                                           HHHHHHHHH#
#  UU                                 HH                                            ==                   #########                   a                  ###                       a                                                         HHHHHHHHH#
#                                     HH                                                  a              ###HHHHHH                          B           ###                 a                                             a                 HHHHHHHHH#
#       TT                            HH       ##                       ###   xxx        ###   xxx       ###HHHHHH n                      ###           ###                                                  ##                             HHHHHHHHH#
#                                     HH       ##                  ===                                 #####HHHHHH                                      ###                                                  ##                             HHHHHHHHH#
#^^^^^^^^  S  1   m  2             3  HH       ##     c   M  C 7                                       #####HHHHHH        C   4  ^^^^                   ###    ^^  c    ^^              C    N   5           ##          ^^ c          w 6  HHHHHHHHH#
########################xxxxxxx##################################                                    #################################  ###############################################################   #######     #########   ####################
########################       ##################################                                    #################################  ###############################################################   #######     #########   ####################
########################       ##################################                                    #################################  ###############################################################   #######     #########   ####################
`,
};
