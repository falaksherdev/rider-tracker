// Dates hamesha "YYYY-MM-DD" string + LOCAL time (UTC bug / timezone shift se bachne ke liye)
const pad = (n) => String(n).padStart(2, '0');
export const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => fmt(new Date());
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export function range(view, anchor) {
  const d = parse(anchor);
  if (view === 'day') return [anchor, anchor];
  if (view === 'week') { const s = addDays(d, -((d.getDay() + 6) % 7)); return [fmt(s), fmt(addDays(s, 6))]; }
  if (view === 'month') return [fmt(new Date(d.getFullYear(), d.getMonth(), 1)), fmt(new Date(d.getFullYear(), d.getMonth() + 1, 0))];
  return [`${d.getFullYear()}-01-01`, `${d.getFullYear()}-12-31`];
}
export function shift(view, anchor, dir) {
  const d = parse(anchor);
  if (view === 'day') return fmt(addDays(d, dir));
  if (view === 'week') return fmt(addDays(d, 7 * dir));
  if (view === 'month') return fmt(new Date(d.getFullYear(), d.getMonth() + dir, 1));
  return fmt(new Date(d.getFullYear() + dir, 0, 1));
}
const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function label(view, anchor) {
  const d = parse(anchor);
  if (view === 'day') return `${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`;
  if (view === 'week') { const [a, b] = range(view, anchor).map(parse); return `${a.getDate()} ${M[a.getMonth()]} – ${b.getDate()} ${M[b.getMonth()]}`; }
  if (view === 'month') return `${M[d.getMonth()]} ${d.getFullYear()}`;
  return String(d.getFullYear());
}
