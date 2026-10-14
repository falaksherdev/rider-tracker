export const C = { InDrive: '#34f5a0', Yango: '#ffd60a', Other: '#22d3ee', fuel: '#fb923c', maint: '#a78bfa' };
export const rs = (n) => `${n < 0 ? '-' : ''}Rs ${Math.round(Math.abs(n || 0)).toLocaleString('en-US')}`;
export const n1 = (n) => (Number.isFinite(n) ? Math.round(n * 10) / 10 : 0).toLocaleString('en-US');

export function summarize(entries, s) {
  const r = { earn: { InDrive: 0, Yango: 0, Other: 0 }, comm: { InDrive: 0, Yango: 0, Other: 0 }, petrol: 0, liters: 0, maint: 0, km: 0 };
  for (const e of entries) {
    r.km += e.km || 0;
    if (e.type === 'income') r.earn[e.app] += e.amount;
    else if (e.type === 'commission') r.comm[e.app] += e.amount;
    else if (e.type === 'fuel') { r.petrol += e.amount; r.liters += e.liters || 0; }
    else if (e.type === 'maintenance') r.maint += e.amount;
  }
  r.gross = r.earn.InDrive + r.earn.Yango + r.earn.Other;
  r.commission = r.comm.InDrive + r.comm.Yango + r.comm.Other;
  r.reserve = r.km * (s.reserveRate || 0);
  r.budgetLeft = r.reserve - r.maint;
  r.auto = s.reserveMode === 'auto';
  r.deduction = r.auto ? r.reserve : r.maint;
  r.net = r.gross - r.petrol - r.commission - r.deduction;
  r.costPerKm = r.km ? (r.petrol + r.commission + r.deduction) / r.km : 0;
  r.earnPerKm = r.km ? r.gross / r.km : 0;
  r.netPerKm = r.km ? r.net / r.km : 0;
  r.actualKmpl = r.liters ? r.km / r.liters : 0;
  r.expectedLiters = s.mileage ? r.km / s.mileage : 0;
  return r;
}
