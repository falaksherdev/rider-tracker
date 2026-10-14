export async function api(url, opts = {}) {
  const res = await fetch(url, {
    cache: 'no-store', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts, body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) { const e = new Error(data?.error || `Error ${res.status}`); e.status = res.status; throw e; }
  return data;
}
