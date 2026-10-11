# Diseño de niveles

Diseño escrito de los 19 niveles (parte 1) y guía técnica para construirlos (parte 2).
Las ambientaciones son las propuestas por defecto de la SPEC: cuando Miriam pase recuerdos
reales de algún año (fecha límite: 19 oct), ese nivel se adapta.

Reglas comunes (SPEC §5): 3-4 tramos separados por checkpoints (atriles), cada tramo con una
idea principal; foto y objeto en zonas opcionales y difíciles; Miriam al menos una vez, cerca del
puzle más complicado; al menos una broma o trampa graciosa por nivel; nunca más de ~3 minutos
entre checkpoints. La dificultad sube claramente de un nivel al siguiente.

---

## Parte 1 · Diseño por nivel

### Nivel 0 · Año 0 · La cuna — ∞ velas
- **Foco:** tutorial a gatas: moverse, saltar, empujar.
- **Tramos:** (1) primeros pasos: escalón y hueco de una casilla; (2) la caja: empujarla hasta el
  muro para subir; (3) el pato de goma y la broma; (4) puzle de las dos cajas: tirar una caja desde
  el estante para que caiga encima de la otra.
- **Broma:** cartel «¡Este suelo es 100% seguro! Firmado: nadie», y el suelo se hunde en una piscina de bolas.
- **Foto:** en lo alto de una escalera de nubes que exige saltos precisos.
- **Objeto (chupete):** en una habitación secreta tras una pared falsa al final (la delata una nota dorada).
- **Miriam:** al principio (se presenta) y junto al puzle de las cajas.
- **Estado:** ✅ construido (`tools/niveles/nivel-00.mjs`).

### Nivel 1 · 1 año · El parque — 1 vela
- **Foco:** saltos precisos y primer enemigo. Ya anda de pie. Con una sola vela, cada error devuelve al atril.
- **Tramos:** (1) arenero con montículos de 1-2 casillas y huecos de 2; (2) los columpios:
  plataformas móviles que van y vienen; (3) patos y cochecitos patrullando entre huecos (saltarles
  encima o esquivarlos); (4) el tobogán: bajada con huecos y una plataforma que se cae.
- **Broma:** un cochecito de juguete que «patrulla» en círculos sobre una plataforma minúscula y nunca se mueve de ahí... hasta que te acercas.
- **Foto:** encima del columpio más alto, saltando en el punto alto de su recorrido.
- **Objeto (sonajero):** debajo del tobogán, en una cornisa a la que se llega dejándose caer con precisión.
- **Miriam:** antes de los columpios («espera a que el columpio venga hacia ti»).

### Nivel 2 · 2 años · La casa vista a ras de suelo — 2 velas
- **Foco:** **correr** (mantener la flecha 0,5 s) y objetos que caen.
- **Tramos:** (1) el pasillo: huecos de 4-5 casillas entre muebles que solo se pasan corriendo;
  (2) la cocina: lluvia de juguetes desde la encimera (zonas `lluvia`), hay que correr entre ellos;
  (3) el salón: subir por el sofá y las estanterías con cajas; (4) la escalera: carrera final con huecos largos.
- **Broma:** un cartel «No corras por casa» justo antes del hueco que solo se puede saltar corriendo.
- **Foto:** en lo alto de la estantería (tramo 3), pasando por una repisa que se cae.
- **Objeto (patito):** en la bañera, al fondo de un pasillo lateral con lluvia de juguetes muy densa.
- **Miriam:** en el salón, junto a las cajas.

### Nivel 3 · 3 años · La guardería — 3 velas
- **Foco:** puzles de cajas básicos (empujar, apilar, usar cajas como escalón y como escudo).
- **Tramos:** (1) torre de cubos: dos cajas para subir un muro de 4; (2) caja-puente: tirar una caja a un
  foso de pinchos para poder pasar por encima; (3) las mochilas patrulleras: bloquearlas con una caja;
  (4) gran puzle: tres cajas a distintas alturas que hay que bajar en orden.
- **Broma:** una caja «pesada» (mueble) que no se mueve nada... salvo que la empujes desde el otro lado, donde resbala sola.
- **Foto:** sobre una torre que requiere apilar las tres cajas del último puzle de forma distinta a la «obvia».
- **Objeto (ceras):** en un hueco bajo el suelo al que se accede tras dejar caer una caja que tapa la entrada.
- **Miriam:** junto al gran puzle final.

### Nivel 4 · 4 años · La playa — 4 velas
- **Foco:** **doble salto** y plataformas que se hunden (`plataforma-cae` modo `hunde`).
- **Tramos:** (1) dunas con huecos de 6-7 casillas (doble salto); (2) el muelle: tablas que se hunden
  al pisarlas sobre el agua (caer al agua = vela); (3) castillos de arena (plataformas que caen) y
  mosquitos voladores; (4) las rocas: doble salto vertical por una pared de nubes.
