# Diseño de niveles

Diseño escrito de los 19 niveles (parte 1) y guía técnica para construirlos (parte 2).
Las ambientaciones siguen las fotos y los objetos de cada año (revisadas con Miriam en octubre).

Reglas comunes (SPEC §5): 3-4 tramos separados por checkpoints (atriles), cada tramo con una
idea principal; foto y objeto en zonas opcionales y difíciles; Miriam al menos una vez, cerca del
puzle más complicado; al menos una broma o trampa graciosa por nivel; nunca más de ~3 minutos
entre checkpoints. La dificultad sube claramente de un nivel al siguiente.

### Monstruos y curva de dificultad (acordado en octubre)
- **Un monstruo nuevo por nivel, nunca dos**, y siempre presentado (pista de Miriam o cartel) antes de que salga el
  primero: 0 pato · 1 cochecito · 2 urraca · 3 mochila · 4 mosquito · 5 avión de papel · 6 bolígrafo · 7 metrónomo ·
  11 despertador · 12 pila de exámenes · 14 notificación. El nivel de cada uno está en `config/enemigos.json`
  (`presenta`) y `npm run validar` comprueba que ninguno salga antes.
- Daño de los monstruos: patrulleros, urraca, bloqueadores y desafinados no quitan velas (empujan, roban, cortan el
  paso o invierten los controles si les cantas); los voladores quitan 1 (algún avión, 2). Al cantarles, los voladores
  huyen; solo se eliminan saltándoles encima.
- La urraca huye más rápido de lo que anda Sofía (velocidad 150-200): para recuperar lo robado hay que correr.
- **Presión** de un nivel = daño total que contiene ÷ velas. Como las velas crecen con la edad, cada nivel tiene que
  añadir daño para no quedar más fácil que el anterior. No cuenta los huecos, así que los niveles con muchos abismos
  (4, 8) o mucha carga musical (11) son más duros de lo que dice el número.
- Pinchos: 1 vela hasta el 9, 2 desde el 10, 3 desde el 13. En el último tramo del 18, caer al abismo cuesta 3 velas.
- Cambios de orden: el verano pasó al 9 y el conservatorio al 11; la biblioteca (antes exámenes) al 13, las redes sociales
  (antes el móvil gigante) al 14 y la audición al 15.
- Fondos por tramos: una zona `fondo` con `tema` cambia el fondo a partir de su x, con un fundido suave (niveles 4, 6, 12, 14 y 18).

---

## Parte 1 · Diseño por nivel

Generada a partir de los niveles construidos (cabeceras de `tools/niveles`, `config/objetos.json` y los mapas).

### Nivel 0 · La cuna — ∞ velas
- **Fondo:** cuna
- **Foto:** bebé en la cama · **Objeto:** El certificado de nacimiento
- **Monstruos:** patito de goma ×1
- **Diseño** (de `tools/niveles/nivel-00.mjs`):
  Nivel 0 — Año 0: la habitación del bebé. Tutorial a gatas: moverse, saltar y empujar.
  Velas infinitas. Tramos: primeros pasos | la caja | el pato y la broma | el puzle de las dos cajas.
  Foto: en lo alto de la escalera de nubes (saltos precisos). Objeto: tras la pared falsa del final.

### Nivel 1 · Primeros pasos en casa — 1 vela
- **Fondo:** casa
- **Foto:** primeros pasos en casa con un juguete · **Objeto:** El chupete
- **Monstruos:** cochecito ×3, patito de goma ×3
- **Diseño** (de `tools/niveles/nivel-01.mjs`):
  Nivel 1 — 1 año: primeros pasos en casa. Ya anda de pie. Foco: saltos precisos y primer enemigo. 1 vela.
  Tramos: (1) la alfombra del salón | (2) el trenecito de juguete (plataformas móviles) | (3) patos de goma y
  cochecitos | (4) la escalera de casa (bajada con huecos y un peldaño que se cae).
  Foto: sobre el trenecito más alto (hay que saltar en lo alto de su recorrido).
  Objeto (chupete): en la cornisa bajo la escalera; se llega dejándose caer con precisión por el borde.
  Broma: el cochecito «aparcado» que da vueltas sin parar en una plataforma minúscula.

