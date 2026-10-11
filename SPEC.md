# Especificación — Videojuego de cumpleaños de Sofía

Oct 11, 2026 · @Miriam

## 1. Resumen del proyecto

Un videojuego de plataformas y puzles 2D para móvil, con 19 niveles (del año 0 al 18), que Miriam regala a su hermana Sofía por su 18 cumpleaños. Entrega final: **3 de noviembre de 2026**, como enlace web instalable.

| Aspecto | Decisión |
| --- | --- |
| Jugadora | Sofía, 18 años, amante de la música clásica romántica y el color azul |
| Género | Mezcla de plataformas, puzles con objetos y niveles-trampa con humor |
| Referencias | BoxBoy (puzles con cajas), Super Mario 64 (habilidades de movimiento), That Level Again (niveles que engañan) |
| Plataforma | Navegador móvil, horizontal, controles táctiles |
| Idioma | Español |
| Tono | Gracioso, con momentos emotivos al final |
| Duración | Unos 10 minutos por nivel, unas 3 horas en total |
| Dificultad | Alta y muy progresiva: debe costarle terminarlo |

Todo el contenido (personajes, gráficos, música) será original o de dominio público. No se usarán personajes ni recursos de los juegos de referencia.

## 2. Personajes

### Sofía (protagonista)

Caricatura vectorial tipo cartoon, cabezón y proporciones de unos 3 cabezas de alto para que se lea bien en pantalla pequeña.

| Rasgo | Diseño |
| --- | --- |
| Pelo | Melena larga, negra, muy rizada, raya al medio. Es el rasgo más reconocible: se mueve con física sencilla al correr y saltar |
| Cara | Ojos grandes marrón oscuro, cejas marcadas, sonrisa amplia, lunar pequeño en la mejilla |
| Accesorio | Collar con clave de sol dorada, siempre visible. Brilla al cantar |
| Ropa | Tonos azules. Cambia con la edad del nivel (pelele, uniforme escolar, ropa adolescente, vestido) |
| Gafas | Solo aparecen como guiño en niveles concretos (por ejemplo, de lectura o estudio) |
| Altura relativa | 1,60 m: algo bajita respecto a Miriam y los objetos del escenario |

La apariencia evoluciona por tramos de edad: bebé (nivel 0-1), niña (2-7), preadolescente (8-12), adolescente (13-17) y adulta (18). El nivel 0 se juega a gatas.

**Animaciones necesarias:** reposo (con parpadeo), andar, correr, saltar, doble salto, caer, empujar, cantar, recibir daño, celebrar y soplar velas.

### Miriam (personaje de apoyo)

Aparece en puntos concretos de cada nivel para dar pistas con bocadillos de texto graciosos. No combate ni se puede controlar. Su diseño sigue el mismo estilo cartoon y crece también con los niveles.

- Pendiente: foto o descripción de Miriam para su caricatura.
- Pendiente: diferencia de edad entre hermanas, para saber cómo dibujarla en cada nivel.

## 3. Jugabilidad

### Controles táctiles (horizontal)

| Zona de pantalla | Control |
| --- | --- |
| Izquierda abajo | Cruceta virtual: izquierda y derecha. Mantener pulsado más de 0,5 s = correr |
| Derecha abajo | Botón Saltar (pulsar otra vez en el aire = doble salto) y botón Cantar |
| Arriba derecha | Pausa (reanudar, reiniciar nivel, volver al menú) |

Empujar no tiene botón: se empuja un objeto caminando contra él. Botones grandes (mínimo 64 px) y semitransparentes. Vibración breve al recibir daño si el móvil lo permite.

### Habilidades

| Habilidad | Desde el nivel | Uso |
| --- | --- | --- |
| Andar y saltar | 0 | Básico |
| Empujar | 0 | Cajas, bloques y muebles para alcanzar zonas altas o bloquear enemigos |
| Correr | 2 | Saltos largos y escapar de trampas |
| Doble salto | 4 | Plataformas lejanas y corrección en el aire |
| Cantar | 6 | Mecánica musical (abajo) |

Las habilidades se desbloquean de forma narrativa (por ejemplo, empieza a cantar cuando empieza a estudiar música). Si Sofía empezó piano a otra edad, se ajusta el nivel.

