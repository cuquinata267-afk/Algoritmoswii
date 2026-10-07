import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { RobiCharacter } from '../../components/robi/RobiCharacter';
import { FloralCorners } from '../../components/common/FloralAccents';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // If auth fails, allow bypass if master admin password or show error
          if (password === 'admin2026' || password === 'algoritmia2026') {
            sessionStorage.setItem('algoritmia_admin_auth', 'true');
            onLoginSuccess();
            return;
          }
          setErrorMsg(error.message || 'Credenciales inválidas');
          setLoading(false);
          return;
        }

        // Login con éxito
        sessionStorage.setItem('algoritmia_admin_auth', 'true');
        onLoginSuccess();
      } else {
        // Modo offline / demo
        if (password === 'admin2026' || password === 'algoritmia2026' || !password) {
          sessionStorage.setItem('algoritmia_admin_auth', 'true');
          onLoginSuccess();
        } else {
          setErrorMsg('Contraseña incorrecta para el modo sin conexión.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    sessionStorage.setItem('algoritmia_admin_auth', 'true');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-pastel-pink flex flex-col items-center justify-center p-4 relative select-none">
      <FloralCorners />

      <div className="w-full max-w-md bg-white/95 rounded-3xl p-6 sm:p-8 border-4 border-[#F4D5DD] shadow-xl flex flex-col items-center text-center gap-5 z-10 animate-fade-in">
        {/* ROBI Header */}
        <div className="relative">
          <RobiCharacter state="IDLE" size={72} />
          <div className="absolute -top-1 -right-1 bg-pastel-pink p-1.5 rounded-full border border-pastel-rose text-pastel-vibrant shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#4A2E35] font-serif">
            Panel de Administradora
          </h1>
          <p className="text-xs text-[#8C4A5A] font-semibold mt-1">
            ALGORITMIA • Día de la Mujer Boliviana
          </p>
        </div>

        {errorMsg && (
          <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl font-bold text-left animate-shake">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-bold text-[#4A2E35] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#E86F88]" />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@algoritmia.bo"
              className="w-full px-4 py-3 bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl text-xs font-bold text-[#4A2E35] outline-none focus:border-[#E86F88] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-bold text-[#4A2E35] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E86F88]" />
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#FAF0F4] border-2 border-[#F4D5DD] rounded-2xl text-xs font-bold text-[#4A2E35] outline-none focus:border-[#E86F88] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 btn-pink-pill text-xs font-black tracking-wide flex items-center justify-center gap-2 uppercase shadow-md disabled:opacity-50"
          >
            {loading ? (
              'Verificando...'
            ) : (
              <>
                Ingresar al Panel <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Acceso Rápido para Facilitadora / Presentadora */}
        <div className="w-full pt-3 border-t border-[#F4D5DD] flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickDemoAccess}
            className="text-[11px] font-bold text-[#8C4A5A] hover:text-[#E86F88] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#FAF0F4] border border-[#F4D5DD] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Acceso Rápido Presentadora (Clave: admin2026)
          </button>
          <span className="text-[10px] text-[#8C4A5A]/70">
            Protegido para uso exclusivo del equipo docente y expositoras.
          </span>
        </div>
      </div>
    </div>
  );
};
