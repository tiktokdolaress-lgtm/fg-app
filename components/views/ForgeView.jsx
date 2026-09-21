'use client';
import React, { useState } from 'react';
import { Plus, Flame, Clock, Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Sparkles, CalendarDays, Edit3, Trash2, Archive, ArchiveRestore, MoreVertical } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { FORGE_RULES, DEFAULT_HABITS } from '@/lib/data';
import { cxHabits } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';

const FORGE_CATEGORIES = [
  { id: 'active', label: 'Protocolo Ativo', icon: Flame },
  { id: 'reserve', label: 'Reserva da Forja', icon: Sparkles },
  { id: 'rules', label: 'Regras & Slots', icon: ShieldCheck },
];

/* Categorias / Pilares da Masculinidade Trilíngues */
const PILLARS_I18N = {
  all: { pt: 'Todos', en: 'All', es: 'Todos' },
  body: { pt: '🏛️ Corpo & Vigor', en: '🏛️ Body & Vigor', es: '🏛️ Cuerpo y Vigor' },
  mind: { pt: '🧠 Mente & Foco', en: '🧠 Mind & Focus', es: '🧠 Mente y Enfoque' },
  mission: { pt: '💼 Missão & Finanças', en: '💼 Mission & Wealth', es: '💼 Misión y Finanzas' },
  spirit: { pt: '⚔️ Espírito & Honra', en: '⚔️ Spirit & Honor', es: '⚔️ Espíritu y Honor' },
  archived: { pt: '📦 Arquivados', en: '📦 Archived', es: '📦 Archivados' },
};

/* Textos Traduzidos dos Botões e Ações */
const LABELS_I18N = {
  viewBenefit: { pt: 'VER BENEFÍCIOS & PROTEÇÃO', en: 'VIEW BENEFITS & PROTECTION', es: 'VER BENEFICIOS Y PROTECCIÓN' },
  hideBenefit: { pt: 'OCULTAR BENEFÍCIOS', en: 'HIDE BENEFITS', es: 'OCULTAR BENEFICIOS' },
  viewHistory: { pt: 'HISTÓRICO DOS ÚLTIMOS 7 DIAS', en: 'LAST 7 DAYS HISTORY', es: 'HISTORIAL DE LOS ÚLTIMOS 7 DÍAS' },
  hideHistory: { pt: 'OCULTAR HISTÓRICO', en: 'HIDE HISTORY', es: 'OCULTAR HISTORIAL' },
  activeInProtocol: { pt: 'NO PROTOCOLO', en: 'IN PROTOCOL', es: 'EN PROTOCOLO' },
  activeBtn: { pt: 'ATIVO', en: 'ACTIVE', es: 'ACTIVO' },
  activateBtn: { pt: '+ ATIVAR', en: '+ ACTIVATE', es: '+ ACTIVAR' },
  completeBtn: { pt: 'CONCLUÍDO HOJE', en: 'DONE TODAY', es: 'COMPLETO HOY' },
  toCompleteBtn: { pt: 'CONCLUIR HOJE', en: 'MARK AS DONE', es: 'MARCAR HECHO' },
  failBtn: { pt: 'FALHEI', en: 'FAILED', es: 'FALLÉ' },
  editHabit: { pt: 'Editar Hábito', en: 'Edit Habit', es: 'Editar Hábito' },
  deleteHabit: { pt: 'Excluir', en: 'Delete', es: 'Eliminar' },
  archiveHabit: { pt: 'Arquivar', en: 'Archive', es: 'Archivar' },
  unarchiveHabit: { pt: 'Desarquivar', en: 'Unarchive', es: 'Desarchivar' },
};

/* Mapeamento de Categoria */
function getHabitCategory(h) {
  const idStr = String(h.id);
  const nameLower = String(h.n || '').toLowerCase();

  if (['1', '2', '13', '14', '18', '19'].includes(idStr) || nameLower.includes('banho') || nameLower.includes('treino') || nameLower.includes('água') || nameLower.includes('sol') || nameLower.includes('pélvica') || nameLower.includes('força')) {
    return 'body';
  }
  if (['3', '5', '6', '7', '8', '20'].includes(idStr) || nameLower.includes('leitura') || nameLower.includes('telas') || nameLower.includes('redes') || nameLower.includes('açúcar') || nameLower.includes('caminhada')) {
    return 'mind';
  }
  if (['16', '21', '22', '23'].includes(idStr) || nameLower.includes('foco') || nameLower.includes('tarefa') || nameLower.includes('financeiro') || nameLower.includes('planejar') || nameLower.includes('trabalho')) {
    return 'mission';
  }
  return 'spirit';
}

