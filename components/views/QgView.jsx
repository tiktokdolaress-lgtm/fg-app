'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, CalendarDays, Flame, ShieldCheck, Droplets, Hand, HeartPulse, Check, X, Zap, Sparkles, ShieldAlert, Target, Compass, MoreVertical, LayoutDashboard, ChevronDown, ChevronUp, Clock, Link as LinkIcon } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Bar, Chk, Empty } from '@/components/ui';
import { METAS, NEXTF, FAIL_PEN, TRIGGERS, FAIL_LBL, TIERS, QUOTES } from '@/lib/data';
import { cx, cxHabits, cxTiers, cxQuotes } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF, metaSfx } from '@/lib/audio';
import { today, dstr, fdmy, fmtD, pad, yesterday } from '@/lib/utils';

const QG_CATEGORIES = [
  { id: 'overview', label: 'Progresso & Combate', icon: ShieldCheck },
  { id: 'timeline', label: 'Linha do Tempo', icon: CalendarDays },
];

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

/* Textos Trilíngues do Bloco de Protocolo Tático */
const TACTICAL_BLOCK_I18N = {
  title: {
    pt: 'PROTOCOLO TÁTICO & BLINDAGEM DO DIA',
    en: 'TACTICAL PROTOCOL & DAILY SHIELDING',
    es: 'PROTOCOLO TÁCTICO Y BLINDAJE DIARIO',
  },
  riskTitle: {
    pt: 'ZONA DE RISCO ELEVADO',
    en: 'HIGH RISK ZONE',
    es: 'ZONA DE ALTO RIESGO',
  },
  riskDesc: {
    pt: 'Noite / Cansaço (22h - 01h). Mantenha as telas fora do quarto.',
    en: 'Night / Fatigue (10 PM - 1 AM). Keep screens away from bed.',
    es: 'Noche / Cansancio (22h - 01h). Mantén las pantallas fuera del cuarto.',
  },
  goldenRuleTitle: {
    pt: 'REGRA DE CONDUTA',
    en: 'RULE OF CONDUCT',
    es: 'REGLA DE CONDUCTA',
  },
  goldenRuleDesc: {
    pt: 'A tentação dura 10 minutos. O arrependimento dura dias inteiros.',
    en: 'The urge lasts 10 minutes. Regret lingers for days.',
    es: 'La tentación dura 10 minutos. El arrepentimiento dura días enteros.',
  },
  energyTitle: {
    pt: 'ENERGIA VITAL',
    en: 'VITAL ENERGY',
    es: 'ENERGÍA VITAL',
  },
  energyDesc: {
    pt: 'Transmute o fogo interno em treino, estudo e trabalho.',
    en: 'Transmute inner fire into training, studying, and building.',
    es: 'Transmuta el fuego interno en entrenamiento, estudio y trabajo.',
  },
};

function getBioPerksI18n(days, lang) {
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const found = BIO_EFFECTS_I18N.tiers.find((b) => days >= b.min && days <= b.max) || BIO_EFFECTS_I18N.tiers[0];
  return {
    header: BIO_EFFECTS_I18N.header[currentLang] || BIO_EFFECTS_I18N.header.pt,
    perks: found.perks[currentLang] || found.perks.pt,
  };
}

