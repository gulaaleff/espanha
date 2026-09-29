import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRows } from '../lib/useRows';
import type { EventRow } from '../lib/types';
import { monthAbbr, parseISO } from '../lib/dates';

export function Agenda() {
  const { rows: events } = useRows<EventRow>('events', 'starts_on');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [owner, setOwner] = useState('Ambos');
  const [rem, setRem] = useState({ 30: true, 7: true, 1: true } as Record<number, boolean>);
  const [err, setErr] = useState<string | null>(null);

  const add = async () => {
    if (!title.trim() || !date) { setErr('Preencha o quê e quando.'); return; }
    const reminders_days = [30, 7, 1].filter((d) => rem[d]);
    const { error } = await supabase.from('events').insert({ title: title.trim(), starts_on: date, owner, reminders_days });
    if (error) setErr(error.message); else { setTitle(''); setDate(''); setErr(null); }
  };
  const remove = async (id: string) => {
    if (confirm('Apagar este compromisso?')) await supabase.from('events').delete().eq('id', id);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <section className="card" style={{ gap: 4 }}>
        <div className="card-head" style={{ paddingBottom: 8 }}><h3>Compromissos</h3><span className="small">Google Agenda entra na próxima fase</span></div>
        {events.length === 0 && <div className="empty">Nenhum compromisso ainda.</div>}
        {events.map((e) => {
          const d = parseISO(e.starts_on);
          return (
            <div key={e.id} className="row">
              <div style={{ width: 56, display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontFamily: 'var(--display)', fontSize: 22, color: 'var(--blau)' }}>{d ? String(d.getDate()).padStart(2, '0') : '--'}</span>
                <span className="small" style={{ textTransform: 'uppercase', fontSize: 12 }}>{monthAbbr(d)} {d?.getFullYear()}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontWeight: 500 }}>{e.title}</span>
                <span className="small" style={{ fontSize: 12 }}>{e.owner} · alertas {e.reminders_days.map((x) => 'D-' + x).join(' · ') || 'nenhum'}</span>
              </div>
              <span className={'pill ' + (e.gcal_event_id ? 'done' : '')}>{e.gcal_event_id ? 'No Google Agenda' : 'Só no site'}</span>
              <button className="link-btn" onClick={() => remove(e.id)} aria-label={'Apagar ' + e.title}>Apagar</button>
            </div>
          );
        })}
      </section>
      <section className="card">
        <h3>Novo compromisso</h3>
        <label className="field">O quê<input value={title} placeholder="ex.: Coleta da sorologia de Boris e Sol" onChange={(e) => setTitle(e.target.value)} /></label>
        <div className="grid-2" style={{ gap: 12 }}>
          <label className="field">Quando<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="field">Responsável
            <select value={owner} onChange={(e) => setOwner(e.target.value)}><option>Ambos</option><option>Aleff</option><option>Paula</option><option>UAB</option></select>
          </label>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', gap: 16, fontSize: 14 }}>
          <legend className="small" style={{ marginBottom: 6 }}>Alertas por e-mail</legend>
          {[30, 7, 1].map((d) => (
            <label key={d} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={!!rem[d]} onChange={(e) => setRem({ ...rem, [d]: e.target.checked })} />D-{d}
            </label>
          ))}
        </fieldset>
        <button className="btn" onClick={add}>Adicionar</button>
        {err && <span className="small" role="alert">{err}</span>}
      </section>
    </div>
  );
}