### Nivel 2 · Los juegos infantiles — 2 velas
- **Fondo:** parque
- **Foto:** en la piscina de bolas · **Objeto:** El peluche
- **Monstruos:** urraca ×1
- **Diseño** (de `tools/niveles/nivel-02.mjs`):
  Nivel 2 — 2 años: los juegos infantiles. Foco: CORRER (mantener la flecha 0,5 s) y objetos que caen. 2 velas.
  Tramos: (1) las pasarelas del parque: huecos de 4-5 | (2) la piscina de bolas: lluvia de pelotas, con pasarelas
  donde refugiarse | (3) la casita: cajas para subir | (4) la torre del tobogán: carrera final.
  Foto: en lo alto de la casita, pasando por una repisa que se cae.
  Objeto (peluche): en el rincón de la piscina de bolas, al fondo del pasillo lateral con lluvia de pelotas muy densa.
  Broma: el cartel «Prohibido correr» justo antes del hueco que solo se salta corriendo.
  Monstruo nuevo: la urraca (se presenta en el cartel 5). Es la rápida: huye más deprisa de lo que anda Sofía, así que
  para recuperar la foto hay que correr. Está en la explanada final, cerrada por la pared: no puede caerse a un hueco.

### Nivel 3 · La fiesta — 3 velas
- **Fondo:** fiesta
- **Foto:** disfrazada, tocando el piano · **Objeto:** El piano
- **Monstruos:** mochila ×6
- **Diseño** (de `tools/niveles/nivel-03.mjs`):
  Nivel 3 — 3 años: la fiesta de disfraces. Foco: puzles de cajas básicos (empujar, apilar, tirar a un foso). 3 velas.
  Las cajas son los regalos de la fiesta. Tramos: (1) torre de regalos: dos cajas para un muro de 4 | (2) regalo-puente:
  un foso de pinchos de 7 que solo se salta con dos cajas dentro | (3) las mochilas de los invitados, que empujan
  hacia los pinchos, y la mesa de la tarta | (4) gran puzle: tres cajas a tres alturas (suelo, repisa de 4 y repisa
  de 6) que hay que bajar de una en una: una rellena el hueco al pie del muro y otra queda encima como escalón.
  Foto: sobre la mitad de la repisa larga; solo se alcanza subida a la caja media, empujada justo debajo (en vez de tirarla).
  Objeto (piano): en el nicho bajo el tejadillo; una caja tapa la entrada y hay que empujarla hasta que cae al hueco.
  Broma: la mesa de la tarta «que no se mueve ni a la de tres»... y que se mueve (despacito) si la empujas.

### Nivel 4 · De excursión — 4 velas
- **Fondo:** nieve → playa (col. 137)
- **Foto:** en la nieve · **Objeto:** El libro de Pía
- **Monstruos:** mosquito ×9, patito de goma ×2
- **Diseño** (de `tools/niveles/nivel-04.mjs`):
  Nivel 4 — 4 años: de excursión, primero a la nieve y luego a la playa. Foco: doble salto y suelos que se hunden. 4 velas.
  Tramos: (1) montones de nieve con huecos de 5-7 casillas | (2) el lago helado: placas de hielo que se hunden
  | (3) en la playa: castillos de arena que se desmoronan y mosquitos | (4) las rocas: subida en zigzag por nubes.
  El fondo pasa de nieve a playa en la col. 137 (zona 'fondo'), justo antes del cartel del mosquito.
  El agua es el vacío: caer = una vela. Foto: flota sobre una nube alta encima del lago (col. 91); se coge
  con un doble salto rápido HACIA ATRÁS desde la placa de las col. 94-95 antes de que se hunda.
  Objeto (libro de Pía): al final de la orilla lateral de placas que se hunden muy deprisa (col. 123-136).
  Broma: el mosquito gigante del cartel... es de cartón piedra (decorado).
  Monstruo nuevo: el mosquito, el primero que apaga velas (se presenta en el cartel 2). Los patos de goma de la
  nieve son de repaso.

### Nivel 5 · La pista de patinaje — 5 velas
- **Fondo:** patinaje
- **Foto:** con casco y patines · **Objeto:** Los patines
- **Monstruos:** avión de papel ×5, cochecito ×3
- **Diseño** (de `tools/niveles/nivel-05.mjs`):
  Nivel 5 — 5 años: la pista de patinaje sobre ruedas. Primer nivel-trampa: nada es lo que parece. 5 velas.
  Tramos: (1) la salida está al principio... y sale patinando; rampa que se desmorona y pared que no existe
          | (2) la pista: los bloques con pinta de sólidos (x) se esfuman y las nubes sí aguantan
          | (3) la zona de saltos: conos «de decoración» (pican) y la caja de los patines de alquiler, que hay
            que tirar y empujar hasta el muro para subirlo (si se empuja hacia atrás cae al hueco y vuelve)
          | (4) la salida de mentira: zona de controles invertidos y una segunda meta falsa que se mete en la
            pared del final... que también es falsa: la meta de verdad está dentro.
  Foto: dentro del montículo del tramo 2 (pared fantasma por la derecha, col. 108-113; la delata una nota dorada).
  Objeto (patines): arriba a la izquierda del inicio, por plataformas que caen al pisarlas y reaparecen, sobre
  pinchos. Las temporizadas no se estrenan hasta el nivel 10.
  Monstruo nuevo: el avión de papel (se presenta en el cartel 7, antes del primero).

