import React from 'react';
import { RobiState, Direction } from '../../types';

interface RobiCharacterProps {
  state?: RobiState;
  direction?: Direction;
  className?: string;
  size?: number; // size in px
  showBadge?: boolean;
}

export const RobiCharacter: React.FC<RobiCharacterProps> = ({
  state = 'IDLE',
  direction = 'UP',
  className = '',
  size = 72,
  showBadge = false,
}) => {
  // Animation based on state
  const animationClass = {
    IDLE: 'animate-float',
    WALKING: 'animate-bounce-gentle',
    THINKING: 'animate-pulse-subtle',
    ERROR: 'animate-wiggle',
    SUCCESS: 'animate-bounce',
    CELEBRATING: 'animate-bounce',
  }[state];

  // Horizontal flip if facing left
  const flipHorizontal = direction === 'LEFT' ? 'scale-x-[-1]' : 'scale-x-1';

  // Eye glance offset according to orientation
  const eyeOffset = {
    UP: { x: 0, y: -2.5 },
    DOWN: { x: 0, y: 2.5 },
    LEFT: { x: -2.5, y: 0 },
    RIGHT: { x: 2.5, y: 0 },
  }[direction];

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-all duration-300 ${animationClass} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div className={`transition-transform duration-300 ${flipHorizontal}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          {/* Soft Ground Shadow */}
          <ellipse cx="60" cy="106" rx="28" ry="6" fill="#F48FB1" opacity="0.3" />

          {/* ROBI Pink Feet */}
          <rect x="40" y="90" width="16" height="12" rx="6" fill="#E86F88" />
          <rect x="64" y="90" width="16" height="12" rx="6" fill="#E86F88" />

          {/* ROBI Main Body (Cute White Rounded Torso) */}
          <rect x="32" y="44" width="56" height="48" rx="24" fill="#FFFFFF" stroke="#F4D5DD" strokeWidth="2.5" />
          <rect x="34" y="46" width="52" height="44" rx="22" fill="url(#robi-body-light)" />

          {/* Chest Flower Emblem (5-Petal Pink Blossom) */}
          <g transform="translate(60, 72)">
            <circle cx="0" cy="-4" r="3.5" fill="#F48FB1" />
            <circle cx="3.8" cy="-1.2" r="3.5" fill="#F48FB1" />
            <circle cx="2.3" cy="3.2" r="3.5" fill="#F48FB1" />
            <circle cx="-2.3" cy="3.2" r="3.5" fill="#F48FB1" />
            <circle cx="-3.8" cy="-1.2" r="3.5" fill="#F48FB1" />
            <circle cx="0" cy="0" r="2.5" fill="#FFFDF9" />
          </g>

          {/* Head/Helmet Outer Capsule */}
          <rect x="22" y="16" width="76" height="54" rx="27" fill="#FFFFFF" stroke="#F4D5DD" strokeWidth="3" />

          {/* Pink Headphone Ear Cups (Sides) */}
          <rect x="14" y="28" width="12" height="28" rx="6" fill="#E86F88" />
          <rect x="94" y="28" width="12" height="28" rx="6" fill="#E86F88" />
          {/* Flower detail on left headphone cup */}
          <circle cx="20" cy="42" r="4" fill="#FCE4EC" />
          <circle cx="20" cy="42" r="2" fill="#E86F88" />

          {/* Top Antenna */}
          <path d="M60 16 L60 6" stroke="#E86F88" strokeWidth="3" strokeLinecap="round" />
          <circle
            cx="60"
            cy="5"
            r="5"
            fill={state === 'ERROR' ? '#FF5252' : state === 'THINKING' ? '#FFD166' : '#E86F88'}
          />

          {/* Dark Visor Face Screen */}
          <rect x="30" y="22" width="60" height="38" rx="19" fill="#362228" stroke="#FCE4EC" strokeWidth="1.5" />

          {/* EYES según el estado de ROBI */}
          {state === 'ERROR' ? (
            /* Dizzy Sad Eyes ( > < ) */
            <g stroke="#F8BBD0" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M42 36 L50 42 L42 48" />
              <path d="M78 36 L70 42 L78 48" />
            </g>
          ) : state === 'SUCCESS' || state === 'CELEBRATING' ? (
            /* Happy Arc Eyes ( ^ ^ ) */
            <g stroke="#FFFDF9" strokeWidth="3.5" strokeLinecap="round" fill="none">
              <path d="M42 43 Q48 33 54 43" />
              <path d="M66 43 Q72 33 78 43" />
            </g>
          ) : state === 'THINKING' ? (
            /* Thinking Eyes ( · · ) */
            <g fill="#FFD166">
              <circle cx="46" cy="40" r="4" />
              <circle cx="74" cy="40" r="4" />
            </g>
          ) : (
            /* Normal Cute Glowing Eyes with orientation glance */
            <g fill="#FFFDF9">
              <ellipse cx={46 + eyeOffset.x} cy={40 + eyeOffset.y} rx="4.5" ry="6" />
              <ellipse cx={74 + eyeOffset.x} cy={40 + eyeOffset.y} rx="4.5" ry="6" />
              {/* Pupil Highlights */}
              <circle cx={47.5 + eyeOffset.x} cy={38 + eyeOffset.y} r="1.8" fill="#362228" />
              <circle cx={75.5 + eyeOffset.x} cy={38 + eyeOffset.y} r="1.8" fill="#362228" />
            </g>
          )}

          {/* Cheeks Blush */}
          <circle cx="38" cy="47" r="4.5" fill="#F48FB1" opacity="0.65" />
          <circle cx="82" cy="47" r="4.5" fill="#F48FB1" opacity="0.65" />

          {/* Garland around head on CELEBRATING */}
          {state === 'CELEBRATING' && (
            <g transform="translate(60, 14)">
              <circle cx="-25" cy="0" r="4" fill="#F48FB1" />
              <circle cx="-12" cy="-4" r="4" fill="#FFFDF9" />
              <circle cx="0" cy="-6" r="4.5" fill="#E86F88" />
              <circle cx="12" cy="-4" r="4" fill="#FFFDF9" />
              <circle cx="25" cy="0" r="4" fill="#F48FB1" />
            </g>
          )}

          {/* Gradients */}
          <defs>
            <linearGradient id="robi-body-light" x1="34" y1="46" x2="86" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFDF9" />
              <stop offset="1" stopColor="#FCE4EC" opacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Direction Pointer Arrow Badge on WARA's base (if requested) */}
      {showBadge && (
        <div
          className="absolute -bottom-1 right-0 bg-[#E86F88] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md border-2 border-white pointer-events-none"
          title={`Wara mirando hacia ${direction}`}
        >
          {direction === 'UP' && '↑'}
          {direction === 'RIGHT' && '→'}
          {direction === 'DOWN' && '↓'}
          {direction === 'LEFT' && '←'}
        </div>
      )}
    </div>
  );
};
