const PAULA: [string, string][] = [
  ['Base legal', 'Lei 14/2013, art. 72: pessoal investigador contratado por universidade.'],
  ['Onde', 'A UAB, como empregadora, protocola o pedido eletrônico na UGE-CE. Depois, visto no consulado.'],
  ['Prazo', 'Até 20 dias úteis para resolver; sem resposta, silêncio positivo.'],
  ['Validade', 'Até 3 anos ou a duração do contrato de pós-doc, o que for menor (Hoja 68, ago/2026). Versões antigas falam em 2 anos: confirmar.'],
  ['Documentos', 'Passaporte, antecedentes, contrato da UAB, seguro saúde, meios econômicos. Taxa 790-038 paga pela UAB.']
];
const ALEFF: [string, string][] = [
  ['Base legal', 'Lei 14/2013, art. 62: familiar de pesquisador; autorização vinculada à da Paula.'],
  ['Como', 'Pedido junto com o da Paula, na mesma solicitação da UAB. Exige menos comprovação financeira.'],
  ['Validade', 'A mesma da titular.'],
  ['Trabalho', 'O art. 62 não fala de trabalho; EURAXESS e guias indicam que a autorização permite trabalhar. Confirmar com a UAB.'],
  ['Documentos', 'Passaporte, certidão de casamento apostilada e traduzida, antecedentes, seguro saúde.']
];
const ABERTO = [
  'Qual via a UAB vai usar: UGE-CE (Lei 14/2013) ou residência do RD 1155/2024 direto no consulado? Com o Aleff junto, a UGE-CE tende a ser mais simples.',
  'Confirmar com o International Support Service da UAB (international.support@uab.cat) que a autorização do Aleff permite trabalhar.',
  'Aleff segue remoto para empresa brasileira? Avaliar residência fiscal e bitributação com contador.',
  'Qual consulado atende a jurisdição de vocês e quanto tempo está levando o agendamento.'
];

function Bloco({ eyebrow, cor, titulo, sub, linhas }: { eyebrow: string; cor: string; titulo: string; sub: string; linhas: [string, string][] }) {
  return (
    <section className="card">
      <span className="eyebrow" style={{ color: cor }}>{eyebrow}</span>
      <h3>{titulo}</h3>
      <span className="small">{sub}</span>
      {linhas.map(([k, v]) => (
        <div key={k} className="table-row" style={{ gridTemplateColumns: '130px minmax(0,1fr)', fontSize: 14, lineHeight: 1.45 }}>
          <b>{k}</b><span style={{ color: 'var(--texto-2)' }}>{v}</span>
        </div>
      ))}
    </section>
  );
}

export function Vistos() {
  return (
    <>
      <div className="banner info">
        <b>Pós-doc contratada pela UAB.</b> Contrato de trabalho como pesquisadora entra no art. 72 da Lei 14/2013. Quem protocola na UGE-CE e paga a taxa é a UAB. A UAB também cita uma segunda via, a residência do RD 1155/2024 pedida direto no consulado; para quem leva família, ela aponta vantagem na UGE-CE.
      </div>
      <div className="grid-2">
        <Bloco eyebrow="Titular · Paula · pós-doutorado" cor="var(--blau)" titulo="Residência e trabalho para investigação" sub="Lei 14/2013, art. 72 · a UAB protocola na UGE-CE" linhas={PAULA} />
        <Bloco eyebrow="Familiar · Aleff" cor="var(--grana)" titulo="Autorização de familiar vinculada" sub="Mesmo regime, pedido junto com o da Paula" linhas={ALEFF} />
      </div>
      <section className="card">
        <h3>Em aberto — decidir antes de protocolar</h3>
        {ABERTO.map((t, i) => (
          <div key={i} className="row" style={{ alignItems: 'flex-start', lineHeight: 1.45 }}>
            <b style={{ color: 'var(--grana)' }}>{i + 1}</b><span>{t}</span>
          </div>
        ))}
      </section>
    </>
  );
}
