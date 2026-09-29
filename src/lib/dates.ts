const pad = (n: number) => String(n).padStart(2, '0');
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function parseISO(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
export function toISO(d: Date): string {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
export function fmt(d: Date | null): string {
  return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() : '[data]';
}
export function fmtShort(d: Date | null): string {
  return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) : '--';
}
export function monthAbbr(d: Date | null): string {
  return d ? MESES[d.getMonth()] : '';
}
export function addMonths(d: Date, n: number): Date {
  const r = new Date(d); r.setMonth(r.getMonth() + n); return r;
}
export function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
export function daysUntil(d: Date): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}
