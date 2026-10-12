# Sofía: 18 años en clave de sol

Videojuego de plataformas y puzles 2D para móvil (horizontal, táctil), con 19 niveles del año 0
al 18. Regalo de Miriam para el 18 cumpleaños de Sofía. Especificación completa en [`SPEC.md`](SPEC.md).

- **Motor:** Phaser 3 (física Arcade) + Vite, empaquetado como PWA instalable y jugable sin conexión.
- **Gráficos:** SVG generados por código (`tools/arte`), personaje por piezas animado por código.
- **Audio:** sintetizado con Web Audio (piano, efectos). Sin archivos con licencia.
- **Niveles:** mapas en JSON de Tiled (`assets/levels`), generados desde diseños ASCII (`tools/niveles`).

Lo que falta y quién lo hace: [`docs/PENDIENTES.md`](docs/PENDIENTES.md).
Diseño de cada nivel y guía técnica: [`docs/DISENO-NIVELES.md`](docs/DISENO-NIVELES.md).

## Ponerlo en marcha

Necesitas Node.js 20 o superior.

```bash
npm install
npm run dev        # abre http://localhost:5173
npm run build      # genera la versión final en dist/
npm run preview    # sirve dist/ para probar la versión final (y la PWA)
```

**Probar en el móvil:** con `npm run dev` el terminal muestra una dirección tipo
`http://192.168.1.X:5173`. Ábrela en el móvil conectado a la misma wifi y ponlo en horizontal.

### Direcciones útiles para probar
| URL | Qué hace |
| --- | --- |
| `?nivel=5` | entra directamente en el nivel 5 |
| `?trucos` | desbloquea todos los niveles |
| `?poses` | revisión del personaje: todas las animaciones de cada edad (toca para cambiar) |
| `?poses&gatas` | igual, con el bebé a gatas |
| `?tarta` | va directa a la escena de la tarta |
| `?debug` | dibuja los cuerpos físicos |
| `?canvas` | fuerza el renderizado Canvas (útil en ordenadores sin GPU) |

En el ordenador: flechas o A/D para moverse, ↑/Espacio/Z para saltar, X/K para cantar,
Mayúsculas para correr (o mantener la flecha), Esc/P para pausa.

## Publicar en Cloudflare Pages

1. Sube el repositorio a GitHub (ya está en `miriamcs/regalosofia18`).
2. En Cloudflare → *Workers & Pages* → *Create* → *Pages* → *Connect to Git*, elige el repositorio.
3. Configuración de compilación:
   - **Framework preset:** None (o Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Variable de entorno:** `NODE_VERSION` = `20`
4. Cada `git push` a la rama principal vuelve a publicar automáticamente.
5. En el móvil: abrir el enlace → menú del navegador → «Añadir a pantalla de inicio».

## Cómo cambiar cosas sin tocar el código

| Qué | Dónde |
| --- | --- |
| Textos, pistas de Miriam, nombres de nivel | `config/texts.json` |
| Fotos | Originales en `originales/fotos/Sofia0.jpg` … `Sofia18.jpg` y `SofiaNace.jpg` (la del prólogo); luego `npm run imagenes` |
| Tamaño, recorte y pie de cada foto | `config/photos.json` |
| Objetos coleccionables (nombre, texto, dibujo) | `config/objetos.json` (`sprite` con extensión) + el SVG en `assets/sprites/objetos/`, o un PNG original en `originales/objetos/` (fondo verde croma o liso) y luego `npm run imagenes` |
| Enemigos (dibujo, hacia dónde miran, tamaño) | `config/enemigos.json` + originales en `originales/enemigos/<nombre>.svg`; luego `npm run imagenes` |
| Mensaje final de la tarta | `config/mensaje-final.txt` |
| Dificultad, física, controles, nivel en que se desbloquea cada habilidad | `config/juego.json` |
| Música | ver «Música» abajo |

### Fotos y objetos
```bash
npm run imagenes   # originales/ -> assets/photos (JPG de 1200 px) y assets/sprites/objetos (PNG 256 px sin fondo, salvo los que ya tienen SVG)
```
La carpeta `originales/` no se sube a git (pesa mucho): guárdala aparte. Lo generado en `assets/` sí se sube.

### Niveles
```bash
npm run niveles -- 3     # convierte tools/niveles/nivel-03.mjs en assets/levels/nivel-03.json
npm run validar -- 3     # comprueba las reglas de diseño (foto, objeto, Miriam, checkpoints...)
node tools/fusionar-pistas.mjs   # copia los textos de tools/niveles/pistas-XX.json a config/texts.json
```
Los `.json` de `assets/levels` se pueden abrir y retocar en **Tiled** (solo capas de objetos).
Si retocas uno a mano, añade al mapa la propiedad booleana `editadoAMano = true` para que el
generador no lo sobrescriba.

### Música
La música provisional son arpegios originales y «Cumpleaños feliz» (dominio público). Para usar las
obras de la SPEC, descarga el MIDI de dominio público (Mutopia Project o IMSLP, comprobando la licencia)
y conviértelo:
```bash
node tools/midi-a-json.mjs clair-de-lune.mid inicio --hasta 64
```
Claves: `inicio`, `bebe`, `nina`, `preado`, `adolescente`, `adulta`, `caminoBlanco`, `tarta`.

### Gráficos
```bash
npm run sprites              # regenera los SVG de assets/sprites desde tools/arte
npm run iconos               # logo de inicio e iconos de la app desde originales/logo/
```
Ojo: `npm run sprites` sobrescribe los SVG; si retocas alguno en Inkscape, guárdalo aparte o quítalo del generador.

## Estructura
```
src/
  scenes/     Boot, Menú, Niveles/Álbum/Vitrina/Opciones, Transición, Juego, Interfaz/Pausa, Tarta, Poses
  entities/   Sofía, enemigos, elementos del nivel (plataformas, atriles, campanas, Miriam...)
  systems/    guardado, controles, lectura de niveles, fondos
  audio/      sintetizador y música
assets/       (se publica tal cual) levels/, sprites/, photos/, music/, icons/
config/       textos, fotos, objetos, dificultad, mensaje final
tools/        generadores (sprites, niveles, iconos, MIDI) y pruebas
docs/         diseño de niveles y pendientes
```
