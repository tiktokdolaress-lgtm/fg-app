'use client';
import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, Calendar, Flag, Folder, Layers, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr } from '@/lib/utils';
import { AF } from '@/lib/audio';
import * as L from '@/lib/logic';

const I18N = {
  title: { pt: 'OPERAÇÕES & TAREFAS', en: 'OPERATIONS & TASKS', es: 'OPERACIONES Y TAREAS' },
  subtitle: { pt: 'Canalize sua energia em missões concretas.', en: 'Channel your energy into concrete missions.', es: 'Canaliza tu energía en misiones concretas.' },
  newTask: { pt: 'NOVA OPERAÇÃO', en: 'NEW OPERATION', es: 'NUEVA OPERACIÓN' },
  taskPh: { pt: 'Ex: Concluir relatório financeiro...', en: 'Ex: Complete financial report...', es: 'Ej: Completar informe financiero...' },
  priority: { pt: 'Prioridade', en: 'Priority', es: 'Prioridad' },
  priHigh: { pt: 'Alta (Guerra)', en: 'High (War)', es: 'Alta (Guerra)' },
  priMed: { pt: 'Média', en: 'Medium', es: 'Media' },
  priLow: { pt: 'Baixa', en: 'Low', es: 'Baja' },
  time: { pt: 'Horário (Opcional)', en: 'Time (Optional)', es: 'Horario (Opcional)' },
  repeat: { pt: 'Frequência', en: 'Frequency', es: 'Frecuencia' },
  repOnce: { pt: 'Única', en: 'Once', es: 'Única' },
  repDaily: { pt: 'Diária', en: 'Daily', es: 'Diaria' },
  addBtn: { pt: '+ CRIAR OPERAÇÃO', en: '+ CREATE OPERATION', es: '+ CREAR OPERACIÓN' },
  filterAll: { pt: 'Todas', en: 'All', es: 'Todas' },
  filterToday: { pt: 'Para Hoje', en: 'For Today', es: 'Para Hoy' },
  filterDone: { pt: 'Concluídas', en: 'Completed', es: 'Completadas' },
  progress: { pt: 'Progresso do Dia', en: 'Today\'s Progress', es: 'Progreso del Día' },
  noTasks: { pt: 'Nenhuma operação nesta categoria.', en: 'No operations in this category.', es: 'Ninguna operación en esta categoría.' },
};

export default function OpsView() {
  const { S, update, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [txt, setTxt] = useState('');
  const [pri, setPri] = useState('media');
  const [time, setTime] = useState('');
  const [rep, setRep] = useState('unica');
  const [filter, setFilter] = useState('today');

  const tasks = S.tasks || [];
  const todayTasks = tasks.filter((x) => L.repDue(x, today()));
  const completedToday = todayTasks.filter((x) => L.isDone(x, today())).length;
  const pct = todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  const addTask = (e) => {
    e.preventDefault();
    if (!txt.trim()) return toast('Digite a descrição da operação');
    update((s) => {
      s.tasks = s.tasks || [];
      s.tasks.push({
        id: 'task_' + Date.now(),
        txt: txt.trim(),
        pri,
        time: time || '',
        rep,
        done: false,
        doneDates: [],
        createdAt: today(),
      });
    });
    setTxt('');
    setTime('');
    AF.click();
    toast('✅ Operação registrada!');
  };

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

  const deleteTask = (id) => {
    update((s) => {
      s.tasks = (s.tasks || []).filter((x) => String(x.id) !== String(id));
    });
    AF.click();
    toast('Operação removida');
  };

  /* Filtros de tarefas */
  const displayedTasks = tasks.filter((x) => {
    const isDone = L.isDone(x, today());
    if (filter === 'done') return isDone;
    if (filter === 'today') return L.repDue(x, today()) && !isDone;
    return true;
  });

  return (
    <div className="grid gap-3.5">
      {/* 1. TOPO COMPACTO */}
      <Card className="border-gold/30 bg-surface2/60 p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <K className="mb-0.5">🎯 {tx.title[curLang]}</K>
            <p className="text-xs text-muted">{tx.subtitle[curLang]}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-muted uppercase block">{tx.progress[curLang]}</span>
              <b className="text-sm font-mono text-gold">{completedToday}/{todayTasks.length} ({pct}%)</b>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5 font-mono text-xs font-bold text-gold">
              {pct}%
            </div>
          </div>
        </div>
      </Card>

      {/* 2. GRADE NO PC (5 Colunas: Formulário / 7 Colunas: Lista) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* COLUNA ESQUERDA: Formulário de Nova Operação */}
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
                  value={txt}
                  onChange={(e) => setTxt(e.target.value)}
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

              <div>
                <span className="lbl mb-1 block">{tx.time[curLang]}:</span>
                <input
                  type="time"
                  className="field w-full text-xs font-mono"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
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

        {/* COLUNA DIREITA: Lista de Operações & Filtros */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <Card className="p-3.5 sm:p-4">
            {/* Abas Rápidas de Filtro */}
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

            {/* Lista de Operações */}
            {displayedTasks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {displayedTasks.map((tItem) => {
                  const isDone = L.isDone(tItem, today());
                  const priColor = {
                    alta: 'border-danger/40 bg-danger/5 text-danger',
                    media: 'border-gold/40 bg-gold/5 text-gold',
                    baixa: 'border-line bg-surface text-muted',
                  }[tItem.pri] || 'border-line text-muted';

                  return (
                    <div
                      key={tItem.id}
                      className={`flex items-center justify-between gap-2.5 p-2.5 rounded-r border transition-all ${
                        isDone
                          ? 'border-line/40 bg-surface/50 opacity-60'
                          : 'border-line bg-surface2/80 hover:border-gold/40'
                      }`}
                    >
                      {/* Checkbox & Texto */}
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
                          <div className="flex items-center gap-2 mt-0.5 text-[9.5px] font-mono text-muted">
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
                          </div>
                        </div>
                      </div>

                      {/* Excluir */}
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
    </div>
  );
}