/* Banco de Explicações Científicas Contra Recaída */
function getHabitBenefitText(h, lang) {
  if (h.why) return h.why;
  if (h.benefit) return h.benefit;
  if (h.desc) return h.desc;

  const idStr = String(h.id);
  const nameLower = String(h.n || '').toLowerCase();

  if (idStr === '1' || nameLower.includes('banho')) {
    return lang === 'en'
      ? 'Cools the pelvic floor, extinguishes sudden urges, and creates an instant spike of clean dopamine.'
      : lang === 'es'
      ? 'Enfría el área pélvica, apaga impulsos repentinos y genera dopamina limpia sin estímulos virtuales.'
      : 'Resfria a região pélvica, elimina impulsos repentinos e gera um pico imediato de dopamina limpa sem estímulo virtual.';
  }
  if (idStr === '2' || nameLower.includes('treino') || nameLower.includes('força')) {
    return lang === 'en'
      ? 'Transmutes stored sexual energy into muscle density, increases free testosterone, and discharges body restlessness.'
      : lang === 'es'
      ? 'Transmuta la energía sexual en músculo, eleva la testosterona libre y descarga la tensión física.'
      : 'Transmuta a energia seminal represada em densidade muscular, eleva a testosterona livre e descarrega a tensão corporal.';
  }
  if (idStr === '13' || nameLower.includes('água')) {
    return lang === 'en'
      ? 'Maximizes cellular hydration, optimizes blood flow, and eliminates physical sluggishness.'
      : lang === 'es'
      ? 'Mantiene la hidratación celular máxima, optimiza el flujo sanguíneo y aleja la lentitud.'
      : 'Mantém a hidratação celular máxima, otimiza o fluxo sanguíneo e afasta a letargia que costuma abrir brechas para tentação.';
  }
  if (idStr === '4' || nameLower.includes('acordar')) {
    return lang === 'en'
      ? 'First battle won against flesh comfort. Lingering in bed after waking is the origin of 60% of morning relapses.'
      : lang === 'es'
      ? 'Primera batalla ganada contra la comodidad. Quedarse en la cama es la cuna del 60% de las recaídas matutinas.'
      : 'Primeira vitória sobre a carne. Ficar enrolando na cama é o ninho de 60% das recaídas matinais. Levantar rápido sela o dia.';
  }
  if (idStr === '5' || nameLower.includes('telas')) {
    return lang === 'en'
      ? 'Cuts out night blue light that disrupts sleep and stops late-night solitary screen access.'
      : lang === 'es'
      ? 'Corta la luz azul nocturna y evita el acceso solitario a pantallas en la noche.'
      : 'Corta a luz azul noturna que desregula a melatonina e impede o acesso solitário a telas no momento mais vulnerável.';
  }
  if (idStr === '17' || nameLower.includes('celular')) {
    return lang === 'en'
      ? 'Keeping the phone out of the bedroom eliminates 95% of nighttime and early morning relapse risk.'
      : lang === 'es'
      ? 'El teléfono fuera del dormitorio elimina el 95% del riesgo de recaídas nocturnas y matutinas.'
      : 'Regra de ouro inegociável: celular fora do quarto elimina 95% do risco de recaídas na madrugada.';
  }

  return lang === 'en'
    ? 'Reinforces cognitive willpower, protects your dopamine baseline, and channels energy into discipline.'
    : lang === 'es'
    ? 'Refuerza la fuerza de voluntad cognitiva, protege la dopamina y canaliza energía en disciplina.'
    : 'Fortalece o córtex pré-frontal, protege os receptores de dopamina e transmuta a energia em autodomínio.';
}

