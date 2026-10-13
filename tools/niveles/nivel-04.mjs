// Nivel 4 — 4 años: de excursión, primero a la nieve y luego a la playa. Foco: doble salto y suelos que se hunden. 4 velas.
// Tramos: (1) montones de nieve con huecos de 5-7 casillas | (2) el lago helado: placas de hielo que se hunden
// | (3) en la playa: castillos de arena que se desmoronan y mosquitos | (4) las rocas: subida en zigzag por nubes.
// El fondo pasa de nieve a playa en la col. 137 (zona 'fondo'), justo antes del cartel del mosquito.
// El agua es el vacío: caer = una vela. Foto: flota sobre una nube alta encima del lago (col. 91); se coge
// con un doble salto rápido HACIA ATRÁS desde la placa de las col. 94-95 antes de que se hunda.
// Objeto (libro de Pía): al final de la orilla lateral de placas que se hunden muy deprisa (col. 123-136).
// Broma: el mosquito gigante del cartel... es de cartón piedra (decorado).
// Monstruo nuevo: el mosquito, el primero que apaga velas (se presenta en el cartel 2). Los patos de goma de la
// nieve son de repaso.
export default {
  props: { tema: 'nieve', edad: 4 },
  leyenda: {
    M: { tipo: 'miriam', pista: 'muelle' },
    t: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 7, velocidad: 75 },
    r: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'hunde', profundidad: 9, velocidad: 170 },
    k: { tipo: 'plataforma-cae', capa: 'solidos', fusion: 'h', modo: 'cae', retardo: 550 },
    p: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 2, velocidad: 70 },
    q: { tipo: 'enemigo', clase: 'patrullero', sprite: 'pato', rango: 1, velocidad: 60 },
    z: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 2, amplitud: 1, periodo: 1700, velocidad: 55 },
    Z: { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', rango: 1.5, velocidad: 45, amplitud: 1.5, periodo: 2400 },
    1: { tipo: 'cartel', pista: 'doble' },
    2: { tipo: 'cartel', pista: 'mosquito' },
    3: { tipo: 'cartel', pista: 'toalla' },
  },
  objetos: [
    // de la nieve a la playa
    { tipo: 'fondo', x: 137, y: 0, w: 1, h: 1, tema: 'playa' },
    // el mosquito gigante (broma): es un decorado, no hace nada
    { tipo: 'decorado', x: 142, y: 6, sprite: 'mosquito', escala: 1.6, angulo: -8 },
    // más mosquitos sobre los saltos largos, siempre después del cartel que los presenta (col. 140)
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 147, y: 5, rango: 2, amplitud: 1.5, periodo: 2000, velocidad: 45 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 171, y: 6, rango: 3, amplitud: 1.5, periodo: 2200, velocidad: 50 },
    { tipo: 'enemigo', clase: 'volador', sprite: 'mosquito', x: 200, y: 8, rango: 2, amplitud: 1, periodo: 1800, velocidad: 55 },
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
