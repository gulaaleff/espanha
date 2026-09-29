import { supabase } from '../lib/supabase';
import type { ChecklistItem } from '../lib/types';

export function Checklist({ items }: { items: ChecklistItem[] }) {
  const toggle = async (it: ChecklistItem) => {
    await supabase.from('checklist_items').update({ done: !it.done }).eq('id', it.id);
  };
  if (!items.length) return <div className="empty">Nada por aqui ainda.</div>;
  return (
    <div>
      {items.map((it) => (
        <button key={it.id} type="button" className={'check' + (it.done ? ' on' : '')} onClick={() => toggle(it)} aria-pressed={it.done}>
          <span className="box">{it.done ? '✓' : ''}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span className="t">{it.title}</span>
            {it.detail && <span className="d">{it.detail}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