### Mecánica de cantar

Al pulsar Cantar, Sofía emite notas musicales visibles en un radio alrededor suyo y el collar brilla. Efectos:

- **Plataformas musicales**: aparecen o se mueven mientras canta.
- **Puertas-melodía**: hay que reproducir una secuencia de notas en un orden concreto, al estilo Simón Dice.
- **Enemigos sensibles**: algunos se duermen unos segundos, otros huyen, otros se enfadan más (trampa graciosa).
- **Teclas de piano gigantes**: suelo que suena al pisarlo y abre caminos si se pisa la melodía correcta.

Cantar tiene un breve tiempo de recarga (1,5 s) para que no se abuse.

### Enemigos

Los enemigos estorban más que atacan. Algunos se pueden eliminar (salto encima, caja encima, canto), otros solo esquivar o neutralizar temporalmente. Derrotarlos casi nunca es obligatorio.

| Tipo | Ejemplo según etapa | Comportamiento |
| --- | --- | --- |
| Patrullero | Pato de goma, juguete con ruedas, mochila andante | Va y viene; empuja a Sofía hacia atrás |
| Volador | Mosquito, avión de papel, notificación del móvil | Trayectorias en onda; quita una vida |
| Bloqueador | Profesor gigante, exámenes apilados | No se mueve; se aparta solo cantando o rodeando |
| Ladrón | Urraca, hermana pequeña imaginaria | Roba la foto u objeto si te toca y huye; hay que perseguirlo |
| Desafinado | Metrónomo loco, despertador | Si cantas cerca, invierte los controles unos segundos |

Los enemigos se diseñan con humor y nunca de forma violenta: al derrotarlos desaparecen en una nube de notas.

## 4. Vidas, checkpoints y reinicio

Cada nivel N empieza con N velas encendidas (nivel 0: vidas infinitas). Cada muerte apaga una vela; sin velas encendidas, el nivel se reinicia desde el principio.

- **Indicador**: fila de velas arriba a la izquierda, encendidas y apagadas. En niveles altos (más de 10 velas) se muestran en dos filas o como tarta con velas.
- **Muerte**: Sofía vuelve al último checkpoint con las velas que le quedan en ese momento. Las velas apagadas no se recuperan al volver al checkpoint.
- **Checkpoints**: un atril de partitura que se ilumina al tocarlo. Entre 2 y 4 por nivel según longitud, nunca más de 3 minutos de juego entre dos seguidos.
- **Daño**: cada golpe o caída mortal quita una vela. Desde el nivel 10 algunos peligros quitan 2 velas, y desde el nivel 15 algunos quitan 3.
- **Reinicio por agotar velas**: se pierden los checkpoints activados y la foto y el objeto cogidos en ese intento.
- **Coleccionables y muerte normal**: si muere con la foto u objeto ya cogidos, los conserva mientras le queden velas.
- **Guardado de coleccionables**: solo se guardan definitivamente al completar el nivel.
- **Sin vidas extra**: no hay forma de recuperar velas dentro del nivel, salvo que se decida añadir velas ocultas como recompensa (pendiente de decidir).

## 5. Estructura de los 19 niveles

Cada nivel representa un año de vida de Sofía, dura unos 10 minutos y es claramente más difícil que el anterior. La ambientación evoluciona de infantil a adolescente y adulta, siempre en tonos azules. Entre niveles solo aparece una pantalla de transición: «Sofía cumple N años».

