import Settings from '@/models/Settings';
import { guard } from '@/lib/server';
export const dynamic = 'force-dynamic';
const get = () => Settings.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true, new: true }).lean();
export const GET = guard(async () => Response.json(await get()));
export const PUT = guard(async (req) => {
  const b = await req.json();
  const pos = (v, d) => (Number.isFinite(+v) && +v > 0 ? +v : d);
  const upd = {
    mileage: pos(b.mileage, 40), petrolPrice: pos(b.petrolPrice, 280),
    reserveRate: Number.isFinite(+b.reserveRate) && +b.reserveRate >= 0 ? +b.reserveRate : 2,
    reserveMode: b.reserveMode === 'actual' ? 'actual' : 'auto',
  };
  return Response.json(await Settings.findOneAndUpdate({ key: 'main' }, { $set: upd }, { upsert: true, new: true }).lean());
});
