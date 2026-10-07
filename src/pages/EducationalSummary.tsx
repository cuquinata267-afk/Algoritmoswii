import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { Sparkles, ArrowRight, Quote } from 'lucide-react';

export const EducationalSummary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col justify-between select-none">
      <Header />

      <main className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-6 my-auto">
        {/* Title Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-pastel-rose/40 text-xs sm:text-sm font-black text-pastel-vibrant shadow-xs mb-2">
            <Sparkles className="w-4 h-4" /> ¡Felicitaciones Programadora!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-pastel-berry font-serif tracking-tight leading-tight">
            MIRA LO QUE ACABAS DE HACER
          </h2>
        </div>

        {/* 3 Summary Cards */}
        <div className="flex flex-col gap-3.5">
          {/* Card 1: SECUENCIAS */}
          <div className="glass-card p-4 rounded-3xl border-l-4 border-pastel-vibrant shadow-xs flex items-center gap-3.5">
            <span className="text-3xl" aria-hidden="true">🌸</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-pastel-berry">SECUENCIAS</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
                Ordenaste instrucciones en el lugar exacto.
              </p>
            </div>
          </div>

          {/* Card 2: DECISIONES */}
          <div className="glass-card p-4 rounded-3xl border-l-4 border-amber-400 shadow-xs flex items-center gap-3.5">
            <span className="text-3xl" aria-hidden="true">💡</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-pastel-berry">DECISIONES</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
                Enseñaste a Wara a reaccionar ante obstáculos.
              </p>
            </div>
          </div>

          {/* Card 3: REPETICIONES */}
          <div className="glass-card p-4 rounded-3xl border-l-4 border-emerald-400 shadow-xs flex items-center gap-3.5">
            <span className="text-3xl" aria-hidden="true">🔄</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-pastel-berry">REPETICIONES</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-0.5">
                Encontraste una forma más eficiente de resolver un problema.
              </p>
            </div>
          </div>
        </div>

        {/* WHAT IS AN ALGORITHM DEFINITION BOX */}
        <div className="glass-panel p-5 rounded-3xl border-2 border-pastel-rose/40 flex flex-col items-center text-center gap-3.5 shadow-xs">
          <h3 className="text-lg sm:text-xl font-black text-pastel-berry font-serif">
            ¿Y QUÉ ES UN ALGORITMO?
          </h3>
          <p className="text-sm sm:text-base text-pastel-vibrant font-black bg-white/95 p-3.5 rounded-2xl border border-pastel-rose/30 shadow-xs leading-relaxed">
            "Una serie de pasos e instrucciones ordenadas que permite resolver un problema."
          </p>

          <div className="relative mt-1 p-4 bg-pastel-blush/60 rounded-2xl border border-pastel-rose/30 text-xs sm:text-sm font-serif italic text-pastel-berry">
            <Quote className="w-5 h-5 text-pastel-rose absolute top-2 left-2 opacity-40" />
            <p className="pl-4">
              "Programar no es aprender a hablarle a una computadora. Es aprender a convertir ideas en soluciones."
            </p>
          </div>
        </div>

        {/* Wara Celebrating */}
        <div className="flex justify-center">
          <RobiCharacter state="CELEBRATING" size={76} />
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => navigate('/women-in-tech')}
          className="w-full min-h-[56px] py-4 px-6 bg-gradient-to-r from-pastel-rose via-pastel-vibrant to-rose-600 text-white rounded-full font-black text-base sm:text-lg shadow-xl hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <span>CONTINUAR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <div className="h-6"></div>
    </div>
  );
};
