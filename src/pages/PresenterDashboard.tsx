import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AggregatedSessionStats,
  fetchSessionStats,
  getSessions,
  subscribeToSessionRealtime,
} from '../services/adminService';
import { getLocalSessionCode } from '../lib/supabase';
import { RobiCharacter } from '../components/robi/RobiCharacter';
import { FloralCorners } from '../components/common/FloralAccents';
import {
  Users,
  CheckCircle2,
  Rocket,
  Heart,
  AlertCircle,
  PieChart,
  ArrowLeft,
  Maximize,
  Sparkles,
} from 'lucide-react';

export const PresenterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const sessionCode = getLocalSessionCode();

  const [stats, setStats] = useState<AggregatedSessionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const sessions = await getSessions();
      const current = sessions.find((s) => s.code === sessionCode) || sessions[0];
      if (current) {
        const data = await fetchSessionStats(current.id, current);
        setStats(data);
      }
    } catch (err) {
      console.warn('Error loading presenter stats:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionCode]);

  useEffect(() => {
    loadData();

    // Auto-refresco cada 15s para actualizar ventana de 60s
    const timer = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(timer);
  }, [loadData]);

  useEffect(() => {
    if (stats?.session.id) {
      const unsub = subscribeToSessionRealtime(stats.session.id, () => {
        loadData();
      });
      return () => unsub();
    }
  }, [stats?.session.id, loadData]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#FAF0F4] flex flex-col items-center justify-center p-6 text-center select-none">
        <RobiCharacter state="THINKING" size={96} />
        <h2 className="text-xl font-black font-serif text-[#4A2E35] mt-4">
          Conectando a ALGORITMIA EN VIVO...
        </h2>
        <p className="text-xs text-[#8C4A5A] font-bold mt-1 animate-pulse">
          Sincronizando sesión en tiempo real 🌸
        </p>
      </div>
    );
  }

  const {
    totalParticipants,
    connectedNow,
    missions,
    overallProgressPct,
    interactionMethods,
    commonErrorsOverall,
    recentActivity,
  } = stats;

  const m1 = missions[1];
  const m2 = missions[2];
  const m3 = missions[3];

  // Frase pedagógica destacada dinámica
  let highlightedQuote = '"Programar también es una forma de crear un mundo más bonito."';
  if (m1.completionRate >= 50 && m2.completionRate < 40) {
    highlightedQuote = `¡El ${m1.completionRate}% de las estudiantes ya descubrió cómo funcionan las secuencias! 🌸`;
  } else if (m2.completionRate >= 40 && m3.completionRate < 30) {
    highlightedQuote = `¡El ${m2.completionRate}% ya le enseñó a ROBI a tomar decisiones con condicionales! 💡`;
  } else if (m3.completionRate >= 30) {
    highlightedQuote = `¡El ${m3.completionRate}% ya domina los bucles y la repetición automática! 🔄`;
  }

  const isEmpty = totalParticipants === 0;

  return (
    <div className="min-h-screen bg-[#FAF0F4] text-[#4A2E35] p-6 sm:p-8 md:p-10 flex flex-col justify-between relative select-none">
      <FloralCorners />

      {/* Header Banner - Limpio y Enorme para proyección */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs z-10">
        <div className="flex items-center gap-3.5">
          <span className="text-3xl sm:text-4xl">🌸</span>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tracking-wider text-[#4A2E35]">
              ALGORITMIA EN VIVO
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#E86F88] mt-0.5">
              Día de la Mujer Boliviana • Aprendizaje en tiempo real
            </p>
          </div>
        </div>

        {/* Controles de Proyección & Código de Sesión */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-[#FAF0F4] px-4 py-2 rounded-2xl border border-[#F4D5DD] text-xs sm:text-sm font-bold text-[#4A2E35] flex items-center gap-2">
            <span>
              Sesión: <span className="font-mono text-[#E86F88] font-black">{stats.session.code}</span>
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-[#FAF0F4] hover:bg-pink-100 rounded-2xl border border-[#F4D5DD] text-[#8C4A5A] transition-all"
            title="Pantalla Completa"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-2 bg-white hover:bg-pink-50 rounded-2xl border border-[#F4D5DD] text-xs font-bold text-[#8C4A5A] flex items-center gap-1.5 transition-all shadow-xs"
            title="Volver al Panel de Administración"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel Admin</span>
          </button>
        </div>
      </header>

      {/* ESTADO VACÍO SI AÚN NO HAY CONEXIONES */}
      {isEmpty ? (
        <div className="my-auto py-12 flex flex-col items-center justify-center text-center gap-4 bg-white/90 p-8 rounded-3xl border-2 border-[#F4D5DD] shadow-sm max-w-xl mx-auto z-10 animate-fade-in">
          <RobiCharacter state="THINKING" size={100} />
          <h2 className="text-2xl font-black font-serif text-[#4A2E35]">
            ROBI está esperando compañía 🌸
          </h2>
          <p className="text-sm text-[#8C4A5A] font-semibold max-w-md leading-relaxed">
            Cuando las participantes ingresen con el código{' '}
            <strong className="text-[#E86F88] font-mono">{stats.session.code}</strong>,
            sus avances aparecerán aquí en vivo.
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FAF0F4] px-4 py-2 rounded-full border border-[#F4D5DD] text-xs font-bold text-[#8C4A5A]">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Esperando las primeras programadoras...</span>
          </div>
        </div>
      ) : (
        /* DASHBOARD PRINCIPAL EN VIVO */
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 z-10">
          {/* 2 Columnas Izquierda */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* 3 Tarjetas Gigantes Superiores */}
            <div className="grid grid-cols-3 gap-4">
              {/* Card 1: Conectadas ahora */}
              <div className="bg-white/95 p-4 sm:p-5 rounded-3xl border-2 border-[#F4D5DD] flex items-center gap-3.5 shadow-xs">
                <div className="p-3.5 bg-[#E8F5E9] text-[#43A047] rounded-2xl">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#4A2E35]">
                    {connectedNow}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8C4A5A] font-bold">
                    conectadas ahora ({totalParticipants} total)
                  </div>
                </div>
              </div>

              {/* Card 2: Misión 01 completada */}
              <div className="bg-white/95 p-4 sm:p-5 rounded-3xl border-2 border-[#F4D5DD] flex items-center gap-3.5 shadow-xs">
                <div className="p-3.5 bg-[#FCE4EC] text-[#E86F88] rounded-2xl">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#E86F88]">
                    {m1.completed}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8C4A5A] font-bold">
                    Misión 01 completada ({m1.completionRate}%)
                  </div>
                </div>
              </div>

              {/* Card 3: Misión 02 completada */}
              <div className="bg-white/95 p-4 sm:p-5 rounded-3xl border-2 border-[#F4D5DD] flex items-center gap-3.5 shadow-xs">
                <div className="p-3.5 bg-[#EDE7F6] text-[#9082D9] rounded-2xl">
                  <Rocket className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#9082D9]">
                    {m2.completed}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8C4A5A] font-bold">
                    Misión 02 completada ({m2.completionRate}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Progreso General Enorme */}
            <div className="bg-white/95 p-5 sm:p-6 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                <span className="text-[#4A2E35]">Progreso general de la sesión</span>
                <span className="text-[#8DA875] text-base font-black">
                  {overallProgressPct}%
                </span>
              </div>
              <div className="w-full h-4 sm:h-5 bg-[#FAF0F4] rounded-full overflow-hidden border border-[#F4D5DD] p-0.5">
                <div
                  className="h-full bg-linear-to-r from-[#E86F88] via-[#9082D9] to-[#8DA875] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(4, overallProgressPct)}%` }}
                ></div>
              </div>
            </div>

            {/* Participantes por Misión & Métodos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Participantes por misión */}
              <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-3">
                <h3 className="text-xs font-black text-[#4A2E35] uppercase tracking-wider">
                  Participantes por misión
                </h3>
                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-1">
                      <span>Misión 01 (Secuencias)</span>
                      <span>{m1.completed} ({m1.completionRate}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FAF0F4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E86F88] transition-all"
                        style={{ width: `${Math.min(100, m1.completionRate)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-1">
                      <span>Misión 02 (Condicionales)</span>
                      <span>{m2.completed} ({m2.completionRate}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FAF0F4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9082D9] transition-all"
                        style={{ width: `${Math.min(100, m2.completionRate)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[11px] mb-1">
                      <span>Misión 03 (Bucles)</span>
                      <span>{m3.completed} ({m3.completionRate}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FAF0F4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8DA875] transition-all"
                        style={{ width: `${Math.min(100, m3.completionRate)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métodos utilizados */}
              <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between gap-3">
                <h3 className="text-xs font-black text-[#4A2E35] uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#E86F88]" /> Métodos utilizados
                </h3>
                <div className="flex items-center justify-around py-3">
                  <div className="flex flex-col items-center gap-1 text-xs font-bold text-[#E86F88]">
                    <span className="w-4 h-4 rounded-full bg-[#E86F88]"></span>
                    <span>Botones ({interactionMethods.buttonsPct}%)</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-xs font-bold text-[#9082D9]">
                    <span className="w-4 h-4 rounded-full bg-[#9082D9]"></span>
                    <span>Bloques ({interactionMethods.blocksPct}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#FAF0F4] rounded-full overflow-hidden flex border border-[#F4D5DD]">
                  <div
                    className="bg-[#E86F88] h-full"
                    style={{ width: `${interactionMethods.buttonsPct}%` }}
                  ></div>
                  <div
                    className="bg-[#9082D9] h-full"
                    style={{ width: `${interactionMethods.blocksPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-5">
            {/* Errores más frecuentes */}
            <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#E86F88] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Desafíos más comunes
              </h3>
              <div className="flex flex-col gap-2 text-xs font-bold text-[#4A2E35]">
                {commonErrorsOverall.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-2">
                    Las estudiantes están avanzando sin dificultades comunes.
                  </div>
                ) : (
                  commonErrorsOverall.map((err, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-[#FAF0F4] p-2.5 rounded-xl border border-[#F4D5DD]"
                    >
                      <span>
                        {idx + 1}. {err.label}
                      </span>
                      <span className="text-[#E86F88] font-mono font-black">{err.pct}%</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-3 flex-1">
              <h3 className="text-xs font-black text-[#8DA875] uppercase tracking-wider">
                Actividad reciente
              </h3>
              <div className="flex flex-col gap-2 text-xs font-medium">
                {recentActivity.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="flex justify-between items-center bg-[#FAF0F4] p-2 rounded-xl text-[11px]"
                  >
                    <span>🌸 {act.text}</span>
                    <span className="text-[10px] text-[#8C4A5A] font-mono font-bold">
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Frase Pedagógica Inspiradora */}
            <div className="bg-[#FFFDF9] p-4 sm:p-5 rounded-3xl border-2 border-[#F4D5DD] text-center shadow-xs flex flex-col items-center gap-2">
              <Heart className="w-5 h-5 text-[#E86F88] fill-current animate-pulse" />
              <p className="font-serif italic text-xs sm:text-sm text-[#E86F88] font-bold leading-relaxed">
                {highlightedQuote}
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center text-xs text-[#8C4A5A] border-t border-[#F4D5DD] pt-4 z-10">
        <div className="flex items-center gap-2">
          <RobiCharacter state="IDLE" size={32} />
          <span className="font-bold">ALGORITMIA • Día de la Mujer Boliviana</span>
        </div>
        <span className="text-[11px]">Sincronización en vivo vía Supabase ⚡</span>
      </footer>
    </div>
  );
};