export default function ForgeView() {
  const { S, update, t, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const LBL = LABELS_I18N;
  const PIL = PILLARS_I18N;

  const [selectedPillar, setSelectedPillar] = useState('all');
  const [openBenefitId, setOpenBenefitId] = useState(null);
  const [openHistoryId, setOpenHistoryId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('active');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Carrega todos os hábitos do usuário */
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
  const nextRule = Array.isArray(FORGE_RULES) ? FORGE_RULES.find((r) => r.min > d) : null;

  const activeIds = (S && S.forge && Array.isArray(S.forge.active)) ? S.forge.active : [];
  const archivedIds = (S && S.forge && Array.isArray(S.forge.archived)) ? S.forge.archived : [];
  const activeCount = activeIds.length;
  const fd = L.fDone(S, today());
  const ff = L.fFailed(S, today());

  /* Identificar se o hábito é customizado pelo usuário */
  const isCustomHabit = (id) => {
    const customList = (S && S.customHabits) || [];
    return customList.some((c) => String(c.id) === String(id)) || String(id).length > 6 || String(id).startsWith('cust_');
  };

  /* Hábitos Ativos */
  const activeHabits = activeIds.map((id) => {
    return ALLH.find((h) => String(h.id) === String(id)) || {
      id,
      n: `Hábito #${id}`,
      icon: '⚡',
    };
  });

  /* Hábitos Não-Ativos (Reserva ou Arquivados) */
  const nonActiveHabits = ALLH.filter((h) => !activeIds.some((aid) => String(aid) === String(h.id)));
  const reserveHabits = nonActiveHabits.filter((h) => !archivedIds.some((arid) => String(arid) === String(h.id)));
  const archivedHabits = nonActiveHabits.filter((h) => archivedIds.some((arid) => String(arid) === String(h.id)));

  /* Filtrar reserva por categoria selecionada */
  const filteredReserve = selectedPillar === 'archived'
    ? archivedHabits
    : reserveHabits.filter((h) => {
        if (selectedPillar === 'all') return true;
        return getHabitCategory(h) === selectedPillar;
      });

  /* Hábitos negligenciados */
  const neglected = activeHabits.filter((h) => {
    try {
      const doneDates = (S && S.forge && S.forge.done) || {};
      let daysWithout = 0;
      for (let i = 1; i <= 7; i++) {
        const ds = dstr(new Date(Date.now() - i * 86400000));
        const list = doneDates[ds] || [];
        const found = list.some((x) => String(x) === String(h.id));
        if (!found) {
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

  /* Ativar / Desativar */
  const toggleActive = (id) => {
    const isAct = activeIds.some((aid) => String(aid) === String(id));
    if (isAct) {
      update((s) => {
        s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
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
        // Se estava arquivado, desarquiva
        s.forge.archived = (s.forge.archived || []).filter((x) => String(x) !== String(id));
      });
      AF.click();
      toast(t('hab_act') || 'Hábito ativado no protocolo');
    }
  };

  /* Arquivar / Desarquivar */
  const toggleArchive = (id) => {
    const isArch = archivedIds.some((arid) => String(arid) === String(id));
    update((s) => {
      s.forge.archived = s.forge.archived || [];
      if (isArch) {
        s.forge.archived = s.forge.archived.filter((x) => String(x) !== String(id));
      } else {
        s.forge.archived.push(id);
        s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
      }
    });
    AF.click();
    toast(isArch ? 'Hábito restaurado da Reserva' : 'Hábito arquivado');
  };

  /* Excluir Hábito Personalizado */
  const deleteCustomHabit = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir definitivamente este hábito criado por você?')) return;
    update((s) => {
      s.customHabits = (s.customHabits || []).filter((x) => String(x.id) !== String(id));
      s.forge.active = (s.forge.active || []).filter((x) => String(x) !== String(id));
      s.forge.archived = (s.forge.archived || []).filter((x) => String(x) !== String(id));
      if (s.forge.times) delete s.forge.times[id];
    });
    AF.click();
    toast('Hábito excluído');
  };

  /* Modal de Edição de Hábito Personalizado */
  const openEditModal = (h) => {
    let name = h.n || '', icon = h.icon || '⚡', time = (S.forge && S.forge.times && S.forge.times[h.id]) || '';
    const EditH = () => {
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-gold">EDITAR HÁBITO</h3>
          <p className="mb-4 text-xs text-muted">Ajuste os dados do seu hábito customizado.</p>
          <div className="flex flex-col gap-3 text-left">
            <label>
              <span className="lbl">Nome do Hábito:</span>
              <input
                type="text"
                className="field"
                defaultValue={name}
                onChange={(e) => (name = e.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label>
                <span className="lbl">Ícone / Emoji:</span>
                <input
                  type="text"
                  className="field text-center text-lg"
                  maxLength={4}
                  defaultValue={icon}
                  onChange={(e) => (icon = e.target.value)}
                />
              </label>
              <label>
                <span className="lbl">Horário:</span>
                <input
                  type="time"
                  className="field"
                  defaultValue={time}
                  onChange={(e) => (time = e.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="btn-gold flex-1 py-2 font-bold text-xs"
              onClick={() => {
                if (!name.trim()) return toast('Digite o nome');
                update((s) => {
                  const target = (s.customHabits || []).find((c) => String(c.id) === String(h.id));
                  if (target) {
                    target.n = name.trim();
                    target.icon = icon || '⚡';
                  }
                  if (time) {
                    s.forge.times = s.forge.times || {};
                    s.forge.times[h.id] = time;
                  }
                });
                closeModal();
                toast('✅ Hábito atualizado com sucesso!');
              }}
            >
              Salvar Alterações
            </button>
            <button className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      );
    };
    openModal(<EditH />);
  };

  const toggleDone = (id) => {
    update((s) => {
      const dd = today();
      const a = s.forge.done[dd] = s.forge.done[dd] || [];
      const idx = a.findIndex((x) => String(x) === String(id));
      if (idx >= 0) {
        a.splice(idx, 1);
      } else {
        a.push(id);
        const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
        const fi = f.findIndex((x) => String(x) === String(id));
        if (fi >= 0) f.splice(fi, 1);
      }
    });
    AF.click();
  };

  const toggleFailed = (id) => {
    update((s) => {
      const dd = today();
      const f = s.forge.failed[dd] = s.forge.failed[dd] || [];
      const idx = f.findIndex((x) => String(x) === String(id));
      if (idx >= 0) {
        f.splice(idx, 1);
      } else {
        f.push(id);
        const a = s.forge.done[dd] = s.forge.done[dd] || [];
        const ai = a.findIndex((x) => String(x) === String(id));
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
                const newId = Date.now();
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

  const renderLast7Days = (habitId) => {
    const days = [];
    const doneMap = (S && S.forge && S.forge.done) || {};
    const failMap = (S && S.forge && S.forge.failed) || {};

    for (let i = 6; i >= 0; i--) {
      const ds = dstr(new Date(Date.now() - i * 86400000));
      const listDone = doneMap[ds] || [];
      const listFail = failMap[ds] || [];
      const isD = listDone.some((x) => String(x) === String(habitId));
      const isF = listFail.some((x) => String(x) === String(habitId));
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
    <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* SELETOR DE CATEGORIAS RESPONSIVO */}
      <div className="w-full max-w-full min-w-0 p-1 rounded-xl bg-surface2/80 border border-line/80 flex items-center gap-1 sm:gap-2">
        {FORGE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                AF.click();
                setActiveCategory(cat.id);
              }}
              className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all truncate select-none cursor-pointer ${
                isSelected
                  ? 'bg-gold text-[#141414] shadow-sm font-extrabold'
                  : 'text-muted hover:text-ink hover:bg-surface/50'
              }`}
            >
              <Icon size={14} className="flex-none" />
              <span className="truncate">
                {cat.id === 'active' ? (curLang === 'en' ? 'Protocol' : curLang === 'es' ? 'Protocolo' : 'Protocolo') :
                 cat.id === 'reserve' ? (curLang === 'en' ? 'Reserve' : curLang === 'es' ? 'Reserva' : 'Reserva') :
                 (curLang === 'en' ? 'Slots' : curLang === 'es' ? 'Reglas' : 'Regras')}
              </span>
              {cat.id === 'active' && (
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-mono font-bold flex-none ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-surface text-gold'
                }`}>
                  {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. PROTOCOLO ATIVO */}
      {activeCategory === 'active' && (
        <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* TOPO COMPACTO: Regras de Desbloqueio e Slots */}
          <Card className="p-3 sm:p-3.5 border-gold/30 bg-surface2/60 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 min-w-0 w-full">
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                  <K className="mb-0 text-[10.5px] sm:text-xs truncate">REGRAS DE SLOTS POR PATAMAR</K>
                  <span className="text-[9.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold font-bold flex-none">
                    {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} ATIVOS
                  </span>
                </div>
                <div className="relative w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono text-muted overflow-x-auto no-scrollbar pb-1 w-full min-w-0">
                    {FORGE_RULES && FORGE_RULES.map((r, i) => {
                      const isCur = d >= r.min && (i === FORGE_RULES.length - 1 || d < FORGE_RULES[i + 1].min);
                      return (
                        <span
                          key={r.min}
                          className={`shrink-0 px-2 py-0.5 rounded border transition-colors whitespace-nowrap ${
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
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="btn-gold w-full sm:w-auto flex-none py-2 px-3.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>CRIAR HÁBITO</span>
              </button>
            </div>
          </Card>

          {/* 2. ALERTA DE NEGLIGÊNCIA COMPACTO */}
          {neglected.length > 0 && (
            <Card className="border-danger/40 bg-danger/5 p-3 sm:p-3.5 w-full max-w-full min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-2 text-danger font-bold text-xs uppercase tracking-wider min-w-0">
                <AlertTriangle size={14} className="flex-none" />
                <span className="truncate">ALERTA DE NEGLIGÊNCIA — A FORJA ESFRIA</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-0">
                {neglected.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border border-danger/30 bg-surface2 text-xs w-full min-w-0 overflow-hidden"
                  >
                    <span className="flex items-center gap-1.5 truncate font-semibold min-w-0 flex-1">
                      <span className="flex-none">{h.icon}</span>
                      <span className="truncate">{h.n}</span>
                    </span>
                    <span className="flex-none font-mono text-[10px] sm:text-[10.5px] font-bold text-danger whitespace-nowrap pl-1">
                      2+ dias sem fazer
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] text-muted leading-tight">
                Guerreiro que desaparece do treino vira estatística. Retome HOJE.
              </p>
            </Card>
          )}

          {/* 3. ATIVOS NO PROTOCOLO */}
          <div className="w-full max-w-full min-w-0">
            <div className="flex items-center justify-between mb-2">
              <K className="mb-0">⚡ ATIVOS NO PROTOCOLO ({activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} SLOTS)</K>
            </div>

            {activeHabits.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full max-w-full min-w-0">
                {activeHabits.map((h) => {
                  const isDone = fd.some((x) => String(x) === String(h.id));
                  const isFail = ff.some((x) => String(x) === String(h.id));
                  const tm = (L.hTime && L.hTime(S, h.id)) || (S.forge && S.forge.times && S.forge.times[h.id]) || '';
                  const isBenefitOpen = openBenefitId === h.id;
                  const isHistoryOpen = openHistoryId === h.id;
                  const benefitText = getHabitBenefitText(h, lang);
                  const isCustom = isCustomHabit(h.id);

                  return (
                    <Card
                      key={h.id}
                      className={`p-3 sm:p-3.5 transition-all border w-full max-w-full min-w-0 overflow-hidden ${
                        isDone
                          ? 'border-gold/50 bg-gold/5'
                          : isFail
                          ? 'border-danger/50 bg-danger/5'
                          : 'border-line hover:border-gold/30'
                      }`}
                    >
                      {/* Cabeçalho com ações de Editar, Excluir e Arquivar */}
                      <div className="flex items-center justify-between gap-2 mb-2 min-w-0 w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-xl flex-none">{h.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`text-xs sm:text-[13.5px] font-bold block truncate ${isDone ? 'text-gold' : isFail ? 'text-danger' : 'text-ink'}`}>
                                {h.n}
                              </span>
                              {/* Botões de Ação para hábitos customizados */}
                              {isCustom && (
                                <div className="flex items-center gap-1 flex-none">
                                  <button
                                    type="button"
                                    title={LBL.editHabit[curLang]}
                                    onClick={() => openEditModal(h)}
                                    className="text-muted hover:text-gold p-0.5"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    title={LBL.deleteHabit[curLang]}
                                    onClick={() => deleteCustomHabit(h.id)}
                                    className="text-muted hover:text-danger p-0.5"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                            <span className="text-[9.5px] uppercase font-mono text-muted block truncate">
                              #{String(h.id).slice(-4)} · {isCustom ? '★ PERSONALIZADO' : LBL.activeInProtocol[curLang]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 flex-none pl-1">
                          {/* Botão Arquivar */}
                          <button
                            type="button"
                            title={LBL.archiveHabit[curLang]}
                            onClick={() => toggleArchive(h.id)}
                            className="text-muted/70 hover:text-gold p-1 rounded hover:bg-surface2 transition-colors flex-none"
                          >
                            <Archive size={14} />
                          </button>

                          {/* Botão de Status Ativo (clique para mover à reserva) */}
                          <button
                            type="button"
                            title="Mover para a Reserva"
                            onClick={() => toggleActive(h.id)}
                            className="flex items-center gap-1 text-[9.5px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 transition-colors flex-none"
                          >
                            {LBL.activeBtn[curLang]}
                          </button>
                        </div>
                      </div>

                      {/* Linha de Ação: Concluir + Horário + Falhar/Desfazer */}
                      <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-line/50 w-full min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleDone(h.id)}
                          className={`flex-1 min-w-0 min-h-[36px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border text-xs font-bold transition-all truncate ${
                            isDone
                              ? 'border-gold bg-gold text-[#141414] shadow-[0_0_12px_rgba(255,200,70,0.35)]'
                              : 'border-line bg-surface hover:border-gold/50 text-muted hover:text-ink'
                          }`}
                        >
                          <Check size={14} strokeWidth={2.5} className="flex-none" />
                          <span className="truncate">{isDone ? LBL.completeBtn[curLang] : LBL.toCompleteBtn[curLang]}</span>
                        </button>

                        <div className="flex items-center gap-1 bg-surface px-1.5 sm:px-2 py-1 min-h-[36px] rounded-lg border border-line text-[11px] font-mono flex-none">
                          <Clock size={12} className="text-gold flex-none" />
                          <input
                            type="time"
                            value={tm}
                            onChange={(e) => setTime(h.id, e.target.value)}
                            className="bg-transparent text-ink focus:outline-none w-[48px] sm:w-[54px] text-center"
                          />
                        </div>

                        {!isDone ? (
                          <button
                            type="button"
                            title={LBL.failBtn[curLang]}
                            onClick={() => toggleFailed(h.id)}
                            className={`flex-none min-h-[36px] px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                              isFail
                                ? 'border-danger bg-danger text-white shadow-sm'
                                : 'border-line bg-surface text-danger/80 hover:border-danger hover:text-danger'
                            }`}
                          >
                            <X size={13} strokeWidth={2.5} className="flex-none" />
                            <span className="hidden xs:inline sm:inline">{LBL.failBtn[curLang]}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Desfazer conclusão"
                            onClick={() => toggleDone(h.id)}
                            className="flex-none min-h-[36px] px-2.5 py-1 rounded-lg border border-line bg-surface text-[10.5px] font-mono text-muted hover:text-gold hover:border-gold/40 transition-colors"
                          >
                            Desfazer
                          </button>
                        )}
                      </div>

                      {/* BOTÕES EXPANSÍVEIS TÁTICOS */}
                      <div className="mt-2.5 pt-2 border-t border-line/40 flex flex-col gap-1.5 w-full min-w-0">
                        <div>
                          <button
                            type="button"
                            onClick={() => setOpenHistoryId(isHistoryOpen ? null : h.id)}
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

                        <div>
                          <button
                            type="button"
                            onClick={() => setOpenBenefitId(isBenefitOpen ? null : h.id)}
                            className="text-[10px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                          >
                            <span className="flex items-center gap-1">
                              <ShieldCheck size={11} className="text-gold" />
                              <span>{isBenefitOpen ? LBL.hideBenefit[curLang] : LBL.viewBenefit[curLang]}</span>
                            </span>
                            {isBenefitOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                          {isBenefitOpen && (
                            <div className="mt-1 text-[11px] text-[#e3e3ea] bg-surface/90 p-2.5 rounded-lg border border-gold/30 leading-relaxed shadow-sm">
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

                {/* CARD DE SLOT DISPONÍVEL */}
                {activeCount < maxSlots && (
                  <div
                    onClick={() => setActiveCategory('reserve')}
                    className="cursor-pointer border-2 border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all min-h-[145px] group w-full min-w-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/35 text-gold flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                      <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <b className="text-xs text-gold font-bold uppercase tracking-wider block">
                      Slot Disponível ({activeCount + 1}/{maxSlots >= 99 ? '∞' : maxSlots})
                    </b>
                    <span className="text-[11px] text-muted mt-1">
                      Toque aqui para ativar um hábito da Reserva →
                    </span>
                  </div>
                )}

                {/* CARD DE PRÓXIMO PATAMAR */}
                {activeCount >= maxSlots && activeHabits.length % 2 === 1 && (
                  <div className="border border-line/70 bg-surface2/70 rounded-lg p-4 flex flex-col justify-between min-h-[145px] w-full min-w-0">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10.5px] font-mono font-bold uppercase text-gold2 tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={13} className="text-gold" /> Próximo Desbloqueio
                        </span>
                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted">Slots Esgotados</span>
                      </div>
                      <p className="text-xs text-ink font-semibold mt-1">
                        {nextRule ? `Mantenha a retenção até ${nextRule.min} dias para destravar ${nextRule.slots >= 99 ? 'slots ilimitados' : `${nextRule.slots} slots`} no protocolo.` : 'Você atingiu o patamar supremo de slots ilimitados!'}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-muted">
                      <span>Slots em uso: <b className="text-gold font-mono">{activeCount}/{maxSlots >= 99 ? '∞' : maxSlots}</b></span>
                      <button
                        type="button"
                        onClick={() => setActiveCategory('reserve')}
                        className="text-gold hover:underline text-[11px] font-semibold"
                      >
                        Ver Reserva →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-6 w-full min-w-0">
                <Empty>Nenhum hábito ativo no protocolo.<br />Selecione hábitos na Reserva para forjar seu dia.</Empty>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('reserve')}
                    className="btn-gold py-1.5 px-4 text-xs font-bold"
                  >
                    Explorar Reserva de Hábitos →
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 2. RESERVA DA FORJA COM FILTROS DE CATEGORIA */}
      {activeCategory === 'reserve' && (
        <div id="reserva-forja-section" className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0 w-full">
            <div className="flex items-center gap-2">
              <K className="mb-0">📦 RESERVA DA FORJA ({filteredReserve.length} DISPONÍVEIS)</K>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-gold py-1.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>CRIAR HÁBITO</span>
            </button>
          </div>

          {/* Filtros por Categorias + Aba Arquivados com Scroll Horizontal Suave no Mobile */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 w-full max-w-full min-w-0">
            {[
              { id: 'all', label: PIL.all[curLang] },
              { id: 'body', label: PIL.body[curLang] },
              { id: 'mind', label: PIL.mind[curLang] },
              { id: 'mission', label: PIL.mission[curLang] },
              { id: 'spirit', label: PIL.spirit[curLang] },
              { id: 'archived', label: PIL.archived[curLang] },
            ].map((p) => {
              const count = p.id === 'all'
                ? reserveHabits.length
                : p.id === 'archived'
                ? archivedHabits.length
                : reserveHabits.filter((h) => getHabitCategory(h) === p.id).length;
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPillar(p.id)}
                  className={`shrink-0 text-[10.5px] font-mono px-2.5 py-1 rounded transition-all flex items-center gap-1 whitespace-nowrap ${
                    isSelected
                      ? 'bg-gold text-[#141414] font-bold shadow-sm'
                      : 'bg-surface2 text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grade de 3 Colunas na Reserva */}
          {filteredReserve.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-full min-w-0">
              {filteredReserve.map((h) => {
                const isBenefitOpen = openBenefitId === h.id;
                const benefitText = getHabitBenefitText(h, lang);
                const isCustom = isCustomHabit(h.id);
                const isArchived = archivedIds.some((arid) => String(arid) === String(h.id));

                return (
                  <div
                    key={h.id}
                    className={`p-2.5 rounded-lg border transition-colors flex flex-col justify-between w-full min-w-0 overflow-hidden ${
                      isArchived
                        ? 'border-line/40 bg-surface/50 opacity-70'
                        : 'border-line bg-surface2/70 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-none">{h.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-ink truncate">
                              {h.n}
                            </span>
                            {/* Botão de Editar/Excluir se for customizado na reserva */}
                            {isCustom && (
                              <div className="flex items-center gap-1 flex-none">
                                <button
                                  type="button"
                                  title={LBL.editHabit[curLang]}
                                  onClick={() => openEditModal(h)}
                                  className="text-muted hover:text-gold p-0.5"
                                >
                                  <Edit3 size={11} />
                                </button>
                                <button
                                  type="button"
                                  title={LBL.deleteHabit[curLang]}
                                  onClick={() => deleteCustomHabit(h.id)}
                                  className="text-muted hover:text-danger p-0.5"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            )}
                          </div>
                          {isCustom && (
                            <span className="text-[8.5px] uppercase font-mono text-gold/80 block truncate">
                              ★ Personalizado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-none pl-1">
                        {/* Botão Arquivar / Desarquivar */}
                        <button
                          type="button"
                          title={isArchived ? LBL.unarchiveHabit[curLang] : LBL.archiveHabit[curLang]}
                          onClick={() => toggleArchive(h.id)}
                          className="text-muted/70 hover:text-gold p-1 rounded hover:bg-surface"
                        >
                          {isArchived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
                        </button>

                        {/* Botão Ativar */}
                        {!isArchived && (
                          <button
                            type="button"
                            title="Ativar no Protocolo"
                            onClick={() => toggleActive(h.id)}
                            className="flex-none text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-surface text-muted hover:border-gold hover:text-gold transition-colors font-bold"
                          >
                            {LBL.activateBtn[curLang]}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Botão Expansível de Benefício na Reserva */}
                    <div className="mt-1.5 pt-1 border-t border-line/30 w-full min-w-0">
                      <button
                        type="button"
                        onClick={() => setOpenBenefitId(isBenefitOpen ? null : h.id)}
                        className="text-[9.5px] text-muted hover:text-gold flex items-center justify-between w-full font-mono py-0.5"
                      >
                        <span className="flex items-center gap-1 truncate">
                          <ShieldCheck size={10} className="text-gold flex-none" />
                          <span className="truncate">{isBenefitOpen ? LBL.hideBenefit[curLang] : LBL.viewBenefit[curLang]}</span>
                        </span>
                        {isBenefitOpen ? <ChevronUp size={10} className="flex-none" /> : <ChevronDown size={10} className="flex-none" />}
                      </button>
                      {isBenefitOpen && (
                        <div className="mt-1 text-[10px] text-muted bg-surface p-2 rounded-lg border border-line leading-snug">
                          {benefitText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center bg-surface2/30 rounded-lg border border-line/40 w-full min-w-0">
              <p className="text-xs text-muted">
                {selectedPillar === 'archived' ? 'Nenhum hábito arquivado no momento.' : 'Nenhum hábito nesta categoria.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. REGRAS & SLOTS */}
      {activeCategory === 'rules' && (
        <div className="flex flex-col gap-3.5 w-full max-w-full min-w-0 overflow-hidden">
          {/* Card Detalhado de Regras de Desbloqueio */}
          <Card className="p-3.5 sm:p-4 border-gold/30 bg-surface2/60 w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 min-w-0">
              <K className="mb-0 truncate">🛡️ PATAMARES DE DESBLOQUEIO DE SLOTS</K>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold font-bold flex-none">
                {activeCount}/{maxSlots >= 99 ? '∞' : maxSlots} SLOTS ATIVOS
              </span>
            </div>
            <p className="text-xs text-muted mb-4 leading-relaxed">
              A retenção seminal e a disciplina forjam seu caráter. Conforme seus dias limpos aumentam, novos slots no protocolo diário são liberados.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full min-w-0">
              {FORGE_RULES && FORGE_RULES.map((r, i) => {
                const isCur = d >= r.min && (i === FORGE_RULES.length - 1 || d < FORGE_RULES[i + 1].min);
                const isUnlocked = d >= r.min;
                return (
                  <div
                    key={r.min}
                    className={`p-3 rounded-lg border flex flex-col justify-between w-full min-w-0 overflow-hidden ${
                      isCur
                        ? 'border-gold bg-gold/15 shadow-[0_0_12px_rgba(255,200,70,0.2)]'
                        : isUnlocked
                        ? 'border-line bg-surface2'
                        : 'border-line/40 bg-surface/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                      <span className="text-xs font-bold text-ink flex items-center gap-1.5 truncate">
                        <span className="flex-none">{r.icon || '🎖️'}</span>
                        <span className="truncate">{r.name || `Nível ${i + 1}`}</span>
                      </span>
                      {isCur ? (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-gold text-[#141414] flex-none">
                          ATUAL
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[9px] font-mono text-gold font-semibold flex-none">LIBERADO</span>
                      ) : (
                        <span className="text-[9px] font-mono text-muted flex-none">BLOQUEADO</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-muted truncate">
                      <span>Mínimo: <b className="text-ink">{r.min} dias</b></span>
                      <span className="mx-1.5">·</span>
                      <span>Slots: <b className="text-gold">{r.slots >= 99 ? 'Ilimitados (∞)' : `${r.slots} hábitos`}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Seção de Hábitos Arquivados */}
          <Card className="p-3.5 sm:p-4 border-line w-full max-w-full min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3 min-w-0">
              <K className="mb-0">📦 HÁBITOS ARQUIVADOS ({archivedHabits.length})</K>
            </div>
            {archivedHabits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full min-w-0">
                {archivedHabits.map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-lg border border-line/60 bg-surface2/60 flex items-center justify-between gap-2 w-full min-w-0 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg flex-none">{h.icon}</span>
                      <span className="text-xs font-semibold text-ink truncate">{h.n}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleArchive(h.id)}
                      className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded border border-line bg-surface hover:border-gold hover:text-gold text-muted transition-colors font-bold flex-none"
                    >
                      <ArchiveRestore size={12} />
                      <span>{LBL.unarchiveHabit[curLang]}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted">
                Nenhum hábito arquivado. Hábitos que você arquivar da reserva ou do protocolo aparecerão aqui para restauração.
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