- **Broma:** un mosquito gigante que da miedo... y se va volando en cuanto te acercas.
- **Foto:** en una nube alta sobre el agua, solo con doble salto perfecto desde una tabla hundiéndose.
- **Objeto (cubo de playa):** al final de un muelle lateral que se hunde muy rápido.
- **Miriam:** antes del muelle.

### Nivel 5 · 5 años · La fiesta de cumpleaños — 5 velas
- **Foco:** primer **nivel-trampa** (estilo That Level Again): nada es lo que parece.
- **Tramos:** (1) la meta está al principio... y sale corriendo (`meta-falsa`); (2) suelo de globos:
  algunos bloques son falsos (`plataforma-falsa`) y otros, que parecen aire, son paredes falsas transitables;
  (3) la piñata: pinchos que «son de decoración» (no lo son) y regalos-caja para apilar; (4) la tarta
  de mentira: un camino que solo existe si caminas «hacia atrás» un rato (zona `invertir`).
- **Broma:** el nivel entero; Miriam confiesa en el último tramo que el cartel del principio mentía.
- **Foto:** detrás de una pared que parece sólida.
- **Objeto (corona):** en lo alto, sobre una nube que solo aparece cuando la meta falsa sale huyendo.
- **Miriam:** en el tramo 2 (te dice justo lo contrario de lo que hay que hacer, y luego se disculpa).

### Nivel 6 · 6 años · El primer cole — 6 velas
- **Foco:** **cantar** (desbloqueo narrativo: empieza a estudiar música) y primeras puertas-melodía.
- **Tramos:** (1) el patio: plataformas musicales que aparecen al cantar cerca; (2) el pasillo: puertas
  de 2-3 notas con campanas (Simón dice); (3) las mochilas dormilonas (cantar las duerme) y el profesor
  bloqueador que se aparta si le cantas; (4) el aula: puerta de 4 notas con las campanas repartidas en alturas.
- **Broma:** un profesor bloqueador que, en vez de apartarse, se queda dormido... encima de la salida (hay que rodearlo).
- **Foto:** sobre una cadena de plataformas musicales que hay que encadenar sin dejar de cantar.
- **Objeto (mochila):** tras una puerta-melodía oculta (sin notas a la vista: hay que escucharla).
- **Miriam:** en el pasillo de las puertas.

### Nivel 7 · 7 años · La clase de música — 7 velas
- **Foco:** **teclas de piano gigantes**: suelo que suena y abre caminos con la melodía correcta.
- **Tramos:** (1) teclado-escalera (cada tecla una nota); (2) melodía de 4 teclas para abrir la puerta,
  con metrónomos desafinados (si cantas cerca, invierten los controles); (3) teclas que se hunden y
  plataformas musicales; (4) gran piano: melodía de 6 notas con teclas en dos alturas.
- **Broma:** la primera puerta se abre tocando «el himno de la alegría»... y lo que se abre es un armario con un metrónomo.
- **Foto:** encima del gran piano, tocando una melodía secreta (el inicio de «Cumpleaños feliz»).
- **Objeto (partituras):** en el foso del piano, entre pinchos.
- **Miriam:** junto al gran piano.

### Nivel 8 · 8 años · La excursión al bosque — 8 velas
- **Foco:** **enemigos ladrones** y persecución.
- **Tramos:** (1) el sendero: primeras urracas (si te tocan con la foto u objeto, te lo roban y huyen);
  (2) el río: plataformas móviles mientras persigues a una urraca; (3) los árboles: subida vertical con
  nubes y mosquitos; (4) el claro: urraca final rápida que hay que acorralar contra un muro con cajas.
- **Broma:** una urraca que roba... un calcetín imaginario y te lo devuelve muy ofendida.
- **Foto:** pronto en el nivel y fácil de coger, pero con urracas por todo el camino (hay que protegerla).
- **Objeto (brújula):** en la copa del árbol más alto.
- **Miriam:** en el claro.

### Nivel 9 · 9 años · El conservatorio — 9 velas
- **Foco:** **melodías largas bajo presión**.
- **Tramos:** (1) pasillos de campanas con melodías de 5 notas; (2) sala de ensayo con un peligro que
  avanza desde la izquierda (`peligro-movil`, «la profesora de solfeo con prisa») mientras tocas;
  (3) escalera de teclas temporizadas; (4) audición: melodía de 7 notas con campanas en plataformas musicales.
- **Broma:** una puerta que pide la melodía... y al tocarla bien se abre la de al lado.
- **Foto:** en la sala de ensayo, en una desviación que te deja muy cerca del peligro que avanza.
- **Objeto (metrónomo):** tras una puerta-melodía oculta de 5 notas.
- **Miriam:** antes de la audición.

