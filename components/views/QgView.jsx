'use client';
import React, { useState } from 'react';
import { RefreshCw, Trophy, CalendarDays, Flame, ShieldCheck, Droplets, Hand, HeartPulse, Check, X, Zap, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Bar, Chk, Empty } from '@/components/ui';
import { METAS, NEXTF, FAIL_PEN, TRIGGERS, FAIL_LBL, TIERS, QUOTES } from '@/lib/data';
import { cx, cxHabits, cxTiers, cxQuotes } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF, metaSfx } from '@/lib/audio';
import { today, dstr, fdmy, fmtD, pad, yesterday } from '@/lib/utils';

/* Dicionário Internacional dos Efeitos Biológicos e Mentais (PT / EN / ES) */
const BIO_EFFECTS_I18N = {
  header: {
    pt: 'EFEITOS BIOLÓGICOS & MENTAIS ATIVOS NESTE MARCO:',
    en: 'ACTIVE BIOLOGICAL & MENTAL EFFECTS AT THIS MILESTONE:',
    es: 'EFECTOS BIOLÓGICOS Y MENTALES ACTIVOS EN ESTE HITO:',
  },
  tiers: [
    {
      min: 0, max: 3,
      perks: {
        pt: ['Quebra do ciclo automático', 'Redução do pico de cortisol', 'Recuperação inicial da dopamina'],
        en: ['Automatic loop broken', 'Cortisol spike reduction', 'Initial dopamine recovery'],
        es: ['Ruptura del ciclo automático', 'Reducción del pico de cortisol', 'Recuperación inicial de dopamina'],
      }
    },
    {
      min: 4, max: 7,
      perks: {
        pt: ['Pico natural de testosterona (+45%)', 'Aumento de energia física', 'Fim gradual da névoa mental'],
        en: ['Natural testosterone surge (+45%)', 'Boost in physical energy', 'Gradual end of brain fog'],
        es: ['Pico natural de testosterona (+45%)', 'Aumento de energía física', 'Fin gradual de la niebla mental'],
      }
    },
    {
      min: 8, max: 14,
      perks: {
        pt: ['Sono profundo restaurador', 'Vontade e assertividade reforçadas', 'Olhar firme e redução da timidez'],
        en: ['Deep restorative sleep', 'Enhanced willpower & assertiveness', 'Steady gaze and less shyness'],
        es: ['Sueño profundo y reparador', 'Voluntad y asertividad reforzadas', 'Mirada firme y menos timidez'],
      }
    },
    {
      min: 15, max: 30,
      perks: {
        pt: ['Receptores de dopamina rebalanceados', 'Redução drástica de ansiedade social', 'Magnetismo pessoal e foco aguçado'],
        en: ['Rebalanced dopamine receptors', 'Drastic drop in social anxiety', 'Personal magnetism & sharp focus'],
        es: ['Receptores de dopamina equilibrados', 'Reducción drástica de ansiedad social', 'Magnetismo personal y enfoque agudo'],
      }
    },
    {
      min: 31, max: 60,
      perks: {
        pt: ['Controle absoluto de pensamentos invasivos', 'Aura de respeito natural', 'Vitalidade transmutada em criação'],
        en: ['Total control over invasive thoughts', 'Aura of natural respect', 'Vitality transmuted into creation'],
        es: ['Control total sobre pensamientos intrusivos', 'Aura de respeto natural', 'Vitalidad transmutada en creación'],
      }
    },
    {
      min: 61, max: 90,
      perks: {
        pt: ['Superação da flatline (platô)', 'Alta performance física e cognitiva', 'Autodomínio e disciplina inabaláveis'],
        en: ['Flatline conquered', 'High physical & cognitive performance', 'Unshakable self-mastery and discipline'],
        es: ['Superación de la flatline (meseta)', 'Alto rendimiento físico y cognitivo', 'Autodominio y disciplina inquebrantables'],
      }
    },
    {
      min: 91, max: 9999,
      perks: {
        pt: ['Transmutação biológica completa', 'Padrão inquebrável de conduta', 'Mestre absoluto da própria mente'],
        en: ['Complete biological transmutation', 'Unbreakable standard of conduct', 'Absolute master of your own mind'],
        es: ['Transmutación biológica completa', 'Estándar inquebrantable de conducta', 'Amo absoluto de la propia mente'],
      }
    },
  ]
};

