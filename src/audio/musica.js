// Música del juego como datos de notas: [pulso, nota (o acorde), duración, intensidad].
//
// PROVISIONAL: las obras clásicas de la SPEC (Clair de lune, Escenas de niños, valses de Chopin...)
// se añadirán como assets/music/<clave>.json convirtiendo MIDI de dominio público con
// `node tools/midi-a-json.mjs archivo.mid clave`. Si existe ese JSON, sustituye a la pista de aquí.
// Mientras tanto suenan arpegios originales y «Cumpleaños feliz» (dominio público).

function arpegios({ bpm, acordes, patron = [0, 1, 2, 1], subdiv = 2, compas = 4, melodia = [], vel = 0.4 }) {
  const notas = [];
  let t = 0;
  for (const acorde of acordes) {
    const pasos = compas * subdiv;
    for (let i = 0; i < pasos; i++) {
      const n = acorde[patron[i % patron.length] % acorde.length];
      notas.push([t + i / subdiv, n, 1.5 / subdiv, vel * (i === 0 ? 1.2 : 0.85)]);
    }
    notas.push([t, acorde[0].replace(/\d$/, (d) => String(Number(d) - 1)), compas, vel * 0.9]);
    t += compas;
  }
  for (const m of melodia) notas.push(m);
  return { bpm, notas, duracion: t };
}

export const cumpleanosFeliz = (() => {
  const mel = [
    [0, 'D4', 0.75], [0.75, 'D4', 0.25], [1, 'E4', 1], [2, 'D4', 1], [3, 'G4', 1], [4, 'F#4', 2],
    [6, 'D4', 0.75], [6.75, 'D4', 0.25], [7, 'E4', 1], [8, 'D4', 1], [9, 'A4', 1], [10, 'G4', 2],
    [12, 'D4', 0.75], [12.75, 'D4', 0.25], [13, 'D5', 1], [14, 'B4', 1], [15, 'G4', 1], [16, 'F#4', 1], [17, 'E4', 1],
    [18, 'C5', 0.75], [18.75, 'C5', 0.25], [19, 'B4', 1], [20, 'G4', 1], [21, 'A4', 1], [22, 'G4', 2],
  ].map(([t, n, d]) => [t + 1, n.replace(/\d/, (o) => String(Number(o) + 1)), d, 0.55]);
  const acordes = [
    [2, ['G3', 'B3', 'D4']], [5, ['D3', 'F#3', 'C4']], [8, ['D3', 'F#3', 'C4']], [11, ['G3', 'B3', 'D4']],
    [14, ['G3', 'B3', 'F4']], [17, ['C3', 'E3', 'G3']], [20, ['G3', 'B3', 'D4']], [22, ['D3', 'F#3', 'C4']], [23, ['G3', 'B3', 'D4']],
  ].map(([t, a]) => [t, a, 2.6, 0.3]);
  return { bpm: 84, notas: [...mel, ...acordes], duracion: 28 };
})();

export const PISTAS = {
  // Pantalla de inicio (provisional hasta tener Clair de lune)
  inicio: arpegios({
    bpm: 66, subdiv: 2, patron: [0, 1, 2, 3, 2, 1],
    acordes: [['Db4', 'F4', 'Ab4', 'Db5'], ['Bb3', 'Db4', 'F4', 'Bb4'], ['Gb3', 'Bb3', 'Db4', 'Gb4'], ['Ab3', 'C4', 'Eb4', 'Ab4']],
    melodia: [[0, 'F5', 2, 0.45], [2, 'Ab5', 2, 0.4], [4, 'F5', 3, 0.42], [8, 'Db5', 2, 0.4], [10, 'Eb5', 2, 0.4], [12, 'C5', 4, 0.42]],
  }),
  bebe: arpegios({
    bpm: 92, subdiv: 2,
    acordes: [['C4', 'E4', 'G4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4']],
    melodia: [[0, 'E5', 1], [1, 'G5', 1], [2, 'E5', 2], [4, 'F5', 1], [5, 'A5', 1], [6, 'F5', 2], [8, 'D5', 2], [10, 'B4', 2], [12, 'C5', 4]].map((n) => [...n, 0.38]),
  }),
  nina: arpegios({
    bpm: 108, subdiv: 2, patron: [0, 2, 1, 2],
    acordes: [['G3', 'B3', 'D4'], ['E3', 'G3', 'B3'], ['C4', 'E4', 'G4'], ['D4', 'F#4', 'A4']],
    melodia: [[0, 'D5', 1], [1, 'B4', 1], [2, 'G4', 1], [3, 'B4', 1], [4, 'E5', 2], [6, 'D5', 2], [8, 'C5', 1], [9, 'E5', 1], [10, 'G5', 2], [12, 'F#5', 3], [15, 'A4', 1]].map((n) => [...n, 0.36]),
  }),
  preado: arpegios({
    bpm: 132, subdiv: 1, compas: 3, patron: [0, 1, 2],
    acordes: [['A3', 'C4', 'E4'], ['D4', 'F4', 'A4'], ['E3', 'G#3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['E3', 'G#3', 'B3'], ['A3', 'C4', 'E4']],
    melodia: [[0, 'E5', 2], [2, 'C5', 1], [3, 'A5', 2], [5, 'F5', 1], [6, 'G#5', 2], [8, 'B5', 1], [9, 'A5', 3], [12, 'C6', 1.5], [13.5, 'B5', 0.5], [14, 'A5', 1], [15, 'F5', 2], [17, 'E5', 1], [18, 'D5', 2], [20, 'B4', 1], [21, 'A4', 3]].map((n) => [...n, 0.36]),
  }),
  adolescente: arpegios({
    bpm: 120, subdiv: 4, patron: [0, 1, 2, 3, 2, 1, 2, 3],
    acordes: [['C#4', 'E4', 'G#4', 'C#5'], ['A3', 'C#4', 'E4', 'A4'], ['F#3', 'A3', 'C#4', 'F#4'], ['G#3', 'B#3', 'D#4', 'G#4']],
    melodia: [[0, 'G#5', 2], [2, 'E5', 2], [4, 'A5', 2], [6, 'C#6', 2], [8, 'F#5', 3], [11, 'A5', 1], [12, 'G#5', 4]].map((n) => [...n, 0.34]),
  }),
  adulta: arpegios({
    bpm: 76, subdiv: 2, compas: 6, patron: [0, 1, 2, 3, 2, 1],
    acordes: [['G3', 'Bb3', 'D4', 'G4'], ['Eb3', 'G3', 'Bb3', 'Eb4'], ['C3', 'Eb3', 'G3', 'C4'], ['D3', 'F#3', 'A3', 'D4']],
    melodia: [[0, 'D5', 3], [3, 'Bb4', 3], [6, 'G5', 4], [10, 'F5', 2], [12, 'Eb5', 3], [15, 'C5', 3], [18, 'D5', 6]].map((n) => [...n, 0.36]),
  }),
  // Camino blanco: piano suave y espaciado
  caminoBlanco: arpegios({
    bpm: 54, subdiv: 1, patron: [0, 2, 1, 3],
    acordes: [['E4', 'G#4', 'B4', 'E5'], ['C#4', 'E4', 'G#4', 'C#5'], ['A3', 'C#4', 'E4', 'A4'], ['B3', 'D#4', 'F#4', 'B4']],
    vel: 0.28,
  }),
  tarta: cumpleanosFeliz,
};

// Pista que suena en cada nivel según su etapa (puede sobrescribirse con la propiedad "musica" del nivel).
export function pistaDeEtapa(etapa) {
  return PISTAS[etapa] || PISTAS.nina;
}
