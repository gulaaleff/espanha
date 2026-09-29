import { useState } from 'react';
import type { Shared } from '../App';
import { Avatar } from '../components/Avatar';
import { Checklist } from '../components/Checklist';
import { supabase } from '../lib/supabase';
import { useRows } from '../lib/useRows';
import type { ChecklistItem } from '../lib/types';
import { addDays, addMonths, fmt, fmtShort, parseISO } from '../lib/dates';

const REGRAS = [
  'Microchip (ou tatuagem legível feita antes de 03/07/2011).',
  'Vacina antirrábica válida, aplicada depois do microchip.',
  'Sorologia: coleta no mínimo 30 dias após a vacina, resultado ≥ 0,5 UI/ml, em laboratório aprovado pela UE.',
  'Entrada só 3 meses depois da coleta. Idade mínima de 7 meses na entrada.',
  'Certificado sanitário no modelo da UE, assinado por veterinário oficial do Brasil, em espanhol.',
  'Entrada por ponto de entrada de viajantes designado, com declaração à Guardia Civil. Máximo de 5 animais.'
];
const MOMENTOS: [string, string][] = [
  ['conforto:antes', 'Semanas antes'],
  ['conforto:carro', 'Viagem de carro'],
  ['conforto:voo', 'Aeroporto e voo'],
  ['conforto:chegada', 'Chegada em Barcelona']
];

export function Gatos({ profiles, settings, setSetting }: Shared) {
  const [view, setView] = useState<'docs' | 'conforto'>('docs');
  const { rows: items } = useRows<ChecklistItem>('checklist_items');

  return (
    <>
      <div className="tabs">
        <button className={view === 'docs' ? 'on' : ''} onClick={() => setView('docs')}>Documentos e prazos</button>
        <button className={view === 'conforto' ? 'on' : ''} onClick={() => setView('conforto')}>Conforto na viagem</button>
      </div>
      {view === 'docs' ? <Docs profiles={profiles} settings={settings} setSetting={setSetting} items={items} /> : <Conforto items={items} />}
    </>
  );
}

function Docs({ profiles, settings, setSetting, items }: Pick<Shared, 'profiles' | 'settings' | 'setSetting'> & { items: ChecklistItem[] }) {
  const sampleIso = (settings.sample_date as string) ?? '';
  const tripIso = (settings.trip_date as string) ?? '';
  const sample = parseISO(sampleIso);
  const trip = parseISO(tripIso);
  const release = sample ? addMonths(sample, 3) : null;
  const ok = trip && release ? trip >= release : null;
  const cats = profiles.filter((p) => p.kind === 'gato');

  return (
    <>
      <section className="card">
        <div className="card-head"><h3>Calculadora da janela de entrada</h3><span className="small">Brasil não está na lista do Anexo II → exige sorologia</span></div>
        <div className="grid-4" style={{ alignItems: 'end' }}>
          <label className="field">Coleta da sorologia
            <input type="date" value={sampleIso} onChange={(e) => setSetting('sample_date', e.target.value || null)} />
          </label>
          <label className="field">Data-alvo da viagem
            <input type="date" value={tripIso} onChange={(e) => setSetting('trip_date', e.target.value || null)} />
          </label>
          <div className="banner info" style={{ padding: '10px 14px' }}>
            <div className="small" style={{ color: 'var(--blau)', fontWeight: 600 }}>Entrada liberada a partir de</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>{fmt(release)}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--grana-claro)' }}>
            <div className="small" style={{ color: 'var(--grana-escuro)', fontWeight: 600 }}>Emitir o CVI entre</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, color: '#6e0030' }}>{trip ? fmtShort(addDays(trip, -10)) + ' e ' + fmtShort(trip) : 'defina a viagem'}</div>
          </div>
        </div>
        {ok !== null && (
          <div className={'banner ' + (ok ? 'info' : 'warn')} style={{ fontWeight: 600, fontSize: 14 }}>
            {ok ? 'Data-alvo compatível: Boris e Sol já podem entrar nessa data.' : 'Data-alvo cedo demais: ainda não completa 3 meses após a coleta. Adie a viagem ou antecipe a sorologia.'}
          </div>
        )}
      </section>
      <div className="grid-2">
        {cats.map((c) => {
          const list = items.filter((i) => i.list === 'gato:' + c.slug);
          return (
            <section key={c.id} className="card" style={{ gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar profile={c} size={52} />
                <h3 style={{ flex: 1, fontSize: 24 }}>{c.name}</h3>
                <span className="small">{list.filter((i) => i.done).length} de {list.length}</span>
              </div>
              <Checklist items={list} />
            </section>
          );
        })}
      </div>
      <section className="card" style={{ gap: 4 }}>
        <h3>Regras de entrada na Espanha (MAPA)</h3>
        {REGRAS.map((r) => <div key={r} className="row" style={{ fontSize: 14, lineHeight: 1.45 }}>{r}</div>)}
      </section>
    </>
  );
}

function Conforto({ items }: { items: ChecklistItem[] }) {
  const [tip, setTip] = useState('');
  const [list, setList] = useState(MOMENTOS[0][0]);
  const add = async () => {
    if (!tip.trim()) return;
    const n = items.filter((i) => i.list === list).length;
    await supabase.from('checklist_items').insert({ list, title: tip.trim(), detail: 'Anotação de vocês', custom: true, position: n + 1 });
    setTip('');
  };
  return (
    <>
      <div className="banner warn"><b>Antes de tudo:</b> remédio para ansiedade ou sedação só com prescrição do veterinário de Boris e Sol. Em voo, sedação costuma ser desaconselhada; peça a ele um plano para a viagem inteira (carro + avião).</div>
      <div className="grid-2">
        {MOMENTOS.map(([id, label]) => {
          const l = items.filter((i) => i.list === id);
          return (
            <section key={id} className="card" style={{ gap: 4 }}>
              <div className="card-head"><h3>{label}</h3><span className="small">{l.filter((i) => i.done).length} de {l.length}</span></div>
              <Checklist items={l} />
            </section>
          );
        })}
      </div>
      <section className="card">
        <h3>Adicionar anotação de conforto</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px auto', gap: 12, alignItems: 'end' }}>
          <label className="field">O que funciona para eles
            <input value={tip} placeholder="ex.: Sol se acalma com a manta cinza" onChange={(e) => setTip(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          </label>
          <label className="field">Momento
            <select value={list} onChange={(e) => setList(e.target.value)}>
              {MOMENTOS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
          <button className="btn" onClick={add}>Adicionar</button>
        </div>
      </section>
    </>
  );
}
