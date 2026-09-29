import { useEffect, useState } from 'react';
import type { Shared } from '../App';
import { Avatar } from '../components/Avatar';
import { supabase } from '../lib/supabase';
import { upload } from '../lib/storage';
import type { Profile } from '../lib/types';

const CAMPOS: Record<'pessoa' | 'gato', [string, string, string][]> = {
  pessoa: [
    ['nome_completo', 'Nome completo', ''],
    ['papel', 'Papel na mudança', ''],
    ['email', 'E-mail para alertas', ''],
    ['telefone', 'Telefone', '+55 …'],
    ['passaporte_validade', 'Validade do passaporte', 'dd/mm/aaaa'],
    ['obs', 'Observações', '']
  ],
  gato: [
    ['nascimento', 'Nascimento', 'dd/mm/aaaa'],
    ['raca', 'Raça / pelagem', 'ex.: SRD, cinza'],
    ['peso', 'Peso (kg)', 'ex.: 4,8'],
    ['microchip', 'Microchip', '15 dígitos'],
    ['veterinario', 'Veterinário', 'nome e telefone'],
    ['viagens', 'Como reage a viagens', 'ex.: mia no carro'],
    ['alimentacao', 'Alimentação', 'marca e quantidade'],
    ['obs', 'Observações', '']
  ]
};

export function Perfis({ profiles }: Shared) {
  return (
    <div className="grid-2">
      {profiles.map((p) => <PerfilCard key={p.id} p={p} />)}
    </div>
  );
}

function PerfilCard({ p }: { p: Profile }) {
  const [data, setData] = useState<Record<string, string>>(p.data ?? {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => setData(p.data ?? {}), [p.data]);

  const dirty = JSON.stringify(data) !== JSON.stringify(p.data ?? {});

  const salvar = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ data }).eq('id', p.id);
    setSaving(false);
    setMsg(error ? 'Erro: ' + error.message : 'Salvo');
    setTimeout(() => setMsg(null), 2500);
  };

  const onFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setMsg('Enviando foto…');
      const path = await upload('fotos', p.slug, f);
      await supabase.from('profiles').update({ photo_path: path }).eq('id', p.id);
      setMsg('Foto atualizada');
    } catch (err) {
      setMsg('Erro no envio: ' + (err as Error).message);
    }
    setTimeout(() => setMsg(null), 2500);
  };

  const sub = p.kind === 'gato'
    ? [data.raca, data.peso ? data.peso + ' kg' : ''].filter(Boolean).join(' · ') || 'Complete os dados abaixo'
    : data.papel ?? '';

  return (
    <section className="card" style={{ gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Avatar profile={p} size={96} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className={'pill ' + (p.kind === 'gato' ? 'doing' : 'done')} style={{ alignSelf: 'flex-start' }}>{p.kind === 'gato' ? 'Gato' : 'Pessoa'}</span>
          <h3 style={{ fontSize: 26 }}>{p.name}</h3>
          <span className="small">{sub}</span>
        </div>
        <label className="file-label">
          {p.photo_path ? 'Trocar foto' : 'Adicionar foto'}
          <input type="file" accept="image/*" onChange={onFoto} aria-label={'Foto de ' + p.name} />
        </label>
      </div>
      <div className="grid-2" style={{ gap: 12 }}>
        {CAMPOS[p.kind].map(([k, label, ph]) => (
          <label key={k} className="field">
            {label}
            <input value={data[k] ?? ''} placeholder={ph} onChange={(e) => setData({ ...data, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn" disabled={!dirty || saving} onClick={salvar}>{saving ? 'Salvando…' : 'Salvar'}</button>
        {msg && <span className="small" role="status">{msg}</span>}
      </div>
    </section>
  );
}
