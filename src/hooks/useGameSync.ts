import { useCallback, useRef } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  getOrCreateAnonymousUser,
  getLocalSessionCode,
  getCachedSessionId,
} from '../lib/supabase';
import { InteractionMode } from '../types';

export function useGameSync() {
  const lastTouchRef = useRef<number>(0);

  /**
   * Actualiza el timestamp de última actividad de la participante (Heartbeat & Interacción)
   * Cumple con la regla de 60 segundos para definir "PARTICIPANTE CONECTADA".
   * Utiliza caché de ID de sesión y throttling para soportar 100+ participantes simultáneas.
   */
  const touchActivity = useCallback(
    async (missionId: number = 1, mode: InteractionMode = 'buttons', force: boolean = false) => {
      const now = Date.now();
      // Throttling: evitar enviar más de 1 touch cada 20 segundos salvo que force sea true
      if (!force && now - lastTouchRef.current < 20000) {
        return;
      }
      lastTouchRef.current = now;

      if (!isSupabaseConfigured || !supabase) return;

      const { participantId, anonName } = getOrCreateAnonymousUser();
      const sessionCode = getLocalSessionCode();

      try {
        const sessionId = await getCachedSessionId(sessionCode);
        if (!sessionId) return;

        await supabase.from('participants').upsert(
          {
            id: participantId,
            session_id: sessionId,
            anonymous_name: anonName,
            current_mission: missionId,
            selected_mode: mode,
            last_active_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch (err) {
        // Silencioso para no degradar la experiencia de la estudiante si la red oscila
        console.warn('GameSync touchActivity warning:', err);
      }
    },
    []
  );

  /**
   * Registra un intento de ejecución de la misión (Éxito o Error)
   */
  const recordAttempt = useCallback(
    async (
      missionId: number,
      success: boolean,
      errorType?: string,
      commandsUsed?: any,
      mode: InteractionMode = 'buttons'
    ) => {
      const { participantId, anonName } = getOrCreateAnonymousUser();
      const sessionCode = getLocalSessionCode();

      if (isSupabaseConfigured && supabase) {
        try {
          const sessionId = await getCachedSessionId(sessionCode);

          if (sessionId) {
            // Actualizar estado de la participante
            await supabase.from('participants').upsert(
              {
                id: participantId,
                session_id: sessionId,
                anonymous_name: anonName,
                current_mission: missionId,
                completed_missions: success ? missionId : Math.max(0, missionId - 1),
                selected_mode: mode,
                last_active_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            );

            // Registrar evento en attempts
            await supabase.from('attempts').insert({
              session_id: sessionId,
              participant_id: participantId,
              mission_id: missionId,
              success,
              error_type: errorType || null,
              interaction_mode: mode,
              commands_used: commandsUsed || [],
            });
          }
        } catch (err) {
          console.warn('GameSync recordAttempt warning:', err);
        }
      }
    },
    []
  );

  return { recordAttempt, touchActivity };
}