/* Hook de Cronômetro Tático em Tempo Real (Segundo a Segundo) */
function useLiveTimer(startDateStr, daysTotal) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function tick() {
      if (!startDateStr) {
        setTime({ days: Number(daysTotal) || 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      let startMs = 0;
      if (typeof startDateStr === 'number') {
        startMs = startDateStr;
      } else if (typeof startDateStr === 'string' && startDateStr.length === 10) {
        const p = startDateStr.split('-').map(Number);
        startMs = new Date(p[0], p[1] - 1, p[2], 0, 0, 0).getTime();
      } else {
        startMs = new Date(startDateStr).getTime();
      }

      if (isNaN(startMs) || startMs <= 0) {
        startMs = Date.now();
      }

      const diff = Math.max(0, Date.now() - startMs);
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const effectiveDays = Math.max(days, Number(daysTotal) || 0);
      setTime({ days: effectiveDays, hours, minutes, seconds });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startDateStr, daysTotal]);

  return time;
}

export default function QgView() {
  const { S, update, t, openModal, closeModal, toast, setTab } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const [ciDate, setCiDate] = useState(today());
  const [qgRange, setQgRange] = useState(30);
  const [activeCategory, setActiveCategory] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBioEffects, setShowBioEffects] = useState(false);
  const [showTacticsAccordion, setShowTacticsAccordion] = useState(false);

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
  const tac = TACTICAL_BLOCK_I18N;
  const liveTime = useLiveTimer(S.retStart || S.created || today(), d);

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
    } else if (all) {
      toast('✅ ' + fdmy(dd) + t('recvit'));
    } else {
      if (v) AF.seal();
      else AF.click();
    }
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

  const getCategoryLabel = (id) => {
    const map = {
      overview: { pt: 'Combate', en: 'Combat', es: 'Combate' },
      timeline: { pt: 'Linha do Tempo', en: 'Timeline', es: 'Línea de Tiempo' },
    };
    return map[id]?.[curLang] || map[id]?.pt || id;
  };

  const getCategoryBadge = (catId) => {
    if (catId === 'overview') {
      return S.forge.active.length ? `${doneF}/${S.forge.active.length}` : `${d}d`;
    }
    if (catId === 'timeline') {
      return `${rate}%`;
    }
    return null;
  };

  const totalTasksToday = S.tasks.filter((x) => L.repDue(x, today()));
  const pendingTasksCount = totalTasksToday.filter((x) => !L.isDone(x, today())).length;

  const nextMantra = () => {
    AF.click();
    update((s) => {
      s.phraseIdx = (s.phraseIdx + 1) % L.mantraPool(s, quotes).length;
    });
  };

  /* Blocos Modulares de Renderização */
  const renderMantra = () => (
    <Card className="border-gold/40 bg-gradient-to-br from-surface to-gold/5 py-2.5 px-3.5 sm:px-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Frase Clicável com feedback visual de transição e contador */}
        <div
          onClick={nextMantra}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nextMantra(); }}
          title={curLang === 'en' ? 'Click to show next phrase' : curLang === 'es' ? 'Haz clic para la siguiente frase' : 'Clique para ver a próxima frase'}
          className="group min-w-0 flex-1 cursor-pointer select-none transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="k text-[10px] text-gold flex items-center gap-1">
              ⚡ {t('code')}
            </span>
            <span className="text-[10px] text-muted/70 font-mono group-hover:text-gold transition-colors">
              ({(S.phraseIdx % mantraPool.length) + 1}/{mantraPool.length} · {curLang === 'en' ? 'click phrase to rotate' : curLang === 'es' ? 'clic en la frase para cambiar' : 'clique na frase para alternar'})
            </span>
          </div>
          <p className="border-l-[3px] border-gold2 pl-3 text-[14px] sm:text-[15.5px] font-bold italic leading-snug text-[#f3ead2] group-hover:text-gold transition-colors">
            "{mantra}"
          </p>
        </div>

        {/* Botão Tarefas do Dia no lugar do botão anterior (abre Projetos & Tarefas ao clicar) */}
        <div className="flex items-center gap-2 flex-none justify-end pt-1 sm:pt-0">
          <button
            type="button"
            onClick={() => { AF.click(); setTab('ops'); }}
            className="btn-gold py-1.5 px-3 sm:px-4 text-xs font-extrabold flex items-center gap-2 rounded-r shadow-[0_2px_10px_rgba(255,200,70,0.15)] hover:shadow-[0_2px_15px_rgba(255,200,70,0.3)] transition-all active:scale-95 whitespace-nowrap"
            title={curLang === 'en' ? 'Open Daily Tasks' : curLang === 'es' ? 'Abrir Tareas del Día' : 'Abrir Tarefas do Dia'}
          >
            <Target size={14} className="text-deep flex-none" />
            <span>{curLang === 'en' ? 'Daily Tasks' : curLang === 'es' ? 'Tareas del Día' : 'Tarefas do Dia'}</span>
            {pendingTasksCount > 0 ? (
              <span className="rounded-full bg-deep text-gold px-1.5 py-0.2 text-[10px] font-black leading-none">
                {pendingTasksCount}
              </span>
            ) : (
              <span className="rounded-full bg-deep/20 text-deep px-1.5 py-0.2 text-[10px] font-black leading-none">
                ✓
              </span>
            )}
          </button>
        </div>
      </div>
    </Card>
  );

  /* 2. O CORAÇÃO DA FORJA: MOSTRADOR CIRCULAR DE AÇO E FOGO (Hero Combat Dial / Anel da Forja) */
  const renderCombatDial = (isDesktop = false) => {
    const dialCircumference = 515.22;
    const dialOffset = dialCircumference * (1 - Math.min(100, Math.max(0, lvlPct)) / 100);

    return (
      <div className={`rounded-2xl border border-[#4A3B22] bg-gradient-to-b from-[#1C1A24] via-[#121217] to-[#0A0A0D] ${isDesktop ? 'p-4 sm:p-5' : 'p-3.5 sm:p-4'} shadow-[0_8px_32px_rgba(0,0,0,0.85)] relative overflow-hidden text-center w-full max-w-full`}>
        {/* Brilho radial de brasa incandescente */}
        <div className={`pointer-events-none absolute left-1/2 top-[8%] ${isDesktop ? 'h-[300px] w-[300px]' : 'h-[240px] w-[240px]'} -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,100,20,0.18)_0%,rgba(200,60,10,0.04)_55%,transparent_75%)]`} />

        {/* Topo do Hero: Patente de Guerra, Pureza, Sequência e SOS */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-line/60 relative z-10 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`${isDesktop ? 'text-xl' : 'text-base'} drop-shadow-sm flex-none`}>{tier.icon}</span>
            <div className="flex flex-col min-w-0 text-left">
              <span className={`font-display ${isDesktop ? 'text-sm sm:text-base' : 'text-xs'} uppercase tracking-wider text-gold font-black truncate`}>
                {tier.name}
              </span>
              {isDesktop && (
                <span className="text-[10px] text-muted font-mono truncate">
                  {tier.min >= 90 ? t('prog_aura') : `${d} ${t('days')} ${t('of_w')} 90d`}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-none">
            <span className="rounded-md border border-gold/30 bg-gold/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-gold font-bold whitespace-nowrap">
              💎 {S.purity}%
            </span>
            <span className="rounded-md border border-gold/30 bg-gold/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-gold font-bold whitespace-nowrap">
              🔥 {streak} {streak === 1 ? 'DIA' : 'DIAS'}
            </span>
            {isDesktop && (
              <span className="rounded-md border border-ok/30 bg-ok/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono text-ok font-bold whitespace-nowrap" title={lw ? t('lastw') + fdmy(lw.d) + t('atw') + lw.h : t('nosos')}>
                🛡️ {L.sosWins(S)} SOS
              </span>
            )}
          </div>
        </div>

        {/* O Mostrador Circular da Forja */}
        <div className={`relative mx-auto ${isDesktop ? 'h-[210px] w-[210px] sm:h-[230px] sm:w-[230px] my-2 sm:my-3' : 'h-[176px] w-[176px] sm:h-[190px] sm:w-[190px] my-1 sm:my-2'}`}>
          <svg width="100%" height="100%" viewBox="0 0 200 200" className="-rotate-90">
            <defs>
              <linearGradient id={isDesktop ? "forgeFireGradDesk" : "forgeFireGrad"} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3B00" />
                <stop offset="50%" stopColor="#FF9500" />
                <stop offset="100%" stopColor="#FFC846" />
              </linearGradient>
              <filter id={isDesktop ? "forgeGlowDesk" : "forgeGlow"} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="82" fill="none" stroke="#22222C" strokeWidth="8" strokeDasharray="4 6" opacity="0.3" />
            <circle cx="100" cy="100" r="82" fill="none" stroke="#181822" strokeWidth="9" />
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke={isDesktop ? "url(#forgeFireGradDesk)" : "url(#forgeFireGrad)"}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="515.22"
              strokeDashoffset={dialOffset.toFixed(1)}
              filter={isDesktop ? "url(#forgeGlowDesk)" : "url(#forgeGlow)"}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>

          {/* Conteúdo Central do Mostrador */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1.5 select-none">
            <div className="flex items-center gap-1 text-gold/80 mb-0.5">
              <span className={isDesktop ? "text-sm sm:text-base" : "text-xs sm:text-sm"}>⚔️</span>
            </div>

            <span className={`font-display ${isDesktop ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'} font-black leading-none bg-gradient-to-b from-[#FFF5D6] via-[#FFCA40] to-[#B87A18] bg-clip-text text-transparent drop-shadow-[0_4px_18px_rgba(255,180,50,0.35)] tracking-tight`}>
              {d}
            </span>

            <span className={`mt-1 ${isDesktop ? 'text-[9.5px] sm:text-[10.5px]' : 'text-[8.5px] sm:text-[9px]'} font-extrabold uppercase tracking-[0.2em] text-[#C9C2B0] px-1 truncate max-w-full`}>
              {L.modeA(S) ? t('daysClean') : (curLang === 'en' ? 'RAW RETENTION' : curLang === 'es' ? 'RETENCIÓN PURA' : 'RETENÇÃO BRUTA')}
            </span>

            {/* Cronômetro ao vivo segundo a segundo */}
            <div className={`mt-1 sm:mt-1.5 flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/80 ${isDesktop ? 'px-3 py-0.5' : 'px-2 sm:px-2.5 py-0.5'} shadow-inner max-w-full`}>
              <Clock size={isDesktop ? 11 : 9} className="text-gold animate-pulse flex-none" />
              <span className={`font-mono ${isDesktop ? 'text-[10px] sm:text-[11px]' : 'text-[9px] sm:text-[9.5px]'} font-bold text-gold tracking-wider truncate`}>
                {pad(liveTime.days)}d · {pad(liveTime.hours)}h · {pad(liveTime.minutes)}m · {pad(liveTime.seconds)}s
              </span>
            </div>
          </div>
        </div>

        {/* Pilares Secundários Integrados e Compactos */}
        <div className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-2'} gap-2 my-2.5 min-w-0`}>
          <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#14141A] border border-line/70 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm flex-none">👁️</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted truncate">
                {curLang === 'en' ? 'Porn-Free' : curLang === 'es' ? 'Sin Porno' : 'Sem Pornô'}
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-gold pl-1 flex-none">
              {pornFree}d
            </span>
          </div>

          <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#14141A] border border-line/70 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-sm flex-none">⚡</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted truncate">
                {curLang === 'en' ? 'Self-Mastery' : curLang === 'es' ? 'Autodominio' : 'Autodomínio'}
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-gold pl-1 flex-none">
              {mastFree}d
            </span>
          </div>

          {isDesktop && (
            <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#14141A] border border-line/70 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs sm:text-sm flex-none">🛡️</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-muted truncate">
                  {curLang === 'en' ? 'SOS Shield' : curLang === 'es' ? 'Escudos SOS' : 'Escudos S.O.S'}
                </span>
              </div>
              <span className="font-mono text-xs sm:text-sm font-black text-gold pl-1 flex-none">
                {L.sosWins(S)}
              </span>
            </div>
          )}
        </div>

        {/* Rodapé do Mostrador: Próximo Patamar & Barra de Brasas */}
        <div className="pt-2.5 border-t border-line/40 relative z-10">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted font-medium mb-1.5 min-w-0">
            <span className="truncate flex-1 text-left font-semibold text-[#EDE5D5]">{lvlTxt}</span>
            {tier.reward && (
              <span className="text-gold2 truncate ml-2 flex-none font-bold">
                🎁 {tier.reward}
              </span>
            )}
          </div>
          <Bar pct={lvlPct} />
        </div>
      </div>
    );
  };

  const renderForgeLevel = (isMobile = false) => (
    <Card className="py-3 px-3.5 sm:py-4 sm:px-5">
      <div className="flex items-center justify-between gap-2">
        <K className="mb-0">{t('tier')} — {tier.icon} {tier.name}</K>
        <span className="text-[10px] font-mono text-muted">{d}d</span>
      </div>
      <div className="my-2">
        <Bar pct={lvlPct} />
      </div>
      <div className="flex justify-between text-[11px] font-extrabold tracking-[.06em] text-muted">
        <span className="truncate">{lvlTxt}</span>
      </div>
      {goalMeta && (
        <div className="mt-1 text-[10.5px] font-bold text-gold2 truncate">
          {d >= goalMeta.d ? t('goal_done') + goalMeta.icon + ' ' + goalMeta.n + '!' : t('goal_next') + goalMeta.icon + ' ' + goalMeta.n + t('goal_in') + goalMeta.d + t('goal_days') + (goalMeta.d - d) + t('goal_close')}
        </div>
      )}
      {tier.reward && <div className="mt-0.5 text-[10.5px] font-bold text-gold2 truncate">{t('reward_l')}{tier.reward}</div>}

      {/* Efeitos biológicos ativos neste marco */}
      {bioData && bioData.perks && bioData.perks.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-line/60">
          {isMobile ? (
            <div>
              <button
                type="button"
                onClick={() => setShowBioEffects((v) => !v)}
                className="w-full flex items-center justify-between text-left py-1 text-gold hover:text-gold2 transition-colors cursor-pointer"
              >
                <span className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] flex items-center gap-1.5">
                  <Zap size={12} className="text-gold flex-none" />
                  <span>{bioData.header} ({bioData.perks.length})</span>
                </span>
                <span className="text-muted text-xs flex items-center gap-0.5">
                  {showBioEffects ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>
              {showBioEffects && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {bioData.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 rounded-r border border-line bg-surface2 px-2.5 py-1.5 text-left text-[11px] font-medium text-ink">
                      <ShieldCheck size={12} className="flex-none text-gold" />
                      <span className="truncate">{perk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Zap size={13} className="text-gold flex-none" />
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
          )}
        </div>
      )}
    </Card>
  );

  const renderTacticalProtocol = () => (
    <Card className="border-gold/20 bg-surface2/80 p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Compass size={14} className="text-gold" />
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold2">
            {tac.title[curLang]}
          </span>
        </div>
        <span className="text-[9.5px] font-mono font-bold text-gold/80 px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
          QG ATIVO
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
        <div className="rounded-r border border-danger/30 bg-danger/5 p-2.5">
          <div className="flex items-center gap-1.5 text-danger font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <ShieldAlert size={13} />
            <span>{tac.riskTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.riskDesc[curLang]}
          </p>
        </div>

        <div className="rounded-r border border-gold/30 bg-gold/5 p-2.5">
          <div className="flex items-center gap-1.5 text-gold font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <Target size={13} />
            <span>{tac.goldenRuleTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.goldenRuleDesc[curLang]}
          </p>
        </div>

        <div className="rounded-r border border-ok/30 bg-ok/5 p-2.5">
          <div className="flex items-center gap-1.5 text-ok font-bold text-[10.5px] uppercase tracking-wider mb-1">
            <Flame size={13} />
            <span>{tac.energyTitle[curLang]}</span>
          </div>
          <p className="text-[11px] text-muted leading-tight">
            {tac.energyDesc[curLang]}
          </p>
        </div>
      </div>
    </Card>
  );

  const renderDailyCheckin = () => (
    <Card className="w-full max-w-full overflow-hidden">
      <K>{t('checkin')}{L.modeA(S) ? t('two_pil') : ''}</K>
      <div className="mb-2.5 flex items-center justify-between gap-2 overflow-hidden w-full">
        <button
          type="button"
          className="chip-dim flex-none px-2.5 py-1 text-[11px] whitespace-nowrap"
          onClick={() => { AF.click(); setCiDate(yesterday(ciDate)); }}
          title={t('prev_d')}
        >
          ◀ {t('prev_d')}
        </button>
        <button
          type="button"
          className={`chip flex-1 justify-center py-1 text-[11px] sm:text-[11.5px] font-bold truncate ${
            ciDate === today() ? 'border-gold/40 text-gold' : 'border-line text-muted hover:text-gold'
          }`}
          onClick={() => { AF.click(); setCiDate(today()); }}
          title={ciDate === today() ? 'Registro de Hoje' : 'Clique para voltar ao registro de hoje'}
        >
          📅 {ciDate === today() ? `${t('today_b')} (${fdmy(today())})` : `${t('today_b')} · Voltar para Hoje`}
        </button>
      </div>
      {ciDate !== today() && (
        <div className="chip mb-2 cursor-default flex items-center justify-between text-gold border-gold/40 text-[11px]">
          <span>{t('editing_r')}{fdmy(ciDate)}</span>
          <button
            type="button"
            className="text-[10px] underline ml-2 text-ink hover:text-gold"
            onClick={() => { AF.click(); setCiDate(today()); }}
          >
            {curLang === 'en' ? 'Back to today' : curLang === 'es' ? 'Volver a hoy' : 'Voltar para hoje'}
          </button>
        </div>
      )}
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
  );

  const renderForgeToday = () => (
    <Card className="flex-1 flex flex-col justify-between">
      <div>
        <K>🔨 {t('forgeToday')} — {doneF}{t('of_w')}{S.forge.active.length}</K>
        {act.length ? (
          <div className="flex flex-col gap-1.5 mt-1">
            {act.map((id) => {
              const h = ALLH.find((x) => x.id === id); if (!h) return null;
              const dn = fd.includes(id), isF = ff.includes(id), tm = L.hTime(S, id);
              return (
                <div key={id} className={`flex items-center gap-2 rounded-r border p-2 text-left text-xs sm:text-[13px] font-semibold transition-colors ${dn ? 'border-gold/50 bg-gold/10' : isF ? 'border-danger/50 bg-danger/10' : 'border-line bg-surface2'}`}>
                  <span className="w-[22px] text-center text-base">{h.icon}</span>
                  <span className={`min-w-0 flex-1 truncate ${dn ? 'text-muted line-through' : isF ? 'text-danger line-through opacity-80' : ''}`}>{h.n}</span>
                  {tm && <span className="font-mono text-[10px] text-gold2">⏰{tm}</span>}
                  <div className="flex items-center gap-1.5 flex-none">
                    <button
                      type="button"
                      title="Marcar como Falho"
                      onClick={(e) => toggleHabitFailed(id, e)}
                      className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                        isF 
                          ? 'border-danger bg-danger text-white shadow-sm' 
                          : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger/60 hover:text-danger'
                      }`}
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      title="Marcar como Cumprido"
                      onClick={(e) => toggleHabitDone(id, e)}
                      className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                        dn 
                          ? 'border-gold bg-gold text-[#141414] shadow-sm' 
                          : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold/60 hover:text-gold'
                      }`}
                    >
                      <Check size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <><Empty>{t('ef1')}<br />{t('ef2')} <b className="text-gold">{t('forge_b')}</b>.</Empty>
            <button className="btn-ghost btn-big mt-2" onClick={() => setTab('forge')}>{t('goforge')}</button></>
        )}
      </div>
      {act.length > 0 && (
        <div className="bar mt-3"><i style={{ width: (S.forge.active.length ? (doneF / S.forge.active.length) * 100 : 0) + '%' }} /></div>
      )}
    </Card>
  );

  const renderTasksToday = () => (
    <Card className="flex-1 flex flex-col justify-between">
      <div>
        <K>🎯 {t('tasksToday')} — {openTasks.length}{t('pend_w')}</K>
        {openTasks.length ? (
          <div className="flex flex-col gap-2 mt-1">
            {openTasks.map((x) => (
              <button key={x.id} className="flex items-center gap-2.5 rounded-r border border-line bg-surface2 p-2.5 text-left text-[13px] font-semibold" onClick={() => { update((s) => { const tt = s.tasks.find((y) => y.id == x.id); if (!tt) return; if ((tt.rep || 'unica') === 'unica') tt.done = !tt.done; else { const dd = today(); tt.doneDates = tt.doneDates || []; const i = tt.doneDates.indexOf(dd); if (i >= 0) tt.doneDates.splice(i, 1); else tt.doneDates.push(dd); } }); AF.click(); }}>
                <span className={`h-2.5 w-2.5 flex-none rounded-full ${{ alta: 'bg-danger', media: 'bg-gold', baixa: 'bg-muted' }[x.pri] || 'bg-muted'}`} />
                <span className="min-w-0 flex-1 truncate">{x.txt}</span>
                {x.time && <span className="font-mono text-[11px] text-gold2">{x.time}</span>}
                <span className="grid h-[20px] w-[20px] flex-none place-items-center rounded-md border border-[#3c3c46] text-transparent">✓</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <Empty>{t('eo1')}<b className="text-gold">{t('ops_b')}</b>.</Empty>
          </div>
        )}
      </div>
      <button className="btn-ghost w-full text-xs mt-2 py-1.5" onClick={() => { AF.click(); setTab('ops'); }}>
        + Gerenciar Operações
      </button>
    </Card>
  );

  const renderTimeline = () => (
    <Card className="flex-1 flex flex-col justify-between">
      <div>
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
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted pt-2 border-t border-line/40">
        <span><b className="tlc w mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_v')}</span>
        <span><b className="tlc p mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_p')}</span>
        <span><b className="tlc f mr-1 inline-block" style={{ animation: 'none' }} />{t('tl_f')}</span>
        <span><b className="mr-1 inline-block h-[13px] w-[13px] rounded bg-[#202026]" />{t('tl_n')}</span>
        <span className="w-full">{t('tl_hint')}</span>
      </div>
    </Card>
  );

  /* OPÇÃO A: Mobile Combat Dashboard "Forjando Guerreiros" (Aço, Forja, Honra & Alta Densidade) */
  const renderMobileOneScreen = () => {
    const dialCircumference = 515.22;
    const dialOffset = dialCircumference * (1 - Math.min(100, Math.max(0, lvlPct)) / 100);

    return (
      <div className="flex flex-col gap-3">
        {/* 1. FRASE DE GUERRA & CÓDIGO DO GUERREIRO (Mantra clicável com som de bigorna) */}
        <div
          onClick={nextMantra}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nextMantra(); }}
          className="group flex items-start justify-between gap-2.5 rounded-xl border border-gold/35 bg-gradient-to-r from-[#17161E] to-[#121217] px-3.5 py-2.5 cursor-pointer select-none transition-all active:scale-[0.99] shadow-sm"
        >
          <div className="min-w-0 flex-1 flex items-start gap-2">
            <span className="text-xs text-gold flex-none mt-0.5 animate-pulse">⚡</span>
            <p className="text-xs font-semibold italic text-[#f3ead2] group-hover:text-gold transition-colors leading-relaxed">
              "{mantra}"
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-none pl-1 pt-0.5">
            <span className="text-[10px] text-muted font-mono">
              {(S.phraseIdx % mantraPool.length) + 1}/{mantraPool.length}
            </span>
            <RefreshCw size={11} className="text-muted/60 group-hover:text-gold transition-colors" />
          </div>
        </div>

        {/* 2. O CORAÇÃO DA FORJA: MOSTRADOR CIRCULAR DE AÇO E FOGO (Hero Combat Dial) */}
        {renderCombatDial(false)}

        {/* 3. BLINDAGEM DO DIA: REGISTRO TÁTICO DIRETO (Os 3 Escudos do Guerreiro) */}
        <div className="rounded-xl border border-line/80 bg-[#15151C] p-3 sm:p-3.5 shadow-sm w-full max-w-full overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm flex-none">🛡️</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F2ECE0] truncate">
                {curLang === 'en' ? 'DAILY SHIELDING' : curLang === 'es' ? 'BLINDAJE DIARIO' : 'BLINDAGEM DE HOJE'}
              </span>
              <span className="text-[9.5px] font-mono text-gold/90 font-bold flex-none">
                ({ciDate === today() ? fdmy(today()) : fdmy(ciDate)})
              </span>
            </div>

            <div className="flex items-center gap-1 flex-none ml-auto">
              <button
                type="button"
                className="text-[10px] text-muted hover:text-gold px-2 py-0.5 rounded border border-line/60 bg-surface2 font-semibold transition-colors"
                onClick={() => { AF.click(); setCiDate(yesterday(ciDate)); }}
                title={t('prev_d')}
              >
                ◀ {curLang === 'en' ? 'Yesterday' : curLang === 'es' ? 'Ayer' : 'Ontem'}
              </button>
              {ciDate !== today() && (
                <button
                  type="button"
                  className="text-[10px] text-gold px-2 py-0.5 rounded border border-gold/40 bg-gold/15 font-black transition-colors"
                  onClick={() => { AF.click(); setCiDate(today()); }}
                >
                  {curLang === 'en' ? 'Today' : curLang === 'es' ? 'Hoy' : 'Hoje'} ▶
                </button>
              )}
            </div>
          </div>

          {/* OS 3 ESCUDOS INTERATIVOS TÁTEIS */}
          <div className="flex flex-col gap-2">
            {L.pillars(S).map((k) => {
              const isChecked = !!cView[k];
              const FAILMAP = { p: 'porn', m: 'mast', r: 'ejac' };
              const failTypes = String(cView.fail || '').split('+').filter(Boolean);
              const isFailed = !isChecked && failTypes.includes(FAILMAP[k]);

              const SHIELD_DATA = {
                r: {
                  icon: '🛡️',
                  title: curLang === 'en' ? 'Semen Retention Maintained' : curLang === 'es' ? 'Retención Seminal Mantenida' : 'Retenção Seminal Mantida',
                  sub: curLang === 'en' ? 'Vital energy preserved (No ejaculation)' : curLang === 'es' ? 'Energía vital preservada (Sin eyaculación)' : 'Energia vital preservada (Sem ejaculação)',
                },
                p: {
                  icon: '👁️',
                  title: curLang === 'en' ? 'Zero Pornography' : curLang === 'es' ? 'Cero Pornografía' : 'Zero Pornografia',
                  sub: curLang === 'en' ? 'Mind guarded, clean gaze' : curLang === 'es' ? 'Mente blindada, mirada limpia' : 'Mente blindada, olhar firme e limpo',
                },
                m: {
                  icon: '⚡',
                  title: curLang === 'en' ? 'Unshakable Self-Mastery' : curLang === 'es' ? 'Autodominio Inquebrantable' : 'Autodomínio Inabalável',
                  sub: curLang === 'en' ? 'Zero masturbation, impulse conquered' : curLang === 'es' ? 'Cero masturbación, impulso dominado' : 'Zero masturbação, soberania sobre o impulso',
                },
              };

              const item = SHIELD_DATA[k] || { icon: '⚔️', title: t(k === 'p' ? 'c1' : k === 'm' ? 'c2' : 'c3'), sub: '' };

              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCI(k, !isChecked, ciDate)}
                  className={`group flex items-center justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all active:scale-[0.98] cursor-pointer ${
                    isChecked
                      ? 'border-gold/60 bg-gradient-to-r from-gold/20 via-amber-500/10 to-surface2 shadow-[0_2px_12px_rgba(255,200,70,0.12)]'
                      : isFailed
                      ? 'border-danger/60 bg-danger/10'
                      : 'border-line/70 bg-surface2/60 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`grid h-8 w-8 sm:h-9 sm:w-9 flex-none place-items-center rounded-lg border text-sm sm:text-base transition-all ${
                      isChecked
                        ? 'border-gold bg-gold text-[#141414] shadow-md scale-105 font-black'
                        : isFailed
                        ? 'border-danger bg-danger/20 text-danger'
                        : 'border-[#383844] bg-[#1C1C24] text-muted group-hover:border-gold/50'
                    }`}>
                      {isChecked ? '✓' : item.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`text-xs font-bold leading-tight truncate ${
                        isChecked ? 'text-gold' : isFailed ? 'text-danger' : 'text-[#EDE5D5]'
                      }`}>
                        {item.title}
                      </span>
                      <span className="text-[9.5px] text-muted truncate mt-0.5">
                        {item.sub}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center flex-none pl-2">
                    {isChecked ? (
                      <span className="rounded-md border border-gold/40 bg-gold/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-gold shadow-sm">
                        BLINDADO
                      </span>
                    ) : isFailed ? (
                      <span className="rounded-md border border-danger/40 bg-danger/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-danger">
                        FALHOU
                      </span>
                    ) : (
                      <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted group-hover:text-gold group-hover:border-gold/30">
                        MARCAR
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selo de Vitória Se Hoje For 100% Blindado */}
          {cView.ok && (
            <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 py-1.5 text-center text-gold text-xs font-extrabold shadow-sm animate-pulse">
              <span>🏆</span>
              <span className="tracking-wide">
                {curLang === 'en' ? 'DAILY BATTLE WON · HONOR INTACT' : curLang === 'es' ? 'BATALLA DIARIA GANADA · HONOR INTACTO' : 'BATALHA DE HOJE VENCIDA · HONRA INTACTA'}
              </span>
            </div>
          )}

          {/* Botão de Queda Solene em Combate */}
          {ciDate === today() ? (
            <button
              type="button"
              className="mt-2.5 w-full py-1.5 sm:py-2 rounded-lg border border-danger/30 bg-danger/10 text-danger hover:bg-danger hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99]"
              onClick={failFlow}
            >
              <span>🩸</span>
              <span>{curLang === 'en' ? 'Register Battle Fall' : curLang === 'es' ? 'Registrar Caída' : 'Registrar Queda em Combate'}</span>
            </button>
          ) : (
            <p className="fnote mt-1.5 text-center">{t('retro')}</p>
          )}
        </div>

        {/* 4. A FORJA HOJE - HÁBITOS DE DISCIPLINA & FORÇA */}
        <Card className="p-3 sm:p-3.5">
          <div className="flex items-center justify-between mb-2">
            <K className="mb-0">🔨 {t('forgeToday')} — {doneF}{t('of_w')}{S.forge.active.length}</K>
            <button
              type="button"
              onClick={() => { AF.click(); setTab('forge'); }}
              className="text-[10.5px] text-gold hover:text-gold2 font-medium"
            >
              {curLang === 'en' ? 'Edit habits →' : curLang === 'es' ? 'Editar hábitos →' : 'Editar hábitos →'}
            </button>
          </div>

          {act.length ? (
            <div className="flex flex-col gap-1.5 mt-1">
              {act.map((id) => {
                const h = ALLH.find((x) => x.id === id); if (!h) return null;
                const dn = fd.includes(id), isF = ff.includes(id), tm = L.hTime(S, id);
                return (
                  <div key={id} className={`flex items-center gap-2 rounded-r border p-2 text-left text-xs font-semibold transition-colors ${dn ? 'border-gold/50 bg-gold/10' : isF ? 'border-danger/50 bg-danger/10' : 'border-line bg-surface2'}`}>
                    <span className="w-[20px] text-center text-sm">{h.icon}</span>
                    <span className={`min-w-0 flex-1 truncate ${dn ? 'text-muted line-through' : isF ? 'text-danger line-through opacity-80' : ''}`}>{h.n}</span>
                    {tm && <span className="font-mono text-[10px] text-gold2">⏰{tm}</span>}
                    <div className="flex items-center gap-1.5 flex-none">
                      <button
                        type="button"
                        title="Marcar como Falho"
                        onClick={(e) => toggleHabitFailed(id, e)}
                        className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                          isF 
                            ? 'border-danger bg-danger text-white shadow-sm' 
                            : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-danger/60 hover:text-danger'
                        }`}
                      >
                        <X size={13} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        title="Marcar como Cumprido"
                        onClick={(e) => toggleHabitDone(id, e)}
                        className={`grid h-[28px] w-[28px] place-items-center rounded border text-xs font-bold transition-all ${
                          dn 
                            ? 'border-gold bg-gold text-[#141414] shadow-sm' 
                            : 'border-[#3c3c46] bg-surface text-muted/60 hover:border-gold/60 hover:text-gold'
                        }`}
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-2 text-center">
              <Empty>{t('ef1')}<br />{t('ef2')} <b className="text-gold">{t('forge_b')}</b>.</Empty>
              <button className="btn-ghost btn-big mt-2 text-xs" onClick={() => setTab('forge')}>{t('goforge')}</button>
            </div>
          )}

          {act.length > 0 && (
            <div className="bar mt-2.5"><i style={{ width: (S.forge.active.length ? (doneF / S.forge.active.length) * 100 : 0) + '%' }} /></div>
          )}
        </Card>

        {/* 5. ATALHO COMPACTO PARA OPERAÇÕES DO DIA (Se houver pendentes) */}
        {pendingTasksCount > 0 && (
          <button
            type="button"
            onClick={() => { AF.click(); setTab('ops'); }}
            className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 text-xs font-bold text-gold hover:bg-gold/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target size={14} className="text-gold" />
              <span>🎯 {pendingTasksCount} {curLang === 'en' ? 'daily tasks pending' : curLang === 'es' ? 'operaciones pendientes' : 'operações pendentes hoje'}</span>
            </div>
            <span className="text-[11px] font-semibold text-gold2">
              {curLang === 'en' ? 'Open Missions →' : curLang === 'es' ? 'Ver Misiones →' : 'Ver Missões →'}
            </span>
          </button>
        )}

        {/* 6. EVOLUÇÃO BIOLÓGICA & PROTOCOLO TÁTICO (Acordeão Elegante e Minimalista) */}
        <Card className="p-3 bg-[#131318] border-line/70">
          <button
            type="button"
            onClick={() => setShowTacticsAccordion((v) => !v)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-gold/15 text-gold text-xs flex-none">
                🧬
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#EDE5D5] truncate">
                  {curLang === 'en' ? 'Biological Evolution & Tactics' : curLang === 'es' ? 'Evolución Biológica y Táctica' : 'Evolução Biológica & Protocolo'}
                </span>
                <span className="text-[10px] text-gold/80 font-mono truncate">
                  Fase {tier.name} · {Math.min(100, Math.max(7, Math.round((d / 90) * 100)))}% Restauração
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-muted flex-none pl-2">
              <span className="text-[10px] uppercase font-bold text-gold/70 hidden sm:inline">
                {showTacticsAccordion ? 'Fechar' : 'Explorar'}
              </span>
              {showTacticsAccordion ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} />}
            </div>
          </button>

          {showTacticsAccordion && (
            <div className="mt-3 pt-3 border-t border-line/60 flex flex-col gap-3">
              {/* Efeitos Ativos */}
              {bioData && bioData.perks && bioData.perks.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9.5px] font-mono uppercase font-black tracking-wider text-muted">
                    {curLang === 'en' ? 'Active Neurochemical Effects:' : curLang === 'es' ? 'Efectos Neuroquímicos Activos:' : 'Efeitos Neuroquímicos Deste Marco:'}
                  </span>
                  {bioData.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-2 rounded-lg border border-line/50 bg-surface px-2.5 py-1.5 text-left text-[11px] text-[#EDE5D5]">
                      <span className="text-gold text-xs flex-none mt-0.5">✦</span>
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                  {/* Barra de dopamina */}
                  <div className="mt-1 pt-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-muted mb-1">
                      <span>{curLang === 'en' ? 'Dopamine Receptors Rewiring' : curLang === 'es' ? 'Reprogramación de Dopamina' : 'Receptores de Dopamina'}</span>
                      <span className="font-mono text-gold">{Math.min(100, Math.max(7, Math.round((d / 90) * 100)))}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#202028]">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-danger via-amber-500 to-gold transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(7, Math.round((d / 90) * 100)))}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Regras Táticas */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line/50">
                <span className="text-[9.5px] font-mono uppercase font-black tracking-wider text-muted">
                  {curLang === 'en' ? 'Tactical Survival Rules:' : curLang === 'es' ? 'Reglas Tácticas de Supervivencia:' : 'Regras Táticas de Combate:'}
                </span>
                <div className="rounded border border-danger/30 bg-danger/5 p-2">
                  <div className="flex items-center gap-1.5 text-danger font-bold text-[10px] uppercase tracking-wider mb-0.5">
                    <ShieldAlert size={12} />
                    <span>{tac.riskTitle[curLang]}</span>
                  </div>
                  <p className="text-[10.5px] text-muted leading-tight">{tac.riskDesc[curLang]}</p>
                </div>
                <div className="rounded border border-gold/30 bg-gold/5 p-2">
                  <div className="flex items-center gap-1.5 text-gold font-bold text-[10px] uppercase tracking-wider mb-0.5">
                    <Target size={12} />
                    <span>{tac.goldenRuleTitle[curLang]}</span>
                  </div>
                  <p className="text-[10.5px] text-muted leading-tight">{tac.goldenRuleDesc[curLang]}</p>
                </div>
                <div className="rounded border border-ok/30 bg-ok/5 p-2">
                  <div className="flex items-center gap-1.5 text-ok font-bold text-[10px] uppercase tracking-wider mb-0.5">
                    <Flame size={12} />
                    <span>{tac.energyTitle[curLang]}</span>
                  </div>
                  <p className="text-[10.5px] text-muted leading-tight">{tac.energyDesc[curLang]}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="grid gap-3.5 w-full max-w-full overflow-x-hidden">
      {/* SELETOR DE VISTAS (Combate vs Linha do Tempo) */}
      <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5 min-w-0">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {QG_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const badge = getCategoryBadge(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  AF.click();
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer select-none ${
                  isSelected
                    ? 'border-gold/80 bg-gold/15 text-gold shadow-sm'
                    : 'border-line bg-surface hover:bg-surface2 text-muted hover:text-[#EDE5D5]'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted'} />
                <span className="truncate">{getCategoryLabel(cat.id)}</span>
                {badge && (
                  <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    isSelected ? 'bg-gold/20 text-gold' : 'bg-surface2 text-muted'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL POR CATEGORIA */}
      {/* 1. PROGRESSO & COMBATE UNIFICADOS (Progresso, Nível, Efeitos Biológicos, Check-in Diário, Hábitos de Hoje, Tarefas, Protocolo Tático) */}
      {activeCategory === 'overview' && (
        <div className="grid gap-3.5 pb-20 lg:pb-6">
          {/* NO MOBILE: OPÇÃO A (Tudo na 1ª Dobra, Zero Fricção, Painel de Combate Imediato) */}
          <div className="lg:hidden">
            {renderMobileOneScreen()}
          </div>

          {/* NO DESKTOP: GRID EM DUAS COLUNAS PERFEITAMENTE BALANCEADO */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-3.5 items-start">
            <div className="lg:col-span-12">
              {renderMantra()}
            </div>

            {/* Coluna Esquerda Desktop: O Anel de Fogo e Retenção (Hero Combat Dial), Nível e Protocolo Tático */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {renderCombatDial(true)}
              {renderForgeLevel(false)}
              {renderTacticalProtocol()}
            </div>

            {/* Coluna Direita Desktop: Registro Diário de Combate, Hábitos da Forja e Operações */}
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              {renderDailyCheckin()}
              {renderForgeToday()}
              {renderTasksToday()}
            </div>
          </div>
        </div>
      )}

      {/* 2. LINHA DO TEMPO (Histórico de Vitórias, Quedas, SOS, Navegação de Dias) */}
      {activeCategory === 'timeline' && (
        <div className="grid gap-3.5">
          {renderTimeline()}
        </div>
      )}
    </div>
  );
}
