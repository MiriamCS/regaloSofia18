# Pendientes

Estado a 17 de octubre de 2026. Lo que ya está hecho con Claude Code está en el `README.md`;
aquí va lo que falta, agrupado por quién lo tiene que hacer.

Los 19 niveles están hechos y pasan `npm run validar` sin errores ni avisos, y `npm run build`
compila. El juego va por delante del calendario de la SPEC (§11): lo que queda es la música,
el objeto del año 10 y las pruebas en móviles reales.

## 1. Lo que necesito de Miriam

Cuando me lo pases, lo meto en el juego.

| Qué | Para qué | Fecha límite | Dónde va |
| --- | --- | --- | --- |
| Objeto del año 10 (qué es y su texto) | Ahora sale la pelota con «Pendiente: objeto y texto del año 10». Es el único hueco de contenido que vería Sofía. El dibujo lo hago yo | 26 oct | `config/objetos.json` y `assets/sprites/objetos` |
| Música: MIDI **o** quedarse con los arpegios | `assets/music` está vacía y suenan arpegios provisionales en todo el juego, también en el inicio. Ver abajo | 26 oct | `assets/music` (con `tools/midi-a-json.mjs`) |
| ¿A qué edad empezó Sofía con la música? | Nivel en que se desbloquea cantar (ahora el 6, valor por defecto) | 19 oct | `config/juego.json` → `habilidades.cantar` |
| Nombre definitivo del juego | Ahora «Sofía: 18 años en clave de sol» (provisional) | 26 oct | `vite.config.js`, `package.json` |

**Música.** Dos caminos:
- **MIDI de dominio público** (Mutopia o IMSLP, comprobando la licencia): te los convierto y los
  asigno a cada etapa. Hay que añadir las obras a los créditos. Las de la SPEC §8: Debussy
  *Clair de lune* (inicio); Schumann *Escenas de niños* y Debussy *Children's Corner* (bebé e infancia);
  Chopin valses Op. 64 (preadolescencia); Chopin *Fantasía-Impromptu* y Schubert *Impromptus* Op. 90
  (adolescencia); Chopin *Balada n.º 1* (nivel 18); Debussy *Arabesque n.º 1* (camino blanco).
  Desde este entorno no se pueden descargar.
- **Quedarse con la música original por código**: le doy a cada etapa una melodía con más carácter
  que los arpegios actuales.

**Decisiones abiertas** (valores por defecto ya aplicados):
- Velas ocultas extra dentro de los niveles: **no**.
- Soplar las velas con el micrófono: **no** (se puede añadir si sobra tiempo).

## 2. Lo que hace Miriam (sin IA)

- **Cloudflare Pages:** conectar el repositorio si no está hecho (pasos en el `README.md`).
  No tengo acceso a Cloudflare.
- **Partida completa en un Android y un iPhone reales** (criterio de aceptación de la SPEC §12):
  controles, rendimiento, audio tras el primer toque, instalación en la pantalla de inicio, y el
  final entero (camino blanco, «Continuará...», tarta y carta). Ya hubo una tanda de arreglos tras
  las primeras pruebas.
- **Peso:** el juego ocupa unos 24 MB y se descarga entero la primera vez para funcionar sin
  conexión. Conviene que Sofía lo abra la primera vez con wifi.

## 3. Lo que haré yo (Claude Code)

- Dibujar el objeto del año 10 cuando sepa cuál es.
- Convertir los MIDI y asignarlos a cada etapa, o mejorar la música por código (según se decida).
- Completar los créditos (obras musicales si las hay, y lo que Miriam quiera añadir).
- Quitar el comentario de «provisional» de los iconos de las entradas de los álbumes si se quedan
  como están (`src/scenes/MenusScene.js`).
- Corregir lo que salga en las pruebas en iOS y Android.

## 4. Opcional

- Cinemática de intro o tráiler con Google Flow (sin empezar).

## Ya hecho desde el 11 de octubre

- Textos de los objetos (todos menos el del año 10) y pies de las 19 fotos (nacimiento y años 0-17).
- Mensaje final de la tarta (`config/mensaje-final.txt`).
- Recuerdos de cada año llevados a los niveles (temática según las fotos y los objetos).
- Sofía y Miriam animadas con sus vídeos en todas las edades: ya no hacen falta la caricatura de
  Miriam con ChatGPT ni los retoques del SVG en Inkscape.
- Fondos por etapa hechos por código y pulidos.
- Pistas de Miriam en los 19 niveles.
- Funciona sin conexión y se puede instalar (manifiesto, iconos y caché).
