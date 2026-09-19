'use client';
import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle, Edit3, ChevronRight, Target, Flame } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

const I18N = {
  tabTasks: { pt: '🎯 TAREFAS & OPERAÇÕES', en: '🎯 TASKS & OPERATIONS', es: '🎯 TAREAS Y OPERACIONES' },
  tabProjects: { pt: '🏛️ PROJETOS ESTRATÉGICOS', en: '🏛️ STRATEGIC PROJECTS', es: '🏛️ PROYECTOS ESTRATÉGICOS' },
  newTask: { pt: 'NOVA OPERAÇÃO', en: 'NEW OPERATION', es: 'NUEVA OPERACIÓN' },
  newProject: { pt: 'NOVO PROJETO', en: 'NEW PROJECT', es: 'NUEVO PROYECTO' },
  taskPh: { pt: 'Ex: Treino de pernas, ler 10 págs...', en: 'Ex: Leg day, read 10 pages...', es: 'Ej: Entrenar piernas, leer 10 págs...' },
  projectPh: { pt: 'Ex: Lançamento do Negócio, Carteira de Motorista...', en: 'Ex: Business Launch, Driver\'s License...', es: 'Ej: Lanzamiento de Negocio...' },
  priority: { pt: 'Prioridade', en: 'Priority', es: 'Prioridad' },
  priHigh: { pt: 'Alta (Guerra)', en: 'High (War)', es: 'Alta (Guerra)' },
  priMed: { pt: 'Média', en: 'Medium', es: 'Media' },
  priLow: { pt: 'Baixa', en: 'Low', es: 'Baja' },
  time: { pt: 'Horário (Opcional)', en: 'Time (Optional)', es: 'Horario (Opcional)' },
  repeat: { pt: 'Frequência', en: 'Frequency', es: 'Frecuencia' },
  repOnce: { pt: 'Única', en: 'Once', es: 'Única' },
  repDaily: { pt: 'Diária', en: 'Daily', es: 'Diaria' },
  addBtn: { pt: '+ CRIAR OPERAÇÃO', en: '+ CREATE OPERATION', es: '+ CREAR OPERACIÓN' },
  addProjBtn: { pt: '+ CRIAR PROJETO', en: '+ CREATE PROJECT', es: '+ CREAR PROYECTO' },
  filterAll: { pt: 'Todas', en: 'All', es: 'Todas' },
  filterToday: { pt: 'Para Hoje', en: 'For Today', es: 'Para Hoy' },
  filterDone: { pt: 'Concluídas', en: 'Completed', es: 'Completadas' },
  progress: { pt: 'Progresso do Dia', en: 'Today\'s Progress', es: 'Progreso del Día' },
  noTasks: { pt: 'Nenhuma operação nesta categoria.', en: 'No operations in this category.', es: 'Ninguna operación en esta categoría.' },
  noProjects: { pt: 'Nenhum projeto em andamento. Crie sua primeira grande missão!', en: 'No active projects. Forge your first big mission!', es: 'Sin proyectos activos. ¡Forja tu primera gran misión!' },
};

