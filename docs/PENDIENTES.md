# Pendientes

Estado a 11 de octubre de 2026. Lo que ya está hecho con Claude Code está en el `README.md`;
aquí va lo que falta, agrupado por quién lo tiene que hacer.

## 1. Lo que necesito de Miriam

Cuando me lo pases, lo meto en el juego.

| Qué | Para qué | Fecha límite (SPEC) | Dónde va |
| --- | --- | --- | --- |
| Foto o descripción de Miriam | Su caricatura (ahora es un diseño neutro provisional con ropa amarilla) | 14 oct | `tools/arte/miriam.mjs` |
| Diferencia de edad entre hermanas | Dibujar a Miriam con la edad correcta en cada nivel (ahora: niña hasta el nivel 7, adolescente hasta el 14, adulta después) | 14 oct | `src/config.js` → `etapaMiriam` |
| Recuerdos de los años con historia propia | Adaptar las ambientaciones y bromas de esos niveles | 19 oct | `docs/DISENO-NIVELES.md` y `tools/niveles` |
| ¿A qué edad empezó Sofía con la música? | Nivel en que se desbloquea cantar (ahora el 6) | 19 oct | `config/juego.json` → `habilidades.cantar` |
| Lista de objetos por año | Sustituir los 19 objetos genéricos provisionales y dibujarlos | 26 oct | `config/objetos.json` y `tools/arte/objetos.mjs` |
| 19 fotos reales con su pie de foto | Álbum de fotos (ahora salen marcos con placeholder) | 31 oct | `assets/photos/foto-NN.jpg` y `config/photos.json` |
| Mensaje final de la tarta | Lo que aparece al apagar las 18 velas | 1 nov | `config/mensaje-final.txt` |
| Archivos MIDI de las obras | Desde este entorno no se puede descargar de Mutopia/IMSLP. Bájalos tú (comprobando que la licencia sea libre) y te los convierto | cuando puedas | `assets/music` (con `tools/midi-a-json.mjs`) |
| Concept art de Sofía (ver punto 2) | Redibujar el SVG definitivo | fase 1 (12-15 oct) | `tools/arte/sofia.mjs` |

**MIDI que hacen falta** (SPEC §8): Debussy *Clair de lune* (inicio); Schumann *Escenas de niños*
y Debussy *Children's Corner* (bebé e infancia); Chopin valses Op. 64 (preadolescencia); Chopin
*Fantasía-Impromptu* y Schubert *Impromptus* Op. 90 (adolescencia); Chopin *Balada n.º 1* (nivel 18);
Debussy *Arabesque n.º 1* (camino blanco). Fuentes: mutopiaproject.org (muchas en dominio público o
CC) e imslp.org.

**Decisiones abiertas** (valores por defecto ya aplicados):
- Velas ocultas extra dentro de los niveles: **no**.
- Soplar las velas con el micrófono: **no** (se puede añadir si sobra tiempo).
- Nombre del juego: **«Sofía: 18 años en clave de sol»** (provisional).

## 2. Lo que se hace con otras IAs (según la SPEC §10)

| Tarea | Herramienta | Estado |
| --- | --- | --- |
| Concept art de Sofía cartoon a partir de su foto + hoja de personaje (frontal, perfil, espalda) | ChatGPT (imágenes) | ⏳ Pendiente. Mientras, hay una Sofía provisional hecha desde la descripción escrita de la SPEC. Con el concept, Claude la redibuja en SVG por piezas. |
| Caricatura de Miriam (si se hace con concept) | ChatGPT (imágenes) | ⏳ Pendiente |
| Fondos por etapa y objetos coleccionables | ChatGPT (imágenes) **o** SVG por código | ✅ Hechos por código (provisionales, misma paleta). Si se prefieren ilustrados con ChatGPT, se pueden sustituir. |
| Cinemática de intro o tráiler (opcional) | Google Flow (vídeo) | ⏳ Opcional, sin empezar |
| Retoques del SVG | Inkscape | ⏳ Cuando haya SVG definitivo |

**Prompt de estilo fijo** para todas las imágenes generadas (SPEC §10), propuesta:
> Ilustración vectorial cartoon, contornos limpios de grosor uniforme en azul marino oscuro (#1b2a4a),
> colores planos con sombras suaves mínimas, proporciones de 3 cabezas de alto, cabeza grande,
> paleta dominada por azules (#1e4fa3, #8fb8ff, #0d1b3d) con acentos dorados (#e8b84a), fondo liso,
> sin texto, estilo de videojuego 2D para móvil.

Para el concept de Sofía, añadir: *melena larga negra muy rizada con raya al medio, ojos grandes
marrón oscuro, cejas marcadas, sonrisa amplia, lunar pequeño en la mejilla, collar con colgante de
clave de sol dorada, ropa en tonos azules, 1,60 m (algo bajita)*. Pedir la hoja de personaje
**de frente, de perfil y de espalda, con los brazos separados del cuerpo** (facilita separarla por piezas).

## 3. Lo que hace Miriam (sin IA)

- **Cloudflare Pages:** conectar el repositorio (pasos en el `README.md`). No tengo acceso a Cloudflare.
- **Probar en móviles reales** (Android y iPhone): controles, rendimiento, audio tras el primer toque,
  instalación en pantalla de inicio. La escena `?poses` sirve para aprobar el personaje (hito de la fase 1).
- **Jugar los niveles y ajustar la dificultad** (fases 3 y 4). Los valores están en `config/juego.json`
  y los mapas se pueden retocar en Tiled.

## 4. Lo que haré yo (Claude Code) cuando llegue cada cosa

- Redibujar a Sofía en SVG por piezas a partir del concept art, y a Miriam a partir de su foto/descripción.
- Adaptar los niveles con recuerdos reales y ajustar dificultad según tus pruebas.
- Convertir los MIDI y asignarlos a cada etapa; acelerar la música con una sola vela ya funciona.
- Meter las fotos, los pies de foto, la lista de objetos (y dibujarlos) y el mensaje final.
- Corregir lo que salga en las pruebas en iOS y Android.
