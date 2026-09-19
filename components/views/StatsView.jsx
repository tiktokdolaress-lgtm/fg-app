'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Share2,
  Clock3,
  Trophy,
  ShieldAlert,
  Skull,
  MoreVertical,
  Check,
  BarChart2,
  Flame,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import * as L from '@/lib/logic';
import { cx, cxHabits } from '@/lib/content-i18n';
import { today, dstr, fdmy } from '@/lib/utils';
import { AF } from '@/lib/audio';

const TRIGGER_LABELS = {
  madrugada: 'Madrugada / Tarde da Noite',
  redes: 'Redes Sociais / Rolo Infinito',
  tedio: 'Tédio / Falta de Missão',
  stress: 'Estresse / Sobrecarga Mental',
  solidao: 'Solidão / Isolamento',
  canso: 'Cansaço Extremo / Esgotamento',
  gatilho_visual: 'Gatilho Visual (Filmes/Séries)',
  fantasia: 'Fantasias Mentais Prolongadas',
  cama: 'Ficar na Cama após Acordar',
  banho: 'Banho Demorado / Sozinho',
};

const STATS_CATEGORIES = [
  { id: 'general', key: 'cat_general', label: 'Geral & Consistência', icon: BarChart2 },
  { id: 'risk', key: 'cat_risk', label: 'Risco & S.O.S', icon: ShieldAlert },
  { id: 'hall', key: 'cat_hall', label: 'Salão da Fama & Honra', icon: Trophy },
];