### Nivel 6 · Empieza el cole — 6 velas
- **Fondo:** colegio → danza (col. 168)
- **Foto:** exhibición de gimnasia rítmica · **Objeto:** El tutú
- **Monstruos:** avión de papel ×2, mochila ×4, bolígrafo gigante ×2
- **Diseño** (de `tools/niveles/nivel-06.mjs`):
  Nivel 6 — 6 años: empieza el cole (y la clase de danza). Se desbloquea CANTAR (tecla de la nota). 6 velas.
  Tramos: (1) el patio: plataformas musicales que solo existen si les cantas cerca
          | (2) el pasillo: puertas-melodía de 2 y 3 notas (Simón dice) con campanas
          | (3) mochilas dormilonas sobre pinchos (cantar las duerme), el bolígrafo del profe que se aparta al
            cantarle y el profe dormilón (broma: se duerme justo delante de la salida y hay que dar la vuelta)
          | (4) la clase de danza (fondo de espejos y barra desde la col. 168): puerta de 4 notas con las campanas
            en salientes sobre pinchos, a distintas alturas, como una coreografía.
  Foto: en lo alto de la cadena de plataformas musicales del patio (col. 34-45).
  Objeto (tutú): en la taquilla del vestuario de danza, tras la puerta-melodía oculta (sin notas a la vista; el
  cartel da la adivinanza: de la campana más alta a la más baja; la más alta solo suena cantando en lo alto de un doble salto).
  Ojo: cantar cerca de una campana siempre la hace sonar; cada campana está lejos (>190 px) de las demás.
  Monstruo nuevo: el bolígrafo gigante del profe (se presenta en el cartel 5, antes del primero).

### Nivel 7 · El huerto — 7 velas
- **Fondo:** huerto · teclas con aspecto de `bancal`
- **Foto:** en el huerto, con un rábano · **Objeto:** El rábano
- **Monstruos:** avión de papel ×2, metrónomo desafinado ×3
- **Diseño** (de `tools/niveles/nivel-07.mjs`):
  Nivel 7 — 7 años: el huerto del cole. Foco: bancales musicales (suelo que suena y abre caminos).
  Los bancales son teclas (tipo 'tecla') dibujadas como jardineras: props.teclas = 'bancal'.
  Tramos: (1) bancales en escalera y la puerta «sol-mi-do» (hay que tocarla al revés) | (2) el himno de la alegría:
  la puerta se abre... y es la caseta de las herramientas con un metrónomo; la segunda mitad del himno abre el fondo
  | (3) tablas que se hunden sobre pinchos, plataformas musicales y metrónomos desafinados (no cantes cerca)
  | (4) el gran bancal: bancales en dos alturas. «Estrellita» (do do sol sol la la) abre la salida;
  «Cumpleaños feliz» (sol sol la sol do si) abre la puerta secreta de arriba, donde está la foto.
  Foto: en el cuarto encima del gran bancal (melodía secreta). Objeto (rábano): en el foso del gran bancal, entre pinchos.
  Broma: la caseta del metrónomo. Las tablas que se hunden son plataformas 'hunde'.

### Nivel 8 · La comunión — 8 velas
- **Fondo:** jardin
- **Foto:** primera comunión · **Objeto:** El rosario
- **Monstruos:** mosquito ×8, urraca ×6
- **Diseño** (de `tools/niveles/nivel-08.mjs`):
  Nivel 8 — 8 años: la comunión, en el jardín del banquete. Foco: urracas ladronas y persecución.
  Las urracas (clase 'ladron') roban la foto o el objeto si te tocan y huyen: hay que tocarlas para recuperarlo.
  Tramos: (1) el camino del jardín: la foto sale enseguida (en el tocón) y hay urracas por todo el camino; los muros
  de 3 las acorralan | (2) el estanque: plataformas móviles e islas con urraca y tronco | (3) los árboles del jardín:
  subida vertical por ramas (nubes) con mosquitos y camino por las copas con ramas que se caen | (4) el patio del
  restaurante: urraca rápida que acaba acorralada contra el muro; hay que empujar una caja hasta el muro para salir.
  Foto: en el tocón del principio. Objeto (rosario): en la copa más alta, encima del atril de los árboles.
  Broma: la urraca de la rama roba... un calcetín imaginario (zona 'aviso': no hay robos de mentira en el motor).
  Las urracas ya se presentaron en el nivel 2: aquí son más rápidas (huyen más deprisa de lo que anda Sofía) y el
  camino tiene zarzas (pinchos) entre ellas.

