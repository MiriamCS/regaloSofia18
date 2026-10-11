// Escena de juego: carga el nivel (JSON de Tiled), crea a Sofía y todos los elementos,
// y gestiona velas, checkpoints, canto, coleccionables, enemigos y el final del nivel 18.
import Phaser from 'phaser';
import { JUEGO, TEXTOS, TILE, OBJETOS, etapaDeNivel, etapaMiriam, velasDeNivel, tieneHabilidad, texto } from '../config.js';
import { PALETAS } from '../estilo.js';
import { leerNivel } from '../systems/Nivel.js';
import { Controles } from '../systems/Controles.js';
import { Guardado } from '../systems/Guardado.js';
import { Fondo } from '../systems/Fondos.js';
import { Audio } from '../audio/Audio.js';
import { PISTAS, pistaDeEtapa } from '../audio/musica.js';
import { Sofia } from '../entities/Sofia.js';
import { Enemigo } from '../entities/Enemigos.js';
import {
  dibujarBloque, dibujarSuelos, PlataformaMovil, PlataformaCae, PlataformaFalsa, PlataformaTemporizada, PlataformaMusical,
  TeclaPiano, Campana, PuertaMelodia, Checkpoint, Coleccionable, Meta, MetaFalsa, PeligroMovil, Miriam, Cartel, LluviaObjetos,
} from '../entities/elementos.js';
import { claveNivel } from './TransicionScene.js';

const NOTAS_CANTO = ['C5', 'D5', 'E5', 'G5', 'A5', 'C6'];

export class JuegoScene extends Phaser.Scene {
  constructor() {
    super('Juego');
  }

  init(data) {
    this.nivel = data.nivel ?? 0;
  }

  create() {
    const n = this.nivel;
    this.datos = leerNivel(this.cache.json.get(claveNivel(n)));
    const props = this.datos.props;
    this.etapa = props.etapa || etapaDeNivel(n);
    this.tema = props.tema || 'parque';
    this.paleta = PALETAS[this.etapa];
    this.textosNivel = TEXTOS.niveles?.[n] || {};
    this.spriteObjeto = (OBJETOS.objetos.find((o) => o.nivel === n) || OBJETOS.objetos[0]).sprite;

    // Estado del intento
    this.velasTotal = props.velas ?? velasDeNivel(n);
    this.velas = this.velasTotal;
    this.tieneFoto = false;
    this.tieneObjeto = false;
    this.muriendo = false;
    this.terminado = false;
    this.enFinal = false;
    this.mundoActual = 'A';
    this.actualizables = [];
    this.lectores = []; // Miriam y carteles

    const mundo = this.datos;
    this.physics.world.setBounds(0, -400, mundo.ancho, mundo.alto + 400);
    this.physics.world.setBoundsCollision(true, true, false, false);
    this.physics.world.gravity.y = JUEGO.fisica.gravedad;
    this.cameras.main.setBackgroundColor('#ffffff');

    this.fondo = new Fondo(this, this.etapa, this.tema, mundo);

    this.solidos = this.physics.add.staticGroup();
    this.nubes = [];
    this.movibles = []; // plataformas que se mueven (para arrastrar a Sofía)
    this.pisables = []; // plataformas que reaccionan al pisarlas
    this.cajas = this.physics.add.group();
    this.enemigos = [];
    this.peligros = this.physics.add.group({ allowGravity: true });
    this.zonasPeligro = [];
    this.zonasEspeciales = [];
    this.checkpoints = [];
    this.campanas = [];
    this.musicales = [];
    this.porMundo = [];
    this.graficos = []; // todo lo que se desvanece en el final

    this.rectsSuelo = [];
    this.rectsFantasma = [];
    for (const o of mundo.objetos) this.crearObjeto(o);
    const suelos = dibujarSuelos(this, this.rectsSuelo, this.paleta, mundo.ancho, mundo.alto).setDepth(20);
    this.graficos.push(suelos);
    if (this.rectsFantasma.length) {
      // se dibujan con los sólidos para que el contorno empalme, pero por encima de todo
      this.fantasmas = dibujarSuelos(this, [...this.rectsSuelo, ...this.rectsFantasma], this.paleta, mundo.ancho, mundo.alto, this.rectsFantasma).setDepth(70);
      this.graficos.push(this.fantasmas);
    }

    // Sofía
    const inicio = mundo.objetos.find((o) => o.tipo === 'inicio') || { pieX: 100, pieY: mundo.alto - TILE * 2 };
    this.puntoReaparicion = { x: inicio.pieX, y: inicio.pieY };
    const habilidades = {
      correr: tieneHabilidad(n, 'correr'),
      dobleSalto: tieneHabilidad(n, 'dobleSalto'),
      cantar: tieneHabilidad(n, 'cantar'),
    };
    this.sofia = new Sofia(this, inicio.pieX, inicio.pieY, this.etapa, { gatas: !!props.gatas, habilidades, gafas: !!props.gafas });
    this.sofia.on('canta', () => this.cantar());
    this.sofia.on('dobleSalto', () => this.nubeDeNotas(this.sofia.x, this.sofia.y, 6, 0xffffff));

    this.crearColisiones();

    const cam = this.cameras.main;
    cam.setBounds(0, 0, mundo.ancho, mundo.alto);
    cam.startFollow(this.sofia, true, 0.12, 0.14, 0, 60);
    cam.setDeadzone(140, 110);
    cam.fadeIn(400, 13, 27, 61);

    // Música de la etapa (o la indicada en el nivel)
    this.pista = PISTAS[props.musica] || pistaDeEtapa(this.etapa);
    Audio.setVelocidad(1);
    Audio.tocarMusica(this.pista);

    Controles.conectarTeclado(this);
    Controles.soltarTodo();
    this.scene.launch('Interfaz', { juego: this });
    this.scene.bringToTop('Interfaz');

    // Aviso de habilidad nueva en el nivel en que se desbloquea
    for (const h of ['correr', 'dobleSalto', 'cantar']) {
      if (JUEGO.habilidades[h] === n) this.time.delayedCall(1200, () => this.mostrarAviso(texto(`juego.habilidades.${h}`), 4200));
    }
    if (props.mundos) this.aplicarMundo();
    this.events.once('shutdown', () => {
      this.scene.stop('Interfaz');
      Audio.setVelocidad(1);
    });
  }

