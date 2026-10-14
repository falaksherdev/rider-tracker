'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { today } from '@/lib/dates';
import { n1 } from '@/lib/calc';

const APPS = ['InDrive', 'Yango', 'Other'];
const TYPES = [['income', '💰 Income'], ['fuel', '⛽ Petrol'], ['maintenance', '🔧 Repair'], ['commission', '🧾 Commission'], ['km', '📍 Daily KM']];
const CATS = ['Oil Change', 'Tuning', 'Tyres', 'Brakes', 'Minor Repair', 'Custom'];
const Field = ({ label, children }) => (<label className="block"><span className="mb-1 block text-xs text-zinc-400">{label}</span>{children}</label>);

export default function AddModal({ settings, defaultApp, onClose, onSaved }) {
  const [app, setApp] = useState(defaultApp);
  const [type, setType] = useState('income');
  const [f, setF] = useState({ date: today(), amount: '', km: '', price: String(settings.petrolPrice), category: CATS[0], custom: '', note: '', cmode: 'amount', fare: '', pct: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // iOS: modal khulne par peeche ka page scroll na ho
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = o; }; }, []);

  const liters = +f.amount > 0 && +f.price > 0 ? +f.amount / +f.price : 0;
  const commAmt = f.cmode === 'pct' ? ((+f.fare || 0) * (+f.pct || 0)) / 100 : +f.amount || 0;

  async function save() {
    const body = { type, app, date: f.date, note: f.note };
    if (type === 'income') { body.amount = +f.amount; body.km = +f.km || 0; }
    if (type === 'fuel') { body.amount = +f.amount; body.petrolPrice = +f.price; }
    if (type === 'maintenance') { body.amount = +f.amount; body.category = f.category === 'Custom' ? f.custom || 'Custom' : f.category; }
    if (type === 'commission') body.amount = commAmt;
    if (type === 'km') body.km = +f.km;
    if (type === 'km' ? !(body.km > 0) : !(body.amount > 0)) return setErr('Sahi value likhein');
    setBusy(true); setErr('');
    try { await api('/api/entries', { method: 'POST', body }); onSaved(); }
    catch (e) { setErr(e.message); setBusy(false); }
  }

  const num = (k, ph) => <input className="input" type="number" inputMode="decimal" step="any" min="0" placeholder={ph} value={f[k]} onChange={set(k)} />;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={onClose}>
      <div className="mx-auto max-h-[92dvh] w-full max-w-lg space-y-4 overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0f1118] p-5"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add Entry</h2>
          <button onClick={onClose} className="px-2 text-2xl text-zinc-400" aria-label="Close">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.05] p-1">
          {APPS.map((a) => (
            <button key={a} onClick={() => setApp(a)} className={`rounded-lg py-2 text-sm font-medium ${app === a ? 'bg-emerald-400 text-black' : 'text-zinc-400'}`}>{a}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPES.map(([k, n]) => (<button key={k} onClick={() => { setType(k); setErr(''); }} className={`chip ${type === k ? 'chip-on' : ''}`}>{n}</button>))}
        </div>

        <Field label="Date"><input className="input" type="date" value={f.date} onChange={set('date')} /></Field>

        {type === 'income' && (<>
          <Field label={`${app} Earnings (Rs)`}>{num('amount', '0')}</Field>
          <Field label="Ride distance (KM)">{num('km', '0')}</Field>
        </>)}
        {type === 'fuel' && (<>
          <Field label="Petrol amount (Rs)">{num('amount', '0')}</Field>
          <Field label="Petrol price / liter (Rs)">{num('price', '0')}</Field>
          <p className="text-sm text-emerald-300">≈ {n1(liters)} liters</p>
        </>)}
        {type === 'maintenance' && (<>
          <Field label="Amount (Rs)">{num('amount', '0')}</Field>
          <Field label="Category">
            <select className="input" value={f.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          {f.category === 'Custom' && <Field label="Custom category"><input className="input" value={f.custom} onChange={set('custom')} placeholder="e.g. Chain set" /></Field>}
        </>)}
        {type === 'commission' && (<>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1">
            {[['amount', 'Amount (Rs)'], ['pct', '% of fare']].map(([k, n]) => (
              <button key={k} onClick={() => setF({ ...f, cmode: k })} className={`rounded-lg py-2 text-sm ${f.cmode === k ? 'bg-white/15 text-white' : 'text-zinc-400'}`}>{n}</button>
            ))}
          </div>
          {f.cmode === 'amount' ? <Field label="Commission (Rs)">{num('amount', '0')}</Field> : (<>
            <Field label="Ride fare (Rs)">{num('fare', '0')}</Field>
            <Field label="Commission %">{num('pct', '10')}</Field>
            <p className="text-sm text-emerald-300">= Rs {n1(commAmt)}</p>
          </>)}
        </>)}
        {type === 'km' && (<>
          <Field label="Total KM driven today">{num('km', '0')}</Field>
          <p className="text-xs text-zinc-500">Agar ride income mein KM already likhe hain to unhein yahan dobara na likhein (double count ho jayega).</p>
        </>)}

        <Field label="Note (optional)"><input className="input" value={f.note} onChange={set('note')} maxLength={200} /></Field>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-neon w-full" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save Entry'}</button>
      </div>
    </div>
  );
}