### Nivel 9 · Verano: playa y piscina — 9 velas
- **Fondo:** verano
- **Foto:** en la piscina · **Objeto:** El equipo de buceo
- **Monstruos:** patito de goma ×3, urraca ×1, mochila ×3, metrónomo desafinado ×3, mosquito ×7
- **Diseño** (de `tools/niveles/nivel-09.mjs`):
  Nivel 9 — 9 años: verano en la playa y la piscina. Foco: combinación de cajas + canto + enemigos.
  Tramos: (1) la piscina: cajas flotantes que se hunden (h/k), patos y la piscina de buceo | (2) el chiringuito:
  caja en un estante alto (se sube con la plataforma musical m) para saltar la barra; la gaviota ladrona |
  (3) el camping: puente musical con un metrónomo que desafina, mochilas, mosquitos, erizos y metrónomos |
  (4) la puesta de sol: puerta-melodía de 5 notas con las campanas sobre plataformas que caen y se hunden.
  Foto: en la sombrilla más alta (desde la caja, cantar y saltar a la plataforma musical j). Objeto (equipo de buceo): en el fondo de la
  piscina de buceo (zona de gravedad baja), entre erizos. Broma: cantarle la nana al pato del medio (P)
  enfada a los otros dos (Q). El agua es un 'peligro-movil' quieto (velocidad casi 0).
  La puerta pide do, mi, re, sol, la: hay que volver atrás a por el re.

### Nivel 10 · Los volcanes — 10 velas
- **Fondo:** volcan
- **Foto:** saltando en el Teide · **Objeto:** pendiente (de momento, la pelota)
- **Monstruos:** cochecito ×1, avión de papel ×7
- **Diseño** (de `tools/niveles/nivel-10.mjs`):
  Nivel 10 — 10 años: los volcanes. Foco: peligros de 2 velas (la lava) y plataformas temporizadas.
  Tramos: (1) las rocas que aparecen entre el humo (temporizadas) y el géiser | (2) rocas que se encienden y se
  apagan sobre ríos de lava de 2 velas | (3) aviones de papel entre las cumbres | (4) carrera por las coladas
  con piedras que se caen.
  Foto: en la cumbre más alta, encadenando tres rocas (p, q, k). Objeto (pendiente; de momento la pelota): en la
  grieta bajo la colada, entre lava de 2 velas. Broma: el géiser puntual (r), que casi nunca está.
  Aquí se estrenan las temporizadas y el daño de 2 velas (la lava naranja y el avión grande).
  Temporizadas: a/b se alternan (ciclo 3 s); d/e/f se encienden en ola, de izquierda a derecha (ciclo 2,7 s); p/q/k suben en cadena.

### Nivel 11 · El conservatorio profesional — 11 velas
- **Fondo:** conservatorio
- **Foto:** con el cello · **Objeto:** El cello
- **Monstruos:** avión de papel ×2, despertador ×2
- **Diseño** (de `tools/niveles/nivel-11.mjs`):
  Nivel 11 — 11 años: el conservatorio, ya en el grado profesional. Foco: melodías largas bajo presión.
  El conservatorio tiene dos pisos. Tramo 1 (arriba): pasillo de campanas
  «do-re-mi-fa-sol» con las campanas desordenadas, y la broma de las dos puertas («mi-re-do-re-mi»: la que
  enseña las notas no se abre nunca; se abre la de encima). Tramo 2 (abajo): la sala
  de ensayo (se baja por el hueco del final), «Para Elisa» (9 notas) mientras la profe de solfeo con prisa
  (peligro que avanza por la franja del piso de abajo, filas 21-33) te pisa los talones.
  Tramo 3: escalera de teclas, «do-mi-sol-do» saltándose las teclas equivocadas por las nubes temporizadas.
  Tramo 4: la prueba de acceso, «Oda a la alegría» (7 notas) con campanas en lo alto a las que se llega por plataformas musicales (cantar cerca de una campana la hace sonar).
  Foto: al salir de la sala, un desvío de vuelta por lo alto de la sala, hacia la profe que avanza.
  Objeto (cello): en la taquilla del conserje, tras una puerta oculta de 5 notas («sol-mi-do-mi-sol», con las campanas del tramo 1).
  Monstruo nuevo: el despertador del conserje (se presenta en el cartel J, al empezar). Hay uno cerca de la campana
  del fa (tramo 1) y otro antes de la puerta de la audición: cantar a su lado invierte los controles, así que hay
  que elegir bien desde dónde se canta. La profe con prisa quita 2 velas (se avisa en el cartel I).

