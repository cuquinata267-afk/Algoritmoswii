import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Grid } from '../components/grid/Grid';
import { Controls } from '../components/controls/Controls';
import { PedagogyModal } from '../components/common/PedagogyModal';
import { ErrorFeedback } from '../components/common/ErrorFeedback';
import { MISSIONS } from '../game/missions';
import { GameEngine } from '../game/engine';
import { useGameSync } from '../hooks/useGameSync';
import { generateUUID } from '../lib/supabase';
import {
  Command,
  CommandType,
  ConditionRule,
  DetailedError,
  Direction,
  ExecutionResult,
  InteractionMode,
  LoopRule,
  MissionId,
  Position,
  RobiState,
} from '../types';
import { Lightbulb } from 'lucide-react';

export const PlayScreen: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recordAttempt, touchActivity } = useGameSync();

  const missionId = (parseInt(searchParams.get('mission') || '1') as MissionId) || 1;
  const currentMission = MISSIONS[missionId] || MISSIONS[1];

  // Estado del robot (desacoplado de la UI)
  const [robiPos, setRobiPos] = useState<Position>({ ...currentMission.startPosition });
  const [robiDir, setRobiDir] = useState<Direction>(currentMission.startDirection);
  const [robiState, setRobiState] = useState<RobiState>('IDLE');

  // Estado de comandos y ejecución
  const [commands, setCommands] = useState<Command[]>([]);
  const [mode, setMode] = useState<InteractionMode>('buttons');
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | undefined>(undefined);
  const [currentError, setCurrentError] = useState<DetailedError | undefined>(undefined);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [stepMessage, setStepMessage] = useState<string | undefined>(undefined);
  const [inspectedPos, setInspectedPos] = useState<Position | undefined>(undefined);

  // Misión 2: Regla condicional canónica (Regla 8 y 15)
  const [conditionRule, setConditionRule] = useState<ConditionRule>({
    condition: 'IF_OBSTACLE',
    thenAction: 'TURN_RIGHT',
    elseAction: 'MOVE_FORWARD',
  });

  // Misión 3: Regla de bucle
  const [loopRule, setLoopRule] = useState<LoopRule>({
    repetitions: 5,
    action: 'MOVE_FORWARD',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * REGLA FUNDAMENTAL: Reiniciar ROBI al estado inicial de la misión.
   * Si clearCommands es true, también elimina la secuencia (botón LIMPIAR).
   * Si clearCommands es false, preserva las instrucciones (EDITAR o REINICIAR INTENTO).
   */
  const resetAttempt = useCallback(
    (clearCommands: boolean = false) => {
      // 1. Detener cualquier animación en curso
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // 2. Colocar a ROBI exactamente en START y con su orientación inicial
      setRobiPos({ ...currentMission.startPosition });
      setRobiDir(currentMission.startDirection);
      setRobiState('IDLE');

      // 3. Limpiar banderas de ejecución, inspección y errores
      setIsExecuting(false);
      setActiveStepIndex(undefined);
      setCurrentError(undefined);
      setStepMessage(undefined);
      setInspectedPos(undefined);

      // 4. Opcionalmente limpiar comandos
      if (clearCommands) {
        setCommands([]);
      }
    },
    [currentMission]
  );

  // Reiniciar estado al cambiar de misión y registrar presencia activa
  useEffect(() => {
    resetAttempt(true);
    setIsSuccessModalOpen(false);

    // Heartbeat cada 35 segundos para cumplir con la regla de participante conectada (< 60s)
    touchActivity(missionId, mode, true);
    const heartbeatInterval = setInterval(() => {
      touchActivity(missionId, mode, false);
    }, 35000);

    return () => {
      clearInterval(heartbeatInterval);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [missionId, mode, resetAttempt, touchActivity]);

  // Manejadores de comandos para Misión 1
  const handleAddCommand = (type: CommandType, label: string) => {
    if (isExecuting) return;
    touchActivity(missionId, mode);
    setCurrentError(undefined);
    const newCmd: Command = {
      id: generateUUID(),
      type,
      label,
    };
    setCommands((prev) => [...prev, newCmd]);
  };

  const handleRemoveCommand = (index: number) => {
    if (isExecuting) return;
    touchActivity(missionId, mode);
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCommands = () => {
    if (isExecuting) return;
    resetAttempt(true);
  };

  const handleResetAttempt = () => {
    if (isExecuting) return;
    resetAttempt(false);
  };

  /**
   * EJECUCIÓN PASO A PASO DETERMINISTA
   * Siempre crea una simulación nueva a partir del estado inicial de la misión.
   */
  const handleExecute = () => {
    if (isExecuting) return; // Evitar ejecuciones simultáneas si se pulsa rápidamente

    // 1. Limpiar cualquier timer previo
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 2. Simulación limpia y determinista desde START
    let result: ExecutionResult;
    if (missionId === 1) {
      result = GameEngine.simulateSequence(currentMission, commands);
    } else if (missionId === 2) {
      result = GameEngine.simulateConditional(currentMission, conditionRule);
    } else {
      result = GameEngine.simulateLoop(currentMission, loopRule);
    }

    // Si la secuencia está vacía, mostrar error sin iniciar animación
    if (result.error && result.error.type === 'EMPTY_PROGRAM') {
      setCurrentError(result.error);
      return;
    }

    // 3. Reiniciar ROBI al estado inicial antes de comenzar a animar
    setRobiPos({ ...currentMission.startPosition });
    setRobiDir(currentMission.startDirection);
    setRobiState('IDLE');
    setIsExecuting(true);
    setCurrentError(undefined);
    setActiveStepIndex(undefined);

    const { steps, success, error } = result;

    let stepIdx = 0;
    timerRef.current = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setRobiPos(step.position);
        setRobiDir(step.direction);
        setRobiState(step.robiState);
        setActiveStepIndex(step.activeCommandIndex);
        setStepMessage(step.logMessage);
        setInspectedPos(step.inspectedPosition);
        stepIdx++;
      } else {
        // Fin de la ejecución
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsExecuting(false);
        setActiveStepIndex(undefined);
        setInspectedPos(undefined);

        // Registro en Supabase en segundo plano
        recordAttempt(
          missionId,
          success,
          error?.type,
          missionId === 1 ? commands : missionId === 2 ? conditionRule : loopRule,
          mode
        );

        if (success) {
          setRobiState('SUCCESS');
          setTimeout(() => {
            setIsSuccessModalOpen(true);
          }, 400);
        } else {
          setRobiState('ERROR');
          setCurrentError(error);
        }
      }
    }, 600); // 600ms por paso para que la participante observe con claridad cada acción
  };

  const handleNextMission = () => {
    setIsSuccessModalOpen(false);
    if (missionId < 3) {
      setSearchParams({ mission: (missionId + 1).toString() });
    } else {
      navigate('/summary');
    }
  };

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col justify-between select-none">
      <Header currentMission={missionId} />

      <main className="w-full max-w-lg mx-auto p-3 sm:p-4 flex flex-col gap-3 my-auto">
        {/* Título de la Misión */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black text-pastel-berry font-serif">
            {currentMission.title}
          </h2>
          <p className="text-xs text-pastel-vibrant font-semibold mt-0.5">
            {currentMission.subtitle}
          </p>
        </div>

        {/* Indicación Pedagógica */}
        <div className="bg-white/90 border border-pastel-rose/40 rounded-2xl p-3 flex flex-col gap-1 shadow-xs">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-pastel-berry font-bold leading-tight">
              {currentMission.hint}
            </p>
          </div>
          <p className="text-[10.5px] text-[#8C4A5A] font-semibold pl-6">
            {missionId === 1 && (
              <>🌸 <span className="font-extrabold text-[#E86F88]">El orden importa:</span> Construye tu algoritmo y pulsa <span className="font-bold">EJECUTAR</span>.</>
            )}
            {missionId === 2 && (
              <>💡 <span className="font-extrabold text-[#E86F88]">Evaluar antes de actuar:</span> Si ROBI encuentra un obstáculo, tomará una decisión.</>
            )}
            {missionId === 3 && (
              <>🔄 <span className="font-extrabold text-[#E86F88]">Repetición:</span> Con un bucle escribes menos y logras más.</>
            )}
          </p>
        </div>

        {/* Cuadrícula interactiva con orientación explícita de ROBI */}
        <Grid
          mission={currentMission}
          robiPos={robiPos}
          robiDir={robiDir}
          robiState={robiState}
          inspectedPosition={inspectedPos}
          stepMessage={stepMessage}
        />

        {/* Feedback de error detallado y no punitivo */}
        <ErrorFeedback
          error={currentError}
          onDismiss={() => {
            // Al presionar EDITAR INSTRUCCIONES: cierra el modal y vuelve a ROBI a START (Regla 8)
            resetAttempt(false);
          }}
          onReExecute={() => {
            // Al presionar VOLVER A EJECUTAR: vuelve a START y ejecuta de nuevo
            resetAttempt(false);
            setTimeout(() => {
              handleExecute();
            }, 50);
          }}
        />

        {/* Controles de la misión */}
        <Controls
          missionId={missionId}
          commands={commands}
          onAddCommand={handleAddCommand}
          onRemoveCommand={handleRemoveCommand}
          onClearCommands={handleClearCommands}
          onResetAttempt={handleResetAttempt}
          onExecute={handleExecute}
          isExecuting={isExecuting}
          activeStepIndex={activeStepIndex}
          mode={mode}
          onModeChange={setMode}
          conditionRule={conditionRule}
          onUpdateConditionRule={setConditionRule}
          loopRule={loopRule}
          onUpdateLoopRule={setLoopRule}
        />
      </main>

      {/* Modal de celebración y descubrimiento pedagógico */}
      <PedagogyModal
        mission={currentMission}
        isOpen={isSuccessModalOpen}
        onNextMission={handleNextMission}
      />
    </div>
  );
};
