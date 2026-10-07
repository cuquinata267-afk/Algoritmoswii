import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { FloralCorners } from '../components/common/FloralAccents';
import { setLocalSessionCode, getLocalSessionCode } from '../lib/supabase';
import { ArrowRight, QrCode } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { code: urlCode } = useParams<{ code?: string }>();
  const [sessionCodeInput, setSessionCodeInput] = useState(
    urlCode || getLocalSessionCode() || 'BOLIVIA2026'
  );

  const handleStart = () => {
    if (sessionCodeInput.trim()) {
      setLocalSessionCode(sessionCodeInput.trim());
    }
    navigate('/intro');
  };

  return (
    <div className="min-h-screen bg-[#FAF0F4] flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Delicate Floral Corner Decorations */}
      <FloralCorners />

      {/* Main Content Card Container */}
      <main className="w-full max-w-md my-auto flex flex-col items-center text-center gap-6 z-10 py-3 sm:py-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1" aria-hidden="true">🌸</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A2E35] font-serif tracking-wider mb-2 leading-tight">
            ALGORITMIA
          </h1>
          <p className="text-sm sm:text-base font-bold text-[#E86F88] tracking-tight">
            Tu primera misión como programadora.
          </p>
        </div>

        {/* WARA Presentation & Speech Bubble */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Speech Bubble */}
          <div className="speech-bubble w-full p-4 sm:p-5 text-center shadow-xs">
            <p className="text-base sm:text-lg font-bold text-[#4A2E35] leading-relaxed">
              Hola, soy <span className="text-[#E86F88] font-black">WARA</span>.
              <br />
              Necesito que me enseñes a resolver problemas paso a paso. ♥
            </p>
          </div>

          {/* Large Cute Wara Character */}
          <div className="py-1 sm:py-2">
            <RobiCharacter state="IDLE" size={136} />
          </div>

          {/* Session code input */}
          <div className="w-full max-w-xs flex items-center justify-between bg-white/95 px-3.5 py-2.5 rounded-2xl border-2 border-[#F4D5DD] text-xs sm:text-sm shadow-xs">
            <span className="font-bold text-[#8C4A5A] flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#E86F88]" /> Sesión:
            </span>
            <input
              type="text"
              value={sessionCodeInput}
              onChange={(e) => setSessionCodeInput(e.target.value.toUpperCase())}
              className="bg-[#FAF0F4] border border-[#F4D5DD] px-2.5 py-1.5 rounded-xl font-mono font-black text-[#4A2E35] text-center uppercase tracking-wider w-32 text-xs sm:text-sm focus:ring-2 focus:ring-[#E86F88] outline-none min-h-[36px]"
            />
          </div>
        </div>

        {/* Big Pink Pill Button (COMENZAR ➔) */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full min-h-[56px] py-4 px-8 btn-pink-pill font-black text-lg sm:text-xl tracking-wider flex items-center justify-center gap-2.5 group shadow-lg active:scale-98"
        >
          <span>COMENZAR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center text-xs text-[#8C4A5A]/70 font-semibold py-2 z-10">
        Aprender programación haciendo 🌸 Día de la Mujer Boliviana
      </footer>
    </div>
  );
};
