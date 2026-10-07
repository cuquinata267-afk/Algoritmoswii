import {
  CellType,
  Command,
  CommandType,
  ConditionRule,
  DetailedError,
  Direction,
  ExecutionResult,
  ExecutionStep,
  LoopRule,
  MissionConfig,
  Position,
} from '../types';

export class GameEngine {
  /**
   * Nombre amigable de la dirección en español con emoji
   */
  public static getDirectionName(dir: Direction): string {
    switch (dir) {
      case 'UP':
        return 'arriba (↑)';
      case 'DOWN':
        return 'abajo (↓)';
      case 'LEFT':
        return 'la izquierda (←)';
      case 'RIGHT':
        return 'la derecha (→)';
    }
  }

  /**
   * Función canónica para calcular la casilla inmediatamente delante de WARA
   * Respeta rigurosamente:
   * NORTH (UP): row - 1 (y - 1)
   * SOUTH (DOWN): row + 1 (y + 1)
   * EAST (RIGHT): col + 1 (x + 1)
   * WEST (LEFT): col - 1 (x - 1)
   * No modifica la orientación ni la posición del robot.
   */
  public static getForwardPosition(pos: Position, dir: Direction): Position {
    switch (dir) {
      case 'UP':
        return { x: pos.x, y: pos.y - 1 };
      case 'DOWN':
        return { x: pos.x, y: pos.y + 1 };
      case 'LEFT':
        return { x: pos.x - 1, y: pos.y };
      case 'RIGHT':
        return { x: pos.x + 1, y: pos.y };
    }
  }

  /**
   * Alias de getForwardPosition para compatibilidad
   */
  public static getNextPosition(pos: Position, dir: Direction): Position {
    return this.getForwardPosition(pos, dir);
  }

  /**
   * Calcula la nueva orientación tras un giro de 90°
   * Acepta 'TURN_LEFT', 'TURN_RIGHT', y variantes en español para máxima robustez
   */
  public static getNextDirection(
    currentDir: Direction,
    turn: CommandType | string
  ): Direction {
    const directions: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const idx = directions.indexOf(currentDir);

    if (turn === 'TURN_LEFT' || turn === 'GIRAR_IZQUIERDA') {
      return directions[(idx + 3) % 4];
    } else {
      // TURN_RIGHT o GIRAR_DERECHA
      return directions[(idx + 1) % 4];
    }
  }

  /**
   * Comprueba si una posición está fuera de la cuadrícula
   */
  public static isOutOfBounds(
    pos: Position,
    size: { cols: number; rows: number }
  ): boolean {
    return pos.x < 0 || pos.x >= size.cols || pos.y < 0 || pos.y >= size.rows;
  }

  /**
   * Comprueba si una posición contiene un obstáculo de la lista
   */
  public static isObstacle(pos: Position, obstacles: Position[]): boolean {
    return obstacles.some((obs) => obs.x === pos.x && obs.y === pos.y);
  }

  /**
   * Obtiene el tipo lógico de celda en una coordenada:
   * - 'wall': si es obstáculo o si excede los límites del tablero (Regla 6)
   * - 'goal': si es la casilla de la estrella
   * - 'start': si es la casilla de inicio
   * - 'empty': casilla libre
   */
  public static getCellType(pos: Position, mission: MissionConfig): CellType {
    // Los límites del tablero se consideran pared/obstáculo (Regla 6)
    if (this.isOutOfBounds(pos, mission.gridSize)) {
      return 'wall';
    }

    // Todos los obstáculos lógicos de la misión
    const isWall = mission.obstacles.some((o) => o.x === pos.x && o.y === pos.y);
    if (isWall) {
      return 'wall';
    }

    if (pos.x === mission.starPosition.x && pos.y === mission.starPosition.y) {
      return 'goal';
    }

    if (pos.x === mission.startPosition.x && pos.y === mission.startPosition.y) {
      return 'start';
    }

    return 'empty';
  }

  /**
   * Función central de detección de obstáculos (Regla 4 y 6):
   * Comprueba ÚNICAMENTE la casilla inmediatamente delante de WARA.
   * Calcula: pos + dir = forwardPos.
   * Si forwardPos es wall o está fuera de límites -> isObstacle = true.
   * Si está libre -> isObstacle = false.
   */
  public static isObstacleAhead(
    pos: Position,
    dir: Direction,
    mission: MissionConfig
  ): { isObstacle: boolean; forwardPos: Position; cellType: CellType } {
    const forwardPos = this.getForwardPosition(pos, dir);
    const cellType = this.getCellType(forwardPos, mission);
    const isObstacle = cellType === 'wall';
    return { isObstacle, forwardPos, cellType };
  }

