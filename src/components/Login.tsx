import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login({ denied, onSignOut }: { denied?: string; onSignOut?: () => void }) {
  const [err, setErr] = useState<string | null>(null);
  const entrar = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setErr(error.message);
  };
  return (
    <div className="login">
      <div className="card">
        <div className="stripe" style={{ margin: '-22px -24px 0', borderRadius: '14px 14px 0 0', overflow: 'hidden' }}>
          <span style={{ background: '#004d98' }} /><span style={{ background: '#a50044' }} /><span style={{ background: '#004d98' }} /><span style={{ background: '#a50044' }} /><span style={{ background: '#edbb00' }} />
        </div>
        <h1>Rumo a Barcelona</h1>
        {denied ? (
          <>
            <p className="banner warn">O e-mail {denied} não está liberado. Só Aleff e Paula têm acesso.</p>
            <button className="btn ghost" onClick={onSignOut}>Entrar com outra conta</button>
          </>
        ) : (
          <>
            <p className="small">Central da mudança do Aleff e da Paula. Entre com a sua conta Google.</p>
            <button className="google-btn" onClick={entrar}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-7.9z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8C3.9 20.5 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.7 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.1 4.9l3.6-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1C17.5 2.2 15 1 12 1 7.7 1 3.9 3.5 2.1 7.1l3.6 2.8C6.6 7.4 9.1 5.4 12 5.4z"/></svg>
              Entrar com Google
            </button>
          </>
        )}
        {err && <p className="banner warn">{err}</p>}
      </div>
    </div>
  );
}
