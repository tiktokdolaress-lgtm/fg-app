import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wLosq4QyX61TqLIobDG93g_MPpLrAve';

/* Cliente único (funciona em SSR e no browser; auth/localStorage são guardados internamente) */
export const SB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const CLOUD = !!SB;

/* ---------- autenticação ---------- */
export async function signUp(email, password) {
  const r = await SB.auth.signUp({ email, password });
  if (r.error) throw r.error;
  return r.data;
}
export async function signIn(email, password) {
  const r = await SB.auth.signInWithPassword({ email, password });
  if (r.error) throw r.error;
  return r.data;
}
export async function signOut() {
  try { await SB.auth.signOut(); } catch (e) {}
}
export async function getSession() {
  try {
    const r = await SB.auth.getSession();
    return (r.data && r.data.session) || null;
  } catch (e) {
    return null;
  }
}
export async function resetPassword(email) {
  const r = await SB.auth.resetPasswordForEmail(email, { redirectTo: typeof location !== 'undefined' ? location.origin : undefined });
  if (r.error) throw r.error;
}
export function onAuth(cb) {
  const { data } = SB.auth.onAuthStateChange((ev, session) => cb(ev, session));
  return () => data.subscription.unsubscribe();
}

/* ---------- banco (warrior_profiles) ---------- */
export async function pullProfile(userId) {
  if (!SB || !userId || String(userId).indexOf('local:') === 0) return null;
  try {
    const r = await SB.from('warrior_profiles').select('data,updated_at,subscription_status').eq('user_id', userId).maybeSingle();
    if (r && r.data) {
      if (r.data.data && r.data.data.v) return r.data.data;
      return { __subOnly: true, subscription_status: r.data.subscription_status };
    }
    return null;
  } catch (e) {
    console.warn('DB pull error', e);
    return null;
  }
}

/* status de assinatura (coluna subscription_status da warrior_profiles) */
export async function getSubscription(userId) {
  if (!SB || !userId || String(userId).indexOf('local:') === 0) return 'local';
  try {
    const r = await SB.from('warrior_profiles').select('subscription_status').eq('user_id', userId).maybeSingle();
    return (r && r.data && r.data.subscription_status) || 'inactive';
  } catch (e) {
    console.warn('sub status error', e);
    return 'inactive';
  }
}

let pushTimer = null;
export function pushProfile(userId, email, S, immediate = false) {
  if (!SB || !userId || String(userId).indexOf('local:') === 0) return;
  clearTimeout(pushTimer);
  const payload = JSON.parse(JSON.stringify(S));
  payload.updated_at = new Date().toISOString();
  const doPush = () => {
    try {
      SB.from('warrior_profiles')
        .upsert({ user_id: userId, email, data: payload, updated_at: payload.updated_at }, { onConflict: 'user_id' })
        .then((r) => {
          if (r.error) console.warn('DB push error', r.error);
        })
        .catch((e) => console.warn('DB push catch', e));
    } catch (e) {}
  };
  if (immediate) doPush();
  else pushTimer = setTimeout(doPush, 400);
}

/* ---------- realtime ---------- */
export function subscribeProfile(userId, onChange) {
  if (!SB || !userId || String(userId).indexOf('local:') === 0) return () => {};
  const channel = SB.channel('warrior_' + userId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'warrior_profiles', filter: 'user_id=eq.' + userId },
      (payload) => {
        if (payload.new && payload.new.data) onChange(payload.new.data);
      }
    )
    .subscribe();
  return () => { try { SB.removeChannel(channel); } catch (e) {} };
}

/* ---------- modo local (fallback sem nuvem) ---------- */
export const localUsers = () => {
  try { return JSON.parse(localStorage.getItem('fg_local_users') || '{}'); } catch (e) { return {}; }
};
export const saveLocalUsers = (u) => { try { localStorage.setItem('fg_local_users', JSON.stringify(u)); } catch (e) {} };
export const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
  return 'h' + (h >>> 0);
};
