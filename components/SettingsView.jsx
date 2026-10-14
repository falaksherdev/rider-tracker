'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function SettingsView({ settings, onSaved, onLogout }) {
  const [f, setF] = useState({ mileage: String(settings.mileage), petrolPrice: String(settings.petrolPrice), reserveRate: String(settings.reserveRate), reserveMode: settings.reserveMode });
  const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  async function save() {
    setBusy(true); setMsg('');
    try { onSaved(await api('/api/settings', { method: 'PUT', body: f })); setMsg('✅ Saved'); }
    catch (e) { setMsg(e.message); } finally { setBusy(false); }
  }
  const inp = (k) => <input className="input mt-1" type="number" inputMode="decimal" step="any" min="0" value={f[k]} onChange={set(k)} />;
  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <label className="block text-sm text-zinc-300">Bike mileage (km per liter){inp('mileage')}</label>
        <label className="block text-sm text-zinc-300">Petrol price per liter (Rs){inp('petrolPrice')}</label>
        <div>
          <p className="text-sm text-zinc-300">Reserve fund rate (Rs per KM)</p>
          <div className="mt-2 flex gap-2">
            {['2', '3'].map((v) => (<button key={v} onClick={() => setF({ ...f, reserveRate: v })} className={`chip ${f.reserveRate === v ? 'chip-on' : ''}`}>Rs {v}/km</button>))}
          </div>
          {inp('reserveRate')}
        </div>
        <div>
          <p className="mb-2 text-sm text-zinc-300">Reserve handling mode</p>
          {[['auto', 'Auto Reserve Deduct Daily', 'KM × rate profit se automatically minus hoga'], ['actual', 'Actual Expense When Spent', 'Sirf jab repair par paisa lagay tab minus hoga']].map(([k, t, d]) => (
            <button key={k} onClick={() => setF({ ...f, reserveMode: k })}
              className={`mb-2 w-full rounded-xl border p-3 text-left ${f.reserveMode === k ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/10'}`}>
              <p className="font-semibold">{t}</p><p className="text-xs text-zinc-400">{d}</p>
            </button>
          ))}
        </div>
        <button className="btn-neon w-full" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save Settings'}</button>
        {msg && <p className="text-center text-sm text-zinc-300">{msg}</p>}
      </div>
      <button className="btn w-full border border-white/10 text-zinc-300" onClick={onLogout}>Logout</button>
    </div>
  );
}