  // ---- Construcción del nivel -------------------------------------------------------

  textoPista(o) {
    const clave = o.p.pista;
    return (clave && this.textosNivel.pistas?.[clave]) || o.p.texto || (clave ? `(${clave})` : '...');
  }

  registrarMundo(objeto, o) {
    if (o.p.mundo) this.porMundo.push({ mundo: o.p.mundo, objeto });
  }

  crearObjeto(o) {
    const antes = { act: this.actualizables.length, pis: this.pisables.length, zp: this.zonasPeligro.length, gr: this.graficos.length };
    this.crearObjetoTipo(o);
    if (o.p.mundo && o.tipo !== 'solido' && o.tipo !== 'nube') {
      // lo creado por este objeto pertenece solo a un mundo (A o B): se oculta en el otro
      const nuevos = [...this.actualizables.slice(antes.act), ...this.pisables.slice(antes.pis)];
      for (const el of nuevos) if (el.zona) this.registrarMundo({ zona: el.zona, g: el.g }, o);
      for (const z of this.zonasPeligro.slice(antes.zp)) this.registrarMundo({ zona: z }, o);
      for (const g of this.graficos.slice(antes.gr)) if (!nuevos.some((n) => n.g === g)) this.registrarMundo({ g }, o);
    }
  }

  crearObjetoTipo(o) {
    const pal = this.paleta;
    switch (o.tipo) {
      case 'solido': {
        const z = this.add.zone(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h);
        this.solidos.add(z);
        if (o.p.mundo) {
          // los sólidos de un solo mundo se dibujan aparte para poder ocultarlos
          const g = dibujarBloque(this, o.x, o.y, o.w, o.h, pal, o.p.estilo || 'solido').setDepth(20);
          this.graficos.push(g);
          this.registrarMundo({ zona: z, g }, o);
        } else {
          this.rectsSuelo.push(o);
        }
        break;
      }
      case 'nube': {
        const z = this.add.zone(o.x + o.w / 2, o.y + 11, o.w, 22);
        this.physics.add.existing(z, true);
        this.nubes.push(z);
        const g = dibujarBloque(this, o.x, o.y, o.w, 22, pal, 'nube').setDepth(20);
        this.graficos.push(g);
        if (o.p.mundo) this.registrarMundo({ zona: z, g }, o);
        break;
      }
      case 'plataforma-movil': {
        const pl = new PlataformaMovil(this, o, pal);
        this.actualizables.push(pl);
        this.movibles.push(pl);
        this.graficos.push(pl.g);
        break;
      }
      case 'plataforma-cae': {
        const pl = new PlataformaCae(this, o, pal);
        this.actualizables.push(pl);
        this.pisables.push(pl);
        this.movibles.push(pl);
        this.graficos.push(pl.g);
        break;
      }
      case 'plataforma-falsa': {
        if (o.p.modo === 'fantasma') {
          // pared o suelo falso: se ve igual que el resto, no tiene cuerpo y tapa lo que esconde
          this.rectsFantasma.push(o);
          break;
        }
        const pl = new PlataformaFalsa(this, o, pal);
        this.pisables.push(pl);
        this.graficos.push(pl.g);
        break;
      }
      case 'plataforma-temporizada': {
        const pl = new PlataformaTemporizada(this, o, pal);
        this.actualizables.push(pl);
        this.graficos.push(pl.g);
        this.pisablesFijos = this.pisablesFijos || [];
        this.pisablesFijos.push(pl);
        break;
      }
      case 'plataforma-musical': {
        const pl = new PlataformaMusical(this, o, pal);
        this.actualizables.push(pl);
        this.musicales.push(pl);
        this.movibles.push(pl);
        this.graficos.push(pl.g);
        break;
      }
      case 'tecla': {
        const t = new TeclaPiano(this, o);
        this.actualizables.push(t);
        this.pisables.push(t);
        this.graficos.push(t.g, t.etiqueta);
        break;
      }
      case 'campana':
        this.campanas.push(new Campana(this, o));
        break;
      case 'puerta': {
        const p = new PuertaMelodia(this, o);
        this.puertas = this.puertas || [];
        this.puertas.push(p);
        this.solidos.add(p.zona);
        this.graficos.push(p.img);
        break;
      }
      case 'checkpoint':
        this.checkpoints.push(new Checkpoint(this, o));
        break;
      case 'foto':
        this.foto = new Coleccionable(this, o, 'foto', 'marco-foto');
        break;
      case 'objeto':
        this.objeto = new Coleccionable(this, o, 'objeto', `obj-${this.spriteObjeto}`);
        break;
      case 'meta':
        this.meta = new Meta(this, o);
        break;
      case 'miriam':
        this.lectores.push(new Miriam(this, o, etapaMiriam(this.nivel), this.textoPista(o)));
        break;
      case 'cartel':
        this.lectores.push(new Cartel(this, o, this.textoPista(o)));
        break;
      case 'caja':
      case 'mueble': {
        const tex = o.tipo === 'mueble' ? 'mueble' : `caja-${o.p.estilo || (this.etapa === 'bebe' || this.etapa === 'nina' ? 'juguete' : this.etapa === 'preado' ? 'madera' : 'libros')}`;
        const c = this.physics.add.image(o.pieX, o.pieY, tex).setOrigin(0.5, 1).setScale(0.5).setDepth(30);
        this.cajas.add(c);
        c.body.setDragX(3000);
        c.body.setMaxVelocity(400, 1000);
        // cuerpo algo más estrecho que el dibujo (cae por huecos de 1) y de alto exacto (pilas rectas)
        c.body.setSize(c.width - 16, c.height).setOffset(8, 0);
        c.pesada = o.tipo === 'mueble' || !!o.p.pesada;
        c.inicio = { x: o.pieX, y: o.pieY };
        if (o.p.fija) c.body.setImmovable(true);
        this.graficos.push(c);
        break;
      }
      case 'enemigo': {
        const e = new Enemigo(this, o);
        this.enemigos.push(e);
        this.graficos.push(e);
        break;
      }
      case 'pinchos': {
        const img = this.add.tileSprite(o.x + o.w / 2, o.y + o.h, o.w * 2, 48, 'pinchos').setOrigin(0.5, 1).setScale(0.5).setDepth(21);
        if ((o.p.danio || 1) >= 2) img.setTint(o.p.danio >= 3 ? 0xff6b6b : 0xffb35c);
        const z = this.add.zone(o.x + o.w / 2, o.y + o.h - 10, o.w - 10, 20);
        this.physics.add.existing(z, true);
        z.danio = o.p.danio || 1;
        this.zonasPeligro.push(z);
        this.graficos.push(img);
        break;
      }
      case 'meta-falsa': {
        const m = new MetaFalsa(this, o);
        this.metasFalsas = this.metasFalsas || [];
        this.metasFalsas.push(m);
        this.graficos.push(m.img);
        break;
      }
      case 'peligro-movil': {
        const pm = new PeligroMovil(this, o);
        this.actualizables.push(pm);
        this.zonasPeligro.push(pm.zona);
        this.peligrosMoviles = this.peligrosMoviles || [];
        this.peligrosMoviles.push(pm);
        this.graficos.push(pm.g);
        break;
      }
      case 'lluvia': {
        this.actualizables.push(new LluviaObjetos(this, o, this.peligros));
        break;
      }
      case 'muerte':
      case 'invertir':
      case 'gravedad':
      case 'final':
      case 'aviso': {
        const z = this.add.zone(o.x + o.w / 2, o.y + o.h / 2, o.w, o.h);
        this.physics.add.existing(z, true);
        z.tipo = o.tipo;
        z.p = o.p;
        this.zonasEspeciales.push(z);
        break;
      }
      case 'decorado': {
        // imagen decorativa sin física (sprite de assets/sprites)
        const img = this.add.image(o.pieX, o.pieY, o.p.sprite || 'nota-azul').setOrigin(0.5, 1).setScale(o.p.escala || 0.5).setDepth(o.p.delante ? 60 : 15);
        if (o.p.angulo) img.setAngle(o.p.angulo);
        this.graficos.push(img);
        break;
      }
      default:
        break;
    }
  }

