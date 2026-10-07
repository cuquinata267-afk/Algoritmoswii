import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { ArrowLeft, ArrowUp, RotateCcw, RotateCw, Play, Layers } from 'lucide-react';

export const HelpScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col justify-between select-none">
      <Header />

      <main className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-5 my-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-2xl bg-white border-2 border-pastel-rose/40 text-pastel-berry hover:bg-pastel-blush transition-colors flex items-center justify-center shadow-xs"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-pastel-berry font-serif leading-tight">
              ¿Cómo jugar en ALGORITMIA?
            </h2>
            <p className="text-sm text-pastel-vibrant font-bold">
              Guía rápida para enseñarle a Wara
            </p>
          </div>
        </div>

        {/* Instructions list with high legibility */}
        <div className="flex flex-col gap-3.5">
          {/* Item 1 */}
          <div className="glass-card p-4 rounded-3xl flex items-start gap-3.5 border-l-4 border-pastel-vibrant shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-pink-100 flex items-center justify-center text-pastel-vibrant flex-shrink-0 mt-0.5">
              <ArrowUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-pastel-berry">1. ↑ AVANZAR</h3>
              <p className="text-slate-700 text-sm font-medium mt-1 leading-relaxed">
                Hace que Wara camine exactamente una casilla hacia donde está mirando.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="glass-card p-4 rounded-3xl flex items-start gap-3.5 border-l-4 border-purple-400 shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
              <RotateCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-pastel-berry">2. ↶ GIRAR</h3>
              <p className="text-slate-700 text-sm font-medium mt-1 leading-relaxed">
                Hace que Wara gire hacia la izquierda o a la derecha sin cambiar de casilla.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="glass-card p-4 rounded-3xl flex items-start gap-3.5 border-l-4 border-amber-400 shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-pastel-berry">3. BOTONES O BLOQUES</h3>
              <p className="text-slate-700 text-sm font-medium mt-1 leading-relaxed">
                Puedes alternar entre pulsar botones o usar bloques de código. ¡Ambos modos construyen tu algoritmo!
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="glass-card p-4 rounded-3xl flex items-start gap-3.5 border-l-4 border-emerald-400 shadow-xs">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-base text-pastel-berry">4. EJECUTAR</h3>
              <p className="text-slate-700 text-sm font-medium mt-1 leading-relaxed">
                Pulsa el botón grande para poner a prueba tu algoritmo y ver a Wara avanzar paso a paso hacia la estrella.
              </p>
            </div>
          </div>
        </div>

        {/* Wara Encouragement Card */}
        <div className="glass-panel p-4 rounded-3xl border-2 border-[#F4D5DD] flex items-center justify-between gap-3 shadow-xs">
          <p className="text-sm font-bold text-pastel-berry leading-relaxed">
            Si cometes un error, ¡no pasa nada! Ajusta el orden de tus pasos y prueba de nuevo.
          </p>
          <RobiCharacter state="IDLE" size={54} />
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full min-h-[52px] py-4 px-6 btn-pink-pill text-white font-black text-base shadow-md active:scale-98 transition-all"
        >
          Volver a la Misión
        </button>
      </main>

      <div className="h-4"></div>
    </div>
  );
};
