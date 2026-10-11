// Audio sintetizado con Web Audio: piano sencillo, efectos y secuenciador de música.
// Sin archivos de audio ni licencias: todo se genera por código.
import { Guardado } from '../systems/Guardado.js';

const NOMBRES = { do: 0, re: 2, mi: 4, fa: 5, sol: 7, la: 9, si: 11 };
const LETRAS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// 'C4', 'F#5', 'Bb3', 'do4', 'sol#4' o número MIDI -> número MIDI
export function midi(nota) {
  if (typeof nota === 'number') return nota;
  let m = /^([A-G])([#b]?)(-?\d)$/.exec(nota);
  if (m) return 12 * (Number(m[3]) + 1) + LETRAS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  m = /^(do|re|mi|fa|sol|la|si)([#b]?)(-?\d)$/.exec(nota);
  if (m) return 12 * (Number(m[3]) + 1) + NOMBRES[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 60;
}
export const frecuencia = (n) => 440 * Math.pow(2, (midi(n) - 69) / 12);

class MotorAudio {
  constructor() {
    this.ctx = null;
    this.musica = null;
    this.pistaActual = null;
    this.velocidad = 1;
  }

  // Debe llamarse tras un toque del usuario (iOS no deja sonar antes).
  iniciar() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.maestro = this.ctx.createGain();
    this.maestro.connect(this.ctx.destination);
    // compresor suave para que no sature
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -16;
    this.comp.connect(this.maestro);
    this.busMusica = this.ctx.createGain();
    this.busEfectos = this.ctx.createGain();
    this.busMusica.connect(this.comp);
    this.busEfectos.connect(this.comp);
    // reverb barata (eco) para el piano
    this.eco = this.ctx.createDelay(1);
    this.eco.delayTime.value = 0.23;
    const realim = this.ctx.createGain();
    realim.gain.value = 0.28;
    this.ecoSalida = this.ctx.createGain();
    this.ecoSalida.gain.value = 0.22;
    this.eco.connect(realim).connect(this.eco);
    this.eco.connect(this.ecoSalida).connect(this.comp);
    this.ondaPiano = this.ctx.createPeriodicWave(
      new Float32Array([0, 1, 0.42, 0.22, 0.12, 0.07, 0.04, 0.02]),
      new Float32Array(8),
    );
    this.aplicarVolumenes();
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend();
      else this.ctx.resume();
    });
    if (this.pendiente) {
      const p = this.pendiente;
      this.pendiente = null;
      this.tocarMusica(p.pista, p.opciones);
    }
  }

  aplicarVolumenes() {
    if (!this.ctx) return;
    this.busMusica.gain.value = Guardado.opcion('musica') * 0.55;
    this.busEfectos.gain.value = Guardado.opcion('efectos') * 0.8;
  }

  get t() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // ---- Piano ---------------------------------------------------------------
  piano(nota, { cuando = 0, dur = 0.6, vel = 0.7, bus = 'efectos', eco = true } = {}) {
    if (!this.ctx) return;
    const t0 = Math.max(this.t, cuando || this.t);
    const f = frecuencia(nota);
    const osc = this.ctx.createOscillator();
    osc.setPeriodicWave(this.ondaPiano);
    osc.frequency.value = f;
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = f * 2.001;
    const g = this.ctx.createGain();
    const g2 = this.ctx.createGain();
    const filtro = this.ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.Q.value = 0.4;
    const brillo = Math.min(9000, f * 7 + 900);
    filtro.frequency.setValueAtTime(brillo, t0);
    filtro.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.6), t0 + 1.2);
    const amp = 0.28 * vel;
    const cola = Math.max(0.35, Math.min(2.6, dur * 1.6 + 0.4)) * (f > 900 ? 0.6 : 1);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(amp, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(amp * 0.45, t0 + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + cola);
    g2.gain.setValueAtTime(amp * 0.25, t0);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
    osc.connect(g);
    osc2.connect(g2);
    g.connect(filtro);
    g2.connect(filtro);
    const destino = bus === 'musica' ? this.busMusica : this.busEfectos;
    filtro.connect(destino);
    if (eco) filtro.connect(this.eco);
    osc.start(t0);
    osc2.start(t0);
    osc.stop(t0 + cola + 0.05);
    osc2.stop(t0 + 0.35);
  }

  // ---- Efectos -------------------------------------------------------------
  tono({ tipo = 'square', de, a, dur = 0.12, vol = 0.18, cuando = 0, curva = 'exp' }) {
    if (!this.ctx) return;
    const t0 = Math.max(this.t, cuando || this.t);
    const o = this.ctx.createOscillator();
    o.type = tipo;
    o.frequency.setValueAtTime(de, t0);
    if (a) {
      if (curva === 'exp') o.frequency.exponentialRampToValueAtTime(a, t0 + dur);
      else o.frequency.linearRampToValueAtTime(a, t0 + dur);
    }
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.busEfectos);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  ruido({ dur = 0.15, vol = 0.25, filtro = 1200, tipo = 'lowpass', cuando = 0 }) {
    if (!this.ctx) return;
    const t0 = Math.max(this.t, cuando || this.t);
    if (!this.bufRuido) {
      const n = this.ctx.sampleRate;
      this.bufRuido = this.ctx.createBuffer(1, n, n);
      const d = this.bufRuido.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = this.ctx.createBufferSource();
    s.buffer = this.bufRuido;
    const fl = this.ctx.createBiquadFilter();
    fl.type = tipo;
    fl.frequency.value = filtro;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(fl).connect(g).connect(this.busEfectos);
    s.start(t0, Math.random() * 0.5);
    s.stop(t0 + dur + 0.02);
  }

  efecto(nombre, extra) {
    if (!this.ctx) return;
    const t = this.t;
    switch (nombre) {
      case 'salto':
        this.tono({ tipo: 'square', de: 300, a: 620, dur: 0.13, vol: 0.09 });
        break;
      case 'dobleSalto':
        this.tono({ tipo: 'square', de: 520, a: 1040, dur: 0.12, vol: 0.08 });
        this.tono({ tipo: 'sine', de: 1400, a: 2200, dur: 0.15, vol: 0.06, cuando: t + 0.05 });
        break;
      case 'aterrizar':
        this.ruido({ dur: 0.07, vol: 0.14, filtro: 500 });
        break;
      case 'empujar':
        this.ruido({ dur: 0.12, vol: 0.06, filtro: 300 });
        break;
      case 'danio':
        this.tono({ tipo: 'sawtooth', de: 480, a: 120, dur: 0.3, vol: 0.12 });
        break;
      case 'vela':
        this.ruido({ dur: 0.35, vol: 0.22, filtro: 2500, tipo: 'bandpass' });
        this.tono({ tipo: 'sine', de: 330, a: 160, dur: 0.5, vol: 0.12, cuando: t + 0.1 });
        break;
      case 'checkpoint':
        ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => this.piano(n, { cuando: t + i * 0.08, dur: 0.4, vel: 0.6 }));
        break;
      case 'coleccionable':
        ['G5', 'B5', 'D6', 'G6', 'D6', 'G6'].forEach((n, i) => this.piano(n, { cuando: t + i * 0.07, dur: 0.3, vel: 0.55 }));
        break;
      case 'nivelCompletado':
        [['C5', 0], ['E5', 0.12], ['G5', 0.24], ['C6', 0.36], ['G5', 0.6], ['C6', 0.72]].forEach(([n, d]) => this.piano(n, { cuando: t + d, dur: 0.6, vel: 0.7 }));
        ['C4', 'G4', 'E5'].forEach((n) => this.piano(n, { cuando: t + 0.72, dur: 1.2, vel: 0.45 }));
        break;
      case 'robo':
        this.tono({ tipo: 'triangle', de: 900, a: 300, dur: 0.25, vol: 0.14 });
        this.tono({ tipo: 'triangle', de: 700, a: 200, dur: 0.25, vol: 0.1, cuando: t + 0.12 });
        break;
      case 'puerta':
        ['G4', 'C5', 'E5', 'G5'].forEach((n, i) => this.piano(n, { cuando: t + i * 0.1, dur: 0.6 }));
        break;
      case 'mal':
        this.tono({ tipo: 'square', de: 200, a: 150, dur: 0.18, vol: 0.08 });
        this.tono({ tipo: 'square', de: 150, a: 110, dur: 0.25, vol: 0.08, cuando: t + 0.18 });
        break;
      case 'pop':
        this.tono({ tipo: 'sine', de: 700, a: 1500, dur: 0.08, vol: 0.12 });
        break;
      case 'soplo':
        this.ruido({ dur: 0.25, vol: 0.12, filtro: 1800, tipo: 'bandpass' });
        break;
      case 'invertir':
        this.tono({ tipo: 'sawtooth', de: 200, a: 800, dur: 0.2, vol: 0.06 });
        this.tono({ tipo: 'sawtooth', de: 800, a: 200, dur: 0.2, vol: 0.06, cuando: t + 0.2 });
        break;
      case 'nota':
        this.piano(extra || 'C5', { dur: 0.5, vel: 0.7 });
        break;
      case 'tic':
        this.tono({ tipo: 'square', de: 1800, dur: 0.03, vol: 0.05 });
        break;
      default:
        break;
    }
  }

  // ---- Música ---------------------------------------------------------------
  // pista: { bpm, compases?, notas: [[tiempoEnPulsos, nota, duracionEnPulsos, vel], ...], duracion }
  tocarMusica(pista, opciones = {}) {
    if (!pista) return this.pararMusica();
    if (!this.ctx) {
      this.pendiente = { pista, opciones };
      return;
    }
    if (this.musica && this.pistaActual === pista) return;
    this.pararMusica();
    this.pistaActual = pista;
    const notas = [...pista.notas].sort((a, b) => a[0] - b[0]);
    const estado = {
      pista,
      notas,
      indice: 0,
      inicio: this.t + 0.1,
      pulsoInicio: 0,
      bucle: opciones.bucle !== false,
      volumen: opciones.volumen ?? 1,
    };
    this.musica = estado;
    this.temporizador = setInterval(() => this.programar(), 40);
    this.programar();
  }

  setVelocidad(v) {
    if (!this.musica || v === this.velocidad) {
      this.velocidad = v;
      return;
    }
    // rebasar el reloj para que el cambio de tempo no salte
    const m = this.musica;
    const pulsoActual = this.pulsoEn(this.t);
    m.pulsoInicio = pulsoActual;
    m.inicio = this.t;
    this.velocidad = v;
  }

  pulsoEn(tiempo) {
    const m = this.musica;
    const spp = 60 / (m.pista.bpm * this.velocidad);
    return m.pulsoInicio + (tiempo - m.inicio) / spp;
  }

  programar() {
    const m = this.musica;
    if (!m || !this.ctx) return;
    const spp = 60 / (m.pista.bpm * this.velocidad);
    const dur = m.pista.duracion;
    let guardia = 0;
    while (guardia++ < 400) {
      const limite = this.pulsoEn(this.t + 0.25);
      if (m.indice >= m.notas.length) {
        if (!m.bucle) {
          this.pararMusica();
          return;
        }
        // nueva vuelta: desplazar el origen la duración de la pieza
        m.pulsoInicio -= dur;
        m.indice = 0;
        continue;
      }
      const [p, nota, d = 1, vel = 0.6] = m.notas[m.indice];
      if (p > limite) break;
      const cuando = m.inicio + (p - m.pulsoInicio) * spp;
      if (cuando >= this.t - 0.05) {
        const lista = Array.isArray(nota) ? nota : [nota];
        for (const n of lista) this.piano(n, { cuando, dur: d * spp, vel: vel * m.volumen, bus: 'musica' });
      }
      m.indice++;
    }
  }

  pararMusica() {
    if (this.temporizador) clearInterval(this.temporizador);
    this.temporizador = null;
    this.musica = null;
    this.pistaActual = null;
    this.pendiente = null;
  }

  fundirMusica(segundos = 1.5) {
    if (!this.ctx) return;
    const g = this.busMusica.gain;
    const v = g.value;
    g.cancelScheduledValues(this.t);
    g.setValueAtTime(v, this.t);
    g.linearRampToValueAtTime(0.0001, this.t + segundos);
    setTimeout(() => {
      this.pararMusica();
      this.aplicarVolumenes();
    }, segundos * 1000 + 50);
  }
}

export const Audio = new MotorAudio();
