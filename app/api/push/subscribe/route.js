import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SBURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co';
const SBKEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wLosq4QyX61TqLIobDG93g_MPpLrAve';

async function userFrom(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!token) return null;
  const sb = createClient(SBURL, SBKEY);
  const { data, error } = await sb.auth.getUser(token);
  return error ? null : data.user;
}

/* salva a inscrição de push do navegador (uma por endpoint) */
export async function POST(req) {
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const b = await req.json();
  if (!b.endpoint || !b.p256dh || !b.auth_key) return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  const sb = createClient(SBURL, SBKEY);
  const { error } = await sb
    .from('push_subscriptions')
    .upsert({ user_id: user.id, endpoint: b.endpoint, p256dh: b.p256dh, auth_key: b.auth_key }, { onConflict: 'endpoint' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/* remove a inscrição (desativar notificações) */
export async function DELETE(req) {
  const user = await userFrom(req);
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const sb = createClient(SBURL, SBKEY);
  await sb.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', b.endpoint || '');
  return NextResponse.json({ ok: true });
}