function getBioPerksI18n(days, lang) {
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const found = BIO_EFFECTS_I18N.tiers.find((b) => days >= b.min && days <= b.max) || BIO_EFFECTS_I18N.tiers[0];
  return {
    header: BIO_EFFECTS_I18N.header[currentLang] || BIO_EFFECTS_I18N.header.pt,
    perks: found.perks[currentLang] || found.perks.pt,
  };
}

export default function QgView() {
  const { S, update, t, openModal, closeModal, toast, setTab } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const [ciDate, setCiDate] = useState(today());
  const [qgRange, setQgRange] = useState(30);

  /* i18n */
  const tiers = cxTiers(lang, TIERS);
  const d = L.progressDays(S);
  const tier = tiers.find((x) => x.min === L.tierNow(S).min) || L.tierNow(S);
  const nt = tiers.find((x) => x.min > d) || null;
  const quotes = cxQuotes(lang, QUOTES);
  const ALLH = cxHabits(lang, L.allH(S));
  const MT = (m) => (m ? Object.assign({}, m, cx(lang, 'metas', m.d) || {}) : m);
  const TR = (x, i) => cx(lang, 'ob', 'trig' + i) || x;
  const fallLbl = (x) => { const k = t('fall_' + x); return k === 'fall_' + x ? (FAIL_LBL[x] || x) : k; };

  const cView = L.ci(S, ciDate);
  const fd = L.fDone(S, today()), ff = L.fFailed(S, today());
  const act = S.forge.active.slice().sort((a, b) => (L.hTime(S, a) || '99:99').localeCompare(L.hTime(S, b) || '99:99'));
  const doneF = S.forge.active.filter((id) => fd.includes(id)).length;
  const streak = L.currentStreak(S);
  const lvlPct = nt ? Math.min(100, ((d - tier.min) / (nt.min - tier.min)) * 100) : 100;
  const lvlTxt = nt ? <>{t('lvl_a')}<b className="text-gold">{nt.min - d}{t('dayw')}</b>{t('lvl_b')}{nt.icon} {nt.name}</> : t('lvl_max');
  const mantraPool = L.mantraPool(S, quotes);
  const mantra = mantraPool[S.phraseIdx % mantraPool.length];
  const pornFree = S.lastPorn ? Math.max(0, L.daysBetweenSafe(S.lastPorn)) : d;
  const mastFree = S.lastMast ? Math.max(0, L.daysBetweenSafe(S.lastMast)) : d;
  const openTasks = S.tasks.filter((x) => L.repDue(x, today()) && !L.isDone(x, today())).slice(0, 5);
  const goalMeta = MT(METAS.find((m) => m.d === S.goal));
  const lw = L.sosLast(S);
  const bioData = getBioPerksI18n(d, lang);

  /* linha do tempo */
  let cells = [], wins = 0, falls = 0, part = 0;
  for (let i = qgRange - 1; i >= 0; i--) {
    const ds = dstr(new Date(Date.now() - i * 86400000));
    const cc = S.checkins[ds]; let cls = '', lab = t('st_n');
    if (cc && cc.fail) { cls = 'f'; falls++; lab = t('st_f'); }
    else if (cc && cc.ok) { cls = 'w'; wins++; lab = t('st_v'); }
    else if (cc && (cc.p || cc.m || cc.r)) { cls = 'p'; part++; lab = t('st_p'); }
    cells.push({ ds, cls, lab });
  }
  const rate = Math.round((wins / qgRange) * 100);

  /* ações */
  const setCI = (k, v, dateStr) => {
    const dd = dateStr || today();
    update((s) => {
      s.checkins[dd] = s.checkins[dd] || { p: false, m: false, r: false };
      s.checkins[dd][k] = v;
      const c = s.checkins[dd], req = L.pillars(s);
      const all = req.every((r) => c[r]);
      if (all && !c.ok) {
        c.ok = true;
        if (dd === today()) { s.purity = Math.min(100, s.purity + 2); s.best = Math.max(s.best, L.progressDays(s)); }
      }
      if (!all) delete c.ok;
    });
    const req = L.pillars(S), c = { ...cView, [k]: v };
    const all = req.every((r) => c[r]);
    if (all && dd === today()) {
      AF.victory(L.tierNow(S).min >= 180); metaSfx(d);
      openModal(<Victory />);
    } else if (all) toast('✅ ' + fdmy(dd) + t('recvit'));
    else AF.click();
  };

  const toggleHabitDone = (id, e) => {
    if (e) e.stopPropagation();
    if (!S.forge.active.includes(id)) return;
    update((s) => {
      const dd = today();
      const a = s.forge.done[dd] = s.forge.done[dd] || [];
      const i = a.indexOf(id);
      if (i >= 0) {
        a.splice(i, 1);
      } else {
        a.push(id);
        const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
        const fi = f.indexOf(id);
        if (fi >= 0) f.splice(fi, 1);
      }
    });
    AF.click();
  };

  const toggleHabitFailed = (id, e) => {
    if (e) e.stopPropagation();
    if (!S.forge.active.includes(id)) return;
    update((s) => {
      const dd = today();
      const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
      const fi = f.indexOf(id);
      if (fi >= 0) {
        f.splice(fi, 1);
      } else {
        f.push(id);
        const a = s.forge.done[dd] = s.forge.done[dd] || [];
        const ai = a.indexOf(id);
        if (ai >= 0) a.splice(ai, 1);
      }
    });
    AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
  };

  const failFlow = () => {
    let sel = [];
    const opts = L.modeA(S) ? ['porn', 'mast'] : ['porn', 'mast', 'ejac'];
    const lbl = {
      porn: <>{t('lblp')}<small className="ml-auto text-danger">{t('penp')}</small></>,
      mast: <>{t('lblm')}<small className="ml-auto text-danger">{t('penm')}</small></>,
      ejac: <>{t('lble')}<small className="ml-auto text-danger">{t('pene')}</small></>,
    };
    const Fail = () => {
      const [, force] = useState(0);
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-danger">{t('fail_t')}</h3>
          <p className="mb-4 text-sm text-muted">{t('fail_d')} <b className="text-gold">{t('fail_sel')}</b></p>
          {opts.map((o) => (
            <button key={o} className={`btn-big mb-2 w-full text-left ${sel.includes(o) ? 'btn-red' : 'btn-dark'}`} onClick={() => { sel = sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]; force((x) => x + 1); AF.click(); }}>{lbl[o]}</button>
          ))}
          {L.modeA(S) && <p className="fnote text-gold2">{t('modeA_note')}</p>}
          <button className="btn-red btn-big" disabled={!sel.length} onClick={() => doFail(sel)}>{t('fail_ok')}</button>
          <p className="fnote">{t('honest')}</p>
          <button className="btn-dark btn-big mt-1" onClick={closeModal}>{t('cancel_btn')}</button>
        </div>
      );
    };
    openModal(<Fail />);
  };

  const doFail = (types) => {
    if (L.modeA(S)) types = types.filter((x) => x !== 'ejac');
    if (!types.length) { toast(t('nothing')); return; }
    let triggers = [];
    update((s) => {
      const dd = today();
      s.checkins[dd] = s.checkins[dd] || { p: false, m: false, r: false };
      const c = s.checkins[dd]; delete c.ok; c.fail = types.join('+');
      let pen = 0;
      if (types.includes('porn')) { pen += FAIL_PEN.porn; s.lastPorn = dd; c.p = false; }
      if (types.includes('mast')) { pen += FAIL_PEN.mast; s.lastMast = dd; c.m = false; }
      if (types.includes('ejac')) { pen += FAIL_PEN.ejac; s.retStart = dd; c.r = false; }
      s.purity = Math.max(5, s.purity - pen);
    });
    AF.tone(110, 0.5, 'sine', 0.2, 0, 55);
    let vent = '';
    const Post = () => {
      const [, force] = useState(0);
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-danger">{t('fall_t')}</h3>
          <p className="mb-3 text-sm text-muted">{types.map((x) => fallLbl(x)).join(' + ')}</p>
          <div className="mb-4 rounded-r border border-gold/30 bg-gold/5 p-3.5 text-left text-[13px] leading-relaxed">
            <b className="text-gold">{t('retom')}</b><br />{t('r1')}<br />{t('r2')}<br />{t('r3')}<br />{t('r4')}<br />{t('r5')}
          </div>
          <span className="k text-danger">{t('fall_trig')}</span>
          <div className="mb-3 flex flex-wrap justify-center gap-1.5">
            {TRIGGERS.map((x, i) => <button key={x} className={`tag ${triggers.includes(x) ? 'sel' : ''}`} onClick={() => { triggers = triggers.includes(x) ? triggers.filter((y) => y !== x) : [...triggers, x]; force((v) => v + 1); }}>{TR(x, i)}</button>)}
          </div>
          <label className="mb-3 block text-left"><span className="lbl">{t('fall_vent')}</span>
            <textarea className="field" maxLength={600} placeholder={t('ventph')} value={vent} onChange={(e) => (vent = e.target.value)} /></label>
          <button className="btn-gold btn-big" onClick={() => {
            update((s) => {
              const dd = today();
              s.journal[dd] = s.journal[dd] || { mood: '', good: '', ch: '' };
              Object.assign(s.journal[dd], { fall: true, fallTypes: types, fallTriggers: triggers, vent: vent || s.journal[dd].vent || '' });
            });
            closeModal(); toast(t('savedj'));
          }}>{t('fall_save')}</button>
          <button className="btn-dark btn-big mt-2" onClick={closeModal}>{t('fall_no')}</button>
        </div>
      );
    };
    openModal(<Post />);
  };

  const dayEditor = (ds) => {
    const c = L.ci(S, ds), req = L.pillars(S);
    const Day = () => {
      const cur = L.ci(S, ds);
      const state = cur.fail ? t('st_f') : cur.ok ? t('st_v') : (cur.p || cur.m || cur.r) ? t('st_p') : t('st_n');
      return (
        <div className="text-center">
          <span className="k">{t('de_t')} {fdmy(ds)}{ds === today() ? ' · ' + t('hj') : ''}</span>
          <p className="fnote" style={{ textAlign: 'left', margin: '-2px 0 12px' }}>{t('de_estado')} <b className="text-gold">{state}</b> · {t('de_hint')}</p>
          {req.map((k) => {
            const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
            const fTypes = String(cur.fail || '').split('+').filter(Boolean);
            return (
              <Chk key={k} className="mb-2" on={!!cur[k]} failed={!cur[k] && fTypes.includes(FAILMAP[k])} onClick={() => setCI(k, !cur[k], ds)}>
                {t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3')}
              </Chk>
            );
          })}
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => { req.forEach((k, i) => setTimeout(() => setCI(k, true, ds), i * 10)); }}>{t('st_v')}</button>
            <button className="btn-dark" onClick={() => { update((s) => { delete (s.checkins[ds] || {}).ok; delete s.checkins[ds]?.fail; }); AF.click(); }}>{t('st_p')}</button>
            <button className="btn-red" onClick={() => { update((s) => { s.checkins[ds] = s.checkins[ds] || { p: false, m: false, r: false }; delete s.checkins[ds].ok; s.checkins[ds].fail = 'porn'; }); AF.tone(110, 0.35, 'sine', 0.18, 0, 55); }}>{t('b_f')}</button>
            <button className="btn-dark" onClick={() => update((s) => { delete s.checkins[ds]; })}>{t('b_c')}</button>
          </div>
          <button className="btn-dark btn-big" onClick={closeModal}>{t('de_fechar')}</button>
        </div>
      );
    };
    openModal(<Day />);
  };

  const Victory = () => (
    <div className="relative overflow-hidden text-center">
      <Trophy size={64} className="mx-auto mb-3 text-gold" />
      <h2 className="font-display text-3xl tracking-wide">{t('vic_t')} {(S.name || t('warrior_w')).toUpperCase()}!</h2>
      <p className="mt-2 text-sm text-muted">{L.modeA(S) ? t('vic_2') : t('vic_3')}. {t('vic_x')}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="chip">🔥 {L.progressDays(S)}{t('dayw')}</span>
        <span className="chip">✦ {S.purity}% {t('purw')}</span>
        {tier.min >= 90 && <span className="chip">{tier.icon} {tier.name}</span>}
      </div>
      <button className="btn-gold btn-big mt-5" onClick={closeModal}>{t('vic_b')}</button>
    </div>
  );

  const ring = 213.6 * (1 - S.purity / 100);

  return (
    <div className="grid gap-3.5">
      {/* 1. Código do guerreiro (Barra horizontal compacta e imponente) */}
      <Card className="border-gold/40 bg-gradient-to-br from-surface to-gold/5 py-3.5 px-4 sm:px-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="k mb-1">⚡ {t('code')}</span>
            <p className="border-l-[3px] border-gold2 pl-3 text-[15px] sm:text-[16px] font-bold italic leading-snug text-[#f3ead2]">
              "{mantra}"
            </p>
          </div>
          <div className="flex items-center gap-2 flex-none justify-end">
            <span className="k2 hidden xl:inline text-[10px]">{t('phrase_n')}{(S.phraseIdx % mantraPool.length) + 1}{t('phrase_of')}{mantraPool.length}</span>
            <button className="btn-ghost py-1.5 px-3 text-xs" onClick={() => { AF.click(); update((s) => { s.phraseIdx = (s.phraseIdx + 1) % L.mantraPool(s, quotes).length; }); }}>
              <RefreshCw size={13} /> {t('swap')}
            </button>
          </div>
        </div>
      </Card>

      {/* 2. GRADE TÁTICA PRINCIPAL NO PC (Coluna 1: Progresso / Coluna 2: Check-in & Hábitos) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* COLUNA ESQUERDA (7 colunas): Hero, Métricas, Barra de Nível e Efeitos Biológicos */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          <Card glow className="overflow-hidden text-center relative">
            <div className="pointer-events-none absolute left-1/2 top-[6%] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,70,.14),transparent_65%)]" style={{ animation: 'breathe 5s ease-in-out infinite' }} />
            <K className="text-center">{tier.min >= 90 ? t('prog_aura') : t('prog')}</K>
            
            <div className="relative my-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="col-span-2 bg-gradient-to-b from-[#FFE79A] via-gold to-gold2 bg-clip-text font-display text-[clamp(76px,11vw,120px)] leading-[.92] text-transparent drop-shadow-[0_4px_22px_rgba(255,200,70,.3)] sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:py-2">
                {d}
                <small className="mt-1.5 block font-body text-[10.5px] font-extrabold tracking-[.28em] text-muted" style={{ WebkitTextFillColor: '#8E8E93' }}>{L.modeA(S) ? t('daysClean') : t('days')}</small>
              </div>
              <div className="rounded-r border border-line bg-surface2 p-2.5 sm:col-start-1 sm:row-start-2">
                <div className="relative mx-auto h-[66px] w-[66px]">
                  <svg width="66" height="66" viewBox="0 0 80 80" className="-rotate-90">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#26262c" strokeWidth="7" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#FFC846" strokeWidth="7" strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset={ring.toFixed(1)} style={{ transition: 'stroke-dashoffset .8s' }} />
                  </svg>
                  <div className="absolute inset-0 grid place-content-center">
                    <b className="font-display text-base text-gold">{S.purity}%</b>
                    <small className="text-[7px] font-extrabold tracking-[.18em] text-muted">{t('purity')}</small>
                  </div>
                </div>
              </div>
              <div className="rounded-r border border-line bg-surface2 p-2.5 sm:col-start-1 sm:row-start-1 sm:self-center"><b className="block font-display text-xl sm:text-2xl text-gold">{pornFree}</b><small className="text-[9px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hporn')}</small></div>
              <div className="rounded-r border border-line bg-surface2 p-2.5 sm:col-start-3 sm:row-start-1 sm:self-center"><b className="block font-display text-xl sm:text-2xl text-gold">{mastFree}</b><small className="text-[9px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hmast')}</small></div>
              <div className="rounded-r border border-line bg-surface2 p-2.5 sm:col-start-2 sm:row-start-2"><b className="block font-display text-xl sm:text-2xl text-gold">🔥 {streak}</b><small className="text-[9px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hstreak')}</small></div>
              <div className="rounded-r border border-line bg-surface2 p-2.5 sm:col-start-3 sm:row-start-2"><b className="block font-display text-xl sm:text-2xl text-gold">🛡️ {L.sosWins(S)}</b><small className="text-[9px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hsos')}</small></div>
              {tier.min >= 365 && <div className="col-span-2 rounded-r border border-[#EDEDF2] bg-gradient-to-br from-[#EDEDF2] to-[#8F96A0] p-2.5 shadow-[0_0_18px_rgba(230,232,240,.35)] sm:col-span-3 sm:col-start-1 sm:row-start-3"><b className="block font-display text-2xl text-[#141414]">🐉</b><small className="text-[9px] font-extrabold uppercase tracking-[.14em] text-[#33383f]">{t('titan')}</small></div>}
            </div>

            {/* Nível e Progresso */}
            <div className="relative text-left mt-3">
              <K>{t('tier')} — {tier.icon} {tier.name}</K>
              <Bar pct={lvlPct} />
              <div className="mt-1.5 flex justify-between text-[11px] font-extrabold tracking-[.06em] text-muted"><span>{lvlTxt}</span><span className="font-mono">{d}d</span></div>
              {goalMeta && <div className="mt-1 text-[10.5px] font-bold text-gold2">{d >= goalMeta.d ? t('goal_done') + goalMeta.icon + ' ' + goalMeta.n + '!' : t('goal_next') + goalMeta.icon + ' ' + goalMeta.n + t('goal_in') + goalMeta.d + t('goal_days') + (goalMeta.d - d) + t('goal_close')}</div>}
              {tier.reward && <div className="mt-0.5 text-[10.5px] font-bold text-gold2">{t('reward_l')}{tier.reward}</div>}

              {/* Efeitos biológicos ativos neste marco */}
              <div className="mt-3.5 pt-3 border-t border-line/60">
                <div className="mb-2 flex items-center gap-1.5">
                  <Zap size={13} className="text-gold" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold2">
                    {bioData.header}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {bioData.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded-r border border-line bg-surface2 px-2.5 py-1.5 text-left text-[11px] font-medium text-ink">
                      <ShieldCheck size={12} className="flex-none text-gold" />
                      <span className="truncate">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* COLUNA DIREITA (5 colunas): Check-in Diário de Combate + Forja Hoje */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* Check-in Diário */}
          <Card>
            <K>{t('checkin')}{L.modeA(S) ? t('two_pil') : ''}</K>
            <div className="ciday-row mb-2 flex flex-wrap gap-1.5">
              <button className="chip-dim flex-none justify-center" style={{ flex: '0 0 auto' }} onClick={() => { AF.click(); setCiDate(yesterday(ciDate)); }}>{t('prev_d')}</button>
              <button className="chip justify-center" style={{ flex: '1 1 100%', order: -1 }} onClick={() => { AF.click(); setCiDate(today()); }}>📅 {t('today_b')} ({fdmy(today())})</button>
              <button className="chip-dim flex-none justify-center" style={{ flex: '0 0 auto', ...(ciDate >= today() ? { opacity: .35, cursor: 'not-allowed' } : {}) }} disabled={ciDate >= today()} onClick={() => { AF.click(); setCiDate(dstr(new Date(L.parseD(ciDate).getTime() + 86400000))); }}>{t('next_d')}</button>
            </div>
            {ciDate !== today() && <div className="chip mb-2 cursor-default">{t('editing_r')}{fdmy(ciDate)}</div>}
            <div className="flex flex-col gap-2">
              {L.pillars(S).map((k) => {
                const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
                const failTypes = String(cView.fail || '').split('+').filter(Boolean);
                return (
                  <Chk key={k} on={!!cView[k]} failed={!cView[k] && failTypes.includes(FAILMAP[k])} onClick={() => setCI(k, !cView[k], ciDate)}>
                    {t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3')}
                  </Chk>
                );
              })}
            </div>
            {ciDate === today()
              ? <button className="btn-red btn-big mt-3" onClick={failFlow}>{t('fail')}</button>
              : <p className="fnote mt-1">{t('retro')}</p>}
          </Card>

          {/* Forja Hoje (Hábitos diários) */}
          <Card>
            <K>🔨 {t('forgeToday')} — {doneF}{t('of_w')}{S.forge.active.length}</K>
            {act.length ? (
              <>
                <div className="flex flex-col gap-1.5">
                  {act.map((id) => {
                    const h = ALLH.find((x) => x.id === id); if (!h) return null;
                    const dn = fd.includes(id), isF = ff.includes(id), tm = L.hTime(S, id);
                    return (
                      <div key={id} className={`flex items-center gap-2 rounded-r border p-2 text-left text-xs sm:text-[13px] font-semibold transition-colors ${dn ? 'border-gold/50 bg-gold/10' : isF ? 'border-danger/50 bg-danger/10' : 'border-line bg-surface2'}`}>
                        <span className="w-[22px] text-center text-base">{h.icon}</span>
                        <span className={`min-w-0 flex-1 truncate ${dn ? 'text-muted line-through' : isF ? 'text-danger line-through opacity-80' : ''}`}>{h.n}</span>
                        {tm && <span className="font-mono text-[10px] text-gold2">⏰{tm}</span>}
                        <div className="flex items-center gap-1 flex-none">
                          <button
                            type="button"
                            title="Marcar como Falho"
                            onClick={(e) => toggleHabitFailed(id, e)}
                            className={`grid h-[22px] w-[22px] place-items-center rounded border text-[11px] font-bold transition-all ${
                              isF 
                                ? 'border-danger bg-danger text-white' 
                                : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger/60 hover:text-danger'
                            }`}
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            title="Marcar como Cumprido"
                            onClick={(e) => toggleHabitDone(id, e)}
                            className={`grid h-[22px] w-[22px] place-items-center rounded border text-[11px] font-bold transition-all ${
                              dn 
                                ? 'border-gold bg-gold text-[#141414]' 
                                : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold/60 hover:text-gold'
                            }`}
                          >
                            <Check size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bar mt-2.5"><i style={{ width: (S.forge.active.length ? (doneF / S.forge.active.length) * 100 : 0) + '%' }} /></div>
              </>
            ) : (
              <><Empty>{t('ef1')}<br />{t('ef2')} <b className="text-gold">{t('forge_b')}</b>.</Empty>
                <button className="btn-ghost btn-big mt-2" onClick={() => setTab('forge')}>{t('goforge')}</button></>
            )}
          </Card>
        </div>
      </div>

      {/* 3. OPERAÇÕES DO DIA & LINHA DO TEMPO (Lado a lado no PC) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Operações & Tarefas (5 colunas) */}
        <div className="lg:col-span-5">
          <Card>
            <K>🎯 {t('tasksToday')} — {openTasks.length}{t('pend_w')}</K>
            {openTasks.length ? (
              <div className="flex flex-col gap-2">
                {openTasks.map((x) => (
                  <button key={x.id} className="flex items-center gap-2.5 rounded-r border border-line bg-surface2 p-2.5 text-left text-[13px] font-semibold" onClick={() => { update((s) => { const tt = s.tasks.find((y) => y.id == x.id); if (!tt) return; if ((tt.rep || 'unica') === 'unica') tt.done = !tt.done; else { const dd = today(); tt.doneDates = tt.doneDates || []; const i = tt.doneDates.indexOf(dd); if (i >= 0) tt.doneDates.splice(i, 1); else tt.doneDates.push(dd); } }); AF.click(); }}>
                    <span className={`h-2.5 w-2.5 flex-none rounded-full ${{ alta: 'bg-danger', media: 'bg-gold', baixa: 'bg-muted' }[x.pri] || 'bg-muted'}`} />
                    <span className="min-w-0 flex-1 truncate">{x.txt}</span>
                    {x.time && <span className="font-mono text-[11px] text-gold2">{x.time}</span>}
                    <span className="grid h-[20px] w-[20px] flex-none place-items-center rounded-md border border-[#3c3c46] text-transparent">✓</span>
                  </button>
                ))}
              </div>
            ) : <Empty>{t('eo1')}<b className="text-gold">{t('ops_b')}</b>.</Empty>}
          </Card>
        </div>

        {/* Linha do Tempo de Combate (7 colunas) */}
        <div className="lg:col-span-7">
          <Card>
            <K>{t('tlt')}</K>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {[7, 14, 30, 60, 90, 365].map((n) => (
                <button key={n} className={qgRange === n ? 'chip' : 'chip-dim'} style={{ flex: '0 0 auto' }} onClick={() => { AF.click(); setQgRange(n); }}>{n}{t('daysuf')}</button>
              ))}
            </div>
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              <span className="chip cursor-default text-[10.5px]">🏆 {wins}{t('winsw')}</span>
              <span className="chip-dim cursor-default border-danger/50 text-danger text-[10.5px]">💥 {falls}{t('fallsw')}</span>
              <span className="chip-dim cursor-default text-[10.5px]">◐ {part}{t('partw')}</span>
              <span className="chip-dim cursor-default text-[10.5px]">⚡ {rate}{t('ratew')}</span>
              <span className="chip-dim cursor-default border-ok/45 text-ok text-[10.5px]" title={lw ? t('lastw') + fdmy(lw.d) + t('atw') + lw.h : t('nosos')}>🛡️ {L.sosWins(S)}{t('sosw')}</span>
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {cells.map((c) => (
                <button key={c.ds} title={c.ds + ' · ' + c.lab + t('taped')} className={`tlc ${c.cls}`} onClick={() => dayEditor(c.ds)} />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
              <span><b className="tlc w mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_v')}</span>
              <span><b className="tlc p mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_p')}</span>
              <span><b className="tlc f mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_f')}</span>
              <span><b className="mr-1 inline-block h-[13px] w-[13px] rounded bg-[#202026]" />{t('tl_n')}</span>
              <span className="w-full">{t('tl_hint')}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
