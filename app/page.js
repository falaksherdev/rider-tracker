'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { today, range, shift, label } from '@/lib/dates';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import History from '@/components/History';
import SettingsView from '@/components/SettingsView';
import AddModal from '@/components/AddModal';

const DEFAULTS = { mileage: 40, petrolPrice: 280, reserveRate: 2, reserveMode: 'auto' };
const VIEWS = [['day', 'Day'], ['week', 'Week'], ['month', 'Month'], ['year', 'Year']];
const NAV = [['home', '📊', 'Home'], ['history', '🕘', 'History'], ['settings', '⚙️', 'Settings']];

export default function Home() {
  const [auth, setAuth] = useState('loading');
  const [settings, setSettings] = useState(DEFAULTS);
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('week');
  const [anchor, setAnchor] = useState(''); // mount ke baad set (hydration mismatch fix)
  const [appF, setAppF] = useState('All');
  const [tab, setTab] = useState('home');
  const [add, setAdd] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { setAnchor(today()); }, []);

  const load = useCallback(async () => {
    if (!anchor) return;
    try {
      const [from, to] = range(view, anchor);
      const [s, e] = await Promise.all([api('/api/settings'), api(`/api/entries?from=${from}&to=${to}`)]);
      setSettings(s); setEntries(e); setAuth('in'); setErr('');
    } catch (x) {
      if (x.status === 401) setAuth('out');
      else { setErr(x.message); setAuth((a) => (a === 'loading' ? 'in' : a)); }
    }
  }, [view, anchor]);
  useEffect(() => { load(); }, [load]);

  if (!anchor || auth === 'loading') return <div className="grid min-h-screen-d place-items-center text-zinc-500">Loading…</div>;
  if (auth === 'out') return <Login onDone={() => { setAuth('loading'); load(); }} />;

  const shown = appF === 'All' ? entries : entries.filter((e) => e.app === appF);

  return (
    <div className="mx-auto min-h-screen-d max-w-lg px-4"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}>
      <h1 className="mb-3 text-lg font-bold">🏍️ Rider <span className="text-emerald-400">Tracker</span></h1>
      {err && <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{err}</div>}

      {tab !== 'settings' && (
        <div className="mb-4 space-y-3">
          <div className="grid grid-cols-4 gap-1 rounded-xl bg-white/[0.05] p-1">
            {VIEWS.map(([k, n]) => (
              <button key={k} onClick={() => setView(k)}
                className={`rounded-lg py-2 text-sm font-medium ${view === k ? 'bg-emerald-400 text-black' : 'text-zinc-400'}`}>{n}</button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button className="btn bg-white/[0.06] !px-4 !py-2" onClick={() => setAnchor(shift(view, anchor, -1))}>‹</button>
            <span className="font-semibold">{label(view, anchor)}</span>
            <button className="btn bg-white/[0.06] !px-4 !py-2" onClick={() => setAnchor(shift(view, anchor, 1))}>›</button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['All', 'InDrive', 'Yango'].map((a) => (
              <button key={a} onClick={() => setAppF(a)} className={`chip whitespace-nowrap ${appF === a ? 'chip-on' : ''}`}>
                {a === 'All' ? 'All' : `${a} Only`}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'home' && <Dashboard entries={shown} settings={settings} view={view} anchor={anchor} />}
      {tab === 'history' && <History entries={shown} onChanged={load} />}
      {tab === 'settings' && <SettingsView settings={settings} onSaved={setSettings}
        onLogout={async () => { await api('/api/auth', { method: 'DELETE' }); setAuth('out'); }} />}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0d0f16]/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center px-2 py-2">
          {NAV.slice(0, 2).map(([k, i, n]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center py-1 text-xs ${tab === k ? 'text-emerald-300' : 'text-zinc-500'}`}>
              <span className="text-xl">{i}</span>{n}
            </button>
          ))}
          <button onClick={() => setAdd(true)} aria-label="Add entry"
            className="mx-auto -mt-7 grid h-14 w-14 place-items-center rounded-full bg-emerald-400 text-3xl font-bold text-black shadow-[0_0_24px_rgba(52,245,160,0.55)] active:scale-95">+</button>
          {NAV.slice(2).map(([k, i, n]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex flex-col items-center py-1 text-xs ${tab === k ? 'text-emerald-300' : 'text-zinc-500'}`}>
              <span className="text-xl">{i}</span>{n}
            </button>
          ))}
        </div>
      </nav>

      {add && <AddModal settings={settings} defaultApp={appF === 'All' ? 'InDrive' : appF}
        onClose={() => setAdd(false)} onSaved={() => { setAdd(false); load(); }} />}
    </div>
  );
}
