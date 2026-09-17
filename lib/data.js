export const QUOTES = [
  'A disciplina é a ponte entre metas e conquistas.',
  'Dor temporária, orgulho eterno.',
  'Quem vence a si mesmo vence qualquer batalha.',
  'Energia retida é poder acumulado.',
  'O impulso é passageiro. A honra é permanente.',
  'Não negocie com a sua fraqueza.',
  'Forje-se no silêncio; o mundo ouvirá o aço.',
  'Cada dia limpo é um tijolo na fortaleza.',
];

export const TIERS = [
  { min: 0, slots: 2, name: 'RECRUTA', icon: '🎖️', reward: '' },
  { min: 7, slots: 4, name: 'GUERREIRO', icon: '⚔️', reward: '' },
  { min: 21, slots: 5, name: 'CENTURIÃO', icon: '🛡️', reward: '' },
  { min: 45, slots: 7, name: 'ESPARTANO', icon: '🏛️', reward: '' },
  { min: 90, slots: 99, name: 'MONGE / LORDE DA FORJA', icon: '🐉', reward: 'Aura Dourada no QG' },
  { min: 180, slots: 99, name: 'TRANSMUTADOR ASTRAL', icon: '', reward: 'Tema Ônix Cósmico + síntese sonora exclusiva' },
  { min: 365, slots: 99, name: 'LENDA INCONCUSSÁVEL', icon: '👑', reward: 'Insígnia de Titânio + status Lenda' },
];
export const TIERF = (days) => {
  let t = TIERS[0];
  for (const x of TIERS) if (days >= x.min) t = x;
  return t;
};
export const NEXTF = (days) => TIERS.find((x) => x.min > days) || null;

export const METAS = [
  { d: 7, icon: '🎖️', n: 'RECRUTA', sub: 'Prova de Fogo do Protocolo · Teste Gratuito' },
  { d: 14, icon: '⚔️', n: 'GUERREIRO DA LINHA DE FRENTE', sub: 'Estabilização Inicial' },
  { d: 21, icon: '🛡️', n: 'CENTURIÃO', sub: 'Desintoxicação e Consolidação do Hábito' },
  { d: 45, icon: '🏛️', n: 'ESPARTANO', sub: 'Reorganização Dopaminérgica Profunda' },
  { d: 90, icon: '🐉', n: 'LORDE DA FORJA', sub: 'Reset Neuroquímico Completo' },
];

