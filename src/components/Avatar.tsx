import { useEffect, useState } from 'react';
import { signedUrl } from '../lib/storage';
import type { Profile } from '../lib/types';

const CORES: Record<string, string> = { aleff: '#004d98', paula: '#a50044', boris: '#00306a', sol: '#8a0039' };

export function Avatar({ profile, size = 36, ring }: { profile: Profile; size?: number; ring?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (profile.photo_path) signedUrl('fotos', profile.photo_path).then((u) => alive && setUrl(u));
    else setUrl(null);
    return () => { alive = false; };
  }, [profile.photo_path]);

  const style = { width: size, height: size, border: ring ? `2px solid ${ring}` : undefined } as const;
  if (url) return <img className="avatar" src={url} alt={'Foto de ' + profile.name} style={style} />;
  return (
    <span className="avatar" aria-hidden="true" style={{ ...style, background: CORES[profile.slug] ?? '#004d98', fontSize: Math.round(size * 0.42) }}>
      {profile.name.charAt(0).toUpperCase()}
    </span>
  );
}
