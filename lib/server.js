import { isAuthed } from './auth';
import { connectDB } from './db';
// Har API route ko auth + DB connect + error handling ke sath wrap karta hai
export const guard = (fn) => async (req, ctx) => {
  if (!isAuthed()) return Response.json({ error: 'Login zaroori hai' }, { status: 401 });
  try { await connectDB(); return await fn(req, ctx); }
  catch (e) { console.error(e); return Response.json({ error: e.message || 'Server error' }, { status: 500 }); }
};