export const HABITS = [
  { id: 1, icon: '🧊', n: 'Banho Gelado', b: 'Ativa o sistema nervoso simpático, dispara noradrenalina e treina sua mente a obedecer comandos mesmo sob desconforto.', p: 'Corta o impulso no pico: a adrenalina substitui a busca por dopamina barata e quebra o transe do gatilho.' },
  { id: 2, icon: '🏋️', n: 'Treino de Força', b: 'Eleva a testosterona de forma natural, melhora a sensibilidade à dopamina e drena a tensão acumulada do corpo.', p: 'Transmuta a energia sexual retida em fibra muscular — o corpo para de "pedir" liberação e passa a construir.' },
  { id: 3, icon: '📜', n: 'Leitura Estoica', b: 'Fortalece o córtex pré-frontal, sede da disciplina, e reprograma sua relação com o desejo.', p: 'Cada página é uma repetição mental: "o impulso é passageiro, a honra é permanente".' },
  { id: 4, icon: '⏰', n: 'Acordar 05:59', b: 'Ancora o ritmo circadiano, ativa o cortisol matinal saudável e elimina a janela de risco da madrugada.', p: 'Mata o gatilho "madrugada no celular": o guerreiro levanta antes do vício acordar.' },
  { id: 5, icon: '🌑', n: 'Apagão de Telas', b: 'Reduz a superestimulação dopaminérgica e devolve sensibilidade aos receptores.', p: 'Menos telas = menos janelas abertas para o conteúdo imundo entrar.' },
  { id: 6, icon: '🧹', n: 'Limpeza de Redes', b: 'Remove perfis, grupos e algoritmos que servem de porta de entrada para o vício.', p: 'Destrói a rota de suprimento do vício antes mesmo do primeiro clique.' },
  { id: 7, icon: '🍯', n: 'Cortar Açúcar', b: 'Estabiliza a glicemia e reduz os picos de ansiedade que disparam recaídas.', p: 'Menos montanha-russa emocional, menos desculpas para buscar conforto imediato.' },
  { id: 8, icon: '🚶', n: 'Caminhada Sem Fones', b: 'Treina presença, tolerância ao tédio e regulação do sistema nervoso.', p: 'Ensina o cérebro a suportar o silêncio — o oposto exato da fuga pornográfica.' },
  { id: 9, icon: '🧘', n: 'Meditação (10-15m)', b: 'Espessa o córtex pré-frontal e reduz a atividade da rede de devaneio compulsivo.', p: 'Cria o intervalo de 3 segundos entre gatilho e ação — onde nasce a escolha.' },
  { id: 10, icon: '⏳', n: 'Jejum Intermitente', b: 'Aumenta autofagia, clareza mental e o domínio sobre impulsos primários.', p: 'Quem domina a própria fome domina qualquer desejo.' },
  { id: 11, icon: '🛏️', n: 'Arrumar a Cama', b: 'A primeira vitória do dia; programa o cérebro a completar o que começa.', p: 'Elimina a estagnação energética do ambiente: ordem externa, ordem interna.' },
  { id: 12, icon: '🚫', n: 'Zero Álcool/Drogas', b: 'Protege a serotonina e preserva a sua capacidade de dizer NÃO.', p: 'A maioria das recaídas acontece desinibido — este hábito mantém o guardião no portão.' },
  { id: 13, icon: '💧', n: '3L de Água', b: 'Otimiza fluxo sanguíneo, energia basal e reduz o brain fog.', p: 'Corpo hidratado tem menos picos de irritabilidade e ansiedade — gatilhos enfraquecidos.' },
  { id: 14, icon: '☀️', n: 'Sol Matinal', b: 'Regula melatonina, serotonina e síntese de vitamina D.', p: 'Humor estável reduz a busca por dopamina artificial no escuro.' },
  { id: 15, icon: '✍️', n: 'Diário de Bordo', b: 'Transforma caos interno em dados observáveis e padrões mapeáveis.', p: 'Nomear o gatilho retira o poder dele: padrão mapeado é padrão neutralizado.' },
  { id: 16, icon: '🎯', n: 'Foco Profundo 90m', b: 'Reconstrói os circuitos de atenção destruídos pelo consumo rápido.', p: 'Uma mente ocupada construindo o futuro não tem tempo para planejar recaídas.' },
  { id: 17, icon: '📵', n: 'Celular Fora do Quarto', b: 'Remove o campo de batalha mais perigoso: cama + noite + solidão.', p: 'Distância física do gatilho — a estratégia mais antiga e eficaz da guerra.' },
  { id: 18, icon: '🦴', n: 'Mobilidade Pélvica', b: 'Solta tensões pélvicas acumuladas na retenção e melhora a circulação.', p: 'Reduz a pressão física que o cérebro interpreta como urgência sexual.' },
  { id: 19, icon: '🗿', n: 'Tarefa Mais Difícil Primeiro', b: 'Treina o cérebro a correr PARA o desconforto, não fugir dele.', p: 'Inverte a lógica do vício: em vez de alívio fácil, conquista primeiro.' },
  { id: 20, icon: '🤝', n: 'Ação de Valor Silenciosa', b: 'Gera dopamina de contribuição real, sem plateia e sem aplauso.', p: 'Substitui o prazer secreto e sujo por valor silencioso e honra.' },
];
export const HABIT_ICONS = ['🧊', '️', '📜', '⏰', '', '', '🍯', '🚶', '', '', '️', '', '💧', '️', '✍️', '🎯', '📵', '', '', '🤝', '🛠', '⭐', '🔥', '', '', '🦁'];

export const TRIGGERS = ['Tédio e tempo ocioso', 'Ansiedade / Estresse', 'Redes sociais / Reels', 'Solidão / Madrugada no celular', 'Cansaço mental'];
export const FREQS = ['Todos os dias (1x ou mais)', '3 a 5 vezes por semana', '1 a 2 vezes por semana', 'Esporadicamente'];

