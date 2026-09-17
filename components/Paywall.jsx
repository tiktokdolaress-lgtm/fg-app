'use client';
import React, { useState } from 'react';
import { ShieldCheck, Crown, Flame, Siren, BookOpen, ChartNoAxesColumn, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import * as cloud from '@/lib/supabase';
import { AF } from '@/lib/audio';

export default function Paywall() {
  const { toast, auth, refreshSub, subChecking } = useApp();
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState(null); // preço da região do visitante (1 moeda só)

  React.useEffect(() => {
    let alive = true;
    fetch('/api/region-price')
      .then((r) => r.json())
      .then((d) => { if (alive && d && d.price) setPrice(d.price); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const startTrial = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const sess = await cloud.getSession();
      if (!sess || !sess.access_token) throw new Error('Sessão expirada — entre novamente.');
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sess.access_token },
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Falha ao iniciar o checkout.');
      window.location.href = data.url;
    } catch (e) {
      toast('⚠ ' + (e.message || 'Erro ao abrir o checkout.'));
      setBusy(false);
    }
  };

  const BENEFITS = [
    [Flame, 'QG completo: retenção, pureza e patamares de guerra'],
    [Siren, 'Protocolo S.O.S de 5 minutos com respiração guiada'],
    [BookOpen, 'Diário de Bordo, notas de campo e relatórios ilimitados'],
    [ChartNoAxesColumn, 'Mapa de combate, consistência da Forja e histórico'],
    [Sparkles, 'Sincronização em nuvem: PC, celular e tablet'],
  ];

  return (
    <div className="grid min-h-dvh place-items-center p-5">
      <div className="w-full max-w-md rounded-r2 border border-gold/40 bg-surface p-7 text-center shadow-glow rise">
        <Crown size={46} className="mx-auto mb-3 text-gold" />
        <h1 className="font-display text-3xl tracking-wide">ENTRE PARA A FORJA</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Seu acesso começa com <b className="text-gold">7 dias grátis</b>.{' '}
          {price
            ? <>Depois, apenas <b className="text-ink">{price}</b>.</>
            : <>Depois, apenas uma pequena mensalidade na sua moeda.</>}{' '}
          Cancele quando quiser.
        </p>
        <div className="my-5 space-y-2.5 text-left">
          {BENEFITS.map(([Ic, txt], i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-r border border-line bg-surface2 p-2.5 text-[12.5px] font-semibold">
              <Ic size={16} className="flex-none text-gold" /> {txt}
            </div>
          ))}
        </div>
        <button className="btn-gold btn-big" disabled={busy || subChecking} onClick={() => { AF.click(); startTrial(); }}>
          {busy || subChecking ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {subChecking ? 'CONFIRMANDO PAGAMENTO...' : '🛡️ INICIAR MEUS 7 DIAS GRÁTIS'}
        </button>
        <p className="fnote">Pagamento processado com segurança pela Stripe. Nenhum dado de cartão toca este aplicativo.</p>
        <p className="fnote" style={{ marginTop: 6 }}>Conectado como: <b className="text-gold">{auth.email || '—'}</b></p>
      </div>
    </div>
  );
}
