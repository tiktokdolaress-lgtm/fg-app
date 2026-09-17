'use client';
import React, { useState } from 'react';
import { Skull, ChevronDown, BookOpen } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K } from '@/components/ui';
import { DOSSIER, DOSSIER_TABLE } from '@/lib/data';
import { AF } from '@/lib/audio';
import { cxDossier, cxTable } from '@/lib/content-i18n';

export default function EnemyView() {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const doss = cxDossier(lang, DOSSIER);
  const rows = cxTable(lang, DOSSIER_TABLE);
  const [open, setOpen] = useState({});
  return (
    <div>
      <Card glow className="mb-4 text-center">
        <h2 className="font-display text-[clamp(26px,5vw,38px)] tracking-[.06em] text-[#FF8A80]">🕳️ O INIMIGO REVELADO: DOSSIÊ CIENTÍFICO</h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">O impacto real da pornografia e masturbação compulsiva no corpo e na mente.</p>
      </Card>

      {doss.map((d, i) => (
        <Card key={d.id} className="mb-3 border-danger/25 p-0" >
          <button className="flex w-full items-center gap-3 p-4 text-left" onClick={() => { AF.click(); setOpen((o) => ({ ...o, [d.id]: !o[d.id] })); }}>
            <span className="text-2xl">{d.icon}</span>
            <span className="min-w-0 flex-1 text-[14px] font-extrabold">{d.t}</span>
            <ChevronDown size={16} className={`flex-none text-muted transition-transform ${open[d.id] ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open[d.id] ? 'max-h-[800px]' : 'max-h-0'}`}>
            <div className="space-y-2.5 border-t border-line p-4">
              {d.pts.map((p, j) => (
                <div key={j} className={`rounded-r border p-3 text-[12.5px] leading-relaxed ${p[2] === true ? 'border-gold/40 bg-gold/5' : 'border-line bg-surface2'}`}>
                  <b>{p[0]}:</b> {p[1]}
                  {p[2] && p[2] !== true && <span className="mt-1 block font-mono text-[10.5px] text-gold2">📚 {p[2]}</span>}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <Card className="mt-4">
        <K>📊 TABELA RESUMO — 6 ÁREAS AFETADAS</K>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-[12.5px]">
            <thead><tr className="border-b border-line text-left text-[10.5px] uppercase tracking-[.14em] text-gold2"><th className="p-2">Área</th><th className="p-2">Condição</th><th className="p-2">Sintoma Principal</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-line/60"><td className="p-2 font-bold">{r[0]}</td><td className="p-2 text-danger">{r[1]}</td><td className="p-2 text-muted">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fnote mt-3">Conhecer o inimigo é metade da vitória. A outra metade é a Forja. <BookOpen size={11} className="inline" /></p>
      </Card>
    </div>
  );
}