export const LIFE_STATUS = {
  single: { label: '🗡️ SOLTEIRO', desc: 'Tríade completa: sem pornografia, sem masturbação, com Retenção Seminal.' },
  committedA: { label: '💍 COMPROMETIDO · SEXO REAL CONSCIENTE', desc: '2 pilares: sem pornografia, sem masturbação. Ejaculação com a parceira PERMITIDA.' },
  committedB: { label: '💍 COMPROMETIDO · SEXO REAL COM RETENÇÃO', desc: '3 pilares mantidos mesmo dentro do relacionamento.' },
};

export const NOTE_TAGS = ['💡 Negócios', '📜 Princípios', '📚 Aprendizado', '🧠 Reflexão'];
export const PROJ_CATS = ['Corpo', 'Mente', 'Financeiro', 'Carreira', 'Espírito', 'Outro'];
export const REPS = [
  ['unica', '↺ Única (não repete)'],
  ['diaria', '🔁 Diária'],
  ['semana', '🔁 Seg a Sex'],
  ['fds', '🔁 Sáb e Dom'],
  ['semanal', '🗓️ Semanal (1 dia da semana escolhido)'],
  ['custom', '🗓️ Personalizada (dias da semana escolhidos)'],
];
export const WDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const REP_LBL = { unica: '', diaria: '🔁 Diária', semana: '🔁 Seg–Sex', fds: '🔁 Sáb–Dom', semanal: '🔁 Semanal', custom: '🗓️ Personalizada' };
export function repLabel(t) {
  const r = t.rep || 'unica';
  if (r === 'semanal') return '🔁 Semanal · ' + WDAYS[t.repDay == null ? 1 : Number(t.repDay)];
  if (r === 'custom') {
    const ds = (t.repDays || []).slice().sort((a, b) => a - b);
    return '🗓 ' + (ds.length ? ds.map((i) => WDAYS[i]).join(', ') : '—');
  }
  return REP_LBL[r] || '';
}
export const PRI_LBL = { alta: '🔴 Alta', media: '🟡 Média', baixa: '⚪ Baixa' };
export const FAIL_LBL = { porn: 'Pornografia', mast: 'Masturbação', ejac: 'Ejaculação' };
export const FAIL_PEN = { porn: 12, mast: 10, ejac: 18 };

