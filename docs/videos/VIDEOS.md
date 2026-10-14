# Vídeos de Sofía para sacar los fotogramas del personaje

La animación de Sofía se saca de vídeos generados con IA (Flow/Veo, Sora, Kling...) a partir de las hojas de
personaje de [`docs/concept-art/sofia`](../concept-art/sofia). De cada vídeo se extraen los fotogramas, se quita
el fondo verde y se montan las hojas de sprites del juego (`tools/video-a-sprites.mjs`).

El bebé, la niña y la preadolescente se animan **solo** con los fotogramas de sus vídeos (ya no tienen personaje SVG). Las demás
edades se siguen dibujando con el personaje SVG por piezas hasta que tengan sus vídeos. Qué tramo de cada vídeo va a cada
animación se decide en `tools/fotogramas-sofia.json`.

---

## 1. Nomenclatura

**`edad-clip-contenido.mp4`**, en minúsculas, sin tildes ni espacios. La edad usa los mismos nombres que el código
(`bebe`, `nina`, `preado`, `adolescente`, `adulta`) y el clip, la letra o número de su prompt (punto 5).

| Edad | Niveles | Clips |
| --- | --- | --- |
| Bebé | 0-2 | `bebe-A-gatas` · `bebe-B-gatas-acciones` · `bebe-C-pie` · `bebe-D-pie-acciones` · `bebe-E-pie-correr` |
| Niña | 3-7 | `nina-1-andar-correr` · `nina-2-saltos` · `nina-3-acciones` |
| Preadolescente | 8-12 | `preado-1-andar-correr` · `preado-2-saltos` · `preado-3-acciones` |
| Adolescente | 13-17 | `adolescente-1-andar-correr` · `adolescente-2-saltos` · `adolescente-3-acciones` · `adolescente-4-gafas` |
| Adulta | 18 | `adulta-1-andar-correr` · `adulta-2-saltos` · `adulta-3-acciones` · `adulta-4-tarta` |

- **saltos** = saltar, caer y doble salto. **acciones** = empujar, cantar, recibir un golpe y celebrar
  (el bebé no canta).
- **Versiones:** si se repite un clip, se añade `-v2`, `-v3`... (`bebe-A-gatas-v2.mp4`). No borres las anteriores
  hasta elegir: se puede coger el ciclo de andar de una versión y el salto de otra.
- **Carpetas:** si se acumulan, subcarpetas por edad (`docs/videos/bebe/`...).
- Los `.mp4` **no se suben a git** (pesan mucho y el juego solo usa los fotogramas extraídos).

### Estado

| Clip | Estado |
| --- | --- |
| `bebe-A-gatas` | ✅ En el juego: reposo, gatear, saltar y caer a gatas |
| `bebe-B-gatas-acciones` | ✅ En el juego: empujar, golpe y celebrar (sentada aplaudiendo) a gatas |
| `bebe-C-pie` | ✅ En el juego: reposo, andar, saltar y caer de pie |
| `bebe-D-pie-acciones` | ✅ En el juego: empujar, golpe y celebrar de pie |
| `bebe-E-pie-correr` | ✅ En el juego: correr de pie (nivel 2) |
| `nina-1-andar-correr` | ✅ En el juego: reposo, andar y correr. Se recorta la franja gris del suelo y la clave de sol que aparece a la izquierda |
| `nina-2-saltos` | ✅ En el juego: saltar, caer y la voltereta del doble salto (sin los fotogramas 130-140, que salen mal) |
| `nina-3-acciones` | ✅ En el juego: empujar (contra una caja que sale en el vídeo y se borra), cantar, golpe y celebrar |
| `preado-1-andar-correr` | ✅ En el juego: reposo, andar y correr |
| `preado-2-saltos` | ✅ En el juego: saltar, caer y la voltereta del doble salto (el vídeo va a 30 fps y la voltereta empieza ya girada) |
| `preado-3-acciones` | ✅ En el juego: empujar (se borra una raya que sale bajo las manos), cantar (en vaivén), golpe y celebrar. No tiene pose neutra: la referencia es el principio del canto |
| Resto de edades | ⏳ |

---

## 2. Qué acciones necesita el juego en cada edad

