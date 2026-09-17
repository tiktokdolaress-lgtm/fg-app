'use client';
import React, { useState } from 'react';
import { Plus, Pencil, X, CalendarDays, Ban, RotateCcw, Swords, Target } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Bar, Empty, WeekStrip, Field } from '@/components/ui';
import { PROJ_CATS, REPS, PRI_LBL } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, dstr, uid, fmtD, daysBetween } from '@/lib/utils';

const PRI_ORDER = { alta: 0, media: 1, baixa: 2 };
const REP_LBL_PT = { unica: '', diaria: '🔁 Diária', semana: '🔁 Seg–Sex', fds: '🔁 Sáb–Dom', semanal: '🔁 Semanal', custom: '🗓️ Personalizada' };

export default function OpsView() {
  const { S, update, openModal, closeModal, confirmBox, toast } = useApp();
  const lang = S.settings.lang;
  const T = (id, fb) => cx(lang, 'ops', id) || fb;
  const [thistOpen, setThistOpen] = useState({});

  const WD = () => [T('wd0', 'Dom'), T('wd1', 'Seg'), T('wd2', 'Ter'), T('wd3', 'Qua'), T('wd4', 'Qui'), T('wd5', 'Sex'), T('wd6', 'Sáb')];
  const repLbl = (t) => {
    const r = t.rep || 'unica';
    const wd = WD();
    if (r === 'semanal') return T('rep_semanal_prefix', '🔁 Semanal · ') + wd[t.repDay == null ? 1 : Number(t.repDay)];
    if (r === 'custom') {
      const ds = (t.repDays || []).slice().sort((a, b) => a - b);
      return T('rep_custom_prefix', '🗓 ') + (ds.length ? ds.map((i) => wd[i]).join(', ') : '—');
    }
    return T('rep_' + r, REP_LBL_PT[r]) || '';
  };
  const catLbl = (c) => { const i = PROJ_CATS.indexOf(c); return i >= 0 ? T('cat' + i, c) : c; };

  const toggleTask = (id) => {
    update((s) => {
      const t = s.tasks.find((x) => x.id == id); if (!t) return;
      if ((t.rep || 'unica') === 'unica') t.done = !t.done;
      else { const d = today(); t.doneDates = t.doneDates || []; const i = t.doneDates.indexOf(d); if (i >= 0) t.doneDates.splice(i, 1); else t.doneDates.push(d); }
    });
    AF.click();
  };

  /* ---- modal de tarefa (criar/editar) ---- */
  const taskModal = (t) => {
    const M = () => {
      const [txt, setTxt] = useState(t ? t.txt : '');
      const [pri, setPri] = useState(t ? t.pri : 'media');
      const [time, setTime] = useState(t ? t.time || '' : '');
      const [rep, setRep] = useState(t ? t.rep || 'unica' : 'unica');
      const [repDay, setRepDay] = useState(t && t.repDay != null ? Number(t.repDay) : 1);
      const [repDays, setRepDays] = useState(t ? (t.repDays || []) : []);
      const [proj, setProj] = useState(t ? t.proj : -1);
      return (
        <div>
          <span className="k">{t ? T('m_tEdit', '✏️ EDITAR OPERAÇÃO') : T('m_tNew', '🎯 NOVA OPERAÇÃO')}</span>
          <Field label={T('m_desc', 'Descrição')}><input className="field" maxLength={80} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder={T('m_descPh', 'Ex: 20 flexões ao acordar')} /></Field>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <label><span className="lbl">{T('m_pri', 'Prioridade')}</span><select className="field" value={pri} onChange={(e) => setPri(e.target.value)}>{Object.keys(PRI_LBL).map((p) => <option key={p} value={p}>{T('pri_' + p, PRI_LBL[p])}</option>)}</select></label>
            <label><span className="lbl">{T('m_time', 'Horário')}</span><input type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} /></label>
          </div>
          <Field label={T('m_rep', 'Repetição')}><select className="field" value={rep} onChange={(e) => setRep(e.target.value)}>{REPS.map(([v, l]) => <option key={v} value={v}>{T('rep_opt_' + v, l)}</option>)}</select></Field>
          {rep === 'semanal' && <Field label={T('m_repDay', 'Dia da semana (repete toda semana)')}><select className="field" value={repDay} onChange={(e) => setRepDay(Number(e.target.value))}>{WD().map((w, i) => <option key={i} value={i}>{w}</option>)}</select></Field>}
          {rep === 'custom' && (
            <div className="mb-3"><span className="lbl">{T('m_repDays', 'Dias da semana em que repete')}</span>
              <div className="flex flex-wrap gap-1.5">{WD().map((w, i) => <button key={i} type="button" className={`tag ${repDays.includes(i) ? 'sel' : ''}`} onClick={() => setRepDays((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i])}>{w}</button>)}</div>
            </div>
          )}
          <Field label={T('m_proj', 'Projeto vinculado')}><select className="field" value={proj} onChange={(e) => setProj(Number(e.target.value))}><option value={-1}>{T('m_noProj', 'Sem projeto')}</option>{S.projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => {
              if (!txt.trim()) { toast(T('m_errTxt', '⚠ Descreva a operação.')); return; }
              update((s) => {
                if (t) Object.assign(s.tasks.find((x) => x.id == t.id), { txt: txt.trim(), pri, time, rep, repDay, repDays, proj });
                else s.tasks.push({ id: uid(), txt: txt.trim(), pri, time, rep, repDay, repDays, proj, done: false, doneDates: [] });
              });
              closeModal(); toast(T('m_okTask', '🎯 Operação registrada.'));
            }}>{T('m_save', '💾 SALVAR')}</button>
            <button className="btn-dark" onClick={closeModal}>{T('m_cancel', 'Cancelar')}</button>
          </div>
        </div>
      );
    };
    openModal(<M />);
  };

  /* ---- modal de projeto (criar/editar) ---- */
  const projModal = (p) => {
    const M = () => {
      const [title, setTitle] = useState(p ? p.title : '');
      const [cat, setCat] = useState(p ? p.cat : PROJ_CATS[0]);
      const [start, setStart] = useState(p ? p.start || '' : today());
      const [days, setDays] = useState(p ? (p.start && p.deadline ? daysBetween(p.start, p.deadline) + 1 : '') : '');
      const [dead, setDead] = useState(p ? p.deadline || '' : '');
      const [tStart, setTStart] = useState(p ? p.tStart || '' : '');
      const [tEnd, setTEnd] = useState(p ? p.tEnd || '' : '');
      const syncDead = (st, dy) => { if (st && dy >= 1) setDead(dstr(new Date(L.parseD(st).getTime() + (dy - 1) * 86400000))); }
      return (
        <div>
          <span className="k">{p ? T('p_tEdit', '✏️ EDITAR PROJETO DE GUERRA') : T('p_tNew', '⚔️ NOVO PROJETO DE GUERRA')}</span>
          <Field label={T('p_name', 'Nome do projeto')}><input className="field" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <label><span className="lbl">{T('p_cat', 'Categoria')}</span><select className="field" value={cat} onChange={(e) => setCat(e.target.value)}>{PROJ_CATS.map((c) => <option key={c} value={c}>{catLbl(c)}</option>)}</select></label>
            <label><span className="lbl">{T('p_start', 'Data de início')}</span><input type="date" className="field" value={start} onChange={(e) => { setStart(e.target.value); if (days) syncDead(e.target.value, Number(days)); }} /></label>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <label><span className="lbl">{T('p_days', 'Duração (dias)')}</span><input type="number" min={1} max={3650} className="field" placeholder={T('p_daysPh', 'Ex: 30')} value={days} onChange={(e) => { setDays(e.target.value); syncDead(start, Number(e.target.value)); }} /></label>
            <label><span className="lbl">{T('p_end', 'Encerramento')}</span><input type="date" className="field" value={dead} onChange={(e) => { setDead(e.target.value); if (start && e.target.value) setDays(daysBetween(start, e.target.value) + 1); }} /></label>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <label><span className="lbl">{T('p_ws', 'Janela diária — início')}</span><input type="time" className="field" value={tStart} onChange={(e) => setTStart(e.target.value)} /></label>
            <label><span className="lbl">{T('p_we', 'Janela diária — fim')}</span><input type="time" className="field" value={tEnd} onChange={(e) => setTEnd(e.target.value)} /></label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => {
              if (!title.trim()) { toast(T('p_errName', '⚠ Dê um nome ao projeto.')); return; }
              update((s) => {
                if (p) Object.assign(s.projects.find((x) => x.id == p.id), { title: title.trim(), cat, start, deadline: dead, tStart, tEnd });
                else s.projects.push({ id: uid(), title: title.trim(), cat, start, deadline: dead, tStart, tEnd });
              });
              closeModal(); toast(T('p_okProj', '⚔️ Projeto de guerra criado.'));
            }}>{T('m_save', '💾 SALVAR')}</button>
            <button className="btn-dark" onClick={closeModal}>{T('m_cancel', 'Cancelar')}</button>
          </div>
        </div>
      );
    };
    openModal(<M />);
  };

  /* ---- dados do painel ---- */
  const rank = (t) => { const due = L.repDue(t, today()), dn = L.isDone(t, today()); if (due && !dn) return 0; if (due && dn) return 1; if (!due && !dn) return 2; return 3; };
  const tasks = S.tasks.slice().sort((a, b) => rank(a) - rank(b) || PRI_ORDER[a.pri] - PRI_ORDER[b.pri] || (a.time || '99').localeCompare(b.time || '99'));
  const st = { done: 0, prog: 0, late: 0, cancel: 0 };
  S.projects.forEach((p) => { st[L.projStatus(S, p)]++; });
  const totalProj = S.projects.length, ativos = totalProj - st.cancel;
  const dueTasks = S.tasks.filter((t) => L.repDue(t, today()));
  const doneTasks = dueTasks.filter((t) => L.isDone(t, today())).length;
  const pendTasks = dueTasks.length - doneTasks;
  const taxa = dueTasks.length ? Math.round((doneTasks / dueTasks.length) * 100) : 0;
  const segW = (n, tot) => (tot > 0 ? Math.round((n / tot) * 100) : 0) + '%';

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <button className="btn-gold min-w-[220px] flex-1 py-4 text-[15px]" onClick={() => projModal(null)}><Swords size={16} /> {T('btn_newProj', '+ CRIAR PROJETO')}</button>
        <button className="btn-gold min-w-[220px] flex-1 py-4 text-[15px]" onClick={() => taskModal(null)}><Target size={16} /> {T('btn_newTask', '+ ADICIONAR OPERAÇÃO')}</button>
      </div>

      <div className="grid gap-3.5 lg:grid-cols-[7fr_5fr]">
        <Card>
          <K>{T('k_proj', '🏰 PROJETOS DE GUERRA ATIVOS')}</K>
          {S.projects.length ? S.projects.map((p) => {
            const linked = S.tasks.filter((t) => t.proj == p.id);
            const denom = linked.filter((t) => (t.rep || 'unica') === 'unica' || L.repDue(t, today()));
            const done = denom.filter((t) => L.isDone(t, today())).length;
            const pct = denom.length ? Math.round((done / denom.length) * 100) : 0;
            const dleft = p.deadline ? daysBetween(today(), p.deadline) : null;
            const tot = L.projTotal(p), cur = L.projCurDay(p);
            return (
              <div key={p.id} className={`mb-3 rounded-r border p-3.5 ${p.cancelled ? 'border-line opacity-60' : 'border-line bg-surface2'}`}>
                <div className="flex items-center gap-2">
                  <b className="min-w-0 flex-1 truncate">{p.title}</b>
                  <button className="text-muted hover:text-gold" title={p.cancelled ? T('t_react', 'Reativar projeto') : T('t_cancelProj', 'Cancelar projeto')} onClick={() => update((s) => { const x = s.projects.find((y) => y.id == p.id); x.cancelled = !x.cancelled; })}>{p.cancelled ? <RotateCcw size={14} /> : <Ban size={14} />}</button>
                  <button className="text-muted hover:text-gold" title={T('t_editProj', 'Editar projeto')} onClick={() => projModal(p)}><Pencil size={14} /></button>
                  <button className="text-muted hover:text-danger" title={T('t_del', 'Excluir')} onClick={() => confirmBox(T('c_prTitle', 'EXCLUIR PROJETO?'), '"' + p.title + T('c_prBody2', '" e seus vínculos serão removidos.'), () => update((s) => { s.projects = s.projects.filter((x) => x.id != p.id); s.tasks.forEach((t) => { if (t.proj == p.id) t.proj = -1; }); }))}><X size={14} /></button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="chip-dim">{catLbl(p.cat)}</span>
                  {p.start && <span className="chip-dim">🚀 {fmtD(p.start)}</span>}
                  {p.deadline && <span className={`chip-dim ${dleft <= 3 ? 'border-danger text-danger' : ''}`}>🏁 {fmtD(p.deadline)}{dleft !== null ? (dleft < 0 ? T('chip_overdue', ' · vencido') : ' · ' + dleft + 'd') : ''}</span>}
                  {tot > 0 && <span className="chip-dim">⏳ {tot}{T('chip_days', ' dias')}</span>}
                  {(p.tStart || p.tEnd) && <span className="chip-dim">🕐 {p.tStart || '--:--'}–{p.tEnd || '--:--'}</span>}
                  {p.cancelled && <span className="chip-dim border-danger text-danger">{T('chip_cancelled', '🚫 CANCELADO')}</span>}
                </div>
                <div className="mt-2.5"><Bar pct={pct} /></div>
                <div className="mt-1 font-mono text-[11px] text-muted">{done}/{denom.length} {T('line_tasks', 'tarefas de hoje')} · {pct}%{tot ? T('line_day', ' · 📆 dia ') + cur + '/' + tot : ''}</div>
                {linked.length ? (
                  <div className="mt-2">
                    {linked.map((t) => (
                      <button key={t.id} className={`mb-1 flex w-full items-center gap-2 rounded-md border border-line bg-surface p-2 text-left text-[12.5px] font-semibold ${L.isDone(t, today()) ? 'opacity-60 line-through' : ''}`} onClick={() => toggleTask(t.id)}>
                        <span className={`h-3.5 w-3.5 flex-none rounded border ${L.isDone(t, today()) ? 'border-gold bg-gold' : 'border-[#3c3c46]'}`} />{t.txt}
                      </button>
                    ))}
                  </div>
                ) : <p className="mt-1 text-[11px] text-muted">{T('proj_linkHint', 'Vincule tarefas a este projeto ➜')}</p>}
              </div>
            );
          }) : <Empty>{T('empty_proj1', 'Nenhum projeto de guerra.')}<br />{T('empty_click', 'Clique em ')}<b className="text-gold">⚔️ {T('btn_newProj', '+ CRIAR PROJETO')}</b>{T('empty_suffix', ' acima.')}</Empty>}
        </Card>

        <Card>
          <K>{T('k_tasks', '🎯 OPERAÇÕES DIÁRIAS (TAREFAS)')}</K>
          {tasks.length ? tasks.map((t) => {
            const dn = L.isDone(t, today()), due = L.repDue(t, today());
            return (
              <div key={t.id}>
                <div className={`mb-1.5 flex items-center gap-2 rounded-r border border-line bg-surface2 p-2.5 text-[13.5px] font-semibold ${dn ? 'opacity-60' : ''} ${!due && !dn ? 'opacity-45' : ''}`}>
                  <button className={`h-[18px] w-[18px] flex-none rounded border-2 ${dn ? 'border-gold bg-gold' : 'border-[#3c3c46]'}`} onClick={() => toggleTask(t.id)} aria-label={T('aria_done', 'concluir')} />
                  <span className={`h-2.5 w-2.5 flex-none rounded-full ${{ alta: 'bg-danger', media: 'bg-gold', baixa: 'bg-muted' }[t.pri]}`} />
                  <button className="min-w-0 flex-1 truncate text-left" onClick={() => toggleTask(t.id)}>{t.txt}</button>
                  {t.rep && t.rep !== 'unica' && <span className="chip-dim flex-none px-1.5 py-0.5 text-[9px]">{repLbl(t)}</span>}
                  {t.time && <span className="flex-none font-mono text-[11px] text-gold2">{t.time}</span>}
                  <button className="flex-none text-muted hover:text-gold" title={T('t_hist', 'Histórico dos últimos 7 dias')} onClick={() => setThistOpen((o) => ({ ...o, [t.id]: !o[t.id] }))}><CalendarDays size={14} /></button>
                  <button className="flex-none text-muted hover:text-gold" title={T('t_editTask', 'Editar tarefa')} onClick={() => taskModal(t)}><Pencil size={14} /></button>
                  <button className="flex-none text-muted hover:text-danger" title={T('t_del', 'Excluir')} onClick={() => confirmBox(T('c_tkTitle', 'EXCLUIR OPERAÇÃO?'), '"' + t.txt + T('c_tkBody2', '" será removida.'), () => update((s) => { s.tasks = s.tasks.filter((x) => x.id != t.id); }))}><X size={14} /></button>
                </div>
                {thistOpen[t.id] && (
                  <div className="mb-2 pl-10 pr-3">
                    <WeekStrip
                      cells={Array.from({ length: 7 }).map((_, xi) => {
                        const ds = dstr(new Date(Date.now() - (6 - xi) * 86400000));
                        const done = L.isDone(t, ds);
                        const blocked = (t.rep || 'unica') === 'unica' && ds !== today();
                        return { d: ds, cls: done ? 'w' : blocked ? 'opacity-25' : '', lab: done ? T('ws_done', 'FEITO') : blocked ? T('ws_single', 'única (só hoje)') : T('ws_pend', 'pendente'), onClick: blocked ? () => {} : () => { update((s) => { const tt = s.tasks.find((x) => x.id == t.id); if ((tt.rep || 'unica') === 'unica') tt.done = !tt.done; else { tt.doneDates = tt.doneDates || []; const i = tt.doneDates.indexOf(ds); if (i >= 0) tt.doneDates.splice(i, 1); else tt.doneDates.push(ds); } }); } };
                      })}
                      hint={T('ws_hint', 'Toque num dia para alternar ✅ FEITO / não feito.')}
                    />
                  </div>
                )}
              </div>
            );
          }) : <Empty>{T('empty_task1', 'Nenhuma operação registrada.')}<br />{T('empty_click', 'Clique em ')}<b className="text-gold">🎯 {T('btn_newTask', '+ ADICIONAR OPERAÇÃO')}</b>{T('empty_suffix', ' acima.')}</Empty>}
        </Card>
      </div>

      <Card className="mt-4">
        <K>{T('k_panel', '📊 PAINEL TÁTICO & DESEMPENHO')}</K>
        <div className="mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{ativos}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">{T('kpi_active', 'Projetos Ativos')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{st.done}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">{T('kpi_done', 'Projetos Concluídos')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{taxa}%</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">{T('kpi_rate', 'Conclusão de Operações')}</small></div>
          <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{dueTasks.length}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">{T('kpi_today', 'Operações Hoje')}</small></div>
        </div>
        <div className="grid gap-3.5 md:grid-cols-2">
          <div className="rounded-r border border-line bg-surface2 p-3.5">
            <div className="k2 mb-2">{T('k2_status', 'Status dos Projetos')}</div>
            {totalProj > 0 ? (
              <>
                <div className="flex h-6 overflow-hidden rounded-full border border-line bg-[#202026]">
                  <i className="bg-ok" style={{ width: segW(st.done, totalProj) }} /><i className="bg-gold" style={{ width: segW(st.prog, totalProj) }} /><i className="bg-danger" style={{ width: segW(st.late, totalProj) }} /><i className="bg-muted" style={{ width: segW(st.cancel, totalProj) }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-muted"><span>{T('lg_done', '🟢 Concluídos (')}{st.done})</span><span>{T('lg_prog', '🟡 Em Andamento (')}{st.prog})</span><span>{T('lg_late', '🔴 Atrasados (')}{st.late})</span><span>{T('lg_cancel', '⚪ Cancelados (')}{st.cancel})</span></div>
              </>
            ) : <Empty>{T('empty_analyze', 'Nenhum projeto para analisar.')}</Empty>}
          </div>
          <div className="rounded-r border border-line bg-surface2 p-3.5">
            <div className="k2 mb-2">{T('k2_volume', 'Volume de Operações (Hoje)')}</div>
            {dueTasks.length > 0 ? (
              <>
                <div className="flex h-6 overflow-hidden rounded-full border border-line bg-[#202026]">
                  <i className="bg-ok" style={{ width: segW(doneTasks, dueTasks.length) }} /><i className="bg-muted" style={{ width: segW(pendTasks, dueTasks.length) }} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-muted"><span>{T('lg_tdone', '✅ Concluídas (')}{doneTasks})</span><span>{T('lg_tpend', '⏳ Pendentes (')}{pendTasks})</span></div>
              </>
            ) : <Empty>{T('empty_due', 'Nenhuma operação devida hoje.')}</Empty>}
          </div>
        </div>
      </Card>
    </div>
  );
}
