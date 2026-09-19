'use client';
import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle, Edit3, ChevronRight, Target, Flame, Archive, X, AlertTriangle } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

const I18N = {
  tabTasks: { pt: '🎯 TAREFAS & OPERAÇÕES', en: '🎯 TASKS & OPERATIONS', es: '🎯 TAREAS Y OPERACIONES' },
  tabProjects: { pt: '🏛️ PROJETOS ESTRATÉGICOS', en: '🏛️ STRATEGIC PROJECTS', es: '🏛️ PROYECTOS ESTRATÉGICOS' },
  newTask: { pt: '+ NOVA OPERAÇÃO', en: '+ NEW OPERATION', es: '+ NUEVA OPERACIÓN' },
  newProject: { pt: '+ NOVO PROJETO', en: '+ NEW PROJECT', es: '+ NUEVO PROYECTO' },
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
  const [filter, setFilter] = useState('today');

  const tasks = S.tasks || [];
  const projects = S.projects || [];
  const todayTasks = tasks.filter((x) => L.repDue(x, today()));
  const completedToday = todayTasks.filter((x) => L.isDone(x, today())).length;
  const pct = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  /* MODAL: Confirmação Genérica */
  const confirmAction = ({ title, message, onConfirm, confirmText = 'Confirmar', danger = false }) => {
    const ConfirmModal = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gold">
          {danger ? <AlertTriangle size={24} className="text-danger" /> : <AlertCircle size={24} />}
        </div>
        <h3 className="font-display text-xl tracking-wide text-ink mb-1.5">{title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">{message}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 py-2 rounded text-xs font-bold font-mono transition-colors ${
              danger ? 'bg-danger text-white hover:bg-danger/90' : 'btn-gold'
            }`}
            onClick={() => {
              closeModal();
              onConfirm();
            }}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="btn-dark py-2 px-4 text-xs font-bold font-mono"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
    openModal(<ConfirmModal />);
  };

  /* MODAL: Criar / Editar Tarefa */
  const openTaskModal = (taskToEdit = null) => {
    let txt = taskToEdit ? taskToEdit.txt : '';
    let pri = taskToEdit ? taskToEdit.pri : 'media';
    let rep = taskToEdit ? (taskToEdit.rep || 'unica') : 'unica';
    let time = taskToEdit ? (taskToEdit.time || '') : '';
    let projectId = taskToEdit ? (taskToEdit.projectId || '') : '';

    const TaskModalContent = () => (
      <div className="text-left">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-line">
          <h3 className="font-display text-xl tracking-wide text-gold">
            {taskToEdit ? 'EDITAR OPERAÇÃO' : 'CRIAR NOVA OPERAÇÃO'}
          </h3>
          <button onClick={closeModal} className="text-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <span className="lbl mb-1 block">Missão / Descrição:</span>
            <input
              type="text"
              placeholder="Ex: Treino de pernas, Fazer Barba, Ler 10 págs..."
              className="field w-full text-xs sm:text-sm"
              defaultValue={txt}
              onChange={(e) => (txt = e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="lbl mb-1 block">Prioridade:</span>
              <select
                className="field w-full text-xs font-semibold"
                defaultValue={pri}
                onChange={(e) => (pri = e.target.value)}
              >
                <option value="alta" className="text-danger font-bold">🔴 Alta (Guerra)</option>
                <option value="media" className="text-gold font-bold">🟡 Média</option>
                <option value="baixa" className="text-muted font-bold">⚪ Baixa</option>
              </select>
            </div>

            <div>
              <span className="lbl mb-1 block">Frequência:</span>
              <select
                className="field w-full text-xs font-semibold"
                defaultValue={rep}
                onChange={(e) => (rep = e.target.value)}
              >
                <option value="unica">Única</option>
                <option value="diaria">Diária</option>
                <option value="dias_uteis">Dias Úteis (Seg a Sex)</option>
                <option value="fds">Fins de Semana (Sáb/Dom)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="lbl mb-1 block">Horário (Opcional):</span>
              <input
                type="time"
                className="field w-full text-xs font-mono"
                defaultValue={time}
                onChange={(e) => (time = e.target.value)}
              />
            </div>

            <div>
              <span className="lbl mb-1 block">Vincular a Projeto:</span>
              <select
                className="field w-full text-xs font-semibold"
                defaultValue={projectId}
                onChange={(e) => (projectId = e.target.value)}
              >
                <option value="">(Nenhum / Avulso)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn-gold flex-1 py-2 text-xs font-bold"
            onClick={() => {
              if (!txt.trim()) return toast('Digite a descrição da operação');
              update((s) => {
                s.tasks = s.tasks || [];
                if (taskToEdit) {
                  const tTarget = s.tasks.find((x) => String(x.id) === String(taskToEdit.id));
                  if (tTarget) {
                    tTarget.txt = txt.trim();
                    tTarget.pri = pri;
                    tTarget.rep = rep;
                    tTarget.time = time || '';
                    tTarget.projectId = projectId || null;
                  }
                } else {
                  s.tasks.push({
                    id: 'task_' + Date.now(),
                    txt: txt.trim(),
                    pri,
                    rep,
                    time: time || '',
                    projectId: projectId || null,
                    done: false,
                    doneDates: [],
                    createdAt: today(),
                  });
                }
              });
              closeModal();
              AF.click();
              toast(taskToEdit ? 'Operação atualizada!' : '✅ Operação criada!');
            }}
          >
            {taskToEdit ? 'Salvar Alterações' : 'Criar Operação'}
          </button>
          <button type="button" className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    );
    openModal(<TaskModalContent />);
  };

  /* MODAL: Criar / Editar Projeto */
  const openProjectModal = (projToEdit = null) => {
    let pTitle = projToEdit ? projToEdit.title : '';
    let pDesc = projToEdit ? projToEdit.desc : '';
    let pDeadline = projToEdit ? (projToEdit.deadline || '') : '';

    const ProjModalContent = () => (
      <div className="text-left">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-line">
          <h3 className="font-display text-xl tracking-wide text-gold">
            {projToEdit ? 'EDITAR PROJETO' : 'NOVO PROJETO ESTRATÉGICO'}
          </h3>
          <button onClick={closeModal} className="text-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <span className="lbl mb-1 block">Título da Missão / Projeto:</span>
            <input
              type="text"
              placeholder="Ex: Lançamento do Negócio, Treino Hipertrofia..."
              className="field w-full text-xs sm:text-sm"
              defaultValue={pTitle}
              onChange={(e) => (pTitle = e.target.value)}
            />
          </div>

          <div>
            <span className="lbl mb-1 block">Objetivo / Descrição:</span>
            <textarea
              rows={3}
              placeholder="Qual o resultado esperado e por que este projeto é crucial?"
              className="field w-full text-xs resize-none"
              defaultValue={pDesc}
              onChange={(e) => (pDesc = e.target.value)}
            />
          </div>

          <div>
            <span className="lbl mb-1 block">Prazo Limite (Opcional):</span>
            <input
              type="date"
              className="field w-full text-xs font-mono"
              defaultValue={pDeadline}
              onChange={(e) => (pDeadline = e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn-gold flex-1 py-2 text-xs font-bold"
            onClick={() => {
              if (!pTitle.trim()) return toast('Digite o nome do projeto');
              update((s) => {
                s.projects = s.projects || [];
                if (projToEdit) {
                  const pTarget = s.projects.find((p) => String(p.id) === String(projToEdit.id));
                  if (pTarget) {
                    pTarget.title = pTitle.trim();
                    pTarget.desc = pDesc.trim();
                    pTarget.deadline = pDeadline || '';
                  }
                } else {
                  s.projects.push({
                    id: 'proj_' + Date.now(),
                    title: pTitle.trim(),
                    desc: pDesc.trim(),
                    deadline: pDeadline || '',
                    status: 'ativo',
                    steps: [],
                    createdAt: today(),
                  });
                }
              });
              closeModal();
              AF.click();
              toast(projToEdit ? 'Projeto atualizado!' : '✅ Projeto criado com sucesso!');
            }}
          >
            {projToEdit ? 'Salvar Alterações' : 'Criar Projeto'}
          </button>
          <button type="button" className="btn-dark py-2 px-4 text-xs font-bold" onClick={closeModal}>
            Cancelar
          </button>
        </div>
      </div>
    );
    openModal(<ProjModalContent />);
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

  /* Excluir Tarefa COM CONFIRMAÇÃO */
  const requestDeleteTask = (task) => {
    confirmAction({
      title: 'EXCLUIR OPERAÇÃO?',
      message: `Tem certeza que deseja cancelar e excluir permanentemente a operação "${task.txt}"?`,
      danger: true,
      confirmText: 'Sim, Excluir',
      onConfirm: () => {
        update((s) => {
          s.tasks = (s.tasks || []).filter((x) => String(x.id) !== String(task.id));
        });
        AF.click();
        toast('Operação excluída');
      },
    });
  };

  /* Excluir Projeto COM CONFIRMAÇÃO */
  const requestDeleteProject = (proj) => {
    confirmAction({
      title: 'EXCLUIR PROJETO ESTRATÉGICO?',
      message: `Tem certeza que deseja excluir o projeto "${proj.title}"? As tarefas vinculadas a ele se tornarão avulsas.`,
      danger: true,
      confirmText: 'Sim, Excluir Projeto',
      onConfirm: () => {
        update((s) => {
          s.projects = (s.projects || []).filter((p) => String(p.id) !== String(proj.id));
          s.tasks = (s.tasks || []).map((t) => String(t.projectId) === String(proj.id) ? { ...t, projectId: null } : t);
        });
        AF.click();
        toast('Projeto excluído');
      },
    });
  };

  /* Concluir Projeto COM CONFIRMAÇÃO */
  const toggleProjectStatus = (proj) => {
    const isComp = proj.status === 'concluido';
    confirmAction({
      title: isComp ? 'REABRIR PROJETO?' : 'CONCLUIR PROJETO?',
      message: isComp
        ? `Deseja marcar o projeto "${proj.title}" de volta como Em Andamento?`
        : `Parabéns guerreiro! Confirmar conclusão do projeto estratégico "${proj.title}"?`,
      confirmText: isComp ? 'Reabrir' : 'Concluir Missão',
      onConfirm: () => {
        update((s) => {
          const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
          if (p) {
            p.status = isComp ? 'ativo' : 'concluido';
          }
        });
        AF.click();
        toast(isComp ? 'Projeto reaberto' : '🏆 Projeto Concluído com Honra!');
      },
    });
  };

  /* Etapas de Projeto */
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
      {/* 1. SELETOR DE ABAS PRINCIPAIS COM BOTÕES DE AÇÃO LIMPOS */}
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

          {/* Botão Superior Direito Adaptável: Abre o Modal de Criação */}
          <div className="flex items-center gap-3">
            {activeMainTab === 'tasks' ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] font-mono text-muted uppercase block">{tx.progress[curLang]}</span>
                    <b className="text-xs font-mono text-gold">{completedToday}/{todayTasks.length} ({pct}%)</b>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5 font-mono text-[11px] font-bold text-gold">
                    {pct}%
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openTaskModal()}
                  className="btn-gold py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  <span>{tx.newTask[curLang]}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openProjectModal()}
                className="btn-gold py-1.5 px-3.5 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>{tx.newProject[curLang]}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 2. CONTEÚDO PRINCIPAL (100% LIMPO E ESPAÇOSO) */}
      {activeMainTab === 'tasks' ? (
        /* ABA DE TAREFAS */
        <Card className="p-3.5 sm:p-4">
          {/* Barra de Filtros */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-line/60">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'today', label: tx.filterToday[curLang], count: todayTasks.filter((x) => !L.isDone(x, today())).length },
                { id: 'all', label: tx.filterAll[curLang], count: tasks.length },
                { id: 'done', label: tx.filterDone[curLang], count: tasks.filter((x) => L.isDone(x, today())).length },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`text-xs font-mono px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                    filter === f.id
                      ? 'bg-gold text-[#141414] font-bold shadow-sm'
                      : 'bg-surface2 text-muted hover:text-ink border border-line'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[9.5px] px-1.5 py-0.2 rounded ${filter === f.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openTaskModal()}
              className="text-xs font-mono font-bold text-gold hover:underline flex items-center gap-1 sm:hidden"
            >
              <Plus size={12} />
              <span>Nova</span>
            </button>
          </div>

          {/* Lista de Operações em Grade Limpa */}
          {displayedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                    {/* Checkbox & Informações */}
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

                    {/* Ações: Editar e Excluir */}
                    <div className="flex items-center gap-1 flex-none">
                      <button
                        type="button"
                        title="Editar Operação"
                        onClick={() => openTaskModal(tItem)}
                        className="text-muted hover:text-gold p-1 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        title="Excluir Operação"
                        onClick={() => requestDeleteTask(tItem)}
                        className="text-muted hover:text-danger p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Empty>{tx.noTasks[curLang]}</Empty>
            </div>
          )}
        </Card>
      ) : (
        /* ABA DE PROJETOS ESTRATÉGICOS */
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
                          onClick={() => toggleProjectStatus(proj)}
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
                          title="Editar Projeto"
                          onClick={() => openProjectModal(proj)}
                          className="text-muted hover:text-gold p-1 transition-colors"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          title="Excluir Projeto"
                          onClick={() => requestDeleteProject(proj)}
                          className="text-muted hover:text-danger p-1 transition-colors"
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
                    onClick={() => openProjectModal()}
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
