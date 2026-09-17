/* Helpers de notificação: permissão, push (VAPID) e lembretes locais */
import { today } from './utils';

export const pushSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export async function ensureSw() {
  if (!pushSupported()) return null;
  try { return await navigator.serviceWorker.register('/sw.js'); } catch (e) { return null; }
}

export async function askPermission() {
  if (!pushSupported()) return 'denied';
  if (Notification.permission === 'default') return await Notification.requestPermission();
  return Notification.permission;
}

function b64ToUint8(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function subscribePush(token) {
  const reg = await ensureSw();
  if (!reg) throw new Error('Service worker indisponível neste navegador.');
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) throw new Error('VAPID pública não configurada.');
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToUint8(key) });
  const j = sub.toJSON();
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth_key: j.keys.auth }),
  });
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Falha ao salvar a inscrição de push.'); }
  return sub;
}

export async function unsubscribePush(token) {
  const reg = await ensureSw();
  const sub = reg && (await reg.pushManager.getSubscription());
  if (!sub) return;
  const endpoint = sub.endpoint;
  try { await sub.unsubscribe(); } catch (e) {}
  if (token) {
    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ endpoint }),
    }).catch(() => {});
  }
}

export function localNotify(title, body) {
  if (!pushSupported() || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, tag: 'fg-local' }); } catch (e) {}
}

/* Lembretes locais (com o app aberto): horários dos hábitos + check-in às 20h */
export function scheduleLocalTimers(S, habits, enabled) {
  const timers = [];
  if (!enabled || !pushSupported() || Notification.permission !== 'granted') return () => {};
  const now = new Date();
  const fireAt = (h, m, title, body) => {
    const t = new Date(); t.setHours(h, m, 0, 0);
    const ms = t - now;
    if (ms > 0 && ms < 12 * 3600 * 1000) timers.push(setTimeout(() => localNotify(title, body), ms));
  };
  if (S.settings.notifHabits !== false) {
    (S.forge.active || []).forEach((id) => {
      const tm = (S.forge.times || {})[id];
      if (!tm) return;
      const hab = habits.find((x) => x.id === id);
      const [hh, mm] = tm.split(':').map(Number);
      fireAt(hh, mm, '⏰ ' + tm + ' — ' + (hab ? hab.n : 'Hábito'), 'Hora do hábito na Forja. Conclua e marque no QG.');
    });
  }
  if (S.settings.notifDaily !== false) {
    const ci = (S.checkins || {})[today()];
    if (!(ci && (ci.ok || ci.fail))) fireAt(20, 0, '⚔ Check-in de hoje', 'Você ainda não registrou seus pilares hoje. A forja espera por você.');
  }
  return () => timers.forEach(clearTimeout);
}
