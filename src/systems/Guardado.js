// Guardado en localStorage. Solo se escribe al completar un nivel (y al cambiar opciones).
import { NUM_NIVELES } from '../config.js';

const CLAVE = 'sofia18-partida-v1';

function vacia() {
  return {
    completados: [],      // números de nivel completados
    fotos: [],            // niveles cuya foto se consiguió
    objetos: [],          // niveles cuyo objeto se consiguió
    tartaVista: false,
    opciones: { musica: 0.7, efectos: 0.8 },
  };
}

let datos = cargar();

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return vacia();
    return { ...vacia(), ...JSON.parse(crudo) };
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

export const Guardado = {
  get datos() {
    return datos;
  },
  completado: (n) => datos.completados.includes(n),
  tieneFoto: (n) => datos.fotos.includes(n),
  tieneObjeto: (n) => datos.objetos.includes(n),
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