| Nivel | Edad | Velas | Ambientación propuesta | Mecánicas nuevas o foco |
| --- | --- | --- | --- | --- |
| 0 | 0-1 | ∞ | Cuna, habitación del bebé, peluches gigantes | Tutorial: moverse a gatas, saltar, empujar |
| 1 | 1 | 1 | Parque y columpios | Saltos precisos, primer enemigo |
| 2 | 2 | 2 | Casa vista a ras de suelo | Correr, objetos que caen |
| 3 | 3 | 3 | Guardería | Puzles de cajas básicos |
| 4 | 4 | 4 | Playa o piscina | Doble salto, plataformas que se hunden |
| 5 | 5 | 5 | Fiesta de cumpleaños infantil | Primer nivel-trampa: elementos que engañan |
| 6 | 6 | 6 | Primer colegio | Cantar, primeras puertas-melodía |
| 7 | 7 | 7 | Clase de música | Teclas de piano gigantes |
| 8 | 8 | 8 | Bosque de excursión | Enemigos ladrones, persecución |
| 9 | 9 | 9 | Conservatorio | Melodías largas bajo presión |
| 10 | 10 | 10 | Ciudad de noche | Peligros de 2 velas, plataformas temporizadas |
| 11 | 11 | 11 | Vacaciones de verano | Combinación cajas + canto + enemigos |
| 12 | 12 | 12 | Instituto, primer día | Gravedad y controles cambiantes (estilo That Level Again) |
| 13 | 13 | 13 | Habitación adolescente, móvil gigante | Enemigos notificación, interfaz que miente |
| 14 | 14 | 14 | Concierto o audición | Ritmo: secciones a compás de la música |
| 15 | 15 | 15 | Exámenes | Peligros de 3 velas, escape vertical |
| 16 | 16 | 16 | Viaje | Mundo que cambia al cantar (dos versiones del nivel) |
| 17 | 17 | 17 | Selectividad y biblioteca | Combinación de todas las mecánicas, laberinto |
| 18 | 18 | 18 | Escenario de concierto final | El más difícil, y luego final abierto (sección 7) |

Las ambientaciones son propuestas por defecto. Miriam dará recuerdos reales de algunos años y esos niveles se adaptarán a ellos.

### Reglas de diseño de nivel

- Un nivel se divide en 3-4 tramos separados por checkpoints, cada uno con una idea principal.
- La foto y el objeto están en zonas opcionales y difíciles, nunca en el camino directo.
- Miriam aparece al menos una vez por nivel, cerca del puzle más complicado.
- Cada nivel incluye al menos una broma visual o trampa graciosa.
- Los niveles se describen en archivos de datos (JSON) separados del código para poder ajustarlos sin tocar el motor.

## 6. Coleccionables y menús

Cada nivel esconde una foto y un objeto. Juntos cuentan la historia de Sofía: al abrirlos en la galería se ve la foto real o el objeto con un texto breve sobre ese año.

### Fotos

- Una por nivel (19 en total), aportadas por Miriam.
- Mientras no lleguen, se usa un marco con placeholder.
- El tamaño de visualización se define en un archivo de configuración (ancho, alto, recorte) para ajustarlo sin tocar código. Formatos admitidos: JPG o WebP, recomendado 1200 px de lado largo.
- Cada foto lleva un pie de texto editable.

### Objetos

- Uno por nivel, dibujado en el mismo estilo vectorial (por ejemplo: chupete, primer libro de partituras, metrónomo, primer móvil).
- Lista de objetos pendiente de Miriam; mientras tanto se proponen objetos genéricos según la edad.

### Pantalla de inicio

| Botón | Función |
| --- | --- |
| Jugar / Continuar | Va al siguiente nivel no completado |
| Niveles | Mapa de los 19 niveles para repetir los ya jugados |
| Álbum de fotos | Galería de fotos conseguidas; las no conseguidas aparecen como silueta con «?» |
| Objetos | Vitrina de objetos conseguidos; los no conseguidos en silueta |
| Opciones | Volumen de música y efectos, borrar partida |

### Menú de niveles

Cada casilla de nivel muestra su número y su estado:

- **Bloqueado**: candado, no se puede jugar.
- **Disponible o completado**: se puede jugar o repetir.
- **Icono de foto**: aparece solo si se consiguió la foto de ese nivel.
- **Icono de objeto**: aparece solo si se consiguió el objeto.

La ausencia de icono indica que falta ese coleccionable. Al repetir un nivel se pueden conseguir los coleccionables que faltan.

## 7. El final: nivel 18, «continuará» y la tarta

El nivel 18 nunca termina, porque Sofía acaba de cumplir esa edad. La secuencia final es:

