// Sofía: personaje por piezas SVG animado por código (cinemática directa), o, en las etapas con vídeo (todas menos la adolescente),
// solo con los fotogramas sacados de sus vídeos.
// El contenedor tiene el origen en los pies; el cuerpo físico es un rectángulo encima.
import Phaser from 'phaser';
import { JUEGO } from '../config.js';
import { Audio } from '../audio/Audio.js';

const ESCALA_TEX = 2; // los SVG se rasterizan al doble para verse nítidos en móvil
const F = JUEGO.fisica;

// Jerarquía: padre -> hijos. Las posiciones salen del rig (pivotes en coordenadas de pies).
const PADRES = {
  torso: null,
  'pierna-atras': null,
  'pierna-delante': null,
  'brazo-atras': 'torso',
  'brazo-delante': 'torso',
  collar: 'torso',
  'collar-brillo': 'torso',
  cabeza: 'torso',
  ojos: 'cabeza',
  boca: 'cabeza',
  gafas: 'cabeza',
  'pelo-delante': 'cabeza',
  'pelo-atras': 'cabeza',
  'pelo-puntas': 'pelo-atras',
};
// Orden de dibujo (de atrás hacia delante)
const ORDEN = ['pelo-puntas', 'pelo-atras', 'brazo-atras', 'pierna-atras', 'pierna-delante', 'torso', 'collar-brillo', 'collar', 'cabeza', 'ojos', 'boca', 'gafas', 'pelo-delante', 'brazo-delante'];
// Orden de cálculo de la pose: cada pieza después de su padre
const ORDEN_POSE = [...ORDEN].sort((a, b) => profundidad(a) - profundidad(b));
function profundidad(nombre) {
  return PADRES[nombre] ? 1 + profundidad(PADRES[nombre]) : 0;
}
// Desplazamiento lateral de las extremidades en reposo
const DX = { 'pierna-atras': -4, 'pierna-delante': 4, 'brazo-atras': -8, 'brazo-delante': 9 };
// Etapas con vídeo (todas menos la adolescente): animación de fotogramas de cada estado, por orden de preferencia; si no hay ninguna, reposo
const ANIM_FOTOGRAMAS = {
  andar: ['andar'],
  correr: ['correr', 'andar'],
  saltar: ['saltar'],
  caer: ['caer'],
  aire: ['caer'],
  doble: ['doble', 'saltar'],
  empujar: ['empujar', 'andar'],
  danio: ['danio'],
  celebrar: ['celebrar'],
  cantar: ['cantar'],
  soplar: ['soplar'],
};
// Clave de textura y animación de los fotogramas de vídeo (también los de Miriam)
export const claveFotogramas = (etapa, modo, anim, personaje = 'sofia') => `${personaje}f-${etapa}-${modo}-${anim}`;
const TEXTURA = { 'pierna-atras': 'pierna', 'pierna-delante': 'pierna', 'brazo-atras': 'brazo', 'brazo-delante': 'brazo', boca: 'boca-sonrisa' };

export class Sofia extends Phaser.GameObjects.Container {
  constructor(scene, x, y, etapa, opciones = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.etapa = etapa;
    this.gatas = !!opciones.gatas;
    // Las etapas con vídeo se animan solo con sus fotogramas; el resto, con el SVG por piezas
    this.infoFotos = scene.cache.json.get('fotogramas-sofia')?.[etapa]?.[this.gatas ? 'gatas' : 'pie'];
    this.rig = this.infoFotos ? null : scene.cache.json.get('rig-sofia').etapas[etapa];
    this.alto = this.infoFotos ? this.infoFotos.altoJuego : this.rig.medidas.alto;
    this.habilidades = opciones.habilidades || {};
    this.mirando = 1;
    this.fase = 0;
    this.parpadeo = 2 + Math.random() * 2;
    this.estado = 'reposo';
    this.tiempoCanto = 0;
    this.saltosAire = 0;
    this.ultimoSuelo = 0;
    this.bufferSalto = -9999;
    this.invulnerableHasta = 0;
    this.empujando = false;
    this.controlBloqueado = false;
    this.pelo = { a: 0, va: 0, p: 0, vp: 0 };
    this.piezas = {};
    this.construir(opciones.gafas);

    scene.add.existing(this);
    scene.physics.world.enable(this);
    const anchoCuerpo = this.gatas ? 46 : 26;
    const altoCuerpo = this.gatas ? 40 : Math.round(this.alto * 0.9);
    this.body.setSize(anchoCuerpo, altoCuerpo);
    this.body.setOffset(-anchoCuerpo / 2, -altoCuerpo);
    this.body.setMaxVelocity(F.velocidadCorrer * 1.4, F.velocidadMaxCaida);
    this.body.pushable = false;
    this.setDepth(50);
  }

