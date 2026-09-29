import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { signedUrl, upload } from '../lib/storage';
import { useRows } from '../lib/useRows';
import type { Doc } from '../lib/types';

const COLS = 'minmax(0,1.5fr) 110px 200px minmax(0,1.4fr) 150px';

export function Documentos() {
  const { rows: docs } = useRows<Doc>('documents');
  const [busy, setBusy] = useState<string | null>(null);

  const avancar = async (d: Doc) => {
    await supabase.from('documents').update({ stage: (d.stage + 1) % d.steps.length }).eq('id', d.id);
  };
  const anexar = async (d: Doc, f: File | undefined) => {
    if (!f) return;
    setBusy(d.id);
    try {
      const path = await upload('documentos', d.id, f);
      await supabase.from('documents').update({ file_path: path }).eq('id', d.id);
    } catch (e) {
      alert('Erro no envio: ' + (e as Error).message);
    }
    setBusy(null);
  };
  const abrir = async (d: Doc) => {
    if (!d.file_path) return;
    const url = await signedUrl('documentos', d.file_path);
    if (url) window.open(url, '_blank', 'noopener');
  };

  return (
    <section className="card" style={{ gap: 0, paddingTop: 8 }}>
      <div className="table-head" style={{ gridTemplateColumns: COLS }}>
        <span>Documento</span><span>De quem</span><span>Etapa (clique p/ avançar)</span><span>Observação</span><span>Arquivo</span>
      </div>
      {docs.map((d) => {
        const last = d.stage >= d.steps.length - 1;
        return (
          <div key={d.id} className="table-row" style={{ gridTemplateColumns: COLS }}>
            <span style={{ fontWeight: 500 }}>{d.title}</span>
            <span className="small">{d.owner}</span>
            <button className={'pill ' + (last ? 'done' : d.stage > 0 ? 'doing' : '')} style={{ justifySelf: 'start' }} onClick={() => avancar(d)}>
              {d.steps[d.stage]} · {d.stage + 1}/{d.steps.length}
            </button>
            <span className="small" style={{ lineHeight: 1.4 }}>{d.note}</span>
            <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {d.file_path && <button className="link-btn" onClick={() => abrir(d)}>Ver</button>}
              <label className="link-btn" style={{ position: 'relative', cursor: 'pointer' }}>
                {busy === d.id ? 'Enviando…' : d.file_path ? 'Trocar' : 'Anexar'}
                <input type="file" accept="application/pdf,image/*" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }} onChange={(e) => anexar(d, e.target.files?.[0])} aria-label={'Anexar ' + d.title + ' de ' + d.owner} />
              </label>
            </span>
          </div>
        );
      })}
    </section>
  );
}
