import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { Heart, Sparkles, Award } from 'lucide-react';

export const WomenInTech: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col justify-between select-none">
      <Header />

      <main className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col gap-5 my-auto text-center">
        {/* Title Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-pastel-blush px-3.5 py-1.5 rounded-full border border-pastel-rose/40 text-xs sm:text-sm font-black text-pastel-vibrant shadow-xs mb-2">
            <Heart className="w-4 h-4 fill-current" /> Día de la Mujer Boliviana
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-pastel-berry font-serif leading-tight">
            LA TECNOLOGÍA LA CONSTRUYEN PERSONAS
          </h2>
        </div>

        {/* Wara Reflection Box */}
        <div className="glass-panel p-5 rounded-3xl border-2 border-pastel-rose/40 flex flex-col items-center gap-3.5 shadow-xs">
          <RobiCharacter state="THINKING" size={76} />
          <p className="text-sm sm:text-base font-black text-pastel-berry">
            "WARA solo hizo lo que alguien decidió enseñarle."
          </p>
          <div className="bg-white/95 p-3.5 rounded-2xl border border-pastel-rose/30 text-xs sm:text-sm font-black text-pastel-vibrant leading-snug">
            Entonces... ¿quién decide cómo funciona la tecnología?
          </div>
        </div>

        {/* Pioneer Women Grid */}
        <div className="flex flex-col gap-3 text-left">
          <h3 className="text-xs sm:text-sm font-black text-pastel-berry/80 uppercase tracking-wider text-center">
            Pioneras que transformaron el mundo:
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Ada Lovelace */}
            <div className="bg-white p-3.5 rounded-2xl border border-pastel-rose/30 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-pastel-vibrant">
                <Sparkles className="w-3.5 h-3.5" /> Ada Lovelace
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-snug">
                La primera programadora de la historia (1843).
              </p>
            </div>

            {/* Grace Hopper */}
            <div className="bg-white p-3.5 rounded-2xl border border-pastel-rose/30 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-pastel-vibrant">
                <Sparkles className="w-3.5 h-3.5" /> Grace Hopper
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-snug">
                Pionera de los lenguajes de programación modernos.
              </p>
            </div>

            {/* Katherine Johnson */}
            <div className="bg-white p-3.5 rounded-2xl border border-pastel-rose/30 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-pastel-vibrant">
                <Sparkles className="w-3.5 h-3.5" /> Katherine Johnson
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-snug">
                Matemática que calculó las trayectorias de la NASA.
              </p>
            </div>

            {/* Margaret Hamilton */}
            <div className="bg-white p-3.5 rounded-2xl border border-pastel-rose/30 shadow-xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-pastel-vibrant">
                <Sparkles className="w-3.5 h-3.5" /> Margaret Hamilton
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-snug">
                Directora del código del software Apollo 11.
              </p>
            </div>
          </div>
        </div>

        {/* Inspiring Final Call to Action */}
        <div className="bg-gradient-to-r from-pastel-vibrant to-rose-600 p-4.5 rounded-3xl text-white shadow-lg flex items-center gap-3">
          <Award className="w-8 h-8 flex-shrink-0 text-amber-200" />
          <p className="text-xs sm:text-sm font-bold text-left leading-snug">
            Hoy tú diste tu primer paso. ¡Tú también puedes ser una creadora de tecnología!
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full min-h-[52px] py-3.5 px-6 bg-white hover:bg-pastel-pink text-pastel-berry border-2 border-pastel-rose/50 rounded-full font-black text-sm sm:text-base transition-all active:scale-98 shadow-xs"
        >
          Volver a la portada
        </button>
      </main>

      <div className="h-4"></div>
    </div>
  );
};
