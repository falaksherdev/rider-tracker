'use client';
import dynamic from 'next/dynamic';
import { C, n1, rs, summarize } from '@/lib/calc';
// recharts sirf browser mein (SSR/hydration errors se bachne ke liye)
const Charts = dynamic(() => import('./Charts'), { ssr: false, loading: () => <div className="card h-64 animate-pulse" /> });

const Stat = ({ label, value, sub, color }) => (
  <div className="card">
    <p className="text-xs text-zinc-400">{label}</p>
    <p className="mt-1 text-xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
  </div>
);

export default function Dashboard({ entries, settings, view, anchor }) {
  const s = summarize(entries, settings);
  const over = s.budgetLeft < 0;
  const pct = s.reserve > 0 ? Math.min(100, (s.maint / s.reserve) * 100) : s.maint > 0 ? 100 : 0;
  return (
    <div className="space-y-4">
      <div className="card text-center" style={{ boxShadow: `0 0 30px ${s.net >= 0 ? 'rgba(52,245,160,.15)' : 'rgba(255,61,110,.15)'}` }}>
        <p className="text-sm text-zinc-400">True Net Profit</p>
        <p className="text-4xl font-extrabold" style={{ color: s.net >= 0 ? C.InDrive : '#ff4d6d' }}>{rs(s.net)}</p>
        <p className="mt-1 text-xs text-zinc-500">
          Gross − Petrol − Commission − {s.auto ? 'Reserve (auto)' : 'Maintenance (actual)'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="InDrive Earnings" value={rs(s.earn.InDrive)} color={C.InDrive} />
        <Stat label="Yango Earnings" value={rs(s.earn.Yango)} color={C.Yango} />
        <Stat label="Gross Income" value={rs(s.gross)} sub={s.earn.Other ? `Other: ${rs(s.earn.Other)}` : undefined} />
        <Stat label="Total KM" value={`${n1(s.km)} km`} />
        <Stat label="Petrol Expense" value={rs(s.petrol)} sub={`${n1(s.liters)} L consumed`} color={C.fuel} />
        <Stat label="Commission Paid" value={rs(s.commission)} sub={`InDrive ${rs(s.comm.InDrive)} · Yango ${rs(s.comm.Yango)}`} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Reserve vs Actual Maintenance</p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${over ? 'bg-red-500/20 text-red-300' : 'bg-emerald-400/20 text-emerald-300'}`}>
            {over ? 'Over Budget' : 'Within Budget'}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: over ? '#ff4d6d' : C.maint }} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
          <div><p className="text-xs text-zinc-500">Reserve (Rs {settings.reserveRate}/km)</p><p className="font-bold">{rs(s.reserve)}</p></div>
          <div><p className="text-xs text-zinc-500">Spent</p><p className="font-bold" style={{ color: C.maint }}>{rs(s.maint)}</p></div>
          <div><p className="text-xs text-zinc-500">{over ? 'Over by' : 'Left'}</p>
            <p className="font-bold" style={{ color: over ? '#ff4d6d' : C.InDrive }}>{rs(Math.abs(s.budgetLeft))}</p></div>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Mode: {s.auto ? 'Auto reserve deduct — profit mein reserve minus hota hai' : 'Actual expense — profit mein sirf asal kharcha minus hota hai'}
        </p>
      </div>

      <div className="card">
        <p className="mb-3 text-sm font-semibold">Efficiency</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-xs text-zinc-500">Cost / km</p><p className="font-bold">Rs {n1(s.costPerKm)}</p></div>
          <div><p className="text-xs text-zinc-500">Earn / km</p><p className="font-bold">Rs {n1(s.earnPerKm)}</p></div>
          <div><p className="text-xs text-zinc-500">Net / km</p><p className="font-bold">Rs {n1(s.netPerKm)}</p></div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-center">
          <div><p className="text-xs text-zinc-500">Real mileage</p><p className="font-bold">{s.actualKmpl ? `${n1(s.actualKmpl)} km/l` : '—'}</p></div>
          <div><p className="text-xs text-zinc-500">Setting: {settings.mileage} km/l</p><p className="font-bold">{n1(s.expectedLiters)} L expected</p></div>
        </div>
      </div>

      <Charts entries={entries} view={view} anchor={anchor} />
    </div>
  );
}