  construir(conGafas) {
    // Contenedor interior: se voltea, aplasta y gira sin tocar el cuerpo físico.
    this.medio = Math.round(this.alto / 2);
    this.visual = this.scene.add.container(0, -this.medio);
    this.add(this.visual);
    this.raiz = { x: 0, y: 0, rot: 0 }; // desplazamiento global del cuerpo (respiración, salto...)
    if (this.infoFotos) {
      this.construirFotos();
      return;
    }
    for (const nombre of ORDEN) {
      if (nombre === 'gafas' && !conGafas) continue;
      const tex = TEXTURA[nombre] || nombre;
      const info = this.rig.piezas[tex];
      if (!info) continue;
      const img = this.scene.add.image(0, 0, `sofia-${this.etapa}-${tex}`);
      img.setOrigin(info.origen[0], info.origen[1]);
      img.setScale(1 / ESCALA_TEX);
      if (nombre.endsWith('-atras') && nombre !== 'pelo-atras') img.setTint(0xb4c0da);
      const padre = PADRES[nombre];
      const pivPadre = padre ? this.pivote(padre) : [0, 0];
      const piv = [info.pivote[0] + (DX[nombre] || 0), info.pivote[1]];
      this.piezas[nombre] = { img, padre, local: [piv[0] - pivPadre[0], piv[1] - pivPadre[1]], rot: 0, x: 0, y: 0, rotAbs: 0 };
      this.visual.add(img);
    }
    this.piezas['collar-brillo'].img.setAlpha(0);
  }

  // Sofía hecha solo con los fotogramas de sus vídeos (tools/video-a-sprites.mjs)
  construirFotos() {
    const modo = this.gatas ? 'gatas' : 'pie';
    this.animFotos = {};
    for (const anim of Object.keys(this.infoFotos.animaciones)) {
      const clave = claveFotogramas(this.etapa, modo, anim);
      if (this.scene.anims.exists(clave)) this.animFotos[anim] = clave;
    }
    const inicial = this.animFotos.reposo || Object.values(this.animFotos)[0];
    this.fotos = this.scene.add.sprite(0, this.medio, inicial).setOrigin(this.infoFotos.origen[0], this.infoFotos.origen[1]).setScale(1 / ESCALA_TEX);
    this.visual.add(this.fotos);
  }

  elegirFotogramas(estado, vx) {
    const anim = (ANIM_FOTOGRAMAS[estado] || []).find((a) => this.animFotos[a]) || 'reposo';
    const clave = this.animFotos[anim] || Object.values(this.animFotos)[0];
    if (!clave) return;
    // las animaciones sin bucle (saltar, caer, golpe) se quedan en su último fotograma hasta cambiar de estado
    if (clave !== this.claveFotos) {
      this.claveFotos = clave;
      this.fotos.play(clave);
    }
    // el ciclo de andar o correr va al ritmo de la velocidad real (sin vídeo de correr, se acelera el de andar)
    const ref = this.gatas ? F.velocidadGatas : anim === 'correr' ? F.velocidadCorrer : F.velocidadAndar;
    this.fotos.anims.timeScale = estado === 'andar' || estado === 'correr' ? Phaser.Math.Clamp(vx / ref, 0.6, 1.8) : 1;
  }

  pivote(nombre) {
    const tex = TEXTURA[nombre] || nombre;
    const info = this.rig.piezas[tex];
    return [info.pivote[0] + (DX[nombre] || 0), info.pivote[1]];
  }

  setCara({ ojos, boca }) {
    if (ojos) this.piezas.ojos.img.setTexture(`sofia-${this.etapa}-${ojos}`);
    if (boca) this.piezas.boca.img.setTexture(`sofia-${this.etapa}-${boca}`);
  }

