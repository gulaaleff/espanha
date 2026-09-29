import { supabase } from './supabase';

const cache = new Map<string, { url: string; exp: number }>();

/** Buckets são privados: gera link temporário (1h) e guarda em cache. */
export async function signedUrl(bucket: 'fotos' | 'documentos', path: string): Promise<string | null> {
  const k = bucket + '/' + path;
  const hit = cache.get(k);
  if (hit && hit.exp > Date.now() + 60000) return hit.url;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
  if (error || !data) return null;
  cache.set(k, { url: data.signedUrl, exp: Date.now() + 3600 * 1000 });
  return data.signedUrl;
}

export function safeName(name: string): string {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-');
}

export async function upload(bucket: 'fotos' | 'documentos', folder: string, file: File): Promise<string> {
  const path = folder + '/' + Date.now() + '-' + safeName(file.name);
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}
