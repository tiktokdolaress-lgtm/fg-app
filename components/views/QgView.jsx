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

/* Efeitos biológicos e psicológicos por marco de retenção */
const BIO_EFFECTS = [
  { min: 0, max: 3, perks: ['Quebra do ciclo automático', 'Redução do pico de cortisol', 'Recuperação inicial da dopamina'] },
  { min: 4, max: 7, perks: ['Pico natural de testosterona (+45%)', 'Aumento de energia física', 'Fim gradual da névoa mental'] },
  { min: 8, max: 14, perks: ['Sono profundo restaurador', 'Vontade e assertividade reforçadas', 'Olhar firme e redução da timidez'] },
  { min: 15, max: 30, perks: ['Receptores de dopamina rebalanceados', 'Redução drástica de ansiedade social', 'Magnetismo pessoal e foco aguçado'] },
  { min: 31, max: 60, perks: ['Controle absoluto de pensamentos invasivos', 'Aura de respeito natural', 'Vitalidade transmutada em criação'] },
  { min: 61, max: 90, perks: ['Superação da flatline (platô)', 'Alta performance física e cognitiva', 'Autodomínio e disciplina inabaláveis'] },
  { min: 91, max: 9999, perks: ['Transmutação biológica completa', 'Padrão inquebrável de conduta', 'Mestre absoluto da própria mente'] },
];

function getBioPerks(days) {
  const found = BIO_EFFECTS.find((b) => days >= b.min && days <= b.max);
  return found ? found.perks : BIO_EFFECTS[0].perks;
}