  // ---- Lógica de movimiento --------------------------------------------------
  // entrada: { izq, der, correr, saltar (pulsado este frame), saltarMantenido, cantar }
  actualizar(tiempo, delta, entrada) {
    const dt = delta / 1000;
    const b = this.body;
    // gravedad invertida (g = -1): el "suelo" es el techo y se salta hacia abajo
    const g = this.g || 1;
    const vy = b.velocity.y * g;
    // 'touching' también se activa con solapamientos (enemigos, zonas): solo cuenta si hubo choque real
    const choque = tiempo - (this.contactoSolido || -1e9) < 60;
    const enSuelo = g > 0 ? b.blocked.down || (b.touching.down && choque) : b.blocked.up || (b.touching.up && choque);
    if (enSuelo) {
      if (!this.estabaEnSuelo && vy >= 0 && this.velPrevY > 300) {
        Audio.efecto('aterrizar');
        this.squash = 1;
      }
      this.ultimoSuelo = tiempo;
      this.saltosAire = 0;
    }
    this.estabaEnSuelo = enSuelo;
    this.velPrevY = vy;

    let dir = 0;
    if (!this.controlBloqueado) {
      if (entrada.izq) dir -= 1;
      if (entrada.der) dir += 1;
    }
    // Al entrar o salir de una inversión, la flecha que ya se mantenía pulsada conserva su sentido
    // hasta soltarla (si no, Sofía se daría la vuelta en el borde y se quedaría temblando).
    const inv = !!this.invertido;
    if (inv !== this._invAnterior) {
      this._dirMantenida = dir;
      this._invMantenido = !!this._invAnterior;
      this._invAnterior = inv;
    }
    if (dir !== this._dirMantenida) this._dirMantenida = 0;
    const invEfectivo = dir !== 0 && dir === this._dirMantenida ? this._invMantenido : inv;
    if (invEfectivo) dir = -dir;
    const corre = entrada.correr && this.habilidades.correr && !this.gatas;
    const vMax = this.gatas ? F.velocidadGatas : corre ? F.velocidadCorrer : F.velocidadAndar;
    const acel = enSuelo ? F.aceleracionSuelo : F.aceleracionAire;
    const enRetroceso = tiempo < (this.retrocesoHasta || 0);
    if (!enRetroceso) {
      if (dir !== 0) {
        this.mirando = dir;
        const objetivo = dir * vMax;
        const vx = b.velocity.x;
        const paso = (Math.sign(objetivo - vx) * acel * dt);
        b.setVelocityX(Math.abs(objetivo - vx) <= Math.abs(paso) ? objetivo : vx + paso);
      } else {
        const vx = b.velocity.x;
        const fr = (enSuelo ? F.frenadoSuelo : F.aceleracionAire * 0.5) * dt;
        b.setVelocityX(Math.abs(vx) <= fr ? 0 : vx - Math.sign(vx) * fr);
      }
    }
    this.corriendo = corre && dir !== 0;

    // Salto con tiempo de coyote y buffer
    if (entrada.saltar && !this.controlBloqueado) this.bufferSalto = tiempo;
    const puedeCoyote = tiempo - this.ultimoSuelo <= F.coyoteMs;
    if (tiempo - this.bufferSalto <= F.bufferSaltoMs) {
      if (enSuelo || (puedeCoyote && vy >= 0 && this.saltosAire === 0 && !this.saltando)) {
        b.setVelocityY(-(this.gatas ? F.saltoBebe : F.salto) * (this.multSalto || 1) * g);
        this.bufferSalto = -9999;
        this.saltando = true;
        this.ultimoSuelo = -9999;
        Audio.efecto('salto');
        this.estirar = 1;
      } else if (this.habilidades.dobleSalto && this.saltosAire === 0 && entrada.saltar) {
        b.setVelocityY(-F.dobleSalto * (this.multSalto || 1) * g);
        this.saltosAire = 1;
        this.bufferSalto = -9999;
        // voltereta: con fotogramas si el vídeo la tiene; si no, pirueta girando el personaje
        const doble = this.infoFotos?.animaciones.doble;
        if (doble) this.dobleHasta = tiempo + (doble.fotogramas / doble.fps) * 1000;
        else this.vuelta = 1;
        Audio.efecto('dobleSalto');
        this.emit('dobleSalto');
      }
    }
    if (enSuelo && vy >= 0) this.saltando = false;
    // salto variable: soltar el botón corta la subida
    if (!entrada.saltarMantenido && vy < 0 && this.saltando) {
      b.setVelocityY(b.velocity.y * (1 - (1 - F.cortarSalto) * Math.min(1, dt * 20)));
    }

    // Cantar
    if (entrada.cantar && this.habilidades.cantar && tiempo >= this.tiempoCanto && !this.controlBloqueado) {
      this.tiempoCanto = tiempo + JUEGO.canto.recargaMs;
      this.cantandoHasta = tiempo + JUEGO.canto.duracionMs;
      this.emit('canta');
    }
    this.cantando = tiempo < (this.cantandoHasta || 0);

    this.animar(tiempo, dt, enSuelo, dir);
  }

