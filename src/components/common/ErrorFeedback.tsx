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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white/95 w-full max-w-sm sm:max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-[#F4D5DD] flex flex-col items-center text-center gap-3.5 sm:gap-4 max-h-[90vh] overflow-y-auto">
        {/* Wara Sad State */}
        <div className="relative my-0.5">
          <RobiCharacter state="ERROR" size={88} />
          <div className="absolute -top-1 -right-1 bg-amber-100 text-amber-600 p-1.5 rounded-full border border-amber-300 shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Error Title */}
        <div className="w-full">
          <h3 className="text-xl sm:text-2xl font-black text-[#E86F88] font-serif leading-tight">
            {error.title}
          </h3>

          {/* Tag indicating instruction number and command name if available */}
          {error.stepNumber && error.commandLabel && (
            <div className="inline-flex items-center gap-1.5 bg-[#FAF0F4] px-3 py-1 rounded-full border border-[#F4D5DD] text-xs sm:text-sm font-black text-[#8C4A5A] mt-2">
              <span>Instrucción {error.stepNumber}:</span>
              <span className="text-[#E86F88] font-black">{error.commandLabel}</span>
            </div>
          )}
        </div>

        {/* Explanation and Suggestion Box */}
        <div className="w-full bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 text-left">
          <div>
            <div className="text-xs sm:text-sm font-black text-[#8C4A5A] uppercase tracking-wider mb-1">
              ¿Qué ocurrió?
            </div>
            <p className="text-xs sm:text-sm text-[#4A2E35] font-semibold leading-relaxed">
              {error.reason}
            </p>
          </div>

          <div className="border-t border-[#F4D5DD] pt-2.5 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs sm:text-sm font-black text-amber-700 uppercase tracking-wider mb-0.5">
                ¿Cómo corregirlo?
              </div>
              <p className="text-xs sm:text-sm text-[#4A2E35] font-semibold leading-normal">
                {error.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons with comfortable touch areas */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full min-h-[48px] py-3 px-4 btn-pink-outline font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar instrucciones</span>
          </button>
          {onReExecute && (
            <button
              type="button"
              onClick={() => {
                onDismiss();
                onReExecute();
              }}
              className="w-full min-h-[48px] py-3 px-4 btn-pink-pill font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Volver a ejecutar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
