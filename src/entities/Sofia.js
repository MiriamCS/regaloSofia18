// Sofía: se anima con los fotogramas sacados de sus vídeos (tools/video-a-sprites.mjs). Cada edad tiene sus animaciones
// de pie; el bebé, también a gatas, y la adolescente, también con gafas.
// El contenedor tiene el origen en los pies; el cuerpo físico es un rectángulo encima.
import Phaser from 'phaser';
import { JUEGO } from '../config.js';
import { Audio } from '../audio/Audio.js';

const ESCALA_TEX = 2; // las texturas van al doble de resolución para verse nítidas en móvil
const F = JUEGO.fisica;

// Animación de fotogramas de cada estado, por orden de preferencia; si no hay ninguna, reposo
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

export class Sofia extends Phaser.GameObjects.Container {
  constructor(scene, x, y, etapa, opciones = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.etapa = etapa;
    this.gatas = !!opciones.gatas;
    this.indiceFotos = scene.cache.json.get('fotogramas-sofia')[etapa];
    this.modo = this.gatas ? 'gatas' : opciones.gafas && this.indiceFotos.gafas ? 'gafas' : 'pie';
    this.infoFotos = this.indiceFotos[this.modo];
    this.alto = this.infoFotos.altoJuego;
    this.habilidades = opciones.habilidades || {};
    this.mirando = 1;
    this.estado = 'reposo';
    this.tiempoCanto = 0;
    this.saltosAire = 0;
    this.ultimoSuelo = 0;
    this.bufferSalto = -9999;
    this.invulnerableHasta = 0;
    this.empujando = false;
    this.controlBloqueado = false;
    this.construir();

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

  construir() {
    // Contenedor interior: se voltea, aplasta y gira sin tocar el cuerpo físico.
    this.medio = Math.round(this.alto / 2);
    this.visual = this.scene.add.container(0, -this.medio);
    this.add(this.visual);
    this.fotos = this.scene.add.sprite(0, this.medio, '__DEFAULT').setScale(1 / ESCALA_TEX);
    this.visual.add(this.fotos);
    this.cargarAnimaciones();
  }

  // Animaciones del modo actual (de pie, a gatas o con gafas)
  cargarAnimaciones() {
    this.animFotos = {};
    for (const anim of Object.keys(this.infoFotos.animaciones)) {
      const clave = claveFotogramas(this.etapa, this.modo, anim);
      if (this.scene.anims.exists(clave)) this.animFotos[anim] = clave;
    }
    this.fotos.setOrigin(this.infoFotos.origen[0], this.infoFotos.origen[1]);
    this.claveFotos = null;
    this.fotos.play(this.animFotos.reposo || Object.values(this.animFotos)[0]);
  }

  // La adolescente se pone o se quita las gafas (nivel 15: las lleva mientras tiene el objeto de las gafas)
  ponerGafas(si = true) {
    const modo = si ? 'gafas' : 'pie';
    if (this.gatas || modo === this.modo || !this.indiceFotos[modo]) return;
    this.modo = modo;
    this.infoFotos = this.indiceFotos[modo];
    this.cargarAnimaciones();
  }

  elegirFotogramas(estado, vx) {
    const anim = (ANIM_FOTOGRAMAS[estado] || []).find((a) => this.animFotos[a]) || 'reposo';
    const clave = this.animFotos[anim] || Object.values(this.animFotos)[0];
    // las animaciones sin bucle (saltar, caer, golpe) se quedan en su último fotograma hasta cambiar de estado
    if (clave !== this.claveFotos) {
      this.claveFotos = clave;
      this.fotos.play(clave);
    }
    // el ciclo de andar o correr va al ritmo de la velocidad real (sin vídeo de correr, se acelera el de andar)
    const ref = this.gatas ? F.velocidadGatas : anim === 'correr' ? F.velocidadCorrer : F.velocidadAndar;
    this.fotos.anims.timeScale = estado === 'andar' || estado === 'correr' ? Phaser.Math.Clamp(vx / ref, 0.6, 1.8) : 1;
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
        const doble = this.infoFotos.animaciones.doble;
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

  // ---- Animación ----------------------------------------------------------------
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
    else this.elegirFotogramas(estado === 'frente' ? 'reposo' : estado, vx);
    this.transformar(tiempo, dt);
    this.ajustarEmpuje(estado, dt);
  }

  // Cambia entre el dibujo de frente y el de lado
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
  // las manos (medido en cada fotograma del vídeo).
  ajustarEmpuje(estado, dt) {
    let objetivo = 0;
    if (estado === 'empujar') {
      const alcances = this.claveFotos === this.animFotos.empujar ? this.infoFotos.animaciones.empujar.alcance : null;
      const alcance = alcances ? alcances[this.fotos.anims.currentFrame?.index - 1] ?? alcances[0] : null;
      if (alcance) objetivo = Math.min(0, (this.bordeEmpuje ?? this.body.width / 2) - alcance);
    }
    this.ajusteEmpuje = Phaser.Math.Linear(this.ajusteEmpuje || 0, objetivo, Math.min(1, dt * 25));
    this.visual.x = this.ajusteEmpuje * this.mirando;
  }

  // Volteo, estirar y aplastar, pirueta y parpadeo de invulnerabilidad
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
    // 'crecer': solo agranda el dibujo, desde los pies (el cuerpo físico no cambia); lo usa el camino blanco del final
    const c = this.crecer || 1;
    this.visual.setScale(this.mirando * sx * c, sy * g * c);
    // boca abajo, los pies tocan la parte de arriba del cuerpo físico
    this.visual.y = g > 0 ? -this.medio * sy * c : this.medio * sy * c - this.body.height;
    this.visual.rotation = rrot * this.mirando;
    // parpadeo de invulnerabilidad
    this.alpha = tiempo < this.invulnerableHasta ? (Math.floor(tiempo / 80) % 2 ? 0.35 : 1) : 1;
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
