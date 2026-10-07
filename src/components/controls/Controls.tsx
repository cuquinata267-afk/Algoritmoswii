import React from 'react';
import { Command, CommandType, ConditionRule, InteractionMode, LoopRule, MissionId } from '../../types';
import { ArrowUp, RotateCcw, RotateCw, Play, Trash2, RotateCcw as ResetIcon } from 'lucide-react';

interface ControlsProps {
  missionId: MissionId;
  commands: Command[];
  onAddCommand: (type: CommandType, label: string) => void;
  onRemoveCommand: (index: number) => void;
  onClearCommands: () => void;
  onResetAttempt: () => void;
  onExecute: () => void;
  isExecuting: boolean;
  activeStepIndex?: number;
  mode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;

  // For Mission 2 (Conditionals)
  conditionRule: ConditionRule;
  onUpdateConditionRule: (rule: ConditionRule) => void;

  // For Mission 3 (Loops)
  loopRule: LoopRule;
  onUpdateLoopRule: (rule: LoopRule) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  missionId,
  commands,
  onAddCommand,
  onRemoveCommand,
  onClearCommands,
  onResetAttempt,
  onExecute,
  isExecuting,
  activeStepIndex,
  mode,
  onModeChange,
  conditionRule,
  onUpdateConditionRule,
  loopRule,
  onUpdateLoopRule,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-3 p-2 select-none">
      {/* MISSION 1: SEQUENCE CONTROLS */}
      {missionId === 1 && (
        <>
          {/* Top Switcher Pills (Botones / Bloques) */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A2E35]">✦ Instrucciones:</span>

            <div className="flex bg-[#F8D7E3]/60 p-1 rounded-full border border-[#F4D5DD]">
              <button
                onClick={() => onModeChange('buttons')}
                disabled={isExecuting}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                  mode === 'buttons'
                    ? 'bg-[#E86F88] text-white shadow-xs'
                    : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                }`}
              >
                Botones
              </button>
              <button
                onClick={() => onModeChange('blocks')}
                disabled={isExecuting}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                  mode === 'blocks'
                    ? 'bg-[#E86F88] text-white shadow-xs'
                    : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                }`}
              >
                Bloques
              </button>
            </div>
          </div>

