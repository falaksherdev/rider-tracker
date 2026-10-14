import mongoose from 'mongoose';
import Entry from '@/models/Entry';
import { guard } from '@/lib/server';
export const dynamic = 'force-dynamic';
export const DELETE = guard(async (_req, { params }) => {
  if (!mongoose.isValidObjectId(params.id)) return Response.json({ error: 'Invalid id' }, { status: 400 });
  await Entry.findByIdAndDelete(params.id);
  return Response.json({ ok: true });
});
