'use client';
import React, { useState } from 'react';
import { Skull, ChevronDown, BookOpen, ShieldAlert, Sparkles, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K } from '@/components/ui';
import { DOSSIER, DOSSIER_TABLE } from '@/lib/data';
import { AF } from '@/lib/audio';
import { cx, cxDossier, cxTable } from '@/lib/content-i18n';

const DOSSIER_TAGS = {
  deip: { tag: 'UROLOGIA & EREÇÃO', color: 'text-danger border-danger/30 bg-danger/10' },
  brain: { tag: 'NEUROBIOLOGIA & DOPAMINA', color: 'text-gold border-gold/30 bg-gold/10' },
  grip: { tag: 'SISTEMA NERVOSO PERIFÉRICO', color: 'text-[#E5A93C] border-[#E5A93C]/30 bg-[#E5A93C]/10' },
  pelvic: { tag: 'FISIOTERAPIA & ASSOALHO PÉLVICO', color: 'text-danger border-danger/30 bg-danger/10' },
  escalation: { tag: 'TOLERÂNCIA & COMPORTAMENTO', color: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  social: { tag: 'VÍNCULOS & AUTOESTIMA', color: 'text-sky-400 border-sky-400/30 bg-sky-400/10' },
};

const RECOVERY_TIMELINE = [
  {
    period: '0 a 14 Dias',
    title: 'Desinflamação & Choque Químico',
    desc: 'Queda do cortisol, redução do estresse neural e corte do looping de pornografia. A abstinência atinge o pico de fissura.',
    icon: '⚡',
  },
  {
    period: '15 a 30 Dias',
    title: 'Restauração da Sensibilidade',
    desc: 'Receptores periféricos começam a se regenerar (reversão do Death Grip). A ansiedade social e a névoa mental diminuem.',
    icon: '🌿',
  },
  {
    period: '31 a 90 Dias',
    title: 'Reconexão Pré-Frontal & Cura da DEIP',
    desc: 'O cérebro repara a via frontoestriatal. Retorno das ereções matinais espontâneas e atração por pessoas reais.',
    icon: '🛡️',
  },
  {
    period: '90+ Dias',
    title: 'Neuroplasticidade Consolidada',
    desc: 'Densidade de receptores D2 restaurada ao estado de fábrica. Força de vontade inabalável, foco laser e autocontrole pleno.',
    icon: '👑',
  },
];

export default function EnemyView() {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = (id, fb) => cx(lang, 'enemy', id) || fb;
  const doss = cxDossier(lang, DOSSIER);
  const rows = cxTable(lang, DOSSIER_TABLE);
  
  // Por padrão os dossiês já começam abertos para consulta imediata ou com controle
  const [open, setOpen] = useState({ deip: true, brain: true, grip: true, pelvic: true, escalation: true, social: true });

  const toggleAll = () => {
    AF.click();
    const hasAnyClosed = Object.values(open).some((v) => !v);
    const nextState = {};
    doss.forEach((d) => { nextState[d.id] = hasAnyClosed; });
    setOpen(nextState);
  };

  return (
    <div className="flex flex-col gap-3.5 pb-16">
      {/* 1. TOPO: Dossiê Científico com KPIs de Alerta */}
      <Card glow className="text-center relative overflow-hidden p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-danger">
            <ShieldAlert size={14} />
            <span>NEUROBIOLOGIA & MEDICINA MODERNA</span>
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="text-[11px] font-mono text-gold2 hover:text-gold transition-colors underline"
          >
            {Object.values(open).some((v) => !v) ? 'Expandir Todos os Dossiês' : 'Recolher Todos'}
          </button>
        </div>

        <h2 className="font-display text-[clamp(22px,4vw,34px)] tracking-[.04em] text-[#FF8A80]">
          {T('title', '🕳️ O INIMIGO REVELADO: DOSSIÊ CIENTÍFICO')}
        </h2>
        <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-muted max-w-2xl mx-auto">
          {T('sub', 'O impacto real da pornografia e masturbação compulsiva no corpo e na mente.')}
        </p>

        {/* 4 KPIs de Impacto Científico para preenchimento de topo */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
          <div className="p-2.5 rounded bg-surface2 border border-line">
            <b className="block font-display text-xl text-danger leading-none">78%</b>
            <small className="text-[9.5px] font-bold uppercase tracking-wider text-muted block mt-1 leading-tight">
              Incidência DEIP em usuários compulsivos
            </small>
          </div>
          <div className="p-2.5 rounded bg-surface2 border border-line">
            <b className="block font-display text-xl text-gold leading-none">-15%</b>
            <small className="text-[9.5px] font-bold uppercase tracking-wider text-muted block mt-1 leading-tight">
              Volume no Estriado (Max Planck)
            </small>
          </div>
          <div className="p-2.5 rounded bg-surface2 border border-line">
            <b className="block font-display text-xl text-[#E5A93C] leading-none">3×</b>
            <small className="text-[9.5px] font-bold uppercase tracking-wider text-muted block mt-1 leading-tight">
              Aumento no Limiar Dopaminérgico
            </small>
          </div>
          <div className="p-2.5 rounded bg-surface2 border border-line">
            <b className="block font-display text-xl text-ok leading-none">100%</b>
            <small className="text-[9.5px] font-bold uppercase tracking-wider text-muted block mt-1 leading-tight">
              Reversível com a Retenção & Forja
            </small>
          </div>
        </div>
      </Card>

      {/* 2. GRADE DE DOSSIÊS (2 COLUNAS EQUILIBRADAS SEM VÁCUO) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
        {doss.map((d) => {
          const isOpen = !!open[d.id];
          const tagInfo = DOSSIER_TAGS[d.id] || { tag: 'MEDICINA', color: 'text-muted border-line bg-surface2' };
          return (
            <Card key={d.id} className="border-danger/25 p-0 overflow-hidden flex flex-col justify-between">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left bg-surface hover:bg-surface2/60 transition-colors"
                onClick={() => {
                  AF.click();
                  setOpen((o) => ({ ...o, [d.id]: !o[d.id] }));
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl flex-none">{d.icon}</span>
                  <div className="min-w-0">
                    <span className="block text-[13.5px] font-extrabold truncate text-ink">
                      {d.t}
                    </span>
                    <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${tagInfo.color}`}>
                      {tagInfo.tag}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`flex-none text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : ''}`}
                />
              </button>

              <div className={`transition-all duration-300 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="space-y-2 border-t border-line/60 p-3 bg-surface/40">
                  {d.pts.map((p, j) => (
                    <div
                      key={j}
                      className={`rounded-r border p-2.5 text-xs leading-relaxed ${
                        p[2] === true
                          ? 'border-gold/40 bg-gold/5'
                          : 'border-line bg-surface2'
                      }`}
                    >
                      <b className="text-ink">{p[0]}:</b> <span className="text-muted">{p[1]}</span>
                      {p[2] && p[2] !== true && (
                        <span className="mt-1 block font-mono text-[10px] text-gold2">
                          📚 {p[2]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. BASE ALINHADA: Tabela Resumo (7 colunas) + Cronograma de Recuperação (5 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Tabela Resumo */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <K className="mb-2.5 flex items-center gap-1.5">
              <Activity size={14} className="text-gold" />
              <span>{T('tbl_k', 'TABELA RESUMO — 6 ÁREAS AFETADAS')}</span>
            </K>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-line text-left text-[10px] uppercase tracking-[.14em] text-gold2">
                    <th className="p-2">{T('th1', 'Área')}</th>
                    <th className="p-2">{T('th2', 'Condição')}</th>
                    <th className="p-2">{T('th3', 'Sintoma Principal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-line/40 hover:bg-surface2/40 transition-colors">
                      <td className="p-2 font-bold text-ink">{r[0]}</td>
                      <td className="p-2 text-danger font-semibold">{r[1]}</td>
                      <td className="p-2 text-muted leading-tight">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60">
            {T('note', 'Conhecer o inimigo é metade da vitória. A outra metade é a Forja.')} <BookOpen size={11} className="inline ml-1 text-gold" />
          </p>
        </Card>

        {/* Cronograma de Recuperação Neural */}
        <Card className="lg:col-span-5 flex flex-col justify-between border-gold/30">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <K style={{ margin: 0 }} className="flex items-center gap-1.5">
                <Clock size={14} className="text-gold" />
                <span>CRONOGRAMA DE RECUPERAÇÃO</span>
              </K>
              <span className="text-[10px] font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/25">
                RESET D2
              </span>
            </div>

            <div className="space-y-2">
              {RECOVERY_TIMELINE.map((item, idx) => (
                <div key={idx} className="p-2 rounded bg-surface2 border border-line text-xs">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-gold flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.period}</span>
                    </span>
                    <span className="text-[10.5px] text-ink">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="fnote mt-3 pt-2 border-t border-line/60">
            O cérebro tem plasticidade infinita. Cada dia de retenção reconstrói receptores e devolve seu império.
          </p>
        </Card>
      </div>
    </div>
  );
}