export default function OpsView() {
  const { S, update, toast, openModal, closeModal } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [activeMainTab, setActiveMainTab] = useState('tasks'); // 'tasks' ou 'projects'
  const [taskTxt, setTaskTxt] = useState('');
  const [pri, setPri] = useState('media');
  const [time, setTime] = useState('');
  const [rep, setRep] = useState('unica');
  const [selectedProject, setSelectedProject] = useState('');
  const [filter, setFilter] = useState('today');

  const tasks = S.tasks || [];
  const projects = S.projects || [];
  const todayTasks = tasks.filter((x) => L.repDue(x, today()));
  const completedToday = todayTasks.filter((x) => L.isDone(x, today())).length;
  const pct = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  /* Criar Tarefa */
  const addTask = (e) => {
    e.preventDefault();
    if (!taskTxt.trim()) return toast('Digite a descrição da operação');
    update((s) => {
      s.tasks = s.tasks || [];
      s.tasks.push({
        id: 'task_' + Date.now(),
        txt: taskTxt.trim(),
        pri,
        time: time || '',
        rep,
        projectId: selectedProject || null,
        done: false,
        doneDates: [],
        createdAt: today(),
      });
    });
    setTaskTxt('');
    setTime('');
    AF.click();
    toast('✅ Operação registrada!');
  };

  /* Toggle Tarefa */
  const toggleTask = (id) => {
    update((s) => {
      const target = (s.tasks || []).find((x) => String(x.id) === String(id));
      if (!target) return;
      if ((target.rep || 'unica') === 'unica') {
        target.done = !target.done;
      } else {
        const dd = today();
        target.doneDates = target.doneDates || [];
        const i = target.doneDates.indexOf(dd);
        if (i >= 0) target.doneDates.splice(i, 1);
        else target.doneDates.push(dd);
      }
    });
    AF.click();
  };

  /* Excluir Tarefa */
  const deleteTask = (id) => {
    update((s) => {
      s.tasks = (s.tasks || []).filter((x) => String(x.id) !== String(id));
    });
    AF.click();
    toast('Operação removida');
  };

  /* Modal Criar Projeto */
  const openCreateProjectModal = () => {
    let pTitle = '', pDesc = '', pDeadline = '';
    const CreateP = () => {
      return (
        <div className="text-center">
          <h3 className="mb-2 font-display text-2xl tracking-wide text-gold">CRIAR PROJETO ESTRATÉGICO</h3>
          <p className="mb-4 text-xs text-muted">Defina uma grande missão de médio/longo prazo para canalizar sua energia.</p>
          <div className="flex flex-col gap-3 text-left">
            <label>
              <span className="lbl">Título da Missão / Projeto:</span>
              <input
                type="text"
                placeholder={tx.projectPh[curLang]}
                className="field"
                defaultValue={pTitle}
                onChange={(e) => (pTitle = e.target.value)}
              />
            </label>
            <label>
              <span className="lbl">Objetivo / Descrição:</span>
              <textarea
                rows={3}
                placeholder="Qual o resultado esperado e por que este projeto é crucial?"
                className="field text-xs resize-none"
                defaultValue={pDesc}
                onChange={(e) => (pDesc = e.target.value)}
              />
            </label>
            <label>
              <span className="lbl">Prazo Limite (Opcional):</span>
              <input
                type="date"
                className="field"
                defaultValue={pDeadline}
                onChange={(e) => (pDeadline = e.target.value)}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="btn-gold flex-1 py-2 font-bold text-xs"
              onClick={() => {
                if (!pTitle.trim()) return toast('Digite o nome do projeto');
                update((s) => {
                  s.projects = s.projects || [];
                  s.projects.push({
                    id: 'proj_' + Date.now(),
                    title: pTitle.trim(),
                    desc: pDesc.trim(),
                    deadline: pDeadline || '',
                    status: 'ativo',
                    steps: [],
                    createdAt: today(),
                  });
                });
                closeModal();
                toast('✅ Projeto Estratégico criado com sucesso!');
              }}
            >
              Criar Projeto
            </button>
            <button className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </div>
      );
    };
    openModal(<CreateP />);
  };

  /* Excluir Projeto */
  const deleteProject = (pId) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto estratégico?')) return;
    update((s) => {
      s.projects = (s.projects || []).filter((p) => String(p.id) !== String(pId));
      s.tasks = (s.tasks || []).map((t) => t.projectId === pId ? { ...t, projectId: null } : t);
    });
    AF.click();
    toast('Projeto removido');
  };

  /* Concluir / Alternar Status do Projeto */
  const toggleProjectStatus = (pId) => {
    update((s) => {
      const p = (s.projects || []).find((x) => String(x.id) === String(pId));
      if (p) {
        p.status = p.status === 'concluido' ? 'ativo' : 'concluido';
      }
    });
    AF.click();
  };

  /* Adicionar Etapa a um Projeto */
  const addStepToProject = (pId, stepTxt) => {
    if (!stepTxt.trim()) return;
    update((s) => {
      const p = (s.projects || []).find((x) => String(x.id) === String(pId));
      if (p) {
        p.steps = p.steps || [];
        p.steps.push({ id: 'step_' + Date.now(), txt: stepTxt.trim(), done: false });
      }
    });
    AF.click();
  };

  /* Toggle Etapa de Projeto */
  const toggleStep = (pId, stepId) => {
    update((s) => {
      const p = (s.projects || []).find((x) => String(x.id) === String(pId));
      if (p && p.steps) {
        const st = p.steps.find((x) => String(x.id) === String(stepId));
        if (st) st.done = !st.done;
      }
    });
    AF.click();
  };

  const displayedTasks = tasks.filter((x) => {
    const isDone = L.isDone(x, today());
    if (filter === 'done') return isDone;
    if (filter === 'today') return L.repDue(x, today()) && !isDone;
    return true;
  });

  return (
    <div className="grid gap-3.5">
      {/* 1. SELETOR DE ABAS PRINCIPAIS: TAREFAS vs PROJETOS */}
      <Card className="border-gold/30 bg-surface2/60 p-2.5 sm:p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMainTab('tasks')}
              className={`text-xs sm:text-sm font-mono font-bold px-3.5 py-2 rounded transition-all flex items-center gap-1.5 ${
                activeMainTab === 'tasks'
                  ? 'bg-gold text-[#141414] shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-line'
              }`}
            >
              <span>{tx.tabTasks[curLang]}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeMainTab === 'tasks' ? 'bg-black/20 text-black' : 'bg-surface2 text-muted'}`}>
                {tasks.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('projects')}
              className={`text-xs sm:text-sm font-mono font-bold px-3.5 py-2 rounded transition-all flex items-center gap-1.5 ${
                activeMainTab === 'projects'
                  ? 'bg-gold text-[#141414] shadow-sm'
                  : 'bg-surface text-muted hover:text-ink border border-line'
              }`}
            >
              <span>{tx.tabProjects[curLang]}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeMainTab === 'projects' ? 'bg-black/20 text-black' : 'bg-surface2 text-muted'}`}>
                {projects.length}
              </span>
            </button>
          </div>

          {/* Botão de Criação de Projeto quando estiver na aba de projetos */}
          {activeMainTab === 'projects' && (
            <button
              type="button"
              onClick={openCreateProjectModal}
              className="btn-gold py-1.5 px-3 text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>{tx.newProject[curLang]}</span>
            </button>
          )}

          {/* Barra de Progresso quando estiver na aba de tarefas */}
          {activeMainTab === 'tasks' && (
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <span className="text-[9.5px] font-mono text-muted uppercase block">{tx.progress[curLang]}</span>
                <b className="text-xs font-mono text-gold">{completedToday}/{todayTasks.length} ({pct}%)</b>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5 font-mono text-[11px] font-bold text-gold">
                {pct}%
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. CONTEÚDO DA ABA SELECIONADA */}
      {activeMainTab === 'tasks' ? (
        /* ABA DE OPERAÇÕES & TAREFAS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          
          {/* Formulário de Criação de Tarefa (5 Colunas no PC) */}
          <div className="lg:col-span-5">
            <Card className="p-3.5 sm:p-4 border-line bg-surface2/80">
              <K className="mb-2">⚡ {tx.newTask[curLang]}</K>
              <form onSubmit={addTask} className="flex flex-col gap-3">
                <div>
                  <span className="lbl mb-1 block">Missão / Descrição:</span>
                  <input
                    type="text"
                    placeholder={tx.taskPh[curLang]}
                    className="field w-full text-xs sm:text-sm"
                    value={taskTxt}
                    onChange={(e) => setTaskTxt(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="lbl mb-1 block">{tx.priority[curLang]}:</span>
                    <select
                      className="field w-full text-xs font-semibold"
                      value={pri}
                      onChange={(e) => setPri(e.target.value)}
                    >
                      <option value="alta" className="text-danger font-bold">🔴 {tx.priHigh[curLang]}</option>
                      <option value="media" className="text-gold font-bold">🟡 {tx.priMed[curLang]}</option>
                      <option value="baixa" className="text-muted font-bold">⚪ {tx.priLow[curLang]}</option>
                    </select>
                  </div>

                  <div>
                    <span className="lbl mb-1 block">{tx.repeat[curLang]}:</span>
                    <select
                      className="field w-full text-xs font-semibold"
                      value={rep}
                      onChange={(e) => setRep(e.target.value)}
                    >
                      <option value="unica">{tx.repOnce[curLang]}</option>
                      <option value="diaria">{tx.repDaily[curLang]}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="lbl mb-1 block">{tx.time[curLang]}:</span>
                    <input
                      type="time"
                      className="field w-full text-xs font-mono"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <span className="lbl mb-1 block">Vincular a Projeto:</span>
                    <select
                      className="field w-full text-xs font-semibold"
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="">(Nenhum / Avulso)</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-2 text-xs font-bold mt-1 shadow-sm"
                >
                  {tx.addBtn[curLang]}
                </button>
              </form>
            </Card>
          </div>

          {/* Lista de Tarefas & Filtros (7 Colunas no PC) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <Card className="p-3.5 sm:p-4">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-line/60">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'today', label: tx.filterToday[curLang], count: todayTasks.filter((x) => !L.isDone(x, today())).length },
                    { id: 'all', label: tx.filterAll[curLang], count: tasks.length },
                    { id: 'done', label: tx.filterDone[curLang], count: tasks.filter((x) => L.isDone(x, today())).length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilter(f.id)}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                        filter === f.id
                          ? 'bg-gold text-[#141414] font-bold shadow-sm'
                          : 'bg-surface2 text-muted hover:text-ink border border-line'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`text-[9.5px] px-1 py-0.2 rounded ${filter === f.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {displayedTasks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {displayedTasks.map((tItem) => {
                    const isDone = L.isDone(tItem, today());
                    const priColor = {
                      alta: 'border-danger/40 bg-danger/5 text-danger',
                      media: 'border-gold/40 bg-gold/5 text-gold',
                      baixa: 'border-line bg-surface text-muted',
                    }[tItem.pri] || 'border-line text-muted';
                    const parentProj = projects.find((p) => String(p.id) === String(tItem.projectId));

                    return (
                      <div
                        key={tItem.id}
                        className={`flex items-center justify-between gap-2.5 p-2.5 rounded-r border transition-all ${
                          isDone
                            ? 'border-line/40 bg-surface/50 opacity-60'
                            : 'border-line bg-surface2/80 hover:border-gold/40'
                        }`}
                      >
                        <div
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                          onClick={() => toggleTask(tItem.id)}
                        >
                          <button
                            type="button"
                            className={`w-5 h-5 rounded flex-none flex items-center justify-center border transition-colors ${
                              isDone
                                ? 'border-gold bg-gold text-[#141414]'
                                : 'border-[#3c3c46] bg-surface hover:border-gold'
                            }`}
                          >
                            {isDone && <Check size={13} strokeWidth={3} />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <span className={`text-xs sm:text-[13px] font-semibold block truncate ${isDone ? 'line-through text-muted' : 'text-ink'}`}>
                              {tItem.txt}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[9.5px] font-mono text-muted flex-wrap">
                              <span className={`px-1.5 py-0.2 rounded border font-bold uppercase ${priColor}`}>
                                {tItem.pri}
                              </span>
                              {tItem.time && (
                                <span className="flex items-center gap-0.5 text-gold2">
                                  <Clock size={10} />
                                  {tItem.time}
                                </span>
                              )}
                              {tItem.rep !== 'unica' && (
                                <span className="text-muted">
                                  🔁 {tItem.rep}
                                </span>
                              )}
                              {parentProj && (
                                <span className="px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold">
                                  📁 {parentProj.title}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          title="Remover Operação"
                          onClick={() => deleteTask(tItem.id)}
                          className="text-muted/60 hover:text-danger p-1 flex-none transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Empty>{tx.noTasks[curLang]}</Empty>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* ABA DE PROJETOS ESTRATÉGICOS EM ANDAMENTO */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
          {projects.length > 0 ? (
            projects.map((proj) => {
              const isCompleted = proj.status === 'concluido';
              const steps = proj.steps || [];
              const stepsDone = steps.filter((s) => s.done).length;
              const projPct = steps.length ? Math.round((stepsDone / steps.length) * 100) : isCompleted ? 100 : 0;
              const projTasks = tasks.filter((t) => String(t.projectId) === String(proj.id));

              return (
                <Card
                  key={proj.id}
                  className={`p-3.5 sm:p-4 border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'border-line/40 bg-surface/50 opacity-70'
                      : 'border-line bg-surface2/80 hover:border-gold/40'
                  }`}
                >
                  <div>
                    {/* Cabeçalho do Projeto */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Folder className="text-gold flex-none" size={18} />
                        <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>
                          {proj.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 flex-none">
                        <button
                          type="button"
                          onClick={() => toggleProjectStatus(proj.id)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                            isCompleted
                              ? 'border-gold bg-gold/15 text-gold'
                              : 'border-line bg-surface text-muted hover:text-ink'
                          }`}
                        >
                          {isCompleted ? '✓ CONCLUÍDO' : 'EM ANDAMENTO'}
                        </button>
                        <button
                          type="button"
                          title="Excluir Projeto"
                          onClick={() => deleteProject(proj.id)}
                          className="text-muted/60 hover:text-danger p-1 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {proj.desc && (
                      <p className="text-xs text-muted mb-3 leading-relaxed">
                        {proj.desc}
                      </p>
                    )}

                    {/* Barra de Progresso do Projeto */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                        <span>PROGRESSO</span>
                        <span className="font-bold text-gold">{projPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden border border-line/40">
                        <div
                          className="h-full bg-gold transition-all duration-300"
                          style={{ width: `${projPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Etapas / Marcos do Projeto */}
                    <div className="space-y-1.5 mb-3">
                      <span className="text-[10px] font-mono text-muted uppercase block">
                        ETAPAS ({stepsDone}/{steps.length})
                      </span>
                      {steps.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => toggleStep(proj.id, st.id)}
                          className="flex items-center gap-2 p-1.5 rounded bg-surface border border-line/40 cursor-pointer text-xs"
                        >
                          <div className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${st.done ? 'bg-gold border-gold text-[#141414]' : 'border-line'}`}>
                            {st.done && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span className={`truncate ${st.done ? 'line-through text-muted' : 'text-ink'}`}>
                            {st.txt}
                          </span>
                        </div>
                      ))}

                      {/* Input rápido de nova etapa */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = e.target.elements.stepInput;
                          addStepToProject(proj.id, input.value);
                          input.value = '';
                        }}
                        className="flex gap-1 pt-1"
                      >
                        <input
                          name="stepInput"
                          placeholder="+ Adicionar etapa..."
                          className="field py-1 px-2 text-[11px] flex-1"
                        />
                        <button type="submit" className="btn-dark py-1 px-2 text-[11px] font-mono font-bold">
                          Adicionar
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Rodapé com Data Limite & Quantidade de Tarefas Vinculadas */}
                  <div className="pt-2 border-t border-line/40 flex items-center justify-between text-[10px] font-mono text-muted">
                    {proj.deadline ? (
                      <span className="flex items-center gap-1 text-gold2">
                        <Calendar size={11} />
                        Prazo: {fmtD(proj.deadline)}
                      </span>
                    ) : (
                      <span>Sem prazo definido</span>
                    )}
                    <span>{projTasks.length} tarefas vinculadas</span>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-2 py-10 text-center">
              <Card className="py-8">
                <Empty>
                  {tx.noProjects[curLang]}
                  <br />
                  <button
                    type="button"
                    onClick={openCreateProjectModal}
                    className="btn-gold py-1.5 px-4 text-xs font-bold mt-3"
                  >
                    + CRIAR PRIMEIRO PROJETO
                  </button>
                </Empty>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