  recargaCanto(tiempo) {
    if (!this.habilidades.cantar) return 1;
    return Phaser.Math.Clamp(1 - (this.tiempoCanto - tiempo) / JUEGO.canto.recargaMs, 0, 1);
  }

  // ---- Animación procedural ----------------------------------------------------
  animar(tiempo, dt, enSuelo, dir) {
    const b = this.body;
    const vx = Math.abs(b.velocity.x);
    let estado;
    if (this.estadoForzado) estado = this.estadoForzado;
    else if (tiempo < (this.dolorHasta || 0)) estado = 'danio';
    else if (this.cantando) estado = enSuelo ? 'cantar' : 'aire';
    else if (!enSuelo && tiempo < (this.dobleHasta || 0)) estado = 'doble';
    // perder el suelo un instante (cajas, plataformas que se mueven) no cuenta como caer
    else if (!enSuelo && (b.velocity.y * (this.g || 1) < 0 || tiempo - this.ultimoSuelo > 90)) estado = b.velocity.y * (this.g || 1) < 0 ? 'saltar' : 'caer';
    else if (this.empujando) estado = 'empujar';
    else if (vx > 20) estado = this.corriendo ? 'correr' : 'andar';
    else estado = 'reposo';
    this.estado = estado;
    // de frente (pantalla de Controles): el dibujo de la hoja de personaje; a gatas no hay, y se queda de lado en reposo
    const deFrente = estado === 'frente' && !this.gatas && this.scene.textures.exists(`sofia-frente-${this.etapa}`);
    this.verDeFrente(deFrente);
    if (deFrente) this.frente.setScale(1 / ESCALA_TEX, (1 + Math.sin(tiempo / 600) * 0.01) / ESCALA_TEX); // respira
    else if (this.fotos) this.elegirFotogramas(estado === 'frente' ? 'reposo' : estado, vx);
    else this.animarPiezas(estado === 'frente' ? 'reposo' : estado, tiempo, dt, vx);
    this.transformar(tiempo, dt);
    this.ajustarEmpuje(estado, dt);
  }

  // Cambia entre el dibujo de frente y el de lado (fotogramas o piezas)
  verDeFrente(si) {
    if (si === !!this.deFrente) return;
    this.deFrente = si;
    if (si && !this.frente) {
      this.frente = this.scene.add.image(0, this.medio, `sofia-frente-${this.etapa}`).setOrigin(0.5, 1);
      this.visual.add(this.frente);
    }
    for (const hijo of this.visual.list) hijo.setVisible(hijo === this.frente ? si : !si);
  }

  // Al empujar, el dibujo se retrasa para que las manos se queden en el borde de la caja en vez de traspasarla.
  // bordeEmpuje (lo pone la escena): distancia de los pies al borde visible de la caja; alcance: hasta dónde llegan
  // las manos (medido en cada fotograma del vídeo o calculado con la pose de las piezas).
  ajustarEmpuje(estado, dt) {
    let objetivo = 0;
    if (estado === 'empujar') {
      const alcances = this.fotos && this.claveFotos === this.animFotos.empujar ? this.infoFotos.animaciones.empujar.alcance : null;
      const alcance = alcances ? alcances[this.fotos.anims.currentFrame?.index - 1] ?? alcances[0] : this.alcancePiezas;
      if (alcance) objetivo = Math.min(0, (this.bordeEmpuje ?? this.body.width / 2) - alcance);
    }
    this.ajusteEmpuje = Phaser.Math.Linear(this.ajusteEmpuje || 0, objetivo, Math.min(1, dt * 25));
    this.visual.x = this.ajusteEmpuje * this.mirando;
  }

