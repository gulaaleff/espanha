import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRows } from '../lib/useRows';
import type { Phase, Status, Task } from '../lib/types';

const ORDEM: Status[] = ['todo', 'doing', 'done', 'alert'];
const LABEL: Record<Status, string> = { todo: 'A fazer', doing: 'Em andamento', done: 'Feito', alert: 'Atenção' };

export function Linha() {
  const { rows: phases } = useRows<Phase>('phases');
  const { rows: tasks } = useRows<Task>('tasks');

  const cycle = async (t: Task) => {
    const next = ORDEM[(ORDEM.indexOf(t.status) + 1) % ORDEM.length];
    await supabase.from('tasks').update({ status: next }).eq('id', t.id);
  };

  return (
    <>
      <p className="small" style={{ margin: 0 }}>Clique no status para avançar: A fazer → Em andamento → Feito → Atenção.</p>
      {phases.map((ph) => (
        <section key={ph.id} className="card" style={{ gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, paddingBottom: 6 }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: 28, color: 'var(--grana)' }}>{String(ph.position).padStart(2, '0')}</span>
            <h3>{ph.title}</h3>
          </div>
          {tasks.filter((t) => t.phase_id === ph.id).map((t) => (
            <div key={t.id} className="table-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 110px 160px 130px' }}>
              <span>{t.title}</span>
              <span className="small">{t.owner}</span>
              <span className="small">{t.due_label}</span>
              <button className={'pill ' + t.status} onClick={() => cycle(t)}>{LABEL[t.status]}</button>
            </div>
          ))}
          <NovaTarefa phaseId={ph.id} count={tasks.filter((t) => t.phase_id === ph.id).length} />
        </section>
      ))}
    </>
  );
}

function NovaTarefa({ phaseId, count }: { phaseId: string; count: number }) {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Ambos');
  const [due, setDue] = useState('');
  const add = async () => {
    if (!title.trim()) return;
    await supabase.from('tasks').insert({ phase_id: phaseId, title: title.trim(), owner, due_label: due || null, position: count + 1 });
    setTitle(''); setDue('');
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px 160px auto', gap: 10, paddingTop: 10, borderTop: '1px solid var(--linha-suave)' }}>
      <label className="sr-only" htmlFor={'nt-' + phaseId}>Nova tarefa</label>
      <input id={'nt-' + phaseId} className="field" style={{ height: 36, padding: '0 10px', border: '1px solid var(--campo)', borderRadius: 8 }} placeholder="Nova tarefa…" value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
      <select aria-label="Responsável" style={{ height: 36, border: '1px solid var(--campo)', borderRadius: 8 }} value={owner} onChange={(e) => setOwner(e.target.value)}>
        <option>Ambos</option><option>Aleff</option><option>Paula</option><option>UAB</option>
      </select>
      <input aria-label="Quando" style={{ height: 36, padding: '0 10px', border: '1px solid var(--campo)', borderRadius: 8 }} placeholder="quando (ex.: nov/2026)" value={due} onChange={(e) => setDue(e.target.value)} />
      <button className="btn small" onClick={add}>Adicionar</button>
    </div>
  );
}