### Nivel 12 · La pandemia — 12 velas
- **Fondo:** habitacion → instituto (col. 64)
- **Foto:** con mascarilla y mochila · **Objeto:** La mascarilla
- **Monstruos:** pila de exámenes ×3, metrónomo desafinado ×2, avión de papel ×2
- **Diseño** (de `tools/niveles/nivel-12.mjs`):
  Nivel 12 — 12 años: la pandemia mundial. Foco: gravedad y controles cambiantes: nada funciona como siempre.
  Tramos: (1) en casa, confinada: pasillo con zonas de controles invertidos (en la segunda, un examen online obliga
  a pararse y cantar; la última empieza en mitad de un salto) | desde la col. 64 (zona 'fondo'), de vuelta al insti
  con mascarilla: (2) el gimnasio con gravedad baja (factor 0,4) | (3) la escalera al revés: gravedad invertida, se
  anda por el techo y los huecos del techo son precipicios hacia el cielo | (4) todo mezclado, con exámenes
  bloqueadores (cantarles los aparta) y metrónomos que invierten los controles si cantas cerca.
  Foto: en un hueco del techo del gimnasio; se llega saltando (doble) hasta la canasta antigravedad.
  Objeto (mascarilla): en la taquilla del fondo de la zona invertida: una ventana de gravedad normal te deja caer hasta ella.
  Broma: el cartel «Por aquí no» con la flecha al revés, dentro del pasillo invertido.
  Las zonas (invertir, gravedad) van en 'objetos'; si se solapan dos de gravedad, manda la última de la lista.
  Monstruo nuevo: la pila de exámenes (se presenta en el cartel 3, justo antes de la primera). Desde el nivel 10 los
  pinchos quitan 2 velas.

### Nivel 13 · La biblioteca — 13 velas
- **Fondo:** biblioteca
- **Foto:** en casa, con diadema · **Objeto:** La pila de libros
- **Monstruos:** avión de papel ×11, pila de exámenes ×4, mochila ×2
- **Diseño** (de `tools/niveles/nivel-13.mjs`):
  Nivel 13 — 13 años: la biblioteca. 13 velas. Mapa alto (escape vertical): se empieza abajo a la izquierda.
  Foco: peligros de 3 velas y escape vertical (peligro-movil hacia arriba: la marea de apuntes).
  Tramos: (1) la sala de lectura: pilas de exámenes que cortan el paso (se apartan si les cantas) y huecos de 2 velas
  | (2) escape vertical por el hueco de las estanterías con la marea de apuntes subiendo | (3) el suspenso:
  pasillo de pinchos de 3 velas con plataformas que caen | (4) escape final, más rápido, por plataformas que caen.
  Broma: el «examen sorpresa» que aparece al doblar la esquina... con un 10 (y se aparta en cuanto le cantas).
  Foto: en una hornacina de la pared derecha del primer escape (hay que desviarse con la marea subiendo).
  Objeto (pila de libros): en un poste bajito entre los pinchos de 3 velas. Miriam: al principio del escape.
  Aquí se estrenan los pinchos de 3 velas (cartel 2). Las pilas de exámenes ya se presentaron en el nivel 12.

### Nivel 14 · Las redes sociales — 14 velas
- **Fondo:** habitacion → redes (col. 74)
- **Foto:** en una comida · **Objeto:** El móvil
- **Monstruos:** notificación ×29, despertador ×5
- **Diseño** (de `tools/niveles/nivel-14.mjs`):
  Nivel 14 — 14 años: las redes sociales. 14 velas.
  Foco: enemigos notificación y «la interfaz que miente» (avisos falsos, meta falsa, paredes y suelos falsos).
  Tramos: (1) la habitación: notificaciones y suelo de Lego (3 velas) | (2) dentro del móvil (fondo de apps desde la
  col. 74): «¡Nivel completado!» falso, meta falsa y una pared «sin salida» que se atraviesa | (3) apps que se
  cierran (temporizadas) sobre el vacío y suelos que desaparecen | (4) modo avión: controles invertidos con
  notificaciones (se entra cayendo por detrás de un bloque y se sale por una zanja).
  Broma: «Batería baja: 1%»... y no se apaga nada. Foto: en la galería del móvil, tras una pared falsa
  (arriba, en el tramo 2). Objeto (móvil): en el cajón del escritorio, entre Legos y notificaciones.
  Miriam: al empezar (presenta las notificaciones, el monstruo nuevo) y dentro del móvil (no te fíes de los avisos).