  // Personaje por piezas: pose de cada estado, cara, pelo y brillo del collar
  animarPiezas(estado, tiempo, dt, vx) {
    const b = this.body;
    const p = this.piezas;
    const velAnim = estado === 'correr' ? 15 : estado === 'empujar' ? 7 : this.gatas ? 9 : 11;
    this.fase += dt * velAnim * (estado === 'andar' || estado === 'correr' || estado === 'empujar' ? Math.max(0.5, vx / 200) : 1);
    const s = Math.sin(this.fase);
    const c = Math.cos(this.fase);
    const r = { torso: 0, cabeza: 0, 'pierna-atras': 0, 'pierna-delante': 0, 'brazo-atras': 0.15, 'brazo-delante': -0.1 };
    let rx = 0;
    let ry = 0;
    let boca = 'boca-sonrisa';

    if (this.gatas) {
      this.poseGatas(estado, s, r, tiempo);
      ry = r._ry || 0;
    } else {
      switch (estado) {
        case 'reposo': {
          const resp = Math.sin(tiempo / 600);
          ry = resp * 0.8;
          r.cabeza = resp * 0.03;
          r['brazo-atras'] = 0.12 + resp * 0.03;
          r['brazo-delante'] = -0.08 - resp * 0.03;
          break;
        }
        case 'andar':
          r['pierna-delante'] = s * 0.55;
          r['pierna-atras'] = -s * 0.55;
          r['brazo-delante'] = -s * 0.6;
          r['brazo-atras'] = s * 0.6;
          ry = -Math.abs(c) * 2.5;
          r.torso = 0.04;
          r.cabeza = 0.02 + c * 0.02;
          break;
        case 'correr':
          r['pierna-delante'] = s * 0.95;
          r['pierna-atras'] = -s * 0.95;
          r['brazo-delante'] = -s * 1.1 - 0.3;
          r['brazo-atras'] = s * 1.1 - 0.3;
          ry = -Math.abs(c) * 4.5;
          r.torso = 0.16;
          r.cabeza = -0.06;
          break;
        case 'empujar':
          r.torso = 0.32;
          r.cabeza = -0.2;
          r['brazo-delante'] = -1.35 + s * 0.05;
          r['brazo-atras'] = -1.25 - s * 0.05;
          r['pierna-delante'] = 0.35 + s * 0.35;
          r['pierna-atras'] = -0.45 - s * 0.35;
          rx = -3;
          boca = 'boca-ay';
          break;
        case 'saltar':
          r['pierna-delante'] = 0.7;
          r['pierna-atras'] = -0.25;
          r['brazo-delante'] = -2.5;
          r['brazo-atras'] = -2.2;
          r.cabeza = -0.1;
          break;
        case 'caer':
        case 'aire':
          r['pierna-delante'] = 0.3 + s * 0.15;
          r['pierna-atras'] = -0.3 - s * 0.15;
          r['brazo-delante'] = -2.0 + Math.sin(tiempo / 70) * 0.35;
          r['brazo-atras'] = -1.8 - Math.sin(tiempo / 70) * 0.35;
          boca = estado === 'aire' ? 'boca-canta' : 'boca-sonrisa';
          break;
        case 'cantar': {
          const v = Math.sin(tiempo / 120);
          r.cabeza = -0.22 + v * 0.04;
          r.torso = -0.05;
          r['brazo-delante'] = -1.9 + v * 0.1;
          r['brazo-atras'] = -0.6;
          ry = v;
          boca = 'boca-canta';
          break;
        }
        case 'danio':
          r.torso = -0.25;
          r.cabeza = 0.15;
          r['brazo-delante'] = -2.6;
          r['brazo-atras'] = -2.8;
          r['pierna-delante'] = -0.4;
          r['pierna-atras'] = 0.4;
          boca = 'boca-ay';
          break;
        case 'celebrar': {
          const v = Math.abs(Math.sin(tiempo / 160));
          ry = -v * 18;
          r['brazo-delante'] = -2.9;
          r['brazo-atras'] = -2.7;
          r['pierna-delante'] = v * 0.4;
          r['pierna-atras'] = -v * 0.4;
          r.cabeza = -0.1;
          break;
        }
        case 'soplar':
          r.torso = 0.18;
          r.cabeza = 0.12;
          r['brazo-delante'] = -0.4;
          r['brazo-atras'] = 0.3;
          boca = 'boca-sopla';
          break;
        default:
          break;
      }
    }

    // Parpadeo
    this.parpadeo -= dt;
    let ojos = 'ojos';
    if (this.parpadeo < 0) {
      ojos = 'ojos-cerrados';
      if (this.parpadeo < -0.12) this.parpadeo = 2 + Math.random() * 3;
    }
    if (estado === 'danio' || estado === 'cantar' || estado === 'soplar') ojos = estado === 'danio' ? 'ojos-cerrados' : ojos;
    if (this.caraForzada) {
      ojos = this.caraForzada.ojos || ojos;
      boca = this.caraForzada.boca || boca;
    }
    if (ojos !== this.ojosAct) {
      this.setCara({ ojos });
      this.ojosAct = ojos;
    }
    if (boca !== this.bocaAct) {
      this.setCara({ boca });
      this.bocaAct = boca;
    }

    // Física sencilla del pelo: muelle amortiguado que reacciona a la velocidad
    const objetivoPelo = Phaser.Math.Clamp(-b.velocity.x * this.mirando * 0.0011 + b.velocity.y * (this.g || 1) * 0.0004, -0.6, 0.5) - (r.cabeza + r.torso) * 0.6;
    const k = 90;
    const amort = 9;
    this.pelo.va += ((objetivoPelo - this.pelo.a) * k - this.pelo.va * amort) * dt;
    this.pelo.a += this.pelo.va * dt;
    this.pelo.vp += ((this.pelo.a * 0.9 - this.pelo.p) * 70 - this.pelo.vp * 6) * dt;
    this.pelo.p += this.pelo.vp * dt;
    // rebote de los rizos al andar
    const rebote = estado === 'andar' || estado === 'correr' ? Math.sin(this.fase * 2) * 0.03 : 0;
    r['pelo-atras'] = this.pelo.a + rebote;
    r['pelo-puntas'] = this.pelo.p - this.pelo.a * 0.4 + rebote;

    // Brillo del collar al cantar
    const brillo = p['collar-brillo'].img;
    const objetivoBrillo = this.cantando ? 0.75 + Math.sin(tiempo / 60) * 0.25 : 0;
    brillo.setAlpha(Phaser.Math.Linear(brillo.alpha, objetivoBrillo, Math.min(1, dt * 12)));
    brillo.setScale((1 + Math.sin(tiempo / 90) * 0.1) / ESCALA_TEX);

    this.raiz.x = rx;
    this.raiz.y = ry;
    this.aplicarPose(r);
    if (estado === 'empujar') {
      // punta de la mano más adelantada (el brazo cuelga de su pivote y gira con la pose)
      const brazo = this.rig.piezas.brazo;
      const largo = brazo.h * (1 - brazo.origen[1]) - 4;
      this.alcancePiezas = Math.max(...['brazo-delante', 'brazo-atras'].map((n) => p[n].x - Math.sin(p[n].rotAbs) * largo));
    }
  }

