'use client';
import React, { useState } from 'react';
import { Hammer, Info, CalendarDays, Plus, Pencil, X, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Toggle, Chk, Empty, WeekStrip } from '@/components/ui';
import { HABIT_ICONS, TIERS } from '@/lib/data';
import * as L from '@/lib/logic';
import { AF, SFX } from '@/lib/audio';
import { today, dstr, uid, fdmy, yesterday } from '@/lib/utils';
import { cxHab, cxHabits, cxTiers } from '@/lib/content-i18n';

export default function ForgeView() {
  const { S, update, openModal, closeModal, confirmBox, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const [histOpen, setHistOpen] = useState({});
  const [accOpen, setAccOpen] = useState({});
  const d = L.progressDays(S), tier = L.tierNow(S);
  const tiers = cxTiers(lang, TIERS);
  const used = S.forge.active.length;
  const warns = L.forgeWarnings(S).map((w) => ({ ...w, h: cxHab(lang, w.h) }));
  const fd = L.fDone(S, today()), ff = L.fFailed(S, today());

  const toggle = (id) => {
    update((s) => {
      const i = s.forge.active.indexOf(id);
      if (i >= 0) { s.forge.active.splice(i, 1); delete (s.forge.since = s.forge.since || {})[id]; }
      else {
        if (s.forge.active.length >= L.slotLimit(s)) { AF.tone(120, 0.2, 'square', 0.1); return; }
        s.forge.active.push(id); s.forge.since = s.forge.since || {}; s.forge.since[id] = s.forge.since[id] || today();
      }
    });
    if (S.forge.active.includes(id)) toast('Hábito removido do protocolo.');
    else if (used >= tier.slots) toast('🔒 Limite de slots atingido (' + tier.slots + '). Avance nos patamares para desbloquear mais.');
    else { toast('🔨 Hábito ativado na Forja.'); SFX.hammer(); }
  };

  const habitModal = (h) => {
    let icon = h ? h.icon : '🛠';
    const M = () => {
      const [, force] = useState(0);
      const [name, setName] = useState(h ? h.n : '');
      const [b, setB] = useState(h ? h.b : '');
      const [p, setP] = useState(h ? h.p : '');
      return (
        <div>
          <span className="k">{h ? '✏️ EDITAR HÁBITO PERSONALIZADO' : '🛠 FORJAR NOVO HÁBITO'}</span>
          <span className="lbl">Ícone do hábito — escolha um ou digite outro</span>
          <div className="mb-2 flex max-h-[122px] flex-wrap gap-1.5 overflow-y-auto rounded-r border border-line bg-surface2 p-2">
            {HABIT_ICONS.map((ic, i) => (
              <button key={i} type="button" className={`grid h-9 w-9 place-items-center rounded-md border text-lg ${icon === ic ? 'border-gold bg-gold/20' : 'border-line'}`} onClick={() => { icon = ic; force((x) => x + 1); }}>{ic}</button>
            ))}
          </div>
          <input className="field mb-3" maxLength={4} placeholder="Ou digite um emoji..." value={icon} onChange={(e) => { icon = e.target.value; force((x) => x + 1); }} />
          <label className="mb-3 block"><span className="lbl">Nome do hábito *</span><input className="field" maxLength={40} placeholder="Ex: Cold Shower 5min" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="mb-3 block"><span className="lbl">Impacto fisiológico / mental</span><textarea className="field" maxLength={220} placeholder="O que este hábito faz pelo seu corpo e mente..." value={b} onChange={(e) => setB(e.target.value)} /></label>
          <label className="mb-3 block"><span className="lbl">Como protege os 3 pilares</span><textarea className="field" maxLength={220} placeholder="Como ele mata o impulso / blinda a retenção..." value={p} onChange={(e) => setP(e.target.value)} /></label>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-gold" onClick={() => {
              if (!name.trim()) { toast('⚠ Dê um nome ao hábito.'); return; }
              update((s) => {
                s.forge.custom = s.forge.custom || [];
                if (h) { const c = s.forge.custom.find((x) => x.id === h.id); if (c) Object.assign(c, { icon, n: name.trim(), b, p }); }
                else s.forge.custom.push({ id: uid(), custom: true, icon, n: name.trim(), b, p });
              });
              closeModal(); toast('🛠 Hábito forjado.');
            }}>💾 {h ? 'SALVAR' : 'FORJAR HÁBITO'}</button>
            <button className="btn-dark" onClick={closeModal}>Cancelar</button>
          </div>
          <p className="fnote">Hábitos personalizados seguem a mesma regra de liberação de slots do seu patamar.</p>
        </div>
      );
    };
    openModal(<M />);
  };

  const card = (h, i) => {
    const active = S.forge.active.includes(h.id);
    const done = fd.includes(h.id), isF = ff.includes(h.id), tm = L.hTime(S, h.id);
    const miss = active ? L.habitMiss(S, h.id) : 0;
    return (
      <Card key={h.id} className={`${active ? 'border-gold/40' : 'opacity-90'}`} >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{h.icon}</span>
          <div className="min-w-0 flex-1">
            <b className="block truncate text-[14.5px]">{h.n}</b>
            <small className="font-mono text-[10px] text-muted">{h.custom ? '★ PERSONALIZADO' : '#' + String(h.id).padStart(2, '0')} {active ? '· NO PROTOCOLO' : '· RESERVA'}</small>
          </div>
          {h.custom && (
            <span className="flex gap-1">
              <button className="text-muted hover:text-gold" title="Editar hábito" onClick={() => habitModal(h)}><Pencil size={15} /></button>
              <button className="text-muted hover:text-danger" title="Excluir hábito" onClick={() => confirmBox('EXCLUIR HÁBITO?', '"' + h.n + '" será removido da Forja.', () => update((s) => { s.forge.custom = (s.forge.custom || []).filter((x) => x.id !== h.id); s.forge.active = s.forge.active.filter((x) => x !== h.id); }))}><X size={15} /></button>
            </span>
          )}
          <Toggle on={active} onChange={() => toggle(h.id)} />
        </div>
        {active && (
          <div className="mt-3">
            <Chk on={done} onClick={() => { update((s) => { const dd = today(); const a = s.forge.done[dd] = s.forge.done[dd] || []; const i2 = a.indexOf(h.id); if (i2 >= 0) a.splice(i2, 1); else { a.push(h.id); const f = s.forge.failed[dd] = s.forge.failed[dd] || []; const fi = f.indexOf(h.id); if (fi >= 0) f.splice(fi, 1); } }); AF.click(); }}>Concluído hoje</Chk>
            <div className="mt-2 flex items-end gap-2">
              <label className="flex-1"><span className="k2">Horário (vazio = livre)</span>
                <input type="time" className="field mt-1" value={tm} onChange={(e) => update((s) => { s.forge.times = s.forge.times || {}; s.forge.times[h.id] = e.target.value || ''; })} /></label>
              <button className={`chip flex-none ${isF ? 'border-danger text-danger' : ''}`} style={isF ? { borderColor: 'var(--danger, #FF4D4D)', color: '#FF4D4D', background: 'rgba(255,77,77,.08)' } : {}} onClick={() => { update((s) => { const dd = today(); s.forge.failed = s.forge.failed || {}; const a = s.forge.failed[dd] = s.forge.failed[dd] || []; const i2 = a.indexOf(h.id); if (i2 >= 0) { a.splice(i2, 1); } else { a.push(h.id); const dn = (s.forge.done[dd] || []).indexOf(h.id); if (dn >= 0) s.forge.done[dd].splice(dn, 1); } }); if (!isF) { AF.tone(110, 0.35, 'sine', 0.18, 0, 55); toast('❌ Falha registrada no hábito. Amanhã tem revanche.'); } else toast('Falha desmarcada. Ainda dá tempo hoje.'); }}>❌ {isF ? 'FALHOU HOJE' : 'FALHEI'}</button>
            </div>
            {miss >= 2 && <div className="chip-dim mt-2 justify-center border-danger/50 text-danger">⚠ {miss} dia(s) sem fazer</div>}
            <button className="k2 mt-3 flex w-full items-center justify-between" onClick={() => setHistOpen((o) => ({ ...o, [h.id]: !o[h.id] }))}>
              <span className="flex items-center gap-1"><CalendarDays size={12} /> Histórico dos últimos 7 dias</span><i className={`transition-transform ${histOpen[h.id] ? 'rotate-180' : ''}`}>▼</i>
            </button>
            {histOpen[h.id] && (
              <div className="mt-2">
                <WeekStrip
                  cells={Array.from({ length: 7 }).map((_, xi) => {
                    const ds = dstr(new Date(Date.now() - (6 - xi) * 86400000));
                    const isD = (S.forge.done[ds] || []).includes(h.id), isF2 = (S.forge.failed[ds] || []).includes(h.id);
                    return { d: ds, cls: isD ? 'w' : isF2 ? 'f' : '', lab: isD ? 'FEITO' : isF2 ? 'FALHOU' : 'sem registro', onClick: () => { update((s) => { const a = s.forge.done[ds] = s.forge.done[ds] || []; const f = s.forge.failed[ds] = s.forge.failed[ds] || []; if (a.includes(h.id)) { a.splice(a.indexOf(h.id), 1); f.push(h.id); } else if (f.includes(h.id)) { f.splice(f.indexOf(h.id), 1); } else a.push(h.id); }); } };
                  })}
                  hint="Toque num dia: sem registro → ✅ FEITO → ❌ FALHOU → sem registro."
                />
              </div>
            )}
          </div>
        )}
        <button className="k2 mt-3 flex w-full items-center justify-between" onClick={() => setAccOpen((o) => ({ ...o, [h.id]: !o[h.id] }))}>
          <span className="flex items-center gap-1"><Info size={12} /> Ver Benefícios & Proteção</span><i className={`transition-transform ${accOpen[h.id] ? 'rotate-180' : ''}`}>▼</i>
        </button>
        {accOpen[h.id] && (
          <div className="mt-2 space-y-2 rounded-r border border-line bg-surface2 p-3 text-[12.5px] leading-relaxed">
            <p><b>Impacto:</b> {h.b}</p>
            <p className="text-gold2"><b>🛡 Proteção:</b> {h.p}</p>
          </div>
        )}
      </Card>
    );
  };

  const isAct = (h) => S.forge.active.includes(h.id);
  const ALL = cxHabits(lang, L.allH(S));
  const actList = ALL.filter(isAct).sort((a, b) => { const ta = L.hTime(S, a.id) || '99:99', tb = L.hTime(S, b.id) || '99:99'; if (ta !== tb) return ta.localeCompare(tb); return a.id - b.id; });
  const resList = ALL.filter((h) => !isAct(h)).sort((a, b) => a.id - b.id);

  return (
    <div>
      <Card glow className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <K>REGRA DE DESBLOQUEIO POR PATAMAR</K>
          <div className="flex flex-wrap gap-1.5">
            {tiers.map((x) => (
              <span key={x.min} className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${x.min === tier.min ? 'border-gold bg-gold/15 text-gold' : 'border-line text-muted'}`} title={x.icon + ' ' + x.name}>
                {x.min === 365 ? '365+' : x.min + '+'}d → {x.slots === 99 ? '∞' : x.slots} hábitos
              </span>
            ))}
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2.5">
          <button className="btn-gold" onClick={() => habitModal(null)}><Plus size={15} /> CRIAR HÁBITO</button>
          <span className="chip-dim">SLOTS {used}/{tier.slots === 99 ? '∞' : tier.slots}</span>
        </div>
      </Card>

      {warns.length > 0 && (
        <Card className="mb-4 border-danger/45">
          <K className="text-danger">⚠ ALERTA DE NEGLIGÊNCIA — A FORJA ESFRIA</K>
          {warns.map((w) => (
            <div key={w.h.id} className="mb-2 flex items-center gap-2.5 rounded-r border border-danger/40 bg-danger/10 p-2.5 text-sm font-semibold">
              <span className="text-lg">{w.h.icon}</span><span className="flex-1">{w.h.n} — <b className="text-danger">{w.miss} dia(s) sem fazer</b></span>
            </div>
          ))}
          <p className="fnote" style={{ textAlign: 'left' }}>Guerreiro que desaparece do treino vira estatística. Retome HOJE.</p>
        </Card>
      )}

      {actList.length > 0 && <K className="mt-4">⚡ ATIVOS NO PROTOCOLO — {actList.length}/{tier.slots === 99 ? '∞' : tier.slots} SLOTS</K>}
      <div className="grid gap-3.5 md:grid-cols-2">{actList.map(card)}</div>
      {resList.length > 0 && <K className="mt-5 text-muted">🗃 RESERVA DA FORJA — {resList.length}</K>}
      <div className="grid gap-3.5 md:grid-cols-2">{resList.map(card)}</div>
    </div>
  );
}
