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
      <main className="w-full max-w-md my-auto flex flex-col items-center text-center gap-6 z-10 py-4">
        {/* Title & Subtitle */}
        <div className="flex flex-col items-center">
          <span className="text-2xl mb-1">🌸</span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#4A2E35] font-serif tracking-wider mb-2">
            ALGORITMIA
          </h1>
          <p className="text-sm font-semibold text-[#E86F88] tracking-tight">
            Tu primera misión como programadora.
          </p>
        </div>

        {/* ROBI Presentation & Speech Bubble (Matching Screen 1/2) */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* Speech Bubble */}
          <div className="speech-bubble w-full p-4 text-center">
            <p className="text-sm sm:text-base font-bold text-[#4A2E35] leading-relaxed">
              Hola, soy <span className="text-[#E86F88] font-black">ROBI</span>.
              <br />
              Necesito que me enseñes a resolver problemas paso a paso. ♥
            </p>
          </div>

          {/* Large Cute ROBI Character */}
          <div className="py-2">
            <RobiCharacter state="IDLE" size={130} />
          </div>

          {/* Session code input */}
          <div className="w-full max-w-xs flex items-center justify-between bg-white/90 px-3 py-2 rounded-2xl border border-[#F4D5DD] text-xs shadow-xs">
            <span className="font-semibold text-[#8C4A5A] flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-[#E86F88]" /> Sesión:
            </span>
            <input
              type="text"
              value={sessionCodeInput}
              onChange={(e) => setSessionCodeInput(e.target.value.toUpperCase())}
              className="bg-[#FAF0F4] border border-[#F4D5DD] px-2 py-1 rounded-xl font-mono font-bold text-[#4A2E35] text-center uppercase tracking-wider w-28 text-xs focus:ring-2 focus:ring-[#E86F88] outline-none"
            />
          </div>
        </div>

        {/* Big Pink Pill Button (COMENZAR ➔) */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-8 btn-pink-pill font-black text-lg tracking-wider flex items-center justify-center gap-2 group shadow-lg"
        >
          <span>COMENZAR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center text-[11px] text-[#8C4A5A]/60 font-medium py-2 z-10">
        Aprender programación haciendo 🌸 Día de la Mujer Boliviana
      </footer>
    </div>
  );
};
