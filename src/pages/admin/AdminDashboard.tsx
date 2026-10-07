import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AggregatedSessionStats,
  SessionItem,
  exportSessionStatsCSV,
  fetchSessionStats,
  getSessions,
  subscribeToSessionRealtime,
  updateSessionStatus,
  createSession,
} from '../../services/adminService';
import { RobiCharacter } from '../../components/robi/RobiCharacter';
import { FloralCorners } from '../../components/common/FloralAccents';
import {
  Users,
  CheckCircle2,
  RefreshCw,
  Tv,
  Download,
  LogOut,
  AlertCircle,
  PieChart,
  Activity,
  PlusCircle,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [stats, setStats] = useState<AggregatedSessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');

  // Cargar lista de sesiones
  const loadSessions = useCallback(async () => {
    const list = await getSessions();
    setSessions(list);
    if (list.length > 0 && !selectedSessionId) {
      // Seleccionar la primera sesión activa o la primera de la lista
      const active = list.find((s) => s.is_active) || list[0];
      setSelectedSessionId(active.id);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Cargar estadísticas de la sesión seleccionada
  const loadStats = useCallback(
    async (isManualRefresh = false) => {
      if (!selectedSessionId) return;
      if (isManualRefresh) setRefreshing(true);

      const sessionObj = sessions.find((s) => s.id === selectedSessionId);
      const data = await fetchSessionStats(selectedSessionId, sessionObj);
      setStats(data);
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    },
    [selectedSessionId, sessions]
  );

  useEffect(() => {
    if (selectedSessionId) {
      loadStats();
      // Suscribirse a cambios en tiempo real vía Supabase Realtime
      const unsubscribe = subscribeToSessionRealtime(selectedSessionId, () => {
        loadStats();
      });

      // Refresco periódico de 15 segundos para recalcular la ventana de 60s de participantes conectadas
      const interval = setInterval(() => {
        loadStats();
      }, 15000);

      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    }
  }, [selectedSessionId, loadStats]);

  // Cambiar estado de la sesión (Activa / Finalizada)
  const handleToggleStatus = async () => {
    if (!stats) return;
    const nextStatus = !stats.session.is_active;
    const success = await updateSessionStatus(stats.session.id, nextStatus);
    if (success) {
      await loadSessions();
      await loadStats();
    }
  };

  // Crear nueva sesión
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const created = await createSession(
      newCode,
      newTitle || `Taller Algoritmia - ${newCode.toUpperCase()}`
    );
    if (created) {
      setShowNewSessionModal(false);
      setNewCode('');
      setNewTitle('');
      await loadSessions();
      setSelectedSessionId(created.id);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-pastel-pink flex flex-col items-center justify-center p-4">
        <RobiCharacter state="THINKING" size={80} />
        <p className="text-sm font-bold text-[#8C4A5A] mt-4 animate-pulse">
          Cargando panel de administración...
        </p>
      </div>
    );
  }

  const currentSession = stats.session;
  const isFinished = !currentSession.is_active;

  return (
    <div className="min-h-screen bg-[#FAF0F4] text-[#4A2E35] p-4 sm:p-6 md:p-8 flex flex-col justify-between relative select-none">
      <FloralCorners />

      {/* TOP BAR / HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white/95 p-4 sm:p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FAF0F4] rounded-2xl border border-[#F4D5DD]">
            <RobiCharacter state="IDLE" size={38} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black font-serif text-[#4A2E35]">
                ALGORITMIA EN VIVO
              </h1>
              <span className="bg-[#FAF0F4] text-[#E86F88] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#F4D5DD]">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-[#8C4A5A] font-semibold">
              Panel de control y métricas agregadas
            </p>
          </div>
        </div>

        {/* SELECTOR DE SESIÓN Y CONTROLES */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Dropdown de Sesiones */}
          <div className="flex items-center gap-1.5 bg-[#FAF0F4] px-3 py-1.5 rounded-2xl border border-[#F4D5DD]">
            <Calendar className="w-3.5 h-3.5 text-[#E86F88]" />
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#4A2E35] outline-none cursor-pointer"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} • {s.title.slice(0, 24)} {s.is_active ? '(Activa)' : '(Finalizada)'}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewSessionModal(true)}
              className="text-[#E86F88] hover:text-[#C24D66] p-1"
              title="Nueva sesión"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Estado (Activa / Finalizada) */}
          <button
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              currentSession.is_active
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
            }`}
            title="Cambiar estado de la sesión"
          >
            {currentSession.is_active ? (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-600" />
                <span>Sesión Activa</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span>Finalizada</span>
              </>
            )}
          </button>

          {/* Botón Refrescar */}
          <button
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="p-2 bg-white text-[#8C4A5A] hover:text-[#4A2E35] border border-[#F4D5DD] rounded-2xl transition-all shadow-xs"
            title="Actualizar datos"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#E86F88]' : ''}`} />
          </button>

          {/* Botón Modo Proyección */}
          <button
            onClick={() => navigate('/admin/presenter')}
            className="px-3.5 py-1.5 bg-[#E86F88] hover:bg-[#D45973] text-white rounded-2xl text-xs font-black shadow-xs flex items-center gap-1.5 transition-all"
            title="Abrir vista limpia para proyector"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo Proyección</span>
          </button>

          {/* Botón Exportar CSV */}
          <button
            onClick={() => exportSessionStatsCSV(stats)}
            className="px-3 py-1.5 bg-white hover:bg-pink-50 text-[#8C4A5A] border border-[#F4D5DD] rounded-2xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            title="Descargar reporte en CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#E86F88]" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          {/* Botón Salir */}
          <button
            onClick={onLogout}
            className="p-2 bg-white text-[#8C4A5A] hover:text-red-600 border border-[#F4D5DD] rounded-2xl transition-all"
            title="Cerrar sesión de administración"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* BANNER SI LA SESIÓN ESTÁ FINALIZADA */}
      {isFinished && (
        <div className="w-full my-3 p-3.5 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-center justify-between text-xs text-amber-900 font-bold z-10 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              Esta sesión ha sido marcada como <span className="font-black">FINALIZADA</span>.
              Los datos agregados corresponden al resultado definitivo del taller.
            </span>
          </div>
          <button
            onClick={() => exportSessionStatsCSV(stats)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
          >
            Descargar Resumen
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="my-5 flex flex-col gap-5 z-10">
        {/* TARJETAS PRINCIPALES (TOP 4) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Conectadas Ahora */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C4A5A]">
              <span>PARTICIPANTES</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-700 font-extrabold">En vivo</span>
              </div>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#4A2E35]">
                {stats.connectedNow}
              </span>
              <span className="text-xs text-[#8C4A5A] font-bold">
                / {stats.totalParticipants} registradas
              </span>
            </div>
            <div className="text-[10.5px] text-[#8C4A5A] font-medium">
              Conectadas en los últimos 60 seg.
            </div>
          </div>

          {/* Card 2: Misión 01 */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C4A5A]">
              <span>MISIÓN 01 (SECUENCIAS)</span>
              <CheckCircle2 className="w-4 h-4 text-[#E86F88]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#E86F88]">
                {stats.missions[1].completed}
              </span>
              <span className="text-xs font-extrabold text-[#E86F88]">
                ({stats.missions[1].completionRate}%)
              </span>
            </div>
            <div className="text-[10.5px] text-[#8C4A5A] font-medium">
              {stats.activeInMission[1] || 0} activas ahora en Misión 01
            </div>
          </div>

          {/* Card 3: Misión 02 */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C4A5A]">
              <span>MISIÓN 02 (CONDICIONAL)</span>
              <CheckCircle2 className="w-4 h-4 text-[#9082D9]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#9082D9]">
                {stats.missions[2].completed}
              </span>
              <span className="text-xs font-extrabold text-[#9082D9]">
                ({stats.missions[2].completionRate}%)
              </span>
            </div>
            <div className="text-[10.5px] text-[#8C4A5A] font-medium">
              {stats.activeInMission[2] || 0} activas ahora en Misión 02
            </div>
          </div>

          {/* Card 4: Misión 03 */}
          <div className="bg-white/95 p-4 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#8C4A5A]">
              <span>MISIÓN 03 (BUCLES)</span>
              <CheckCircle2 className="w-4 h-4 text-[#8DA875]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#8DA875]">
                {stats.missions[3].completed}
              </span>
              <span className="text-xs font-extrabold text-[#8DA875]">
                ({stats.missions[3].completionRate}%)
              </span>
            </div>
            <div className="text-[10.5px] text-[#8C4A5A] font-medium">
              {stats.activeInMission[3] || 0} activas ahora en Misión 03
            </div>
          </div>
        </div>

        {/* PROGRESO GENERAL DE LA ACTIVIDAD */}
        <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#4A2E35] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#E86F88]" /> Progreso General de la Actividad
            </span>
            <span className="text-sm font-black text-[#E86F88]">
              {stats.overallProgressPct}%
            </span>
          </div>
          <div className="w-full h-3.5 bg-[#FAF0F4] rounded-full overflow-hidden border border-[#F4D5DD] p-0.5">
            <div
              className="h-full bg-linear-to-r from-[#E86F88] to-[#9082D9] rounded-full transition-all duration-700"
              style={{ width: `${Math.max(4, stats.overallProgressPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-[#8C4A5A] font-semibold">
            <span>{stats.totalMissionsCompleted} misiones completadas en total</span>
            <span>Total de intentos registrados: {stats.totalAttempts}</span>
          </div>
        </div>

        {/* SECCIÓN DETALLADA: PROGRESO POR MISIÓN */}
        <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-4">
          <h2 className="text-xs font-black text-[#4A2E35] uppercase tracking-wider">
            Progreso y Rendimiento por Misión
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Misión 01 */}
            <div className="bg-[#FAF0F4]/70 p-4 rounded-2xl border border-[#F4D5DD] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#E86F88]">Misión 01: Caminar</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#F4D5DD] font-bold text-[#8C4A5A]">
                  Secuencias
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Completadas:</span>
                <span className="text-[#4A2E35]">
                  {stats.missions[1].completed} ({stats.missions[1].completionRate}%)
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Promedio intentos:</span>
                <span className="text-[#4A2E35]">{stats.missions[1].avgAttempts}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#8C4A5A] uppercase">
                  Errores más frecuentes:
                </span>
                <div className="mt-1 flex flex-col gap-1 text-[11px]">
                  {stats.missions[1].commonErrors.length === 0 ? (
                    <span className="text-slate-400 italic">Sin errores registrados</span>
                  ) : (
                    stats.missions[1].commonErrors.map((err, idx) => (
                      <div key={idx} className="flex justify-between text-[#4A2E35]">
                        <span className="truncate pr-1">
                          {idx + 1}. {err.label}
                        </span>
                        <span className="font-mono text-[#E86F88] font-bold">{err.pct}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Misión 02 */}
            <div className="bg-[#FAF0F4]/70 p-4 rounded-2xl border border-[#F4D5DD] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#9082D9]">Misión 02: Pensar</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#F4D5DD] font-bold text-[#8C4A5A]">
                  Condicionales
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Completadas:</span>
                <span className="text-[#4A2E35]">
                  {stats.missions[2].completed} ({stats.missions[2].completionRate}%)
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Promedio intentos:</span>
                <span className="text-[#4A2E35]">{stats.missions[2].avgAttempts}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#8C4A5A] uppercase">
                  Errores más frecuentes:
                </span>
                <div className="mt-1 flex flex-col gap-1 text-[11px]">
                  {stats.missions[2].commonErrors.length === 0 ? (
                    <span className="text-slate-400 italic">Sin errores registrados</span>
                  ) : (
                    stats.missions[2].commonErrors.map((err, idx) => (
                      <div key={idx} className="flex justify-between text-[#4A2E35]">
                        <span className="truncate pr-1">
                          {idx + 1}. {err.label}
                        </span>
                        <span className="font-mono text-[#9082D9] font-bold">{err.pct}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Misión 03 */}
            <div className="bg-[#FAF0F4]/70 p-4 rounded-2xl border border-[#F4D5DD] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#8DA875]">Misión 03: Bucles</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#F4D5DD] font-bold text-[#8C4A5A]">
                  Repetición
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Completadas:</span>
                <span className="text-[#4A2E35]">
                  {stats.missions[3].completed} ({stats.missions[3].completionRate}%)
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#8C4A5A]">Promedio intentos:</span>
                <span className="text-[#4A2E35]">{stats.missions[3].avgAttempts}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-[#8C4A5A] uppercase">
                  Errores más frecuentes:
                </span>
                <div className="mt-1 flex flex-col gap-1 text-[11px]">
                  {stats.missions[3].commonErrors.length === 0 ? (
                    <span className="text-slate-400 italic">Sin errores registrados</span>
                  ) : (
                    stats.missions[3].commonErrors.map((err, idx) => (
                      <div key={idx} className="flex justify-between text-[#4A2E35]">
                        <span className="truncate pr-1">
                          {idx + 1}. {err.label}
                        </span>
                        <span className="font-mono text-[#8DA875] font-bold">{err.pct}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 COLUMNAS: ERRORES & MÉTODO | ACTIVIDAD RECIENTE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Métodos & Errores generales */}
          <div className="flex flex-col gap-4">
            {/* Método de interacción */}
            <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#4A2E35] uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-[#E86F88]" /> Método de Interacción Preferido
              </h3>
              <div className="w-full h-4 bg-[#FAF0F4] rounded-full overflow-hidden flex border border-[#F4D5DD]">
                <div
                  className="bg-[#E86F88] h-full transition-all"
                  style={{ width: `${stats.interactionMethods.buttonsPct}%` }}
                ></div>
                <div
                  className="bg-[#9082D9] h-full transition-all"
                  style={{ width: `${stats.interactionMethods.blocksPct}%` }}
                ></div>
              </div>
              <div className="flex justify-around text-xs font-bold pt-1">
                <div className="flex items-center gap-1.5 text-[#E86F88]">
                  <span className="w-3 h-3 rounded-full bg-[#E86F88]"></span>
                  <span>
                    Botones: {stats.interactionMethods.buttonsCount} ({stats.interactionMethods.buttonsPct}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#9082D9]">
                  <span className="w-3 h-3 rounded-full bg-[#9082D9]"></span>
                  <span>
                    Bloques: {stats.interactionMethods.blocksCount} ({stats.interactionMethods.blocksPct}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnóstico general de errores */}
            <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col gap-3">
              <h3 className="text-xs font-black text-[#E86F88] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Diagnóstico Global de Aprendizaje
              </h3>
              <div className="flex flex-col gap-2">
                {stats.commonErrorsOverall.length === 0 ? (
                  <div className="text-xs text-[#8C4A5A]/70 italic py-2">
                    Aún no hay suficientes intentos para determinar patrones de error.
                  </div>
                ) : (
                  stats.commonErrorsOverall.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF0F4] p-3 rounded-2xl border border-[#F4D5DD] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#E86F88]">{idx + 1}.</span>
                        <span className="font-bold text-[#4A2E35]">{err.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[11px] text-[#8C4A5A]">{err.count} veces</span>
                        <span className="bg-white text-[#E86F88] px-2 py-0.5 rounded-lg border border-[#F4D5DD] font-black text-xs">
                          {err.pct}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actividad Reciente Anónima */}
          <div className="bg-white/95 p-5 rounded-3xl border-2 border-[#F4D5DD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-[#557A46] uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#8DA875]" /> Actividad en Tiempo Real
                </h3>
                <span className="text-[10px] text-[#8C4A5A] font-bold">100% Anónimo</span>
              </div>

              {stats.recentActivity.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center gap-2 text-xs text-[#8C4A5A]">
                  <RobiCharacter state="THINKING" size={48} />
                  <p className="font-bold">WARA está esperando compañía 🌸</p>
                  <p className="text-[11px] opacity-75">
                    Cuando las participantes comiencen a resolver misiones, la actividad aparecerá aquí.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {stats.recentActivity.map((act) => (
                    <div
                      key={act.id}
                      className="bg-[#FAF0F4] p-2.5 rounded-xl border border-[#F4D5DD] flex items-center justify-between text-xs transition-all hover:bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌸</span>
                        <span className="font-bold text-[#4A2E35]">{act.text}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#8C4A5A]">
                        {act.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F4D5DD] flex items-center justify-between text-[11px] text-[#8C4A5A]">
              <span>Sesión: <strong className="text-[#4A2E35]">{currentSession.code}</strong></span>
              <span>Protegido con Supabase RLS 🔒</span>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CREAR NUEVA SESIÓN */}
      {showNewSessionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 border-4 border-[#F4D5DD] max-w-sm w-full shadow-2xl flex flex-col gap-4 text-center">
            <h3 className="text-lg font-black text-[#4A2E35] font-serif">
              Crear Nueva Sesión
            </h3>
            <form onSubmit={handleCreateSession} className="flex flex-col gap-3 text-left">
              <div>
                <label className="text-xs font-bold text-[#4A2E35]">Código de Sesión (Ej: TALLER01):</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="BOLIVIA2026"
                  className="w-full mt-1 px-3 py-2 bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-xl text-xs font-bold uppercase outline-none focus:border-[#E86F88]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#4A2E35]">Título Descriptivo:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Algoritmia - Clase 4to Secundaria"
                  className="w-full mt-1 px-3 py-2 bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-xl text-xs font-bold outline-none focus:border-[#E86F88]"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-[#F4D5DD] text-[#8C4A5A] hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold btn-pink-pill text-white"
                >
                  Crear Sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-4 flex justify-between items-center text-xs text-[#8C4A5A] border-t border-[#F4D5DD] pt-3 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold">ALGORITMIA • Día de la Mujer Boliviana</span>
        </div>
        <span className="text-[11px]">Sincronización en tiempo real vía Supabase Realtime ⚡</span>
      </footer>
    </div>
  );
};