1. Sofía supera el último tramo, el más difícil del juego.
2. Donde debería estar la meta, el escenario se va desvaneciendo hasta quedar una pantalla blanca con solo el suelo.
3. Sofía puede seguir andando en línea recta durante bastante rato (unos 60-90 segundos), sin enemigos ni música, solo un piano suave.
4. Aparece un cartel: «Continuará...». El nivel se marca como completado y se guarda.
5. Si sigue andando más allá del cartel (recompensa secreta para la curiosa), llega a una tarta de cumpleaños con 18 velas encendidas.
6. Al llegar a la tarta, la cámara se acerca. Sofía sopla deslizando el dedo por la pantalla: por donde pasa el dedo sale una ráfaga de aire que apaga las velas que toca.
7. Con las 18 velas apagadas, sale confeti de notas musicales y aparece el mensaje personal de Miriam.

- El mensaje de Miriam se guarda en un archivo de texto aparte para poder escribirlo al final. Pendiente de Miriam.
- Tras el mensaje, la escena de la tarta queda accesible desde la pantalla de inicio para volver a verla.
- Opcional: soplar también con el micrófono del móvil. Requiere permiso del navegador, así que solo se añade como extra si sobra tiempo.

## 8. Arte, música y sonido

### Dirección de arte

Estilo vectorial cartoon, contornos limpios, paleta dominada por azules. Cada etapa de edad tiene su propia paleta:

| Etapa | Niveles | Paleta y estilo |
| --- | --- | --- |
| Bebé | 0-1 | Azul cielo pastel, blancos, formas muy redondeadas |
| Infancia | 2-7 | Azules vivos con acentos amarillos, dibujos tipo cuento |
| Preadolescencia | 8-12 | Azul turquesa y verde, más detalle en fondos |
| Adolescencia | 13-17 | Azul marino, violeta y neón suave, estética de móvil y redes |
| Adulta | 18 | Azul noche y dorado, elegante, ambiente de sala de conciertos |

Fondos con 2-3 capas de parallax. Interfaz con la clave de sol como motivo gráfico recurrente.

### Música

Obras de compositores románticos e impresionistas, todas de dominio público como composición. No se usan grabaciones comerciales: se transcriben a MIDI o a datos de notas y se reproducen con un sintetizador de piano en el navegador, o se usan grabaciones con licencia libre (por ejemplo, de Musopen, verificando la licencia de cada una).

| Momento | Propuesta |
| --- | --- |
| Pantalla de inicio | Debussy, *Clair de lune* (tema principal) |
| Niveles bebé e infancia | Schumann, *Escenas de niños*; Debussy, *Children's Corner* |
| Niveles preadolescencia | Chopin, valses (Op. 64) |
| Niveles adolescencia | Chopin, *Fantasía-Impromptu*; Schubert, *Impromptus* (Op. 90) |
| Nivel 18 | Chopin, *Balada n.º 1* |
| Camino blanco y tarta | Debussy, *Arabesque n.º 1* y una versión suave de «Cumpleaños feliz» |

La música se acelera ligeramente cuando a Sofía le queda una sola vela.

### Efectos de sonido

Salto, doble salto, aterrizaje, empuje, canto (notas reales afinadas), daño, vela apagándose, checkpoint, coleccionable conseguido y nivel completado. Se generan con la herramienta jsfxr o se sintetizan con código para evitar problemas de licencia.

## 9. Arquitectura técnica

Juego web en JavaScript con el motor Phaser 3, empaquetado como PWA (aplicación web instalable) y publicado en Cloudflare Pages desde un repositorio de GitHub.

| Componente | Tecnología |
| --- | --- |
| Motor | Phaser 3 con física Arcade (plataformas 2D) |
| Lenguaje | JavaScript o TypeScript, empaquetado con Vite |
| Editor de niveles | Tiled (gratuito), exporta cada nivel a JSON |
| Gráficos | SVG convertido a atlas de sprites PNG; personaje por piezas animado con tweens o con Spine/DragonBones |
| Audio | Web Audio API vía Phaser; música en OGG/MP3 o sintetizada con Tone.js |
| Guardado | localStorage del navegador |
| Instalación | Manifest PWA + service worker para jugar sin conexión tras la primera carga |
| Alojamiento | GitHub (código) + Cloudflare Pages (despliegue automático en cada cambio) |

