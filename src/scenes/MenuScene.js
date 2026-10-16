// Pantalla de inicio: a la izquierda el escenario con el logo y Sofía bajo un foco; a la derecha el programa de mano
// con las 18 velas (una por año cumplido) y Jugar/Continuar, Niveles, Álbumes, Controles, Configuración (y la tarta si
// se ha visto).
import Phaser from 'phaser';
import { texto, NUM_NIVELES, etapaDeNivel } from '../config.js';
import { fondoMenu, insignia, icono, hacerPulsable, ALTO_TABLADO } from '../ui/Boton.js';
import { Guardado } from '../systems/Guardado.js';
import { Audio } from '../audio/Audio.js';
import { PISTAS } from '../audio/musica.js';
import { FUENTE, COLOR, HEX } from '../estilo.js';
import { Sofia } from '../entities/Sofia.js';
import { COLECCIONES, progresoColecciones } from './MenusScene.js';

const VELAS = 18;
const PROGRAMA = { ancho: 500, margen: 72, relleno: 36, radio: 26 };

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width: W, height: H } = this.scale;
    fondoMenu(this);
    Audio.tocarMusica(PISTAS.inicio);
    const xs = W * 0.3;
    const suelo = H - ALTO_TABLADO;

    // foco plano que baja sobre Sofía
    const foco = this.add.graphics();
    foco.fillStyle(HEX.blanco, 0.05).fillPoints([{ x: xs - 55, y: 0 }, { x: xs + 55, y: 0 }, { x: xs + 230, y: suelo }, { x: xs - 230, y: suelo }], true);

    // Logo (assets/logo.png, se genera con npm run iconos) y el subtítulo justo debajo
    const logo = this.add.image(xs, 24, 'logo').setOrigin(0.5, 0);
    logo.setScale(Math.min((W * 0.44) / logo.width, (H * 0.3) / logo.height));
    const subtitulo = this.add.text(xs, logo.y + logo.displayHeight + 6, texto('subtitulo'), { fontFamily: FUENTE, fontSize: '28px', color: COLOR.hielo }).setOrigin(0.5, 0);

    // Sofía aparece con la edad del siguiente nivel por jugar, de pie sobre el tablado
    const etapa = Guardado.completado(NUM_NIVELES - 1) ? 'adulta' : etapaDeNivel(Guardado.siguienteNivel());
    this.sofia = new Sofia(this, xs, suelo, etapa, {});
    this.sofia.body.setAllowGravity(false);
    this.sofia.body.enable = false;
    // grande y del mismo alto a cualquier edad: llena el hueco entre el subtítulo y el tablado
    this.altoSofia = suelo - (subtitulo.y + subtitulo.height + 24);
    this.sofia.setScale(this.altoSofia / this.sofia.alto);

    this.programa(W, suelo);

    if (!Audio.ctx) {
      const aviso = this.add.text(xs, H - ALTO_TABLADO / 2, texto('menu.tocaParaEmpezar'), { fontFamily: FUENTE, fontSize: '22px', color: COLOR.azulClaro }).setOrigin(0.5);
      this.input.once('pointerdown', () => aviso.destroy());
    }
  }

  // Programa de mano: tarjeta de papel con el rótulo, las velas y las opciones con su dato al final de una línea de puntos
  programa(W, suelo) {
    const { ancho, margen, relleno, radio } = PROGRAMA;
    const x0 = W - margen - ancho;
    const xi = x0 + relleno;
    const xf = x0 + ancho - relleno;
    const tarta = Guardado.datos.tartaVista;
    const alto = 526 + (tarta ? 60 : 0);
    const y0 = Math.max(24, (suelo - alto) / 2);
    const papel = this.add.graphics();
    papel.fillStyle(HEX.papel, 1).fillRoundedRect(x0, y0, ancho, alto, radio);

    let y = y0 + 30;
    this.add.text(xi, y, texto('menu.programa').toUpperCase(), { fontFamily: FUENTE, fontSize: '16px', color: COLOR.real, letterSpacing: 3 }).setOrigin(0, 0.5);
    y += 24;
    const encendidas = this.velas(xi, y, xf - xi);
    y += 78;
    this.add.text(xi, y, texto('menu.velas', { n: encendidas }), { fontFamily: FUENTE, fontSize: '18px', color: COLOR.real }).setOrigin(0, 0.5);
    y += 24;
    papel.fillStyle(HEX.hielo, 1).fillRoundedRect(xi, y, xf - xi, 3, 1.5);
    y += 20;

    const hechos = Array.from({ length: NUM_NIVELES }, (_, n) => n).filter((n) => Guardado.completado(n)).length;
    const col = progresoColecciones();
    const filas = [
      { clave: Guardado.hayPartida() ? 'menu.continuar' : 'menu.jugar', icono: 'play', dato: texto('galerias.nivel', { n: Guardado.siguienteNivel() }), principal: true, ir: () => this.scene.start('Transicion', { nivel: Guardado.siguienteNivel() }) },
      { clave: 'menu.niveles', icono: 'niveles', dato: `${hechos} / ${NUM_NIVELES}`, ir: () => this.scene.start('Niveles') },
      // Álbumes lleva la joya si alguna colección tiene algo conseguido sin abrir todavía
      { clave: 'menu.albumes', icono: 'albumes', dato: `${col.conseguidos} / ${col.total}`, joya: COLECCIONES.some((c) => Guardado.hayNuevos(c.coleccion)), ir: () => this.scene.start('Albumes') },
      { clave: 'menu.controles', icono: 'controles', ir: () => this.scene.start('Controles') },
      { clave: 'menu.opciones', icono: 'ajustes', ir: () => this.scene.start('Opciones') },
    ];
    if (tarta) filas.push({ clave: 'menu.tarta', icono: 'tarta', ir: () => this.scene.start('Tarta', { desdeMenu: true }) });
    for (const f of filas) {
      const h = f.principal ? 64 : 60;
      this.fila(xi, xf, y + h / 2, h, f);
      y += h + (f.principal ? 8 : 0);
    }
  }

  // Una opción del programa: icono, nombre, puntos y dato. La principal va sobre una píldora amarilla.
  fila(xi, xf, yc, h, { clave, icono: ic, dato, principal, joya, ir }) {
    const cx = (xi + xf) / 2;
    const c = this.add.container(cx, yc);
    const tinta = principal ? HEX.tinta : HEX.real;
    const izq = xi - cx + (principal ? 20 : 4);
    const der = xf - cx - (principal ? 20 : 4);
    if (principal) c.add(this.add.graphics().fillStyle(HEX.amarillo, 1).fillRoundedRect(xi - cx, -h / 2, xf - xi, h, h / 2));
    c.add(icono(this, izq + 13, 0, ic, 26, tinta));
    const nombre = this.add.text(izq + 40, 0, texto(clave), { fontFamily: FUENTE, fontSize: principal ? '30px' : '28px', color: COLOR.tinta }).setOrigin(0, 0.5);
    c.add(nombre);
    let desde = nombre.x + nombre.width + 12;
    if (joya) {
      c.add(insignia(this, desde + 2, -2, 7));
      desde += 20;
    }
    if (dato) {
      const t = this.add.text(der, 0, dato, { fontFamily: FUENTE, fontSize: '20px', color: principal ? COLOR.tinta : COLOR.real }).setOrigin(1, 0.5);
      c.add(t);
      // línea de puntos entre el nombre y el dato
      const puntos = this.add.graphics().fillStyle(principal ? HEX.tinta : HEX.azulClaro, principal ? 0.35 : 1);
      for (let x = desde; x < t.x - t.width - 10; x += 9) puntos.fillCircle(x, 4, 1.6);
      c.add(puntos);
    }
    c.setSize(xf - xi, h);
    hacerPulsable(c, ir, { escala: 0.97 });
  }

  // 18 velas, una por año cumplido (vela-on.svg); las que faltan, sin llama (vela-cuerpo.svg), y la siguiente más marcada
  velas(x, y, ancho) {
    const paso = ancho / VELAS;
    let encendidas = 0;
    let siguienteMarcada = false;
    for (let i = 0; i < VELAS; i++) {
      const encendida = Guardado.completado(i);
      if (encendida) encendidas++;
      const siguiente = !encendida && !siguienteMarcada;
      if (siguiente) siguienteMarcada = true;
      const v = this.add.image(x + paso * (i + 0.5), y + 66, encendida ? 'vela-on' : 'vela-cuerpo').setOrigin(0.5, 1);
      v.setScale(58 / v.height);
      if (!encendida && !siguiente) v.setAlpha(0.35);
    }
    return encendidas;
  }

  update(t, d) {
    // Sofía en reposo (parpadea y respira) en el menú
    this.sofia.animar(t, d / 1000, true, 0);
  }
}
