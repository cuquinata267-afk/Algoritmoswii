import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { ArrowLeft, ArrowUp, RotateCcw, RotateCw, Play, Layers } from 'lucide-react';

export const HelpScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col justify-between">
      <Header />

      <main className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-5 my-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white border border-pastel-rose/40 text-pastel-berry hover:bg-pastel-blush transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-pastel-berry font-serif">
              ¿Cómo jugar en ALGORITMIA?
            </h2>
            <p className="text-xs text-pastel-vibrant font-semibold">
              Guía rápida para enseñarle a WARA
            </p>
          </div>
        </div>

        {/* Instructions list */}
        <div className="flex flex-col gap-3 text-xs sm:text-sm">
          {/* Item 1 */}
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 border-l-4 border-pastel-vibrant">
            <ArrowUp className="w-5 h-5 text-pastel-vibrant flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-pastel-berry">1. ↑ AVANZAR</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Hace que WARA camine una casilla en la dirección donde está mirando.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 border-l-4 border-purple-400">
            <div className="flex gap-1 text-purple-600 flex-shrink-0 mt-0.5">
              <RotateCcw className="w-4 h-4" />
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-pastel-berry">2. ↶ GIRAR</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Hace que WARA gire 90 grados a la izquierda o a la derecha sin avanzar.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 border-l-4 border-amber-400">
            <Layers className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-pastel-berry">3. BOTONES O BLOQUES</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Puedes alternar entre presionar botones o arrastrar bloques visuales. ¡Ambos métodos producen el mismo algoritmo!
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3 border-l-4 border-emerald-400">
            <Play className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-pastel-berry">4. EJECUTAR</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Presiona el botón grande para poner a prueba tu algoritmo y ver a WARA avanzar hacia la estrella.
              </p>
            </div>
          </div>
        </div>

        {/* ROBI Card */}
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
          <p className="text-xs font-bold text-pastel-berry leading-relaxed">
            Si cometes un error, ¡no te preocupes! Ajusta el orden y prueba de nuevo.
          </p>
          <RobiCharacter state="IDLE" size={50} />
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-3.5 px-6 bg-pastel-vibrant text-white rounded-2xl font-black text-sm shadow-md hover:opacity-95"
        >
          Volver a la Misión
        </button>
      </main>

      <div className="h-4"></div>
    </div>
  );
};
