import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const SBURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co';

/* LGPD: exclusão definitiva de conta e dados.
   Cancela assinatura Stripe ativa/trialing, apaga perfil, push e o usuário do Auth. */
export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  const sbAnon = createClient(SBURL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  const { data, error } = await sbAnon.auth.getUser(token);
  if (error || !data || !data.user) return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
  const user = data.user;

  const sb = createClient(SBURL, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

  /* 1) cancela assinatura ativa/trialing na Stripe */
  try {
    const { data: prof } = await sb.from('warrior_profiles').select('stripe_customer_id, subscription_status').eq('user_id', user.id).maybeSingle();
    if (prof && prof.stripe_customer_id && process.env.STRIPE_SECRET_KEY && ['active', 'trialing', 'past_due'].includes(prof.subscription_status)) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const list = await stripe.subscriptions.list({ customer: prof.stripe_customer_id, status: 'all' });
      for (const sub of list.data) {
        if (['active', 'trialing', 'past_due'].includes(sub.status)) {
          await stripe.subscriptions.cancel(sub.id).catch(() => {});
        }
      }
    }
  } catch (e) { console.error('stripe cancel:', e); }

  /* 2) apaga dados */
  await sb.from('push_subscriptions').delete().eq('user_id', user.id);
  await sb.from('warrior_profiles').delete().eq('user_id', user.id);

  /* 3) apaga o usuário do Auth */
  const del = await sb.auth.admin.deleteUser(user.id);
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
