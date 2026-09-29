import { useRows } from '../lib/useRows';
import type { Source } from '../lib/types';
import { statusLabel } from './Painel';

export function Fontes() {
  const { rows } = useRows<Source>('sources');
  const groups = Array.from(new Set(rows.map((r) => r.grp)));
  return (
    <div className="grid-2">
      {groups.map((g) => (
        <section key={g} className="card" style={{ gap: 4 }}>
          <h3 style={{ marginBottom: 6 }}>{g}</h3>
          {rows.filter((r) => r.grp === g).map((s) => (
            <div key={s.id} className="row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, fontSize: 15 }}>{s.title}</a>
              <span className="small">{s.org}{s.why ? ' · ' + s.why : ''}</span>
              <span style={{ display: 'flex', gap: 8 }}>
                <span className={'pill ' + (s.tag === 'oficial' ? 'done' : 'alert')}>{s.tag === 'oficial' ? 'Oficial' : 'Secundária'}</span>
                <span className="pill">{statusLabel(s.status)}</span>
              </span>
              {s.status_note && <span className="small">{s.status_note}</span>}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