export const DOSSIER = [
  { id: 'deip', icon: '🖥️', t: 'Disfunção Erétil Induzida por Pornografia (DEIP)', pts: [
    ['Explicação', 'Perda de ereção com parceira real, mantendo resposta erétil apenas diante de telas.'],
    ['Mecanismo', 'Habituação e escalada do estímulo (necessidade de conteúdos cada vez mais exóticos e rápidos).'],
    ['Evidência Científica', 'Estudo aponta que a taxa de disfunção erétil em homens que preferem masturbação com pornografia atinge 78%, contra 22% dos que preferem o sexo real.', 'Ref: Begovic, 2019; Park et al., 2016'],
  ]},
  { id: 'brain', icon: '🧠', t: 'Remodelamento Frontoestriatal (Danos Cerebrais)', pts: [
    ['Atrofia Cerebral', 'Estudos de neuroimagem do Instituto Max Planck revelam diminuição de massa cinzenta no estriado direito (núcleo caudado).', 'Ref: Kühn & Gallinat, 2014'],
    ['Dessensibilização de Dopamina', 'Menor reatividade no putâmen, gerando tolerância neuroquímica e anedonia (perda do prazer no dia a dia).'],
    ['Perda do Autocontrole', 'Enfraquecimento da conexão com o córtex pré-frontal, destruindo o controle de impulsos e a força de vontade.'],
  ]},
  { id: 'grip', icon: '✋', t: 'Sensibilidade Periférica & Síndrome do Death Grip', pts: [
    ['O que é', 'Lesão e dessensibilização causadas por força mecânica excessiva, alta velocidade ou atrito sem lubrificação adequada.'],
    ['Consequência', 'Elevação do limiar de sensibilidade dos receptores penianos, resultando em ejaculação retardada, anorgasmia com parceira ou parestesia (sensação de dormência genital).', 'Ref: ISSM — International Society for Sexual Medicine'],
  ]},
  { id: 'pelvic', icon: '💥', t: 'Hipertonia Pélvica por Masturbação Compulsiva', pts: [
    ['Causa', 'Prática de masturbação prolongada sob estímulo de pornografia, onde o indivíduo mantém a musculatura do assoalho pélvico sob tensão e contração ansiosa contínua por horas.'],
    ['⚠ NOTA DE RETENÇÃO SEMINAL', 'Esta condição NÃO se aplica à Retenção Seminal Consciente. Na prática da Retenção Seminal e Transmutação, o homem aprende a relaxar a musculatura pélvica e canalizar sua energia de forma saudável. O dano muscular ocorre apenas no estado de tensão ansiosa gerado pelo consumo compulsivo de pornografia.', true],
    ['Consequências', 'Espasmos no assoalho pélvico, dores perineais, jato urinário fraco e a "Síndrome do Flácido Rígido" (Hard Flaccid), provocadas pela contração involuntária e prolongada durante o vício visual.', 'Ref: Cleveland Clinic, 2022'],
  ]},
  { id: 'escalation', icon: '🌀', t: 'A Escalada para Conteúdos e Desvios Extremos', pts: [
    ['Mecanismo de Habituação', 'À medida que o cérebro se acostuma com o consumo de conteúdos convencionais, ocorre a tolerância neuroquímica. O indivíduo passa a necessitar de estímulos cada vez mais chocantes, exóticos, tabus ou extremos para obter a mesma carga de dopamina que antes conseguia facilmente.'],
    ['Perda de Freio Inibitório', 'O enfraquecimento do córtex pré-frontal degrada o freio inibitório moral, abrindo caminho para desvios antes considerados inaceitáveis.'],
  ]},
  { id: 'social', icon: '🕳️', t: 'Erosão Social, Moral e Conjugal', pts: [
    ['Dissonância Moral', 'Culpa crônica, vergonha secreta e ansiedade social corroem a autoimagem e a presença no mundo real.'],
    ['Esquiva da Intimidade', 'Afastamento conjugal, isolamento e substituição do vínculo real pelo estímulo solitário de tela.'],
  ]},
];
export const DOSSIER_TABLE = [
  ['Função Erétil', 'DEIP', 'Falha com parceira real / Ereção só na tela'],
  ['Cérebro', 'Remodelamento Frontoestriatal', 'Anedonia, falta de foco e atrofia no núcleo caudado'],
  ['Sensibilidade', 'Death Grip', 'Dormência genital e ejaculação retardada'],
  ['Músculo Pélvico', 'Hard Flaccid / Hipertonia', 'Dor perineal e pênis retraído/frio em repouso'],
  ['Saúde Mental', 'Dissonância Moral', 'Culpa crônica, vergonha e ansiedade social'],
  ['Relações', 'Esquiva da Intimidade', 'Afastamento conjugal e isolamento social'],
];