### Estructura del proyecto

```
/src
  /scenes      Boot, Menú, Niveles, Galerías, Juego, Final
  /entities    Sofía, Miriam, enemigos, cajas
  /systems     velas, checkpoints, canto, guardado
/assets
  /levels      nivel-00.json ... nivel-18.json (Tiled)
  /sprites     personajes, enemigos, objetos
  /photos      foto-00.jpg ... foto-18.jpg (placeholders)
  /music
/config
  photos.json  tamaños, recortes y pies de foto
  texts.json   pistas de Miriam, nombres de niveles, mensaje final
```

### Guardado de partida

Se guarda automáticamente al completar un nivel: niveles desbloqueados y completados, fotos y objetos conseguidos por nivel, y si se ha visto la tarta. Si se borran los datos del navegador se pierde el progreso; Opciones incluye borrar partida con confirmación.

### Requisitos de rendimiento

- 60 fps en móviles de gama media de los últimos 4 años.
- Carga inicial menor de 10 MB; cada nivel se carga por separado.
- Funciona en Chrome Android y Safari iOS. En iOS, el audio solo arranca tras el primer toque (limitación del sistema).
- Pantalla horizontal forzada; aviso de «gira el móvil» si está en vertical.

### Entrega

Enlace de Cloudflare Pages (gratuito). Sofía lo abre en el móvil y usa «Añadir a pantalla de inicio» para tenerlo como una app con icono propio.

## 10. Herramientas de IA y flujo de trabajo

El juego se desarrolla con IA en todas las fases, pero Miriam decide, revisa y prueba. Cada herramienta tiene un papel concreto para evitar mezclar estilos o perder coherencia.

| Tarea | Herramienta | Qué hace | Quién revisa |
| --- | --- | --- | --- |
| Especificación y diseño de niveles | Claude (claude.ai) | Esta especificación, diseño de cada nivel por escrito, textos y pistas de Miriam | Miriam |
| Programación | Antigravity o Claude Code (agente de código) | Escribe el motor, las escenas, los sistemas y carga los niveles; trabaja sobre el repositorio de GitHub | Miriam, probando en el móvil |
| Concept art del personaje | ChatGPT (generación de imágenes) | Imagen de referencia de Sofía cartoon a partir de la foto, y hoja de personaje frontal, perfil y espalda | Miriam |
| Personaje vectorial final | Claude o Antigravity (código SVG) + Inkscape para retoques | Redibuja el concept como SVG separado por piezas (cabeza, pelo, torso, brazos, piernas) para animarlo | Miriam |
| Animaciones del personaje | Por código (tweens de Phaser) o DragonBones | Anima las piezas: andar, saltar, cantar… Siempre consistente | Miriam |
| Fondos y objetos | ChatGPT (imágenes) o SVG por código | Fondos por etapa y los 19 objetos coleccionables, con la misma paleta | Miriam |
| Cinemática opcional | Google Flow (vídeo) | Solo para una intro o tráiler en vídeo, no para sprites | Miriam |
| Mapas de nivel | Tiled + agente de código | La IA genera el JSON del nivel a partir del diseño escrito; se retoca a mano en Tiled | Miriam, jugando |
| Música | MIDI de dominio público (Mutopia Project, IMSLP) + Tone.js con samples de piano libres | Piano sintetizado en el navegador | Miriam |
| Efectos de sonido | jsfxr o síntesis por código | Sonidos cortos sin licencias | Miriam |

### Por qué no usar Google Flow para las animaciones

El flujo anterior de Miriam (imagen base en ChatGPT, ángulos en Google Flow y montaje en Antigravity) funciona para vídeos, pero en un juego genera tres problemas: cada fotograma sale ligeramente distinto, las imágenes son rasterizadas y pesan mucho, y no se pueden reutilizar piezas entre animaciones. Un personaje SVG por piezas es idéntico en todas las poses, pesa pocos KB y se le puede cambiar la ropa por etapa cambiando solo una pieza.

### Reglas para trabajar con los agentes

