-- ========================================================
-- ALGORITMIA - SCRIPT DE BASE DE DATOS SUPABASE
-- Día de la Mujer Boliviana - Taller Educativo de Programación
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE SESIONES (Representa una clase o taller activo)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT 'Taller Algoritmia - Día de la Mujer Boliviana',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast session lookup by code
CREATE INDEX IF NOT EXISTS idx_sessions_code ON public.sessions(code);

-- 2. TABLA DE PARTICIPANTES (Anónimas, sin datos personales)
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    anonymous_name VARCHAR(50) NOT NULL, -- Ej: "Programadora Estelar", "ROBI Friend 42"
    current_mission INT DEFAULT 1,
    completed_missions INT DEFAULT 0,
    selected_mode VARCHAR(20) DEFAULT 'buttons', -- 'buttons' | 'blocks'
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_participants_session ON public.participants(session_id);
CREATE INDEX IF NOT EXISTS idx_participants_active_filter ON public.participants(session_id, last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_completed ON public.participants(session_id, completed_missions);

-- 3. TABLA DE INTENTOS Y ACTIVIDAD (Para métricas y diagnósticos)
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES public.participants(id) ON DELETE CASCADE,
    mission_id INT NOT NULL,
    success BOOLEAN NOT NULL,
    error_type VARCHAR(50), -- 'out_of_bounds', 'wrong_turn', 'infinite_loop', 'missed_star', etc.
    interaction_mode VARCHAR(20) DEFAULT 'buttons',
    commands_used JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_session_mission ON public.attempts(session_id, mission_id);
CREATE INDEX IF NOT EXISTS idx_attempts_created_at ON public.attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_composite ON public.attempts(session_id, mission_id, success);
CREATE INDEX IF NOT EXISTS idx_attempts_errors ON public.attempts(session_id, error_type) WHERE success = false;

-- 4. INSERTAR SESIÓN POR DEFECTO (Para inicio rápido sin configuración previa)
INSERT INTO public.sessions (code, title, is_active)
VALUES ('BOLIVIA2026', 'Algoritmia - Día de la Mujer Boliviana 2026', true)
ON CONFLICT (code) DO NOTHING;

-- 5. CONFIGURACIÓN DE POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública de sesiones (para validación de código QR/URL)
CREATE POLICY "Permitir lectura de sesiones" 
ON public.sessions FOR SELECT 
USING (true);

-- Permitir creación y lectura anónima de participantes
CREATE POLICY "Permitir crear participante anónima" 
ON public.participants FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir actualizar participante propia" 
ON public.participants FOR UPDATE 
USING (true);

CREATE POLICY "Permitir lectura de participantes en sesión" 
ON public.participants FOR SELECT 
USING (true);

-- Permitir registro y lectura de intentos
CREATE POLICY "Permitir registrar intentos" 
ON public.attempts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir lectura de intentos para vista presentadora" 
ON public.attempts FOR SELECT 
USING (true);

-- 6. HABILITAR SUPABASE REALTIME EN TABLAS CLAVE
-- Nota: En Supabase Studio, asegúrate de activar Realtime en la publicación supabase_realtime.
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.participants, public.attempts;
COMMIT;

-- 7. FUNCIÓN RPC PARA ESTADÍSTICAS AGREGADAS (60-SECOND CONNECTION RULE)
-- Esta función procesa métricas agregadas en la base de datos sin transferir PII de las estudiantes
CREATE OR REPLACE FUNCTION public.get_session_stats(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_participants INT;
    v_connected_now INT;
    v_m1_completed INT;
    v_m2_completed INT;
    v_m3_completed INT;
    v_total_attempts INT;
    v_buttons_count INT;
    v_blocks_count INT;
    v_result JSONB;
BEGIN
    -- Total participantes registradas
    SELECT COUNT(*) INTO v_total_participants
    FROM public.participants
    WHERE session_id = p_session_id;

    -- Conectadas ahora: actividad dentro de los últimos 60 segundos
    SELECT COUNT(*) INTO v_connected_now
    FROM public.participants
    WHERE session_id = p_session_id
      AND last_active_at >= NOW() - INTERVAL '60 seconds';

    -- Misiones completadas
    SELECT COUNT(*) INTO v_m1_completed
    FROM public.participants
    WHERE session_id = p_session_id AND completed_missions >= 1;

    SELECT COUNT(*) INTO v_m2_completed
    FROM public.participants
    WHERE session_id = p_session_id AND completed_missions >= 2;

    SELECT COUNT(*) INTO v_m3_completed
    FROM public.participants
    WHERE session_id = p_session_id AND completed_missions >= 3;

    -- Intentos y modos
    SELECT COUNT(*) INTO v_total_attempts
    FROM public.attempts
    WHERE session_id = p_session_id;

    SELECT COUNT(*) INTO v_buttons_count
    FROM public.participants
    WHERE session_id = p_session_id AND selected_mode = 'buttons';

    SELECT COUNT(*) INTO v_blocks_count
    FROM public.participants
    WHERE session_id = p_session_id AND selected_mode = 'blocks';

    v_result := jsonb_build_object(
        'total_participants', v_total_participants,
        'connected_now', v_connected_now,
        'm1_completed', v_m1_completed,
        'm2_completed', v_m2_completed,
        'm3_completed', v_m3_completed,
        'total_attempts', v_total_attempts,
        'buttons_count', v_buttons_count,
        'blocks_count', v_blocks_count
    );

    RETURN v_result;
END;
$$;

