// Nivel 1 — 1 año: el parque. Ya anda de pie. Foco: saltos precisos y primer enemigo. 1 vela.
// Tramos: (1) el arenero | (2) los columpios (plataformas móviles) | (3) patos y cochecitos | (4) el tobogán.
// Foto: sobre el columpio más alto (hay que saltar en lo alto de su recorrido).
// Objeto (sonajero): en la cornisa bajo el tobogán; se llega dejándose caer con precisión por el borde.
// Broma: el cochecito «aparcado» que da vueltas sin parar en una plataforma minúscula.
export default {
  props: { tema: 'parque', edad: 1 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'columpio', radio: 200 },
    p: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 3, velocidad: 60 },
    c: { tipo: 'enemigo', clase: 'patrullero', sprite: 'cochecito', rango: 4, velocidad: 95 },
    k: { tipo: 'enemigo', clase: 'patrullero', sprite: 'cochecito', velocidad: 80 },
    1: { tipo: 'cartel', pista: 'arenero' },
    2: { tipo: 'cartel', pista: 'aparcado' },
    3: { tipo: 'cartel', pista: 'patos' },
    4: { tipo: 'cartel', pista: 'tobogan' },
  },
  objetos: [
    // columpios: van y vienen (x, y = esquina superior izquierda, en casillas)
    { tipo: 'plataforma-movil', x: 60, y: 12, w: 3, h: 1, dx: 6, duracion: 2200 },
    { tipo: 'plataforma-movil', x: 75, y: 10, w: 3, h: 1, dx: 5, duracion: 2000, desfase: 700 },
    { tipo: 'plataforma-movil', x: 89, y: 10, w: 3, h: 1, dx: 4, duracion: 1800, desfase: 400 },
    // el columpio más alto: la foto está sobre el final de su recorrido
    { tipo: 'plataforma-movil', x: 89, y: 6, w: 2, h: 1, dx: 6, duracion: 1700 },
  ],
  mapa: `
#                                                                                                                                                                                                                  #
#                                                                                                                                                                                                                  #
#                                                                                                F                                                                                                                 #
#                                                                                                                                                                                                                  #
#                                                                                                                                                                         ########                                 #
#                                                                                                                                                                         ##                                       #
#                                                                                                                                                                       ####         ####                          #
#                                                                                                                                                                       ####                                       #
#                                                                                   #####                                                                             ######               vvvv                    #
#                                                                                                                                                                     ######     O   =====                         #
#             ###                ##                                                                                               k           p                     ########    ###               ####             #
# S M  1  ##  ###      ##   ###  ##     ^^          C   N                                              C  3  p         c       2 ###        =====      p    c   C 4 ########                                 G     #
###################  #####  #######   ########   ###########           ###                       ################  #########  ######   ###         ##########################                          #############
###################  #####  #######   ########   ###########           ###                       ################  #########  ######   ###         ##########################                          #############
###################  #####  #######   ########   ###########           ###                       ################  #########  ######   ###         ##########################                          #############
`,
};