  crearColisiones() {
    const s = this.sofia;
    const fis = this.physics;
    // plataforma de un sentido: se atraviesa desde abajo. Phaser puede pasar los argumentos
    // en cualquier orden según sea grupo o lista, así que se busca cuál es la plataforma.
    const unaDireccion = (a, bb) => {
      const [cuerpo, z] = a.body && a.body.physicsType === Phaser.Physics.Arcade.STATIC_BODY ? [bb, a] : [a, bb];
      const b = cuerpo.body;
      return b.velocity.y >= 0 && b.prev.y + b.height <= z.body.top + 8;
    };
    // en plataformas que se mueven, se compara con la velocidad de la plataforma (al subir, quien va encima sube con ella)
    // (las temporizadas tienen cuerpo estático, sin velocidad ni posición anterior)
    const unaDireccionMovil = (cuerpo, z) => {
      const zb = z.body;
      const vz = zb.velocity ? zb.velocity.y : 0;
      const topeAntes = zb.prev ? zb.prev.y : zb.y;
      return cuerpo.body.velocity.y >= vz - 5 && cuerpo.body.prev.y + cuerpo.body.height <= topeAntes + 10;
    };
    const contacto = () => (s.contactoSolido = this.time.now);
    fis.add.collider(s, this.solidos, (sofia, z) => {
      contacto();
      this.alPisar(z);
    });
    fis.add.collider(s, this.nubes, contacto, unaDireccion);
    fis.add.collider(this.cajas, this.solidos);
    fis.add.collider(this.cajas, this.nubes, null, unaDireccion);
    fis.add.collider(this.cajas, this.cajas);
    fis.add.collider(s, this.cajas, (sofia, caja) => {
      contacto();
      this.alTocarCaja(caja);
    });
    // plataformas especiales: cuerpo en su 'zona'
    const zonasEspeciales = [...this.movibles, ...this.pisables, ...(this.pisablesFijos || [])].map((p) => p.zona).filter((z, i, a) => a.indexOf(z) === i);
    const esNube = (z) => z.height <= 24;
    const ordenar = (a, b) => (zonasEspeciales.includes(a) ? [b, a] : [a, b]);
    fis.add.collider(s, zonasEspeciales, (a, b) => {
      contacto();
      this.alPisar(ordenar(a, b)[1]);
    }, (a, b) => {
      const [c, z] = ordenar(a, b);
      return esNube(z) ? unaDireccionMovil(c, z) : true;
    });
    fis.add.collider(this.cajas, zonasEspeciales, null, (a, b) => {
      const [c, z] = ordenar(a, b);
      return esNube(z) ? unaDireccionMovil(c, z) : true;
    });
    for (const e of this.enemigos) {
      fis.add.collider(e, this.solidos);
      fis.add.collider(e, this.nubes, null, unaDireccion);
      fis.add.collider(e, zonasEspeciales);
      fis.add.collider(e, this.cajas, (en, caja) => this.cajaSobreEnemigo(caja, en));
      if (e.tipo === 'bloqueador') fis.add.collider(s, e, contacto);
      else fis.add.overlap(s, e, () => this.tocarEnemigo(e));
    }
    fis.add.overlap(s, this.zonasPeligro, (sofia, z) => this.morir(z.danio));
    fis.add.overlap(s, this.peligros, (sofia, p) => this.morir(p.danio || 1));
    fis.add.collider(this.peligros, this.solidos, (a, b) => {
      const p = this.peligros.contains(a) ? a : b;
      if (p.body.blocked.down || p.body.touching.down) p.destroy();
    });
    for (const c of this.checkpoints) fis.add.overlap(s, c.zona, () => this.activarCheckpoint(c));
    if (this.foto) fis.add.overlap(s, this.foto.zona, () => this.coger('foto'));
    if (this.objeto) fis.add.overlap(s, this.objeto.zona, () => this.coger('objeto'));
    if (this.meta) fis.add.overlap(s, this.meta.zona, () => this.completar());
    for (const m of this.metasFalsas || []) fis.add.overlap(s, m.zona, () => m.tocar(this.textoPista(m.o)));
  }

