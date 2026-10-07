import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Sparkles, Home } from 'lucide-react';

interface HeaderProps {
  currentMission?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentMission }) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#F4D5DD] py-2.5 px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs select-none">
      {/* Brand title */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl group-hover:rotate-12 transition-transform" aria-hidden="true">🌸</span>
        <div>
          <h1 className="font-black text-lg sm:text-xl tracking-wider text-pastel-berry font-serif leading-none">
            ALGORITMIA
          </h1>
          <p className="text-[11px] sm:text-xs text-[#E86F88] font-bold tracking-tight">
            Día de la Mujer Boliviana
          </p>
        </div>
      </Link>

      {/* Center Mission Pill */}
      {currentMission && (
        <div className="flex items-center gap-1.5 bg-[#FAF0F4] px-3 py-1 rounded-full border border-[#F4D5DD] text-xs sm:text-sm font-black text-[#8C4A5A] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E86F88]" />
          <span>Misión 0{currentMission}</span>
        </div>
      )}

      {/* Navigation actions with >= 40px touch area */}
      <div className="flex items-center gap-2">
        <Link
          to="/help"
          className="min-w-[40px] min-h-[40px] px-2.5 rounded-xl bg-[#FAF0F4] hover:bg-[#FCE4EC] border border-[#F4D5DD] text-[#8C4A5A] transition-colors flex items-center justify-center gap-1 text-xs sm:text-sm font-bold"
          title="Ayuda de cómo jugar"
        >
          <HelpCircle className="w-4 h-4 text-[#E86F88]" />
          <span className="hidden sm:inline">Ayuda</span>
        </Link>
        <Link
          to="/"
          className="min-w-[40px] min-h-[40px] p-2 rounded-xl bg-[#FAF0F4] hover:bg-[#FCE4EC] border border-[#F4D5DD] text-[#8C4A5A] transition-colors flex items-center justify-center"
          title="Ir al inicio"
        >
          <Home className="w-4 h-4 text-[#8C4A5A]" />
        </Link>
      </div>
    </header>
  );
};
