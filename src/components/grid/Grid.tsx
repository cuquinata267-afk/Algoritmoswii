import React from 'react';
import { Direction, MissionConfig, Position, RobiState } from '../../types';
import { RobiCharacter } from '../robi/RobiCharacter';
import { Sparkles, Compass } from 'lucide-react';

interface GridProps {
  mission: MissionConfig;
  robiPos: Position;
  robiDir: Direction;
  robiState: RobiState;
  hasDynamicObstacleVisible?: boolean;
  inspectedPosition?: Position;
  stepMessage?: string;
}

export const Grid: React.FC<GridProps> = ({
  mission,
  robiPos,
  robiDir,
  robiState,
  hasDynamicObstacleVisible = true,
  inspectedPosition,
  stepMessage,
}) => {
  const { cols, rows } = mission.gridSize;

  const directionLabel = {
    UP: '↑ ARRIBA',
    RIGHT: '→ DERECHA',
    DOWN: '↓ ABAJO',
    LEFT: '← IZQUIERDA',
  }[robiDir];

  return (
    <div className="w-full flex flex-col items-center justify-center p-1 sm:p-2 select-none">
      {/* Explicit Orientation Pill Banner (Requirement 14) */}
      <div className="w-full max-w-sm mb-1.5 px-3 py-1.5 bg-white/95 rounded-2xl border border-[#F4D5DD] shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#4A2E35]">
          <Compass className="w-3.5 h-3.5 text-[#E86F88]" />
          <span className="text-[11px] text-[#8C4A5A]">Mirando:</span>
          <span className="bg-[#FAF0F4] text-[#E86F88] px-2 py-0.5 rounded-full font-black border border-[#F4D5DD]">
            {directionLabel}
          </span>
        </div>
        <span className="text-[10px] text-[#8C4A5A]/80 font-medium italic">
          Avanza hacia donde mira
        </span>
      </div>

      {/* Live Step / Pedagogy Message Banner (Observation -> Decision -> Action) */}
      {stepMessage && (
        <div className="w-full max-w-sm mb-2 px-3 py-1 bg-white/90 border border-[#F4D5DD] rounded-xl text-[11px] font-bold text-[#8C4A5A] text-center shadow-xs flex items-center justify-center gap-1.5 animate-pulse">
          <span>{stepMessage}</span>
        </div>
      )}

      {/* Garden Outer Wooden Frame */}
      <div className="relative bg-[#E8DCC4]/90 p-2.5 sm:p-3.5 rounded-3xl border-4 border-[#C9B896] shadow-md max-w-full">
        {/* Garden Grid Matrix */}
        <div
          className="grid gap-1.5 p-1.5 bg-[#A3C9A8] rounded-2xl border-2 border-[#8DA875] shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const isRobiHere = robiPos.x === c && robiPos.y === r;
              const isStarHere = mission.starPosition.x === c && mission.starPosition.y === r;
              const isStartHere = mission.startPosition.x === c && mission.startPosition.y === r;
              const isStaticObstacle = mission.obstacles.some((o) => o.x === c && o.y === r);
              const isDynamicObstacle =
                mission.hasDynamicObstacle &&
                hasDynamicObstacleVisible &&
                mission.dynamicObstaclePosition?.x === c &&
                mission.dynamicObstaclePosition?.y === r;

              const isObstacle = isStaticObstacle || isDynamicObstacle;
              const isEvenTile = (r + c) % 2 === 0;
              const isInspected = inspectedPosition?.x === c && inspectedPosition?.y === r;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`
                    relative w-13 h-13 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center
                    transition-all duration-300 shadow-xs
                    ${
                      isInspected
                        ? 'ring-3 ring-amber-400 ring-offset-1 z-10'
                        : ''
                    }
                    ${
                      isStartHere && !isRobiHere
                        ? 'bg-[#E2F0D9] border-2 border-dashed border-[#8DA875]'
                        : isEvenTile
                        ? 'bg-[#C6DCBA] border border-[#B5C99A]'
                        : 'bg-[#D4E7C5] border border-[#C6DCBA]'
                    }
                  `}
                >
                  {/* Start tile label when ROBI is not there */}
                  {isStartHere && !isRobiHere && (
                    <span className="absolute bottom-1 font-mono font-bold text-[9px] text-[#557A46]">
                      START
                    </span>
                  )}

                  {/* Decorative Bush texture details */}
                  {((r === 0 && c === 1) || (r === 2 && c === 0)) && !isObstacle && !isRobiHere && !isStarHere && (
                    <span className="text-xs sm:text-sm opacity-70">🌿</span>
                  )}

                  {/* Obstacle Rock 🪨 */}
                  {isObstacle && !isRobiHere && (
                    <div className="flex flex-col items-center justify-center animate-bounce-gentle">
                      <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🪨</span>
                    </div>
                  )}

                  {/* Target Star ⭐ */}
                  {isStarHere && (
                    <div className="relative flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl filter drop-shadow-md animate-pulse">⭐</span>
                      <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-spin" />
                    </div>
                  )}

                  {/* ROBI Character */}
                  {isRobiHere && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <RobiCharacter
                        state={robiState}
                        direction={robiDir}
                        size={cols > 4 ? 48 : 58}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Decorative Garden Fence / Flower Details */}
        <span className="absolute -top-3 -left-2 text-lg">🌸</span>
        <span className="absolute -top-3 -right-2 text-lg">🌸</span>
        <span className="absolute -bottom-3 -left-2 text-lg">🌼</span>
        <span className="absolute -bottom-3 -right-2 text-lg">🌼</span>
      </div>
    </div>
  );
};