### Nivel 15 · La audición — 15 velas
- **Fondo:** concierto
- **Foto:** con vestido de concierto · **Objeto:** Las gafas
- **Monstruos:** avión de papel ×13, metrónomo desafinado ×5
- **Diseño** (de `tools/niveles/nivel-15.mjs`):
  Nivel 15 — 15 años: la audición. 15 velas. Música de la etapa adolescente (120 bpm: un pulso = 0,5 s).
  Foco: ritmo. Casi todas las plataformas van a compás de la música (plataforma-temporizada con ritmo: on/off en pulsos).
  Tramos: (1) entre bastidores: plataformas a negras que se alternan (salta cuando la tuya empieza a parpadear)
  | (2) el foso de la orquesta: un suelo que «late» (desaparece medio pulso cada dos: hay que saltar a compás) y
  plataformas que solo están un pulso de cada dos | (3) el escenario: campanas sobre plataformas que laten;
  la puerta pide mi-sol-la-do (hay una campana «si» de despiste) | (4) la ovación: carrera a ritmo sobre pinchos de 3 velas, con aviones.
  Broma: el metrónomo desafinado no invierte los controles: si le cantas se acelera («cambia el tempo»).
  Foto: en el palco, subiendo por plataformas a contratiempo. Objeto (entrada): en el sótano del escenario, tras
  una pared falsa a la que se llega dejándose caer a una cornisa del foso (la delata una nota dorada).
  Miriam: entre bastidores («cuenta...») y junto a la puerta.

### Nivel 16 · La cita — 16 velas
- **Fondo:** ciudad-noche
- **Foto:** en un pasillo, con chaqueta · **Objeto:** El ramo de rosas
- **Monstruos:** bolígrafo gigante ×1, mochila ×1, despertador ×1, avión de papel ×12
- **Diseño** (de `tools/niveles/nivel-16.mjs`):
  Nivel 16 — 16 años: la cita romántica. 16 velas. Foco: el mundo cambia al cantar (A = día, B = noche): la cita
  empieza por la tarde y acaba de noche. Cada vez que Sofía canta se alterna el mundo; lo del otro mundo se ve
  transparente y no existe.
  Tramos: (1) la estación: puentes de un solo mundo | (2) el tren: pinchos de un solo mundo en el techo
  de los vagones (y un túnel) | (3) el mirador del monte: cambiar de mundo en el aire, muros de un mundo a mitad de
  salto y un teleférico con postes | (4) la ciudad: puerta-melodía con campanas en repisas de
  mundos distintos (cada campana tocada también cambia el mundo).
  Foto: mirador de noche en lo alto del monte, rodeado de pinchos de día.
  Objeto (ramo de rosas): andén alto sobre el tren, por nubes alternas de día y de noche.
  Broma: el reloj de la estación (siempre llegas tarde... aunque llegues puntual). Miriam: estación y campanas.
  Leyenda: a/b sólido de día/noche · d/n nube de día/noche · p/q pinchos (3 velas) de día/noche · ^ pinchos de 2 velas.

### Nivel 17 · Selectividad — 17 velas
- **Fondo:** aulas
- **Foto:** en la UJI · **Objeto:** El diploma y el birrete
- **Monstruos:** metrónomo desafinado ×1, pila de exámenes ×1, mochila ×1, notificación ×5
- **Diseño** (de `tools/niveles/nivel-17.mjs`):
  Nivel 17 — 17 años: Selectividad, en las aulas de examen. 17 velas. Foco: TODAS las mecánicas juntas y un laberinto.
  Tramos: (1) el laberinto de aulas: cuatro pisos, escaleras de nubes, callejones sin salida,
  suelo falso, caja y el «temario», una pared gigante que es falsa | (2) el aula de examen: puente de
  plataformas musicales, campanas en repisas (una sobre escalera musical, otra temporizada, otra con caja),
  metrónomo desafinado | (3) el examen: plataformas temporizadas con notificaciones, montón de exámenes
  (bloqueador), gravedad invertida con controles invertidos y huecos al cielo, plataformas que caen |
  (4) la nota: escape por el pasillo de abajo huyendo de la marea de apuntes (peligro que avanza), con
  dos puertas-melodía (campanas y teclas) y plataformas que caen.
  Foto: en el centro del laberinto (piso 2 izquierdo, sobre pinchos con plataformas temporizadas).
  Objeto (diploma y birrete): sala secreta tras una puerta de melodía oculta (teclas en el estante alto).
  Broma: el temario. Miriam: en el laberinto, en el aula de examen y al empezar la escapada.
  Sin mundos A/B: cantar sirve para campanas, plataformas musicales y enemigos.