export default function QgView() {
  const { S, update, t, openModal, closeModal, toast, setTab } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const [ciDate, setCiDate] = useState(today());
  const [qgRange, setQgRange] = useState(30);

  /* i18n: patamares, metas, hábitos e mantras traduzidos */
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
  const activePerks = getBioPerks(d);

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

  /* ===== ações ===== */
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

  /* Ação direta para marcar como cumprido na Forja Hoje */
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

  /* Ação direta para marcar como FALHO na Forja Hoje */
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
      {/* Código do guerreiro */}
      <Card className="border-gold/40 bg-gradient-to-br from-surface to-gold/5">
        <div className="lg:flex lg:items-center lg:gap-6">
          <div className="min-w-0 flex-1">
            <K>{t('code')}</K>
            <p className="mb-3.5 border-l-[3px] border-gold2 pl-3.5 text-[17px] font-bold italic leading-relaxed text-[#f3ead2] lg:mb-0 lg:text-[19px]">"{mantra}"</p>
          </div>
          <div className="lg:flex lg:w-60 lg:flex-none lg:flex-col lg:items-center lg:gap-2 lg:rounded-r lg:border lg:border-gold/20 lg:bg-surface2/60 lg:p-4">
            <ShieldCheck size={30} strokeWidth={1.6} className="hidden text-gold lg:block" />
            <div className="k2 hidden lg:block">{t('phrase_n')}{(S.phraseIdx % mantraPool.length) + 1}{t('phrase_of')}{mantraPool.length}</div>
            <button className="btn-ghost" onClick={() => { AF.click(); update((s) => { s.phraseIdx = (s.phraseIdx + 1) % L.mantraPool(s, quotes).length; }); }}><RefreshCw size={14} /> {t('swap')}</button>
          </div>
        </div>
      </Card>

      {/* Hero */}
      <Card glow className="overflow-hidden text-center">
        <div className="pointer-events-none absolute left-1/2 top-[6%] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,70,.14),transparent_65%)]" style={{ animation: 'breathe 5s ease-in-out infinite' }} />
        <K className="text-center">{tier.min >= 90 ? t('prog_aura') : t('prog')}</K>
        <div className="relative my-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <div className="col-span-2 bg-gradient-to-b from-[#FFE79A] via-gold to-gold2 bg-clip-text font-display text-[clamp(88px,15vw,150px)] leading-[.92] text-transparent drop-shadow-[0_4px_22px_rgba(255,200,70,.3)] lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:py-3">
            {d}
            <small className="mt-2 block font-body text-[11px] font-extrabold tracking-[.34em] text-muted" style={{ WebkitTextFillColor: '#8E8E93' }}>{L.modeA(S) ? t('daysClean') : t('days')}</small>
          </div>
          <div className="rounded-r border border-line bg-surface2 p-3 lg:col-start-1 lg:row-start-2">
            <div className="relative mx-auto h-[74px] w-[74px]">
              <svg width="74" height="74" viewBox="0 0 80 80" className="-rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#26262c" strokeWidth="7" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="#FFC846" strokeWidth="7" strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset={ring.toFixed(1)} style={{ transition: 'stroke-dashoffset .8s' }} />
              </svg>
              <div className="absolute inset-0 grid place-content-center">
                <b className="font-display text-lg text-gold">{S.purity}%</b>
                <small className="text-[7.5px] font-extrabold tracking-[.18em] text-muted">{t('purity')}</small>
              </div>
            </div>
          </div>
          <div className="rounded-r border border-line bg-surface2 p-3 lg:col-start-1 lg:row-start-1 lg:self-center"><b className="block font-display text-2xl text-gold">{pornFree}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hporn')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 lg:col-start-3 lg:row-start-1 lg:self-center"><b className="block font-display text-2xl text-gold">{mastFree}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hmast')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 lg:col-start-2 lg:row-start-2"><b className="block font-display text-2xl text-gold">🔥 {streak}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hstreak')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 lg:col-start-3 lg:row-start-2"><b className="block font-display text-2xl text-gold">🛡️ {L.sosWins(S)}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-muted">{t('hsos')}</small></div>
          {tier.min >= 365 && <div className="col-span-2 rounded-r border border-[#EDEDF2] bg-gradient-to-br from-[#EDEDF2] to-[#8F96A0] p-3 shadow-[0_0_18px_rgba(230,232,240,.35)] lg:col-span-3 lg:col-start-1 lg:row-start-3"><b className="block font-display text-2xl text-[#141414]">🐉</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.14em] text-[#33383f]">{t('titan')}</small></div>}
        </div>

        {/* Nível e Progresso */}
        <div className="relative text-left">
          <K>{t('tier')} — {tier.icon} {tier.name}</K>
          <Bar pct={lvlPct} />
          <div className="mt-2 flex justify-between text-[11.5px] font-extrabold tracking-[.06em] text-muted"><span>{lvlTxt}</span><span className="font-mono">{d}d</span></div>
          {goalMeta && <div className="mt-1 text-[11px] font-bold text-gold2">{d >= goalMeta.d ? t('goal_done') + goalMeta.icon + ' ' + goalMeta.n + '!' : t('goal_next') + goalMeta.icon + ' ' + goalMeta.n + t('goal_in') + goalMeta.d + t('goal_days') + (goalMeta.d - d) + t('goal_close')}</div>}
          {tier.reward && <div className="mt-1 text-[11px] font-bold text-gold2">{t('reward_l')}{tier.reward}</div>}

          {/* EFEITOS BIOLÓGICOS E MENTAIS ATIVOS NESTE MARCO */}
          <div className="mt-4 pt-3.5 border-t border-line/60">
            <div className="mb-2 flex items-center gap-1.5">
              <Zap size={13} className="text-gold" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold2">
                EFEITOS BIOLÓGICOS & MENTAIS ATIVOS NESTE MARCO:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {activePerks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-r border border-line bg-surface2 px-2.5 py-1.5 text-left text-[11.5px] font-medium text-ink">
                  <ShieldCheck size={13} className="flex-none text-gold" />
                  <span className="truncate">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Check-in */}
      <Card>
        <K>{t('checkin')}{L.modeA(S) ? t('two_pil') : ''}</K>
        <div className="ciday-row mb-2.5 flex flex-wrap gap-1.5">
          <button className="chip-dim flex-none justify-center" style={{ flex: '0 0 auto' }} onClick={() => { AF.click(); setCiDate(yesterday(ciDate)); }}>{t('prev_d')}</button>
          <button className="chip justify-center" style={{ flex: '1 1 100%', order: -1 }} onClick={() => { AF.click(); setCiDate(today()); }}>{t('today_b')} ({fdmy(today())})</button>
          <button className="chip-dim flex-none justify-center" style={{ flex: '0 0 auto', ...(ciDate >= today() ? { opacity: .35, cursor: 'not-allowed' } : {}) }} disabled={ciDate >= today()} onClick={() => { AF.click(); setCiDate(dstr(new Date(L.parseD(ciDate).getTime() + 86400000))); }}>{t('next_d')}</button>
        </div>
        {ciDate !== today() && <div className="chip mb-2.5 cursor-default">{t('editing_r')}{fdmy(ciDate)}</div>}
        <div className="flex flex-col gap-2.5">
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
          ? <button className="btn-red btn-big mt-4" onClick={failFlow}>{t('fail')}</button>
          : <p className="fnote mt-1">{t('retro')}</p>}
      </Card>

      {/* Forja hoje + operações */}
      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <K>🔨 {t('forgeToday')} — {doneF}{t('of_w')}{S.forge.active.length}</K>
          {act.length ? (
            <>
              <div className="flex flex-col gap-2">
                {act.map((id) => {
                  const h = ALLH.find((x) => x.id === id); if (!h) return null;
                  const dn = fd.includes(id), isF = ff.includes(id), tm = L.hTime(S, id);
                  return (
                    <div key={id} className={`flex items-center gap-2.5 rounded-r border p-2.5 text-left text-sm font-semibold transition-colors ${dn ? 'border-gold/50 bg-gold/10' : isF ? 'border-danger/50 bg-danger/10' : 'border-line bg-surface2'}`}>
                      <span className="w-[26px] text-center text-lg">{h.icon}</span>
                      <span className={`min-w-0 flex-1 truncate ${dn ? 'text-muted line-through' : isF ? 'text-danger line-through opacity-80' : ''}`}>{h.n}</span>
                      {tm && <span className="font-mono text-[11px] text-gold2">⏰{tm}</span>}
                      
                      {/* Botões rápidos: Cumprido (✔) ou Falho (✕) */}
                      <div className="flex items-center gap-1.5 flex-none">
                        {/* Botão Falho */}
                        <button
                          type="button"
                          title="Marcar como Falho"
                          onClick={(e) => toggleHabitFailed(id, e)}
                          className={`grid h-[24px] w-[24px] place-items-center rounded-md border text-[13px] font-bold transition-all ${
                            isF 
                              ? 'border-danger bg-danger text-white shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                              : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger/60 hover:text-danger'
                          }`}
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>

                        {/* Botão Cumprido */}
                        <button
                          type="button"
                          title="Marcar como Cumprido"
                          onClick={(e) => toggleHabitDone(id, e)}
                          className={`grid h-[24px] w-[24px] place-items-center rounded-md border text-[13px] font-bold transition-all ${
                            dn 
                              ? 'border-gold bg-gold text-[#141414] shadow-[0_0_8px_rgba(255,200,70,0.5)]' 
                              : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold/60 hover:text-gold'
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bar mt-3"><i style={{ width: (S.forge.active.length ? (doneF / S.forge.active.length) * 100 : 0) + '%' }} /></div>
            </>
          ) : (
            <><Empty>{t('ef1')}<br />{t('ef2')} <b className="text-gold">{t('forge_b')}</b>.</Empty>
              <button className="btn-ghost btn-big mt-2.5" onClick={() => setTab('forge')}>{t('goforge')}</button></>
          )}
        </Card>
        <Card>
          <K>🎯 {t('tasksToday')} — {openTasks.length}{t('pend_w')}</K>
          {openTasks.length ? (
            <div className="flex flex-col gap-2">
              {openTasks.map((x) => (
                <button key={x.id} className="flex items-center gap-2.5 rounded-r border border-line bg-surface2 p-2.5 text-left text-[13.5px] font-semibold" onClick={() => { update((s) => { const tt = s.tasks.find((y) => y.id == x.id); if (!tt) return; if ((tt.rep || 'unica') === 'unica') tt.done = !tt.done; else { const dd = today(); tt.doneDates = tt.doneDates || []; const i = tt.doneDates.indexOf(dd); if (i >= 0) tt.doneDates.splice(i, 1); else tt.doneDates.push(dd); } }); AF.click(); }}>
                  <span className={`h-2.5 w-2.5 flex-none rounded-full ${{ alta: 'bg-danger', media: 'bg-gold', baixa: 'bg-muted' }[x.pri] || 'bg-muted'}`} />
                  <span className="min-w-0 flex-1 truncate">{x.txt}</span>
                  {x.time && <span className="font-mono text-[11px] text-gold2">{x.time}</span>}
                  <span className="grid h-[21px] w-[21px] flex-none place-items-center rounded-md border-2 border-[#3c3c46] text-transparent">✓</span>
                </button>
              ))}
            </div>
          ) : <Empty>{t('eo1')}<b className="text-gold">{t('ops_b')}</b>.</Empty>}
        </Card>
      </div>

      {/* Linha do tempo */}
      <Card>
        <K>{t('tlt')}</K>
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {[7, 14, 30, 60, 90, 365].map((n) => (
            <button key={n} className={qgRange === n ? 'chip' : 'chip-dim'} style={{ flex: '0 0 auto' }} onClick={() => { AF.click(); setQgRange(n); }}>{n}{t('daysuf')}</button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="chip cursor-default">🏆 {wins}{t('winsw')}</span>
          <span className="chip-dim cursor-default border-danger/50 text-danger">💥 {falls}{t('fallsw')}</span>
          <span className="chip-dim cursor-default">◐ {part}{t('partw')}</span>
          <span className="chip-dim cursor-default">⚡ {rate}{t('ratew')}</span>
          <span className="chip-dim cursor-default border-ok/45 text-ok" title={lw ? t('lastw') + fdmy(lw.d) + t('atw') + lw.h : t('nosos')}>🛡️ {L.sosWins(S)}{t('sosw')}</span>
        </div>
        <div className="flex flex-wrap gap-[5px]">
          {cells.map((c) => (
            <button key={c.ds} title={c.ds + ' · ' + c.lab + t('taped')} className={`tlc ${c.cls}`} onClick={() => dayEditor(c.ds)} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-muted">
          <span><b className="tlc w mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_v')}</span>
          <span><b className="tlc p mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_p')}</span>
          <span><b className="tlc f mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_f')}</span>
          <span><b className="mr-1 inline-block h-[13px] w-[13px] rounded bg-[#202026]" />{t('tl_n')}</span>
          <span className="w-full">{t('tl_hint')}</span>
        </div>
      </Card>
    </div>
  );
}