export default function StatsView() {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = (id, fb) => cx(lang, 'stats', id) || fb;

  const [activeCategory, setActiveCategory] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hmOff, setHmOff] = useState(0);
  const [hall, setHall] = useState(null);

  useEffect(() => {
    fetch('/api/hall')
      .then((r) => r.json())
      .then(setHall)
      .catch(() => setHall([]));
  }, []);

  if (!S) return null;

  const d = L.progressDays(S);
  const okDays = Object.values(S.checkins || {}).filter((c) => c && c.ok).length;
  const forgeTotal = Object.values(S.forge?.done || {}).reduce((a, b) => a + (b ? b.length : 0), 0);
  const ALLH = cxHabits(lang, L.allH(S));

  /* Heatmap do mês */
  const now = new Date();
  const ref = new Date(now.getFullYear(), now.getMonth() + hmOff, 1);
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const dim = new Date(y, m + 1, 0).getDate();
  const startW = new Date(y, m, 1).getDay();

  const grid = [];
  for (let i = 0; i < startW; i++) grid.push({ hidden: true });
  for (let day = 1; day <= dim; day++) {
    const ds = dstr(new Date(y, m, day));
    let cls = '';
    if (ds > today()) cls = 'lvx';
    else {
      const c = (S.checkins || {})[ds];
      if (!c) cls = '';
      else if (c.fail) cls = 'lvf';
      else if (c.ok) cls = 'lv3';
      else cls = 'lv' + ((c.p ? 1 : 0) + (c.m ? 1 : 0) + (c.r ? 1 : 0));
    }
    grid.push({ ds, cls });
  }

  /* Consistência do mês atual */
  const elapsed = hmOff === 0 ? now.getDate() : new Date(y, m + 1, 0).getDate();
  const consist = (S.forge?.active || [])
    .map((id) => {
      const h = ALLH.find((x) => x.id === id);
      if (!h) return null;
      let cnt = 0;
      for (let day = 1; day <= elapsed; day++) {
        const ds = dstr(new Date(y, m, day));
        if (((S.forge?.done || {})[ds] || []).includes(id)) cnt++;
      }
      return { h, cnt, pct: Math.round((cnt / elapsed) * 100) };
    })
    .filter(Boolean);

  const sosHist = Array.isArray(S.sosLog) ? S.sosLog.slice(-12).reverse() : [];
  const wr = L.weekReport(S);
  const us = L.urgeStats(S);

  /* Auditoria de Quedas & Gatilhos */
  const auditFalls = useMemo(() => {
    if (!Array.isArray(S.audit)) return [];
    return [...S.audit].sort(
      (a, b) => new Date(b.date || b.timestamp || 0) - new Date(a.date || a.timestamp || 0)
    );
  }, [S.audit]);

  const triggerRank = useMemo(() => {
    const counts = {};
    auditFalls.forEach((f) => {
      if (Array.isArray(f.triggers)) {
        f.triggers.forEach((trg) => {
          counts[trg] = (counts[trg] || 0) + 1;
        });
      }
    });

    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts)
      .map(([id, count]) => ({
        id,
        name: TRIGGER_LABELS[id] || id,
        count,
        pct: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [auditFalls]);

  const shareImage = () => {
    const c = document.createElement('canvas');
    c.width = 1080;
    c.height = 1080;
    const x = c.getContext('2d');
    x.fillStyle = '#0D0D0E';
    x.fillRect(0, 0, 1080, 1080);
    x.strokeStyle = '#E5A93C';
    x.lineWidth = 8;
    x.strokeRect(48, 48, 984, 984);
    x.textAlign = 'center';
    x.fillStyle = '#FFC846';
    x.font = 'bold 62px sans-serif';
    x.fillText('FORJANDO GUERREIROS ⚔', 540, 170);
    x.fillStyle = '#F5F5F7';
    x.font = 'bold 40px sans-serif';
    x.fillText(T('cv2', 'RELATÓRIO SEMANAL DE GUERRA'), 540, 240);
    x.fillStyle = '#8E8E93';
    x.font = '28px sans-serif';
    x.fillText(
      wr.days[0].split('-').reverse().slice(0, 2).join('/') +
        T('cv_to', ' a ') +
        wr.days[6].split('-').reverse().slice(0, 2).join('/'),
      540,
      290
    );
    x.fillStyle = '#FFC846';
    x.font = 'bold 120px sans-serif';
    x.fillText(wr.daysTotal + T('cv_days', ' DIAS'), 540, 450);
    x.fillStyle = '#F5F5F7';
    x.font = 'bold 44px sans-serif';
    x.fillText(
      '🏆 ' + wr.wins + T('cv_wins', ' vitórias') + '      💥 ' + wr.falls + T('cv_falls', ' quedas'),
      540,
      570
    );
    x.fillText(
      '🔥 ' + T('cv_streak', 'streak') + ' ' + wr.streak + '      ✦ ' + T('cv_purity', 'pureza') + ' ' + wr.purity + '%',
      540,
      650
    );
    x.fillText(
      '🔨 ' + T('cv_cons', 'consistência') + ' ' + wr.consist + '%      🛡 S.O.S ' + wr.sos,
      540,
      730
    );
    x.fillStyle = '#8E8E93';
    x.font = 'italic 30px sans-serif';
    x.fillText(T('cv_motto', 'O impulso é passageiro. A honra é permanente.'), 540, 860);
    x.fillStyle = '#E5A93C';
    x.font = 'bold 30px sans-serif';
    x.fillText(T('cv_foot', 'forjandoguerreiros · reporte anônimo'), 540, 960);

    c.toBlob((b) => {
      if (!b) return;
      const f = new File([b], T('cv_file', 'relatorio-forjando-guerreiros.png'), { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        navigator.share({ files: [f], title: T('cv_sharetitle', 'Relatório Semanal de Guerra') }).catch(() => {});
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = f.name;
        a.click();
      }
    }, 'image/png');
  };

  const KPIS = [
    [d, L.modeA(S) ? T('kpi_clean', 'Sequência limpa') : T('kpi_streak', 'Streak atual')],
    [S.best || 0, T('kpi_best', 'Melhor streak')],
    [(S.purity != null ? S.purity : 100) + '%', T('kpi_purity', 'Score de pureza')],
    [okDays, T('kpi_okdays', 'Dias de pilares completos')],
    [forgeTotal, T('kpi_forge', 'Hábitos forjados')],
    [S.sos || 0, T('kpi_sos', 'S.O.S acionados')],
    ['🛡️ ' + L.sosWins(S), T('kpi_sosw', 'S.O.S vencidas')],
  ];

  const weekdayLetters = {
    pt: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    es: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  };

  const localeCode = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
  const currentCategory = STATS_CATEGORIES.find((c) => c.id === activeCategory) || STATS_CATEGORIES[0];
  const CurrentIcon = currentCategory.icon;

  return (
    <div className="flex flex-col gap-4 pb-16">
      {/* SELETOR DE CATEGORIAS: Desktop Tabs & Mobile 3-Dots Dropdown */}
      <Card className="border-gold/30 bg-surface2/60 p-2.5 sm:p-3">
        {/* Mobile: Categoria Ativa + Botão de 3 Pontinhos */}
        <div className="relative flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <CurrentIcon size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block">Categoria</span>
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
              title="Opções de Estatísticas"
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
                    Navegação de Estatísticas
                  </div>
                  {STATS_CATEGORIES.map((cat) => {
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
          {STATS_CATEGORIES.map((cat) => {
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

      {/* CATEGORIA 1: GERAL & CONSISTÊNCIA */}
      {activeCategory === 'general' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* 1. Grade de KPIs Principais */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {KPIS.map(([v, lb], i) => (
              <div key={i} className="rounded-r border border-line bg-surface p-3 text-center">
                <b className="block font-display text-[26px] leading-none text-gold">{v}</b>
                <small className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                  {lb}
                </small>
              </div>
            ))}
          </div>

          {/* 2. Heatmap & Consistência da Forja */}
          <div className="grid gap-3.5 lg:grid-cols-2 items-stretch">
            <Card className="flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <K style={{ margin: 0 }}>
                {T('map_k', 'MAPA — ')}
                {ref
                  .toLocaleDateString(localeCode[lang] || 'pt-BR', { month: 'long', year: 'numeric' })
                  .toUpperCase()}
              </K>
              <div className="flex gap-1.5">
                <button className="chip-dim px-2 py-1" onClick={() => setHmOff(hmOff - 1)}>
                  <ChevronLeft size={14} />
                </button>
                <button
                  className="chip-dim px-2 py-1"
                  disabled={hmOff >= 0}
                  style={hmOff >= 0 ? { opacity: 0.35 } : {}}
                  onClick={() => setHmOff(Math.min(0, hmOff + 1))}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="hm">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <b key={'w' + i} className="grid place-items-center border-none bg-transparent text-[9px] text-muted">
                  {T('wd' + i, (weekdayLetters[lang] || weekdayLetters.pt)[i])}
                </b>
              ))}
              {grid.map((c, i) =>
                c.hidden ? <b key={i} className="invisible" /> : <b key={i} className={c.cls} title={c.ds} />
              )}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-line/60 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-muted">
            <span>
              <b className="lv1 mr-1 inline-block h-3 w-3 rounded bg-gold/25" />
              {T('lg1', '1 pilar')}
            </span>
            <span>
              <b className="lv2 mr-1 inline-block h-3 w-3 rounded bg-gold/50" />
              {T('lg2', '2 pilares')}
            </span>
            <span>
              <b className="lv3 mr-1 inline-block h-3 w-3 rounded bg-gold" />
              {T('lg3', 'completo')}
            </span>
            <span>
              <b className="lvf mr-1 inline-block h-3 w-3 rounded bg-danger/60" />
              {T('lgf', 'queda')}
            </span>
            <span>
              <b className="mr-1 inline-block h-3 w-3 rounded bg-[#202026]" />
              {T('lgn', 'sem registro')}
            </span>
          </div>
        </Card>

        {/* Card de Consistência com Resumo Mensal Integrado para Preenchimento Perfeito */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <K style={{ margin: 0 }}>{T('cons_k', '🔨 CONSISTÊNCIA DA FORJA — MÊS ATUAL')}</K>
              <span className="text-[10px] font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/25">
                {elapsed} {elapsed === 1 ? 'dia corrido' : 'dias corridos'}
              </span>
            </div>

            {consist.length ? (
              <div className="space-y-2.5">
                {consist.map((c) => (
                  <div key={c.h.id} className="p-2 rounded bg-surface2 border border-line/50">
                    <div className="mb-1 flex justify-between text-[12px] font-bold">
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{c.h.icon}</span>
                        <span className="truncate">{c.h.n}</span>
                      </span>
                      <span className="font-mono text-gold2 text-xs flex-none ml-2">
                        {c.cnt}/{elapsed} <span className="text-muted font-normal">({c.pct}%)</span>
                      </span>
                    </div>
                    <div className="bar">
                      <i style={{ width: c.pct + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>{T('cons_empty', 'Ative hábitos na Forja para medir consistência.')}</Empty>
            )}
          </div>

          {/* Resumo Tático Mensal: Preenche perfeitamente a parte inferior, eliminando qualquer espaço vago */}
          <div className="mt-3 pt-3 border-t border-line/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block mb-2">
              RESUMO DE DISCIPLINA NO MÊS
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-surface2 border border-line">
                <b className="block font-display text-lg text-gold leading-none">
                  {consist.reduce((acc, cur) => acc + cur.cnt, 0)}
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1">Concluídos</small>
              </div>
              <div className="p-2 rounded bg-surface2 border border-line">
                <b className="block font-display text-lg text-gold leading-none">
                  {consist.length ? Math.round(consist.reduce((acc, cur) => acc + cur.pct, 0) / consist.length) : 0}%
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1">Adesão Média</small>
              </div>
              <div className="p-2 rounded bg-surface2 border border-line truncate">
                <b className="block font-display text-lg text-gold leading-none truncate">
                  {consist.length ? [...consist].sort((a, b) => b.pct - a.pct)[0]?.h.icon : '—'}
                </b>
                <small className="text-[9px] uppercase tracking-wider text-muted block mt-1 truncate">Líder</small>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Relatório Semanal de Guerra (Largura Total) */}
        <Card className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <K style={{ margin: 0 }}>{T('wk_k', '📜 RELATÓRIO SEMANAL DE GUERRA (ÚLTIMOS 7 DIAS)')}</K>
            <button className="btn-ghost px-3 py-2 text-[12px]" onClick={shareImage}>
              <Share2 size={14} /> {T('wk_share', 'COMPARTILHAR IMAGEM')}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-ok">{wr.wins}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_wins', 'Vitórias')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-danger">{wr.falls}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_falls', 'Quedas')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-gold">{wr.consist}%</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_cons', 'Consistência Forja')}
              </small>
            </div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center">
              <b className="block font-display text-2xl text-gold">🛡 {wr.sos}</b>
              <small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">
                {T('wk_sos', 'S.O.S vencidas')}
              </small>
            </div>
          </div>
          <p className="fnote mt-3" style={{ textAlign: 'left' }}>
            {T('wk_part', 'Parciais: ')}
            {wr.part} · {T('wk_none', 'Sem registro: ')}
            {wr.none} · {T('wk_pur', 'Pureza atual: ')}
            {wr.purity}% · {T('wk_st', 'Streak: ')}
            {wr.streak} · {T('wk_hab', 'Hábitos concluídos: ')}
            {wr.habDone}
            {wr.habPossible ? '/' + wr.habPossible : ''}.
            {T('wk_push', ' Todo domingo você recebe um push avisando que o relatório está pronto.')}
          </p>
        </Card>
      </div>
    </div>
  )}

  {/* CATEGORIA 2: RISCO & S.O.S */}
  {activeCategory === 'risk' && (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      <div className="grid gap-3.5 lg:grid-cols-2 items-stretch">
        {/* Mapa de Risco por Horário */}
        <Card className="flex flex-col justify-between">
          <div>
            <K>
              <Clock3 size={12} className="mr-1 inline text-gold" /> {T('risk_k', 'MAPA DE RISCO POR HORÁRIO')}
            </K>
            {us.total ? (
              <>
                <div className="grid grid-cols-12 gap-1 my-2">
                  {us.buckets.map((b, h) => {
                    const max = Math.max(1, ...us.buckets.map((y) => y.sum + y.n));
                    const lvl = (b.sum + b.n) / max;
                    return (
                      <b
                        key={h}
                        title={h + 'h · ' + b.n + T('risk_reg', ' registro(s)')}
                        className="aspect-square rounded border border-line"
                        style={{ background: lvl > 0 ? `rgba(255,77,77,${0.15 + lvl * 0.85})` : '#202026' }}
                      />
                    );
                  })}
                </div>
                <div className="p-2 rounded bg-danger/10 border border-danger/30 text-xs font-bold text-danger flex items-center justify-between">
                  <span>{T('risk_win', '🎯 Janela Crítica de Alerta:')}</span>
                  <span className="font-mono">{us.window[0]}h – {us.window[1]}h</span>
                </div>
              </>
            ) : (
              <div className="p-3 my-2 rounded bg-surface2 border border-line text-xs text-muted leading-relaxed">
                Nenhum impulso crítico registrado ainda. Acione o botão S.O.S em momentos de urgência para mapear com precisão cirúrgica seus horários de maior vulnerabilidade.
              </div>
            )}
          </div>
          <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
            {us.total ? `${us.total} ${T('risk_note', 'impulsos registrados. Mantenha telas longe do quarto nessa janela.')}` : 'Defesa preventiva ativa: mantenha o celular fora do quarto após as 22h.'}
          </p>
        </Card>

        {/* Histórico S.O.S */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <K style={{ margin: 0 }} className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-gold" />
                <span>INTERVENÇÕES S.O.S VENCIDAS</span>
              </K>
              <span className="text-xs font-mono font-bold text-gold px-2 py-0.5 rounded bg-gold/10 border border-gold/30">
                {L.sosWins(S)} Vencidas
              </span>
            </div>
            {sosHist.length ? (
              <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-1">
                {sosHist.map((e, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center rounded-r border border-line bg-surface2 p-2 text-[12px] font-semibold"
                  >
                    <span className="flex items-center gap-1.5 text-gold">
                      <span>🛡️</span>
                      <span>{T('sos_item', 'Intervenção Vencida')}</span>
                    </span>
                    <span className="font-mono text-[10.5px] text-muted">
                      {fdmy(e.d || dstr(new Date(e.ts || Date.now())))} · {e.h || '--:--'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded bg-surface2 border border-line text-xs text-muted leading-relaxed">
                {T('sos_e1', 'Nenhuma intervenção S.O.S registrada ainda.')} Em momentos de urgência, use o botão de emergência flutuante para resfriar a mente e salvar seu streak.
              </div>
            )}
          </div>
          <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
            Cada vitória no S.O.S recalibra os receptores de dopamina pré-frontais.
          </p>
        </Card>
      </div>

      {/* Ranking de Gatilhos & Auditoria */}
      <Card className="border-danger/30">
        <div>
          <K className="text-danger flex items-center gap-1.5 text-xs font-bold font-mono uppercase mb-2">
            <ShieldAlert size={14} />
            {triggerRank.length > 0 ? 'RANKING DE GATILHOS (AUDITORIA)' : 'BLINDAGEM CONTRA GATILHOS'}
          </K>
          {triggerRank.length > 0 ? (
            <div className="flex flex-col gap-2">
              {triggerRank.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="flex flex-col gap-1 p-2 rounded bg-surface2 border border-line/40">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-ink flex items-center gap-1.5 truncate">
                      <span className="text-danger font-mono font-bold text-[11px]">#{idx + 1}</span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono text-danger font-bold text-xs flex-none ml-2">
                      {item.count}x ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#1b1b22] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-danger h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-surface2 border border-line flex items-center gap-2">
                <span className="text-ok font-bold text-sm">✓</span>
                <span className="text-ink">Nenhuma queda recente registrada. Defesas intactas!</span>
              </div>
              <div className="p-2 rounded bg-surface2/60 border border-line/50 text-[11px] text-muted space-y-1">
                <div className="font-bold text-gold2">Top Gatilhos Críticos a Vigiar:</div>
                <div>• Redes Sociais no escuro da madrugada</div>
                <div>• Estresse acumulado e cansaço sem treino</div>
                <div>• Tédio e isolamento com computador aberto</div>
              </div>
            </div>
          )}
        </div>
        <p className="fnote mt-2 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
          Identificar o gatilho antecipadamente desativa a cascata impulsiva no cérebro.
        </p>
      </Card>
    </div>
  )}

  {/* CATEGORIA 3: SALÃO DA FAMA & HONRA */}
  {activeCategory === 'hall' && (
    <div className="flex flex-col gap-4 animate-in fade-in duration-150">
      {/* Resumo de Honra & Conquistas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Streak Atual</span>
          <b className="block font-display text-2xl text-gold mt-1">🔥 {S.streak || 0}d</b>
        </div>
        <div className="p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Índice de Pureza</span>
          <b className="block font-display text-2xl text-gold mt-1">✦ {S.purity || 100}%</b>
        </div>
        <div className="col-span-2 sm:col-span-1 p-3 rounded border border-line bg-surface text-center">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Status no Salão</span>
          <span className={`block font-mono text-xs font-bold mt-2 ${S.hallOptIn ? 'text-gold' : 'text-muted'}`}>
            {S.hallOptIn ? `🛡️ ${S.hallName || 'Ativo'}` : '🔒 Privado'}
          </span>
        </div>
      </div>

      {/* Salão da Fama Anônimo */}
      <Card className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <K style={{ margin: 0 }}>
              <Trophy size={12} className="mr-1 inline text-gold" /> {T('hall_k', 'SALÃO DA FAMA ANÔNIMO')}
            </K>
            <span className="text-[10px] font-mono text-muted">
              {S.hallOptIn ? '🛡️ Participando' : 'Modo Privado'}
            </span>
          </div>
          {hall === null ? (
            <Empty>{T('loading', 'Carregando...')}</Empty>
          ) : hall.length ? (
            <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
              {hall.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 rounded-r border p-2.5 text-[12px] font-bold ${
                    h.name === S.hallName ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface2'
                  }`}
                >
                  <span className="w-7 text-center font-display text-sm text-gold2">
                    {i + 1}º
                  </span>
                  <span className="flex-1 truncate">
                    {h.name} {h.name === S.hallName ? '(você)' : ''}
                  </span>
                  <span className="text-xs text-muted">{h.tier}</span>
                  <span className="font-mono text-gold text-xs font-bold">{h.days}d</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded bg-surface2 border border-line text-xs text-muted">
              {T('hall_e1', 'Nenhum guerreiro optou pelo Salão ainda.')} Ative nas Configurações para ingressar.
            </div>
          )}
        </div>
        <p className="fnote mt-3 pt-2 border-t border-line/60" style={{ textAlign: 'left' }}>
          {T('hall_note', 'Ranking anônimo com pseudônimos — apenas dias e patamar.')}
        </p>
      </Card>

      {/* Cartão de Compartilhamento Semanal */}
      <Card className="p-3.5 bg-gradient-to-br from-surface to-gold/5 border-gold/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold font-mono text-gold flex items-center gap-1.5 uppercase tracking-wider">
              <Share2 size={13} />
              <span>Cartão Semanal de Honra & Vitória</span>
            </span>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Exporte o seu resumo semanal oficial com gráficos vetoriais, dias limpos e streak para compartilhar ou salvar nas suas notas.
            </p>
          </div>
          <button
            type="button"
            className="btn-gold px-4 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap flex-none w-full sm:w-auto justify-center"
            onClick={shareImage}
          >
            <Share2 size={13} />
            <span>Exportar Imagem</span>
          </button>
        </div>
      </Card>
    </div>
  )}
    </div>
  );
}
