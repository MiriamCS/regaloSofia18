// Nivel 8 — 8 años: la comunión, en el jardín del banquete. Foco: urracas ladronas y persecución.
// Las urracas (clase 'ladron') roban la foto o el objeto si te tocan y huyen: hay que tocarlas para recuperarlo.
// Tramos: (1) el camino del jardín: la foto sale enseguida (en el tocón) y hay urracas por todo el camino; los muros
// de 3 las acorralan | (2) el estanque: plataformas móviles e islas con urraca y tronco | (3) los árboles del jardín:
// subida vertical por ramas (nubes) con mosquitos y camino por las copas con ramas que se caen | (4) el patio del
// restaurante: urraca rápida que acaba acorralada contra el muro; el muro (4 de alto) se sube cómodo empujando una caja
// hasta él. Las urracas no mueven las cajas: solo Sofía.
// Foto: en el tocón del principio. Objeto (rosario): en la copa más alta, encima del atril de los árboles.
// Broma: la urraca de la rama roba... un calcetín imaginario (zona 'aviso': no hay robos de mentira en el motor).
// Las urracas ya se presentaron en el nivel 2: aquí son más rápidas (huyen más deprisa de lo que anda Sofía) y el
// camino tiene zarzas (pinchos) entre ellas.
export default {
  props: { tema: 'jardin', edad: 8 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'hola' },
    N: { tipo: 'miriam', pista: 'claro' },
    k: { tipo: 'decorado', sprite: 'urraca', escala: 0.5 },
    u: { tipo: 'enemigo', clase: 'ladron', sprite: 'urraca', rango: 3, velocidad: 150 },
    U: { tipo: 'enemigo', clase: 'ladron', sprite: 'urraca', rango: 5, velocidad: 200, escala: 1.15 },
    m: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 2, amplitud: 1, periodo: 1700, velocidad: 50 },
    n: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 3, amplitud: 1.5, periodo: 2300, velocidad: 70 },
    q: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 5, amplitud: 2, periodo: 2600, velocidad: 60 },
    a: { tipo: 'plataforma-movil', capa: 'solidos', fusion: 'h', dx: 7, duracion: 2600 },
    b: { tipo: 'plataforma-movil', capa: 'solidos', fusion: 'h', dx: 6, duracion: 2200, desfase: 600 },
    c: { tipo: 'plataforma-movil', capa: 'solidos', fusion: 'h', dy: 5, duracion: 1800 },
    d: { tipo: 'plataforma-movil', capa: 'solidos', fusion: 'h', dx: 7, duracion: 2400, desfase: 1200 },
    v: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', retardo: 520 },
  },
  objetos: [
    { tipo: 'aviso', x: 5, y: 22, w: 5, h: 7, pista: 'calcetin', duracion: 4200 },
    // más mosquitos: sobre el río y en el camino por las copas
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 75, y: 23, rango: 3, amplitud: 1, periodo: 1900, velocidad: 60 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 168, y: 7, rango: 3, amplitud: 1, periodo: 1700, velocidad: 65 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 182, y: 7, rango: 2, amplitud: 1.5, periodo: 2100, velocidad: 55 },
  ],
  mapa: `
#                                                                                                                                                                                                                                                          #
#                                                                                                                                                                                                                                                          #
#                                                                                                                                                                                                                                                          #
#                                                                                                                                                       O                                                                                                  #
#                                                                                                                                                       ==                                                                                                 #
#                                                                                                                                                                                                                                                          #
#                                                                                                                                                          ==        m            n                                                                        #
#                                                                                                                                                                                                                                                          #
#                                                                                                                                                      C                                                                                                   #
#                                                                                                                                       ##        ########   vvv  vvv  ===       ===      ###                                                              #
#                                                                                                                                       ##        ##                        vvv       vvv ##                                                               #
#                                                                                                                                       ##    ====##                                      ##                                                               #
#                                                                                                                                       ##        ##                                      ##                                                               #
#                                                                                                                                       ##        ##                                      ##                                                               #
#                                                                                                                                       ##====    ##                                      ##                                                               #
#                                                                                                                                       ##   n    ##                                      ##                                                               #
#                                                                                                                                       ##        ##                                      ##                                                               #
#                                                                                                                                       ##    ====##                                      ##                                                               #
#                                                                                                                                       ##        ##                                      ##                                                               #
#                                                                                                                                       ##        ##                                      ##                                                               #
#                                                                                                q                                      ##====    ##                                      ##                                                               #
#                                                                                                                                       ##   m    ##                                      ##                                                               #
#                 F                                                                                                                     ##        ##                                      ##                                                               #
#                ===                                                                                       #  ccc                       ##    ====##                                      ##                                                               #
#      k                                                                                #                  #                                      ##                                      ##                                                        G      #
#     ===                                    u               ##                         #  bb          u   #                                      ##                                      ##                                             ###################
#                              ##         ########   ##      ##                    u    #            #######       dd                     ====    ##                                      ##                                             ###################
#         ##  ##               ##         #      #   ##      ##       aaa        ########            #######                                      ##                                      ##                                             ###################
# S M     ##  ## ^^     u  ^^  ##         #      #   ## ^^u  ##  C               ########            #######               ^^      C              ##                                      ##  N      B              B           U        ###################
#####################################  ##############################            ########            #######                ########################                                      ##################################################################
#####################################  ##############################            ########            #######                ########################                                      ##################################################################
#####################################  ##############################            ########            #######                ########################                                      ##################################################################
#####################################  ##############################            ########            #######                ########################                                      ##################################################################
`,
};
