'use client';
import { api } from '@/lib/api';
import { C, n1, rs } from '@/lib/calc';
const META = { income: ['💰', 'Income', 1], fuel: ['⛽', 'Petrol', -1], maintenance: ['🔧', 'Repair', -1], commission: ['🧾', 'Commission', -1], km: ['📍', 'Daily KM', 0] };

export default function History({ entries, onChanged }) {
  async function del(id) {
    if (!confirm('Is entry ko delete karna hai?')) return;
    try { await api(`/api/entries/${id}`, { method: 'DELETE' }); onChanged(); } catch (e) { alert(e.message); }
  }
  if (!entries.length) return <p className="py-16 text-center text-zinc-500">Is period mein koi entry nahi. “+” dabayen.</p>;
  return (
    <ul className="space-y-2">
      {entries.map((e) => {
        const [icon, name, sign] = META[e.type];
        const sub = [e.date, e.km ? `${n1(e.km)} km` : '', e.liters ? `${n1(e.liters)} L` : '', e.category, e.note].filter(Boolean).join(' · ');
        return (
          <li key={e._id} className="card flex items-center gap-3 !p-3">
            <span className="text-2xl">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name} <span className="font-normal" style={{ color: C[e.app] }}>· {e.app}</span></p>
              <p className="truncate text-xs text-zinc-500">{sub}</p>
            </div>
            {sign !== 0 && <span className="font-bold" style={{ color: sign > 0 ? C.InDrive : '#ff4d6d' }}>{sign > 0 ? '+' : '−'}{rs(e.amount).replace('Rs ', '')}</span>}
            <button aria-label="Delete" onClick={() => del(e._id)} className="px-2 py-1 text-zinc-500 active:text-red-400">✕</button>
          </li>
        );
      })}
    </ul>
  );
}
