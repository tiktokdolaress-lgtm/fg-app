import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const SBURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co';

/* Vercel Cron (vercel.json): lembrete noturno de check-in para quem ainda não registrou o dia.
   Protegido pelo CRON_SECRET que a própria Vercel injeta no deployment. */
export async function GET(req) {
  const auth = req.headers.get('authorization') || '';
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ error: 'Faltam chaves no servidor.' }, { status: 500 });
  }

  const todayBRT = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const isSunday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short' }).format(new Date()) === 'Sun';
  const sb = createClient(SBURL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: subs } = await sb.from('push_subscriptions').select('user_id, endpoint, p256dh, auth_key');
  if (!subs || !subs.length) return NextResponse.json({ sent: 0 });

  webpush.setVapidDetails('mailto:suporte@forjandoguerreiros.com', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

  const byUser = {};
  for (const s of subs) (byUser[s.user_id] = byUser[s.user_id] || []).push(s);

  let sent = 0;
  for (const uid of Object.keys(byUser)) {
    const { data: prof } = await sb.from('warrior_profiles').select('data').eq('user_id', uid).maybeSingle();
    const d = prof && prof.data;
    if (!d) continue;
    if (d.settings && d.settings.notifDaily === false) continue;           // usuário desativou
    const ci = (d.checkins || {})[todayBRT];
    if (ci && (ci.ok || ci.fail)) continue;                                  // já registrou hoje
    for (const s of byUser[uid]) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
          JSON.stringify({ title: '⚔ Forjando Guerreiros', body: 'Você ainda não marcou seus pilares hoje. A forja espera por você.', tag: 'checkin-diario' }),
          { TTL: 3600 }
        );
        sent++;
      } catch (e) {
        if (e && (e.statusCode === 404 || e.statusCode === 410)) {
          await sb.from('push_subscriptions').delete().eq('endpoint', s.endpoint); // inscrição expirada
        }
      }
    }
    /* domingo: aviso de relatório semanal pronto */
    if (isSunday && !(d.settings && d.settings.notifWeekly === false)) {
      for (const s of byUser[uid]) {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
            JSON.stringify({ title: '📜 Relatório Semanal de Guerra', body: 'Vitórias, quedas, consistência e pureza da sua semana te esperam em Relatórios.', tag: 'relatorio-semanal' }),
            { TTL: 7200 }
          );
          sent++;
        } catch (e) {}
      }
    }
  }
  return NextResponse.json({ sent });
}
