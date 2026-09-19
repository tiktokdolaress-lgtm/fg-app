'use client';
import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle, Edit3, ChevronRight, Target, Flame, Archive, AlertTriangle, Link2, Unlink } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD, daysBetween, parseD } from '@/lib/utils';
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
  filterActive: { pt: 'Ativos', en: 'Active', es: 'Activos' },
  filterArchived: { pt: 'Arquivados', en: 'Archived', es: 'Archivados' },
  progress: { pt: 'Progresso do Dia', en: 'Today\'s Progress', es: 'Progreso del Día' },
  noTasks: { pt: 'Nenhuma operação nesta categoria.', en: 'No operations in this category.', es: 'Ninguna operación en esta categoría.' },
  noProjects: { pt: 'Nenhum projeto nesta categoria.', en: 'No projects in this category.', es: 'Ningún proyecto en esta categoría.' },
};

export default function OpsView() {
  const { S, update, toast, openModal, closeModal } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [activeMainTab, setActiveMainTab] = useState('tasks');
  const [filter, setFilter] = useState('today');
  const [projFilter, setProjFilter] = useState('ativos'); // 'ativos', 'concluidos', 'arquivados'

  const tasks = S.tasks || [];
  const projects = S.projects || [];
  const todayTasks = tasks.filter((x) => !x.archived && L.repDue(x, today()));
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

  /* Helper para label de repetição */
  const formatRepLabel = (t) => {
    if (!t.rep || t.rep === 'unica') return null;
    if (t.rep === 'diaria') return '🔁 Diária';
    if (t.rep === 'dias_uteis' || t.rep === 'semana') return '🔁 Seg–Sex';
    if (t.rep === 'fds') return '🔁 Sáb–Dom';
    if (t.rep === 'semanal') {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const dName = dayNames[t.repDay == null ? 1 : Number(t.repDay)] || 'Seg';
      return `🔁 Semanal (${dName})`;
    }
    if (t.rep === 'custom') {
      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const days = (t.repDays || []).slice().sort((a, b) => a - b).map((i) => dayNames[i]).join(', ');
      return `🗓️ ${days || 'Personalizada'}`;
    }
    return `🔁 ${t.rep}`;
  };

  /* MODAL: Criar / Editar Tarefa (Sem X duplo) */
  const openTaskModal = (taskToEdit = null, defaultProjectId = '') => {
    const TaskModalContent = () => {
      const [txt, setTxt] = useState(taskToEdit ? taskToEdit.txt : '');
      const [pri, setPri] = useState(taskToEdit ? taskToEdit.pri : 'media');
      const [rep, setRep] = useState(taskToEdit ? (taskToEdit.rep || 'unica') : 'unica');
      const [repDay, setRepDay] = useState(taskToEdit && taskToEdit.repDay != null ? Number(taskToEdit.repDay) : 1);
      const [repDays, setRepDays] = useState(taskToEdit && Array.isArray(taskToEdit.repDays) ? taskToEdit.repDays : [1]);
      const [time, setTime] = useState(taskToEdit ? (taskToEdit.time || '') : '');
      const [projectId, setProjectId] = useState(taskToEdit ? (taskToEdit.projectId || '') : defaultProjectId);

      const dayList = [
        { id: 0, l: 'Dom', f: 'Domingo' },
        { id: 1, l: 'Seg', f: 'Segunda-feira' },
        { id: 2, l: 'Ter', f: 'Terça-feira' },
        { id: 3, l: 'Qua', f: 'Quarta-feira' },
        { id: 4, l: 'Qui', f: 'Quinta-feira' },
        { id: 5, l: 'Sex', f: 'Sexta-feira' },
        { id: 6, l: 'Sáb', f: 'Sábado' },
      ];

      return (
        <div className="text-left">
          <div className="pb-2 mb-3 border-b border-line">
            <h3 className="font-display text-xl tracking-wide text-gold">
              {taskToEdit ? 'EDITAR OPERAÇÃO' : 'CRIAR NOVA OPERAÇÃO'}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <span className="lbl mb-1 block">Missão / Descrição:</span>
              <input
                type="text"
                placeholder="Ex: Treino de pernas, Fazer Barba, Ler 10 págs..."
                className="field w-full text-xs sm:text-sm"
                value={txt}
                onChange={(e) => setTxt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">Prioridade:</span>
                <select
                  className="field w-full text-xs font-semibold"
                  value={pri}
                  onChange={(e) => setPri(e.target.value)}
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
                  value={rep}
                  onChange={(e) => setRep(e.target.value)}
                >
                  <option value="unica">Única</option>
                  <option value="diaria">Diária</option>
                  <option value="dias_uteis">Dias Úteis (Seg a Sex)</option>
                  <option value="fds">Fins de Semana (Sáb/Dom)</option>
                  <option value="semanal">Semanal (1x por semana)</option>
                  <option value="custom">Personalizada (Escolher dias)</option>
                </select>
              </div>
            </div>

            {/* SELEÇÃO DO DIA DA SEMANA QUANDO FOR SEMANAL */}
            {rep === 'semanal' && (
              <div className="p-2.5 rounded bg-surface2 border border-gold/40 animate-fadeIn">
                <span className="lbl mb-1.5 block text-gold font-bold">Escolha o dia da semana que repete:</span>
                <div className="grid grid-cols-7 gap-1">
                  {dayList.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setRepDay(d.id)}
                      className={`py-1.5 rounded text-xs font-bold transition-all text-center ${
                        repDay === d.id
                          ? 'bg-gold text-[#141414] font-extrabold shadow-sm'
                          : 'bg-surface border border-line text-muted hover:text-ink hover:border-gold/50'
                      }`}
                      title={d.f}
                    >
                      {d.l}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted mt-1.5 font-mono">
                  Repete todo(a) <b className="text-gold uppercase">{dayList[repDay]?.f}</b>.
                </p>
              </div>
            )}

            {/* SELEÇÃO DE MÚLTIPLOS DIAS QUANDO FOR PERSONALIZADA */}
            {rep === 'custom' && (
              <div className="p-2.5 rounded bg-surface2 border border-gold/40 animate-fadeIn">
                <span className="lbl mb-1.5 block text-gold font-bold">Escolha os dias em que repete:</span>
                <div className="grid grid-cols-7 gap-1">
                  {dayList.map((d) => {
                    const isSel = repDays.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() =>
                          setRepDays((prev) =>
                            prev.includes(d.id)
                              ? prev.filter((x) => x !== d.id)
                              : [...prev, d.id]
                          )
                        }
                        className={`py-1.5 rounded text-xs font-bold transition-all text-center ${
                          isSel
                            ? 'bg-gold text-[#141414] font-extrabold shadow-sm'
                            : 'bg-surface border border-line text-muted hover:text-ink hover:border-gold/50'
                        }`}
                        title={d.f}
                      >
                        {d.l}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted mt-1.5 font-mono">
                  Dias:{' '}
                  <b className="text-gold">
                    {repDays.length > 0
                      ? repDays
                          .slice()
                          .sort((a, b) => a - b)
                          .map((i) => dayList[i]?.l)
                          .join(', ')
                      : 'Nenhum dia selecionado'}
                  </b>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">Horário (Opcional):</span>
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
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">(Nenhum / Avulso)</option>
                  {projects.filter((p) => !p.archived).map((p) => (
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
                      tTarget.repDay = repDay;
                      tTarget.repDays = repDays;
                      tTarget.time = time || '';
                      tTarget.projectId = projectId || null;
                    }
                  } else {
                    s.tasks.push({
                      id: 'task_' + Date.now(),
                      txt: txt.trim(),
                      pri,
                      rep,
                      repDay,
                      repDays,
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
    };
    openModal(<TaskModalContent />);
  };

  /* MODAL: Vincular Tarefa Existente ao Projeto */
  const openLinkTaskModal = (proj) => {
    const unlinkedTasks = tasks.filter((t) => !t.archived && String(t.projectId) !== String(proj.id));

    const LinkModalContent = () => (
      <div className="text-left">
        <div className="pb-2 mb-3 border-b border-line">
          <h3 className="font-display text-xl tracking-wide text-gold">VINCULAR TAREFA EXISTENTE</h3>
          <p className="text-xs text-muted">Selecione uma tarefa para incluir no projeto "{proj.title}":</p>
        </div>

        {unlinkedTasks.length > 0 ? (
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {unlinkedTasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded bg-surface border border-line hover:border-gold/50 transition-colors"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <span className="text-xs font-bold text-ink block truncate">{t.txt}</span>
                  <span className="text-[10px] font-mono text-muted uppercase">
                    {t.rep || 'única'} • {t.pri || 'média'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    update((s) => {
                      const tgt = (s.tasks || []).find((x) => String(x.id) === String(t.id));
                      if (tgt) tgt.projectId = proj.id;
                    });
                    closeModal();
                    AF.click();
                    toast('Tarefa vinculada ao projeto!');
                  }}
                  className="btn-gold py-1 px-2.5 text-[11px] font-bold flex items-center gap-1"
                >
                  <Link2 size={11} />
                  <span>Vincular</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-muted">
            Todas as suas tarefas já estão vinculadas a este projeto ou não há tarefas criadas.
          </div>
        )}

        <div className="mt-4 text-right">
          <button type="button" className="btn-dark py-1.5 px-4 text-xs font-bold" onClick={closeModal}>
            Fechar
          </button>
        </div>
      </div>
    );
    openModal(<LinkModalContent />);
  };

  /* MODAL: Criar / Editar Projeto (Com Início, Duração em Dias e Término) */
  const openProjectModal = (projToEdit = null) => {
    const ProjModalContent = () => {
      const [pTitle, setPTitle] = useState(projToEdit ? projToEdit.title : '');
      const [pDesc, setPDesc] = useState(projToEdit ? projToEdit.desc || '' : '');
      const [pStart, setPStart] = useState(projToEdit ? (projToEdit.start || today()) : today());

      const initialDays = projToEdit && projToEdit.start && projToEdit.deadline
        ? Math.max(1, daysBetween(projToEdit.start, projToEdit.deadline) + 1)
        : (projToEdit?.days || 30);
      const [pDays, setPDays] = useState(initialDays);

      const initialDead = projToEdit && projToEdit.deadline
        ? projToEdit.deadline
        : dstr(new Date(parseD(today()).getTime() + (Number(initialDays) - 1) * 86400000));
      const [pDeadline, setPDeadline] = useState(initialDead);
      const [tStart, setTStart] = useState(projToEdit ? (projToEdit.tStart || '') : '');
      const [tEnd, setTEnd] = useState(projToEdit ? (projToEdit.tEnd || '') : '');

      const syncDead = (st, dy) => {
        if (st && Number(dy) >= 1) {
          const newDead = dstr(new Date(parseD(st).getTime() + (Number(dy) - 1) * 86400000));
          setPDeadline(newDead);
        }
      };

      const syncDays = (st, dl) => {
        if (st && dl) {
          const diff = daysBetween(st, dl) + 1;
          setPDays(Math.max(1, diff));
        }
      };

      return (
        <div className="text-left">
          <div className="pb-2 mb-3 border-b border-line">
            <h3 className="font-display text-xl tracking-wide text-gold">
              {projToEdit ? 'EDITAR PROJETO' : 'NOVO PROJETO ESTRATÉGICO'}
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <span className="lbl mb-1 block">Título da Missão / Projeto:</span>
              <input
                type="text"
                placeholder="Ex: Lançamento do Negócio, Cuidar do Jardim..."
                className="field w-full text-xs sm:text-sm"
                value={pTitle}
                onChange={(e) => setPTitle(e.target.value)}
              />
            </div>

            <div>
              <span className="lbl mb-1 block">Objetivo / Descrição:</span>
              <textarea
                rows={2}
                placeholder="Qual o resultado esperado e por que este projeto é crucial?"
                className="field w-full text-xs resize-none"
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
              />
            </div>

            {/* CRONOGRAMA COMPLETO: INÍCIO, DURAÇÃO EM DIAS E TÉRMINO */}
            <div className="rounded border border-gold/40 bg-surface2/90 p-2.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold block mb-2">
                📅 Cronograma: Início, Duração e Término
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="lbl mb-1 block">Data de Início:</span>
                  <input
                    type="date"
                    className="field w-full text-xs font-mono"
                    value={pStart}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPStart(val);
                      if (pDays) syncDead(val, pDays);
                    }}
                  />
                </div>

                <div>
                  <span className="lbl mb-1 block">Duração (Dias):</span>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    placeholder="Ex: 30"
                    className="field w-full text-xs font-mono font-bold text-gold"
                    value={pDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPDays(val);
                      if (pStart && val) syncDead(pStart, val);
                    }}
                  />
                </div>

                <div>
                  <span className="lbl mb-1 block">Término / Encerramento:</span>
                  <input
                    type="date"
                    className="field w-full text-xs font-mono"
                    value={pDeadline}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPDeadline(val);
                      if (pStart && val) syncDays(pStart, val);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* JANELA DIÁRIA DE FOCO (OPCIONAL) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="lbl mb-1 block">Janela Diária — Início:</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={tStart}
                  onChange={(e) => setTStart(e.target.value)}
                />
              </div>

              <div>
                <span className="lbl mb-1 block">Janela Diária — Fim:</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={tEnd}
                  onChange={(e) => setTEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Se estiver editando, oferece botões rápidos de tarefas */}
            {projToEdit && (
              <div className="pt-2 border-t border-line/60">
                <span className="lbl mb-1.5 block">Ações Rápidas de Tarefas:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openTaskModal(null, projToEdit.id), 150);
                    }}
                    className="btn-dark py-1.5 px-2.5 text-xs font-bold flex-1 flex items-center justify-center gap-1 border-gold/40 text-gold"
                  >
                    <Plus size={12} />
                    <span>+ Nova Tarefa Neste Projeto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => openLinkTaskModal(projToEdit), 150);
                    }}
                    className="btn-dark py-1.5 px-2.5 text-xs font-bold flex-1 flex items-center justify-center gap-1"
                  >
                    <Link2 size={12} />
                    <span>Vincular Tarefa Existente</span>
                  </button>
                </div>
              </div>
            )}
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
                      pTarget.start = pStart || today();
                      pTarget.days = Number(pDays) || 30;
                      pTarget.deadline = pDeadline || '';
                      pTarget.tStart = tStart || '';
                      pTarget.tEnd = tEnd || '';
                    }
                  } else {
                    s.projects.push({
                      id: 'proj_' + Date.now(),
                      title: pTitle.trim(),
                      desc: pDesc.trim(),
                      start: pStart || today(),
                      days: Number(pDays) || 30,
                      deadline: pDeadline || '',
                      tStart: tStart || '',
                      tEnd: tEnd || '',
                      status: 'ativo',
                      archived: false,
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
    };
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

  /* Excluir Tarefa com Confirmação */
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

  /* ARQUIVAR PROJETO COM ESCOLHA DE TAREFAS */
  const requestArchiveProject = (proj) => {
    const isArch = proj.archived;
    const linkedTasks = tasks.filter((t) => String(t.projectId) === String(proj.id));

    if (isArch) {
      // Desarquivar
      confirmAction({
        title: 'DESARQUIVAR PROJETO?',
        message: `Deseja restaurar o projeto "${proj.title}" para os projetos ativos?`,
        confirmText: 'Restaurar Projeto',
        onConfirm: () => {
          update((s) => {
            const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
            if (p) p.archived = false;
            (s.tasks || []).forEach((t) => {
              if (String(t.projectId) === String(proj.id)) t.archived = false;
            });
          });
          AF.click();
          toast('Projeto desarquivado!');
        },
      });
      return;
    }

    // Modal especial para arquivar com escolha de tarefas
    const ArchiveModalChoice = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gold">
          <Archive size={24} />
        </div>
        <h3 className="font-display text-xl tracking-wide text-ink mb-1.5">ARQUIVAR PROJETO?</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          Você está arquivando o projeto <b>"{proj.title}"</b>. Ele possui <b>{linkedTasks.length}</b> tarefa(s) vinculada(s).
          Como deseja proceder com essas tarefas?
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn-gold py-2 text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
                if (p) p.archived = true;
                (s.tasks || []).forEach((t) => {
                  if (String(t.projectId) === String(proj.id)) t.archived = true;
                });
              });
              closeModal();
              AF.click();
              toast('📦 Projeto e tarefas arquivados!');
            }}
          >
            📦 Arquivar Projeto E Tarefas Vinculadas
          </button>
          <button
            type="button"
            className="btn-dark py-2 text-xs font-bold font-mono border-line"
            onClick={() => {
              update((s) => {
                const p = (s.projects || []).find((x) => String(x.id) === String(proj.id));
                if (p) p.archived = true;
                (s.tasks || []).forEach((t) => {
                  if (String(t.projectId) === String(proj.id)) t.projectId = null;
                });
              });
              closeModal();
              AF.click();
              toast('📦 Projeto arquivado (tarefas tornaram-se avulsas)!');
            }}
          >
            🔓 Arquivar Só Projeto (Manter Tarefas Ativas/Avulsas)
          </button>
          <button
            type="button"
            className="btn-dark py-1.5 px-4 text-xs font-bold text-muted hover:text-ink mt-1"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
    openModal(<ArchiveModalChoice />);
  };

  /* EXCLUIR PROJETO COM ESCOLHA DE TAREFAS */
  const requestDeleteProject = (proj) => {
    const linkedTasks = tasks.filter((t) => String(t.projectId) === String(proj.id));

    const DeleteModalChoice = () => (
      <div className="text-center p-1">
        <div className="w-12 h-12 rounded-full border border-danger/40 bg-danger/10 flex items-center justify-center mx-auto mb-3 text-danger">
          <AlertTriangle size={24} />
        </div>
        <h3 className="font-display text-xl tracking-wide text-danger mb-1.5">EXCLUIR PROJETO DEFINITIVAMENTE?</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">
          Você está prestes a apagar <b>"{proj.title}"</b>. Ele possui <b>{linkedTasks.length}</b> tarefa(s) vinculada(s).
          O que deseja fazer com as tarefas?
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="bg-danger text-white hover:bg-danger/90 py-2 rounded text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                s.projects = (s.projects || []).filter((p) => String(p.id) !== String(proj.id));
                s.tasks = (s.tasks || []).filter((t) => String(t.projectId) !== String(proj.id));
              });
              closeModal();
              AF.click();
              toast('Projeto e tarefas excluídos!');
            }}
          >
            🗑️ Excluir Projeto E Todas as Suas Tarefas
          </button>
          <button
            type="button"
            className="btn-gold py-2 text-xs font-bold font-mono"
            onClick={() => {
              update((s) => {
                s.projects = (s.projects || []).filter((p) => String(p.id) !== String(proj.id));
                (s.tasks || []).forEach((t) => {
                  if (String(t.projectId) === String(proj.id)) t.projectId = null;
                });
              });
              closeModal();
              AF.click();
              toast('Projeto excluído! Tarefas salvas como avulsas.');
            }}
          >
            🛡️ Excluir Apenas Projeto (Preservar Tarefas como Avulsas)
          </button>
          <button
            type="button"
            className="btn-dark py-1.5 px-4 text-xs font-bold text-muted hover:text-ink mt-1"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
    openModal(<DeleteModalChoice />);
  };

  /* Desvincular Tarefa de Projeto */
  const unlinkTask = (taskId) => {
    update((s) => {
      const t = (s.tasks || []).find((x) => String(x.id) === String(taskId));
      if (t) t.projectId = null;
    });
    AF.click();
    toast('Tarefa desvinculada do projeto');
  };

  /* Concluir / Reabrir Projeto */
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
          if (p) p.status = isComp ? 'ativo' : 'concluido';
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

  /* Filtros de Tarefas */
  const displayedTasks = tasks.filter((x) => {
    if (x.archived) return false;
    const isDone = L.isDone(x, today());
    if (filter === 'done') return isDone;
    if (filter === 'today') return L.repDue(x, today()) && !isDone;
    return true;
  });

  /* Filtros de Projetos */
  const displayedProjects = projects.filter((p) => {
    if (projFilter === 'arquivados') return p.archived;
    if (p.archived) return false;
    if (projFilter === 'concluidos') return p.status === 'concluido';
    return p.status !== 'concluido';
  });

  return (
    <div className="grid gap-3.5">
      {/* 1. SELETOR DE ABAS PRINCIPAIS */}
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
                {tasks.filter((t) => !t.archived).length}
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
                {projects.filter((p) => !p.archived).length}
              </span>
            </button>
          </div>

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

      {/* 2. CONTEÚDO PRINCIPAL */}
      {activeMainTab === 'tasks' ? (
        /* ABA DE TAREFAS */
        <Card className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-line/60">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full -mx-0.5 px-0.5">
              {[
                { id: 'today', label: tx.filterToday[curLang], count: todayTasks.filter((x) => !L.isDone(x, today())).length },
                { id: 'all', label: tx.filterAll[curLang], count: tasks.filter((t) => !t.archived).length },
                { id: 'done', label: tx.filterDone[curLang], count: tasks.filter((x) => !x.archived && L.isDone(x, today())).length },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
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
          </div>

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
                          {formatRepLabel(tItem) && (
                            <span className="text-muted font-bold">
                              {formatRepLabel(tItem)}
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

              {/* CARD DE BALANCEAMENTO: Se contagem for ímpar na aba de tarefas ativas, preenche o vácuo */}
              {displayedTasks.length % 2 === 1 && filter !== 'done' && (
                <div
                  onClick={() => openTaskModal()}
                  className="cursor-pointer border border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-r p-2.5 flex items-center justify-center gap-2 text-gold transition-all min-h-[46px]"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    + Nova Operação
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Empty>{tx.noTasks[curLang]}</Empty>
            </div>
          )}
        </Card>
      ) : (
        /* ABA DE PROJETOS ESTRATÉGICOS */
        <div className="flex flex-col gap-3">
          {/* Sub-filtros de Projetos com Scroll Horizontal Suave */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full -mx-0.5 px-0.5">
            {[
              { id: 'ativos', label: 'Ativos', count: projects.filter((p) => !p.archived && p.status !== 'concluido').length },
              { id: 'concluidos', label: 'Concluídos', count: projects.filter((p) => !p.archived && p.status === 'concluido').length },
              { id: 'arquivados', label: 'Arquivados 📦', count: projects.filter((p) => p.archived).length },
            ].map((pf) => (
              <button
                key={pf.id}
                type="button"
                onClick={() => setProjFilter(pf.id)}
                className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  projFilter === pf.id
                    ? 'bg-gold text-[#141414] font-bold shadow-sm'
                    : 'bg-surface2 text-muted hover:text-ink border border-line'
                }`}
              >
                <span>{pf.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded ${projFilter === pf.id ? 'bg-black/20 text-black' : 'bg-surface text-muted'}`}>
                  {pf.count}
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
            {displayedProjects.length > 0 ? (
              <>
                {displayedProjects.map((proj) => {
                const isCompleted = proj.status === 'concluido';
                const isArchived = proj.archived;
                const steps = proj.steps || [];
                const stepsDone = steps.filter((s) => s.done).length;
                const projTasks = tasks.filter((t) => String(t.projectId) === String(proj.id) && !t.archived);
                const projTasksDone = projTasks.filter((t) => L.isDone(t, today())).length;
                const totalItems = steps.length + projTasks.length;
                const doneItems = stepsDone + projTasksDone;
                const projPct = totalItems ? Math.round((doneItems / totalItems) * 100) : isCompleted ? 100 : 0;

                return (
                  <Card
                    key={proj.id}
                    className={`p-3.5 sm:p-4 border transition-all flex flex-col justify-between ${
                      isArchived
                        ? 'border-line bg-surface/30 opacity-60'
                        : isCompleted
                        ? 'border-line/40 bg-surface/50 opacity-75'
                        : 'border-line bg-surface2/80 hover:border-gold/40'
                    }`}
                  >
                    <div>
                      {/* Topo do Card */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Folder className="text-gold flex-none" size={18} />
                          <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-muted' : 'text-ink'}`}>
                            {proj.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 flex-none">
                          {!isArchived && (
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
                          )}
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
                            title={isArchived ? 'Desarquivar Projeto' : 'Arquivar Projeto'}
                            onClick={() => requestArchiveProject(proj)}
                            className="text-muted hover:text-gold p-1 transition-colors"
                          >
                            <Archive size={13} />
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

                      {/* Barra de Progresso */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                          <span>PROGRESSO TOTAL</span>
                          <span className="font-bold text-gold">{projPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden border border-line/40">
                          <div
                            className="h-full bg-gold transition-all duration-300"
                            style={{ width: `${projPct}%` }}
                          />
                        </div>
                      </div>

                      {/* TAREFAS VINCULADAS A ESTE PROJETO */}
                      <div className="mb-3 p-2 rounded bg-surface/60 border border-line/40">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-muted uppercase font-bold">
                            TAREFAS VINCULADAS ({projTasksDone}/{projTasks.length})
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openTaskModal(null, proj.id)}
                              className="text-[10px] font-mono text-gold hover:underline flex items-center gap-0.5"
                            >
                              <Plus size={10} /> Nova
                            </button>
                            <span className="text-muted text-[10px]">•</span>
                            <button
                              type="button"
                              onClick={() => openLinkTaskModal(proj)}
                              className="text-[10px] font-mono text-muted hover:text-ink flex items-center gap-0.5"
                            >
                              <Link2 size={10} /> Vincular
                            </button>
                          </div>
                        </div>

                        {projTasks.length > 0 ? (
                          <div className="space-y-1">
                            {projTasks.map((pt) => {
                              const done = L.isDone(pt, today());
                              return (
                                <div
                                  key={pt.id}
                                  className="flex items-center justify-between gap-1.5 p-1 px-1.5 rounded bg-surface2/60 text-xs border border-line/30"
                                >
                                  <div
                                    className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
                                    onClick={() => toggleTask(pt.id)}
                                  >
                                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${done ? 'bg-gold border-gold text-[#141414]' : 'border-line'}`}>
                                      {done && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span className={`truncate text-[11px] ${done ? 'line-through text-muted' : 'text-ink'}`}>
                                      {pt.txt}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    title="Desvincular do Projeto"
                                    onClick={() => unlinkTask(pt.id)}
                                    className="text-muted/60 hover:text-danger p-0.5 transition-colors"
                                  >
                                    <Unlink size={11} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-muted italic">Nenhuma tarefa vinculada ainda.</p>
                        )}
                      </div>

                      {/* ETAPAS / MARCOS */}
                      <div className="space-y-1.5 mb-3">
                        <span className="text-[10px] font-mono text-muted uppercase block font-bold">
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
                            <span className={`truncate text-xs ${st.done ? 'line-through text-muted' : 'text-ink'}`}>
                              {st.txt}
                            </span>
                          </div>
                        ))}

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

                    <div className="pt-2 border-t border-line/40 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-muted">
                      {proj.start && proj.deadline ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-gold2 font-semibold">
                            <Calendar size={11} />
                            {fmtD(proj.start)} ➔ {fmtD(proj.deadline)}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-gold/10 text-gold border border-gold/30 font-bold">
                            {L.projTotal(proj)} dias {L.projCurDay(proj) > 0 ? `(Dia ${L.projCurDay(proj)})` : ''}
                          </span>
                        </div>
                      ) : proj.deadline ? (
                        <span className="flex items-center gap-1 text-gold2">
                          <Calendar size={11} />
                          Prazo: {fmtD(proj.deadline)}
                        </span>
                      ) : (
                        <span>Sem prazo definido</span>
                      )}
                      <div className="flex items-center gap-2">
                        {proj.tStart && proj.tEnd && (
                          <span className="flex items-center gap-0.5 text-muted">
                            <Clock size={10} />
                            {proj.tStart}–{proj.tEnd}
                          </span>
                        )}
                        <span>{projTasks.length} tarefas</span>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* CARD DE BALANCEAMENTO: Se contagem for ímpar na aba de projetos ativos, elimina o vácuo */}
              {displayedProjects.length % 2 === 1 && projFilter === 'ativos' && (
                <div
                  onClick={() => openProjectModal()}
                  className="cursor-pointer border-2 border-dashed border-gold/30 hover:border-gold/60 bg-gold/5 hover:bg-gold/10 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all min-h-[200px] group"
                >
                  <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/35 text-gold flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                  <b className="text-xs text-gold font-bold uppercase tracking-wider block">
                    Novo Projeto Estratégico
                  </b>
                  <span className="text-[11px] text-muted mt-1 max-w-[240px]">
                    Crie uma nova frente tática com marcos e tarefas dedicadas.
                  </span>
                </div>
              )}
            </>
            ) : (
              <div className="col-span-2 py-10 text-center">
                <Card className="py-8">
                  <Empty>
                    {tx.noProjects[curLang]}
                    <br />
                    {projFilter === 'ativos' && (
                      <button
                        type="button"
                        onClick={() => openProjectModal()}
                        className="btn-gold py-1.5 px-4 text-xs font-bold mt-3"
                      >
                        + CRIAR PRIMEIRO PROJETO
                      </button>
                    )}
                  </Empty>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
