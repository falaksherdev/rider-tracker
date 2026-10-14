'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
export default function Login({ onDone }) {
  const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setErr('');
    try { await api('/api/auth', { method: 'POST', body: { password: pw } }); onDone(); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="grid min-h-screen-d place-items-center px-6">
      <div className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">🏍️ Rider <span className="text-emerald-400">Tracker</span></h1>
        <input className="input" type="password" placeholder="Password" value={pw} autoComplete="current-password"
          onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-neon w-full" disabled={busy} onClick={submit}>{busy ? '...' : 'Login'}</button>
      </div>
    </div>
  );
}
