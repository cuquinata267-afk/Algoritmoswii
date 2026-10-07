import { GameEngine } from './src/game/engine';
import { MISSIONS } from './src/game/missions';
import { MissionConfig, Position, Direction } from './src/types';

console.log('=== INICIANDO VALIDACIÓN DE CRITERIOS DE ACEPTACIÓN (MISIÓN 02) ===\n');

const mission2 = MISSIONS[2];

// CASO 1: ROBI mirando directamente hacia una pared
console.log('--- CASO 1: ROBI mirando hacia pared ---');
// ROBI en (1, 2) mirando hacia UP. Pared en (1, 1).
const eval1 = GameEngine.isObstacleAhead({ x: 1, y: 2 }, 'UP', mission2);
console.log('Obstáculo detectado delante:', eval1.isObstacle, '(Esperado: true)');
if (!eval1.isObstacle) throw new Error('CASO 1 falló: debería detectar obstáculo');

const res1 = GameEngine.simulateConditional(
  {
    ...mission2,
    startPosition: { x: 1, y: 2 },
    startDirection: 'UP',
  },
  {
    condition: 'IF_OBSTACLE',
    thenAction: 'TURN_RIGHT',
    elseAction: 'MOVE_FORWARD',
  }
);
// En el primer paso de acción (step index 2):
// step 0: IDLE en START (1, 2)
// step 1: THINKING (observar)
// step 2: ACTING (girar a la derecha)
const actionStep1 = res1.steps[2];
console.log('Posición tras acción:', actionStep1.position, '(Esperado: x: 1, y: 2 - NO avanza)');
console.log('Dirección tras acción:', actionStep1.direction, '(Esperado: RIGHT - Gira a la derecha)');
if (actionStep1.position.x !== 1 || actionStep1.position.y !== 2) throw new Error('CASO 1 falló: ROBI no debió avanzar');
if (actionStep1.direction !== 'RIGHT') throw new Error('CASO 1 falló: ROBI debió girar a RIGHT');
console.log('✓ CASO 1 APROBADO: ROBI giró a la derecha y NO avanzó.\n');

// CASO 2: ROBI mirando hacia casilla vacía
console.log('--- CASO 2: ROBI mirando hacia casilla vacía ---');
// ROBI en (1, 2) mirando hacia RIGHT. Casilla (2, 2) está libre.
const eval2 = GameEngine.isObstacleAhead({ x: 1, y: 2 }, 'RIGHT', mission2);
console.log('Obstáculo detectado delante:', eval2.isObstacle, '(Esperado: false)');
if (eval2.isObstacle) throw new Error('CASO 2 falló: no debería haber obstáculo');

const res2 = GameEngine.simulateConditional(
  {
    ...mission2,
    startPosition: { x: 1, y: 2 },
    startDirection: 'RIGHT',
  },
  {
    condition: 'IF_OBSTACLE',
    thenAction: 'TURN_RIGHT',
    elseAction: 'MOVE_FORWARD',
  }
);
const actionStep2 = res2.steps[2];
console.log('Posición tras acción:', actionStep2.position, '(Esperado: x: 2, y: 2 - Avanza 1 casilla)');
console.log('Dirección tras acción:', actionStep2.direction, '(Esperado: RIGHT - NO gira)');
if (actionStep2.position.x !== 2 || actionStep2.position.y !== 2) throw new Error('CASO 2 falló: ROBI debió avanzar');
if (actionStep2.direction !== 'RIGHT') throw new Error('CASO 2 falló: ROBI no debió girar');
console.log('✓ CASO 2 APROBADO: ROBI avanzó una casilla y NO giró.\n');

// CASO 3: ROBI en el borde del tablero mirando hacia afuera
console.log('--- CASO 3: ROBI en el borde del tablero mirando hacia afuera ---');
// ROBI en (0, 0) mirando hacia UP (fuera de la cuadrícula)
const eval3 = GameEngine.isObstacleAhead({ x: 0, y: 0 }, 'UP', mission2);
console.log('Obstáculo detectado en límite exterior:', eval3.isObstacle, '(Esperado: true)');
if (!eval3.isObstacle) throw new Error('CASO 3 falló: el límite del tablero debe ser obstáculo');
console.log('✓ CASO 3 APROBADO: El límite exterior se interpreta estrictamente como obstáculo.\n');

// CASO 4: ROBI gira, después gira nuevamente -> evalúa con la NUEVA orientación
console.log('--- CASO 4: Dos giros sucesivos y evaluación con nueva orientación ---');
let dir4: Direction = 'UP';
dir4 = GameEngine.getNextDirection(dir4, 'TURN_RIGHT'); // Ahora RIGHT
dir4 = GameEngine.getNextDirection(dir4, 'TURN_RIGHT'); // Ahora DOWN
const eval4 = GameEngine.isObstacleAhead({ x: 1, y: 2 }, dir4, mission2);
// Desde (1, 2) mirando hacia DOWN, la casilla delante es (1, 3). No hay obstáculo allí.
console.log('Dirección final tras dos giros:', dir4, '(Esperado: DOWN)');
console.log('Casilla delantera calculada:', eval4.forwardPos, '(Esperado: x: 1, y: 3)');
console.log('Obstáculo en esa casilla:', eval4.isObstacle, '(Esperado: false)');
if (eval4.forwardPos.x !== 1 || eval4.forwardPos.y !== 3) throw new Error('CASO 4 falló: coordenada incorrecta');
console.log('✓ CASO 4 APROBADO: La condición utilizó la NUEVA orientación tras los giros.\n');

// CASO 5: ROBI avanza, después evalúa con la NUEVA posición
console.log('--- CASO 5: Movimiento y evaluación con nueva posición ---');
let pos5: Position = { x: 1, y: 3 };
// Avanza hacia UP a (1, 2)
pos5 = GameEngine.getForwardPosition(pos5, 'UP');
console.log('Nueva posición tras avanzar:', pos5, '(Esperado: x: 1, y: 2)');
// Ahora evalúa hacia UP desde la nueva posición: delante está (1, 1) que tiene pared
const eval5 = GameEngine.isObstacleAhead(pos5, 'UP', mission2);
console.log('Casilla delantera desde nueva posición:', eval5.forwardPos, '(Esperado: x: 1, y: 1)');
console.log('Obstáculo detectado:', eval5.isObstacle, '(Esperado: true)');
if (eval5.forwardPos.x !== 1 || eval5.forwardPos.y !== 1 || !eval5.isObstacle) {
  throw new Error('CASO 5 falló: no usó la nueva posición');
}
console.log('✓ CASO 5 APROBADO: La condición utilizó la NUEVA posición tras avanzar.\n');

// CASO 6: Determinismo lógico de la pared (independiente del DOM/CSS)
console.log('--- CASO 6: Pureza del modelo lógico de datos ---');
const cellTypeCheck = GameEngine.getCellType({ x: 1, y: 1 }, mission2);
console.log('Tipo de celda de (1, 1):', cellTypeCheck, '(Esperado: wall)');
if (cellTypeCheck !== 'wall') throw new Error('CASO 6 falló');
console.log('✓ CASO 6 APROBADO: La fuente de verdad es estrictamente el modelo lógico.\n');

console.log('====================================================');
console.log('TODOS LOS CRITERIOS DE ACEPTACIÓN FUERON VALIDADOS EXITOSAMENTE');
console.log('====================================================');
