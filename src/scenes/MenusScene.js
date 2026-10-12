// Menú de niveles, álbum de fotos, vitrina de objetos y opciones.
import Phaser from 'phaser';
import { texto, NUM_NIVELES, FOTOS, OBJETOS } from '../config.js';
import { Boton, fondoMenu, botonVolver } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { Audio } from '../audio/Audio.js';
import { FUENTE, FUENTE_TITULO } from '../estilo.js';

function titulo(scene, t) {
  scene.add.text(scene.scale.width / 2, 52, t, { fontFamily: FUENTE_TITULO, fontSize: '44px', color: '#ffffff', fontStyle: 'bold italic', stroke: '#0d1b3d', strokeThickness: 6 }).setOrigin(0.5);
}

// Rejilla en dos filas: 10 arriba y el resto abajo (19 casillas, o 20 en el álbum)
function posicionCasilla(scene, n, tam, total = NUM_NIVELES) {
  const { width: W, height: H } = scene.scale;
  const fila = n < 10 ? 0 : 1;
  const col = n < 10 ? n : n - 10;
  const porFila = fila === 0 ? 10 : total - 10;
  const sep = Math.min(tam + 18, (W - 80) / 10);
  const x = W / 2 + (col - (porFila - 1) / 2) * sep;
  const y = H * 0.42 + fila * (tam + 60);
  return { x, y };
}

function casilla(scene, x, y, tam, { activa, alPulsar }) {
  const c = scene.add.container(x, y);
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.25).fillRoundedRect(-tam / 2 + 3, -tam / 2 + 5, tam, tam, 16);
  g.fillStyle(activa ? 0x1e4fa3 : 0x2b3556, 1).fillRoundedRect(-tam / 2, -tam / 2, tam, tam, 16);
  g.lineStyle(3, activa ? 0xe8b84a : 0x56607a, 1).strokeRoundedRect(-tam / 2, -tam / 2, tam, tam, 16);
  c.add(g);
  c.setSize(tam, tam);
  if (alPulsar) {
    c.setInteractive({ useHandCursor: true });
    c.on('pointerdown', () => c.setScale(0.94));
    c.on('pointerout', () => c.setScale(1));
    c.on('pointerup', () => {
      c.setScale(1);
      Audio.iniciar();
      Audio.efecto('nota', 'E5');
      alPulsar();
    });
  }
  return c;
}

export class NivelesScene extends Phaser.Scene {
  constructor() {
    super('Niveles');
  }

