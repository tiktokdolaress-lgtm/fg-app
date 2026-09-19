'use client';
import React, { useState } from 'react';
import { Plus, Flame, Clock, Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Sparkles, CalendarDays, Info } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { FORGE_RULES, DEFAULT_HABITS } from '@/lib/data';
import { cxHabits } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';

/* Textos Traduzidos dos Botões de Benefício e Histórico */
const LABELS_I18N = {
  viewBenefit: {
    pt: 'VER BENEFÍCIOS & PROTEÇÃO',
    en: 'VIEW BENEFITS & PROTECTION',
    es: 'VER BENEFICIOS Y PROTECCIÓN',
  },
  hideBenefit: {
    pt: 'OCULTAR BENEFÍCIOS',
    en: 'HIDE BENEFITS',
    es: 'OCULTAR BENEFICIOS',
  },
  viewHistory: {
    pt: 'HISTÓRICO DOS ÚLTIMOS 7 DIAS',
    en: 'LAST 7 DAYS HISTORY',
    es: 'HISTORIAL DE LOS ÚLTIMOS 7 DÍAS',
  },
  hideHistory: {
    pt: 'OCULTAR HISTÓRICO',
    en: 'HIDE HISTORY',
    es: 'OCULTAR HISTORIAL',
  },
  activeInProtocol: {
    pt: 'NO PROTOCOLO',
    en: 'IN PROTOCOL',
    es: 'EN PROTOCOLO',
  },
  activeBtn: {
    pt: 'ATIVO',
    en: 'ACTIVE',
    es: 'ACTIVO',
  },
  activateBtn: {
    pt: '+ ATIVAR',
    en: '+ ACTIVATE',
    es: '+ ACTIVAR',
  },
  completeBtn: {
    pt: 'CONCLUÍDO HOJE',
    en: 'DONE TODAY',
    es: 'COMPLETO HOY',
  },
  toCompleteBtn: {
    pt: 'CONCLUIR HOJE',
    en: 'MARK AS DONE',
    es: 'MARCAR HECHO',
  },
  failBtn: {
    pt: 'FALHEI',
    en: 'FAILED',
    es: 'FALLÉ',
  },
};

