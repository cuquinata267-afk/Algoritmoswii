import React from 'react';
import { Direction } from '../../types';
import { Compass, Navigation } from 'lucide-react';

export type SupportedOrientation = Direction | 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

interface RobotDirectionIndicatorProps {
  direction: SupportedOrientation;
  className?: string;
  showHelpText?: boolean;
}

interface OrientationInfo {
  arrow: string;
  label: string;
  angle: number; // 0 = UP/NORTH, 90 = RIGHT/EAST, 180 = DOWN/SOUTH, 270 = LEFT/WEST
  ariaLabel: string;
}

const ORIENTATION_DATA: Record<SupportedOrientation, OrientationInfo> = {
  UP: { arrow: '↑', label: 'ARRIBA', angle: 0, ariaLabel: 'Wara mira hacia arriba' },
  NORTH: { arrow: '↑', label: 'ARRIBA', angle: 0, ariaLabel: 'Wara mira hacia arriba' },
  RIGHT: { arrow: '→', label: 'DERECHA', angle: 90, ariaLabel: 'Wara mira hacia la derecha' },
  EAST: { arrow: '→', label: 'DERECHA', angle: 90, ariaLabel: 'Wara mira hacia la derecha' },
  DOWN: { arrow: '↓', label: 'ABAJO', angle: 180, ariaLabel: 'Wara mira hacia abajo' },
  SOUTH: { arrow: '↓', label: 'ABAJO', angle: 180, ariaLabel: 'Wara mira hacia abajo' },
  LEFT: { arrow: '←', label: 'IZQUIERDA', angle: 270, ariaLabel: 'Wara mira hacia la izquierda' },
  WEST: { arrow: '←', label: 'IZQUIERDA', angle: 270, ariaLabel: 'Wara mira hacia la izquierda' },
};

/**
 * Componente reutilizable RobotDirectionIndicator
 * Derivado estrictamente del estado lógico de orientación del juego.
 * Muestra de forma inmediata e inequívoca la dirección de Wara.
 */
export const RobotDirectionIndicator: React.FC<RobotDirectionIndicatorProps> = ({
  direction,
  className = '',
  showHelpText = true,
}) => {
  const info = ORIENTATION_DATA[direction] || ORIENTATION_DATA.UP;

  return (
    <div
      role="status"
      aria-label={info.ariaLabel}
      className={`w-full max-w-sm sm:max-w-md mx-auto bg-white/95 rounded-2xl border-2 border-[#F4D5DD] p-2.5 sm:p-3 shadow-xs transition-all duration-300 flex flex-col gap-1.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Dynamic Direction Badge */}
        <div className="flex items-center gap-2">
          {/* Rotating Compass Icon Pill */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF0F4] border-2 border-[#E86F88] flex items-center justify-center text-[#E86F88] shadow-xs flex-shrink-0 transition-transform duration-300">
            <Navigation
              className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300"
              style={{ transform: `rotate(${info.angle}deg)` }}
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-[#8C4A5A]">
              Wara mira hacia:
            </span>
            <span className="bg-[#E86F88] text-white px-2.5 py-1 rounded-full font-black text-xs sm:text-sm shadow-xs tracking-wider inline-flex items-center gap-1 transition-all">
              <span className="text-sm sm:text-base font-black leading-none">{info.arrow}</span>
              <span>{info.label}</span>
            </span>
          </div>
        </div>

        {/* Small compass indicator for visual grounding */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#8C4A5A]/70">
          <Compass className="w-3.5 h-3.5 text-[#E86F88]" />
          <span>Brújula</span>
        </div>
      </div>

      {/* Brief explicit direction hint */}
      {showHelpText && (
        <div className="flex items-center gap-1.5 pt-1 border-t border-[#F4D5DD]/60 text-xs sm:text-sm font-semibold text-[#8C4A5A]">
          <span className="text-[#E86F88] font-bold">💡</span>
          <span className="italic">Wara avanza hacia donde está mirando.</span>
        </div>
      )}
    </div>
  );
};
