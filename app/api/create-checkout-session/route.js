import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

/* Cria a sessão do Stripe Checkout (assinatura com 7 dias grátis).
   A moeda (BRL/USD) é escolhida NO SERVIDOR pelo país de origem (header da Vercel) — anti-burla. */
export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY não configurada no servidor.' }, { status: 500 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    /* 1) valida o token do Supabase enviado pelo front */
    const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wLosq4QyX61TqLIobDG93g_MPpLrAve'
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
    const user = data.user;

    /* 2) trava geográfica: Brasil → BRL, resto do mundo → USD */
    const country = req.headers.get('x-vercel-ip-country') || 'BR';
    const priceId = country === 'BR' ? process.env.STRIPE_PRICE_ID_BRL : process.env.STRIPE_PRICE_ID_USD;
    if (!priceId) return NextResponse.json({ error: 'Price ID da moeda não configurado.' }, { status: 500 });

    const origin = req.headers.get('origin') || process.env.SITE_URL || 'http://localhost:3000';

    /* 3) sessão de checkout: assinatura + trial de 7 dias */
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 7, metadata: { userId: user.id } },
      metadata: { userId: user.id },
      success_url: `${origin}/app/?success=true`,
      cancel_url: `${origin}/app/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Erro na sessão de checkout:', err);
    return NextResponse.json({ error: err && err.message ? err.message : 'Erro interno.' }, { status: 500 });
  }
}
