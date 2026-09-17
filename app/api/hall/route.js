import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mergeS, progressDays, tierNow, currentStreak } from '@/lib/logic';

/* Salão da Fama anônimo (opt-in): pseudônimo + dias + patamar. Sem nome, e-mail ou detalhes. */
export async function GET() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json([]);
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txtvusttcbdkcXgsdazm.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data } = await sb.from('warrior_profiles').select('data');
  if (!data) return NextResponse.json([]);
  const list = [];
  for (const row of data) {
    const d = row.data;
    if (!d || !d.v || !d.hallOptIn) continue;
    const S2 = mergeS(d);
    list.push({ name: d.hallName || 'Guerreiro Anônimo', days: progressDays(S2), tier: tierNow(S2).icon, streak: currentStreak(S2) });
  }
  list.sort((a, b) => b.days - a.days);
  return NextResponse.json(list.slice(0, 25));
}
