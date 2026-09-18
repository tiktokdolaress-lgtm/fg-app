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
    fail: '🔴 FALHEI / CAÍ', forgeToday: 'A FORJA HOJE', tasksToday: 'OPERAÇÕES DO DIA', sos_t: 'PROTOCOLO DE INTERVENÇÃO DE EMERGÊNCIA' , hj: 'HOJE', j_prev: '◀ DIA ANTERIOR', j_next: 'PRÓXIMO DIA ▶', j_fall: '⚠ QUEDA REGISTRADA', j_mood: 'HUMOR DO DIA', j_good: 'VITÓRIAS / O QUE DEU CERTO', j_ch: 'DESAFIOS / O QUE TRAVOU', j_vent: 'DESABAFO (OPCIONAL)', j_save: 'SALVAR REGISTRO DO DIA', j_hist: '📜 ÚLTIMOS 10 REGISTROS', j_empty: 'Nenhum registro ainda. A guerra começa hoje.', j_notes: '🧠 CADERNO DE NOTAS DE CAMPO', j_ph: 'Escreva uma nota de campo...', j_search: 'Buscar nas notas...', j_cancel: 'CANCELAR EDIÇÃO', j_add: 'ADICIONAR NOTA', j_saveedit: 'SALVAR ALTERAÇÃO', j_edit_t: 'Editar nota', j_del_t: 'Excluir', j_del_q: 'EXCLUIR NOTA?', j_del_m: 'será apagada do caderno de campo.', j_del_ok: '🗑 Nota excluída.', j_upd: '💾 Nota atualizada com sucesso.', j_new: '🧠 Nota registrada.', j_write: '⚠ Escreva a nota.', j_queda: '⚠ QUEDA:', j_gat: '🎯 Gatilhos:', j_desab: '🖋 Desabafo:',
    mood_Forte: 'Forte', mood_Estável: 'Estável', mood_Ansioso: 'Ansioso', mood_Vulnerável: 'Vulnerable',
    j_nempty: 'Nenhuma nota ainda. O caderno de campo está pronto.',
    nt1: '💡 Negócios', nt2: '📜 Princípios', nt3: '📚 Aprendizado', nt4: '🧠 Reflexão',
    fall_porn: 'Pornografia', fall_mast: 'Masturbação', fall_ejac: 'Ejaculação',
    brand1: 'REGISTRO PESSOAL', brand2: 'RETENÇÃO • DISCIPLINA', adj: 'Ajustes', dret: 'DIAS EM RETENÇÃO',
    fail_t: 'REGISTRAR QUEDA', fail_d: 'Sem julgamento — o registro honesto é a base da retomada.', fail_sel: 'Marque o que aconteceu:', fail_ok: 'CONFIRMAR REGISTRO', fall_t: '⚔ QUEDA REGISTRADA', fall_trig: 'GATILHOS DO MOMENTO', fall_vent: 'DESABAFO (OPCIONAL)', fall_save: '💾 SALVAR NO DIÁRIO', fall_no: 'AGORA NÃO', st_f: 'QUEDA', st_v: 'VITÓRIA', st_p: 'PARCIAL', st_n: 'SEM REGISTRO', de_t: 'REGISTRO DO DIA', de_estado: 'Estado:', de_hint: 'Toque nos pilares para ajustar.', de_fechar: 'FECHAR', b_f: 'MARCAR QUEDA', b_c: 'LIMPAR DIA', vic_t: 'VITÓRIA,', vic_2: 'Todos os pilares do dia cumpridos no Modo Sexo Real Consciente', vic_3: 'Os 3 pilares do dia cumpridos', vic_x: 'Contadores recalculados.', vic_b: 'VOLTAR AO QG', hporn: 'DIAS SEM PORNOGRAFIA', hmast: 'DIAS SEM MASTURBAÇÃO', hstreak: 'SEQUÊNCIA ATUAL', hsos: 'S.O.S VENCIDAS', retro: 'Modo retroativo: ajuste registros de dias anteriores.', tl_v: 'Vitória', tl_p: 'Parcial', tl_f: 'Queda', tl_n: 'Sem registro', tl_hint: 'Toque em um dia para editar o registro.', lvl_a: 'Faltam ', lvl_b: ' para o patamar ', lvl_max: '🐉 Patamar máximo alcançado — LENDA', phrase_n: 'FRASE ', phrase_of: ' DE ', prog: 'PROGRESSO DE GUERRA', prog_aura: 'PROGRESSO DE GUERRA · 👑 AURA DOURADA ATIVA', titan: 'Insígnia de Titânio · Lenda', goal_done: '🏁 Primeira conquista alcançada: ', goal_next: '🎯 Primeira conquista: ', goal_in: ' em ', goal_days: ' dias (faltam ', goal_close: ')', reward_l: '🎁 Recompensa do patamar: ', two_pil: ' · 2 PILARES', prev_d: '◄ Dia Anterior', today_b: '📅 HOJE', next_d: 'Próximo Dia ►', editing_r: '✏️ Editando registro de ', pend_w: ' pendentes', of_w: ' de ', ef1: 'Nenhum hábito ativo.', ef2: 'Ative seus hábitos de elite em ', forge_b: 'A Forja', goforge: 'IR PARA A FORJA 🔨', eo1: 'Nenhuma operação pendente hoje. Adicione tarefas em ', ops_b: 'Projetos & Tarefas', tlt: '📅 LINHA DO TEMPO — VITÓRIAS × QUEDAS', daysuf: ' DIAS', winsw: ' vitória(s)', fallsw: ' queda(s)', partw: ' parcial(is)', ratew: '% aproveitamento', sosw: ' S.O.S vencida(s)', lastw: 'Última vitória: ', atw: ' às ', nosos: 'Nenhuma intervenção registrada', taped: ' — toque para editar', recvit: ' registrado como VITÓRIA. Contadores recalculados.', modeA_note: '💍 No Modo Sexo Real Consciente, ejaculação com a parceira NÃO é contada como falha.', honest: 'O registro honesto é o primeiro passo da retomada.', nothing: '⚠ Nada registrado.', retom: 'PROTOCOLO DE RETOMADA:', r1: '1. Saia do ambiente do gatilho AGORA.', r2: '2. Água gelada no rosto e pulsos.', r3: '3. 20 flexões ou caminhada de 10 minutos.', r4: '4. Registre abaixo gatilhos e desabafo — vai direto para o Diário.', r5: '5. Uma queda não apaga a guerra. Amanhã você volta mais forte.', ventph: 'Desabafe aqui, guerreiro. Sem vergonha. Só verdade...', savedj: '💾 Registrado no Diário. Levante-se, guerreiro.', dayw: ' dias', purw: 'pureza', lblp: '🖥️ Consumi pornografia ', lblm: '✋ Masturbação (sem ejaculação) ', lble: '💥 Ejaculação (quebra de retenção) ', penp: '−12 pureza', penm: '−10 pureza', pene: '−18 · reinicia contador', warrior_w: 'GUERREIRO', cancel_btn: 'Cancelar', yes_del: 'SIM, EXCLUIR', irr: 'Esta ação é irreversível.', synced: '☁️ Dados sincronizados da nuvem', title_full: 'FORJANDO GUERREIROS ⚔ Retenção & Disciplina', title_disc: 'FG Diário', brandMain: 'DIÁRIO', nh_body: 'Hora do hábito na Forja. Conclua e marque no QG.', nh_word: 'Hábito', nc_title: '⚔ Check-in de hoje', nc_body: 'Você ainda não registrou seus pilares hoje. A forja espera por você.' },
  en: { qg: 'WARRIOR HQ', forge: 'THE FORGE', ops: 'PROJECTS & TASKS', journal: 'SHIP LOG', stats: 'COMBAT REPORTS', enemy: 'THE ENEMY REVEALED', settings: 'SETTINGS',
    nav_qg: 'HQ', nav_forge: 'Forge', nav_ops: 'Missions', nav_journal: 'Journal', nav_stats: 'Data', nav_enemy: 'Enemy', nav_settings: 'Setup',
    code: 'WARRIOR CODE', swap: '🔄 Swap Phrase', days: 'DAYS OF SEMINAL RETENTION', daysClean: 'DAYS CLEAN FROM ADDICTION', purity: 'PURITY', hours: 'SAVED THIS CYCLE',
    tier: 'FORGE LEVEL', checkin: 'DAILY COMBAT LOG', c1: 'No pornography today', c2: 'No masturbation today', c3: 'Retention held (No ejaculation)',
    fail: '🔴 I FELL', forgeToday: 'THE FORGE TODAY', tasksToday: "TODAY'S OPS", sos_t: 'EMERGENCY INTERVENTION PROTOCOL' , hj: 'TODAY', j_prev: '◀ PREVIOUS DAY', j_next: 'NEXT DAY ▶', j_fall: '⚠ RECORDED FALL', j_mood: 'MOOD OF THE DAY', j_good: 'WINS / WHAT WENT RIGHT', j_ch: 'CHALLENGES / WHAT STALLED', j_vent: 'VENTING (OPTIONAL)', j_save: 'SAVE DAILY LOG', j_hist: '📜 LAST 10 LOGS', j_empty: 'No logs yet. The war starts today.', j_notes: '🧠 FIELD NOTES PAD', j_ph: 'Write a field note...', j_search: 'Search notes...', j_cancel: 'CANCEL EDIT', j_add: 'ADD NOTE', j_saveedit: 'SAVE CHANGE', j_edit_t: 'Edit note', j_del_t: 'Delete', j_del_q: 'DELETE NOTE?', j_del_m: 'will be erased from the field notes.', j_del_ok: '🗑 Note deleted.', j_upd: '💾 Note updated successfully.', j_new: '🧠 Note logged.', j_write: '⚠ Write the note.', j_queda: '⚠ FALL:', j_gat: '🎯 Triggers:', j_desab: '🖋 Venting:',
    mood_Forte: 'Strong', mood_Estável: 'Stable', mood_Ansioso: 'Anxious', mood_Vulnerável: 'Vulnerable',
    j_nempty: 'No notes yet. The field pad is ready.',
    nt1: '💡 Business', nt2: '📜 Principles', nt3: '📚 Learning', nt4: '🧠 Reflection',
    fall_porn: 'Pornography', fall_mast: 'Masturbation', fall_ejac: 'Ejaculation',
    brand1: 'PERSONAL LOG', brand2: 'RETENTION • DISCIPLINE', adj: 'Settings', dret: 'DAYS IN RETENTION',
    fail_t: 'REGISTER A FALL', fail_d: 'No judgment — honest logging is the foundation of the comeback.', fail_sel: 'Mark what happened:', fail_ok: 'CONFIRM LOG', fall_t: '⚔ FALL LOGGED', fall_trig: 'TRIGGERS OF THE MOMENT', fall_vent: 'VENTING (OPTIONAL)', fall_save: '💾 SAVE TO JOURNAL', fall_no: 'NOT NOW', st_f: 'FALL', st_v: 'VICTORY', st_p: 'PARTIAL', st_n: 'NO LOG', de_t: 'DAY LOG', de_estado: 'Status:', de_hint: 'Tap the pillars to adjust.', de_fechar: 'CLOSE', b_f: 'MARK FALL', b_c: 'CLEAR DAY', vic_t: 'VICTORY,', vic_2: 'All pillars of the day fulfilled in Conscious Real Sex Mode', vic_3: 'All 3 pillars of the day fulfilled', vic_x: 'Counters recalculated.', vic_b: 'BACK TO HQ', hporn: 'DAYS PORN-FREE', hmast: 'DAYS WITHOUT MASTURBATION', hstreak: 'CURRENT STREAK', hsos: 'S.O.S WINS', retro: 'Retro mode: adjust logs from previous days.', tl_v: 'Victory', tl_p: 'Partial', tl_f: 'Fall', tl_n: 'No log', tl_hint: 'Tap a day to edit its log.', lvl_a: 'Only ', lvl_b: ' left for tier ', lvl_max: '🐉 Maximum tier reached — LEGEND', phrase_n: 'PHRASE ', phrase_of: ' OF ', prog: 'WAR PROGRESS', prog_aura: 'WAR PROGRESS · 👑 GOLDEN AURA ACTIVE', titan: 'Titanium Insignia · Legend', goal_done: '🏁 First achievement reached: ', goal_next: '🎯 First achievement: ', goal_in: ' in ', goal_days: ' days (', goal_close: ' left)', reward_l: '🎁 Tier reward: ', two_pil: ' · 2 PILLARS', prev_d: '◄ Previous Day', today_b: '📅 TODAY', next_d: 'Next Day ►', editing_r: '✏️ Editing log of ', pend_w: ' pending', of_w: ' of ', ef1: 'No active habits.', ef2: 'Activate your elite habits in ', forge_b: 'The Forge', goforge: 'GO TO THE FORGE 🔨', eo1: 'No operations pending today. Add tasks in ', ops_b: 'Projects & Tasks', tlt: '📅 TIMELINE — VICTORIES × FALLS', daysuf: ' DAYS', winsw: ' win(s)', fallsw: ' fall(s)', partw: ' partial(s)', ratew: '% success rate', sosw: ' S.O.S win(s)', lastw: 'Last victory: ', atw: ' at ', nosos: 'No interventions logged', taped: ' — tap to edit', recvit: ' logged as VICTORY. Counters recalculated.', modeA_note: '💍 In Conscious Real Sex Mode, ejaculation with your partner is NOT counted as a fall.', honest: 'Honest logging is the first step of the comeback.', nothing: '⚠ Nothing logged.', retom: 'RECOVERY PROTOCOL:', r1: '1. Leave the trigger environment NOW.', r2: '2. Ice-cold water on face and wrists.', r3: '3. 20 push-ups or a 10-minute walk.', r4: '4. Log triggers and venting below — it goes straight to the Journal.', r5: '5. One fall does not erase the war. Tomorrow you come back stronger.', ventph: 'Vent here, warrior. No shame. Only truth...', savedj: '💾 Logged in the Journal. Rise, warrior.', dayw: ' days', purw: 'purity', lblp: '🖥️ Watched pornography ', lblm: '✋ Masturbation (no ejaculation) ', lble: '💥 Ejaculation (retention break) ', penp: '−12 purity', penm: '−10 purity', pene: '−18 · resets counter', warrior_w: 'WARRIOR', cancel_btn: 'Cancel', yes_del: 'YES, DELETE', irr: 'This action is irreversible.', synced: '☁️ Data synced from the cloud', title_full: 'FORJANDO GUERREIROS ⚔ Retention & Discipline', title_disc: 'FG Journal', brandMain: 'JOURNAL', nh_body: 'Time for your Forge habit. Complete it and log it in HQ.', nh_word: 'Habit', nc_title: '⚔ Today\'s check-in', nc_body: 'You haven\'t logged your pillars today. The forge awaits you.' },
  es: { qg: 'QG DEL GUERRERO', forge: 'LA FORJA', ops: 'PROYECTOS & TAREAS', journal: 'DIARIO DE A BORDO', stats: 'INFORMES DE COMBATE', enemy: 'EL ENEMIGO REVELADO', settings: 'AJUSTES',
    nav_qg: 'QG', nav_forge: 'Forja', nav_ops: 'Misiones', nav_journal: 'Diario', nav_stats: 'Datos', nav_enemy: 'Enemigo', nav_settings: 'Ajustes',
    code: 'CÓDIGO DEL GUERRERO', swap: '🔄 Cambiar Frase', days: 'DÍAS DE RETENCIÓN SEMINAL', daysClean: 'DÍAS LIMPIOS DE ADICCIÓN', purity: 'PUREZA', hours: 'AHORRADAS EN ESTE CICLO',
    tier: 'NIVEL DE LA FORJA', checkin: 'REGISTRO DIARIO DE COMBATE', c1: 'No vi pornografía', c2: 'No me masturbé', c3: 'Mantuve la retención (Sin eyaculación)',
    fail: '🔴 FALLÉ', forgeToday: 'LA FORJA HOY', tasksToday: 'OPERACIONES DEL DÍA', sos_t: 'PROTOCOLO DE INTERVENCIÓN DE EMERGENCIA' , hj: 'HOY', j_prev: '◀ DÍA ANTERIOR', j_next: 'DÍA SIGUIENTE ▶', j_fall: '⚠ CAÍDA REGISTRADA', j_mood: 'HUMOR DEL DÍA', j_good: 'VICTORIAS / LO QUE SALIÓ BIEN', j_ch: 'DESAFÍOS / LO QUE TRABÓ', j_vent: 'DESAHOGO (OPCIONAL)', j_save: 'GUARDAR REGISTRO DEL DÍA', j_hist: '📜 ÚLTIMOS 10 REGISTROS', j_empty: 'Aún no hay registros. La guerra empieza hoy.', j_notes: '🧠 CUADERNO DE NOTAS DE CAMPO', j_ph: 'Escribe una nota de campo...', j_search: 'Buscar en las notas...', j_cancel: 'CANCELAR EDICIÓN', j_add: 'AÑADIR NOTA', j_saveedit: 'GUARDAR CAMBIO', j_edit_t: 'Editar nota', j_del_t: 'Eliminar', j_del_q: '¿ELIMINAR NOTA?', j_del_m: 'será borrada del cuaderno de campo.', j_del_ok: '🗑 Nota eliminada.', j_upd: '💾 Nota actualizada con éxito.', j_new: '🧠 Nota registrada.', j_write: '⚠ Escribe la nota.', j_queda: '⚠ CAÍDA:', j_gat: '🎯 Gatillos:', j_desab: '🖋 Desahogo:',
    mood_Forte: 'Fuerte', mood_Estável: 'Estable', mood_Ansioso: 'Ansioso', mood_Vulnerável: 'Vulnerable',
    j_nempty: 'Aún no hay notas. El cuaderno de campo está listo.',
    nt1: '💡 Negocios', nt2: '📜 Principios', nt3: '📚 Aprendizaje', nt4: '🧠 Reflexión',
    fall_porn: 'Pornografía', fall_mast: 'Masturbación', fall_ejac: 'Eyaculación',
    brand1: 'REGISTRO PERSONAL', brand2: 'RETENCIÓN • DISCIPLINA', adj: 'Ajustes', dret: 'DÍAS EN RETENCIÓN',
    fail_t: 'REGISTRAR CAÍDA', fail_d: 'Sin juicio — el registro honesto es la base de la recuperación.', fail_sel: 'Marca lo que pasó:', fail_ok: 'CONFIRMAR REGISTRO', fall_t: '⚔ CAÍDA REGISTRADA', fall_trig: 'GATILLOS DEL MOMENTO', fall_vent: 'DESAHOGO (OPCIONAL)', fall_save: '💾 GUARDAR EN EL DIARIO', fall_no: 'AHORA NO', st_f: 'CAÍDA', st_v: 'VICTORIA', st_p: 'PARCIAL', st_n: 'SIN REGISTRO', de_t: 'REGISTRO DEL DÍA', de_estado: 'Estado:', de_hint: 'Toca los pilares para ajustar.', de_fechar: 'CERRAR', b_f: 'MARCAR CAÍDA', b_c: 'LIMPIAR DÍA', vic_t: '¡VICTORIA,', vic_2: 'Todos los pilares del día cumplidos en el Modo Sexo Real Consciente', vic_3: 'Los 3 pilares del día cumplidos', vic_x: 'Contadores recalculados.', vic_b: 'VOLVER AL QG', hporn: 'DÍAS SIN PORNOGRAFÍA', hmast: 'DÍAS SIN MASTURBACIÓN', hstreak: 'RACHA ACTUAL', hsos: 'S.O.S VENCIDAS', retro: 'Modo retroactivo: ajusta registros de días anteriores.', tl_v: 'Victoria', tl_p: 'Parcial', tl_f: 'Caída', tl_n: 'Sin registro', tl_hint: 'Toca un día para editar el registro.', lvl_a: 'Faltan ', lvl_b: ' para el patamar ', lvl_max: '🐉 Patamar máximo alcanzado — LEYENDA', phrase_n: 'FRASE ', phrase_of: ' DE ', prog: 'PROGRESO DE GUERRA', prog_aura: 'PROGRESO DE GUERRA · 👑 AURA DORADA ACTIVA', titan: 'Insignia de Titanio · Leyenda', goal_done: '🏁 Primera conquista alcanzada: ', goal_next: '🎯 Primera conquista: ', goal_in: ' en ', goal_days: ' días (faltam ', goal_close: ')', reward_l: '🎁 Recompensa del patamar: ', two_pil: ' · 2 PILARES', prev_d: '◄ Día Anterior', today_b: '📅 HOY', next_d: 'Día Siguiente ►', editing_r: '✏️ Editando registro de ', pend_w: ' pendientes', of_w: ' de ', ef1: 'Ningún hábito activo.', ef2: 'Activa tus hábitos de élite en ', forge_b: 'La Forja', goforge: 'IR A LA FORJA 🔨', eo1: 'Ninguna operación pendiente hoy. Añade tareas en ', ops_b: 'Proyectos & Tareas', tlt: '📅 LÍNEA DE TIEMPO — VICTORIAS × CAÍDAS', daysuf: ' DÍAS', winsw: ' victoria(s)', fallsw: ' caída(s)', partw: ' parcial(es)', ratew: '% de rendimiento', sosw: ' S.O.S vencida(s)', lastw: 'Última victoria: ', atw: ' a las ', nosos: 'Ninguna intervención registrada', taped: ' — toca para editar', recvit: ' registrado como VICTORIA. Contadores recalculados.', modeA_note: '💍 En el Modo Sexo Real Consciente, la eyaculación con la pareja NO cuenta como caída.', honest: 'El registro honesto es el primer paso de la recuperación.', nothing: '⚠ Nada registrado.', retom: 'PROTOCOLO DE RECUPERACIÓN:', r1: '1. Sal del entorno del gatillo AHORA.', r2: '2. Agua fría en la cara y las muñecas.', r3: '3. 20 flexiones o una caminata de 10 minutos.', r4: '4. Registra abajo gatillos e desahogo — va directo al Diario.', r5: '5. Una caída no borra la guerra. Mañana vuelves más fuerte.', ventph: 'Desahógate aquí, guerrero. Sin vergüenza. Solo verdad...', savedj: '💾 Registrado en el Diario. Levántate, guerrero.', dayw: ' días', purw: 'pureza', lblp: '🖥️ Vi pornografía ', lblm: '✋ Masturbación (sin eyaculación) ', lble: '💥 Eyaculación (rompe la retención) ', penp: '−12 pureza', penm: '−10 pureza', pene: '−18 · reinicia contador', warrior_w: 'GUERRERO', cancel_btn: 'Cancelar', yes_del: 'SÍ, ELIMINAR', irr: 'Esta acción es irreversible.', synced: '☁️ Datos sincronizados de la nube', title_full: 'FORJANDO GUERREIROS ⚔ Retención y Disciplina', title_disc: 'FG Diario', brandMain: 'DIARIO', nh_body: 'Hora del hábito en la Forja. Complétalo y márcalo en el QG.', nh_word: 'Hábito', nc_title: '⚔ Check-in de hoy', nc_body: 'Aún no registraste tus pilares hoy. La forja te espera.' },
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
  ['settings', '⚙️'],
];

export const HALL_ADJ = ['Firme', 'Calado', 'DeFerro', 'DaMadrugada', 'Inquebrável', 'Sóbrio', 'DeAço', 'Vigilante', 'SemTrégua', 'DeHonra'];
export const HALL_NOUN = ['Lobo', 'Falcão', 'Carvalho', 'Martelo', 'Escudo', 'Farol', 'Javali', 'Corvo', 'Leão', 'Bastião'];
export const genHallName = () =>
  'Guerreiro' + HALL_ADJ[Math.floor(Math.random() * HALL_ADJ.length)] + HALL_NOUN[Math.floor(Math.random() * HALL_NOUN.length)] + Math.floor(10 + Math.random() * 89);