/* Banco de dados fallback de benefícios contra recaída caso não venha do store */
const HABIT_BENEFITS_FALLBACK = {
  '#01': {
    pt: '🧊 Resfria a região pélvica, elimina impulsos sexuais imediatos e força um choque de dopamina limpa sem estímulo virtual.',
    en: '🧊 Cools the pelvic area, extinguishes immediate sexual urges, and delivers a natural dopamine surge without screens.',
    es: '🧊 Enfría la zona pélvica, apaga impulsos sexuales inmediatos y genera dopamina limpia sin estímulos virtuales.',
  },
  '#02': {
    pt: '🏋️ Transmuta a energia sexual acumulada em massa muscular, eleva a testosterona livre e descarrega a inquietação mental.',
    en: '🏋️ Transmutes stored sexual energy into muscle, boosts free testosterone, and exhausts mental restlessness.',
    es: '🏋️ Transmuta la energía sexual en músculo, eleva la testosterona libre y descarga la inquietud mental.',
  },
  '#03': {
    pt: '📖 Treina a atenção sustentada, reconstrói o córtex pré-frontal e substitui o hábito de rolar feeds hiperestimulantes.',
    en: '📖 Rebuilds the prefrontal cortex, trains sustained focus, and replaces the urge to doomscroll hyperstimulating feeds.',
    es: '📖 Reconstruye la corteza prefrontal, entrena la atención y sustituye el hábito de ver feeds hiperestimulantes.',
  },
  '#04': {
    pt: '⏰ Quebra a preguiça matinal na cama (o maior ninho de recaídas matinais). Levantar rápido sela o dia com vitória.',
    en: '⏰ Destroys morning lingering in bed (the #1 trigger for morning relapses). Getting up fast seals the day with victory.',
    es: '⏰ Destruye la pereza en la cama (el mayor nido de recaídas matutinas). Levantarse rápido asegura la victoria diaria.',
  },
  '#05': {
    pt: '📵 Corta a luz azul noturna que desregula a melatonina e impede o acesso solitário a telas no momento de maior vulnerabilidade.',
    en: '📵 Cuts out night blue light that disrupts sleep and stops late-night solitary screen access when defenses are lowest.',
    es: '📵 Corta la luz azul nocturna y evita el acceso solitario a pantallas en el momento de mayor vulnerabilidad.',
  },
  '#06': {
    pt: '🧹 Elimina perfis de gatilho, fotos apelativas e feeds algorítmicos feitos para drenar sua energia e provocar recaídas.',
    en: '🧹 Eliminates trigger accounts, thirst traps, and algorithmic feeds engineered to hijack your impulses and drain vitality.',
    es: '🧹 Elimina cuentas trampa, fotos sugerentes y feeds algorítmicos diseñados para detonar impulsos y drenar energía.',
  },
  '#07': {
    pt: '🍬 Evita picos e quedas de glicose no sangue, que causam cansaço mental e fraqueza para resistir a tentações imediatas.',
    en: '🍬 Prevents blood sugar crashes that cause cognitive fatigue and weaken impulse control against instant gratification.',
    es: '🍬 Evita caídas de glucosa que provocan fatiga mental y debilitan el autocontrol frente a la gratificación instantánea.',
  },
  '#08': {
    pt: '🚶 Caminhar em silêncio acalma o sistema nervoso, estimula a introspecção e reduz a dependência de estímulos constantes.',
    en: '🚶 Walking in silence settles the nervous system, stimulates deep thought, and resets tolerance to constant stimulation.',
    es: '🚶 Caminar en silencio calma el sistema nervioso, estimula la introspección y reduce la necesidad de estimulación continua.',
  },
  '#09': {
    pt: '🧘 Ensina a observar pensamentos invasivos sem reagir fisicamente a eles. Cria a barreira entre o impulso e a ação.',
    en: '🧘 Teaches you to observe intrusive sexual urges without reacting to them. Creates the crucial space between urge and action.',
    es: '🧘 Enseña a observar pensamientos intrusivos sin reaccionar a ellos. Crea la barrera entre el impulso y la acción.',
  },
  '#10': {
    pt: '⏳ Limpa o organismo por autofagia e treina a resistência da mente a apetites e vontades biológicas automáticas.',
    en: '⏳ Promotes cellular autophagy and trains mental resilience against immediate biological cravings and automatic desires.',
    es: '⏳ Limpia el organismo por autofagia y entrena la resistencia de la mente frente a apetitos biológicos automáticos.',
  },
  '#11': {
    pt: '🛏️ Primeira vitória disciplinar do dia. Estabelece ordem física imediata no quarto, repelindo desleixo e acomodação.',
    en: '🛏️ First disciplined win of the day. Sets immediate physical order in your room, repelling sloppy thinking and laziness.',
    es: '🛏️ Primera victoria de disciplina del día. Establece orden físico inmediato, repeliendo el descuido y la pereza.',
  },
  '#12': {
    pt: '🚫 O álcool destrói a inibição do córtex frontal — 80% das recaídas graves ocorrem sob efeito de substâncias.',
    en: '🚫 Alcohol impairs frontal lobe inhibition — over 80% of severe relapses happen under the influence of substances.',
    es: '🚫 El alcohol destruye la inhibición frontal — más del 80% de las recaídas graves ocurren bajo efectos de sustancias.',
  },
  '#13': {
    pt: '💧 Mantém a hidratação celular máxima, otimiza o fluxo sanguíneo e afasta a letargia que costuma abrir brechas para tentação.',
    en: '💧 Maximizes cellular hydration, optimizes blood flow, and dispels the physical sluggishness that invites temptation.',
    es: '💧 Mantiene la hidratación celular máxima, optimiza el flujo sanguíneo y aleja la lentitud que abre paso a la tentación.',
  },
  '#14': {
    pt: '☀️ Regula o ciclo circadiano, melhora a produção de vitamina D e garante sono de qualidade profunda à noite.',
    en: '☀️ Sets your circadian clock, boosts vitamin D synthesis, and guarantees deep restorative sleep at night.',
    es: '☀️ Regula el reloj circadiano, potencia la vitamina D y asegura un descanso profundo y reparador por la noche.',
  },
  '#15': {
    pt: '📓 Externaliza a ansiedade, documenta gatilhos identificados e fortalece o compromisso diário do guerreiro consigo mesmo.',
    en: '📓 Externalizes anxiety, tracks identified triggers, and reinforces daily accountability to your higher self.',
    es: '📓 Externaliza la ansiedad, registra detonantes identificados y refuerza el compromiso diario con tu mejor versión.',
  },
  '#16': {
    pt: '🎯 Foco profundo (Deep Work): produz valor real para a sua vida financeira e mental, canalizando a testosterona retida.',
    en: '🎯 Deep Work: builds high-value tangible results in your life and career, channeling retained testosterone into creation.',
    es: '🎯 Enfoque profundo (Deep Work): genera valor real para tu vida y carrera, canalizando la testosterona retenida.',
  },
  '#17': {
    pt: '📵 Regra inegociável: o celular longe da cama elimina 95% do risco de recaídas no fim da noite e início da manhã.',
    en: '📵 Non-negotiable rule: keeping the phone out of the bedroom eliminates 95% of nighttime and early morning relapse risk.',
    es: '📵 Regla innegociable: el teléfono lejos de la cama elimina el 95% del riesgo de recaídas nocturnas y matutinas.',
  },
  '#18': {
    pt: '🧘‍♂️ Alivia tensões da musculatura do assoalho pélvico, melhora a circulação na região e evita o acúmulo de desconforto prostático.',
    en: '🧘‍♂️ Relieves pelvic floor muscle tension, improves blood circulation, and prevents localized tightness and discomfort.',
    es: '🧘‍♂️ Alivia tensiones en el suelo pélvico, optimiza la circulación y previene la incomodidad prostática localizada.',
  },
};

