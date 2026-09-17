'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShieldCheck, Flame, Trophy, Siren } from 'lucide-react';

/* Cartão de Responsabilidade — visão somente-leitura do parceiro */
export default function PartnerCard() {
  const { token } = useParams();
  const [d, setD] = useState(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    fetch('/api/partner/' + token)
      .then((r) => { if (!r.ok) throw 0; return r.json(); })
      .then(setD)
      .catch(() => setErr(true));
  }, [token]);

  return (
    <main className="grid min-h-dvh place-items-center bg-bg p-5 text-ink">
      {err ? (
        <div className="card max-w-sm text-center"><ShieldCheck size={40} className="mx-auto mb-3 text-muted" /><h1 className="font-display text-2xl">LINK INVÁLIDO OU DESATIVADO</h1><p className="mt-2 text-[13px] text-muted">Este cartão de responsabilidade não existe mais.</p></div>
      ) : !d ? (
        <div className="font-display text-2xl tracking-[.2em] text-gold">CARREGANDO...</div>
      ) : (
        <div className="card w-full max-w-sm border-gold/40 text-center shadow-glow">
          <ShieldCheck size={44} className="mx-auto mb-2 text-gold" strokeWidth={1.6} />
          <p className="k2 mb-1">CARTÃO DE RESPONSABILIDADE</p>
          <h1 className="font-display text-3xl tracking-wide text-gold">{d.name}</h1>
          <p className="mb-4 text-[12px] text-muted">{d.tierIcon} {d.tier}</p>
          <div className="grid grid-cols-2 gap-2.5 text-left">
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{d.days}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Dias de guerra</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">🔥 {d.streak}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Streak atual</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{d.best}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Melhor marca</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">🛡 {d.sos}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">S.O.S vencidas</small></div>
          </div>
          <p className="fnote mt-4">Compartilhado voluntariamente pelo guerreiro. Nada além destes números é visível aqui.</p>
        </div>
      )}
    </main>
  );
}