  // Volteo, estirar y aplastar, pirueta y parpadeo de invulnerabilidad (con piezas o con fotogramas)
  transformar(tiempo, dt) {
    // pirueta del doble salto
    let rrot = 0;
    if (this.vuelta > 0) {
      this.vuelta = Math.max(0, this.vuelta - dt * 3.2);
      rrot = (1 - this.vuelta) * Math.PI * 2;
      if (this.vuelta === 0) rrot = 0;
    }
    // estirar y aplastar
    let sx = 1;
    let sy = 1;
    if (this.squash > 0) {
      this.squash = Math.max(0, this.squash - dt * 6);
      sy = 1 - this.squash * 0.12;
      sx = 1 + this.squash * 0.1;
    }
    if (this.estirar > 0) {
      this.estirar = Math.max(0, this.estirar - dt * 5);
      sy *= 1 + this.estirar * 0.08;
      sx *= 1 - this.estirar * 0.06;
    }
    const g = this.g || 1;
    this.visual.setScale(this.mirando * sx, sy * g);
    // boca abajo, los pies tocan la parte de arriba del cuerpo físico
    this.visual.y = g > 0 ? -this.medio * sy : this.medio * sy - this.body.height;
    this.visual.rotation = rrot * this.mirando;
    // parpadeo de invulnerabilidad
    this.alpha = tiempo < this.invulnerableHasta ? (Math.floor(tiempo / 80) % 2 ? 0.35 : 1) : 1;
  }

