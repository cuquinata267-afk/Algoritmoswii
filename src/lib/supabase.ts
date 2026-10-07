import { createClient } from '@supabase/supabase-js';

// Configuration from Vite env vars, Next env vars, or user provided keys
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env as any).NEXT_PUBLIC_SUPABASE_URL ||
  'https://gvwuviioxzhfkocgjvxk.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (import.meta.env as any).NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_cGo4UAqPB32XzhiD0EASeQ_zsygGwTg';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local storage key for anonymous participant ID
const STORAGE_KEY_PARTICIPANT_ID = 'algoritmia_participant_id';
const STORAGE_KEY_ANON_NAME = 'algoritmia_anon_name';
const STORAGE_KEY_SESSION_CODE = 'algoritmia_session_code';

// Generates UUID safely even on non-HTTPS / HTTP mobile connections
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if randomUUID fails in non-secure context
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generates or reads anonymous local identifier
export function getOrCreateAnonymousUser() {
  let participantId = localStorage.getItem(STORAGE_KEY_PARTICIPANT_ID);
  let anonName = localStorage.getItem(STORAGE_KEY_ANON_NAME);

  if (!participantId) {
    participantId = generateUUID();
    localStorage.setItem(STORAGE_KEY_PARTICIPANT_ID, participantId);
  }

  if (!anonName) {
    const floralPrefixes = ['Rosa', 'Flor', 'Estrella', 'Violeta', 'Girasol', 'Orquídea', 'Luna', 'Ada'];
    const randomNum = Math.floor(Math.random() * 900) + 100;
    anonName = `${floralPrefixes[Math.floor(Math.random() * floralPrefixes.length)]}-${randomNum}`;
    localStorage.setItem(STORAGE_KEY_ANON_NAME, anonName);
  }

  return { participantId, anonName };
}

export function setLocalSessionCode(code: string) {
  localStorage.setItem(STORAGE_KEY_SESSION_CODE, code.toUpperCase());
}

export function getLocalSessionCode(): string {
  return localStorage.getItem(STORAGE_KEY_SESSION_CODE) || 'BOLIVIA2026';
}

// In-memory cache to prevent hundreds of redundant SELECT queries on the sessions table
const sessionIdCache = new Map<string, string>();

export async function getCachedSessionId(code: string): Promise<string | null> {
  const normalized = code.toUpperCase().trim();
  if (sessionIdCache.has(normalized)) {
    return sessionIdCache.get(normalized)!;
  }
  const cachedLocal = localStorage.getItem(`algoritmia_sid_${normalized}`);
  if (cachedLocal) {
    sessionIdCache.set(normalized, cachedLocal);
    return cachedLocal;
  }
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data } = await supabase
      .from('sessions')
      .select('id')
      .eq('code', normalized)
      .maybeSingle();

    if (data?.id) {
      sessionIdCache.set(normalized, data.id);
      localStorage.setItem(`algoritmia_sid_${normalized}`, data.id);
      return data.id;
    }
  } catch (err) {
    console.warn('Error fetching session ID:', err);
  }
  return null;
}