- Esta especificación se guarda en el repositorio como `SPEC.md` y se le pasa al agente en cada sesión.
- Se pide una funcionalidad por sesión, con criterio de aceptación claro (por ejemplo: «el doble salto funciona y tiene sonido»).
- Commit en GitHub después de cada funcionalidad que funcione, para poder volver atrás.
- Los textos, tamaños de foto y valores de dificultad viven en archivos de configuración, nunca escritos dentro del código.
- Toda prueba de jugabilidad se hace en un móvil real, no solo en el ordenador.
- Prompt de estilo fijo para todas las imágenes generadas, para mantener coherencia visual.

## 11. Planificación hasta el 3 de noviembre

Hay 23 días: el calendario es muy ajustado para 19 niveles de 10 minutos, así que se prioriza tener un juego completo jugable antes que pulir cada nivel.

| Fase | Fechas | Entregable | Hito de revisión |
| --- | --- | --- | --- |
| 1. Base | 12-15 oct | Repositorio, Phaser, controles táctiles, Sofía en SVG animada, nivel 0 jugable, despliegue en Cloudflare | Miriam aprueba el personaje y los controles en su móvil |
| 2. Sistemas | 16-19 oct | Velas, checkpoints, cantar, enemigos tipo, coleccionables, guardado, menús y galerías con placeholders | Todos los sistemas funcionan en el nivel 0 |
| 3. Niveles 1-9 | 20-26 oct | 9 niveles completos con su ambientación y música | Miriam juega los 9 y ajusta dificultad |
| 4. Niveles 10-18 y final | 27 oct-1 nov | 9 niveles más, camino blanco, «continuará», escena de la tarta | Juego completo de principio a fin |
| 5. Cierre | 1-2 nov | Fotos reales, objetos, mensaje final, pruebas en iOS y Android, corrección de errores | Versión final publicada |
| Entrega | 3 nov | Enlace a Sofía | — |

### Plan de contingencia

Si la fase 3 se retrasa más de 2 días, los niveles 1-9 se acortan a 5-6 minutos y se reservan los 10 minutos para los niveles altos. El final (nivel 18 y la tarta) y la pantalla de inicio tienen prioridad máxima: deben estar listos aunque haya que simplificar niveles intermedios.

### Fechas límite para Miriam

- [ ] Foto o descripción de Miriam para su caricatura: 14 oct
- [ ] Recuerdos de los años que tengan historia propia: 19 oct
- [ ] Lista de objetos por año: 26 oct
- [ ] 19 fotos reales con pie de foto: 31 oct
- [ ] Mensaje final de la tarta: 1 nov

## 12. Criterios de aceptación y pendientes

El juego se da por terminado cuando cumple todos estos puntos en un móvil Android y un iPhone.

- [ ] Los 19 niveles se pueden completar de principio a fin.
- [ ] Cada nivel tiene N velas (nivel 0 infinitas) y los checkpoints conservan las velas restantes.
- [ ] Al quedarse sin velas, el nivel se reinicia y se pierden los coleccionables cogidos en ese intento.
- [ ] Cada nivel tiene su foto y su objeto, opcionales y en zonas difíciles.
- [ ] El menú de niveles muestra bloqueo, disponibilidad e iconos de foto y objeto conseguidos.
- [ ] Álbum de fotos y vitrina de objetos accesibles desde el inicio.
- [ ] El progreso se mantiene al cerrar y abrir el juego.
- [ ] Miriam aparece con pistas en todos los niveles.
- [ ] El nivel 18 acaba en el camino blanco, el cartel «Continuará...» y la tarta oculta.
- [ ] Soplar con el dedo apaga las velas y muestra el mensaje de Miriam.
- [ ] Toda la música y los gráficos son originales o de dominio público.
- [ ] Funciona sin conexión tras la primera carga y se puede añadir a la pantalla de inicio.

### Decisiones pendientes

- ¿A qué edad empezó Sofía con la música? Determina el nivel en que desbloquea cantar (por defecto, nivel 6).
- ¿Velas ocultas extra como recompensa dentro de los niveles? Por defecto, no.
- ¿Soplar con el micrófono como extra? Por defecto, no.
- ¿Nombre del juego? Propuesta provisional: «Sofía: 18 años en clave de sol».
