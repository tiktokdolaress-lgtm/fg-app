import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

/* Webhook do Stripe: cria ou atualiza automaticamente o guerreiro no Supabase.
   Garante acesso IMEDIATO a novos clientes autenticados via Google ou e-mail. */
export async function POST(req) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Chaves do Stripe ausentes.', { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    // 1) Quando o cliente conclui o checkout (início do teste grátis)
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      const userId = s.metadata && s.metadata.userId;
      if (userId) {
        await supabase
          .from('warrior_profiles')
          .upsert({
            user_id: userId,
            email: s.customer_email || s.customer_details?.email || null,
            stripe_customer_id: s.customer || null,
            subscription_status: 'trialing',
            plan_type: 'premium',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }
    }

    // 2) Criação ou renovação de assinatura
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const userId = sub.metadata && sub.metadata.userId;
      const status = sub.status; // trialing | active | past_due | canceled ...
      if (userId) {
        await supabase
          .from('warrior_profiles')
          .upsert({
            user_id: userId,
            subscription_status: status,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } else if (sub.customer) {
        await supabase
          .from('warrior_profiles')
          .update({ subscription_status: status })
          .eq('stripe_customer_id', sub.customer);
      }
    }

    // 3) Se o cliente cancelar
    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      if (sub.customer) {
        await supabase
          .from('warrior_profiles')
          .update({ subscription_status: 'canceled' })
          .eq('stripe_customer_id', sub.customer);
      }
    }
  } catch (e) {
    console.error('Erro ao aplicar webhook no Supabase:', e);
  }

  return NextResponse.json({ received: true });
}
