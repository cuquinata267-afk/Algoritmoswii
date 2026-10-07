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
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E35] font-serif mb-1 leading-tight">
            Antes de empezar...
          </h2>
          <p className="text-sm sm:text-base text-[#E86F88] font-bold tracking-tight">
            En programación usamos tres conceptos clave:
          </p>
        </div>

        {/* 3 Pastel Concept Cards */}
        <div className="flex flex-col gap-3.5">
          {/* Card 1: SECUENCIA */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FCE4EC] flex items-center justify-center text-[#E86F88] flex-shrink-0">
                <ListOrdered className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-[#E86F88] uppercase tracking-wider">
                  SECUENCIA
                </h3>
                <p className="text-xs sm:text-sm text-[#4A2E35] font-bold">
                  Paso a paso ordenado
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-[#E86F88]">➔ ➔ ➔</div>
          </div>

          {/* Card 2: DECISIÓN */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF9C4] flex items-center justify-center text-[#F57F17] flex-shrink-0">
                <GitFork className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-[#F57F17] uppercase tracking-wider">
                  DECISIÓN
                </h3>
                <p className="text-xs sm:text-sm text-[#4A2E35] font-bold">
                  Reaccionar según el caso
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-[#F57F17]">❓ ➔</div>
          </div>

          {/* Card 3: REPETICIÓN */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#43A047] flex-shrink-0">
                <Repeat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base text-[#43A047] uppercase tracking-wider">
                  REPETICIÓN
                </h3>
                <p className="text-xs sm:text-sm text-[#4A2E35] font-bold">
                  Repetir acciones fácil
                </p>
              </div>
            </div>
            <div className="text-xl font-bold text-[#43A047]">🔄</div>
          </div>
        </div>

        {/* Big Pink Pill Button */}
        <button
          type="button"
          onClick={() => navigate('/play?mission=1')}
          className="w-full min-h-[56px] py-4 px-6 btn-pink-pill font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 group mt-2 active:scale-98"
        >
          <span>EMPEZAR MISIÓN 01</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <div className="h-6"></div>
    </div>
  );
};
