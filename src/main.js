import Phaser from 'phaser';
import { JUEGO } from './config.js';
import { Audio } from './audio/Audio.js';
import { activarResolucion } from './systems/Resolucion.js';
import { FirmaScene } from './scenes/FirmaScene.js';
import { BootScene } from './scenes/BootScene.js';
import { CreditosScene } from './scenes/CreditosScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { NivelesScene, AlbumesScene, AlbumScene, VitrinaScene, MonstruosScene, OpcionesScene } from './scenes/MenusScene.js';
import { TransicionScene } from './scenes/TransicionScene.js';
import { PrologoScene } from './scenes/PrologoScene.js';
import { JuegoScene } from './scenes/JuegoScene.js';
import { InterfazScene, PausaScene } from './scenes/InterfazScene.js';
import { TartaScene } from './scenes/TartaScene.js';
import { PosesScene } from './scenes/PosesScene.js';
import { ControlesScene } from './scenes/ControlesScene.js';

// Alto fijo de 720 y ancho según la proporción de la pantalla (móviles muy alargados incluidos)
function anchoJuego() {
  const p = JUEGO.pantalla;
  const ratio = Math.max(window.innerWidth, window.innerHeight) / Math.min(window.innerWidth, window.innerHeight);
  return Math.round(Phaser.Math.Clamp(p.alto * ratio, p.anchoMin, p.anchoMax));
}

const juego = new Phaser.Game({
  type: new URLSearchParams(location.search).has('canvas') ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'juego',
  backgroundColor: '#071A3D',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: anchoJuego(),
    height: JUEGO.pantalla.alto,
  },
  render: { antialias: true, roundPixels: false },
  physics: { default: 'arcade', arcade: { gravity: { y: JUEGO.fisica.gravedad }, debug: new URLSearchParams(location.search).has('debug') } },
  input: { activePointers: 4 },
  audio: { noAudio: true }, // el audio lo gestiona src/audio (Web Audio propio)
  fps: { target: 60 },
  scene: [FirmaScene, BootScene, MenuScene, NivelesScene, AlbumesScene, AlbumScene, VitrinaScene, MonstruosScene, OpcionesScene, ControlesScene, PrologoScene, TransicionScene, JuegoScene, InterfazScene, PausaScene, TartaScene, CreditosScene, PosesScene],
});

// Dibujar con los píxeles reales de la pantalla para que letras y trazos se vean nítidos
juego.events.once(Phaser.Core.Events.READY, () => activarResolucion(juego));

// iOS/Android: el audio solo puede arrancar tras el primer toque
const desbloquear = () => Audio.iniciar();
window.addEventListener('pointerdown', desbloquear, { passive: true });
window.addEventListener('keydown', desbloquear);
window.addEventListener('touchend', desbloquear, { passive: true });

// En Android, el primer toque pone el juego a pantalla completa y bloquea la horizontal
// (si no se ha instalado como app). iOS no lo permite: allí se usa «Añadir a pantalla de inicio».
const instalada = window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone;
if (!instalada && 'ontouchstart' in window) {
  window.addEventListener('touchend', function pantallaCompleta() {
    window.removeEventListener('touchend', pantallaCompleta);
    const el = document.documentElement;
    if (!el.requestFullscreen || document.fullscreenElement) return;
    el.requestFullscreen({ navigationUI: 'hide' })
      .then(() => screen.orientation?.lock?.('landscape'))
      .catch(() => {});
  });
}

// Al volver a horizontal, ajustar el tamaño
window.addEventListener('orientationchange', () => setTimeout(() => juego.scale.refresh(), 300));

if (import.meta.env.DEV) window.juego = juego;