export const I18N = {
  pt: { qg: 'QG DO GUERREIRO', forge: 'A FORJA', ops: 'PROJETOS & TAREFAS', journal: 'DIÁRIO DE BORDO', stats: 'RELATÓRIOS DE COMBATE', enemy: 'O INIMIGO REVELADO', settings: 'CONFIGURAÇÕES',
    nav_qg: 'QG', nav_forge: 'Forja', nav_ops: 'Missões', nav_journal: 'Diário', nav_stats: 'Dados', nav_enemy: 'Inimigo', nav_settings: 'Ajustes',
    code: 'CÓDIGO DO GUERREIRO', swap: '🔄 Trocar Frase', days: 'DIAS EM RETENÇÃO SEMINAL', daysClean: 'DIAS LIMPIOS DE VÍCIO', purity: 'PUREZA', hours: 'SALVAS NESTE CICLO',
    tier: 'NÍVEL DA FORJA', checkin: 'REGISTRO DIÁRIO DE COMBATE', c1: 'Não assisti pornografia', c2: 'Não me masturbei', c3: 'Mantive a retenção (Sem ejaculação)',
    fail: '🔴 FALHEI / CAÍ', forgeToday: 'A FORJA HOJE', tasksToday: 'OPERAÇÕES DO DIA', sos_t: 'PROTOCOLO DE INTERVENÇÃO DE EMERGÊNCIA' },
  en: { qg: 'WARRIOR HQ', forge: 'THE FORGE', ops: 'PROJECTS & TASKS', journal: 'SHIP LOG', stats: 'COMBAT REPORTS', enemy: 'THE ENEMY REVEALED', settings: 'SETTINGS',
    nav_qg: 'HQ', nav_forge: 'Forge', nav_ops: 'Missions', nav_journal: 'Journal', nav_stats: 'Data', nav_enemy: 'Enemy', nav_settings: 'Setup',
    code: 'WARRIOR CODE', swap: '🔄 Swap Phrase', days: 'DAYS OF SEMINAL RETENTION', daysClean: 'DAYS CLEAN FROM ADDICTION', purity: 'PURITY', hours: 'SAVED THIS CYCLE',
    tier: 'FORGE LEVEL', checkin: 'DAILY COMBAT LOG', c1: 'No pornography today', c2: 'No masturbation today', c3: 'Retention held (No ejaculation)',
    fail: '🔴 I FELL', forgeToday: 'THE FORGE TODAY', tasksToday: "TODAY'S OPS", sos_t: 'EMERGENCY INTERVENTION PROTOCOL' },
  es: { qg: 'QG DEL GUERRERO', forge: 'LA FORJA', ops: 'PROYECTOS & TAREAS', journal: 'DIARIO DE A BORDO', stats: 'INFORMES DE COMBATE', enemy: 'EL ENEMIGO REVELADO', settings: 'AJUSTES',
    nav_qg: 'QG', nav_forge: 'Forja', nav_ops: 'Misiones', nav_journal: 'Diario', nav_stats: 'Datos', nav_enemy: 'Enemigo', nav_settings: 'Ajustes',
    code: 'CÓDIGO DEL GUERRERO', swap: '🔄 Cambiar Frase', days: 'DÍAS DE RETENCIÓN SEMINAL', daysClean: 'DÍAS LIMPIOS DE ADICCIÓN', purity: 'PUREZA', hours: 'AHORRADAS EN ESTE CICLO',
    tier: 'NIVEL DE LA FORJA', checkin: 'REGISTRO DIARIO DE COMBATE', c1: 'No vi pornografía', c2: 'No me masturbé', c3: 'Mantuve la retención (Sin eyaculación)',
    fail: '🔴 FALLÉ', forgeToday: 'LA FORJA HOY', tasksToday: 'OPERACIONES DEL DÍA', sos_t: 'PROTOCOLO DE INTERVENCIÓN DE EMERGENCIA' },
};

export const SOS_PHRASES = [
  'NÃO TROQUE O SEU IMPÉRIO POR 5 SEGUNDOS DE PRAZER!',
  'VOCÊ É O COMANDANTE DESSA MENTE. RESISTA!',
  'A DOR DA DISCIPLINA É MENOR QUE A DOR DO ARREPENDIMENTO!',
  'SAIA DO TRANSE AGORA, VOCÊ É MAIS FORTE QUE ISSO!',
  'O IMPULSO É PASSAGEIRO. A HONRA É PERMANENTE!',
  'NÃO NEGOCIE COM A SUA FRAQUEZA. LEVANTE-SE E LUTE!',
];
export const SOS_PHASES = [
  { n: 1, secs: 60, icon: '🧊', t: 'FASE 1 — CHOQUE TÉRMICO', w: 'MINUTO 0–1', d: 'Água gelada no rosto e pulsos imediatamente.' },
  { n: 2, secs: 120, icon: '🫁', t: 'FASE 2 — RESPIRAÇÃO TÁTICA 4×4', w: 'MINUTOS 1–3', d: 'Puxe o ar em 4s, segure 4s, solte 4s, segure 4s.' },
  { n: 3, secs: 120, icon: '🏋️', t: 'FASE 3 — EXAUSTÃO FÍSICA GERAL', w: 'MINUTOS 3–5', d: '2 min ininterruptos de exercício intenso até a dor física e os batimentos elevados.' },
];
export const SOS_EX = ['💪 Flexões', '⭐ Polichinelos', '🦵 Agachamentos', '🏃 Corrida rápida / no lugar'];
export const SOS_BASE = [0, 60, 180, 300];

