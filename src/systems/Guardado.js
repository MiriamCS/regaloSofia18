// Guardado en localStorage. Se escribe al completar un nivel, al ver un monstruo nuevo, al abrir algo
// nuevo de una colección, al cambiar opciones y al ver el prólogo.
import { NUM_NIVELES } from '../config.js';

const CLAVE = 'sofia18-partida-v1';

function vacia() {
  return {
    completados: [],      // números de nivel completados
    fotos: [],            // niveles cuya foto se consiguió
    objetos: [],          // niveles cuyo objeto se consiguió
    monstruos: [],        // sprites de los enemigos que han salido en pantalla alguna vez
    // lo que ya se ha abierto en su colección (lo desbloqueado y sin abrir lleva aviso de nuevo)
    vistos: { fotos: [], objetos: [], monstruos: [] },
    fotoNacimiento: false, // se consigue en el prólogo, al empezar la primera partida
    tartaVista: false,
    opciones: { musica: 0.7, efectos: 0.8 },
  };
}

let datos = cargar();

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return vacia();
    const leidos = JSON.parse(crudo);
    const d = { ...vacia(), ...leidos };
    // partidas de antes de los avisos de nuevo: lo que ya se tenía cuenta como visto
    if (!leidos.vistos) d.vistos = { fotos: desbloqueados(d, 'fotos'), objetos: [...d.objetos], monstruos: [] };
    return d;
  } catch {
    return vacia();
  }
}

function escribir() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch {
    // modo privado o almacenamiento lleno: se juega sin guardar
  }
}

const anadir = (lista, n) => (lista.includes(n) ? lista : [...lista, n].sort((a, b) => a - b));

// (declaraciones de función: cargar() las usa antes de llegar aquí)
function fotoNacimiento(d) {
  return d.fotoNacimiento || d.completados.length > 0;
}

// Lo conseguido de cada colección: fotos (nivel o 'nacimiento'), objetos (nivel) y monstruos (sprite)
function desbloqueados(d, coleccion) {
  if (coleccion === 'fotos') return [...(fotoNacimiento(d) ? ['nacimiento'] : []), ...d.fotos];
  return [...d[coleccion]];
}

export const Guardado = {
  get datos() {
    return datos;
  },
  completado: (n) => datos.completados.includes(n),
  tieneFoto: (n) => datos.fotos.includes(n),
  tieneObjeto: (n) => datos.objetos.includes(n),
  // las partidas guardadas antes de existir el prólogo también la tienen
  tieneFotoNacimiento: () => fotoNacimiento(datos),
  tieneMonstruo: (id) => datos.monstruos.includes(id),
  // Devuelve true si es la primera vez que sale
  descubrirMonstruo(id) {
    if (datos.monstruos.includes(id)) return false;
    datos.monstruos = [...datos.monstruos, id];
    escribir();
    return true;
  },
  esNuevo: (coleccion, id) => desbloqueados(datos, coleccion).includes(id) && !datos.vistos[coleccion].includes(id),
  hayNuevos: (coleccion) => desbloqueados(datos, coleccion).some((id) => !datos.vistos[coleccion].includes(id)),
  marcarVisto(coleccion, id) {
    if (datos.vistos[coleccion].includes(id)) return;
    datos.vistos = { ...datos.vistos, [coleccion]: [...datos.vistos[coleccion], id] };
    escribir();
  },
  conseguirFotoNacimiento() {
    datos.fotoNacimiento = true;
    escribir();
  },
  // Un nivel está disponible si es el 0 o el anterior está completado.
  disponible: (n) => n === 0 || datos.completados.includes(n - 1) || datos.completados.includes(n),
  siguienteNivel() {
    for (let n = 0; n < NUM_NIVELES; n++) if (!datos.completados.includes(n)) return n;
    return NUM_NIVELES - 1;
  },
  hayPartida: () => datos.completados.length > 0,
  completarNivel(n, { foto, objeto }) {
    datos.completados = anadir(datos.completados, n);
    if (foto) datos.fotos = anadir(datos.fotos, n);
    if (objeto) datos.objetos = anadir(datos.objetos, n);
    escribir();
  },
  marcarTartaVista() {
    datos.tartaVista = true;
    escribir();
  },
  opcion(nombre, valor) {
    if (valor === undefined) return datos.opciones[nombre];
    datos.opciones[nombre] = valor;
    escribir();
    return valor;
  },
  borrar() {
    const opciones = datos.opciones;
    datos = vacia();
    datos.opciones = opciones;
    escribir();
  },
  // Solo para pruebas: ?trucos en la URL desbloquea todo.
  desbloquearTodo() {
    datos.completados = [...Array(NUM_NIVELES - 1).keys()];
  },
};
