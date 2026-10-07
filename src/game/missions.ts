import { MissionConfig } from '../types';

export const MISSIONS: Record<number, MissionConfig> = {
  1: {
    id: 1,
    title: 'Misión 01: Enséñame a caminar',
    subtitle: 'Aprende sobre algoritmos y secuencias',
    pedagogicalTopic: 'Algoritmo + Secuencia',
    gridSize: { cols: 4, rows: 4 },
    startPosition: { x: 0, y: 3 },
    startDirection: 'UP',
    starPosition: { x: 2, y: 1 },
    obstacles: [], // ¡Sin obstáculos en la Misión 01! Camino limpio y evidente
    hint: 'WARA solo entiende instrucciones. Construye una secuencia de pasos para llevarla hasta la estrella.',
    conceptTitle: '¡Lo lograste! Acabas de crear un algoritmo',
    conceptDescription: 'Un algoritmo es una serie de pasos ordenados que usamos para resolver un problema.',
    conceptKey: 'SECUENCIA: El orden de las instrucciones importa.',
  },
  2: {
    id: 2,
    title: 'Misión 02: WARA debe pensar',
    subtitle: 'Aprende sobre Condicionales (Tomar decisiones)',
    pedagogicalTopic: 'Condicionales (SI ... ENTONCES ... SI NO)',
    gridSize: { cols: 4, rows: 4 },
    startPosition: { x: 1, y: 2 },
    startDirection: 'UP',
    starPosition: { x: 2, y: 2 },
    obstacles: [{ x: 1, y: 1 }], // Obstáculo lógico justo delante de WARA en START
    hint: 'WARA tiene una piedra en frente. Enséñale una regla condicional: si encuentra un obstáculo debe girar a la derecha para esquivarlo; si el camino está libre, debe avanzar.',
    conceptTitle: '¡Acabas de enseñar a WARA a tomar decisiones!',
    conceptDescription: 'Un condicional permite que un programa tome caminos diferentes según lo que ocurra a su alrededor.',
    conceptKey: 'CONDICIONAL = Evaluar una regla antes de actuar.',
  },
  3: {
    id: 3,
    title: 'Misión 03: WARA descubre los bucles',
    subtitle: 'Aprende sobre Bucles (Repetición eficiente)',
    pedagogicalTopic: 'Bucles / Repetición',
    gridSize: { cols: 6, rows: 3 },
    startPosition: { x: 0, y: 1 },
    startDirection: 'RIGHT',
    starPosition: { x: 5, y: 1 },
    obstacles: [],
    hint: 'WARA tiene un largo camino por recorrer. En vez de presionar el mismo botón 5 veces, ¡usa la repetición!',
    conceptTitle: '¡Acabas de utilizar un bucle!',
    conceptDescription: 'Un bucle permite repetir instrucciones automáticamente sin escribirlas una y otra vez.',
    conceptKey: 'BUCLE = Escribir menos, lograr más.',
  },
};
