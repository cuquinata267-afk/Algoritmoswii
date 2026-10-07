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
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-pastel-rose/40 text-xs font-bold text-pastel-vibrant shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" /> ¡Felicitaciones Programadora!
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-pastel-berry font-serif tracking-tight">
            MIRA LO QUE ACABAS DE HACER
          </h2>
        </div>

        {/* 3 Summary Cards */}
        <div className="flex flex-col gap-3">
          {/* Card 1: SECUENCIAS */}
          <div className="glass-card p-4 rounded-2xl border-l-4 border-pastel-vibrant shadow-sm flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <div>
              <h3 className="font-extrabold text-sm text-pastel-berry">SECUENCIAS</h3>
              <p className="text-xs text-slate-600 font-medium">
                Ordenaste instrucciones en el lugar exacto.
              </p>
            </div>
          </div>

          {/* Card 2: DECISIONES */}
          <div className="glass-card p-4 rounded-2xl border-l-4 border-amber-400 shadow-sm flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <div>
              <h3 className="font-extrabold text-sm text-pastel-berry">DECISIONES</h3>
              <p className="text-xs text-slate-600 font-medium">
                Enseñaste a un programa a reaccionar ante obstáculos.
              </p>
            </div>
          </div>

          {/* Card 3: REPETICIONES */}
          <div className="glass-card p-4 rounded-2xl border-l-4 border-emerald-400 shadow-sm flex items-center gap-3">
            <span className="text-3xl">🌸</span>
            <div>
              <h3 className="font-extrabold text-sm text-pastel-berry">REPETICIONES</h3>
              <p className="text-xs text-slate-600 font-medium">
                Encontraste una forma más eficiente de resolver un problema.
              </p>
            </div>
          </div>
        </div>

        {/* WHAT IS AN ALGORITHM DEFINITION BOX */}
        <div className="glass-panel p-5 rounded-3xl border-2 border-pastel-rose/40 flex flex-col items-center text-center gap-3">
          <h3 className="text-lg font-black text-pastel-berry font-serif">
            ¿Y QUÉ ES UN ALGORITMO?
          </h3>
          <p className="text-sm text-pastel-vibrant font-bold bg-white/90 p-3 rounded-2xl border border-pastel-rose/30 shadow-xs">
            "Una serie de pasos e instrucciones ordenadas que permite resolver un problema."
          </p>

          <div className="relative mt-2 p-4 bg-pastel-blush/60 rounded-2xl border border-pastel-rose/30 text-xs sm:text-sm font-serif italic text-pastel-berry">
            <Quote className="w-5 h-5 text-pastel-rose absolute top-2 left-2 opacity-40" />
            <p className="pl-4">
              "Programar no es aprender a hablarle a una computadora. Es aprender a convertir ideas en soluciones."
            </p>
          </div>
        </div>

        {/* ROBI Celebrating */}
        <div className="flex justify-center">
          <RobiCharacter state="CELEBRATING" size={70} />
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate('/women-in-tech')}
          className="w-full py-4 px-6 bg-gradient-to-r from-pastel-rose via-pastel-vibrant to-rose-600 text-white rounded-2xl font-black text-base shadow-xl hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <span>CONTINUAR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>

      <div className="h-6"></div>
    </div>
  );
};