  alPisar(z) {
    const el = z.elemento;
    if (!el) return;
    const b = this.sofia.body;
    if (b.touching.down || b.blocked.down) {
      el.pisada?.(this.time.now);
      if (el.deltaX !== undefined || el.modo === 'hunde' || el.modo === 'mueve' || el.estado === 'cae') this.sobrePlataforma = el;
    }
  }

  alTocarCaja(caja) {
    const b = this.sofia.body;
    const dir = Controles.der ? 1 : Controles.izq ? -1 : 0;
    const lado = (dir > 0 && b.touching.right && caja.body.touching.left) || (dir < 0 && b.touching.left && caja.body.touching.right);
    if (lado && b.blocked.down !== false) {
      this.empujeHasta = this.time.now + 80;
      this.cajaEmpujada = caja;
    }
  }

  cajaSobreEnemigo(caja, e) {
    // la velocidad ya es 0 tras el choque: se usa la que llevaba en el fotograma anterior
    if ((caja.vyAntes || 0) > 120 && caja.body.bottom <= e.body.top + 16 && e.eliminable.includes('caja')) e.derrotar();
  }

  tocarEnemigo(e) {
    if (!e.vivo || this.muriendo || this.terminado) return;
    const s = this.sofia;
    const t = this.time.now;
    if (e.dormido && e.tipo !== 'ladron') return;
    const pisando = s.body.velocity.y > 40 && s.body.prev.y + s.body.height <= e.body.top + 16;
    if (e.tipo === 'ladron') {
      if (e.botin) {
        const b = e.soltarBotin();
        if (b === 'foto') this.tieneFoto = true;
        else this.tieneObjeto = true;
        Audio.efecto('coleccionable');
        this.mostrarAviso(texto('juego.recuperado'));
        if (pisando) s.body.setVelocityY(-520);
        return;
      }
      if (t < (e.cooldownRobo || 0)) return;
      if (this.tieneFoto || this.tieneObjeto) {
        const tipo = this.tieneFoto ? 'foto' : 'objeto';
        if (tipo === 'foto') this.tieneFoto = false;
        else this.tieneObjeto = false;
        e.robar(tipo);
        e.cooldownRobo = t + 800;
        this.mostrarAviso(texto(tipo === 'foto' ? 'juego.fotoRobada' : 'juego.objetoRobado'));
        s.empujarAtras(e.x, 260);
        return;
      }
    }
    if (pisando) {
      if (e.eliminable.includes('salto')) {
        e.derrotar();
        s.body.setVelocityY(-560);
        s.saltando = false;
      } else {
        s.body.setVelocityY(-480);
      }
      return;
    }
    if (e.tipo === 'volador') {
      this.morir(e.def.danio || 1, e.x);
    } else {
      // los patrulleros solo empujan hacia atrás
      if (t < (this.empujadoHasta || 0)) return;
      this.empujadoHasta = t + 350;
      s.empujarAtras(e.x);
      Audio.efecto('empujar');
    }
  }

