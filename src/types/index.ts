export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export interface Position {
  x: number;
  y: number;
}

export type CellType = 'empty' | 'wall' | 'goal' | 'start';

export interface BoardCell {
  x: number; // columna (0-indexed)
  y: number; // fila (0-indexed)
  type: CellType;
}

export type CommandType = 'MOVE_FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'CONDITIONAL';

export interface Command {
  id: string;
  type: CommandType;
  label: string;
  rule?: ConditionRule;
}

export interface ConditionRule {
  condition: 'IF_OBSTACLE';
  thenAction: CommandType;
  elseAction: CommandType;
}

export interface LoopRule {
  repetitions: number;
  action: CommandType;
}

export type RobiState = 'IDLE' | 'WALKING' | 'THINKING' | 'ERROR' | 'SUCCESS' | 'CELEBRATING';

export type MissionId = 1 | 2 | 3;

export type InteractionMode = 'buttons' | 'blocks';

export interface ExecutionStep {
  position: Position;
  direction: Direction;
  robiState: RobiState;
  activeCommandIndex?: number;
  logMessage?: string;
  hasObstacle?: boolean;
  inspectedPosition?: Position;
  conditionResult?: boolean;
  evaluationPhase?: 'OBSERVING' | 'DECIDING' | 'ACTING';
  isTurnOnly?: boolean;
}

export interface DetailedError {
  type: 'OBSTACLE_COLLISION' | 'OUT_OF_BOUNDS' | 'GOAL_NOT_REACHED' | 'EMPTY_PROGRAM' | 'WRONG_CONDITION' | 'LOOP_COUNT_MISMATCH';
  title: string;
  stepIndex?: number;
  stepNumber?: number;
  commandType?: CommandType;
  commandLabel?: string;
  robotOrientation?: Direction;
  position?: Position;
  targetPosition?: Position;
  reason: string;
  suggestion: string;
}

export interface ExecutionResult {
  steps: ExecutionStep[];
  success: boolean;
  finalPosition: Position;
  finalDirection: Direction;
  error?: DetailedError;
}

export interface MissionConfig {
  id: MissionId;
  title: string;
  subtitle: string;
  pedagogicalTopic: string;
  gridSize: { cols: number; rows: number };
  startPosition: Position;
  startDirection: Direction;
  starPosition: Position;
  obstacles: Position[];
  hasDynamicObstacle?: boolean;
  dynamicObstaclePosition?: Position;
  hint: string;
  conceptTitle: string;
  conceptDescription: string;
  conceptKey: string;
}

export interface Participant {
  id: string;
  session_id: string;
  anonymous_name: string;
  current_mission: number;
  completed_missions: number;
  selected_mode: InteractionMode;
  last_active_at: string;
}

export interface AttemptLog {
  session_id: string;
  participant_id: string;
  mission_id: number;
  success: boolean;
  error_type?: string;
  interaction_mode: InteractionMode;
  commands_used: any;
}