| Edad | Acciones |
| --- | --- |
| Bebé | A gatas (nivel 0): reposo, gatear, saltito, empujar, golpe. De pie (niveles 1 y 2): reposo, andar torpe, saltito, empujar, golpe, celebrar. En el nivel 2 ya corre; todavía no hace doble salto ni canta. |
| Niña | Reposo, andar, correr, saltar, caer, doble salto (desde el 4), empujar, cantar (desde el 6), golpe, celebrar. |
| Preadolescente | Todas las de la niña. |
| Adolescente | Todas, más la versión con gafas (niveles 15 y 17). |
| Adulta | Todas, más soplar las velas y la reverencia final. |

---

## 3. Antes de empezar

1. **Un vídeo por edad = varios clips.** Las herramientas generan clips de unos 8-10 segundos. Cada edad son 3-5
   clips que empiezan con el mismo bloque fijo (punto 4) y el mismo fotograma inicial, para que parezcan un vídeo
   continuo.
2. **Fotograma inicial.** Generar el vídeo a partir de una imagen es mucho más fiel que solo con texto. Pídele a
   ChatGPT, en la conversación de las hojas, este fotograma para cada edad:

   > El mismo personaje de la hoja [S1/S2/S3/S4/S5], mismo estilo exacto. Un solo dibujo, formato 16:9 horizontal:
   > el personaje de cuerpo entero, de pie en pose neutra, en vista de tres cuartos mirando a la derecha, centrado
   > y ocupando el 60 % del alto de la imagen. Los brazos un poco separados del cuerpo. Fondo verde croma liso
   > (#00FF00), sin suelo, sin sombras, sin texto.

   Para el bebé hace falta también uno **a gatas** (como la vista extra de S5).
3. **El personaje se anima en el sitio y la cámara no se mueve.** Si Sofía avanza por la pantalla o la cámara se
   mueve, los fotogramas no encajan entre sí. El fondo verde liso sirve para recortarla después.

---

## 4. Bloque fijo (al principio de TODOS los clips)

> Animación 2D de videojuego con el estilo idéntico a las imágenes de referencia: dibujo cartoon plano, contornos
> limpios y oscuros, colores planos, sin sombreado 3D, sin texturas, sin brillos realistas. El personaje es
> exactamente el de la referencia, con las mismas proporciones, la misma cara, el mismo pelo y la misma ropa, el
> lunar pequeño en la mejilla y el collar con el colgante dorado de clave de sol siempre visible. Cámara totalmente
> fija: plano general, sin zoom, sin paneo, sin cortes ni cambios de plano. Vista de tres cuartos: el personaje
> mira siempre hacia la derecha de la pantalla y nunca se gira hacia la cámara ni hacia la izquierda. Se anima en
> el sitio, como sobre una cinta de correr invisible: no avanza por la pantalla, el cuerpo queda centrado y los
> pies vuelven siempre a la misma línea de suelo invisible. Se ve el cuerpo entero en todo momento, con margen
> arriba y abajo, y con el mismo tamaño durante todo el vídeo (unos 60 % del alto). Fondo verde croma liso y
> uniforme (#00FF00): sin suelo, sin sombras, sin objetos, sin otros personajes, sin texto. Iluminación plana y
> constante. Sin desenfoque de movimiento ni profundidad de campo; contornos nítidos en cada fotograma. Movimiento
> fluido y bien espaciado, como una animación 2D tradicional a 24 fps. Entre una acción y la siguiente vuelve a
> la pose neutra y se queda quieta 1 segundo.


2D video game animation in the style identical to the reference images: flat cartoon drawing, clean and dark outlines, flat colors, no 3D shading, no textures, no realistic highlights. The character is exactly like the reference, with the same proportions, the same face, the same hair, and the same clothes, the small mole on the cheek, and the necklace with the gold treble clef pendant always visible. Camera completely fixed: full shot, no zoom, no panning, no cuts or changes of shot. Three-quarter view: the character always looks to the right of the screen and never turns toward the camera or the left. Animation in place, like on an invisible treadmill: they don't move across the screen, the body stays centered, and the feet always return to the same invisible ground line. The whole body is visible at all times, with margins above and below, and the same size throughout the video (about 60% of the height). Solid, uniform green chroma background (#00FF00): no ground, no shadows, no objects, no other characters, no text. Flat and consistent lighting. No motion blur or depth of field; sharp outlines in every frame. Smooth, well-spaced movement, like a traditional 2D animation at 24 fps. Between actions, returns to a neutral pose and stays still for 1 second.

---

## 5. Prompts por edad

En cada clip: **[Bloque fijo]** + **[Descripción]** de la edad + el texto del clip.

### Bebé (0-2 años)

**Adjunta:** S5 y el fotograma inicial (a gatas para A y B; de pie para C, D y E).

**`bebe-A-gatas`**
> [Bloque fijo] Bebé de 1 año con pelele azul cielo de volantes, rizos cortos castaño oscuro con flequillo y dos
> coletitas con flores azules. 0-1 s: a gatas quieta, respira y parpadea. 1-5 s: gatea en el sitio hacia la
> derecha, dos ciclos completos y regulares (mano y rodilla contrarias a la vez), con la cabeza levantada y
> sonriendo; el último fotograma coincide con el primero. 5-6 s: pose neutra a gatas. 6-8 s: da un saltito a gatas
> (se encoge, se impulsa, sube un poco y aterriza a gatas con un pequeño rebote).

**`bebe-B-gatas-acciones`**
> [Bloque fijo] (mismo bebé a gatas). 0-3 s: empuja con las manos y la cabeza algo invisible que tiene delante, a
> la derecha; hace fuerza, aprieta los ojos y se mueve un poco adelante y atrás, dos veces. 3-4 s: pose neutra.
> 4-6 s: recibe un golpe por delante: se echa hacia atrás, cierra los ojos con fuerza y hace una mueca de «¡ay!»;
> se recupera. 6-8 s: se sienta y celebra aplaudiendo, muy contenta.

**`bebe-C-pie`**
> [Bloque fijo] (mismo bebé, de pie). 0-1,5 s: quieta de pie, se balancea un poco y parpadea. 1,5-5,5 s: anda en
> el sitio hacia la derecha con pasitos torpes de bebé que empieza a andar, con los brazos algo levantados para
> mantener el equilibrio; dos ciclos completos, y el último fotograma coincide con el primero. 5,5-8 s: da un
> saltito con los dos pies: se agacha, sube un poco y aterriza flexionando las rodillas.

**`bebe-D-pie-acciones`**
> [Bloque fijo] (mismo bebé, de pie). 0-3 s: empuja con las dos manos algo invisible a su derecha, inclinada hacia
> delante, con pasitos cortos en el sitio. 3-5 s: recibe un golpe, se echa hacia atrás con los ojos cerrados y la
> mueca de «¡ay!», y se recupera. 5-8 s: celebra dando saltitos con los brazos arriba y riéndose.

**`bebe-E-pie-correr`** (nivel 2, cuando ya corre)
> [Bloque fijo] (mismo bebé, de pie). 0-1,5 s: quieta de pie en pose neutra, mirando a la derecha, y parpadea.
> 1,5-2,5 s: arranca a correr. 2,5-7 s: corre en el sitio hacia la derecha, como una niña de 2 años que acaba de
> aprender a correr: pasitos rápidos y cortos, el cuerpo un poco inclinado hacia delante, los brazos abiertos y
> doblados que se balancean para no perder el equilibrio, las coletitas rebotando y una sonrisa grande de emoción.
> Cuatro ciclos completos y regulares, siempre al mismo ritmo y sin avanzar por la pantalla; el último fotograma
> coincide con el primero. 7-8 s: frena y vuelve a la pose neutra de pie.

### Niña (3-7 años)

**Adjunta:** S4 y el fotograma inicial.
⚠️ **En el vídeo, las alas deben ser opacas.** Si son transparentes, el verde del fondo se ve a través de ellas y
no se pueden recortar.

**[Descripción]**
> Niña de 6 años disfrazada de hada: vestido azul marino de capas de tul con florecitas azules y lilas, lazo azul
> en la cintura, alas de hada de color lavanda pálido **opacas, no transparentes**, medias negras y botas azul
> marino. Pelo castaño oscuro ondulado, con flequillo y dos coletas altas con flores azules.

**`nina-1-andar-correr`**
> [Bloque fijo] [Descripción]. 0-1,5 s: quieta, respira suave, parpadea una vez y las alas se mueven un poco.
> 1,5-4,5 s: anda en el sitio hacia la derecha, dos ciclos completos con los brazos balanceándose; el último
> fotograma coincide con el primero. 4,5-8 s: corre en el sitio hacia la derecha, dos ciclos completos, inclinada
> hacia delante, con zancadas largas, los brazos doblados y las coletas rebotando; ciclo cerrado.

**`nina-2-saltos`**
> [Bloque fijo] [Descripción]. 0-3 s: salto vertical: se agacha para coger impulso, despega con los brazos arriba,
> llega al punto más alto, cae con los brazos abiertos y las piernas algo separadas, y aterriza flexionando las
> rodillas. 3-4 s: pose neutra. 4-8 s: doble salto: despega, y en el punto más alto da una voltereta completa hacia
> delante en el aire, hecha una bolita; luego cae y aterriza.

**`nina-3-acciones`**
> [Bloque fijo] [Descripción]. 0-2,5 s: empuja con las dos manos un objeto invisible a su derecha, inclinada hacia
> delante, con pasos cortos en el sitio y cara de esfuerzo. 2,5-5 s: canta con una mano en el pecho y la otra
> extendida, la cabeza un poco levantada, la boca en «O» y los ojos medio cerrados; se balancea suavemente.
> 5-6,5 s: recibe un golpe y se echa hacia atrás con los ojos cerrados, los dientes apretados y la cara de «¡ay!»,
> con los brazos levantados; se recupera. 6,5-8 s: celebra saltando con los dos brazos arriba y una sonrisa enorme.

### Preadolescente (8-12 años)

**Adjunta:** S3, S6 (referencia de las expresiones) y el fotograma inicial.

**[Descripción]**
> Chica de 10 años con vestido azul marino de flores lilas y azules, rebeca azul marino, medias oscuras y botas
> negras con hebilla. Melena castaño oscuro, ondulada hasta el pecho, con la raya al medio. Las expresiones de la
> cara son como en la hoja de expresiones adjunta.

**`preado-1-andar-correr`**, **`preado-2-saltos`** y **`preado-3-acciones`**: los mismos textos que los de la
niña, con esta descripción. En `preado-3-acciones`, el canto como en S7 (la mano en el pecho y la boca en «O»).

### Adolescente (13-17 años)

**Adjunta:** S1 (la principal), S6 (las caras), S7 (las poses) y el fotograma inicial.

**[Descripción]**
> Chica de 15 años con camiseta azul marino con una estrella azul claro, vaqueros anchos azul oscuro y zapatillas
> blancas con detalles azules. Melena larga, castaño oscuro y muy rizada hasta los hombros, con la raya al medio y
> mucho volumen. Las expresiones son las de la hoja de expresiones y las poses siguen la hoja de poses adjunta. El
> pelo rizado se mueve con naturalidad y algo de retraso respecto al cuerpo, pero sin exagerar.

**`adolescente-1-andar-correr`**, **`adolescente-2-saltos`** y **`adolescente-3-acciones`**: los mismos textos que
los de la niña, con esta descripción. Andar y correr como en S7; cantar con la mano en el pecho como en S7; golpe
con la mueca de dientes apretados y un ojo cerrado como en S6.

**`adolescente-4-gafas`** (niveles 15 y 17): el texto de `adolescente-1-andar-correr` añadiendo «*lleva unas gafas
redondas de montura negra, como en la hoja de expresiones*». Si no se hace, en esos dos niveles sale sin gafas.

### Adulta (18 años)

**Adjunta:** S2, S6 (es la misma cara), S7 (estilo de las poses) y el fotograma inicial.

**[Descripción]**
> Chica de 18 años con vestido de concierto azul noche sin mangas, escote corazón, cinturón dorado y un pentagrama
> con notas doradas en el bajo de la falda, hasta la rodilla. Zapatos azul marino de tacón con pulsera. Melena
> larga, castaño oscuro y muy rizada hasta la cintura, con la raya al medio. Expresiones como en la hoja de
> expresiones. Movimientos algo más elegantes y seguros.

**`adulta-1-andar-correr`**, **`adulta-2-saltos`** y **`adulta-3-acciones`**: los mismos textos que los de la
niña, con esta descripción (la falda se mueve al correr y al saltar).

**`adulta-4-tarta`**
> [Bloque fijo] [Descripción]. 0-1 s: pose neutra. 1-4 s: se inclina un poco hacia delante y a la derecha, coge
> aire (los hombros suben y los mofletes se hinchan) y sopla largo hacia la derecha, con los labios en «o» y los
> ojos cerrados, como apagando velas; no hay tarta ni velas en la imagen. 4-6 s: se incorpora y se ríe,
> emocionada, con las manos juntas en el pecho. 6-8 s: hace una reverencia de concierto hacia la derecha y vuelve
> a la pose neutra.

---

## 6. Del vídeo al juego

1. Deja el clip en `docs/videos` con su nombre.
2. En [`tools/fotogramas-sofia.json`](../../tools/fotogramas-sofia.json), apunta qué fotogramas van a cada
   animación (se cuentan desde 0, a los fotogramas por segundo del vídeo: casi siempre 24). Animaciones que entiende el juego: `reposo`, `andar`,
   `correr`, `saltar` (subida), `caer` (bajada), `doble` (voltereta del doble salto), `empujar`, `cantar`, `danio`
   (golpe), `celebrar` y `soplar`. Los ciclos (`bucle: true`) deben empezar y acabar en la misma postura.
   Opciones para arreglar vídeos imperfectos: `recorte` (zona del vídeo que se usa, para quitar suelos o dibujos
   que se cuelan), `limpiar` (en una zona borra todo menos los colores indicados: quita la caja que empuja y deja
   las manos), `sin` (tramo de fotogramas que se salta), `sueltos` (borra los trozos pequeños sueltos del cuerpo, como un rizo suelto: `0.02` = menores que el 2 % del
   dibujo), `vaiven` (el bucle va y vuelve, para tramos que no acaban
   en la postura en que empiezan), `anclar: "pies"` (en los saltos, los pies al suelo:
   la altura la pone el juego), `anclar: "centro"` (voltereta) y `centrar` (si en ese tramo se ha desplazado).
3. `npm run fotogramas`: quita el verde, alinea los pies, escala al tamaño del juego y genera las hojas en
   `assets/sprites/sofia/<edad>/fotogramas` y el índice `assets/sprites/sofia/fotogramas.json`.
4. **Empujar:** la herramienta mide en cada fotograma hasta dónde llegan las manos, y el juego retrasa el dibujo
   para que se apoyen justo en el borde de la caja (sin traspasarla). Por eso, en el tramo de empujar las manos
   tienen que ser lo más adelantado del dibujo, y si en el vídeo sale una caja hay que borrarla con `limpiar`.
5. Las edades sin vídeo se dibujan con el personaje SVG por piezas (al empujar, las manos se apoyan igual en la
   caja). Con gafas también se usa el SVG.
6. **Miriam:** sus vídeos se configuran igual, en [`tools/fotogramas-miriam.json`](../../tools/fotogramas-miriam.json)
   (`npm run fotogramas -- miriam` para generar solo los suyos). Miriam no se mueve: necesita `callada-der`,
   `habla-der`, `habla-izq`, `callada-izq` y un giro pasando por la vista de frente, con el nombre del lado en el que
   acaba (`girar-izq` o `girar-der`; el otro sentido el juego lo reproduce hacia atrás). Mira siempre hacia Sofía y mueve la boca mientras se escribe su
   bocadillo. Van con vídeo la niña (`nina_Miriam.mp4`, niveles 0-2) y la preadolescente (`preado-Miriam.mp4`, niveles 3-7);
   la adolescente y la adulta siguen en SVG.

## 7. Consejos al generar

- **Repite un clip hasta que salga bien.** Revisa sobre todo que no avance por la pantalla, que la cámara no se
  mueva, que no cambie la cara ni la ropa y que no gire hacia la cámara.
- **Si la herramienta lo hace 3D o realista**, añade al bloque fijo: «*no 3D, no render, no estilo Pixar; animación
  2D plana dibujada a mano*». Si entiende mal algo, prueba el mismo texto traducido al inglés.
- **Descarga los vídeos con la máxima resolución**, sin recortar ni comprimir, y déjalos en esta carpeta con su
  nombre (punto 1).
- **Para ir hacia la izquierda, el juego voltea la imagen**, así que el lunar y la estrella de la camiseta cambian
  de lado. Para evitarlo habría que generar también los clips mirando a la izquierda (el doble de trabajo).
