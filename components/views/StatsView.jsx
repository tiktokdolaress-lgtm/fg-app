'use client';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Share2, Clock3, Trophy } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import * as L from '@/lib/logic';
import { today, dstr, fdmy } from '@/lib/utils';

export default function StatsView() {
  const { S } = useApp();
  const [hmOff, setHmOff] = useState(0);

  const d = L.progressDays(S);
  const okDays = Object.values(S.checkins).filter((c) => c.ok).length;
  const forgeTotal = Object.values(S.forge.done).reduce((a, b) => a + b.length, 0);

  /* heatmap do mês */
  const now = new Date();
  const ref = new Date(now.getFullYear(), now.getMonth() + hmOff, 1);
  const y = ref.getFullYear(), m = ref.getMonth();
  const dim = new Date(y, m + 1, 0).getDate();
  const startW = new Date(y, m, 1).getDay();
  const grid = [];
  for (let i = 0; i < startW; i++) grid.push({ hidden: true });
  for (let day = 1; day <= dim; day++) {
    const ds = dstr(new Date(y, m, day));
    let cls = '';
    if (ds > today()) cls = 'lvx';
    else {
      const c = S.checkins[ds];
      if (!c) cls = '';
      else if (c.fail) cls = 'lvf';
      else if (c.ok) cls = 'lv3';
      else cls = 'lv' + ((c.p ? 1 : 0) + (c.m ? 1 : 0) + (c.r ? 1 : 0));
    }
    grid.push({ ds, cls });
  }

  /* consistência do mês */
  const elapsed = hmOff === 0 ? now.getDate() : new Date(y, m + 1, 0).getDate();
  const consist = S.forge.active.map((id) => {
    const h = L.allH(S).find((x) => x.id === id); if (!h) return null;
    let cnt = 0;
    for (let day = 1; day <= elapsed; day++) { const ds = dstr(new Date(y, m, day)); if ((S.forge.done[ds] || []).includes(id)) cnt++; }
    return { h, cnt, pct: Math.round((cnt / elapsed) * 100) };
  }).filter(Boolean);

  const sosHist = (Array.isArray(S.sosLog) ? S.sosLog.slice(-12).reverse() : []);
  const wr = L.weekReport(S);
  const us = L.urgeStats(S);
  const [hall, setHall] = useState(null);
  useEffect(() => { fetch('/api/hall').then((r) => r.json()).then(setHall).catch(() => setHall([])); }, []);

  const shareImage = () => {
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1080;
    const x = c.getContext('2d');
    x.fillStyle = '#0D0D0E'; x.fillRect(0, 0, 1080, 1080);
    x.strokeStyle = '#E5A93C'; x.lineWidth = 8; x.strokeRect(48, 48, 984, 984);
    x.textAlign = 'center';
    x.fillStyle = '#FFC846'; x.font = 'bold 62px sans-serif'; x.fillText('FORJANDO GUERREIROS ⚔', 540, 170);
    x.fillStyle = '#F5F5F7'; x.font = 'bold 40px sans-serif'; x.fillText('RELATÓRIO SEMANAL DE GUERRA', 540, 240);
    x.fillStyle = '#8E8E93'; x.font = '28px sans-serif';
    x.fillText(wr.days[0].split('-').reverse().slice(0, 2).join('/') + ' a ' + wr.days[6].split('-').reverse().slice(0, 2).join('/'), 540, 290);
    x.fillStyle = '#FFC846'; x.font = 'bold 120px sans-serif'; x.fillText(wr.daysTotal + ' DIAS', 540, 450);
    x.fillStyle = '#F5F5F7'; x.font = 'bold 44px sans-serif';
    x.fillText('🏆 ' + wr.wins + ' vitórias      💥 ' + wr.falls + ' quedas', 540, 570);
    x.fillText('🔥 streak ' + wr.streak + '      ✦ pureza ' + wr.purity + '%', 540, 650);
    x.fillText('🔨 consistência ' + wr.consist + '%      🛡 S.O.S ' + wr.sos, 540, 730);
    x.fillStyle = '#8E8E93'; x.font = 'italic 30px sans-serif';
    x.fillText('O impulso é passageiro. A honra é permanente.', 540, 860);
    x.fillStyle = '#E5A93C'; x.font = 'bold 30px sans-serif';
    x.fillText('forjandoguerreiros · reporte anônimo', 540, 960);
    c.toBlob((b) => {
      if (!b) return;
      const f = new File([b], 'relatorio-forjando-guerreiros.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: 'Relatório Semanal de Guerra' }).catch(() => {}); }
      else { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = f.name; a.click(); }
    }, 'image/png');
  };

  const KPIS = [
    [d, L.modeA(S) ? 'Sequência limpa' : 'Streak atual'],
    [S.best, 'Melhor streak'],
    [S.purity + '%', 'Score de pureza'],
    [okDays, 'Dias de pilares completos'],
    [forgeTotal, 'Hábitos forjados'],
    [S.sos || 0, 'S.O.S acionados'],
    ['🛡️ ' + L.sosWins(S), 'S.O.S vencidas'],
  ];

  return (
    <div>
      <div className="mb-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map(([v, lb], i) => (
          <div key={i} className="rounded-r border border-line bg-surface p-3 text-center">
            <b className="block font-display text-[26px] leading-none text-gold">{v}</b>
            <small className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">{lb}</small>
          </div>
        ))}
      </div>
      <div className="grid gap-3.5 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <K style={{ margin: 0 }}>MAPA — {ref.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</K>
            <div className="flex gap-1.5">
              <button className="chip-dim px-2 py-1" onClick={() => setHmOff(hmOff - 1)}><ChevronLeft size={14} /></button>
              <button className="chip-dim px-2 py-1" disabled={hmOff >= 0} style={hmOff >= 0 ? { opacity: .35 } : {}} onClick={() => setHmOff(Math.min(0, hmOff + 1))}><ChevronRight size={14} /></button>
            </div>
          </div>
          <div className="hm">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((w, i) => <b key={'w' + i} className="grid place-items-center border-none bg-transparent text-[9px] text-muted">{w}</b>)}
            {grid.map((c, i) => c.hidden ? <b key={i} className="invisible" /> : <b key={i} className={c.cls} title={c.ds} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-muted">
            <span><b className="lv1 mr-1 inline-block h-3 w-3 rounded bg-gold/25" />1 pilar</span>
            <span><b className="lv2 mr-1 inline-block h-3 w-3 rounded bg-gold/50" />2 pilares</span>
            <span><b className="lv3 mr-1 inline-block h-3 w-3 rounded bg-gold" />completo</span>
            <span><b className="lvf mr-1 inline-block h-3 w-3 rounded bg-danger/60" />queda</span>
            <span><b className="mr-1 inline-block h-3 w-3 rounded bg-[#202026]" />sem registro</span>
          </div>
        </Card>
        <Card>
          <K>🔨 CONSISTÊNCIA DA FORJA — MÊS ATUAL</K>
          {consist.length ? consist.map((c) => (
            <div key={c.h.id} className="mb-2.5">
              <div className="mb-1 flex justify-between text-[12px] font-bold"><span>{c.h.icon} {c.h.n}</span><span className="font-mono text-muted">{c.cnt}/{elapsed} · {c.pct}%</span></div>
              <div className="bar"><i style={{ width: c.pct + '%' }} /></div>
            </div>
          )) : <Empty>Ative hábitos na Forja para medir consistência.</Empty>}
        </Card>
        <Card className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <K style={{ margin: 0 }}>📜 RELATÓRIO SEMANAL DE GUERRA (ÚLTIMOS 7 DIAS)</K>
            <button className="btn-ghost px-3 py-2 text-[12px]" onClick={shareImage}><Share2 size={14} /> COMPARTILHAR IMAGEM</button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-ok">{wr.wins}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Vitórias</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-danger">{wr.falls}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Quedas</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">{wr.consist}%</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">Consistência Forja</small></div>
            <div className="rounded-r border border-line bg-surface2 p-3 text-center"><b className="block font-display text-2xl text-gold">🛡 {wr.sos}</b><small className="text-[9.5px] font-extrabold uppercase tracking-[.12em] text-muted">S.O.S vencidas</small></div>
          </div>
          <p className="fnote" style={{ textAlign: 'left' }}>Parciais: {wr.part} · Sem registro: {wr.none} · Pureza atual: {wr.purity}% · Streak: {wr.streak} · Hábitos concluídos: {wr.habDone}{wr.habPossible ? '/' + wr.habPossible : ''}. Todo domingo você recebe um push avisando que o relatório está pronto.</p>
        </Card>

        <Card>
          <K><Clock3 size={12} className="mr-1 inline" /> MAPA DE RISCO POR HORÁRIO</K>
          {us.total ? (
            <>
              <div className="grid grid-cols-12 gap-1">
                {us.buckets.map((b, h) => {
                  const max = Math.max(1, ...us.buckets.map((y) => y.sum + y.n));
                  const lvl = (b.sum + b.n) / max;
                  return <b key={h} title={h + 'h · ' + b.n + ' registro(s)'} className="aspect-square rounded border border-line" style={{ background: lvl > 0 ? `rgba(255,77,77,${0.15 + lvl * 0.85})` : '#202026' }} />;
                })}
              </div>
              <p className="mt-3 text-[12.5px] font-bold text-danger">🎯 Sua janela de risco: {us.window[0]}h – {us.window[1]}h</p>
              <p className="fnote" style={{ textAlign: 'left' }}>{us.total} impulso(s) registrado(s) no S.O.S. Reforce suas defesas (hábitos, ambiente, celular fora do quarto) nessa janela.</p>
            </>
          ) : (
            <Empty>Acione o S.O.S e registre a intensidade do impulso (1–10).<br />Com alguns registros, seu mapa de risco por horário aparece aqui.</Empty>
          )}
        </Card>

        <Card>
          <K><Trophy size={12} className="mr-1 inline" /> SALÃO DA FAMA ANÔNIMO</K>
          {hall === null ? <Empty>Carregando...</Empty> : hall.length ? (
            <div className="max-h-[260px] space-y-1.5 overflow-y-auto pr-1">
              {hall.map((h, i) => (
                <div key={i} className={`flex items-center gap-2.5 rounded-r border p-2 text-[12.5px] font-bold ${h.name === S.hallName ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface2'}`}>
                  <span className="w-7 text-center font-display text-[15px] text-gold2">{i + 1}º</span>
                  <span className="flex-1 truncate">{h.name} {h.name === S.hallName ? '(você)' : ''}</span>
                  <span>{h.tier}</span>
                  <span className="font-mono text-gold">{h.days}d</span>
                </div>
              ))}
            </div>
          ) : <Empty>Nenhum guerreiro optou pelo Salão ainda.<br />Ative nas Configurações para entrar no ranking anônimo.</Empty>}
          <p className="fnote" style={{ textAlign: 'left' }}>Ranking opcional com pseudônimos — sem nomes, sem e-mails, sem fotos. Só dias e patamar.</p>
        </Card>

        <Card className="lg:col-span-2">
          <K><ShieldCheck size={12} className="mr-1 inline" /> HISTÓRICO DE INTERVENÇÕES S.O.S VENCIDAS</K>
          {sosHist.length ? sosHist.map((e, i) => (
            <div key={i} className="mb-1.5 flex justify-between rounded-r border border-line bg-surface2 p-2.5 text-[12.5px] font-semibold">
              <b>🛡️ Intervenção S.O.S Vencida</b>
              <span className="font-mono text-[11px] text-muted">{fdmy(e.d || dstr(new Date(e.ts || Date.now())))} · {e.h || '--:--'}</span>
            </div>
          )) : <Empty>Nenhuma intervenção S.O.S vencida ainda.<br />Quando você concluir um protocolo de emergência, o registro aparece aqui com data e hora.</Empty>}
        </Card>
      </div>
    </div>
  );
}