          {/* METHOD A: BUTTONS */}
          {mode === 'buttons' ? (
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] text-[#8C4A5A] font-semibold text-center">
                Agrega instrucciones y después pulsa <span className="font-bold text-[#E86F88]">EJECUTAR</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onAddCommand('MOVE_FORWARD', 'AVANZAR')}
                  disabled={isExecuting}
                  className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FDF0F5] active:scale-95 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ArrowUp className="w-5 h-5 text-[#E86F88] mb-1" />
                  ↑ AVANZAR
                </button>
                <button
                  onClick={() => onAddCommand('TURN_LEFT', 'GIRAR IZQUIERDA')}
                  disabled={isExecuting}
                  className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FDF0F5] active:scale-95 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <RotateCcw className="w-5 h-5 text-[#E86F88] mb-1" />
                  ↶ IZQUIERDA
                </button>
                <button
                  onClick={() => onAddCommand('TURN_RIGHT', 'GIRAR DERECHA')}
                  disabled={isExecuting}
                  className="flex flex-col items-center justify-center p-3 bg-white hover:bg-[#FDF0F5] active:scale-95 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <RotateCw className="w-5 h-5 text-[#E86F88] mb-1" />
                  ↷ DERECHA
                </button>
              </div>
            </div>
          ) : (
            /* METHOD B: VISUAL BLOCKS PALETTE */
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] text-[#8C4A5A] font-semibold text-center">
                Agrega bloques a tu algoritmo y después pulsa <span className="font-bold text-[#E86F88]">EJECUTAR</span>
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => onAddCommand('MOVE_FORWARD', 'AVANZAR')}
                  disabled={isExecuting}
                  className="px-3.5 py-2.5 bg-[#9082D9] hover:bg-[#7E6ED1] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ArrowUp className="w-4 h-4" /> [ AVANZAR ]
                </button>
                <button
                  onClick={() => onAddCommand('TURN_LEFT', 'GIRAR IZQUIERDA')}
                  disabled={isExecuting}
                  className="px-3.5 py-2.5 bg-[#8292D9] hover:bg-[#6E80D1] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <RotateCcw className="w-4 h-4" /> [ GIRAR IZQ ]
                </button>
                <button
                  onClick={() => onAddCommand('TURN_RIGHT', 'GIRAR DERECHA')}
                  disabled={isExecuting}
                  className="px-3.5 py-2.5 bg-[#B882D9] hover:bg-[#A66ED1] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <RotateCw className="w-4 h-4" /> [ GIRAR DER ]
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE SEQUENCE DISPLAY (Requirement 9 & 15) */}
          <div className="bg-white/95 rounded-2xl p-3 border-2 border-[#F4D5DD] min-h-[95px] shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#4A2E35]">
              <span>TU ALGORITMO ({commands.length} {commands.length === 1 ? 'instrucción' : 'instrucciones'}):</span>
              <div className="flex items-center gap-2">
                {!isExecuting && (
                  <button
                    onClick={onResetAttempt}
                    className="text-[#8C4A5A] hover:text-[#4A2E35] flex items-center gap-1 text-[11px] font-semibold bg-[#FAF0F4] px-2 py-0.5 rounded-lg border border-[#F4D5DD] transition-colors"
                    title="Vuelve a WARA al inicio sin borrar la secuencia"
                  >
                    <ResetIcon className="w-3 h-3" /> Reiniciar intento
                  </button>
                )}
                {commands.length > 0 && !isExecuting && (
                  <button
                    onClick={onClearCommands}
                    className="text-[#E86F88] hover:underline flex items-center gap-1 text-[11px]"
                    title="Eliminar todas las instrucciones"
                  >
                    <Trash2 className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>
            </div>

            {commands.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-[#8C4A5A]/50 italic py-2">
                Toca los botones o bloques de arriba para construir tu algoritmo...
              </div>
            ) : mode === 'blocks' ? (
              /* Stacked Purple/Pink Blocks matching Screen 5 in reference image */
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto p-1">
                {commands.map((cmd, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => !isExecuting && onRemoveCommand(idx)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all
                        ${isExecuting ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${
                          isActive
                            ? 'bg-[#E86F88] ring-2 ring-[#F48FB1] scale-[1.02]'
                            : 'bg-[#9082D9] hover:bg-[#7E6ED1]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-75 font-mono">{idx + 1}.</span>
                        {cmd.type === 'MOVE_FORWARD' && <ArrowUp className="w-4 h-4" />}
                        {cmd.type === 'TURN_LEFT' && <RotateCcw className="w-4 h-4" />}
                        {cmd.type === 'TURN_RIGHT' && <RotateCw className="w-4 h-4" />}
                        <span>{cmd.label}</span>
                      </div>
                      {!isExecuting && <span className="text-xs opacity-75 hover:opacity-100">×</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Method A Button Pills */
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {commands.map((cmd, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => !isExecuting && onRemoveCommand(idx)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-all
                        ${isExecuting ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${
                          isActive
                            ? 'bg-[#E86F88] text-white scale-105 ring-2 ring-[#E86F88]'
                            : 'bg-[#FCE4EC] text-[#4A2E35] border border-[#F4D5DD] hover:bg-[#F8D7E3]'
                        }
                      `}
                    >
                      <span className="text-[10px] opacity-60 font-mono">{idx + 1}.</span>
                      <span>{cmd.label}</span>
                      {!isExecuting && <span className="text-[10px] opacity-50 hover:opacity-100 ml-0.5">×</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* MISSION 2: CONDITIONAL RULE BUILDER (Matching Screen 6) */}
      {missionId === 2 && (
        <div className="flex flex-col gap-3">
          {/* Top Switcher Pills (Botones / Bloques) & Reset */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A2E35]">✦ Regla condicional:</span>

            <div className="flex items-center gap-2">
              {!isExecuting && (
                <button
                  onClick={onResetAttempt}
                  className="text-[#8C4A5A] hover:text-[#4A2E35] flex items-center gap-1 text-[11px] font-semibold bg-[#FAF0F4] px-2 py-0.5 rounded-lg border border-[#F4D5DD] transition-colors"
                  title="Vuelve a WARA al inicio"
                >
                  <ResetIcon className="w-3 h-3" /> Reiniciar intento
                </button>
              )}

              <div className="flex bg-[#F8D7E3]/60 p-1 rounded-full border border-[#F4D5DD]">
                <button
                  onClick={() => onModeChange('buttons')}
                  disabled={isExecuting}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                    mode === 'buttons'
                      ? 'bg-[#E86F88] text-white shadow-xs'
                      : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                  }`}
                >
                  Botones
                </button>
                <button
                  onClick={() => onModeChange('blocks')}
                  disabled={isExecuting}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                    mode === 'blocks'
                      ? 'bg-[#E86F88] text-white shadow-xs'
                      : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                  }`}
                >
                  Bloques
                </button>
              </div>
            </div>
          </div>

          {mode === 'buttons' ? (
            /* METHOD A: BUTTONS / CARD SELECTOR */
            <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-3 shadow-xs">
              <div className="text-center font-bold text-xs text-[#8C4A5A]">
                Configura la decisión de WARA y pulsa <span className="text-[#E86F88] font-black">EJECUTAR</span>
              </div>

              {/* Rama SI */}
              <div className="bg-[#FAF0F4] p-3 rounded-2xl border border-[#F4D5DD] flex flex-col gap-2">
                <span className="text-xs font-extrabold text-[#E86F88] uppercase tracking-wide flex items-center gap-1">
                  ⚙️ Si hay obstáculo en frente:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { type: 'TURN_RIGHT' as CommandType, label: '↷ Girar derecha', icon: RotateCw },
                    { type: 'TURN_LEFT' as CommandType, label: '↶ Girar izq', icon: RotateCcw },
                    { type: 'MOVE_FORWARD' as CommandType, label: '↑ Avanzar', icon: ArrowUp },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      disabled={isExecuting}
                      onClick={() =>
                        onUpdateConditionRule({
                          ...conditionRule,
                          thenAction: opt.type,
                        })
                      }
                      className={`
                        p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all
                        ${
                          conditionRule.thenAction === opt.type
                            ? 'bg-[#E86F88] text-white shadow-xs ring-2 ring-[#E86F88]'
                            : 'bg-white text-[#4A2E35] border border-[#F4D5DD] hover:bg-pink-50'
                        }
                      `}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rama SI NO */}
              <div className="bg-[#FAF0F4] p-3 rounded-2xl border border-[#F4D5DD] flex flex-col gap-2">
                <span className="text-xs font-extrabold text-[#557A46] uppercase tracking-wide flex items-center gap-1">
                  🌱 SI NO (camino libre):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { type: 'MOVE_FORWARD' as CommandType, label: '↑ Avanzar', icon: ArrowUp },
                    { type: 'TURN_RIGHT' as CommandType, label: '↷ Girar derecha', icon: RotateCw },
                    { type: 'TURN_LEFT' as CommandType, label: '↶ Girar izq', icon: RotateCcw },
                  ].map((opt) => (
                    <button
                      key={opt.type}
                      type="button"
                      disabled={isExecuting}
                      onClick={() =>
                        onUpdateConditionRule({
                          ...conditionRule,
                          elseAction: opt.type,
                        })
                      }
                      className={`
                        p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all
                        ${
                          conditionRule.elseAction === opt.type
                            ? 'bg-[#557A46] text-white shadow-xs ring-2 ring-[#557A46]'
                            : 'bg-white text-[#4A2E35] border border-[#F4D5DD] hover:bg-emerald-50'
                        }
                      `}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* METHOD B: VISUAL CODE BLOCKS (Scratch-like nested style) */
            <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-2.5 shadow-xs">
              <div className="text-center font-bold text-xs text-[#8C4A5A]">
                Bloque condicional de WARA
              </div>

              {/* Bloque SI */}
              <div className="bg-[#9082D9] text-white p-3 rounded-2xl shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span>⚙️ SI [ HAY OBSTÁCULO EN FRENTE ] ENTONCES:</span>
                </div>
                <div className="pl-4 border-l-2 border-white/40 flex items-center justify-between bg-white/10 p-2 rounded-xl">
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    ↳ Acción:
                  </span>
                  <select
                    value={conditionRule.thenAction}
                    onChange={(e) =>
                      onUpdateConditionRule({
                        ...conditionRule,
                        thenAction: e.target.value as CommandType,
                      })
                    }
                    disabled={isExecuting}
                    className="bg-white text-[#4A2E35] font-black text-xs rounded-xl px-2.5 py-1.5 border border-white outline-none focus:ring-2 focus:ring-white disabled:opacity-50 shadow-xs"
                  >
                    <option value="TURN_RIGHT">↷ GIRAR DERECHA</option>
                    <option value="TURN_LEFT">↶ GIRAR IZQUIERDA</option>
                    <option value="MOVE_FORWARD">↑ AVANZAR</option>
                  </select>
                </div>
              </div>

              {/* Bloque SI NO */}
              <div className="bg-[#8DA875] text-white p-3 rounded-2xl shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span>🌱 SI NO (CAMINO LIBRE):</span>
                </div>
                <div className="pl-4 border-l-2 border-white/40 flex items-center justify-between bg-white/10 p-2 rounded-xl">
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    ↳ Acción:
                  </span>
                  <select
                    value={conditionRule.elseAction}
                    onChange={(e) =>
                      onUpdateConditionRule({
                        ...conditionRule,
                        elseAction: e.target.value as CommandType,
                      })
                    }
                    disabled={isExecuting}
                    className="bg-white text-[#4A2E35] font-black text-xs rounded-xl px-2.5 py-1.5 border border-white outline-none focus:ring-2 focus:ring-white disabled:opacity-50 shadow-xs"
                  >
                    <option value="MOVE_FORWARD">↑ AVANZAR</option>
                    <option value="TURN_RIGHT">↷ GIRAR DERECHA</option>
                    <option value="TURN_LEFT">↶ GIRAR IZQUIERDA</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MISSION 3: LOOP RULE BUILDER (Matching Screen 8) */}
      {missionId === 3 && (
        <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-3 shadow-xs">
          <div className="bg-[#9082D9] text-white p-3 rounded-2xl flex items-center justify-between shadow-xs">
            <span className="text-xs font-extrabold">🔄 Repetir:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateLoopRule({
                    ...loopRule,
                    repetitions: Math.max(1, loopRule.repetitions - 1),
                  })
                }
                disabled={isExecuting || loopRule.repetitions <= 1}
                className="w-7 h-7 rounded-full bg-white/20 font-bold text-white flex items-center justify-center hover:bg-white/30 disabled:opacity-50"
              >
                -
              </button>
              <span className="font-extrabold text-sm text-white px-1">
                {loopRule.repetitions} veces
              </span>
              <button
                onClick={() =>
                  onUpdateLoopRule({
                    ...loopRule,
                    repetitions: Math.min(8, loopRule.repetitions + 1),
                  })
                }
                disabled={isExecuting || loopRule.repetitions >= 8}
                className="w-7 h-7 rounded-full bg-white/20 font-bold text-white flex items-center justify-center hover:bg-white/30 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#A499E2] text-white p-3 rounded-2xl flex items-center justify-between shadow-xs ml-4">
            <span className="text-xs font-bold flex items-center gap-1">
              <ArrowUp className="w-4 h-4" /> Avanzar
            </span>
          </div>
        </div>
      )}

      {/* EXECUTE PILL BUTTON (Requirement 5 & 20 CASO 9) */}
      <button
        onClick={onExecute}
        disabled={isExecuting || (missionId === 1 && commands.length === 0)}
        className={`
          w-full py-4 px-6 rounded-full font-extrabold text-base shadow-md transition-all flex items-center justify-center gap-2 tracking-wide uppercase
          ${
            isExecuting || (missionId === 1 && commands.length === 0)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
              : 'btn-pink-pill active:scale-98'
          }
        `}
      >
        <Play className={`w-5 h-5 ${isExecuting ? 'animate-spin' : 'fill-current'}`} />
        {isExecuting ? 'EJECUTANDO ALGORITMO...' : 'EJECUTAR ALGORITMO'}
      </button>
    </div>
  );
};