### Nivel 18 · La universidad y el gran concierto — 18 velas
- **Fondo:** universidad → escenario (col. 57) → universidad (col. 120) → escenario (col. 196)
- **Foto:** — (no hay foto de los 18) · **Objeto:** El ordenador portátil
- **Monstruos:** avión de papel ×7, mochila ×1, despertador ×1, notificación ×2
- **Diseño** (de `tools/niveles/nivel-18.mjs`):
  Nivel 18 — 18 años: la universidad (Informática) y el gran concierto. El nivel más difícil y el final abierto (SPEC §7).
  El escenario se va alternando (zonas 'fondo'): facultad → sala de conciertos (col. 57) → facultad (col. 120) →
  sala de conciertos (col. 196). Los carteles E e I marcan los dos primeros cambios.
  Tramos: (1) la facultad: caja + doble salto, foso de pinchos de 3 velas, plataformas que caen y aviones de papel;
  (2) la sala de conciertos: plataformas a ritmo, una mochila y la melodía más larga del juego, «Cumpleaños feliz»
  entera (sol sol la sol do si · sol sol la sol re do: 12 notas), con un despertador rondando las campanas;
  (3) la facultad: la clase de Física, gravedad invertida por el techo, luces temporizadas y un suelo «seguro»;
  (4) el escenario: nubes pequeñas sobre el abismo con aviones y notificaciones; aquí caer cuesta 3 velas.
  Donde debería estar la meta empieza la zona 'final': camino blanco, «Continuará...» y la tarta.
  Sin foto (aún no hay foto de los 18). Objeto (portátil): en una repisa escondida en el foso del tramo 2.

---

## Parte 2 · Guía técnica

### Cómo se construye un nivel
1. Se dibuja en `tools/niveles/nivel-XX.mjs` como mapa ASCII (cada carácter = 1 casilla de 48 px).
2. `npm run niveles -- XX` lo convierte a `assets/levels/nivel-XX.json` (formato Tiled, solo capas de objetos).
3. `npm run validar -- XX` comprueba las reglas de diseño.
4. Se prueba con `npm run dev` abriendo `http://localhost:5173/?nivel=XX` (añadir `&debug` para ver los cuerpos físicos).
5. Si se retoca a mano en **Tiled** (abrir el `.json` directamente), añadir al mapa la propiedad booleana
   `editadoAMano = true` para que el generador no lo sobrescriba.

### Física de referencia (config/juego.json)
| Medida | Valor | En casillas |
| --- | --- | --- |
| Altura máx. salto | 125 px | sube 2 casillas (3 no) |
| Salto con doble salto (nivel 4+) | ~220 px | sube 4 casillas |
| Hueco saltable andando | ~167 px | 3 casillas |
| Hueco saltable corriendo (nivel 2+) | ~276 px | 5 casillas |
| Hueco con doble salto corriendo | ~440 px | 7-8 casillas |
| Bebé a gatas (nivel 0) | salto 71 px | sube 1 casilla, huecos de 1 |
| Radio del canto | 190 px | ~4 casillas |
| Plataforma musical activa | 3,8 s | |

Ojo: correr se mantiene en el aire si se sigue pulsando la flecha, así que en la práctica los saltos
llegan algo más lejos (un doble salto corriendo cubre ~9 casillas). Al morir, las cajas que empiezan
por delante del atril vuelven a su sitio. Lo que hay dentro de una pared falsa (`fantasma`) queda tapado.

La pantalla muestra unas 27 × 15 casillas. Un nivel típico mide 15 de alto y 150-300 de ancho;
los de escape vertical pueden medir 40+ de alto.

### Leyenda común del mapa ASCII
| Car. | Elemento |
| --- | --- |
| `#` | suelo/pared sólido (se fusiona en rectángulos) |
| `=` | nube: plataforma que se atraviesa desde abajo |
| `X` | plataforma falsa (desaparece al pisarla) |
| `v` | plataforma que cae al pisarla |
| `^` | pinchos (1 vela) |
| `S` `G` | inicio y meta |
| `C` | checkpoint (atril) |
| `F` `O` | foto y objeto |
| `B` | caja empujable |
| espacio o `.` | aire |

