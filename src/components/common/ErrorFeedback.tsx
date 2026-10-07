import React from 'react';
import { DetailedError } from '../../types';
import { RobiCharacter } from '../robi/RobiCharacter';
import { RefreshCw, Edit3, AlertTriangle, Lightbulb } from 'lucide-react';

interface ErrorFeedbackProps {
  error?: DetailedError;
  onDismiss: () => void;
  onReExecute?: () => void;
}

export const ErrorFeedback: React.FC<ErrorFeedbackProps> = ({ error, onDismiss, onReExecute }) => {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl border-4 border-[#F4D5DD] flex flex-col items-center text-center gap-4">
        {/* ROBI Sad State */}
        <div className="relative my-1">
          <RobiCharacter state="ERROR" size={84} />
          <div className="absolute -top-1 -right-1 bg-amber-100 text-amber-600 p-1.5 rounded-full border border-amber-300 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Error Title */}
        <div className="w-full">
          <h3 className="text-xl font-black text-[#E86F88] font-serif leading-tight">
            {error.title}
          </h3>

          {/* Tag indicating instruction number and command name if available */}
          {error.stepNumber && error.commandLabel && (
            <div className="inline-flex items-center gap-1.5 bg-[#FAF0F4] px-3 py-1 rounded-full border border-[#F4D5DD] text-xs font-bold text-[#8C4A5A] mt-2">
              <span>Instrucción {error.stepNumber}:</span>
              <span className="text-[#E86F88] font-black">{error.commandLabel}</span>
            </div>
          )}
        </div>

        {/* Explanation and Suggestion Box */}
        <div className="w-full bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl p-3.5 flex flex-col gap-2.5 text-left">
          <div>
            <div className="text-[10px] font-extrabold text-[#8C4A5A] uppercase tracking-wider mb-0.5">
              ¿Qué ocurrió?
            </div>
            <p className="text-xs text-[#4A2E35] font-medium leading-relaxed">
              {error.reason}
            </p>
          </div>

          <div className="border-t border-[#F4D5DD] pt-2 flex items-start gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                ¿Cómo corregirlo?
              </div>
              <p className="text-xs text-[#4A2E35] font-medium leading-tight">
                {error.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Requirement 7 & 8) */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <button
            onClick={onDismiss}
            className="w-full py-3 px-4 btn-pink-outline font-extrabold text-xs flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" /> Editar instrucciones
          </button>
          {onReExecute && (
            <button
              onClick={() => {
                onDismiss();
                onReExecute();
              }}
              className="w-full py-3 px-4 btn-pink-pill font-extrabold text-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Volver a ejecutar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
