import React from 'react';
import { Direction, MissionConfig, Position, RobiState } from '../../types';
import { RobiCharacter } from '../robi/RobiCharacter';
import { Sparkles } from 'lucide-react';

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

  return (
    <div className="w-full flex flex-col items-center justify-center p-0.5 sm:p-1 select-none">
      {/* Live Step / Pedagogy Message Banner (Observation -> Decision -> Action) */}
      {stepMessage && (
        <div className="w-full max-w-[340px] sm:max-w-[390px] md:max-w-[420px] mb-2 px-3 py-1.5 bg-white/95 border-2 border-[#F4D5DD] rounded-2xl text-xs sm:text-sm font-bold text-[#8C4A5A] text-center shadow-xs flex items-center justify-center gap-2 animate-pulse">
          <span className="text-sm">🌸</span>
          <span className="leading-tight">{stepMessage}</span>
        </div>
      )}

      {/* Garden Outer Wooden Frame - Fully Responsive Width, Zero Horizontal Scroll */}
      <div className="relative w-full max-w-[340px] sm:max-w-[390px] md:max-w-[420px] mx-auto bg-[#E8DCC4]/95 p-2 sm:p-3 rounded-3xl border-4 border-[#C9B896] shadow-md">
        {/* Garden Grid Matrix */}
        <div
          className="grid gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#A3C9A8] rounded-2xl border-2 border-[#8DA875] shadow-inner w-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
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
                    relative aspect-square w-full rounded-xl flex items-center justify-center
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
                  {/* Start tile label when Wara is not there */}
                  {isStartHere && !isRobiHere && (
                    <span className="absolute bottom-1 font-mono font-bold text-[9px] sm:text-[10px] text-[#557A46]">
                      INICIO
                    </span>
                  )}

                  {/* Decorative Bush texture details */}
                  {((r === 0 && c === 1) || (r === 2 && c === 0)) && !isObstacle && !isRobiHere && !isStarHere && (
                    <span className="text-xs sm:text-sm opacity-60">🌿</span>
                  )}

                  {/* Obstacle Rock 🪨 */}
                  {isObstacle && !isRobiHere && (
                    <div className="flex flex-col items-center justify-center animate-bounce-gentle">
                      <span className="text-xl sm:text-2xl md:text-3xl filter drop-shadow-xs">🪨</span>
                    </div>
                  )}

                  {/* Target Star ⭐ */}
                  {isStarHere && (
                    <div className="relative flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl md:text-4xl filter drop-shadow-md animate-pulse">⭐</span>
                      <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-spin" />
                    </div>
                  )}

                  {/* Wara Character and Direction Indicators */}
                  {isRobiHere && (
                    <>
                      {/* 1. Subtle Vision/Direction Ray in Facing Direction */}
                      <div
                        className={`
                          absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 z-10
                          ${
                            robiDir === 'UP'
                              ? 'bg-gradient-to-t from-transparent via-[#E86F88]/15 to-[#E86F88]/35'
                              : robiDir === 'RIGHT'
                              ? 'bg-gradient-to-r from-transparent via-[#E86F88]/15 to-[#E86F88]/35'
                              : robiDir === 'DOWN'
                              ? 'bg-gradient-to-b from-transparent via-[#E86F88]/15 to-[#E86F88]/35'
                              : 'bg-gradient-to-l from-transparent via-[#E86F88]/15 to-[#E86F88]/35'
                          }
                        `}
                      />

                      {/* 2. Directional Turntable Base on Ground */}
                      <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#E86F88]/40 bg-white/40 pointer-events-none z-10 flex items-center justify-center">
                        <div
                          className="w-full h-full relative flex items-center justify-center transition-transform duration-300"
                          style={{
                            transform: `rotate(${
                              robiDir === 'UP'
                                ? 0
                                : robiDir === 'RIGHT'
                                ? 90
                                : robiDir === 'DOWN'
                                ? 180
                                : 270
                            }deg)`,
                          }}
                        >
                          <div className="w-2 h-2 bg-[#E86F88] rounded-full absolute -top-1 shadow-xs ring-2 ring-white" />
                        </div>
                      </div>

                      {/* 3. WARA SVG Character */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <RobiCharacter
                          state={robiState}
                          direction={robiDir}
                          size={cols > 4 ? 38 : 52}
                        />
                      </div>

                      {/* 4. Prominent Directional Pointer Arrow Badge at Edge of Tile */}
                      <div
                        className={`
                          absolute z-30 pointer-events-none flex items-center justify-center transition-all duration-300
                          ${
                            robiDir === 'UP'
                              ? '-top-2.5 left-1/2 -translate-x-1/2'
                              : robiDir === 'RIGHT'
                              ? '-right-2.5 top-1/2 -translate-y-1/2'
                              : robiDir === 'DOWN'
                              ? '-bottom-2.5 left-1/2 -translate-x-1/2'
                              : '-left-2.5 top-1/2 -translate-y-1/2'
                          }
                        `}
                        aria-label={`Wara mira hacia ${robiDir}`}
                      >
                        <div className="bg-[#E86F88] text-white px-2 py-0.5 rounded-full text-xs font-black shadow-md border-2 border-white flex items-center gap-0.5 animate-bounce-gentle">
                          <span className="text-xs sm:text-sm font-black leading-none">
                            {robiDir === 'UP' && '↑'}
                            {robiDir === 'RIGHT' && '→'}
                            {robiDir === 'DOWN' && '↓'}
                            {robiDir === 'LEFT' && '←'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Decorative Garden Fence / Flower Details */}
        <span className="absolute -top-3 -left-2 text-lg sm:text-xl" aria-hidden="true">🌸</span>
        <span className="absolute -top-3 -right-2 text-lg sm:text-xl" aria-hidden="true">🌸</span>
        <span className="absolute -bottom-3 -left-2 text-lg sm:text-xl" aria-hidden="true">🌼</span>
        <span className="absolute -bottom-3 -right-2 text-lg sm:text-xl" aria-hidden="true">🌼</span>
      </div>
    </div>
  );
};
