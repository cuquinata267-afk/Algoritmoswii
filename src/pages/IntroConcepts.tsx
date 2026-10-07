import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { FloralCorners } from '../components/common/FloralAccents';
import { ArrowRight, ListOrdered, GitFork, Repeat } from 'lucide-react';

export const IntroConcepts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF0F4] flex flex-col justify-between relative select-none">
      <FloralCorners />
      <Header />

      <main className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-6 my-auto z-10">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#4A2E35] font-serif mb-1">
            Antes de empezar...
          </h2>
          <p className="text-xs text-[#E86F88] font-bold tracking-tight">
            En programación usamos tres conceptos clave:
          </p>
        </div>

        {/* 3 Pastel Concept Cards (Matching Screen 3) */}
        <div className="flex flex-col gap-3.5">
          {/* Card 1: SECUENCIA */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-[#E86F88]">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#E86F88] uppercase tracking-wider">
                  SECUENCIA
                </h3>
                <p className="text-xs text-[#4A2E35] font-bold">
                  Paso a paso ordenado
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-[#E86F88]">➔ ➔ ➔</div>
          </div>

          {/* Card 2: DECISIÓN */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9C4] flex items-center justify-center text-[#F57F17]">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#F57F17] uppercase tracking-wider">
                  DECISIÓN
                </h3>
                <p className="text-xs text-[#4A2E35] font-bold">
                  Reaccionar según el caso
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-[#F57F17]">❓ ➔</div>
          </div>

          {/* Card 3: REPETICIÓN */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#43A047]">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-[#43A047] uppercase tracking-wider">
                  REPETICIÓN
                </h3>
                <p className="text-xs text-[#4A2E35] font-bold">
                  Repetir acciones fácil
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-[#43A047]">🔄</div>
          </div>
        </div>

        {/* Big Pink Pill Button */}
        <button
          onClick={() => navigate('/play?mission=1')}
          className="w-full py-4 px-6 btn-pink-pill font-black text-base shadow-md flex items-center justify-center gap-2 group mt-2"
        >
          <span>EMPEZAR MISIÓN 01</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <div className="h-6"></div>
    </div>
  );
};
