import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MissionConfig } from '../../types';
import { RobiCharacter } from '../robi/RobiCharacter';
import { ArrowRight } from 'lucide-react';

interface PedagogyModalProps {
  mission: MissionConfig;
  isOpen: boolean;
  onNextMission: () => void;
}

export const PedagogyModal: React.FC<PedagogyModalProps> = ({
  mission,
  isOpen,
  onNextMission,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F48FB1', '#E86F88', '#FFFDF9', '#FFD166', '#A5D6A7'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white/95 w-full max-w-sm sm:max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-[#F4D5DD] flex flex-col items-center text-center gap-3.5 sm:gap-4 relative max-h-[90vh] overflow-y-auto">
        {/* Wara Celebrating */}
        <div className="mt-1">
          <RobiCharacter state="CELEBRATING" size={96} />
        </div>

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#E86F88] font-serif leading-tight">
            ¡Lo lograste!
          </h2>
          <p className="text-sm sm:text-base text-[#4A2E35] font-extrabold mt-1">
            {mission.id === 1 ? 'Acabas de crear un algoritmo.' : mission.conceptTitle}
          </p>
        </div>

        {/* Concept Box */}
        <div className="bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl p-3.5 sm:p-4 w-full flex flex-col gap-2.5">
          <p className="text-xs sm:text-sm text-[#4A2E35] leading-relaxed font-semibold">
            {mission.id === 1
              ? 'Un algoritmo es una serie de pasos ordenados que usamos para resolver un problema.'
              : mission.conceptDescription}
          </p>

          {/* Visual 5 -> 1 Structure for Mission 3 */}
          {mission.id === 3 && (
            <div className="my-1 bg-white p-3 rounded-xl border border-[#F4D5DD] flex flex-col items-center gap-1.5 text-xs sm:text-sm">
              <span className="font-extrabold text-[#4A2E35]">5 instrucciones iguales</span>
              <span className="text-[#E86F88] font-black text-base">↓↓↓↓↓</span>
              <span className="font-extrabold text-[#8DA875]">1 estructura repetitiva (bucle)</span>
              <span className="text-xl">🔄</span>
            </div>
          )}

          <div className="mt-1 bg-white p-2.5 rounded-xl border border-[#F4D5DD] text-xs sm:text-sm font-black text-[#E86F88]">
            🌸 {mission.conceptKey}
          </div>
        </div>

        {/* Next Mission Button */}
        <button
          type="button"
          onClick={onNextMission}
          className="w-full min-h-[50px] py-3.5 px-6 btn-pink-pill font-black text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98"
        >
          <span>
            {mission.id < 3 ? 'SIGUIENTE MISIÓN' : 'VER RESUMEN FINAL'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
