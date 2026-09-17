import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeS, progressDays, tierNow, currentStreak, sosWins } from '@/lib/logic';

/* Cartão de responsabilidade somente-leitura (link do parceiro). */
export async function GET(req, { params }) {
  const token = params.token || '';
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !token) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 });
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await sb.from('warrior_profiles').select('data').filter('data->>partnerToken', 'eq', token).maybeSingle();
  if (!data || !data.data || !data.data.partnerToken) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 });
  const S2 = mergeS(data.data);
  return NextResponse.json({
    name: S2.hallName || 'Guerreiro',
    days: progressDays(S2),
    best: S2.best || 0,
    streak: currentStreak(S2),
    purity: S2.purity,
    sos: sosWins(S2),
    tier: tierNow(S2).name,
    tierIcon: tierNow(S2).icon,
  });
}
