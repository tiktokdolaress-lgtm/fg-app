'use client';
import React, { useState } from 'react';
import { Plus, Flame, Clock, Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Sparkles, CalendarDays, Dumbbell, Brain, Briefcase, Award, Layers } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { FORGE_RULES, DEFAULT_HABITS } from '@/lib/data';
import { cxHabits } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';

/* Categorias / Pilares da Masculinidade Trilíngues */
const PILLARS_I18N = {
  all: { pt: 'Todos', en: 'All', es: 'Todos' },
  body: { pt: '🏛️ Corpo & Vigor', en: '🏛️ Body & Vigor', es: '🏛️ Cuerpo y Vigor' },
  mind: { pt: '🧠 Mente & Foco', en: '🧠 Mind & Focus', es: '🧠 Mente y Enfoque' },
  mission: { pt: '💼 Missão & Finanças', en: '💼 Mission & Wealth', es: '💼 Misión y Finanzas' },
  spirit: { pt: '⚔️ Espírito & Honra', en: '⚔️ Spirit & Honor', es: '⚔️ Espíritu y Honor' },
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
};

/* Catálogo Expandido de Hábitos Masculinos com Pilares e Benefícios Científicos */
const MASTER_HABITS_CATALOG = [
  /* PILAR 1: CORPO & TESTOSTERONA */
  {
    id: '#01', cat: 'body', icon: '🧊',
    n: { pt: 'Banho Gelado', en: 'Cold Shower', es: 'Ducha Fría' },
    benefit: {
      pt: 'Resfria a região pélvica, extingue impulsos sexuais repentinos e gera um pico imediato de dopamina limpa sem pornografia.',
      en: 'Cools the pelvic floor, extinguishes sudden sexual urges, and creates an instant spike of clean dopamine without porn.',
      es: 'Enfría el área pélvica, apaga impulsos sexuales repentinos y genera un pico inmediato de dopamina limpia sin pantallas.',
    }
  },
  {
    id: '#02', cat: 'body', icon: '🏋️',
    n: { pt: 'Treino de Força / Musculação', en: 'Strength Training / Gym', es: 'Entrenamiento de Fuerza' },
    benefit: {
      pt: 'Transmuta a energia seminal represada em densidade muscular, aumenta a testosterona livre e descarrega a tensão corporal.',
      en: 'Transmutes stored seminal energy into muscle density, increases free testosterone, and discharges body restlessness.',
      es: 'Transmuta la energía seminal en densidad muscular, eleva la testosterona libre y descarga la tensión física.',
    }
  },
  {
    id: '#13', cat: 'body', icon: '💧',
    n: { pt: '3L a 4L de Água', en: '3L to 4L of Water', es: '3L a 4L de Agua' },
    benefit: {
      pt: 'Mantém a hidratação celular máxima, otimiza o fluxo sanguíneo e elimina a letargia que costuma abrir portas para a recaída.',
      en: 'Maximizes cellular hydration, optimizes blood flow, and eliminates physical sluggishness that invites relapse.',
      es: 'Mantiene la hidratación celular máxima, optimiza el flujo sanguíneo y aleja la lentitud que abre paso a la recaída.',
    }
  },
  {
    id: '#14', cat: 'body', icon: '☀️',
    n: { pt: 'Sol Matinal (15m)', en: 'Morning Sunlight (15m)', es: 'Sol Matutino (15m)' },
    benefit: {
      pt: 'Calibra o ritmo circadiano cerebral, sintetiza vitamina D e garante sono profundo à noite (onde a testosterona é forjada).',
      en: 'Calibrates brain circadian rhythm, synthesizes vitamin D, and ensures deep sleep at night (where testosterone is built).',
      es: 'Calibra el ritmo circadiano cerebral, sintetiza vitamina D y asegura un sueño profundo (donde se forja la testosterona).',
    }
  },
  {
    id: '#18', cat: 'body', icon: '🧘‍♂️',
    n: { pt: 'Mobilidade Pélvica / Kegel Invertido', en: 'Pelvic Mobility / Reverse Kegel', es: 'Movilidad Pélvica' },
    benefit: {
      pt: 'Relaxa o assoalho pélvico, melhora a circulação prostática e evita o acúmulo de desconforto que induz à masturbação mecânica.',
      en: 'Relaxes the pelvic floor, improves prostate circulation, and relieves localized pressure that triggers mechanical masturbation.',
      es: 'Relaja el suelo pélvico, mejora la circulación prostática y previene la tensión que incita a la masturbación mecánica.',
    }
  },
  {
    id: '#19', cat: 'body', icon: '🥊',
    n: { pt: 'Arte Marcial / Boxe / Jiu-Jitsu', en: 'Martial Arts / Boxing / BJJ', es: 'Artes Marciales / Boxeo' },
    benefit: {
      pt: 'Ensina o homem a suportar o desconforto físico, calibra a agressividade natural e reforça a compostura inabalável.',
      en: 'Teaches a man to endure physical distress, channels primal combativeness, and builds unshakeable composure.',
      es: 'Enseña a soportar el malestar físico, canaliza la combatividad natural y refuerza una compostura inquebrantable.',
    }
  },

  /* PILAR 2: MENTE & INTELECTO */
  {
    id: '#03', cat: 'mind', icon: '📖',
    n: { pt: 'Leitura Estoica / Filosofia (20m)', en: 'Stoic Reading / Philosophy (20m)', es: 'Lectura Estoica (20m)' },
    benefit: {
      pt: 'Treina o foco sustentado, reconstrói o córtex pré-frontal e substitui o consumo de estímulos rápidos por sabedoria densa.',
      en: 'Rebuilds the prefrontal cortex, trains sustained focus, and replaces short dopamine hits with dense mental wisdom.',
      es: 'Reconstruye la corteza prefrontal, entrena el enfoque sostenido y sustituye estímulos rápidos por sabiduría densa.',
    }
  },
  {
    id: '#05', cat: 'mind', icon: '📵',
    n: { pt: 'Apagão de Telas 1h Antes de Dormir', en: 'Screen Blackout 1h Before Bed', es: 'Apagón de Pantallas 1h Antes' },
    benefit: {
      pt: 'Bloqueia o maior canal de recaídas noturnas. Sem luz azul estimulando o cérebro, a mente descansa protegida.',
      en: 'Blocks the #1 channel for late-night relapses. Without blue light stimulating dopamine, the mind rests guarded.',
      es: 'Bloquea el canal principal de recaídas nocturnas. Sin luz azul sobreestimulando el cerebro, la mente descansa blindada.',
    }
  },
  {
    id: '#06', cat: 'mind', icon: '🧹',
    n: { pt: 'Limpeza de Redes / Zero Gatilhos', en: 'Feed Cleansing / Zero Triggers', es: 'Limpieza de Redes / Cero Detonantes' },
    benefit: {
      pt: 'Elimina contas hiperestimulantes, perfis apelativos e algoritmos programados para sequestrar sua dopamina e vontade.',
      en: 'Unfollows thirst traps, hyperstimulating feeds, and algorithms engineered to hijack your dopamine and willpower.',
      es: 'Elimina cuentas sugerentes, feeds hiperestimulantes y algoritmos diseñados para secuestrar tu dopamina y voluntad.',
    }
  },
  {
    id: '#07', cat: 'mind', icon: '🍯',
    n: { pt: 'Cortar Açúcar & Junk Food', en: 'Cut Sugar & Junk Food', es: 'Cortar Azúcar y Comida Basura' },
    benefit: {
      pt: 'Elimina oscilações violentas de glicose e insulina, que provocam névoa mental e enfraquecem a capacidade de dizer não.',
      en: 'Eliminates violent blood sugar crashes that trigger brain fog and weaken your executive capacity to resist urges.',
      es: 'Evita caídas drásticas de glucosa que provocan niebla mental y debilitan la capacidad de decir que no a la tentación.',
    }
  },
  {
    id: '#08', cat: 'mind', icon: '🚶',
    n: { pt: 'Caminhada Sem Fones (20m)', en: 'Phone-Free Walk (20m)', es: 'Caminata Sin Auriculares (20m)' },
    benefit: {
      pt: 'Acalma o sistema nervoso simpático, silencia a hiperestimulação diária e treina o guerreiro a tolerar o próprio silêncio.',
      en: 'Settles the nervous system, clears out daily sensory overload, and teaches a man to be comfortable in pure silence.',
      es: 'Calma el sistema nervioso, disipa la sobreestimulación diaria y entrena al guerrero a tolerar el propio silencio.',
    }
  },
  {
    id: '#20', cat: 'mind', icon: '♟️',
    n: { pt: 'Xadrez / Treino de Antecipação', en: 'Chess / Strategic Thinking', es: 'Ajedrez / Pensamiento Estratégico' },
    benefit: {
      pt: 'Exercita a capacidade de pausar antes de agir, calculando as consequências do próximo movimento contra impulsos cegos.',
      en: 'Exercises impulse inhibition: teaches you to pause, breathe, and evaluate consequences before making a blind move.',
      es: 'Ejercita la inhibición de impulsos: enseña a pausar y evaluar las consecuencias antes de dar un movimiento ciego.',
    }
  },

  /* PILAR 3: MISSÃO, FOCO & IMPÉRIO */
  {
    id: '#16', cat: 'mission', icon: '🎯',
    n: { pt: 'Foco Profundo 90m (Deep Work)', en: '90m Deep Work Session', es: 'Enfoque Profundo 90m (Deep Work)' },
    benefit: {
      pt: 'Canaliza a agressividade e a concentração da retenção seminal em criação de patrimônio, estudos e valor real de mercado.',
      en: 'Channels retained testosterone and drive into wealth generation, elite studying, and tangible real-world market value.',
      es: 'Canaliza la energía de la retención seminal en creación de patrimonio, estudios y valor tangible de mercado.',
    }
  },
  {
    id: '#21', cat: 'mission', icon: '🐸',
    n: { pt: 'Engolir o Sapo (Tarefa Mais Difícil 1º)', en: 'Eat the Frog (Hardest Task First)', es: 'Hacer lo Más Difícil Primero' },
    benefit: {
      pt: 'Executa o dever mais pesado logo pela manhã. Elimina o estresse e a ansiedade acumulada que alimentam recaídas.',
      en: 'Tackles the most difficult duty at dawn. Eliminates procrastination anxiety, which is a major hidden fuel for relapses.',
      es: 'Ejecuta el deber más pesado a primera hora. Elimina la ansiedad por postergar, principal combustible oculto de caídas.',
    }
  },
  {
    id: '#22', cat: 'mission', icon: '📊',
    n: { pt: 'Fechamento Financeiro Diário', en: 'Daily Financial Tracking', es: 'Control Financiero Diario' },
    benefit: {
      pt: 'Ensina controle consciente sobre os recursos materiais. O homem que governa o próprio bolso governa a própria mente.',
      en: 'Builds conscious mastery over material resources. A man who disciplines his wallet disciplines his mind.',
      es: 'Enseña control consciente sobre los recursos materiales. El hombre que gobierna su dinero gobierna su mente.',
    }
  },
  {
    id: '#23', cat: 'mission', icon: '📝',
    n: { pt: 'Planejar o Dia Seguinte à Noite', en: 'Plan Next Day the Night Before', es: 'Planear el Día Siguiente de Noche' },
    benefit: {
      pt: 'Acordar sabendo exatamente para onde marchar elimina a ociosidade matinal, o maior terreno fértil para desvios.',
      en: 'Waking up with clear marching orders eliminates aimless morning downtime, the fertile ground for moral deviations.',
      es: 'Despertar sabiendo exactamente hacia dónde marchar elimina la ociosidad matutina, terreno fértil para desvíos.',
    }
  },

  /* PILAR 4: ESPÍRITO, CARÁTER & HONRA */
  {
    id: '#04', cat: 'spirit', icon: '⏰',
    n: { pt: 'Acordar Antes das 06:00 Sem Soneca', en: 'Wake Before 06:00 No Snooze', es: 'Despertar Antes de las 06:00 Sin Siesta' },
    benefit: {
      pt: 'Primeira batalha ganha contra o conforto da carne. Rolar na cama é o berço de 60% das recaídas matinais.',
      en: 'First battle won against flesh comfort. Lingering in bed after waking is the origin of 60% of morning relapses.',
      es: 'Primera batalla ganada contra la comodidad. Quedarse en la cama es la cuna del 60% de las recaídas matutinas.',
    }
  },
  {
    id: '#09', cat: 'spirit', icon: '🧘',
    n: { pt: 'Meditação / Silêncio Absoluto (10m)', en: 'Stillness / Meditation (10m)', es: 'Meditación / Silencio (10m)' },
    benefit: {
      pt: 'Treina a mente a ser observadora do impulso e não escrava dele. Separa o guerreiro do animal primitivo.',
      en: 'Teaches the mind to observe biological urges without reacting. Separates the master warrior from the primitive animal.',
      es: 'Entrena la mente para ser observadora del impulso y no su esclava. Separa al guerrero del animal primitivo.',
    }
  },
  {
    id: '#11', cat: 'spirit', icon: '🛏️',
    n: { pt: 'Arrumar a Cama com Rigor', en: 'Make the Bed with Precision', es: 'Hacer la Cama con Rigor' },
    benefit: {
      pt: 'Estabelece ordem militar no seu território físico imediato. A mente reflete a desordem do ambiente em que repousa.',
      en: 'Establishes military order in your immediate territory. An undisciplined environment fosters an undisciplined mind.',
      es: 'Establece orden militar en tu territorio inmediato. La mente refleja el desorden del entorno donde descansa.',
    }
  },
  {
    id: '#12', cat: 'spirit', icon: '🚫',
    n: { pt: 'Zero Álcool & Substâncias', en: 'Zero Alcohol & Substances', es: 'Cero Alcohol y Sustancias' },
    benefit: {
      pt: 'O álcool desliga a censura moral do lobo frontal. Preservar a sobriedade é blindar o escudo contra desastres.',
      en: 'Alcohol shuts down prefrontal moral inhibition. Preserving absolute sobriety shields you against catastrophic relapses.',
      es: 'El alcohol desconecta la censura moral del lóbulo frontal. Mantenerse sobrio es blindar el escudo contra desastres.',
    }
  },
  {
    id: '#15', cat: 'spirit', icon: '📓',
    n: { pt: 'Diário de Bordo & Honra Noturna', en: 'Captain Log & Evening Review', es: 'Diario de a Bordo y Revisión Nocturna' },
    benefit: {
      pt: 'Prestar contas a si mesmo todas as noites. Identifica pontos de fraqueza e celebra o dia vencido com retenção intacta.',
      en: 'Daily accountability before sleep. Audits weak points, registers triggers, and celebrates another victorious day.',
      es: 'Rendir cuentas a uno mismo cada noche. Identifica puntos de flaqueza y celebra el día vencido con la retención intacta.',
    }
  },
  {
    id: '#17', cat: 'spirit', icon: '📵',
    n: { pt: 'Celular Carregando Fora do Quarto', en: 'Phone Charging Outside Bedroom', es: 'Móvil Cargando Fuera de la Habitación' },
    benefit: {
      pt: 'Regra de ferro de ouro: sem telas no leito noturno, você elimina 90% das tentações solitárias e recupera o sono puro.',
      en: 'Golden ironclad rule: no screens in bed removes 90% of solitary temptations and restores pure restorative sleep.',
      es: 'Regla de oro: sin pantallas en la cama eliminas el 90% de las tentaciones solitarias y recuperas el sueño puro.',
    }
  },
  {
    id: '#24', cat: 'spirit', icon: '🤝',
    n: { pt: 'Ação de Valor Silenciosa / Caridade Oculta', en: 'Silent Act of Honor / Quiet Charity', es: 'Acción de Valor Silenciosa' },
    benefit: {
      pt: 'Fazer o bem a alguém sem buscar aplausos ou validação externa. Purifica o ego e constrói grandeza interior genuína.',
      en: 'Serve someone without seeking applause, recognition, or validation. Purifies the ego and builds quiet inner nobility.',
      es: 'Hacer el bien sin buscar aplausos ni validación. Purifica el ego y construye una grandeza interior genuina.',
    }
  },
];

