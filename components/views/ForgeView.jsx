'use client';
import React, { useState } from 'react';
import { Plus, Flame, Clock, Check, X, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, Sparkles, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { FORGE_RULES, DEFAULT_HABITS } from '@/lib/data';
import { cxHabits } from '@/lib/content-i18n';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';

export default function ForgeView() {
  const { S, update, t, openModal, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const [openDetail, setOpenDetail] = useState(null);

  const ALLH = cxHabits(lang, L.allH(S));
  const d = L.progressDays(S);
  const maxSlots = L.forgeSlots(d);
  const activeIds = S.forge.active || [];
  const activeCount = activeIds.length;
  const fd = L.fDone(S, today()), ff = L.fFailed(S, today());

  /* Separar ativos e reserva */
  const activeHabits = activeIds.map((id) => ALLH.find((h) => h.id === id)).filter(Boolean);
  const reserveHabits = ALLH.filter((h) => !activeIds.includes(h.id));

  /* Hábitos negligenciados (sem fazer há mais de 1 dia) */
  const neglected = activeHabits.filter((h) => {
    const daysSince = L.hDaysSince(S, h.id);
    return daysSince >= 2;
  });

  /* Toggle Ativar / Desativar Hábito */
  const toggleActive = (id) => {
    if (activeIds.includes(id)) {
      update((s) => {
        s.forge.active = s.forge.active.filter((x) => x !== id);
      });
      AF.click();
      toast(t('hab_rem') || 'Hábito movido para a reserva');
    } else {
      if (activeCount >= maxSlots) {
        toast(t('slot_full') || `Limite de ${maxSlots} slots atingido!`);
        AF.tone(110, 0.35, 'sine', 0.18, 0, 55);
        return;
      }
      update((s) => {
        s.forge.active.push(id);
      });
      AF.click();
      toast(t('hab_act') || 'Hábito ativado no protocolo');
    }
  };

  /* Toggle Concluído */
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

  /* Toggle Falho */
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

  /* Salvar Horário */
  const setTime = (id, time) => {
    update((s) => {
      s.forge.times = s.forge.times || {};
      s.forge.times[id] = time;
    });
  };

  /* Modal Criar Hábito */
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

  return (
    <div className="grid gap-3.5">
      {/* 1. TOPO COMPACTO: Regras de Desbloqueio e Slots */}
      <Card className="p-3.5 sm:p-4 border-gold/30 bg-surface2/60">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Regras de Slots */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <K className="mb-0">REGRAS DE SLOTS POR PATAMAR</K>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-gold font-bold">
                {activeCount}/{maxSlots} SLOTS ATIVOS
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-muted">
              {FORGE_RULES.map((r, i) => {
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

          {/* Botão de Criação */}
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

      {/* 2. ALERTA DE NEGLIGÊNCIA COMPACTO (Apenas se houver hábitos atrasados) */}
      {neglected.length > 0 && (
        <Card className="border-danger/40 bg-danger/5 p-3.5">
          <div className="flex items-center gap-1.5 mb-2 text-danger font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>ALERTA DE NEGLIGÊNCIA — A FORJA ESFRIA</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {neglected.map((h) => {
              const daysSince = L.hDaysSince(S, h.id);
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-2 p-2 rounded border border-danger/30 bg-surface2 text-xs"
                >
                  <span className="flex items-center gap-1.5 truncate font-semibold">
                    <span>{h.icon}</span>
                    <span className="truncate">{h.n}</span>
                  </span>
                  <span className="flex-none font-mono text-[10.5px] font-bold text-danger">
                    {daysSince}d sem fazer
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[10.5px] text-muted">
            Guerreiro que desaparece do treino vira estatística. Retome HOJE.
          </p>
        </Card>
      )}

      {/* 3. ATIVOS NO PROTOCOLO (Grade de 2 Colunas Limpa & Proporcional) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <K className="mb-0">⚡ ATIVOS NO PROTOCOLO ({activeCount}/{maxSlots} SLOTS)</K>
        </div>

        {activeHabits.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {activeHabits.map((h) => {
              const isDone = fd.includes(h.id);
              const isFail = ff.includes(h.id);
              const tm = L.hTime(S, h.id) || '';
              const daysSince = L.hDaysSince(S, h.id);
              const isDetailOpen = openDetail === h.id;

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
                  {/* Cabeçalho do Card */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl flex-none">{h.icon}</span>
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-[13.5px] font-bold block truncate ${isDone ? 'text-gold' : isFail ? 'text-danger' : 'text-ink'}`}>
                          {h.n}
                        </span>
                        <span className="text-[9.5px] uppercase font-mono text-muted">
                          #{h.id.slice(-4)} · NO PROTOCOLO
                        </span>
                      </div>
                    </div>

                    {/* Switch de Ativação */}
                    <button
                      type="button"
                      title="Mover para a Reserva"
                      onClick={() => toggleActive(h.id)}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 transition-colors"
                    >
                      ATIVO
                    </button>
                  </div>

                  {/* Linha de Ação: Checkbox + Horário + Botão Falhei */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/50">
                    {/* Botão Concluído Hoje */}
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
                      <span>{isDone ? 'CONCLUÍDO' : 'CONCLUIR HOJE'}</span>
                    </button>

                    {/* Campo de Horário */}
                    <div className="flex items-center gap-1 bg-surface px-2 py-1 rounded border border-line text-[11px] font-mono">
                      <Clock size={11} className="text-gold" />
                      <input
                        type="time"
                        value={tm}
                        onChange={(e) => setTime(h.id, e.target.value)}
                        className="bg-transparent text-ink focus:outline-none w-[58px]"
                      />
                    </div>

                    {/* Botão Falhei */}
                    <button
                      type="button"
                      title="Marcar como Falho"
                      onClick={() => toggleFailed(h.id)}
                      className={`flex-none py-1.5 px-2 rounded border text-[11px] font-bold transition-all flex items-center gap-1 ${
                        isFail
                          ? 'border-danger bg-danger text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                          : 'border-line bg-surface text-danger/80 hover:border-danger hover:text-danger'
                      }`}
                    >
                      <X size={12} strokeWidth={2.5} />
                      <span className="hidden sm:inline">FALHEI</span>
                    </button>
                  </div>

                  {/* Alerta de Dias Sem Fazer (se houver) */}
                  {daysSince >= 2 && (
                    <div className="mt-2 text-[10px] text-danger font-bold flex items-center gap-1">
                      <AlertTriangle size={11} />
                      <span>{daysSince} dias sem fazer</span>
                    </div>
                  )}

                  {/* Detalhes Colapsáveis de Benefício */}
                  {h.benefit && (
                    <div className="mt-2 pt-1.5 border-t border-line/30">
                      <button
                        type="button"
                        onClick={() => setOpenDetail(isDetailOpen ? null : h.id)}
                        className="text-[10px] text-muted hover:text-gold flex items-center justify-between w-full font-mono"
                      >
                        <span>{isDetailOpen ? 'Ocultar benefícios' : 'Ver benefícios & proteção'}</span>
                        {isDetailOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                      {isDetailOpen && (
                        <p className="mt-1 text-[10.5px] text-[#dedee5] bg-surface p-2 rounded border border-line leading-relaxed">
                          {h.benefit}
                        </p>
                      )}
                    </div>
                  )}
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

      {/* 4. RESERVA DA FORJA (Grade Tática em 3 Colunas no PC) */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <K className="mb-0">📦 RESERVA DA FORJA ({reserveHabits.length} DISPONÍVEIS)</K>
          <span className="text-[10px] text-muted font-mono">Clique no switch para ativar no protocolo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {reserveHabits.map((h) => {
            const isDetailOpen = openDetail === h.id;

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

                  {/* Switch para Ativar */}
                  <button
                    type="button"
                    title="Ativar no Protocolo"
                    onClick={() => toggleActive(h.id)}
                    className="flex-none text-[10px] font-mono px-2 py-0.5 rounded border border-line bg-surface text-muted hover:border-gold hover:text-gold transition-colors font-bold"
                  >
                    + ATIVAR
                  </button>
                </div>

                {/* Benefício rápido */}
                {h.benefit && (
                  <div className="mt-1.5 pt-1 border-t border-line/30">
                    <button
                      type="button"
                      onClick={() => setOpenDetail(isDetailOpen ? null : h.id)}
                      className="text-[9.5px] text-muted hover:text-gold flex items-center justify-between w-full font-mono"
                    >
                      <span>{isDetailOpen ? 'Fechar' : 'Benefício'}</span>
                      {isDetailOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                    {isDetailOpen && (
                      <p className="mt-1 text-[10px] text-muted bg-surface p-1.5 rounded border border-line leading-tight">
                        {h.benefit}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
