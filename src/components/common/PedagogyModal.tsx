import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MissionConfig } from '../../types';
import { RobiCharacter } from '../robi/RobiCharacter';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white/95 w-full max-w-sm rounded-3xl p-6 shadow-2xl border-4 border-[#F4D5DD] flex flex-col items-center text-center gap-4 relative">
        {/* ROBI Celebrating */}
        <div className="mt-1">
          <RobiCharacter state="CELEBRATING" size={100} />
        </div>

        {/* Title & Subtitle (Matching Screen 6/9) */}
        <div>
          <h2 className="text-2xl font-black text-[#E86F88] font-serif">
            ¡Lo lograste!
          </h2>
          <p className="text-xs text-[#4A2E35] font-extrabold mt-0.5">
            {mission.id === 1 ? 'Acabas de crear un algoritmo.' : mission.conceptTitle}
          </p>
        </div>

        {/* Concept Box */}
        <div className="bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl p-4 w-full flex flex-col gap-2">
          <p className="text-xs text-[#4A2E35] leading-relaxed font-medium">
            {mission.id === 1
              ? 'Un algoritmo es una serie de pasos ordenados que usamos para resolver un problema.'
              : mission.conceptDescription}
          </p>

          {/* Visual 5 -> 1 Structure for Mission 3 */}
          {mission.id === 3 && (
            <div className="my-1 bg-white p-2.5 rounded-xl border border-[#F4D5DD] flex flex-col items-center gap-1 text-xs">
              <span className="font-bold text-[#4A2E35]">5 instrucciones</span>
              <span className="text-[#E86F88] font-bold text-sm">↓↓↓↓↓</span>
              <span className="font-bold text-[#8DA875]">1 estructura repetitiva</span>
              <span className="text-lg">🔄</span>
            </div>
          )}

          <div className="mt-1 bg-white p-2 rounded-xl border border-[#F4D5DD] text-xs font-black text-[#E86F88]">
            🌸 {mission.conceptKey}
          </div>
        </div>

        {/* Next Mission Button */}
        <button
          onClick={onNextMission}
          className="w-full py-3.5 px-6 btn-pink-pill font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-md"
        >
          <span>
            {mission.id < 3 ? 'SIGUIENTE MISIÓN' : 'VER RESUMEN FINAL'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
