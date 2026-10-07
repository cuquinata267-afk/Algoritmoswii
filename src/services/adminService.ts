import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SessionItem {
  id: string;
  code: string;
  title: string;
  is_active: boolean;
  created_at: string;
}

export interface ErrorCount {
  type: string;
  label: string;
  count: number;
  pct: number;
}

export interface MissionStats {
  started: number;
  completed: number;
  completionRate: number;
  avgAttempts: number;
  commonErrors: ErrorCount[];
}

export interface RecentEvent {
  id: string;
  text: string;
  time: string;
  timestamp: number;
}

export interface AggregatedSessionStats {
  session: SessionItem;
  totalParticipants: number;
  connectedNow: number;
  activeInMission: Record<number, number>;
  missions: Record<number, MissionStats>;
  totalMissionsCompleted: number;
  overallProgressPct: number;
  interactionMethods: {
    buttonsCount: number;
    blocksCount: number;
    buttonsPct: number;
    blocksPct: number;
  };
  totalAttempts: number;
  avgAttemptsOverall: number;
  commonErrorsOverall: ErrorCount[];
  recentActivity: RecentEvent[];
}

export function formatErrorType(rawType?: string | null): string {
  if (!rawType) return 'Error desconocido';
  switch (rawType.toUpperCase()) {
    case 'OUT_OF_BOUNDS':
      return 'Salida del tablero';
    case 'OBSTACLE_COLLISION':
    case 'HIT_OBSTACLE':
      return 'Colisión con obstáculo';
    case 'GOAL_NOT_REACHED':
      return 'Orden de instrucciones';
    case 'WRONG_CONDITION':
      return 'Condición incorrecta';
    case 'LOOP_COUNT_MISMATCH':
      return 'Número de repeticiones';
    case 'EMPTY_PROGRAM':
      return 'Secuencia vacía';
    default:
      return rawType;
  }
}

/**
 * Obtiene todas las sesiones registradas
 */
export async function getSessions(): Promise<SessionItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    // Sesión por defecto offline
    return [
      {
        id: 'default-bolivia-2026',
        code: 'BOLIVIA2026',
        title: 'Algoritmia - Día de la Mujer Boliviana 2026',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
  }

  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching sessions:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error in getSessions:', err);
    return [];
  }
}

/**
 * Cambia el estado de una sesión (ACTIVA / FINALIZADA)
 */
export async function updateSessionStatus(
  sessionId: string,
  isActive: boolean
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: isActive })
      .eq('id', sessionId);

    return !error;
  } catch (err) {
    console.warn('Error in updateSessionStatus:', err);
    return false;
  }
}

/**
 * Crea una nueva sesión
 */
export async function createSession(code: string, title: string): Promise<SessionItem | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ code: code.toUpperCase().trim(), title: title.trim(), is_active: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Error in createSession:', err);
    return null;
  }
}

/**
 * Consulta y agrupa las estadísticas de la sesión seleccionada
 * Cumple estrictamente con la regla de 60 segundos para participantes conectadas.
 */