export default function ForgeView() {
  const { S, update, t, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const LBL = LABELS_I18N;
  const PIL = PILLARS_I18N;

  const [selectedPillar, setSelectedPillar] = useState('all');
  const [openBenefitId, setOpenBenefitId] = useState(null);
  const [openHistoryId, setOpenHistoryId] = useState(null);

  /* Mesclar catálogo mestre de hábitos com hábitos customizados do usuário */
  const customHabits = (S && S.customHabits) || [];
  const customCatalog = customHabits.map((ch) => ({
    id: ch.id,
    cat: 'mission',
    icon: ch.icon || '⚡',
    n: { pt: ch.n, en: ch.n, es: ch.n },
    benefit: {
      pt: 'Hábito personalizado forjado para fortalecer sua rotina e disciplina diária.',
      en: 'Custom habit forged to reinforce your personal routine and warrior discipline.',
      es: 'Hábito personalizado forjado para fortalecer tu rutina y disciplina diaria.',
    },
  }));

  const mergedCatalog = [...MASTER_HABITS_CATALOG, ...customCatalog];

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

  const activeHabits = activeIds.map((id) => mergedCatalog.find((h) => h.id === id) || { id, icon: '⚡', n: { pt: id, en: id, es: id }, cat: 'body' });
  const reserveHabits = mergedCatalog.filter((h) => !activeIds.includes(h.id));

  /* Filtrar reserva por categoria */
  const filteredReserve = reserveHabits.filter((h) => {
    if (selectedPillar === 'all') return true;
    return h.cat === selectedPillar;
  });

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
                  <span className="truncate">{h.n[curLang] || h.n.pt}</span>
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
              const habitName = (h.n && h.n[curLang]) ? h.n[curLang] : (h.n && h.n.pt) ? h.n.pt : h.n;
              const benefitText = (h.benefit && h.benefit[curLang]) ? h.benefit[curLang] : (h.benefit && h.benefit.pt) ? h.benefit.pt : h.benefit || '';

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
                          {habitName}
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

                  {/* BOTÕES EXPANSÍVEIS TÁTICOS */}
                  <div className="mt-2.5 pt-2 border-t border-line/40 flex flex-col gap-1.5">
                    {/* Botão: Histórico dos Últimos 7 Dias */}
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

                    {/* Botão: Benefícios & Proteção Contra Recaída */}
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

      {/* 4. RESERVA DA FORJA COM FILTROS DE CATEGORIA (3 Colunas no PC) */}
      <div className="mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <K className="mb-0">📦 RESERVA DA FORJA ({filteredReserve.length} DISPONÍVEIS)</K>
          </div>

          {/* Barra de Filtros por Categoria / Pilar */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: PIL.all[curLang] },
              { id: 'body', label: PIL.body[curLang] },
              { id: 'mind', label: PIL.mind[curLang] },
              { id: 'mission', label: PIL.mission[curLang] },
              { id: 'spirit', label: PIL.spirit[curLang] },
            ].map((p) => {
              const count = p.id === 'all' ? reserveHabits.length : reserveHabits.filter((h) => h.cat === p.id).length;
              const isSelected = selectedPillar === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPillar(p.id)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-all flex items-center gap-1 ${
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
        </div>

        {/* Grade de 3 Colunas de Hábitos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredReserve.map((h) => {
            const isBenefitOpen = openBenefitId === h.id;
            const habitName = (h.n && h.n[curLang]) ? h.n[curLang] : (h.n && h.n.pt) ? h.n.pt : h.n;
            const benefitText = (h.benefit && h.benefit[curLang]) ? h.benefit[curLang] : (h.benefit && h.benefit.pt) ? h.benefit.pt : h.benefit || '';

            return (
              <div
                key={h.id}
                className="p-2.5 rounded-r border border-line bg-surface2/70 hover:border-gold/40 transition-colors flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg flex-none">{h.icon}</span>
                    <span className="text-xs font-bold text-ink truncate">
                      {habitName}
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
