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
    <div className="w-full max-w-lg mx-auto flex flex-col gap-3 select-none">
      {/* MISSION 1: SEQUENCE CONTROLS */}
      {missionId === 1 && (
        <>
          {/* Top Switcher: Botones vs Bloques */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-[#4A2E35]">
              ✦ Modo de programación:
            </span>

            <div className="flex bg-[#F8D7E3]/70 p-1 rounded-full border-2 border-[#F4D5DD] shadow-xs">
              <button
                type="button"
                onClick={() => onModeChange('buttons')}
                disabled={isExecuting}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black transition-all min-h-[38px] flex items-center justify-center disabled:opacity-50 ${
                  mode === 'buttons'
                    ? 'bg-[#E86F88] text-white shadow-xs'
                    : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                }`}
              >
                Botones
              </button>
              <button
                type="button"
                onClick={() => onModeChange('blocks')}
                disabled={isExecuting}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black transition-all min-h-[38px] flex items-center justify-center disabled:opacity-50 ${
                  mode === 'blocks'
                    ? 'bg-[#E86F88] text-white shadow-xs'
                    : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                }`}
              >
                Bloques
              </button>
            </div>
          </div>

          {/* ACTIVE SEQUENCE DISPLAY (Hierarchy item 5: TU ALGORITMO) */}
          <div className="bg-white/95 rounded-3xl p-3 sm:p-4 border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-[#4A2E35]">
              <span className="flex items-center gap-1.5">
                <span>TU ALGORITMO</span>
                <span className="text-[#E86F88] bg-[#FAF0F4] px-2 py-0.5 rounded-full border border-[#F4D5DD] text-xs">
                  {commands.length} {commands.length === 1 ? 'instrucción' : 'instrucciones'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                {!isExecuting && (
                  <button
                    type="button"
                    onClick={onResetAttempt}
                    className="text-[#8C4A5A] hover:text-[#4A2E35] flex items-center gap-1 text-xs font-bold bg-[#FAF0F4] px-2.5 py-1 rounded-xl border border-[#F4D5DD] transition-colors min-h-[32px]"
                    title="Vuelve a Wara al inicio sin borrar la secuencia"
                  >
                    <ResetIcon className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Reiniciar</span>
                  </button>
                )}
                {commands.length > 0 && !isExecuting && (
                  <button
                    type="button"
                    onClick={onClearCommands}
                    className="text-[#E86F88] hover:text-[#D85573] flex items-center gap-1 text-xs font-bold bg-[#FAF0F4] px-2.5 py-1 rounded-xl border border-[#F4D5DD] transition-colors min-h-[32px]"
                    title="Eliminar todas las instrucciones"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            {commands.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs sm:text-sm text-[#8C4A5A]/60 italic py-3 text-center">
                Toca los controles de abajo para agregar pasos a tu algoritmo...
              </div>
            ) : mode === 'blocks' ? (
              /* Stacked Visual Blocks with prominent active execution highlight */
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-1">
                {commands.map((cmd, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => !isExecuting && onRemoveCommand(idx)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xs transition-all min-h-[44px]
                        ${isExecuting ? 'cursor-not-allowed' : 'cursor-pointer active:scale-98'}
                        ${
                          isActive
                            ? 'bg-[#E86F88] ring-4 ring-[#F48FB1] scale-[1.02] shadow-md'
                            : 'bg-[#9082D9] hover:bg-[#7E6ED1]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs opacity-80 font-mono font-black">{idx + 1}.</span>
                        {cmd.type === 'MOVE_FORWARD' && <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {cmd.type === 'TURN_LEFT' && <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {cmd.type === 'TURN_RIGHT' && <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />}
                        <span className="tracking-wide">{cmd.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="bg-white text-[#E86F88] px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shadow-xs animate-pulse">
                            ◀ ACTUAL
                          </span>
                        )}
                        {!isExecuting && (
                          <span className="text-sm opacity-70 hover:opacity-100 p-1" title="Quitar">
                            ✕
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Buttons Mode Pill badges with active step highlight */
              <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1">
                {commands.map((cmd, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => !isExecuting && onRemoveCommand(idx)}
                      className={`
                        flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-black shadow-xs transition-all min-h-[38px]
                        ${isExecuting ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                        ${
                          isActive
                            ? 'bg-[#E86F88] text-white scale-105 ring-4 ring-[#F48FB1] shadow-md'
                            : 'bg-[#FCE4EC] text-[#4A2E35] border border-[#F4D5DD] hover:bg-[#F8D7E3]'
                        }
                      `}
                    >
                      <span className="text-xs opacity-70 font-mono">{idx + 1}.</span>
                      <span>{cmd.label}</span>
                      {isActive && (
                        <span className="text-[10px] font-black bg-white text-[#E86F88] px-1.5 py-0.2 rounded-full">
                          ACTUAL
                        </span>
                      )}
                      {!isExecuting && (
                        <span className="text-xs opacity-50 hover:opacity-100 ml-1" title="Quitar">
                          ✕
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CONTROLES (Hierarchy item 6) */}
          {mode === 'buttons' ? (
            <div className="flex flex-col gap-2">
              <div className="text-xs sm:text-sm text-[#8C4A5A] font-bold text-center">
                Elige instrucciones para construir tu algoritmo:
              </div>

              {/* Comfortable mobile button controls: AVANZAR on top, IZQUIERDA / DERECHA below */}
              <div className="flex flex-col gap-2.5">
                {/* 1. Primary Move Button [ ↑ AVANZAR ] */}
                <button
                  type="button"
                  onClick={() => onAddCommand('MOVE_FORWARD', 'AVANZAR')}
                  disabled={isExecuting}
                  className="w-full min-h-[54px] sm:min-h-[58px] py-3.5 px-4 bg-white hover:bg-[#FDF0F5] active:scale-98 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FAF0F4] border border-[#E86F88] flex items-center justify-center text-[#E86F88]">
                    <ArrowUp className="w-5 h-5" />
                  </div>
                  <span>AVANZAR</span>
                </button>

                {/* 2. Turn Buttons [ ↶ IZQUIERDA ] & [ ↷ DERECHA ] */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onAddCommand('TURN_LEFT', 'GIRAR IZQUIERDA')}
                    disabled={isExecuting}
                    className="min-h-[54px] sm:min-h-[58px] py-3 px-3 bg-white hover:bg-[#FDF0F5] active:scale-98 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FAF0F4] border border-[#E86F88] flex items-center justify-center text-[#E86F88]">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <span>IZQUIERDA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddCommand('TURN_RIGHT', 'GIRAR DERECHA')}
                    disabled={isExecuting}
                    className="min-h-[54px] sm:min-h-[58px] py-3 px-3 bg-white hover:bg-[#FDF0F5] active:scale-98 border-2 border-[#F4D5DD] rounded-2xl shadow-xs text-[#4A2E35] font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FAF0F4] border border-[#E86F88] flex items-center justify-center text-[#E86F88]">
                      <RotateCw className="w-4 h-4" />
                    </div>
                    <span>DERECHA</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* BLOCKS PALETTE: Large touch-friendly blocks */
            <div className="flex flex-col gap-2">
              <div className="text-xs sm:text-sm text-[#8C4A5A] font-bold text-center">
                Toca los bloques para agregarlos a tu algoritmo:
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onAddCommand('MOVE_FORWARD', 'AVANZAR')}
                  disabled={isExecuting}
                  className="w-full min-h-[52px] px-4 py-3 bg-[#9082D9] hover:bg-[#7E6ED1] text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-between shadow-xs active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  <span className="flex items-center gap-2.5">
                    <ArrowUp className="w-5 h-5" />
                    <span>[ ↑  AVANZAR ]</span>
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">+ Agregar</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onAddCommand('TURN_LEFT', 'GIRAR IZQUIERDA')}
                    disabled={isExecuting}
                    className="min-h-[52px] px-3 py-3 bg-[#8292D9] hover:bg-[#6E80D1] text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>[ ↶ GIRAR IZQ ]</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAddCommand('TURN_RIGHT', 'GIRAR DERECHA')}
                    disabled={isExecuting}
                    className="min-h-[52px] px-3 py-3 bg-[#B882D9] hover:bg-[#A66ED1] text-white rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>[ ↷ GIRAR DER ]</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* MISSION 2: CONDITIONAL RULE BUILDER */}
      {missionId === 2 && (
        <div className="flex flex-col gap-3">
          {/* Top Switcher: Botones vs Bloques & Reset */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-extrabold text-[#4A2E35]">
              ✦ Regla condicional:
            </span>

            <div className="flex items-center gap-2">
              {!isExecuting && (
                <button
                  type="button"
                  onClick={onResetAttempt}
                  className="text-[#8C4A5A] hover:text-[#4A2E35] flex items-center gap-1 text-xs font-bold bg-[#FAF0F4] px-2.5 py-1 rounded-xl border border-[#F4D5DD] transition-colors min-h-[34px]"
                  title="Vuelve a Wara al inicio"
                >
                  <ResetIcon className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              )}

              <div className="flex bg-[#F8D7E3]/70 p-1 rounded-full border-2 border-[#F4D5DD]">
                <button
                  type="button"
                  onClick={() => onModeChange('buttons')}
                  disabled={isExecuting}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-black transition-all min-h-[34px] disabled:opacity-50 ${
                    mode === 'buttons'
                      ? 'bg-[#E86F88] text-white shadow-xs'
                      : 'text-[#8C4A5A] hover:text-[#4A2E35]'
                  }`}
                >
                  Botones
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange('blocks')}
                  disabled={isExecuting}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-black transition-all min-h-[34px] disabled:opacity-50 ${
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
            /* METHOD A: BUTTONS CARD SELECTOR */
            <div className="bg-white/95 p-3.5 sm:p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-3 shadow-xs">
              <div className="text-center font-bold text-xs sm:text-sm text-[#8C4A5A]">
                Configura la decisión de Wara y pulsa <span className="text-[#E86F88] font-black">EJECUTAR</span>:
              </div>

              {/* Rama SI */}
              <div className="bg-[#FAF0F4] p-3 rounded-2xl border border-[#F4D5DD] flex flex-col gap-2">
                <span className="text-xs sm:text-sm font-black text-[#E86F88] uppercase tracking-wide flex items-center gap-1.5">
                  <span>⚙️</span> Si hay obstáculo en frente:
                </span>
                <div className="grid grid-cols-3 gap-2">
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
                        p-2.5 rounded-xl text-xs sm:text-sm font-black flex flex-col items-center justify-center gap-1.5 transition-all min-h-[52px]
                        ${
                          conditionRule.thenAction === opt.type
                            ? 'bg-[#E86F88] text-white shadow-xs ring-2 ring-[#E86F88]'
                            : 'bg-white text-[#4A2E35] border border-[#F4D5DD] hover:bg-pink-50'
                        }
                      `}
                    >
                      <opt.icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rama SI NO */}
              <div className="bg-[#FAF0F4] p-3 rounded-2xl border border-[#F4D5DD] flex flex-col gap-2">
                <span className="text-xs sm:text-sm font-black text-[#557A46] uppercase tracking-wide flex items-center gap-1.5">
                  <span>🌱</span> SI NO (camino libre):
                </span>
                <div className="grid grid-cols-3 gap-2">
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
                        p-2.5 rounded-xl text-xs sm:text-sm font-black flex flex-col items-center justify-center gap-1.5 transition-all min-h-[52px]
                        ${
                          conditionRule.elseAction === opt.type
                            ? 'bg-[#557A46] text-white shadow-xs ring-2 ring-[#557A46]'
                            : 'bg-white text-[#4A2E35] border border-[#F4D5DD] hover:bg-emerald-50'
                        }
                      `}
                    >
                      <opt.icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* METHOD B: VISUAL CODE BLOCKS */
            <div className="bg-white/95 p-3.5 sm:p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-3 shadow-xs">
              <div className="text-center font-bold text-xs sm:text-sm text-[#8C4A5A]">
                Bloque condicional de Wara
              </div>

              {/* Bloque SI */}
              <div className="bg-[#9082D9] text-white p-3.5 rounded-2xl shadow-xs flex flex-col gap-2.5">
                <div className="text-xs sm:text-sm font-black">
                  ⚙️ SI [ HAY OBSTÁCULO EN FRENTE ] ENTONCES:
                </div>
                <div className="pl-3 border-l-2 border-white/40 flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                  <span className="text-xs sm:text-sm font-black flex items-center gap-1.5">
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
                    className="bg-white text-[#4A2E35] font-black text-xs sm:text-sm rounded-xl px-3 py-2 border border-white outline-none focus:ring-2 focus:ring-white disabled:opacity-50 shadow-xs min-h-[44px]"
                  >
                    <option value="TURN_RIGHT">↷ GIRAR DERECHA</option>
                    <option value="TURN_LEFT">↶ GIRAR IZQUIERDA</option>
                    <option value="MOVE_FORWARD">↑ AVANZAR</option>
                  </select>
                </div>
              </div>

              {/* Bloque SI NO */}
              <div className="bg-[#8DA875] text-white p-3.5 rounded-2xl shadow-xs flex flex-col gap-2.5">
                <div className="text-xs sm:text-sm font-black">
                  🌱 SI NO (CAMINO LIBRE):
                </div>
                <div className="pl-3 border-l-2 border-white/40 flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
                  <span className="text-xs sm:text-sm font-black flex items-center gap-1.5">
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
                    className="bg-white text-[#4A2E35] font-black text-xs sm:text-sm rounded-xl px-3 py-2 border border-white outline-none focus:ring-2 focus:ring-white disabled:opacity-50 shadow-xs min-h-[44px]"
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

      {/* MISSION 3: LOOP RULE BUILDER */}
      {missionId === 3 && (
        <div className="bg-white/95 p-3.5 sm:p-4 rounded-3xl border-2 border-[#F4D5DD] flex flex-col gap-3 shadow-xs">
          <div className="bg-[#9082D9] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs min-h-[56px]">
            <span className="text-sm sm:text-base font-black flex items-center gap-1.5">
              <span>🔄</span> Repetir:
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onUpdateLoopRule({
                    ...loopRule,
                    repetitions: Math.max(1, loopRule.repetitions - 1),
                  })
                }
                disabled={isExecuting || loopRule.repetitions <= 1}
                className="w-11 h-11 rounded-full bg-white/20 font-black text-xl text-white flex items-center justify-center hover:bg-white/30 active:scale-95 disabled:opacity-50 transition-all"
                aria-label="Restar repeticiones"
              >
                -
              </button>
              <span className="font-black text-base sm:text-lg text-white px-2">
                {loopRule.repetitions} veces
              </span>
              <button
                type="button"
                onClick={() =>
                  onUpdateLoopRule({
                    ...loopRule,
                    repetitions: Math.min(8, loopRule.repetitions + 1),
                  })
                }
                disabled={isExecuting || loopRule.repetitions >= 8}
                className="w-11 h-11 rounded-full bg-white/20 font-black text-xl text-white flex items-center justify-center hover:bg-white/30 active:scale-95 disabled:opacity-50 transition-all"
                aria-label="Sumar repeticiones"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-[#A499E2] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xs ml-4 min-h-[50px]">
            <span className="text-sm sm:text-base font-black flex items-center gap-2">
              <ArrowUp className="w-5 h-5" />
              <span>Avanzar</span>
            </span>
          </div>
        </div>
      )}

      {/* EXECUTE PILL BUTTON (Hierarchy item 7) */}
      <button
        type="button"
        onClick={onExecute}
        disabled={isExecuting || (missionId === 1 && commands.length === 0)}
        className={`
          w-full min-h-[56px] py-4 px-6 rounded-full font-black text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2.5 tracking-wider uppercase
          ${
            isExecuting || (missionId === 1 && commands.length === 0)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-80'
              : 'btn-pink-pill active:scale-98'
          }
        `}
      >
        <Play className={`w-5 h-5 ${isExecuting ? 'animate-spin' : 'fill-current'}`} />
        <span>{isExecuting ? 'EJECUTANDO ALGORITMO...' : 'EJECUTAR ALGORITMO'}</span>
      </button>
    </div>
  );
};