export const TABS = [
  ['qg', '🏛️'],
  ['forge', '🔨'],
  ['ops', '🎯'],
  ['journal', '📖'],
  ['stats', '📈'],
  ['enemy', '🛡️'],
  ['library', '📚'],
  ['settings', '⚙️'],
];

/* ============ BIBLIOTECA DO GUERREIRO ============ */
export const LESSONS = [
  { day: 1, t: 'O Inimigo Mora Dentro', x: 'Pornografia não é prazer: é sequestro dopaminérgico. Hoje você não luta contra telas — luta contra o padrão que elas gravaram em você. Nomear o inimigo é o primeiro ato de guerra.' },
  { day: 2, t: 'Dopamina é Moeda', x: 'Cada estímulo supranormal gasta a moeda que compra sua motivação real. Retenção não é privação: é proteger seu capital neuroquímico para o que constrói.' },
  { day: 3, t: 'O Transe e o Despertar', x: 'Recaída começa em transe: rolagem infinita, madrugada, solidão. O protocolo S.O.S existe para quebrar o transe ANTES da decisão — corpo primeiro, mente depois.' },
  { day: 4, t: 'Desconforto é Treino', x: 'Banho gelado, acordar cedo, tarefa difícil primeiro: cada desconforto voluntário é uma repetição de córtex pré-frontal. Quem treina o não pequeno, diz não ao grande.' },
  { day: 5, t: 'Solidão Não é Silêncio', x: 'O vício floresce no isolamento. Escreva no Diário, fale com seu parceiro de responsabilidade. Luz em ambiente escuro muda o ambiente, não a luz.' },
  { day: 6, t: 'Energia Não Some, Transmuta', x: 'Tensão sexual retida é matéria-prima: treino, criação, trabalho profundo. Sem saída fácil, o corpo aprende a construir — essa é a alquimia da retenção.' },
  { day: 7, t: 'A Primeira Bandeira', x: 'Sete dias não curam tudo — provam que você manda. Celebre o patamar, mas não negocie: a próxima bandeira já está içada no horizonte.' },
  { day: 8, t: 'Gatilhos Têm Endereço', x: 'Tédio, ansiedade, madrugada, redes: mapeie onde o inimigo ataca (seu Mapa de Risco). Defesa sem mapa é sorte; com mapa, é estratégia.' },
  { day: 10, t: 'A Regra dos 3 Segundos', x: 'Entre gatilho e ação existe uma fresta. Respiração 4×4 alarga essa fresta até caber a sua escolha inteira. Meditação é treino de mira nessa fresta.' },
  { day: 12, t: 'Corpo é Cadinho', x: 'Sono, sol, força, água: sem base fisiológica, disciplina vira força de vontade rasa. Cuide do cadinho antes de exigir ouro dele.' },
  { day: 14, t: 'Queda é Dado, Não Sentença', x: 'Se cair: registre, extraia gatilhos, execute o protocolo de retomada. Vergonha esconde o dado; honestidade o converte em defesa nova.' },
  { day: 16, t: 'Ambiente Vence Intenção', x: 'Celular fora do quarto, redes limpas, porta aberta: arquitete o ambiente para o seu eu fraco não precisar decidir. Herói de ambiente fácil vence todo dia.' },
  { day: 18, t: 'Tédio é Portão', x: 'Cérebro desintoxicando reclama de tédio. Atravesse: do tédio nasce criatividade, reflexão e desejo real. Fugir do tédio é voltar para a jaula.' },
  { day: 21, t: 'Hábito Vira Identidade', x: 'Aos 21 dias você não "está tentando": você É quem não assiste. Identidade protege mais que motivação — porque trair ela é trair a si.' },
  { day: 25, t: 'A Plansície', x: 'Depois da lua de mel, vem a planície: dias sem aplauso e sem crise. É nela que se forja a constância — vença o dia sem espetáculo.' },
  { day: 30, t: 'Olho no Espelho Certo', x: 'Não meça só dias: meça sono, treino, humor, presença. Retenção é a raiz; a árvore é a vida que volta a crescer em volta dela.' },
  { day: 35, t: 'Intimidade Real', x: 'Para comprometidos: energia retida é presença para quem está do lado. Olho no olho, toque sem tela — reconecte desejo a vínculo.' },
  { day: 40, t: 'O Custo do Atalho', x: 'Um "só hoje" custa o dobro: o ato + a prova interna de que sua palavra falha. Prefira a dor curta da recusa à dor longa da desconfiança de si.' },
  { day: 45, t: 'Reorganização Profunda', x: 'Nesta fase o cérebro repondera receptores: prazeres pequenos voltam a ter gosto. Note e anote no Diário o que voltou a ser gostoso sem tela.' },
  { day: 60, t: 'Mentor Also Bleeds', x: 'Ao ajudar outro guerreiro (Salão da Fama, parceiro), você reforça sua própria trincheira. Ensino é a repetição mais forte do padrão novo.' },
  { day: 90, t: 'Reset Completo, Guerra Contínua', x: 'Noventa dias reparam o baseline — não aposentam o sentinela. O veterano não luta pior: luta calmo. Mantenha protocolo, mantenha forja.' },
];
export const READINGS = [
  { a: 'Marco Aurélio', w: 'Meditações, II.1', q: 'Ao amanhecer, quando te custar acordar, tem presente isto: desperto para trabalhar como homem.', r: 'Qual é o seu "trabalho de homem" hoje — a tarefa que o vício te faria adiar?' },
  { a: 'Marco Aurélio', w: 'Meditações, V.11', q: 'Em toda ação, pergunta-te: o que tenho a temer deste ato? A morte me levará antes da resposta.', r: 'O impulso passa; a pergunta fica. O que você temeria lembrar deste ato amanhã?' },
  { a: 'Epicteto', w: 'Manual, X', q: 'Sobre tudo o que te aflige, lembra-te de dizer: isto é prova, não desgraça; suporta-a bem e sairás mais forte.', r: 'Qual desejo de hoje é, na verdade, uma prova disfarçada de treinamento?' },
  { a: 'Epicteto', w: 'Manual, XLI', q: 'É sinal de índole fraca ocupar-se muito do corpo; o homem de valor ocupa-se da alma.', r: 'Onde você investiu hoje: no corpo-espelho ou no corpo-instrumento da alma?' },
  { a: 'Sêneca', w: 'Cartas a Lucílio, II', q: 'Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.', r: 'Qual conversa, corte ou limpeza de rede você ainda não ousou fazer?' },
  { a: 'Sêneca', w: 'Da Tranquilidade da Alma, II', q: 'O espírito que nada combate torna-se pesado e sufoca em si mesmo.', r: 'Que desconforto voluntário você pode agendar hoje para o espírito não sufocar?' },
  { a: 'Musônio Rufo', w: 'Diatribes, VI', q: 'Treina-te a suportar o frio, o calor, a sede, a fome: assim a razão se torna senhora dos impulsos.', r: 'Qual dos quatro você treinou esta semana — e qual evitou?' },
  { a: 'Marco Aurélio', w: 'Meditações, VIII.47', q: 'Apaga a imaginação, detém o impulso, extingue o desejo: e a alma recolhe-se à sua cidadela.', r: 'Qual é a sua cidadela interior de 5 minutos quando o cerco aperta?' },
];
export const HALL_ADJ = ['Firme', 'Calado', 'DeFerro', 'DaMadrugada', 'Inquebrável', 'Sóbrio', 'DeAço', 'Vigilante', 'SemTrégua', 'DeHonra'];
export const HALL_NOUN = ['Lobo', 'Falcão', 'Carvalho', 'Martelo', 'Escudo', 'Farol', 'Javali', 'Corvo', 'Leão', 'Bastião'];
export const genHallName = () =>
  'Guerreiro' + HALL_ADJ[Math.floor(Math.random() * HALL_ADJ.length)] + HALL_NOUN[Math.floor(Math.random() * HALL_NOUN.length)] + Math.floor(10 + Math.random() * 89);
