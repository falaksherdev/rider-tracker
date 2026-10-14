'use client';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { addDays, fmt, parse, range } from '@/lib/dates';
import { C, rs } from '@/lib/calc';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const tip = { contentStyle: { background: '#12141c', border: '1px solid #ffffff20', borderRadius: 12, color: '#fff' }, labelStyle: { color: '#aaa' } };

export default function Charts({ entries, view, anchor }) {
  const [from, to] = range(view, anchor);
  const rows = [];
  if (view === 'year') {
    const y = parse(anchor).getFullYear();
    MONTHS.forEach((m, i) => rows.push({ k: `${y}-${String(i + 1).padStart(2, '0')}`, name: m, InDrive: 0, Yango: 0, Other: 0 }));
  } else {
    for (let d = parse(from); fmt(d) <= to; d = addDays(d, 1))
      rows.push({ k: fmt(d), name: view === 'week' ? DAYS[d.getDay()] : String(d.getDate()), InDrive: 0, Yango: 0, Other: 0 });
  }
  const idx = Object.fromEntries(rows.map((r) => [r.k, r]));
  let fuel = 0, maint = 0;
  for (const e of entries) {
    if (e.type === 'income') { const r = idx[view === 'year' ? e.date.slice(0, 7) : e.date]; if (r) r[e.app] += e.amount; }
    if (e.type === 'fuel') fuel += e.amount;
    if (e.type === 'maintenance') maint += e.amount;
  }
  const pie = [{ name: 'Petrol', value: fuel, c: C.fuel }, { name: 'Maintenance', value: maint, c: C.maint }].filter((p) => p.value > 0);

  return (
    <div className="space-y-4">
      <div className="card">
        <p className="mb-2 text-sm font-semibold">Earnings: InDrive vs Yango</p>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ left: -18, right: 4, top: 4 }}>
              <CartesianGrid stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="name" stroke="#777" fontSize={11} interval="preserveStartEnd" />
              <YAxis stroke="#777" fontSize={11} />
              <Tooltip {...tip} formatter={(v) => rs(v)} cursor={{ fill: '#ffffff08' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="InDrive" fill={C.InDrive} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Yango" fill={C.Yango} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Other" fill={C.Other} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <p className="mb-2 text-sm font-semibold">Fuel vs Maintenance</p>
        {pie.length === 0 ? <p className="py-8 text-center text-sm text-zinc-500">Is period mein koi kharcha nahi</p> : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} stroke="none">
                  {pie.map((p) => <Cell key={p.name} fill={p.c} />)}
                </Pie>
                <Tooltip {...tip} formatter={(v) => rs(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