Cada nivel define el resto de caracteres en su `leyenda` (p. ej. `M: { tipo: 'miriam', pista: 'hola' }`).
En la leyenda, `capa: 'solidos'` y `fusion: 'h'` (o `'2d'`) hacen que caracteres seguidos formen un solo
rectángulo (plataformas, pinchos, teclas...). Si un elemento de un carácter tiene `h` > 1 (p. ej. una
puerta de 3 de alto), el carácter marca su casilla **de abajo**.
Los objetos con posición exacta o tamaño especial van en `objetos: [{ tipo, x, y, w, h, ...props }]`
(en casillas; `x, y` es la esquina superior izquierda, como en Tiled). Zonas como `gravedad`, `invertir`,
`peligro-movil`, `lluvia`, `aviso` o `final` suelen ir aquí.

### Tipos de objeto y propiedades
| Tipo | Propiedades |
| --- | --- |
| `solido`, `nube` | `estilo`, `mundo` (`A`/`B`) |
| `plataforma-movil` | `dx`, `dy` (casillas), `duracion` (ms ida), `desfase`, `estilo` (`nube`/`solido`) |
| `plataforma-cae` | `modo` (`cae`/`hunde`), `retardo` (ms), `profundidad` (casillas, hunde), `velocidad` |
| `plataforma-falsa` | `modo` (`desaparece`/`fantasma`: se ve sólida pero se atraviesa) |
| `plataforma-temporizada` | `on`, `off`, `desfase` (ms; o pulsos si `ritmo: true`) |
| `plataforma-musical` | `modo` (`aparece`/`mueve`), `dx`, `dy`, `duracion`, `global` |
| `tecla` | `nota` (`C4`, `F#4`...), `grupo` |
| `campana` | `nota`, `grupo` (suena al cantar cerca) |
| `puerta` | `grupo`, `secuencia` (`"C5,E5,G5"`), `oculta` (no muestra las notas; cantar junto a la puerta la hace tocar su melodía) |
| `caja`, `mueble` | `estilo` (`juguete`/`madera`/`carton`/`libros`), `pesada`, `fija` |
| `enemigo` | `clase` (`patrullero`/`volador`/`bloqueador`/`ladron`/`desafinado`), `sprite`, `velocidad`, `rango`, `amplitud`, `periodo`, `eliminable` (`salto,caja,canto`), `canto` (`dormir`/`huir`/`enfadar`/`apartar`/`invertir`/`nada`), `danio`, `escala` |
| `pinchos` | `danio`: 1 hasta el nivel 9; 2 desde el 10 (ya no hay de 1); 3 desde el 13 |
| `lluvia` | `intervalo` (ms), `texturas`, `velocidad`, `danio` |
| `peligro-movil` | `dir` (`arriba`/`derecha`), `velocidad` (px/s), `desdeX` (casilla que lo activa; no se ve ni mata hasta entonces; si Sofía reaparece en un atril anterior, vuelve a esperar), `hastaX`/`hastaY` (casilla donde se para), `margen`, `color`, `danio` |
| `meta-falsa` | `dx` (casillas que huye), `pista` (lo que dice) |
| `miriam`, `cartel` | `pista` (clave en `config/texts.json` → `niveles[N].pistas`), `radio`; Miriam además admite `sprite` (figura fija de `sprites/miriam/<sprite>/cuerpo.png`, p. ej. `carton` en el nivel 15) |
| `aviso` | zona que muestra un texto una vez: `pista`, `duracion` |
| `invertir` | zona de controles invertidos |
| `gravedad` | zona con `factor` (0,4 = gravedad baja; −1 = invertida) |
| `muerte` | zona que quita `danio` velas |
| `devolver-cajas` | una caja que entra vuelve a su sitio: se pone donde una caja se quedaría inservible (contra una pared sin sitio para empujarla de vuelta, en un foso del que no sale). Solo afecta a las cajas |
| `final` | (solo nivel 18) empieza el camino blanco; su borde inferior marca la altura del suelo |
| `decorado` | `sprite`, `escala`, `angulo`, `delante` |
| `fondo` | `tema`: desde su x, el fondo pasa a ese tema (fundido suave) |

Propiedades del mapa (`props`): `tema` (fondo), `etapa` (si no, por edad), `musica`, `velas`, `gatas`, `gafas`, `mundos`, `teclas` (`bancal` para el huerto).
Temas de fondo: `cuna`, `parque`, `casa`, `guarderia`, `playa`, `fiesta`, `colegio`, `clase-musica`, `bosque`,
`conservatorio`, `ciudad-noche`, `verano`, `instituto`, `habitacion`, `concierto`, `examenes`, `viaje`, `biblioteca`, `escenario`,
`nieve`, `patinaje`, `danza`, `huerto`, `jardin`, `volcan`, `redes`, `aulas`, `universidad`.
