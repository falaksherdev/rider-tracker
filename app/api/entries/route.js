import Entry from '@/models/Entry';
import Settings from '@/models/Settings';
import { guard } from '@/lib/server';
export const dynamic = 'force-dynamic';
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TYPES = ['income', 'fuel', 'maintenance', 'commission', 'km'];
const APPS = ['InDrive', 'Yango', 'Other'];
const num = (v) => (Number.isFinite(+v) && +v >= 0 && +v < 1e8 ? +v : 0);

export const GET = guard(async (req) => {
  const p = new URL(req.url).searchParams;
  const q = {};
  const from = p.get('from'), to = p.get('to'), app = p.get('app');
  if (DATE.test(from || '') && DATE.test(to || '')) q.date = { $gte: from, $lte: to };
  if (APPS.includes(app)) q.app = app;
  return Response.json(await Entry.find(q).sort({ date: -1, createdAt: -1 }).limit(3000).lean());
});

export const POST = guard(async (req) => {
  const b = await req.json();
  if (!TYPES.includes(b.type)) return Response.json({ error: 'Invalid type' }, { status: 400 });
  if (!DATE.test(b.date || '')) return Response.json({ error: 'Invalid date' }, { status: 400 });
  const d = {
    type: b.type, app: APPS.includes(b.app) ? b.app : 'Other', date: b.date,
    amount: num(b.amount), km: num(b.km), category: String(b.category || '').slice(0, 40),
    note: String(b.note || '').slice(0, 200),
  };
  if (b.type === 'km' ? d.km <= 0 : d.amount <= 0) return Response.json({ error: 'Value zaroori hai' }, { status: 400 });
  if (b.type === 'fuel') {
    const s = await Settings.findOne({ key: 'main' }).lean();
    d.petrolPrice = num(b.petrolPrice) || s?.petrolPrice || 0;
    d.liters = d.petrolPrice ? Math.round((d.amount / d.petrolPrice) * 100) / 100 : 0;
  }
  return Response.json(await Entry.create(d), { status: 201 });
});