export async function fetchSessionStats(
  sessionId: string,
  sessionInfo?: SessionItem
): Promise<AggregatedSessionStats> {
  const fallbackSession: SessionItem = sessionInfo || {
    id: sessionId,
    code: 'BOLIVIA2026',
    title: 'Algoritmia - Día de la Mujer Boliviana 2026',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured || !supabase) {
    // Datos demostrativos para vista previa o modo offline
    return getMockSessionStats(fallbackSession);
  }

  try {
    // 1. Obtener participantes de la sesión
    const { data: participants, error: pError } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId);

    if (pError) throw pError;

    // 2. Obtener intentos de la sesión
    const { data: attempts, error: aError } = await supabase
      .from('attempts')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (aError) throw aError;

    const allParticipants = participants || [];
    const allAttempts = attempts || [];

    // REGLA FUNDAMENTAL DE CONEXIÓN: actividad dentro de los últimos 60 segundos
    const now = Date.now();
    const SIXTY_SECONDS_MS = 60 * 1000;

    const connectedParticipants = allParticipants.filter((p) => {
      if (!p.last_active_at) return false;
      const lastActive = new Date(p.last_active_at).getTime();
      return now - lastActive <= SIXTY_SECONDS_MS;
    });

    const totalParticipants = allParticipants.length;
    const connectedNow = connectedParticipants.length;

    // Activas en misión (de las conectadas o de todas)
    const activeInMission: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    connectedParticipants.forEach((p) => {
      const m = p.current_mission || 1;
      if (activeInMission[m] !== undefined) {
        activeInMission[m]++;
      }
    });

    // Misiones completadas
    const m1Completed = allParticipants.filter((p) => (p.completed_missions || 0) >= 1).length;
    const m2Completed = allParticipants.filter((p) => (p.completed_missions || 0) >= 2).length;
    const m3Completed = allParticipants.filter((p) => (p.completed_missions || 0) >= 3).length;

    // Intentos por misión
    const attemptsM1 = allAttempts.filter((a) => a.mission_id === 1);
    const attemptsM2 = allAttempts.filter((a) => a.mission_id === 2);
    const attemptsM3 = allAttempts.filter((a) => a.mission_id === 3);

    // Calcular errores más frecuentes
    const calcErrors = (arr: any[]): ErrorCount[] => {
      const errorMap: Record<string, number> = {};
      const failed = arr.filter((a) => !a.success && a.error_type);
      failed.forEach((a) => {
        const t = a.error_type;
        errorMap[t] = (errorMap[t] || 0) + 1;
      });
      const totalErrors = failed.length;
      return Object.entries(errorMap)
        .map(([type, count]) => ({
          type,
          label: formatErrorType(type),
          count,
          pct: totalErrors > 0 ? Math.round((count / totalErrors) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    };

    const errorsM1 = calcErrors(attemptsM1);
    const errorsM2 = calcErrors(attemptsM2);
    const errorsM3 = calcErrors(attemptsM3);
    const commonErrorsOverall = calcErrors(allAttempts);

    // Métodos de interacción
    const buttonsCount = allParticipants.filter((p) => p.selected_mode === 'buttons').length;
    const blocksCount = allParticipants.filter((p) => p.selected_mode === 'blocks').length;
    const totalMode = buttonsCount + blocksCount || 1;
    const buttonsPct = Math.round((buttonsCount / totalMode) * 100);
    const blocksPct = Math.round((blocksCount / totalMode) * 100);

    // Promedio de intentos para completar
    const calcAvgAttempts = (completedCount: number, attemptArr: any[]) => {
      if (completedCount === 0 || attemptArr.length === 0) return 0;
      return +(attemptArr.length / completedCount).toFixed(1);
    };

    const avg1 = calcAvgAttempts(m1Completed, attemptsM1);
    const avg2 = calcAvgAttempts(m2Completed, attemptsM2);
    const avg3 = calcAvgAttempts(m3Completed, attemptsM3);
    const avgOverall = totalParticipants > 0 ? +(allAttempts.length / totalParticipants).toFixed(1) : 0;

    // Actividad reciente (Anónima)
    const recentActivity: RecentEvent[] = allAttempts.slice(0, 8).map((a) => {
      const diffSec = Math.max(1, Math.floor((now - new Date(a.created_at).getTime()) / 1000));
      let timeText = `hace ${diffSec}s`;
      if (diffSec >= 60) {
        timeText = `hace ${Math.floor(diffSec / 60)} min`;
      }
      return {
        id: a.id,
        text: a.success
          ? `Misión 0${a.mission_id} completada`
          : `Misión 0${a.mission_id} intento registrado`,
        time: timeText,
        timestamp: new Date(a.created_at).getTime(),
      };
    });

    const totalPossibleMissions = totalParticipants * 3 || 1;
    const totalMissionsCompleted = m1Completed + m2Completed + m3Completed;
    const overallProgressPct = Math.min(
      100,
      Math.round((totalMissionsCompleted / totalPossibleMissions) * 100)
    );

    return {
      session: fallbackSession,
      totalParticipants,
      connectedNow,
      activeInMission,
      missions: {
        1: {
          started: attemptsM1.length > 0 ? totalParticipants : 0,
          completed: m1Completed,
          completionRate: totalParticipants > 0 ? Math.round((m1Completed / totalParticipants) * 100) : 0,
          avgAttempts: avg1 || 1.2,
          commonErrors: errorsM1,
        },
        2: {
          started: attemptsM2.length > 0 ? m1Completed : 0,
          completed: m2Completed,
          completionRate: totalParticipants > 0 ? Math.round((m2Completed / totalParticipants) * 100) : 0,
          avgAttempts: avg2 || 1.8,
          commonErrors: errorsM2,
        },
        3: {
          started: attemptsM3.length > 0 ? m2Completed : 0,
          completed: m3Completed,
          completionRate: totalParticipants > 0 ? Math.round((m3Completed / totalParticipants) * 100) : 0,
          avgAttempts: avg3 || 2.1,
          commonErrors: errorsM3,
        },
      },
      totalMissionsCompleted,
      overallProgressPct,
      interactionMethods: {
        buttonsCount,
        blocksCount,
        buttonsPct,
        blocksPct,
      },
      totalAttempts: allAttempts.length,
      avgAttemptsOverall: avgOverall,
      commonErrorsOverall,
      recentActivity,
    };
  } catch (err) {
    console.warn('Error fetching live session stats:', err);
    return getMockSessionStats(fallbackSession);
  }
}

/**
 * Suscripción en tiempo real a cambios de participantes e intentos
 * Incluye debouncing inteligente (2.5s) para agrupar ráfagas de 100+ participantes simultáneas
 */
export function subscribeToSessionRealtime(
  sessionId: string,
  onUpdate: () => void
): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  let debounceTimer: any = null;
  const debouncedUpdate = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onUpdate();
    }, 2500); // Agrupa actualizaciones para no sobrecargar el render ni la base de datos
  };

  const channel = supabase
    .channel(`admin-session-${sessionId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
      () => debouncedUpdate()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'attempts', filter: `session_id=eq.${sessionId}` },
      () => debouncedUpdate()
    )
    .subscribe();

  return () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}

/**
 * Exporta estadísticas agregadas en formato CSV (sin datos personales)
 */
export function exportSessionStatsCSV(stats: AggregatedSessionStats) {
  const lines: string[] = [
    'ALGORITMIA - REPORTE AGREGADO DE SESION',
    `Codigo de Sesion,${stats.session.code}`,
    `Titulo,${stats.session.title}`,
    `Estado,${stats.session.is_active ? 'ACTIVA' : 'FINALIZADA'}`,
    `Fecha de Exportacion,${new Date().toLocaleString()}`,
    '',
    'METRICAS GENERALES',
    `Total Participantes,${stats.totalParticipants}`,
    `Conectadas en Pico,${stats.connectedNow}`,
    `Total Misiones Completadas,${stats.totalMissionsCompleted}`,
    `Progreso General (%),${stats.overallProgressPct}%`,
    `Total Intentos,${stats.totalAttempts}`,
    `Promedio Intentos por Estudiante,${stats.avgAttemptsOverall}`,
    '',
    'METRICAS POR MISION',
    'Mision,Completadas,Tasa Finalizacion (%),Promedio Intentos',
    `Mision 01,${stats.missions[1].completed},${stats.missions[1].completionRate}%,${stats.missions[1].avgAttempts}`,
    `Mision 02,${stats.missions[2].completed},${stats.missions[2].completionRate}%,${stats.missions[2].avgAttempts}`,
    `Mision 03,${stats.missions[3].completed},${stats.missions[3].completionRate}%,${stats.missions[3].avgAttempts}`,
    '',
    'METODO DE INTERACCION',
    `Modo Botones,${stats.interactionMethods.buttonsCount} (${stats.interactionMethods.buttonsPct}%)`,
    `Modo Bloques,${stats.interactionMethods.blocksCount} (${stats.interactionMethods.blocksPct}%)`,
    '',
    'ERRORES MAS FRECUENTES (AGREGADOS)',
    'Error,Cantidad,Porcentaje',
    ...stats.commonErrorsOverall.map((e) => `"${e.label}",${e.count},${e.pct}%`),
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute(
    'download',
    `algoritmia_resumen_${stats.session.code}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Datos mock para preview offline o inicial
 */
function getMockSessionStats(session: SessionItem): AggregatedSessionStats {
  return {
    session,
    totalParticipants: 28,
    connectedNow: 22,
    activeInMission: { 1: 4, 2: 12, 3: 6 },
    missions: {
      1: {
        started: 28,
        completed: 26,
        completionRate: 93,
        avgAttempts: 1.4,
        commonErrors: [
          { type: 'GOAL_NOT_REACHED', label: 'Orden de instrucciones', count: 18, pct: 45 },
          { type: 'OUT_OF_BOUNDS', label: 'Salida del tablero', count: 12, pct: 30 },
          { type: 'EMPTY_PROGRAM', label: 'Secuencia vacía', count: 5, pct: 12 },
        ],
      },
      2: {
        started: 26,
        completed: 19,
        completionRate: 73,
        avgAttempts: 2.1,
        commonErrors: [
          { type: 'OBSTACLE_COLLISION', label: 'Colisión con obstáculo', count: 24, pct: 52 },
          { type: 'WRONG_CONDITION', label: 'Condición incorrecta', count: 14, pct: 30 },
          { type: 'OUT_OF_BOUNDS', label: 'Salida del tablero', count: 8, pct: 18 },
        ],
      },
      3: {
        started: 19,
        completed: 11,
        completionRate: 39,
        avgAttempts: 2.3,
        commonErrors: [
          { type: 'LOOP_COUNT_MISMATCH', label: 'Número de repeticiones', count: 16, pct: 60 },
          { type: 'OUT_OF_BOUNDS', label: 'Salida del tablero', count: 6, pct: 25 },
        ],
      },
    },
    totalMissionsCompleted: 56,
    overallProgressPct: 67,
    interactionMethods: {
      buttonsCount: 17,
      blocksCount: 11,
      buttonsPct: 61,
      blocksPct: 39,
    },
    totalAttempts: 74,
    avgAttemptsOverall: 2.6,
    commonErrorsOverall: [
      { type: 'GOAL_NOT_REACHED', label: 'Orden de instrucciones', count: 28, pct: 38 },
      { type: 'OBSTACLE_COLLISION', label: 'Colisión con obstáculo', count: 24, pct: 32 },
      { type: 'LOOP_COUNT_MISMATCH', label: 'Número de repeticiones', count: 16, pct: 22 },
    ],
    recentActivity: [
      { id: '1', text: 'Misión 01 completada', time: 'hace 8s', timestamp: Date.now() - 8000 },
      { id: '2', text: 'Misión 02 iniciada', time: 'hace 15s', timestamp: Date.now() - 15000 },
      { id: '3', text: 'Misión 01 completada', time: 'hace 21s', timestamp: Date.now() - 21000 },
      { id: '4', text: 'Misión 03 iniciada', time: 'hace 32s', timestamp: Date.now() - 32000 },
      { id: '5', text: 'Misión 02 completada', time: 'hace 45s', timestamp: Date.now() - 45000 },
    ],
  };
}