### Nivel 10 · 10 años · La ciudad de noche — 10 velas
- **Foco:** **peligros de 2 velas** y **plataformas temporizadas**.
- **Tramos:** (1) azoteas con farolas temporizadas; (2) carteles luminosos que se encienden y apagan sobre
  pinchos de 2 velas; (3) aviones de papel en onda; (4) carrera por cables (nubes) con plataformas que caen.
- **Broma:** un semáforo para peatones (plataforma temporizada) que está en rojo justo cuando llegas, siempre.
- **Foto:** en la azotea más alta, encadenando tres farolas temporizadas.
- **Objeto (farolillo):** en un callejón bajo la ciudad lleno de pinchos de 2 velas.
- **Miriam:** en la carrera por cables.

### Nivel 11 · 11 años · Vacaciones de verano — 11 velas
- **Foco:** **combinación** de cajas + canto + enemigos.
- **Tramos:** (1) piscina: cajas flotantes (plataformas que se hunden) y patos dormidos con canto;
  (2) chiringuito: puzle de cajas con plataformas musicales; (3) camping: mochilas, mosquitos y
  desafinados juntos; (4) puesta de sol: puerta-melodía de 5 notas en una zona con plataformas que caen.
- **Broma:** cantar para dormir al pato... y se despiertan todos los demás (`canto: enfadar`).
- **Foto:** sobre la sombrilla más alta (cajas apiladas encima de plataforma musical).
- **Objeto (gafas de sol):** bajo el agua (zona de gravedad baja: «buceando»).
- **Miriam:** en el chiringuito.

### Nivel 12 · 12 años · Primer día de instituto — 12 velas
- **Foco:** **gravedad y controles cambiantes** (estilo That Level Again).
- **Tramos:** (1) pasillo con zonas de controles invertidos; (2) el gimnasio: gravedad baja (`factor` 0,4);
  (3) la escalera al revés: gravedad invertida (`factor` −1), se camina por el techo; (4) mezcla de las
  tres con examenes-bloqueadores.
- **Broma:** un cartel «Por aquí no» con la flecha al revés, en la zona de controles invertidos.
- **Foto:** en el techo del gimnasio, solo alcanzable con gravedad invertida.
- **Objeto (agenda):** en una taquilla al fondo de la zona invertida.
- **Miriam:** al empezar la escalera al revés.

### Nivel 13 · 13 años · La habitación adolescente y el móvil gigante — 13 velas
- **Foco:** **enemigos notificación** y **la interfaz que miente**.
- **Tramos:** (1) la habitación: notificaciones voladoras; (2) dentro del móvil: un aviso «¡Nivel
  completado!» falso (zona `aviso`) y una meta falsa; (3) apps-plataformas que se cierran (temporizadas)
  y avisos que te dicen cosas falsas; (4) modo avión: tramo de controles invertidos con notificaciones.
- **Broma:** «Batería baja: 1%»... y en lugar de apagarse, todo el nivel sigue igual (pero lo crees).
- **Foto:** en la galería del móvil, tras una pared falsa.
- **Objeto (primer móvil):** en un cajón del escritorio, protegido por notificaciones.
- **Miriam:** dentro del móvil (avisa de que no te fíes de los avisos).

### Nivel 14 · 14 años · La audición — 14 velas
- **Foco:** **ritmo**: secciones a compás de la música (`plataforma-temporizada` con `ritmo`).
- **Tramos:** (1) entre bastidores: plataformas a negras; (2) el foso de la orquesta: plataformas a corcheas
  y metrónomos; (3) el escenario: campanas que hay que tocar a tiempo mientras las plataformas laten;
  (4) ovación final: carrera a ritmo con pinchos de 2 velas.
- **Broma:** un metrónomo desafinado que, si le cantas, en lugar de invertir los controles cambia el tempo.
- **Foto:** en el palco, sobre plataformas a contratiempo.
- **Objeto (entrada):** debajo del escenario.
- **Miriam:** entre bastidores («cuenta: un, dos, tres...»).

### Nivel 15 · 15 años · Exámenes — 15 velas
- **Foco:** **peligros de 3 velas** y **escape vertical** (`peligro-movil` hacia arriba: la marea de apuntes).
- **Tramos:** (1) la biblioteca: subida con pilas de exámenes bloqueadores; (2) escape vertical por estanterías;
  (3) zona de pinchos de 3 velas («el suspenso»); (4) escape final más rápido con plataformas que caen.
- **Broma:** un examen sorpresa (bloqueador) que aparece de golpe... con la nota «10» (y se aparta solo).
- **Foto:** en un saliente lateral durante el escape vertical (arriesgado: hay que desviarse).
- **Objeto (boli de la suerte):** sobre los pinchos de 3 velas.
- **Miriam:** al principio del escape.