  // ---- Bucle -----------------------------------------------------------------------

  update(t, delta) {
    const dt = Math.min(delta, 50) / 1000;
    Controles.actualizar(t);
    if (Controles.pausa && !this.terminado) {
      Controles.pausa = false;
      this.pausar();
      return;
    }
    const s = this.sofia;
    // arrastre de plataformas móviles
    for (const a of this.actualizables) a.actualizar(t, dt);
    if (this.sobrePlataforma) {
      const p = this.sobrePlataforma;
      if (p.deltaX) s.x += p.deltaX;
      this.sobrePlataforma = null;
    }

    const entrada = this.muriendo || this.terminado || this.bloqueoEntrada
      ? { izq: false, der: false, correr: false, saltar: false, saltarMantenido: false, cantar: false }
      : { ...Controles, correr: Controles.correr && !this.enFinal };
    s.empujando = t < (this.empujeHasta || 0);
    s.actualizar(t, delta, entrada);
    if (s.empujando && this.cajaEmpujada) {
      const lim = JUEGO.fisica.empujeCaja * (this.cajaEmpujada.pesada ? 0.55 : 1);
      if (Math.abs(s.body.velocity.x) > lim) s.body.setVelocityX(Math.sign(s.body.velocity.x) * lim);
      if (Math.floor(t / 300) !== this.ultimoRuidoEmpuje) {
        this.ultimoRuidoEmpuje = Math.floor(t / 300);
        Audio.efecto('empujar');
      }
    }

    for (const e of this.enemigos) e.actualizar(t, dt, s);
    // solo habla el más cercano (Miriam o cartel) para que no se pisen los bocadillos
    let cercano = null;
    let mejor = Infinity;
    for (const l of this.lectores) {
      const d = Math.abs(l.x - s.x) + Math.abs(l.y - s.y) * 0.5;
      if (d < l.radio && d < mejor) {
        mejor = d;
        cercano = l;
      }
    }
    for (const l of this.lectores) l.actualizar(s, dt, l === cercano);
    // al entrar en una pared falsa se transparenta
    if (this.fantasmas) {
      const dentro = this.rectsFantasma.some((r) => s.x > r.x - 10 && s.x < r.x + r.w + 10 && s.y - 30 > r.y && s.y - 30 < r.y + r.h + 20);
      this.fantasmas.setAlpha(Phaser.Math.Linear(this.fantasmas.alpha, this.enFinal ? 0 : dentro ? 0.45 : 1, 0.15));
    }
    this.zonas(t);
    this.fondo.actualizar();

    // caída al vacío
    if ((s.y > this.datos.alto + 120 || s.y < -300) && !this.muriendo) this.morir(1, undefined, true);
    // cajas caídas al vacío vuelven a su sitio
    for (const c of this.cajas.getChildren()) {
      c.vyAntes = c.body.velocity.y;
      if (c.y > this.datos.alto + 200) this.recolocarCaja(c);
    }

    // música más rápida con una sola vela
    if (this.velasTotal !== Infinity && !this.enFinal) Audio.setVelocidad(this.velas === 1 ? JUEGO.musica.aceleracionUltimaVela : 1);
    if (this.enFinal) this.actualizarFinal(t);
  }

