import React from 'react';

export const FloralCorners: React.FC = () => {
  return (
    <>
      {/* Top Left Vine */}
      <svg
        className="floral-corner-tl w-24 h-24 sm:w-32 sm:h-32 opacity-85"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0 C 30 10, 50 40, 20 80" stroke="#8DA875" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0 0 C 50 20, 80 15, 90 0" stroke="#A3C9A8" strokeWidth="2" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M15 12 Q 25 10 22 22 Q 12 18 15 12 Z" fill="#8DA875" />
        <path d="M32 30 Q 42 32 35 44 Q 25 38 32 30 Z" fill="#A3C9A8" />
        <path d="M12 55 Q 22 60 10 70 Q 5 60 12 55 Z" fill="#8DA875" />
        {/* Flowers */}
        <circle cx="20" cy="80" r="6" fill="#F48FB1" />
        <circle cx="20" cy="80" r="2.5" fill="#FFFDF9" />
        <circle cx="45" cy="18" r="5" fill="#E86F88" />
        <circle cx="45" cy="18" r="2" fill="#FFFDF9" />
        <circle cx="70" cy="8" r="5.5" fill="#F8BBD0" />
        <circle cx="70" cy="8" r="2" fill="#E86F88" />
      </svg>

      {/* Top Right Vine */}
      <svg
        className="floral-corner-tr w-24 h-24 sm:w-32 sm:h-32 opacity-85"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 0 C 70 10, 50 40, 80 80" stroke="#8DA875" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 0 C 50 20, 20 15, 10 0" stroke="#A3C9A8" strokeWidth="2" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M85 12 Q 75 10 78 22 Q 88 18 85 12 Z" fill="#8DA875" />
        <path d="M68 30 Q 58 32 65 44 Q 75 38 68 30 Z" fill="#A3C9A8" />
        {/* Flowers */}
        <circle cx="80" cy="80" r="6" fill="#F48FB1" />
        <circle cx="80" cy="80" r="2.5" fill="#FFFDF9" />
        <circle cx="55" cy="18" r="5" fill="#E86F88" />
        <circle cx="55" cy="18" r="2" fill="#FFFDF9" />
        <circle cx="30" cy="8" r="5.5" fill="#F8BBD0" />
        <circle cx="30" cy="8" r="2" fill="#E86F88" />
      </svg>

      {/* Bottom Left Vine */}
      <svg
        className="floral-corner-bl w-24 h-24 sm:w-28 sm:h-28 opacity-80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 100 C 25 80, 45 60, 15 20" stroke="#8DA875" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15" cy="20" r="5" fill="#F48FB1" />
        <circle cx="15" cy="20" r="2" fill="#FFFDF9" />
        <circle cx="35" cy="70" r="4.5" fill="#F8BBD0" />
      </svg>

      {/* Bottom Right Vine */}
      <svg
        className="floral-corner-br w-24 h-24 sm:w-28 sm:h-28 opacity-80"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M100 100 C 75 80, 55 60, 85 20" stroke="#8DA875" strokeWidth="2" strokeLinecap="round" />
        <circle cx="85" cy="20" r="5" fill="#F48FB1" />
        <circle cx="85" cy="20" r="2" fill="#FFFDF9" />
        <circle cx="65" cy="70" r="4.5" fill="#F8BBD0" />
      </svg>
    </>
  );
};