  /**
   * Normaliza los comandos para asegurar compatibilidad con tipos canónicos
   */
  public static normalizeAction(action: CommandType | string): CommandType {
    if (action === 'GIRAR_IZQUIERDA') return 'TURN_LEFT';
    if (action === 'GIRAR_DERECHA') return 'TURN_RIGHT';
    return action as CommandType;
  }

  /**
   * Imprime logs de depuración claros únicamente en modo desarrollo (Regla 14)
   */
  private static logDevEvaluation(
    pos: Position,
    dir: Direction,
    forwardPos: Position,
    cellType: CellType,
    isObstacle: boolean,
    chosenAction: CommandType
  ) {
    if (import.meta.env.DEV) {
      console.log(`[MISSION 02]
Robot:
  position = { row: ${pos.y}, col: ${pos.x} }
  orientation = ${dir}

Forward cell:
  { row: ${forwardPos.y}, col: ${forwardPos.x} }

Cell type:
  ${cellType}

Condition:
  HAS_OBSTACLE_AHEAD

Result:
  ${isObstacle}

Action:
  ${chosenAction}`);
    }
  }

  /**
   * Ejecuta una simulación completamente NUEVA y determinista de la secuencia.
   * Siempre parte del estado inicial de la misión (START position y startDirection).
   * Soporta tanto comandos directos como bloques condicionales (Regla 7 y 15).
   */
  public static simulateSequence(
    mission: MissionConfig,
    commands: Command[]
  ): ExecutionResult {
    const steps: ExecutionStep[] = [];
    let currentPos = { ...mission.startPosition };
    let currentDir = mission.startDirection;

    // Estado inicial en START
    steps.push({
      position: { ...currentPos },
      direction: currentDir,
      robiState: 'IDLE',
      logMessage: `Inicio: WARA en START (${currentPos.x}, ${currentPos.y}) mirando hacia ${this.getDirectionName(currentDir)}.`,
    });

    if (commands.length === 0) {
      return {
        steps,
        success: false,
        finalPosition: currentPos,
        finalDirection: currentDir,
        error: {
          type: 'EMPTY_PROGRAM',
          title: 'Secuencia vacía',
          reason: 'Aún no has agregado ninguna instrucción a tu algoritmo.',
          suggestion: 'Presiona los botones o arrastra bloques para construir tu secuencia antes de presionar EJECUTAR.',
        },
      };
    }

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];