  zonas(t) {
    const s = this.sofia;
    const b = s.body;
    let gravedad = 1;
    let enInvertir = false;
    for (const z of this.zonasEspeciales) {
      const dentro = Phaser.Geom.Intersects.RectangleToRectangle(new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height), z.getBounds());
      if (!dentro) continue;
      if (z.tipo === 'muerte') this.morir(z.p.danio || 1, undefined, true);
      else if (z.tipo === 'gravedad') gravedad = z.p.factor ?? 0.5;
      else if (z.tipo === 'invertir') enInvertir = true;
      else if (z.tipo === 'aviso' && !z.usada) {
        z.usada = true;
        this.mostrarAviso(this.textoPista({ p: z.p }), z.p.duracion || 3000);
      } else if (z.tipo === 'final' && !this.enFinal) this.iniciarFinal(z);
    }
    b.setGravityY(JUEGO.fisica.gravedad * (gravedad - 1));
    s.multSalto = Math.abs(gravedad) < 1 ? 0.75 : 1;
    const signo = gravedad < 0 ? -1 : 1;
    if (signo !== (s.g || 1)) {
      s.g = signo;
      b.setMaxVelocity(b.maxVelocity.x, JUEGO.fisica.velocidadMaxCaida);
    }
    const invertidoPorCanto = t < (this.invertidoHasta || 0);
    const inv = enInvertir || invertidoPorCanto;
    if (inv && !s.invertido) {
      Audio.efecto('invertir');
      this.mostrarAviso(texto('juego.controlesInvertidos'), 1500);
    }
    s.invertido = inv;
  }

  // ---- Canto -----------------------------------------------------------------------

  cantar() {
    const s = this.sofia;
    const t = this.time.now;
    const radio = JUEGO.canto.radio;
    // ¿hay una campana cerca? suena su nota; si no, una nota de la escala
    let campana = null;
    let mejor = radio;
    for (const c of this.campanas) {
      const d = Phaser.Math.Distance.Between(s.x, s.y - 40, c.x, c.y);
      if (d < mejor) {
        mejor = d;
        campana = c;
      }
    }
    if (campana) campana.tocar();
    else {
      this.indiceNota = ((this.indiceNota ?? -1) + 1) % NOTAS_CANTO.length;
      Audio.piano(NOTAS_CANTO[this.indiceNota], { dur: 0.8, vel: 0.7 });
    }
    this.ondaCanto(s.x, s.y - 50, radio);
    // cantar junto a una puerta-melodía (sin campanas cerca) hace que la puerta toque su melodía
    if (!campana) {
      for (const p of this.puertas || []) {
        if (!p.abierta && Math.abs(s.x - (p.o.x + p.o.w / 2)) < radio * 0.7 && Math.abs(s.y - (p.o.y + p.o.h)) < 150) {
          this.time.delayedCall(500, () => p.reproducirPista());
          break;
        }
      }
    }
    for (const p of this.musicales) {
      const cx = p.o.x + p.o.w / 2;
      const cy = p.o.y + p.o.h / 2;
      if (Phaser.Math.Distance.Between(s.x, s.y - 40, cx, cy) < radio + p.o.w / 2 || p.o.p.global) p.oir(t);
    }
    for (const e of this.enemigos) {
      if (Phaser.Math.Distance.Between(s.x, s.y - 40, e.x, e.y - e.displayHeight / 2) < radio + 30) e.oirCanto(t, s);
    }
    if (this.datos.props.mundos) {
      this.mundoActual = this.mundoActual === 'A' ? 'B' : 'A';
      this.aplicarMundo();
    }
  }

  ondaCanto(x, y, radio) {
    const anillo = this.add.circle(x, y, 10).setStrokeStyle(4, 0xffd23f, 0.8).setDepth(55);
    this.tweens.add({ targets: anillo, radius: radio, alpha: 0, duration: 500, onComplete: () => anillo.destroy() });
    const texturas = ['nota-azul', 'nota-dorada', 'nota-rosa', 'nota-verde'];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
      const n = this.add.image(x, y, texturas[i % 4]).setScale(0.5).setDepth(56);
      this.tweens.add({ targets: n, x: x + Math.cos(a) * radio * 0.8, y: y + Math.sin(a) * radio * 0.6 - 30, alpha: 0, angle: Math.random() * 60 - 30, duration: 900, ease: 'Cubic.out', onComplete: () => n.destroy() });
    }
  }

  invertirControles() {
    this.invertidoHasta = this.time.now + (JUEGO.canto.invertirMs || 4000);
  }

  aplicarMundo() {
    for (const { mundo, objeto } of this.porMundo) {
      const activo = mundo === this.mundoActual;
      if (objeto.zona) {
        objeto.zona.body.enable = activo;
        objeto.zona.fueraDeMundo = !activo;
      }
      if (objeto.g) this.tweens.add({ targets: objeto.g, alpha: activo ? 1 : 0.12, duration: 250 });
    }
    this.cameras.main.flash(200, 255, 255, 255, false);
  }

  // ---- Efectos visuales ----------------------------------------------------------

  nubeDeNotas(x, y, n = 10, tinte) {
    const texturas = ['nota-azul', 'nota-dorada', 'nota-rosa', 'nota-verde'];
    for (let i = 0; i < n; i++) {
      const img = this.add.image(x, y, texturas[i % 4]).setScale(0.45).setDepth(60);
      if (tinte) img.setTint(tinte);
      const a = Math.random() * Math.PI * 2;
      const d = 40 + Math.random() * 50;
      this.tweens.add({ targets: img, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d - 40, alpha: 0, angle: Math.random() * 90 - 45, duration: 700 + Math.random() * 300, ease: 'Cubic.out', onComplete: () => img.destroy() });
    }
  }

  globo(x, y, contenido) {
    const t = this.add.text(x, y, contenido, { fontFamily: 'Trebuchet MS', fontSize: '20px', color: '#1b2a4a', backgroundColor: '#ffffff', padding: { x: 8, y: 4 } }).setOrigin(0.5, 1).setDepth(80);
    this.tweens.add({ targets: t, y: y - 30, alpha: 0, delay: 900, duration: 500, onComplete: () => t.destroy() });
  }

  mostrarAviso(contenido, duracion = 2000) {
    this.events.emit('aviso', contenido, duracion);
  }

  // ---- Checkpoints, coleccionables, muerte -----------------------------------------

  activarCheckpoint(c) {
    if (c.activar()) {
      this.puntoReaparicion = { x: c.x + 30, y: c.y };
      this.mostrarAviso(texto('juego.checkpoint'), 1300);
    }
  }

  coger(tipo) {
    const c = tipo === 'foto' ? this.foto : this.objeto;
    if (!c || c.cogido) return;
    c.coger();
    if (tipo === 'foto') this.tieneFoto = true;
    else this.tieneObjeto = true;
    Audio.efecto('coleccionable');
    this.nubeDeNotas(c.x, c.y, 12);
    this.mostrarAviso(texto(tipo === 'foto' ? 'juego.fotoConseguida' : 'juego.objetoConseguido'));
  }

  morir(danio = 1, desdeX, caida = false) {
    if (this.muriendo || this.terminado || this.enFinal) return;
    const s = this.sofia;
    const t = this.time.now;
    if (!caida && t < s.invulnerableHasta) return;
    this.muriendo = true;
    if (caida) {
      Audio.efecto('danio');
      if (navigator.vibrate) navigator.vibrate(JUEGO.controles.vibracionMs);
    } else {
      s.recibirGolpe(t, desdeX);
    }
    if (this.velasTotal !== Infinity) {
      const antes = this.velas;
      this.velas = Math.max(0, this.velas - danio);
      for (let i = 0; i < antes - this.velas; i++) this.time.delayedCall(i * 220, () => Audio.efecto('vela'));
      this.events.emit('velas', this.velas, antes);
    }
    if (this.velas <= 0) {
      // Sin velas: se reinicia el nivel entero y se pierden checkpoints y coleccionables del intento
      this.mostrarAviso(texto('juego.sinVelas'), 1800);
      this.time.delayedCall(1900, () => {
        this.cameras.main.fadeOut(500, 13, 27, 61);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ nivel: this.nivel }));
      });
      return;
    }
    this.time.delayedCall(JUEGO.danio.msVolverCheckpoint, () => {
      this.cameras.main.fadeOut(180, 255, 255, 255);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.reaparecer();
        this.cameras.main.fadeIn(250, 255, 255, 255);
      });
    });
  }

  reaparecer() {
    const s = this.sofia;
    s.colocar(this.puntoReaparicion.x, this.puntoReaparicion.y - 2);
    s.invulnerableHasta = this.time.now + 900;
    s.invertido = false;
    this.invertidoHasta = 0;
    this.muriendo = false;
    for (const p of this.pisables) p.reiniciar?.();
    // las cajas que empiezan por delante del atril vuelven a su sitio (evita partidas bloqueadas)
    for (const c of this.cajas.getChildren()) if (c.inicio.x > this.puntoReaparicion.x - 48) this.recolocarCaja(c);
    for (const pm of this.peligrosMoviles || []) pm.reiniciar(this.puntoReaparicion);
    s.g = 1;
    for (const e of this.enemigos) {
      if (e.tipo === 'ladron' && e.vivo) {
        e.body.reset(e.inicioX, e.inicioY);
      }
    }
    this.cameras.main.centerOn(s.x, s.y);
  }

  recolocarCaja(c) {
    c.body.reset(c.inicio.x, c.inicio.y - 4);
    c.setAlpha(0);
    this.tweens.add({ targets: c, alpha: 1, duration: 300 });
  }

  // ---- Fin de nivel ------------------------------------------------------------------

  completar() {
    if (this.terminado || this.muriendo) return;
    this.terminado = true;
    const s = this.sofia;
    s.body.setVelocity(0, s.body.velocity.y);
    s.estadoForzado = 'celebrar';
    Audio.fundirMusica(0.5);
    this.time.delayedCall(300, () => Audio.efecto('nivelCompletado'));
    Guardado.completarNivel(this.nivel, { foto: this.tieneFoto, objeto: this.tieneObjeto });
    this.nubeDeNotas(s.x, s.y - 60, 16);
    this.events.emit('completado', { foto: this.tieneFoto, objeto: this.tieneObjeto });
    this.time.delayedCall(3200, () => {
      this.cameras.main.fadeOut(500, 13, 27, 61);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        const siguiente = this.nivel + 1;
        if (siguiente <= 18) this.scene.start('Transicion', { nivel: siguiente });
        else this.scene.start('Menu');
      });
    });
  }

  pausar() {
    Controles.soltarTodo();
    this.scene.pause();
    this.scene.launch('Pausa', { nivel: this.nivel });
  }

  // ---- Final del nivel 18: camino blanco, «Continuará...» y la tarta -------------------

  iniciarFinal(z) {
    this.enFinal = true;
    const cfg = JUEGO.final;
    const s = this.sofia;
    const inicioX = z.x;
    const sueloY = z.y + z.height / 2; // la zona 'final' marca con su borde inferior la altura del suelo
    const largoCamino = JUEGO.fisica.velocidadAndar * cfg.segundosCaminoBlanco;
    this.finalInfo = {
      inicioX,
      sueloY,
      cartelX: inicioX + largoCamino,
      tartaX: inicioX + largoCamino + cfg.distanciaCartelATarta,
      continuado: false,
      tarta: false,
    };
    // El escenario se desvanece: solo queda el suelo
    for (const e of this.enemigos) e.vivo && e.derrotar();
    this.fondo.desvanecer(3500);
    for (const g of this.graficos) this.tweens.add({ targets: g, alpha: 0, duration: 3500 });
    for (const l of this.lectores) l.bocadillo.mostrar(false);
    this.lectores = [];
    this.events.emit('final');
    Audio.fundirMusica(3);
    this.time.delayedCall(3400, () => Audio.tocarMusica(PISTAS.caminoBlanco));

    // Suelo blanco infinito hacia la derecha
    const fin = this.finalInfo.tartaX + 1400;
    const anchoNuevo = Math.max(this.datos.ancho, fin);
    this.physics.world.setBounds(0, -400, anchoNuevo, this.datos.alto + 400);
    this.cameras.main.setBounds(0, 0, anchoNuevo, this.datos.alto);
    const suelo = this.add.zone((inicioX + fin) / 2, sueloY + 200, fin - inicioX, 400);
    this.solidos.add(suelo);
    const linea = this.add.graphics().setDepth(19);
    linea.fillStyle(0xf2f4f8, 1).fillRect(0, sueloY, fin, 400);
    linea.lineStyle(3, 0xd5dbe8, 1).lineBetween(0, sueloY, fin, sueloY);
    linea.setAlpha(0);
    this.tweens.add({ targets: linea, alpha: 1, duration: 3500 });
    // muro invisible al final del todo
    const muro = this.add.zone(fin, sueloY - 300, 40, 600);
    this.solidos.add(muro);
    this.solidos.refresh();

    this.cartel = this.add.image(this.finalInfo.cartelX, sueloY + 4, 'cartel-continuara').setOrigin(0.5, 1).setScale(0.5).setDepth(15);
    this.tartaFinal = this.add.image(this.finalInfo.tartaX, sueloY + 2, 'tarta').setOrigin(0.5, 1).setScale(0.32).setDepth(15);
    void s;
  }

  actualizarFinal() {
    const f = this.finalInfo;
    const s = this.sofia;
    if (!f.continuado && s.x > f.cartelX) {
      f.continuado = true;
      // El nivel se marca como completado y se guarda
      Guardado.completarNivel(this.nivel, { foto: this.tieneFoto, objeto: this.tieneObjeto });
      Audio.piano('E5', { dur: 1.5, vel: 0.4 });
    }
    if (!f.tarta && s.x > f.tartaX - 150) {
      f.tarta = true;
      this.terminado = true;
      s.body.setVelocityX(0);
      s.estadoForzado = 'reposo';
      Audio.fundirMusica(1.5);
      const cam = this.cameras.main;
      cam.stopFollow();
      cam.pan(f.tartaX - 60, f.sueloY - 80, 1600, 'Sine.easeInOut');
      cam.zoomTo(2.2, 1800, 'Sine.easeInOut');
      this.time.delayedCall(2000, () => {
        cam.fadeOut(600, 255, 255, 255);
        cam.once('camerafadeoutcomplete', () => this.scene.start('Tarta', {}));
      });
    }
  }
}
