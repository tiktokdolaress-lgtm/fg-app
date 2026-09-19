'use client';
import React, { useState } from 'react';
import { Skull, ChevronDown, BookOpen, ShieldAlert, Sparkles, Activity, Clock, CheckCircle2, MoreVertical, Check, FileText, Table } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K } from '@/components/ui';
import { DOSSIER, DOSSIER_TABLE } from '@/lib/data';
import { AF } from '@/lib/audio';
import { cx, cxDossier, cxTable } from '@/lib/content-i18n';

const ENEMY_CATEGORIES = [
  { id: 'dossier', label: 'Dossiês Científicos', icon: FileText },
  { id: 'table', label: 'Quadro Clínico', icon: Table },
  { id: 'timeline', label: 'Cronograma Neural', icon: Clock },
];

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

  const [activeCategory, setActiveCategory] = useState('dossier');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Por padrão os dossiês já começam abertos para consulta imediata ou com controle
  const [open, setOpen] = useState({ deip: true, brain: true, grip: true, pelvic: true, escalation: true, social: true });

  const toggleAll = () => {
    AF.click();
    const hasAnyClosed = Object.values(open).some((v) => !v);
    const nextState = {};
    doss.forEach((d) => { nextState[d.id] = hasAnyClosed; });
    setOpen(nextState);
  };

  const currentCategory = ENEMY_CATEGORIES.find((c) => c.id === activeCategory) || ENEMY_CATEGORIES[0];
  const CurrentIcon = currentCategory.icon;

  return (
    <div className="flex flex-col gap-3.5 pb-16">
      {/* SELETOR DE CATEGORIAS: Desktop Tabs & Mobile 3-Dots Dropdown */}
      <Card className="border-gold/30 bg-surface2/60 p-2.5 sm:p-3">
        {/* Mobile: Categoria Ativa + Botão de 3 Pontinhos */}
        <div className="relative flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <CurrentIcon size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block">Dossiê</span>
              <span className="text-xs font-bold font-mono text-gold">{currentCategory.label}</span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                AF.click();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={`p-2 rounded-md border transition-all ${
                mobileMenuOpen
                  ? 'bg-gold text-[#141414] border-gold shadow-sm'
                  : 'bg-surface border-line text-muted hover:text-ink hover:border-gold/40'
              }`}
              title="Opções do Dossiê"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Flutuante no Mobile */}
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-gold/30 bg-[#1a1a20] shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-muted uppercase font-bold border-b border-line/60">
                    Navegação do Dossiê
                  </div>
                  {ENEMY_CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSel = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          AF.click();
                          setActiveCategory(cat.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs font-mono font-semibold flex items-center justify-between transition-colors ${
                          isSel
                            ? 'bg-gold/15 text-gold border-l-2 border-gold font-bold'
                            : 'text-ink hover:bg-surface2'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CatIcon size={14} className={isSel ? 'text-gold' : 'text-muted'} />
                          <span>{cat.label}</span>
                        </div>
                        {isSel && <Check size={14} className="text-gold flex-none" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop: Abas Segmentadas */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-1.5">
          {ENEMY_CATEGORIES.map((cat) => {
            const CatIcon = cat.icon;
            const isSel = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  AF.click();
                  setActiveCategory(cat.id);
                }}
                className={`py-2 px-3 rounded text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  isSel
                    ? 'bg-gold text-[#141414] shadow-sm'
                    : 'bg-surface text-muted hover:text-ink hover:border-gold/40 border border-line'
                }`}
              >
                <CatIcon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* CATEGORIA 1: DOSSIÊS CIENTÍFICOS */}
      {activeCategory === 'dossier' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
          {/* TOPO: Dossiê Científico com KPIs de Alerta */}
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

            {/* 4 KPIs de Impacto Científico */}
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

          {/* GRADE DE DOSSIÊS (2 COLUNAS) */}
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
        </div>
      )}

      {/* CATEGORIA 2: TABELA / QUADRO CLÍNICO */}
      {activeCategory === 'table' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <K className="mb-0 flex items-center gap-1.5">
                  <Activity size={14} className="text-gold" />
                  <span>{T('tbl_k', 'TABELA RESUMO — 6 ÁREAS AFETADAS')}</span>
                </K>
                <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                  MAPA DE DANOS & SINTOMAS
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[460px] border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-line text-left text-[10px] uppercase tracking-[.14em] text-gold2">
                      <th className="p-2.5">{T('th1', 'Área')}</th>
                      <th className="p-2.5">{T('th2', 'Condição')}</th>
                      <th className="p-2.5">{T('th3', 'Sintoma Principal')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i} className="border-b border-line/40 hover:bg-surface2/40 transition-colors">
                        <td className="p-2.5 font-bold text-ink">{r[0]}</td>
                        <td className="p-2.5 text-danger font-semibold">{r[1]}</td>
                        <td className="p-2.5 text-muted leading-relaxed">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="fnote mt-4 pt-2.5 border-t border-line/60">
              {T('note', 'Conhecer o inimigo é metade da vitória. A outra metade é a Forja.')} <BookOpen size={11} className="inline ml-1 text-gold" />
            </p>
          </Card>
        </div>
      )}

      {/* CATEGORIA 3: CRONOGRAMA DE RECUPERAÇÃO */}
      {activeCategory === 'timeline' && (
        <div className="flex flex-col gap-3.5 animate-in fade-in duration-150">
          <Card className="border-gold/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <K style={{ margin: 0 }} className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gold" />
                  <span>CRONOGRAMA DE RECUPERAÇÃO NEURAL (0 A 90+ DIAS)</span>
                </K>
                <span className="text-[10px] font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/25">
                  RESET D2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {RECOVERY_TIMELINE.map((item, idx) => (
                  <div key={idx} className="p-3 rounded bg-surface2 border border-line text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between font-bold mb-1.5">
                        <span className="text-gold flex items-center gap-1.5 font-mono text-xs">
                          <span>{item.icon}</span>
                          <span>{item.period}</span>
                        </span>
                        <span className="text-[11px] text-ink">{item.title}</span>
                      </div>
                      <p className="text-[11.5px] text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="fnote mt-4 pt-2.5 border-t border-line/60">
              O cérebro tem plasticidade infinita. Cada dia de retenção reconstrói receptores e devolve seu império.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