function getHabitBenefit(h, lang) {
  const currentLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  if (h.why) return h.why;
  if (h.benefit) return h.benefit;
  if (h.desc) return h.desc;

  // Busca pelo fallback
  const idKey = '#' + String(h.id).replace(/\D/g, '').padStart(2, '0');
  const found = HABIT_BENEFITS_FALLBACK[idKey] || HABIT_BENEFITS_FALLBACK[h.id];
  if (found) {
    return found[currentLang] || found.pt;
  }

  // Padrão
  return currentLang === 'en'
    ? 'Builds cognitive discipline, transmutes retained sexual energy, and protects your dopamine receptors against cheap stimulation.'
    : currentLang === 'es'
    ? 'Forja disciplina cognitiva, transmuta la energía sexual retenida y protege tus receptores de dopamina contra la estimulación barata.'
    : 'Forja disciplina mental inquebrável, transmuta a energia sexual retida e blinda seus receptores de dopamina contra estímulos baratos.';
}

export default function ForgeView() {
  const { S, update, t, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const LBL = LABELS_I18N;

  const [openBenefitId, setOpenBenefitId] = useState(null);
  const [openHistoryId, setOpenHistoryId] = useState(null);

  const ALLH = cxHabits(lang, L.allH(S));
  const d = L.progressDays(S);
  
  let maxSlots = 2;
  try {
    if (typeof L.maxSlots === 'function') {
      maxSlots = L.maxSlots(d);
    } else if (Array.isArray(FORGE_RULES)) {
      const found = FORGE_RULES.slice().reverse().find((r) => d >= r.min);
      maxSlots = found ? found.slots : 2;
    }
  } catch {
    maxSlots = 2;
  }

  const activeIds = (S && S.forge && Array.isArray(S.forge.active)) ? S.forge.active : [];
  const activeCount = activeIds.length;
  const fd = L.fDone(S, today());
  const ff = L.fFailed(S, today());

  const activeHabits = activeIds.map((id) => ALLH.find((h) => h.id === id)).filter(Boolean);
  const reserveHabits = ALLH.filter((h) => !activeIds.includes(h.id));

  /* Hábitos negligenciados */
  const neglected = activeHabits.filter((h) => {
    try {
      const doneDates = (S && S.forge && S.forge.done) || {};
      let daysWithout = 0;
      for (let i = 1; i <= 7; i++) {
        const ds = dstr(new Date(Date.now() - i * 86400000));
        const list = doneDates[ds] || [];
        if (!list.includes(h.id)) {
          daysWithout++;
        } else {
          break;
        }
      }
      return daysWithout >= 2;
    } catch {
      return false;
    }
  });

  const toggleActive = (id) => {
    if (activeIds.includes(id)) {
      update((s) => {
        s.forge.active = (s.forge.active || []).filter((x) => x !== id);
      });
      AF.click();
      toast(t('hab_rem') || 'Hábito movido para a reserva');
    } else {
      if (activeCount >= maxSlots && maxSlots < 99) {
        toast(t('slot_full') || `Limite de ${maxSlots} slots atingido!`);
        AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
        return;
      }
      update((s) => {
        s.forge.active = s.forge.active || [];
        s.forge.active.push(id);
      });
      AF.click();
      toast(t('hab_act') || 'Hábito ativado no protocolo');
    }
  };

  const toggleDone = (id) => {
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

  const toggleFailed = (id) => {
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

  const setTime = (id, time) => {
    update((s) => {
      s.forge.times = s.forge.times || {};
      s.forge.times[id] = time;
    });
  };

  const openCreateModal = () => {
    let name = '', icon = '⚡', time = '';
    const CreateH = () => {
      const [, force] = useState(0);
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-gold">CRIAR NOVO HÁBITO</h3>
          <p className="mb-4 text-xs text-muted">Forje um novo hábito inegociável para a sua rotina militar.</p>
          <div className="flex flex-col gap-3 text-left">
            <label>
              <span className="lbl">Nome do Hábito:</span>
              <input
                type="text"
                placeholder="Ex: 50 Flexões ao acordar"
                className="field"
                value={name}
                onChange={(e) => (name = e.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="lbl">Ícone / Emoji:</span>
                <input
                  type="text"
                  placeholder="⚡"
                  className="field text-center text-lg"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => (icon = e.target.value)}
                />
              </label>
              <label>
                <span className="lbl">Horário (Opcional):</span>
                <input
                  type="time"
                  className="field"
                  value={time}
                  onChange={(e) => (time = e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="btn-gold flex-1 py-2 font-bold text-xs"
              onClick={() => {
                if (!name.trim()) return toast('Digite o nome do hábito');
                const newId = 'cust_' + Date.now();
                update((s) => {
                  s.customHabits = s.customHabits || [];
                  s.customHabits.push({ id: newId, n: name.trim(), icon: icon || '⚡' });
                  if (time) {
                    s.forge.times = s.forge.times || {};
                    s.forge.times[newId] = time;
                  }
                });
                closeModal();
                toast('✅ Hábito criado e disponível na Reserva!');
              }}
            >
              Criar Hábito
            </button>
            <button className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      );
    };
    openModal(<CreateH />);
  };

  /* Renderizador das bolinhas de 7 dias do hábito */
  const renderLast7Days = (habitId) => {
    const days = [];
    const doneMap = (S && S.forge && S.forge.done) || {};
    const failMap = (S && S.forge && S.forge.failed) || {};

    for (let i = 6; i >= 0; i--) {
      const ds = dstr(new Date(Date.now() - i * 86400000));
      const isD = (doneMap[ds] || []).includes(habitId);
      const isF = (failMap[ds] || []).includes(habitId);
      days.push({ ds, isD, isF, label: fmtD(ds) });
    }

    return (
      <div className="flex items-center justify-between gap-1 mt-2 p-2 rounded bg-surface border border-line">
        {days.map((dItem, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[8.5px] font-mono text-muted">{dItem.label}</span>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                dItem.isD
                  ? 'border-gold bg-gold text-[#141414]'
                  : dItem.isF
                  ? 'border-danger bg-danger text-white'
                  : 'border-line/60 bg-surface2 text-muted'
              }`}
            >
              {dItem.isD ? '✓' : dItem.isF ? '✕' : '·'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-3.5">
      {/* 1. TOPO COMPACTO: Regras de Desbloqueio e Slots */}
      <Card className="p-3.5 sm:p-4 border-gold/30 bg-surface2/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <K className="mb-0">REGRAS DE SLOTS POR PATAMAR</K>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold font-bold">
                {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} SLOTS ATIVOS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-muted">
              {FORGE_RULES && FORGE_RULES.map((r, i) => {
                const isCur = d >= r.min && (i === FORGE_RULES.length - 1 || d < FORGE_RULES[i + 1].min);
                return (
                  <span
                    key={r.min}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      isCur
                        ? 'border-gold bg-gold/15 text-gold font-bold shadow-[0_0_8px_rgba(255,200,70,0.25)]'
                        : 'border-line/60 bg-surface text-muted/80'
                    }`}
                  >
                    {r.min}+d → {r.slots >= 99 ? '∞' : r.slots} {r.slots === 1 ? 'hábito' : 'hábitos'}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="btn-gold flex-none py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>CRIAR HÁBITO</span>
          </button>
        </div>
      </Card>

      {/* 2. ALERTA DE NEGLIGÊNCIA COMPACTO */}
      {neglected.length > 0 && (
        <Card className="border-danger/40 bg-danger/5 p-3.5">
          <div className="flex items-center gap-1.5 mb-2 text-danger font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>ALERTA DE NEGLIGÊNCIA — A FORJA ESFRIA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {neglected.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between gap-2 p-2 rounded border border-danger/30 bg-surface2 text-xs"
              >
                <span className="flex items-center gap-1.5 truncate font-semibold">
                  <span>{h.icon}</span>
                  <span className="truncate">{h.n}</span>
                </span>
                <span className="flex-none font-mono text-[10.5px] font-bold text-danger">
                  2+ dias sem fazer
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10.5px] text-muted">
            Guerreiro que desaparece do treino vira estatística. Retome HOJE.
          </p>
        </Card>
      )}

      {/* 3. ATIVOS NO PROTOCOLO */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <K className="mb-0">⚡ ATIVOS NO PROTOCOLO ({activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} SLOTS)</K>
        </div>

        {activeHabits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {activeHabits.map((h) => {
              const isDone = fd.includes(h.id);
              const isFail = ff.includes(h.id);
              const tm = (L.hTime && L.hTime(S, h.id)) || (S.forge && S.forge.times && S.forge.times[h.id]) || '';
              const isBenefitOpen = openBenefitId === h.id;
              const isHistoryOpen = openHistoryId === h.id;
              const benefitText = getHabitBenefit(h, lang);

              return (
                <Card
                  key={h.id}
                  className={`p-3 transition-all border ${
                    isDone
                      ? 'border-gold/50 bg-gold/5'
                      : isFail
                      ? 'border-danger/50 bg-danger/5'
                      : 'border-line hover:border-gold/30'
                  }`}
                >
                  {/* Cabeçalho */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl flex-none">{h.icon}</span>
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-[13.5px] font-bold block truncate ${isDone ? 'text-gold' : isFail ? 'text-danger' : 'text-ink'}`}>
                          {h.n}
                        </span>
                        <span className="text-[9.5px] uppercase font-mono text-muted">
                          #{String(h.id).slice(-4)} · {LBL.activeInProtocol[curLang]}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      title="Mover para a Reserva"
                      onClick={() => toggleActive(h.id)}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 transition-colors"
                    >
                      {LBL.activeBtn[curLang]}
                    </button>
                  </div>

                  {/* Linha de Ação: Concluir + Horário + Falhar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/50">
                    <button
                      type="button"
                      onClick={() => toggleDone(h.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded border text-xs font-bold transition-all ${
                        isDone
                          ? 'border-gold bg-gold text-[#141414] shadow-[0_0_8px_rgba(255,200,70,0.4)]'
                          : 'border-line bg-surface hover:border-gold/50 text-muted hover:text-ink'
                      }`}
                    >
                      <Check size={13} strokeWidth={2.5} />
                      <span>{isDone ? LBL.completeBtn[curLang] : LBL.toCompleteBtn[curLang]}</span>
                    </button>

                    <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded border border-line text-[11px] font-mono">
                      <Clock size={11} className="text-gold" />
                      <input
                        type="time"
                        value={tm}
                        onChange={(e) => setTime(h.id, e.target.value)}
                        className="bg-transparent text-ink focus:outline-none w-[58px]"
                      />
                    </div>

                    <button
                      type="button"
                      title="Marcar como Falho"
                      onClick={() => toggleFailed(h.id)}
                      className={`flex-none py-1.5 px-2.5 rounded border text-[11px] font-bold transition-all flex items-center gap-1 ${
                        isFail
                          ? 'border-danger bg-danger text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                          : 'border-line bg-surface text-danger/80 hover:border-danger hover:text-danger'
                      }`}
                    >
                      <X size={12} strokeWidth={2.5} />
                      <span className="hidden sm:inline">{LBL.failBtn[curLang]}</span>
                    </button>
                  </div>

                  {/* BOTÕES EXPANSÍVEIS TÁTICOS: Histórico 7 Dias & Benefícios */}
                  <div className="mt-2.5 pt-2 border-t border-line/40 flex flex-col gap-1.5">
                    
                    {/* Botão: Histórico dos Últimos 7 Dias */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenHistoryId(isHistoryOpen ? null : h.id);
                        }}
                        className="text-[10px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                      >
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} className="text-gold2" />
                          <span>{isHistoryOpen ? LBL.hideHistory[curLang] : LBL.viewHistory[curLang]}</span>
                        </span>
                        {isHistoryOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                      {isHistoryOpen && renderLast7Days(h.id)}
                    </div>

                    {/* Botão: Benefícios & Proteção Contra Recaída */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenBenefitId(isBenefitOpen ? null : h.id);
                        }}
                        className="text-[10px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                      >
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={11} className="text-gold" />
                          <span>{isBenefitOpen ? LBL.hideBenefit[curLang] : LBL.viewBenefit[curLang]}</span>
                        </span>
                        {isBenefitOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                      {isBenefitOpen && (
                        <div className="mt-1 text-[11px] text-[#e3e3ea] bg-surface/90 p-2.5 rounded border border-gold/30 leading-relaxed shadow-sm">
                          <p className="flex items-start gap-1.5">
                            <Sparkles size={12} className="text-gold flex-none mt-0.5" />
                            <span>{benefitText}</span>
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-6">
            <Empty>Nenhum hábito ativo no protocolo.<br />Selecione hábitos na Reserva abaixo para forjar seu dia.</Empty>
          </Card>
        )}
      </div>

      {/* 4. RESERVA DA FORJA (3 Colunas no PC com Botão de Benefício Restaurado) */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <K className="mb-0">📦 RESERVA DA FORJA ({reserveHabits.length} DISPONÍVEIS)</K>
          <span className="text-[10px] text-muted font-mono">Clique para ativar no protocolo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {reserveHabits.map((h) => {
            const isBenefitOpen = openBenefitId === h.id;
            const benefitText = getHabitBenefit(h, lang);

            return (
              <div
                key={h.id}
                className="p-2.5 rounded-r border border-line bg-surface2/70 hover:border-gold/40 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg flex-none">{h.icon}</span>
                    <span className="text-xs font-bold text-ink truncate">
                      {h.n}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Ativar no Protocolo"
                    onClick={() => toggleActive(h.id)}
                    className="flex-none text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-surface text-muted hover:border-gold hover:text-gold transition-colors font-bold"
                  >
                    {LBL.activateBtn[curLang]}
                  </button>
                </div>

                {/* Botão Expansível de Benefício na Reserva */}
                <div className="mt-1.5 pt-1 border-t border-line/30">
                  <button
                    type="button"
                    onClick={() => setOpenBenefitId(isBenefitOpen ? null : h.id)}
                    className="text-[9.5px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                  >
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={10} className="text-gold" />
                      <span>{isBenefitOpen ? LBL.hideBenefit[curLang] : LBL.viewBenefit[curLang]}</span>
                    </span>
                    {isBenefitOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>
                  {isBenefitOpen && (
                    <div className="mt-1 text-[10px] text-muted bg-surface p-2 rounded border border-line leading-snug">
                      {benefitText}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