### Nivel 16 · 16 años · El viaje — 16 velas
- **Foco:** **mundo que cambia al cantar** (dos versiones del nivel: A de día, B de noche).
- **Tramos:** (1) la estación: puentes que solo existen en un mundo; (2) el tren: pinchos que solo existen
  en el otro; (3) la montaña: alternar mundos en el aire; (4) la ciudad nueva: puerta-melodía cuyas
  campanas están repartidas entre los dos mundos.
- **Broma:** una maleta (caja) que en el otro mundo es... la misma maleta, pero con gafas.
- **Foto:** en un mirador que solo existe en el mundo B, rodeado de pinchos del mundo A.
- **Objeto (maleta):** en el andén del tren.
- **Miriam:** en la estación.

### Nivel 17 · 17 años · Selectividad y biblioteca — 17 velas
- **Foco:** **combinación de todas las mecánicas**, laberinto.
- **Tramos:** (1) laberinto de estanterías con paredes falsas y cajas; (2) sala de estudio: canto, campanas y
  plataformas musicales; (3) el examen: gravedad invertida + temporizadas + notificaciones; (4) la nota:
  escape con peligro que avanza y puertas-melodía.
- **Broma:** el «temario» es una pared enorme... que es falsa y se atraviesa.
- **Foto:** en el centro del laberinto.
- **Objeto (auriculares):** en la sala de estudio, tras una melodía oculta.
- **Miriam:** en el laberinto («yo me perdí aquí también»).

### Nivel 18 · 18 años · El gran concierto — 18 velas
- **Foco:** el nivel **más difícil** y el final abierto (SPEC §7).
- **Tramos:** (1) bastidores: repaso de cajas, correr y doble salto con peligros de 3 velas;
  (2) el foso: ritmo + canto + mundos; (3) el escenario: todas las mecánicas a la vez;
  (4) el último tramo, el más difícil del juego. Donde debería estar la meta empieza la zona `final`:
  el escenario se desvanece, queda una pantalla blanca con solo el suelo, 60-90 s andando con piano
  suave, el cartel «Continuará...» (el nivel se guarda como completado) y, más allá, la tarta con 18 velas.
- **Foto:** en el palco del teatro.
- **Objeto (llave de los 18):** en el foso.
- **Miriam:** en el escenario, antes del último tramo (pista emotiva).

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
Los objetos con posición exacta o tamaño especial van en `objetos: [{ tipo, x, y, w, h, ...props }]` (en casillas).

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
| `puerta` | `grupo`, `secuencia` (`"C5,E5,G5"`), `oculta` (no muestra las notas) |
| `caja`, `mueble` | `estilo` (`juguete`/`madera`/`carton`/`libros`), `pesada`, `fija` |
| `enemigo` | `clase` (`patrullero`/`volador`/`bloqueador`/`ladron`/`desafinado`), `sprite`, `velocidad`, `rango`, `amplitud`, `periodo`, `eliminable` (`salto,caja,canto`), `canto` (`dormir`/`huir`/`enfadar`/`apartar`/`invertir`/`nada`), `danio`, `escala` |
| `pinchos` | `danio` (1; 2 desde nivel 10; 3 desde nivel 15) |
| `lluvia` | `intervalo` (ms), `texturas`, `velocidad`, `danio` |
| `peligro-movil` | `dir` (`arriba`/`derecha`), `velocidad` (px/s), `desdeX` (casilla que lo activa), `margen`, `color`, `danio` |
| `meta-falsa` | `dx` (casillas que huye), `pista` (lo que dice) |
| `miriam`, `cartel` | `pista` (clave en `config/texts.json` → `niveles[N].pistas`), `radio` |
| `aviso` | zona que muestra un texto una vez: `pista`, `duracion` |
| `invertir` | zona de controles invertidos |
| `gravedad` | zona con `factor` (0,4 = gravedad baja; −1 = invertida) |
| `muerte` | zona que quita `danio` velas |
| `final` | (solo nivel 18) empieza el camino blanco; su borde inferior marca la altura del suelo |
| `decorado` | `sprite`, `escala`, `angulo`, `delante` |

Propiedades del mapa (`props`): `tema` (fondo), `etapa` (si no, por edad), `musica`, `velas`, `gatas`, `gafas`, `mundos`.
Temas de fondo: `cuna`, `parque`, `casa`, `guarderia`, `playa`, `fiesta`, `colegio`, `clase-musica`, `bosque`,
`conservatorio`, `ciudad-noche`, `verano`, `instituto`, `habitacion`, `concierto`, `examenes`, `viaje`, `biblioteca`, `escenario`.
