import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Sparkles, Home } from 'lucide-react';

interface HeaderProps {
  currentMission?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentMission }) => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-pastel-blush py-3 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand title */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl group-hover:rotate-12 transition-transform">🌸</span>
        <div>
          <h1 className="font-black text-lg sm:text-xl tracking-wider text-pastel-berry font-serif leading-none">
            ALGORITMIA
          </h1>
          <p className="text-[10px] text-pastel-vibrant font-medium tracking-tight">
            Día de la Mujer Boliviana
          </p>
        </div>
      </Link>

      {/* Center Mission Pill */}
      {currentMission && (
        <div className="flex items-center gap-1.5 bg-pastel-blush/80 px-3 py-1 rounded-full border border-pastel-rose/40 text-xs font-bold text-pastel-berry shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pastel-vibrant" />
          <span>Misión 0{currentMission}</span>
        </div>
      )}

      {/* Navigation actions */}
      <div className="flex items-center gap-2">
        <Link
          to="/help"
          className="p-2 rounded-xl bg-pastel-pink hover:bg-pastel-blush text-pastel-berry transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Ayuda"
        >
          <HelpCircle className="w-4 h-4 text-pastel-vibrant" />
          <span className="hidden sm:inline">Ayuda</span>
        </Link>
        <Link
          to="/"
          className="p-2 rounded-xl bg-pastel-pink hover:bg-pastel-blush text-pastel-berry transition-colors"
          title="Inicio"
        >
          <Home className="w-4 h-4 text-pastel-berry" />
        </Link>
      </div>
    </header>
  );
};