      if (cmd.type === 'CONDITIONAL' && cmd.rule) {
        // Evaluación dinámica del condicional con el estado ACTUAL (Regla 7)
        const { isObstacle, forwardPos, cellType } = this.isObstacleAhead(
          currentPos,
          currentDir,
          mission
        );
        const rawAction = isObstacle ? cmd.rule.thenAction : cmd.rule.elseAction;
        const chosenAction = this.normalizeAction(rawAction);

        this.logDevEvaluation(
          currentPos,
          currentDir,
          forwardPos,
          cellType,
          isObstacle,
          chosenAction
        );

        // Paso pedagógico 1: OBSERVAR
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'THINKING',
          activeCommandIndex: i,
          hasObstacle: isObstacle,
          inspectedPosition: forwardPos,
          evaluationPhase: 'OBSERVING',
          logMessage: isObstacle
            ? 'WARA observando: ¡Hay un obstáculo en frente!'
            : 'WARA observando: El camino está libre.',
        });

        // Paso pedagógico 2: DECIDIR Y ACTUAR
        if (chosenAction === 'MOVE_FORWARD') {
          if (isObstacle) {
            steps.push({
              position: { ...currentPos },
              direction: currentDir,
              robiState: 'ERROR',
              activeCommandIndex: i,
              evaluationPhase: 'ACTING',
              logMessage: '¡WARA intentó avanzar hacia un obstáculo!',
            });
            return {
              steps,
              success: false,
              finalPosition: currentPos,
              finalDirection: currentDir,
              error: {
                type: 'OBSTACLE_COLLISION',
                title: 'WARA chocó con la piedra.',
                stepIndex: i,
                stepNumber: i + 1,
                commandType: 'CONDITIONAL',
                commandLabel: cmd.label,
                reason: 'La condición detectó un obstáculo pero intentó avanzar en lugar de girar para esquivarlo.',
                suggestion: 'En "Si hay obstáculo", selecciona GIRAR DERECHA o GIRAR IZQUIERDA.',
              },
            };
          }
          currentPos = forwardPos;
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'WALKING',
            activeCommandIndex: i,
            evaluationPhase: 'ACTING',
            logMessage: `Condición aplicada: Camino libre -> Avanza a (${currentPos.x}, ${currentPos.y}).`,
          });
        } else {
          currentDir = this.getNextDirection(currentDir, chosenAction);
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'IDLE',
            activeCommandIndex: i,
            isTurnOnly: true,
            evaluationPhase: 'ACTING',
            logMessage: `Condición aplicada: Obstáculo detectado -> Gira hacia ${this.getDirectionName(currentDir)}.`,
          });
        }
      } else if (cmd.type === 'MOVE_FORWARD') {
        const nextPos = this.getForwardPosition(currentPos, currentDir);

        // Validación: Límite del tablero
        if (this.isOutOfBounds(nextPos, mission.gridSize)) {
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'ERROR',
            activeCommandIndex: i,
            logMessage: `Instrucción ${i + 1} (${cmd.label}): Intento de salir del tablero hacia ${this.getDirectionName(currentDir)}.`,
          });
          return {
            steps,
            success: false,
            finalPosition: currentPos,
            finalDirection: currentDir,
            error: {
              type: 'OUT_OF_BOUNDS',
              title: 'WARA salió del tablero.',
              stepIndex: i,
              stepNumber: i + 1,
              commandType: 'MOVE_FORWARD',
              commandLabel: cmd.label,
              robotOrientation: currentDir,
              position: currentPos,
              targetPosition: nextPos,
              reason: `En la instrucción ${i + 1} (${cmd.label}), WARA intentó avanzar fuera de la cuadrícula hacia ${this.getDirectionName(currentDir)}.`,
              suggestion: 'Revisa el orden de tus instrucciones. Recuerda orientar a WARA con un giro antes de que llegue al límite del tablero.',
            },
          };
        }

        // Validación: Colisión con obstáculo
        if (mission.obstacles.length > 0 && this.isObstacle(nextPos, mission.obstacles)) {
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'ERROR',
            activeCommandIndex: i,
            logMessage: `Instrucción ${i + 1} (${cmd.label}): Colisión con obstáculo en (${nextPos.x}, ${nextPos.y}).`,
          });
          return {
            steps,
            success: false,
            finalPosition: currentPos,
            finalDirection: currentDir,
            error: {
              type: 'OBSTACLE_COLLISION',
              title: 'WARA chocó con una piedra.',
              stepIndex: i,
              stepNumber: i + 1,
              commandType: 'MOVE_FORWARD',
              commandLabel: cmd.label,
              robotOrientation: currentDir,
              position: currentPos,
              targetPosition: nextPos,
              reason: `En la instrucción ${i + 1} (${cmd.label}), WARA estaba mirando hacia ${this.getDirectionName(currentDir)} y la casilla de adelante tenía un obstáculo.`,
              suggestion: 'Gira a WARA en la dirección libre antes de intentar avanzar.',
            },
          };
        }

        // Movimiento válido: cambia la posición, mantiene orientación
        currentPos = nextPos;
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'WALKING',
          activeCommandIndex: i,
          logMessage: `Instrucción ${i + 1} (${cmd.label}): Avanza a (${currentPos.x}, ${currentPos.y}).`,
        });
      } else if (cmd.type === 'TURN_LEFT' || cmd.type === 'TURN_RIGHT') {
        // Giro: cambia ÚNICAMENTE la orientación, NO la casilla (Regla 10)
        const prevDir = currentDir;
        currentDir = this.getNextDirection(currentDir, cmd.type);
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'IDLE',
          activeCommandIndex: i,
          isTurnOnly: true,
          logMessage: `Instrucción ${i + 1} (${cmd.label}): Gira 90° (estaba hacia ${this.getDirectionName(prevDir)}, ahora hacia ${this.getDirectionName(currentDir)}).`,
        });
      }
    }

    // Condición de éxito estricta: robotPosition === starPosition
    const reachedGoal =
      currentPos.x === mission.starPosition.x && currentPos.y === mission.starPosition.y;

    if (reachedGoal) {
      steps.push({
        position: { ...currentPos },
        direction: currentDir,
        robiState: 'SUCCESS',
        logMessage: '¡WARA llegó exactamente a la meta! ⭐',
      });
      return {
        steps,
        success: true,
        finalPosition: currentPos,
        finalDirection: currentDir,
      };
    } else {
      const distance =
        Math.abs(currentPos.x - mission.starPosition.x) +
        Math.abs(currentPos.y - mission.starPosition.y);

      steps.push({
        position: { ...currentPos },
        direction: currentDir,
        robiState: 'ERROR',
        logMessage: 'Secuencia finalizada sin llegar a la estrella.',
      });

      return {
        steps,
        success: false,
        finalPosition: currentPos,
        finalDirection: currentDir,
        error: {
          type: 'GOAL_NOT_REACHED',
          title: 'WARA no llegó a la estrella.',
          position: currentPos,
          targetPosition: mission.starPosition,
          reason: `Tu algoritmo terminó antes de llegar a la estrella. WARA se detuvo en (${currentPos.x}, ${currentPos.y}), a ${distance} casilla${distance > 1 ? 's' : ''} de la meta.`,
          suggestion: 'Revisa el orden de tus instrucciones. Recuerda que girar cambia la dirección de WARA, pero no lo mueve de casilla. ¿Falta avanzar?',
        },
      };
    }
  }

  /**
   * Evaluador determinista para Misión 02 (Condicionales - Regla 7, 8, 9, 12)
   * En cada ciclo evalúa:
   * 1. OBSERVAR: Comprueba la casilla inmediatamente delante con el estado ACTUAL.
   * 2. DECIDIR: Selecciona la rama SI HAY OBSTÁCULO o SI NO.
   * 3. ACTUAR: Aplica la acción y actualiza el estado.
   */
  public static simulateConditional(
    mission: MissionConfig,
    rule: ConditionRule
  ): ExecutionResult {
    const steps: ExecutionStep[] = [];
    let currentPos = { ...mission.startPosition };
    let currentDir = mission.startDirection;

    // Normalizar las acciones
    const thenAction = this.normalizeAction(rule.thenAction);
    const elseAction = this.normalizeAction(rule.elseAction);

    // Estado inicial en START
    steps.push({
      position: { ...currentPos },
      direction: currentDir,
      robiState: 'IDLE',
      logMessage: `Inicio: WARA en START (${currentPos.x}, ${currentPos.y}) mirando hacia ${this.getDirectionName(currentDir)}.`,
    });

    // En la Misión 02 el recorrido óptimo es de 2 pasos
    const maxSteps = 6;
    let stepCount = 0;

    while (stepCount < maxSteps) {
      stepCount++;

      // 1. OBSERVAR: Detección estricta de la casilla delante con estado ACTUAL
      const { isObstacle, forwardPos, cellType } = this.isObstacleAhead(
        currentPos,
        currentDir,
        mission
      );

      // 2. DECIDIR: Elegir rama correspondiente
      const chosenAction = isObstacle ? thenAction : elseAction;

      // Log para desarrollo (Regla 14)
      this.logDevEvaluation(
        currentPos,
        currentDir,
        forwardPos,
        cellType,
        isObstacle,
        chosenAction
      );

      // Paso 1: OBSERVAR (WARA pensando y comprobando)
      steps.push({
        position: { ...currentPos },
        direction: currentDir,
        robiState: 'THINKING',
        hasObstacle: isObstacle,
        inspectedPosition: forwardPos,
        evaluationPhase: 'OBSERVING',
        logMessage: isObstacle
          ? 'WARA comprobando camino: ¡Hay un obstáculo en frente!'
          : 'WARA comprobando camino: El camino está libre.',
      });

      // Paso 2: DECIDIR Y ACTUAR
      if (chosenAction === 'MOVE_FORWARD') {
        if (isObstacle) {
          // Si había obstáculo e intentó avanzar -> colisión
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'ERROR',
            evaluationPhase: 'ACTING',
            logMessage: '¡WARA avanzó directamente hacia el obstáculo!',
          });
          return {
            steps,
            success: false,
            finalPosition: currentPos,
            finalDirection: currentDir,
            error: {
              type: 'OBSTACLE_COLLISION',
              title: 'WARA chocó con la piedra.',
              reason: 'Cuando había un obstáculo en frente, la regla intentó avanzar en lugar de girar para esquivarlo.',
              suggestion: 'En "Si hay obstáculo", selecciona GIRAR DERECHA para esquivar la piedra.',
            },
          };
        }

        // Movimiento exitoso
        currentPos = forwardPos;
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'WALKING',
          evaluationPhase: 'ACTING',
          logMessage: 'Camino libre: WARA avanzó una casilla.',
        });
      } else {
        // Giro: modifica ÚNICAMENTE la orientación, NO la casilla (Regla 10)
        currentDir = this.getNextDirection(currentDir, chosenAction);
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'IDLE',
          isTurnOnly: true,
          evaluationPhase: 'ACTING',
          logMessage: isObstacle
            ? `¡Obstáculo detectado! WARA aplicó la regla y giró hacia ${this.getDirectionName(currentDir)}.`
            : `WARA giró hacia ${this.getDirectionName(currentDir)}.`,
        });
      }

      // Comprobación de meta: exactamente en la estrella
      if (currentPos.x === mission.starPosition.x && currentPos.y === mission.starPosition.y) {
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'SUCCESS',
          logMessage: '¡WARA esquivó el obstáculo y llegó a la estrella! ⭐',
        });
        return {
          steps,
          success: true,
          finalPosition: currentPos,
          finalDirection: currentDir,
        };
      }
    }

    // Si terminó sin llegar a la estrella
    return {
      steps,
      success: false,
      finalPosition: currentPos,
      finalDirection: currentDir,
      error: {
        type: 'WRONG_CONDITION',
        title: 'La condición no llevó a WARA a la estrella.',
        reason: 'La combinación de acciones en SI y SI NO no logró conducir a WARA a la estrella.',
        suggestion: 'Comprueba que WARA gire a la derecha cuando hay una piedra en frente y avance cuando el camino esté libre.',
      },
    };
  }

  /**
   * Evaluador para Misión 03 (Bucles)
   */
  public static simulateLoop(
    mission: MissionConfig,
    rule: LoopRule
  ): ExecutionResult {
    const steps: ExecutionStep[] = [];
    let currentPos = { ...mission.startPosition };
    let currentDir = mission.startDirection;

    steps.push({
      position: { ...currentPos },
      direction: currentDir,
      robiState: 'IDLE',
      logMessage: `Inicio del bucle: REPETIR ${rule.repetitions} VECES [ ${rule.action} ]...`,
    });

    for (let r = 1; r <= rule.repetitions; r++) {
      if (rule.action === 'MOVE_FORWARD') {
        const nextPos = this.getForwardPosition(currentPos, currentDir);
        if (this.isOutOfBounds(nextPos, mission.gridSize)) {
          steps.push({
            position: { ...currentPos },
            direction: currentDir,
            robiState: 'ERROR',
            logMessage: `En la repetición ${r}, WARA salió del jardín.`,
          });
          return {
            steps,
            success: false,
            finalPosition: currentPos,
            finalDirection: currentDir,
            error: {
              type: 'LOOP_COUNT_MISMATCH',
              title: 'WARA avanzó demasiado.',
              reason: `El bucle repitió la acción ${rule.repetitions} veces y WARA superó el borde del tablero en la repetición ${r}.`,
              suggestion: 'Reduce la cantidad de repeticiones de tu bucle.',
            },
          };
        }
        currentPos = nextPos;
        steps.push({
          position: { ...currentPos },
          direction: currentDir,
          robiState: 'WALKING',
          logMessage: `Repetición ${r} de ${rule.repetitions}: Avanzó a (${currentPos.x}, ${currentPos.y}).`,
        });
      }
    }

    const reached =
      currentPos.x === mission.starPosition.x && currentPos.y === mission.starPosition.y;

    if (reached) {
      steps.push({
        position: { ...currentPos },
        direction: currentDir,
        robiState: 'SUCCESS',
        logMessage: '¡WARA completó el bucle y alcanzó la meta! ⭐',
      });
      return {
        steps,
        success: true,
        finalPosition: currentPos,
        finalDirection: currentDir,
      };
    } else {
      const distance =
        Math.abs(currentPos.x - mission.starPosition.x) +
        Math.abs(currentPos.y - mission.starPosition.y);

      steps.push({
        position: { ...currentPos },
        direction: currentDir,
        robiState: 'ERROR',
        logMessage: 'Bucle finalizado sin llegar a la estrella.',
      });

      return {
        steps,
        success: false,
        finalPosition: currentPos,
        finalDirection: currentDir,
        error: {
          type: 'LOOP_COUNT_MISMATCH',
          title: 'Número de repeticiones incorrecto.',
          reason: `WARA repitió ${rule.repetitions} veces y quedó en (${currentPos.x}, ${currentPos.y}), a ${distance} casilla${distance > 1 ? 's' : ''} de la estrella.`,
          suggestion: 'Ajusta el número de repeticiones para que coincida exactamente con la distancia a la estrella.',
        },
      };
    }
  }
}
