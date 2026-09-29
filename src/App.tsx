import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { useRows } from './lib/useRows';
import type { Profile, Setting } from './lib/types';
import { addMonths, fmt, parseISO } from './lib/dates';
import { Login } from './components/Login';
import { Avatar } from './components/Avatar';
import { Painel } from './pages/Painel';
import { Perfis } from './pages/Perfis';
import { Linha } from './pages/Linha';
import { Vistos } from './pages/Vistos';
import { Gatos } from './pages/Gatos';
import { Documentos } from './pages/Documentos';
import { Agenda } from './pages/Agenda';
import { Chat } from './pages/Chat';
import { Fontes } from './pages/Fontes';

export type ScreenId = 'painel' | 'perfis' | 'linha' | 'vistos' | 'gatos' | 'docs' | 'agenda' | 'chat' | 'fontes';

const SCREENS: { id: ScreenId; label: string; sub: string }[] = [
  { id: 'painel', label: 'Painel', sub: 'Visão geral da mudança' },
  { id: 'perfis', label: 'Perfis', sub: 'Fotos e informações de Aleff, Paula, Boris e Sol' },
  { id: 'linha', label: 'Linha do tempo', sub: 'Tudo o que precisa acontecer, por fase' },
  { id: 'vistos', label: 'Vistos', sub: 'O caminho da Paula e o do Aleff, com base nas fontes oficiais' },
  { id: 'gatos', label: 'Boris e Sol', sub: 'Documentos, janela de entrada e conforto na viagem' },
  { id: 'docs', label: 'Documentos', sub: 'Checklist com etapas: emitir, apostilar, traduzir' },
  { id: 'agenda', label: 'Agenda e alertas', sub: 'Compromissos e lembretes' },
  { id: 'chat', label: 'Perguntar', sub: 'Chat que responde com base nas fontes e nos seus dados' },
  { id: 'fontes', label: 'Fontes oficiais', sub: 'Links que importam, com a data da última verificação' }
];

export interface Shared {
  profiles: Profile[];
  settings: Record<string, unknown>;
  setSetting: (key: string, value: unknown) => Promise<void>;
  go: (s: ScreenId) => void;
}

function useHashScreen(): [ScreenId, (s: ScreenId) => void] {
  const read = () => {
    const h = window.location.hash.replace('#', '') as ScreenId;
    return SCREENS.some((s) => s.id === h) ? h : 'painel';
  };
  const [screen, setScreen] = useState<ScreenId>(read);
  useEffect(() => {
    const on = () => setScreen(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return [screen, (s) => { window.location.hash = s; }];
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [member, setMember] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setMember(null); return; }
    supabase.rpc('is_member').then(({ data }) => setMember(Boolean(data)));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;
  if (member === null) return null;
  if (!member) return <Login denied={session.user.email ?? ''} onSignOut={() => supabase.auth.signOut()} />;
  return <Shell email={session.user.email ?? ''} />;
}

function Shell({ email }: { email: string }) {
  const [screen, go] = useHashScreen();
  const { rows: profiles } = useRows<Profile>('profiles', 'slug');
  const { rows: settingRows } = useRows<Setting>('settings', 'key');

  const settings = useMemo(() => Object.fromEntries(settingRows.map((s) => [s.key, s.value])), [settingRows]);
  const setSetting = async (key: string, value: unknown) => {
    await supabase.from('settings').upsert({ key, value });
  };

  const order = ['aleff', 'paula', 'boris', 'sol'];
  const sorted = [...profiles].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  const sample = parseISO(settings.sample_date as string);
  const release = sample ? addMonths(sample, 3) : null;
  const trip = parseISO(settings.trip_date as string);
  const cur = SCREENS.find((s) => s.id === screen)!;
  const shared: Shared = { profiles: sorted, settings, setSetting, go };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="stripe">
          <span style={{ background: '#004d98' }} /><span style={{ background: '#a50044' }} /><span style={{ background: '#004d98' }} /><span style={{ background: '#a50044' }} /><span style={{ background: '#edbb00' }} />
        </div>
        <div className="brand">
          <h1>Rumo a Barcelona</h1>
          <p>Central da mudança · só nós dois</p>
        </div>
        <div className="trip-box">
          <span className="lbl">Viagem-alvo</span>
          <span className="big">{trip ? fmt(trip) : 'defina a data'}</span>
          <span className="note">Boris e Sol só entram a partir de {fmt(release)}</span>
        </div>
        <nav className="nav" aria-label="Seções">
          {SCREENS.map((s) => (
            <button key={s.id} type="button" className={screen === s.id ? 'on' : ''} onClick={() => go(s.id)} aria-current={screen === s.id ? 'page' : undefined}>
              <span className="dot" />{s.label}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="avatars">
            {sorted.map((p) => <Avatar key={p.id} profile={p} size={36} ring="#0a1e3c" />)}
          </div>
          <span>{email}</span>
          <button type="button" onClick={() => supabase.auth.signOut()}>Sair</button>
        </div>
      </aside>
      <main className="main">
        <header className="page-head">
          <div>
            <h2>{cur.label}</h2>
            <p>{cur.sub}</p>
          </div>
          <span className="chip"><span className="dot" />Sincronizado em tempo real</span>
        </header>
        {screen === 'painel' && <Painel {...shared} />}
        {screen === 'perfis' && <Perfis {...shared} />}
        {screen === 'linha' && <Linha />}
        {screen === 'vistos' && <Vistos />}
        {screen === 'gatos' && <Gatos {...shared} />}
        {screen === 'docs' && <Documentos />}
        {screen === 'agenda' && <Agenda />}
        {screen === 'chat' && <Chat />}
        {screen === 'fontes' && <Fontes />}
      </main>
    </div>
  );
}
