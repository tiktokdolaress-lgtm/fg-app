import { HABITS, QUOTES, TIERF, I18N } from './data';
import { daysBetween, today, dstr, parseD, yesterday } from './utils';

export const DEF = () => ({
  v: 1, onboarded: false, oath: false, name: '', age: '', lastPorn: '', lastMast: '', retStart: '',
  trigger: '', freq: 0, why: '', goal: 7, lifeStatus: 'single',
  settings: { sound: true, lang: 'pt', theme: 'dark', pin: '' },
  checkins: {}, forge: { active: [], done: {}, times: {}, since: {}, failed: {}, custom: [] },
  projects: [], tasks: [], journal: {}, notes: [],
  phrases: [], phraseIdx: 0, purity: 100, best: 0, sos: 0, sosLog: [], created: today(), updated_at: 0,
});

export const mergeS = (o) =>
  Object.assign(DEF(), o, {
    settings: Object.assign(DEF().settings, (o && o.settings) || {}),
    forge: Object.assign({ active: [], done: {}, times: {}, since: {}, failed: {}, custom: [] }, (o && o.forge) || {}),
  });

export const allH = (S) => HABITS.concat(S.forge.custom || []);
export const retDays = (S) => (S.retStart ? Math.max(0, daysBetween(S.retStart, today())) : 0);
export const lifeMode = (S) => S.lifeStatus || 'single';
export const modeA = (S) => lifeMode(S) === 'committedA';
export const pillars = (S) => (modeA(S) ? ['p', 'm'] : ['p', 'm', 'r']);
export const cleanDays = (S) => {
  const last = [S.lastPorn, S.lastMast].filter(Boolean).sort().pop();
  return last ? Math.max(0, daysBetween(last, today())) : retDays(S);
};
export const progressDays = (S) => (modeA(S) ? cleanDays(S) : retDays(S));
export const currentStreak = (S) => {
  let n = 0, d = today();
  if (!((S.checkins[d] || {}).ok)) d = yesterday(d);
  while ((S.checkins[d] || {}).ok) { n++; d = yesterday(d); }
  return n;
};
export const tierNow = (S) => TIERF(progressDays(S));
export const slotLimit = (S) => tierNow(S).slots;
export const ci = (S, d) => S.checkins[d] || { p: false, m: false, r: false };
export const fDone = (S, d) => S.forge.done[d] || [];
export const fFailed = (S, d) => (S.forge.failed || {})[d] || [];
export const hTime = (S, id) => (S.forge.times || {})[id] || '';
export const mantraPool = (S) => {
  const p = [S.why].concat(S.phrases, QUOTES).filter((x) => x && x.trim());
  return p.length ? p : ['Forje-se todos os dias.'];
};
export const habitMiss = (S, id) => {
  S.forge.since = S.forge.since || {};
  const since = S.forge.since[id] || S.created || today();
  let miss = 0, d = yesterday();
  for (let i = 0; i < 400; i++) {
    if (d < since) break;
    if ((S.forge.done[d] || []).includes(id)) break;
    miss++;
    d = yesterday(d);
  }
  return miss;
};
export const forgeWarnings = (S) =>
  S.forge.active
    .map((id) => allH(S).find((h) => h.id === id))
    .filter(Boolean)
    .map((h) => ({ h, miss: habitMiss(S, h.id) }))
    .filter((x) => x.miss >= 2);

export const repDue = (t, dateStr) => {
  const r = t.rep || 'unica';
  if (r === 'unica') return !t.done;
  const wd = parseD(dateStr).getDay();
  if (r === 'diaria') return true;
  if (r === 'semana') return wd >= 1 && wd <= 5;
  if (r === 'fds') return wd === 0 || wd === 6;
  if (r === 'semanal') return wd === (t.repDay == null ? 1 : Number(t.repDay));
  if (r === 'custom') return (t.repDays || []).indexOf(wd) >= 0;
  return true;
};
export const isDone = (t, dateStr) => ((t.rep || 'unica') === 'unica' ? !!t.done : (t.doneDates || []).includes(dateStr));

export const projTotal = (p) => (p.start && p.deadline ? Math.max(1, daysBetween(p.start, p.deadline) + 1) : 0);
export const projCurDay = (p) => {
  const tot = projTotal(p);
  if (!p.start || !tot) return 0;
  return Math.min(Math.max(daysBetween(p.start, today()) + 1, 0), tot);
};
export const projPct = (S, p) => {
  const linked = S.tasks.filter((t) => t.proj == p.id);
  const denom = linked.filter((t) => (t.rep || 'unica') === 'unica' || repDue(t, today()));
  const done = denom.filter((t) => isDone(t, today())).length;
  return { pct: denom.length ? Math.round((done / denom.length) * 100) : 0, denom: denom.length, done };
};
export const projStatus = (S, p) => {
  if (p.cancelled) return 'cancel';
  const m = projPct(S, p);
  if (m.denom > 0 && m.pct === 100) return 'done';
  if (p.deadline && daysBetween(today(), p.deadline) < 0) return 'late';
  return 'prog';
};
export const sosWins = (S) => (Array.isArray(S.sosLog) ? S.sosLog.length : 0);
export const sosLast = (S) => (Array.isArray(S.sosLog) && S.sosLog.length ? S.sosLog[S.sosLog.length - 1] : null);
export const daysBetweenSafe = (a) => daysBetween(a, today());
export { parseD };

export const T = (S, k) => {
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  return (I18N[lang] && I18N[lang][k]) || I18N.pt[k] || k;
};

/* ============ RELATÓRIO SEMANAL + MAPA DE RISCO ============ */
export const weekReport = (S) => {
  const days = [];
  for (let i = 6; i >= 0; i--) days.push(dstr(new Date(Date.now() - i * 86400000)));
  let wins = 0, falls = 0, part = 0, none = 0, habDone = 0;
  days.forEach((ds) => {
    const c = S.checkins[ds];
    if (c && c.ok) wins++; else if (c && c.fail) falls++; else if (c && (c.p || c.m || c.r)) part++; else none++;
    habDone += (S.forge.done[ds] || []).length;
  });
  const habPossible = (S.forge.active || []).length * 7;
  const sos = (S.sosLog || []).filter((e) => days.includes(e.d)).length;
  return { days, wins, falls, part, none, habDone, habPossible, consist: habPossible ? Math.round((habDone / habPossible) * 100) : 0, sos, purity: S.purity, streak: currentStreak(S), best: S.best, daysTotal: progressDays(S) };
};

export const urgeStats = (S) => {
  const buckets = Array.from({ length: 24 }, () => ({ n: 0, sum: 0 }));
  (S.urgeLog || []).forEach((e) => { const h = Math.max(0, Math.min(23, e.h | 0)); buckets[h].n++; buckets[h].sum += e.i || 0; });
  const total = (S.urgeLog || []).length;
  let bestStart = 0, bestVal = -1;
  for (let s = 0; s < 24; s++) {
    let v = 0;
    for (let k = 0; k < 3; k++) { const b = buckets[(s + k) % 24]; v += b.sum + b.n; }
    if (v > bestVal) { bestVal = v; bestStart = s; }
  }
  return { buckets, total, window: total ? [bestStart, (bestStart + 3) % 24] : null };
};