  poseGatas(estado, s, r, tiempo) {
    // A gatas: el torso horizontal, la cabeza delante, brazos y piernas como patitas.
    const mov = estado === 'andar' || estado === 'correr' || estado === 'empujar';
    const a = mov ? s * 0.5 : 0;
    r.torso = 1.35;
    r.cabeza = -1.25 + (mov ? Math.cos(this.fase) * 0.04 : Math.sin(tiempo / 700) * 0.05);
    r['brazo-delante'] = -2.4 + a * 0.5;
    r['brazo-atras'] = -2.4 - a * 0.5;
    r['pierna-delante'] = 1.25 - a * 0.5;
    r['pierna-atras'] = 1.25 + a * 0.5;
    r._ry = 0;
    if (estado === 'saltar' || estado === 'caer') {
      r['brazo-delante'] = -3.0;
      r['brazo-atras'] = -2.9;
      r['pierna-delante'] = 1.6;
      r['pierna-atras'] = 1.5;
    }
    if (estado === 'danio') r.cabeza = -1.0;
  }

  aplicarPose(r) {
    const p = this.piezas;
    const gatas = this.gatas;
    // raíz: la cadera; a gatas se baja y se retrasa para que manos y rodillas toquen el suelo
    for (const nombre of ORDEN_POSE) {
      const pz = p[nombre];
      if (!pz) continue;
      const rot = r[nombre] || 0;
      if (!pz.padre) {
        let lx = pz.local[0] + this.raiz.x;
        let ly = pz.local[1] + this.raiz.y;
        if (gatas) {
          // a gatas la cadera baja y se retrasa para que manos y rodillas toquen el suelo
          lx -= 10;
          ly += 2;
        }
        pz.x = lx;
        pz.y = ly;
        pz.rotAbs = rot;
      } else {
        const padre = p[pz.padre];
        const cs = Math.cos(padre.rotAbs);
        const sn = Math.sin(padre.rotAbs);
        pz.x = padre.x + pz.local[0] * cs - pz.local[1] * sn;
        pz.y = padre.y + pz.local[0] * sn + pz.local[1] * cs;
        pz.rotAbs = padre.rotAbs + rot;
      }
      pz.img.setPosition(pz.x, pz.y + this.medio);
      pz.img.setRotation(pz.rotAbs);
    }
  }

  // ---- Eventos de juego -------------------------------------------------------
  recibirGolpe(tiempo, desdeX) {
    if (tiempo < this.invulnerableHasta) return false;
    this.invulnerableHasta = tiempo + JUEGO.danio.invulnerableMs;
    this.dolorHasta = tiempo + 380;
    const lado = desdeX === undefined ? -this.mirando : Math.sign(this.x - desdeX) || -this.mirando;
    this.body.setVelocity(lado * JUEGO.danio.retrocesoX, -JUEGO.danio.retrocesoY);
    this.retrocesoHasta = tiempo + 260;
    Audio.efecto('danio');
    if (navigator.vibrate) navigator.vibrate(JUEGO.controles.vibracionMs);
    return true;
  }

  empujarAtras(desdeX, fuerza = 360) {
    const lado = Math.sign(this.x - desdeX) || -this.mirando;
    this.body.setVelocity(lado * fuerza, -220);
    this.retrocesoHasta = this.scene.time.now + 220;
    this.dolorHasta = this.scene.time.now + 380; // pose de golpe, aunque no quite vela
  }

  colocar(x, y) {
    this.setPosition(x, y);
    this.body.reset(x, y);
    this.body.setVelocity(0, 0);
    this.saltando = false;
    this.vuelta = 0;
    this.dobleHasta = 0;
    this.visual.rotation = 0;
  }
}

export const ESCALA_TEXTURAS = ESCALA_TEX;
