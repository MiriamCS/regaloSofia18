// Nivel 4 — 4 años: la playa. Foco: doble salto y tablas que se hunden. 4 velas.
// Tramos: (1) dunas con huecos de 5-7 casillas | (2) el muelle: tablas que se hunden sobre el agua
//         | (3) castillos de arena que se desmoronan y mosquitos | (4) las rocas: subida en zigzag por nubes.
// El agua es el vacío: caer = una vela. Foto: flota sobre una nube alta encima del agua (col. 91); se coge
// con un doble salto rápido HACIA ATRÁS desde la tabla de las col. 94-95 antes de que se hunda.
// Objeto (cubo): al final del muelle lateral de tablas que se hunden muy deprisa (col. 123-136, sobre el agua).
// Broma: el mosquito gigante del cartel... es de cartón piedra (decorado).
export default {
  props: { tema: 'playa', edad: 4 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'muelle' },
    t: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 7, velocidad: 75 },
    r: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 9, velocidad: 170 },
    k: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'cae', retardo: 550 },
    p: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 2, velocidad: 70 },
    q: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 1, velocidad: 60 },
    z: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 2, amplitud: 1, periodo: 1700, velocidad: 55 },
    Z: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', velocidad: 0, amplitud: 1.5, periodo: 2400 },
    1: { tipo: 'cartel', pista: 'doble' },
    2: { tipo: 'cartel', pista: 'mosquito' },
    3: { tipo: 'cartel', pista: 'toalla' },
  },
  objetos: [
    // el mosquito gigante (broma): es un decorado, no hace nada
    { tipo: 'decorado', x: 142, y: 6, sprite: 'mosquito', escala: 1.6, angulo: -8 },
  ],
  mapa: `
#                                                                                                                                                                                                                                                        #
#                                                                                                                                       O                                                                                                                #
#                                                                                          F                                           rr                                                                    #######                                     #
#                                                                                                                                  rr                                                                             ##                                     #
#                                                                                          ==                                                                                                          ===        ##        z                            #
#                                                                                                                              rr                                                                                 ##    ##                               #
#                                                                                                                                                             Z                                            Z      ##    ##        z                      #
#                                                                                                                          rr                            Z                            z                     ===   ##    ##    ##                         #
#                                                                                             tt                                                                     kk           q                               ##    ##    ##                         #
#                           ######           q                               ttt    ##                    ##        C                                      kk                   ####                              ##    ##    ##    ##                   #
#                           ######       #######                  ttt   tt          ##   tt         ttt   ##  ############                            kk        kk              ####                   ===        ##    ##    ##    ##                   #
#  S   1                 ^^ ######       #######         M  C                       ##                    ##    #      #     ##    ##      2                                    ####         C                    ##    ##    ##    ##       3       G   #
###############     ##############       #######      #########                     ##                    ##    #      #     ##    ##    ##########                       ##########      ############            ##    ##    ##    ##   #################
###############     ##############       #######      #########                     ##                    ##    #      #     ##    ##    ##########                       ##########      ############            ##    ##    ##    ##   #################
###############     ##############       #######      #########                     ##                    ##    #      #     ##    ##    ##########                       ##########      ############            ##    ##    ##    ##   #################
`,
};