  create() {
    fondoMenu(this);
    titulo(this, texto('galerias.niveles'));
    botonVolver(this);
    const tam = 104;
    for (let n = 0; n < NUM_NIVELES; n++) {
      const { x, y } = posicionCasilla(this, n, tam);
      const disponible = Guardado.disponible(n);
      const c = casilla(this, x, y, tam, { activa: disponible, alPulsar: disponible ? () => this.scene.start('Transicion', { nivel: n }) : null });
      if (!disponible) {
        c.add(this.add.image(0, -4, 'candado').setScale(0.45));
        c.add(this.add.text(0, 30, String(n), { fontFamily: FUENTE, fontSize: '18px', color: '#8c95ab' }).setOrigin(0.5));
        continue;
      }
      c.add(this.add.text(0, -12, String(n), { fontFamily: FUENTE_TITULO, fontSize: '44px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5));
      if (Guardado.completado(n)) c.add(this.add.text(tam / 2 - 16, -tam / 2 + 14, '✓', { fontFamily: FUENTE, fontSize: '22px', color: '#7bdc6b', fontStyle: 'bold' }).setOrigin(0.5));
      // Iconos solo si se consiguió cada coleccionable (la ausencia indica que falta)
      if (Guardado.tieneFoto(n)) c.add(this.add.image(-18, 30, 'icono-foto').setScale(0.55));
      if (Guardado.tieneObjeto(n)) c.add(this.add.image(18, 30, 'icono-objeto').setScale(0.55));
    }
  }
}

// ---- Álbum de fotos ---------------------------------------------------------------

export const CLAVE_FOTO_NACIMIENTO = 'foto-nacimiento';

// Escala la imagen para cubrir w x h y recorta lo que sobra (centrado). Funciona aunque se gire.
export function recortarCubriendo(img, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const cw = w / s;
  const ch = h / s;
  img.setScale(s);
  img.setCrop((img.width - cw) / 2, (img.height - ch) / 2, cw, ch);
}

export class AlbumScene extends Phaser.Scene {
  constructor() {
    super('Album');
  }

  preload() {
    // Solo se cargan las fotos conseguidas. Si falta el archivo se usa un marco con placeholder.
    this.load.on('loaderror', () => {});
    for (const f of this.fotos()) {
      if (f.tiene && f.archivo && !this.textures.exists(f.clave)) this.load.image(f.clave, f.archivo);
    }
  }

  // La foto del nacimiento va la primera, antes de las de cada año
  fotos() {
    const nace = FOTOS.nacimiento;
    const lista = FOTOS.fotos.map((f) => ({ ...f, clave: `foto-${f.nivel}`, tiene: Guardado.tieneFoto(f.nivel), etiqueta: texto('galerias.nivel', { n: f.nivel }) }));
    if (nace) lista.unshift({ ...nace, clave: CLAVE_FOTO_NACIMIENTO, tiene: Guardado.tieneFotoNacimiento(), etiqueta: texto('galerias.nacimiento') });
    return lista;
  }

  create() {
    fondoMenu(this);
    titulo(this, texto('galerias.album'));
    botonVolver(this);
    const tam = 104;
    const fotos = this.fotos();
    fotos.forEach((f, i) => {
      const { x, y } = posicionCasilla(this, i, tam, fotos.length);
      const tiene = f.tiene;
      const c = casilla(this, x, y, tam, { activa: tiene, alPulsar: tiene ? () => this.ver(f) : null });
      if (tiene) {
        if (this.textures.exists(f.clave)) {
          const img = this.add.image(0, -8, f.clave);
          recortarCubriendo(img, tam - 16, tam - 34);
          c.add(img);
        } else {
          c.add(this.add.image(0, -8, 'marco-foto').setScale(0.6));
        }
      } else {
        // silueta con interrogación
        const g = this.add.graphics();
        g.fillStyle(0x0d1b3d, 0.8).fillRoundedRect(-30, -40, 60, 52, 6);
        c.add(g);
        c.add(this.add.text(0, -14, '?', { fontFamily: FUENTE_TITULO, fontSize: '38px', color: '#56607a', fontStyle: 'bold' }).setOrigin(0.5));
      }
      c.add(this.add.text(0, tam / 2 - 14, f.etiqueta, { fontFamily: FUENTE, fontSize: '15px', color: '#cfe0ff' }).setOrigin(0.5));
    });
  }

  ver(f) {
    const { width: W, height: H } = this.scale;
    const cfg = FOTOS.visualizacion;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, 0x000000, 0.75).setOrigin(0).setInteractive();
    capa.add(velo);
    const aw = Math.min(cfg.ancho, W - 120);
    const ah = Math.min(cfg.alto, H - 170);
    const marco = cfg.marco;
    const giro = Phaser.Math.Between(-cfg.giroMaxGrados, cfg.giroMaxGrados);
    const foto = this.add.container(W / 2, H / 2 - 30).setAngle(giro);
    const papel = this.add.graphics();
    papel.fillStyle(0xffffff, 1).fillRect(-aw / 2 - marco, -ah / 2 - marco, aw + marco * 2, ah + marco * 2 + 56);
    foto.add(papel);
    if (this.textures.exists(f.clave)) {
      const img = this.add.image(0, 0, f.clave);
      if (cfg.recorte === 'contener') img.setScale(Math.min(aw / img.width, ah / img.height));
      else recortarCubriendo(img, aw, ah);
      foto.add(img);
    } else {
      const g = this.add.graphics();
      g.fillStyle(0xdbe7ff, 1).fillRect(-aw / 2, -ah / 2, aw, ah);
      g.lineStyle(4, 0x9aa7c7, 1).strokeRect(-aw / 2 + 20, -ah / 2 + 20, aw - 40, ah - 40);
      foto.add(g);
      foto.add(this.add.image(0, -20, 'marco-foto').setScale(1.4));
      foto.add(this.add.text(0, 70, `${f.etiqueta}: foto pendiente`, { fontFamily: FUENTE, fontSize: '24px', color: '#56607a' }).setOrigin(0.5));
    }
    foto.add(this.add.text(0, ah / 2 + marco + 22, f.pie, { fontFamily: '"Comic Sans MS", "Chalkboard SE", ' + FUENTE, fontSize: '24px', color: '#1b2a4a', align: 'center', wordWrap: { width: aw } }).setOrigin(0.5));
    capa.add(foto);
    foto.setScale(0.6).setAlpha(0);
    this.tweens.add({ targets: foto, scale: 1, alpha: 1, duration: 260, ease: 'Back.out' });
    const cerrar = () => capa.destroy();
    velo.on('pointerup', cerrar);
  }
}

// ---- Vitrina de objetos -------------------------------------------------------------

export class VitrinaScene extends Phaser.Scene {
  constructor() {
    super('Vitrina');
  }

  create() {
    fondoMenu(this);
    titulo(this, texto('galerias.vitrina'));
    botonVolver(this);
    const tam = 104;
    for (const o of OBJETOS.objetos) {
      const n = o.nivel;
      const { x, y } = posicionCasilla(this, n, tam);
      const tiene = Guardado.tieneObjeto(n);
      const c = casilla(this, x, y, tam, { activa: tiene, alPulsar: tiene ? () => this.ver(o) : null });
      const img = this.add.image(0, -8, `obj-${o.sprite}`);
      img.setScale(72 / img.width);
      if (!tiene) img.setTintFill(0x0d1b3d).setAlpha(0.75);
      c.add(img);
      c.add(this.add.text(0, tam / 2 - 14, texto('galerias.nivel', { n }), { fontFamily: FUENTE, fontSize: '15px', color: '#cfe0ff' }).setOrigin(0.5));
    }
  }

  ver(o) {
    const { width: W, height: H } = this.scale;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, 0x000000, 0.75).setOrigin(0).setInteractive();
    const panel = this.add.graphics();
    panel.fillStyle(0xfffaf0, 1).fillRoundedRect(W / 2 - 360, H / 2 - 230, 720, 460, 24);
    panel.lineStyle(5, 0xe8b84a, 1).strokeRoundedRect(W / 2 - 360, H / 2 - 230, 720, 460, 24);
    const img = this.add.image(W / 2, H / 2 - 80, `obj-${o.sprite}`);
    img.setScale(220 / img.width);
    this.tweens.add({ targets: img, angle: { from: -5, to: 5 }, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const nombre = this.add.text(W / 2, H / 2 + 60, o.nombre, { fontFamily: FUENTE_TITULO, fontSize: '36px', color: '#1e4fa3', fontStyle: 'bold' }).setOrigin(0.5);
    const desc = this.add.text(W / 2, H / 2 + 130, o.texto, { fontFamily: FUENTE, fontSize: '22px', color: '#1b2a4a', align: 'center', wordWrap: { width: 640 } }).setOrigin(0.5);
    capa.add([velo, panel, img, nombre, desc]);
    velo.on('pointerup', () => capa.destroy());
  }
}

// ---- Opciones -----------------------------------------------------------------------

export class OpcionesScene extends Phaser.Scene {
  constructor() {
    super('Opciones');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    titulo(this, texto('opciones.titulo'));
    botonVolver(this);
    this.deslizador(W / 2, H * 0.3, texto('opciones.musica'), 'musica');
    this.deslizador(W / 2, H * 0.46, texto('opciones.efectos'), 'efectos');
    new Boton(this, W / 2, H * 0.62, texto('opciones.pantallaCompleta'), () => {
      if (this.scale.isFullscreen) this.scale.stopFullscreen();
      else this.scale.startFullscreen();
    }, { ancho: 420 });
    new Boton(this, W / 2, H * 0.78, texto('opciones.borrar'), () => this.confirmarBorrar(), { ancho: 420, color: 0xa33b3b, borde: 0xffffff });
  }

  deslizador(x, y, etiqueta, opcion) {
    const ancho = 420;
    this.add.text(x - ancho / 2 - 30, y, etiqueta, { fontFamily: FUENTE, fontSize: '28px', color: '#ffffff' }).setOrigin(1, 0.5);
    const g = this.add.graphics();
    const pomo = this.add.circle(0, y, 22, 0xe8b84a).setStrokeStyle(4, 0xffffff);
    const pinta = (v) => {
      g.clear();
      g.fillStyle(0x0d1b3d, 0.6).fillRoundedRect(x - ancho / 2, y - 8, ancho, 16, 8);
      g.fillStyle(0x8fb8ff, 1).fillRoundedRect(x - ancho / 2, y - 8, Math.max(16, ancho * v), 16, 8);
      pomo.x = x - ancho / 2 + ancho * v;
    };
    pinta(Guardado.opcion(opcion));
    const zona = this.add.zone(x, y, ancho + 60, 70).setInteractive({ draggable: false });
    const mover = (p) => {
      if (!p.isDown) return;
      const v = Phaser.Math.Clamp((p.x - (x - ancho / 2)) / ancho, 0, 1);
      Guardado.opcion(opcion, Math.round(v * 100) / 100);
      Audio.iniciar();
      Audio.aplicarVolumenes();
      pinta(v);
    };
    zona.on('pointerdown', mover);
    zona.on('pointermove', mover);
    zona.on('pointerup', () => opcion === 'efectos' && Audio.efecto('nota', 'C5'));
  }

  confirmarBorrar() {
    const { width: W, height: H } = this.scale;
    const capa = this.add.container(0, 0).setDepth(100);
    const velo = this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0).setInteractive();
    const panel = this.add.graphics().fillStyle(0x1e4fa3, 1).fillRoundedRect(W / 2 - 330, H / 2 - 150, 660, 300, 24).lineStyle(4, 0xe8b84a, 1).strokeRoundedRect(W / 2 - 330, H / 2 - 150, 660, 300, 24);
    const t = this.add.text(W / 2, H / 2 - 60, texto('opciones.confirmarBorrar'), { fontFamily: FUENTE, fontSize: '28px', color: '#ffffff', align: 'center', wordWrap: { width: 580 } }).setOrigin(0.5);
    capa.add([velo, panel, t]);
    const si = new Boton(this, W / 2 - 150, H / 2 + 70, texto('opciones.si'), () => {
      Guardado.borrar();
      capa.destroy();
      const aviso = this.add.text(W / 2, H * 0.9, texto('opciones.borrado'), { fontFamily: FUENTE, fontSize: '26px', color: '#ffd23f' }).setOrigin(0.5);
      this.tweens.add({ targets: aviso, alpha: 0, delay: 1500, duration: 600 });
    }, { ancho: 240, color: 0xa33b3b, borde: 0xffffff });
    const no = new Boton(this, W / 2 + 150, H / 2 + 70, texto('opciones.no'), () => capa.destroy(), { ancho: 240 });
    capa.add([si, no]);
  }
}
