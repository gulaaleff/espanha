import type { Shared } from '../App';
import { useRows } from '../lib/useRows';
import type { Doc, EventRow, Source, Task } from '../lib/types';
import { addMonths, fmt, fmtShort, parseISO } from '../lib/dates';

export function Painel({ settings, go }: Shared) {
  const { rows: tasks } = useRows<Task>('tasks');
  const { rows: docs } = useRows<Doc>('documents');
  const { rows: events } = useRows<EventRow>('events', 'starts_on');
  const { rows: sources } = useRows<Source>('sources');

  const next = tasks.find((t) => t.status === 'doing') ?? tasks.find((t) => t.status === 'todo');
  const ready = docs.filter((d) => d.stage >= d.steps.length - 1).length;
  const sample = parseISO(settings.sample_date as string);
  const release = sample ? addMonths(sample, 3) : null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => (parseISO(e.starts_on) ?? today) >= today).slice(0, 5);
  const radar = [...sources].sort((a, b) => (a.status === 'mudou' ? -1 : b.status === 'mudou' ? 1 : 0)).slice(0, 4);

  const visa: [string, string, string][] = [
    ['Proposta da UAB', 'Recebida', 'done'],
    ['Contrato de pós-doc', 'Assinatura com a UAB', 'doing'],
    ['Autorização UGE-CE', 'UAB protocola · até 20 dias úteis', ''],
    ['Visto no consulado', 'Depois da autorização', ''],
    ['Chegada', 'Padrón + TIE no 1º mês', '']
  ];
  const cats: [string, string][] = [
    ['Microchip', 'Confirmar se é ISO'],
    ['Vacina antirrábica', 'Depois do chip'],
    ['Sorologia', 'Coleta em ' + fmt(sample)],
    ['Espera de 3 meses', 'Até ' + fmt(release)],
    ['CVI + embarque', 'Certificado vale 10 dias']
  ];

  return (
    <>
      <div className="grid-4">
        <div className="card stat">
          <span className="eyebrow">Próximo passo</span>
          <span className="mid">{next?.title ?? 'Tudo em dia'}</span>
          {next && <span className="small">{next.owner} · {next.due_label}</span>}
        </div>
        <div className="card stat">
          <span className="eyebrow">Documentos prontos</span>
          <span className="big">{ready}<span className="small"> / {docs.length}</span></span>
          <div className="bar"><div style={{ width: docs.length ? `${Math.round((ready / docs.length) * 100)}%` : 0 }} /></div>
        </div>
        <div className="card stat">
          <span className="eyebrow">Janela de Boris e Sol</span>
          <span className="mid">Entrada a partir de {fmt(release)}</span>
          <span className="small">3 meses após a coleta da sorologia</span>
        </div>
        <div className="card stat">
          <span className="eyebrow">Compromissos futuros</span>
          <span className="big">{upcoming.length}</span>
          <button className="link-btn" style={{ alignSelf: 'flex-start' }} onClick={() => go('agenda')}>Abrir agenda</button>
        </div>
      </div>

      <section className="card">
        <div className="card-head"><h3>Caminho crítico</h3><span className="small">Quem chega por último define a data da viagem</span></div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blau)' }}>Vistos</span>
        <div className="grid-5">
          {visa.map(([t, d, k]) => <div key={t} className={'step ' + k}><b>{t}</b><span className="small">{d}</span></div>)}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--grana)' }}>Boris e Sol</span>
        <div className="grid-5">
          {cats.map(([t, d]) => <div key={t} className="step"><b>{t}</b><span className="small">{d}</span></div>)}
        </div>
      </section>

      <div className="grid-2">
        <section className="card">
          <div className="card-head"><h3>Próximos compromissos</h3></div>
          {upcoming.length === 0 && <div className="empty">Nenhum compromisso ainda. <button className="link-btn" onClick={() => go('agenda')}>Adicionar</button></div>}
          {upcoming.map((e) => (
            <div key={e.id} className="row">
              <span style={{ width: 56, fontFamily: 'var(--display)', fontSize: 18, color: 'var(--blau)' }}>{fmtShort(parseISO(e.starts_on))}</span>
              <span style={{ flex: 1 }}>{e.title}</span>
              <span className="small">{e.owner}</span>
            </div>
          ))}
        </section>
        <section className="card">
          <div className="card-head"><h3>Radar das fontes oficiais</h3><button className="link-btn" onClick={() => go('fontes')}>Ver todas</button></div>
          {radar.map((s) => (
            <div key={s.id} className="row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className={'pill ' + (s.status === 'mudou' ? 'alert' : s.status === 'sem_mudanca' ? 'done' : '')}>{statusLabel(s.status)}</span>
                <b style={{ fontSize: 15 }}>{s.title}</b>
              </span>
              <span className="small">{s.status_note ?? s.org}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export function statusLabel(s: Source['status']) {
  return s === 'mudou' ? 'Mudou' : s === 'nao_se_aplica' ? 'Não se aplica' : 'Sem mudança';
}
