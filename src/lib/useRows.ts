import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';

/** Lê uma tabela inteira e mantém atualizada em tempo real (os dois veem as mudanças na hora). */
export function useRows<T>(table: string, order: string = 'position') {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: true });
    if (error) setError(error.message);
    else { setRows((data ?? []) as T[]); setError(null); }
    setLoading(false);
  }, [table, order]);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('rt-' + table + '-' + Math.random().toString(36).slice(2))
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [table, load]);

  return { rows, setRows, loading, error, reload: load };
}
