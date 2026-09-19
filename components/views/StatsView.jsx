'use client';
import React, { useState } from 'react';
import { Flame, ShieldAlert, BarChart3, TrendingUp, Calendar, AlertTriangle, MessageSquare, Award, Clock } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import * as L from '@/lib/logic';

const TRIGGER_NAMES = {
  chat_mulheres: '💬 Conversas Imundas / Sexting',
  tedio: '🥱 Tédio e tempo ocioso',
  ansiedade: '⚡ Ansiedade / Estresse',
  reels: '📱 Redes sociais / Reels / TikTok',
  solidao: '🌙 Solidão / Madrugada no celular',
  cansaco: '🧠 Cansaço mental / Fuga',
  cama: '🛏️ Enrolando na cama ao acordar',
  álcool: '🍺 Álcool / Balada / Desinibição',
};

export default function StatsView() {
  const { S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';

  const d = L.progressDays(S);
  const relapses = S.relapses || [];
  const totalRelapses = relapses.length;

  /* Contabilizar os maiores gatilhos */
  const triggerCounts = {};
  relapses.forEach((r) => {
    (r.triggers || []).forEach((tg) => {
      triggerCounts[tg] = (triggerCounts[tg] || 0) + 1;
    });
  });

  const sortedTriggers = Object.entries(triggerCounts)
    .map(([key, count]) => ({
      key,
      name: TRIGGER_NAMES[key] || key,
      count,
      pct: totalRelapses ? Math.round((count / totalRelapses) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  /* Média de dias entre quedas */
  const avgStreak = totalRelapses
    ? Math.round(relapses.reduce((acc, r) => acc + (r.streakDays || 0), 0) / totalRelapses)
    : d;

  return (
    <div className="grid gap-3.5">
      {/* 1. TOPO: RESUMO TÁTICO DE COMBATE */}
      <Card className="border-gold/30 bg-surface2/60 p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <K className="mb-0.5">📊 RELATÓRIOS DE COMBATE & AUDITORIA</K>
            <p className="text-xs text-muted">Inteligência comportamental: conheça o inimigo para não cair no mesmo erro.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-1.5 rounded bg-surface border border-line">
              <span className="text-[9.5px] font-mono text-muted uppercase block">Streak Atual</span>
              <b className="text-sm font-mono text-gold">{d} Dias</b>
            </div>
            <div className="text-center px-3 py-1.5 rounded bg-surface border border-line">
              <span className="text-[9.5px] font-mono text-muted uppercase block">Total Quedas</span>
              <b className="text-sm font-mono text-danger">{totalRelapses}</b>
            </div>
            <div className="text-center px-3 py-1.5 rounded bg-surface border border-line">
              <span className="text-[9.5px] font-mono text-muted uppercase block">Média Dias</span>
              <b className="text-sm font-mono text-ink">{avgStreak}d</b>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. O QUE MAIS TE FAZ CAIR: RANKING DE GATILHOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* COLUNA ESQUERDA (5 Colunas): Análise dos Maiores Inimigos */}
        <div className="lg:col-span-5">
          <Card className="p-3.5 sm:p-4 border-danger/30 bg-surface2/80">
            <div className="flex items-center gap-2 mb-2 text-danger font-bold text-xs uppercase tracking-wider">
              <ShieldAlert size={16} />
              <span>O QUE MAIS TE FAZ CAIR (RANKING)</span>
            </div>
            <p className="text-xs text-muted mb-3.5">
              Gatilhos mapeados que desarmaram seu córtex pré-frontal e provocaram recaídas:
            </p>

            {sortedTriggers.length > 0 ? (
              <div className="space-y-3">
                {sortedTriggers.map((tg, idx) => (
                  <div key={tg.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-ink truncate pr-2">
                        #{idx + 1} {tg.name}
                      </span>
                      <span className="font-mono text-[11px] text-danger font-bold flex-none">
                        {tg.count}x ({tg.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface overflow-hidden border border-line">
                      <div
                        className="h-full bg-danger transition-all duration-300"
                        style={{ width: `${tg.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted">
                Nenhum gatilho registrado ainda. Mantenha a vigilância total!
              </div>
            )}
          </Card>
        </div>

        {/* COLUNA DIREITA (7 Colunas): Dossiê Histórico de Quedas e Desabafos */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <Card className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-line/60">
              <K className="mb-0">💀 DOSSIÊ HISTÓRICO DE QUEDAS ({relapses.length})</K>
            </div>

            {relapses.length > 0 ? (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {relapses.map((r, idx) => (
                  <div
                    key={r.id || idx}
                    className="p-3 rounded-r border border-danger/30 bg-surface2/60 space-y-2"
                  >
                    {/* Linha de topo */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">
                          {fmtD(r.date || today())} {r.time && `às ${r.time}`}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/30 font-bold">
                          Interrompeu {r.streakDays || 0} dias
                        </span>
                      </div>
                    </div>

                    {/* Tags dos Gatilhos desta queda */}
                    {r.triggers && r.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {r.triggers.map((tgKey) => (
                          <span
                            key={tgKey}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-muted font-semibold"
                          >
                            {TRIGGER_NAMES[tgKey] || tgKey}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Desabafo registrado */}
                    {r.note && (
                      <div className="bg-surface/80 p-2.5 rounded border border-line/40 text-xs text-[#dedee5] leading-relaxed font-sans">
                        <span className="text-[9.5px] font-mono text-gold uppercase block mb-0.5">
                          Desabafo / Reflexão da Queda:
                        </span>
                        {r.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <Empty>
                  Nenhuma queda registrada no dossiê militar.<br />
                  Permaneça inabalável. O templo permanece erguido!
                </Empty>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
