'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Siren, ShieldCheck, Play, Square, Plus, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { SOS_PHRASES, SOS_PHASES, SOS_EX, SOS_BASE } from '@/lib/data';
import { AF, createBreath } from '@/lib/audio';
import { pad, today } from '@/lib/utils';
import { cx, cxSos, cxBreath } from '@/lib/content-i18n';

export default function SosModal() {
  const { S, update, closeModal, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = (id, fb) => cx(lang, 'sosui', id) || fb;
  const BR = (l) => cxBreath(lang, l);
  /* textos traduzidos; tempos (secs) continuam vindo de SOS_PHASES (data.js) */
  const kit = cxSos(lang, { phrases: SOS_PHRASES, phases: SOS_PHASES, ex: SOS_EX });
  const [phase, setPhase] = useState(0);
  const [left, setLeft] = useState(SOS_PHASES[0].secs);
  const [reps, setReps] = useState(0);
  const [ex, setEx] = useState(null);
  const [br, setBr] = useState({ lab: BR('PRONTO'), num: 4, ph: '' });
  const [inten, setInten] = useState(7);
  const breathRef = useRef(null);
  const phaseRef = useRef(0);
  phaseRef.current = phase;

  const elapsed = () => {
    if (phase < 1) return 0;
    if (phase > 3) return 300;
    return SOS_BASE[phase - 1] + (SOS_PHASES[phase - 1].secs - left);
  };

  const announce = (n) => {
    const p = kit.phases[n - 1];
    AF.tone(520, 0.16, 'triangle', 0.12); AF.tone(880, 0.3, 'sine', 0.08, 0.1);
    toast('⚡ ' + p.t + ' — ' + p.d);
  };

  const haltBreath = () => { if (breathRef.current) { breathRef.current.stop(); breathRef.current = null; } setBr({ lab: BR('PRONTO'), num: 4, ph: '' }); };

  const goto = (p) => {
    setPhase(p);
    if (p === 2) {
      const b = createBreath();
      breathRef.current = b;
      b.onTick = (num, ph) => setBr({ lab: BR(ph.l), num, ph: ph.k });
      b.start();
    } else haltBreath();
    if (p >= 1 && p <= 3) { setLeft(SOS_PHASES[p - 1].secs); announce(p); }
  };

  const start = () => {
    AF.click();
    update((d) => {
      d.urgeLog = d.urgeLog || [];
      d.urgeLog.push({ ts: Date.now(), d: today(), h: new Date().getHours(), i: inten });
      if (d.urgeLog.length > 400) d.urgeLog = d.urgeLog.slice(-400);
    });
    goto(1);
  };
  const advance = () => {
    AF.click();
    if (phase >= 4) return;
    if (phase < 3) goto(phase + 1);
    else {
      haltBreath(); setPhase(4); AF.chime();
      toast(T('toast_done', '🛡️ Protocolo concluído. Valide sua vitória com sinceridade.'));
    }
  };

  /* cronômetro automático */
  useEffect(() => {
    if (phase < 1 || phase > 3) return;
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { clearInterval(iv); setTimeout(() => advanceAuto(), 0); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);
  const advanceAuto = () => { if (phaseRef.current < 3) goto(phaseRef.current + 1); else { haltBreath(); setPhase(4); AF.chime(); } };

  useEffect(() => () => haltBreath(), []);

  const win = () => {
    update((d) => {
      d.sosLog = Array.isArray(d.sosLog) ? d.sosLog : [];
      const now = new Date();
      d.sosLog.push({ ts: now.getTime(), d: today(), h: pad(now.getHours()) + ':' + pad(now.getMinutes()) });
    });
    haltBreath();
    closeModal();
    AF.victory(false);
    toast(T('toast_win', '🛡️ VITÓRIA SALVA! Registro gravado com data e hora.'));
  };

  const timeTxt = phase === 0 ? '05:00' : phase === 4 ? '00:00' : pad(Math.floor(left / 60)) + ':' + pad(left % 60);
  const phaseLbl = phase === 0 ? T('ready_lbl', 'PRONTO · 3 FASES SEQUENCIAIS · 5 MIN') : phase === 4 ? T('done_lbl', '⚔ PROTOCOLO CONCLUÍDO — VALIDAÇÃO DE HONRA') : T('phase_lbl', 'FASE ') + phase + T('phase_of', ' DE 3 · ') + kit.phases[phase - 1].t;
  const shown = phase === 0 ? 1 : phase === 4 ? 4 : phase;

  return (
    <div className="-m-5">
      {/* letreiro de frases */}
      <div className="overflow-hidden border-b border-danger/30 bg-danger/10 py-2">
        <div className="mq-track text-[11px] font-extrabold tracking-[.14em] text-danger">
          {[...kit.phrases, ...kit.phrases].map((p, i) => <span key={i}>⚔ {p}</span>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-5 pb-2">
        <Siren size={34} className="flex-none text-danger" />
        <div className="min-w-[180px] flex-1">
          <h3 className="font-display text-xl tracking-wide text-danger">{T('title', 'PROTOCOLO DE INTERVENÇÃO DE EMERGÊNCIA')}</h3>
          <p className="text-[12px] leading-relaxed text-muted">{T('desc', 'Protocolo sequencial compacto de 5 minutos: uma fase por vez, fluxo contínuo sem pausa. O cronômetro avança sozinho — ou você adianta a fase quando quiser.')}</p>
        </div>
        <button className="btn-ghost flex-none text-[12px]" onClick={() => { haltBreath(); setPhase(4); }}><ShieldCheck size={14} /> {T('relieved', 'JÁ ALIVIEI A TENSÃO')}</button>
      </div>
      <div className="p-5 pt-2">
        <div className="card mb-4 border-danger/30 bg-surface2 text-center">
          <div className="k2 mb-1.5">{T('cool', 'RESFRIAMENTO DOPAMINÉRGICO')}</div>
          <div className="font-mono text-5xl font-bold text-danger">{timeTxt}</div>
          <div className="mt-1 text-[11px] font-extrabold tracking-[.14em] text-gold2">{phaseLbl}</div>
          <div className="bar mt-3"><i style={{ width: (elapsed() / 300 * 100).toFixed(1) + '%', background: 'linear-gradient(90deg,#FF4D4D,#D52020)' }} /></div>
        </div>

        <div className="rounded-r2 border border-line bg-surface p-4">
          {phase === 4 ? (
            <>
              <h4 className="mb-2 font-display text-lg tracking-wide text-gold">{T('honor', '🛡️ VALIDAÇÃO DE HONRA')}</h4>
              <p className="text-[13.5px] leading-relaxed">
                {T('hon_q1', 'Realmente conseguiu se aliviar? ')}<b className="text-gold">{T('hon_q2', 'Seja sincero consigo mesmo.')}</b><br />
                {T('hon_no1', 'Se ')}<b className="text-danger">{T('hon_no2', 'NÃO')}</b>{T('hon_no3', ' conseguiu, saia desse cômodo ')}<b>{T('hon_no4', 'AGORA')}</b>{T('hon_no5', ' e vá para a rua tomar um ar.')}<br />
                {T('hon_yes1', 'Se ')}<b className="text-ok">{T('hon_yes2', 'CONSEGUIU')}</b>{T('hon_yes3', ', parabéns! Você venceu a batalha de hoje. ')}<b className="text-gold">{T('hon_yes4', 'Protocolo Concluído com Sucesso!')}</b>
              </p>
              <button className="btn-gold btn-big mt-4" onClick={win}><ShieldCheck size={16} /> {T('save_win', 'SALVAR E CONFIRMAR VITÓRIA')}</button>
            </>
          ) : (
            <>
              <h4 className="mb-2 font-display text-lg tracking-wide">{kit.phases[shown - 1].icon} {kit.phases[shown - 1].t}<small className="ml-2 text-[10px] tracking-[.2em] text-muted">{kit.phases[shown - 1].w}</small></h4>
              {shown === 1 && (
                <>
                  <p className="mb-2.5 text-[13px] leading-relaxed text-muted">{T('f1_p1', 'O frio dispara noradrenalina e corta o transe do impulso na hora. ')}<b className="text-gold">{T('f1_p2', 'Água gelada no rosto e pulsos imediatamente.')}</b></p>
                  <ol className="list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed">
                    <li>{T('f1_l1a', 'Levante e vá até a pia ou chuveiro ')}<b>{T('f1_l1b', 'agora')}</b>{T('f1_l1c', ' — não pense, apenas mova o corpo.')}</li>
                    <li>{T('f1_l2a', 'Água gelada no rosto e nos pulsos por ')}<b>{T('f1_l2b', '30 segundos')}</b>{T('f1_l2c', '; se possível, banho 100% gelado de 1 min.')}</li>
                    <li>{T('f1_l3a', 'Respire fundo e declare em voz alta: ')}<i>{T('f1_l3b', '"Eu comando este corpo."')}</i></li>
                  </ol>
                </>
              )}
              {shown === 2 && (
                <div className="py-2 text-center">
                  <div className="mb-2 text-[12px] font-extrabold tracking-[.2em] text-gold">{br.lab}</div>
                  <div className={`b-orb ${br.ph ? 'ph-' + br.ph : ''}`}><b className="font-display text-3xl text-gold">{br.num}</b></div>
                  <small className="mt-3 block text-[11px] leading-relaxed text-muted">{T('f2_note1', 'Ciclo automático com som: inale 4s · segure 4s · solte 4s · segure 4s.')}<br />{T('f2_note2', 'Apenas acompanhe o orbe até o fim da fase.')}</small>
                </div>
              )}
              {shown === 3 && (
                <>
                  <p className="mb-2.5 text-[13px] leading-relaxed text-muted"><b className="text-gold">{T('f3_p1', '2 minutos ininterruptos')}</b>{T('f3_p2', ' de exercício intenso à sua escolha — até causar dor física e elevar os batimentos. O sangue sai da mente e vai para o músculo.')}</p>
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    {kit.ex.map((x) => <button key={x} className={`tag ${ex === x ? 'sel' : ''}`} onClick={() => { AF.click(); setEx(x); }}>{x}</button>)}
                  </div>
                  <p className="mb-2.5 text-[12px] text-muted">{T('f3_ex', 'Exercício da Fase 3: ')}<b className="text-gold">{ex || T('f3_choose', 'escolha acima')}</b></p>
                  <div className="mb-1 text-center font-display text-4xl text-gold">{reps}</div>
                  <div className="k2 mb-2.5 text-center">{T('f3_reps', 'REPETIÇÕES ACUMULADAS')}</div>
                  <button className="btn-gold btn-big" onClick={() => { setReps(reps + 1); if ((reps + 1) % 10 === 0) AF.beep(900, 0.08, 0.06); }}><Plus size={15} /> {T('f3_btn', '+1 REP — CONTAR ESFORÇO')}</button>
                </>
              )}
              {phase === 0 && (
                <div className="mb-3">
                  <div className="k2 mb-1.5">{T('f0_k', 'INTENSIDADE DO IMPULSO AGORA (1–10)')}</div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button key={n} className={`tag ${inten === n ? 'sel' : ''}`} onClick={() => { setInten(n); AF.click(); }}>{n}</button>
                    ))}
                  </div>
                  <p className="fnote">{T('f0_note', 'Esse registro alimenta o seu Mapa de Risco por horário em Relatórios.')}</p>
                </div>
              )}
              {phase === 0
                ? <button className="btn-gold btn-big mt-4" onClick={start}><Play size={15} /> {T('start_btn', 'INICIAR PROTOCOLO (5 MIN)')}</button>
                : <button className="btn-gold btn-big mt-4" onClick={advance}><ArrowRight size={15} /> {T('adv_btn', 'CONCLUIR FASE E AVANÇAR')}</button>}
            </>
          )}
        </div>
        <p className="fnote mt-3 border-t border-line pt-2.5">{T('crisis1', '💚 Em crise emocional? Esta ferramenta não substitui terapia. Ligue ')}<b className="text-ok">188</b>{T('crisis2', ' (CVV, 24h, gratuito) ou acesse cvv.org.br. Emergência: SAMU 192.')}</p>
      </div>
    </div>
  );
}
