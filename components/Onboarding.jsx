'use client';
import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowLeft, ArrowRight, PenLine, ShieldCheck } from 'lucide-react';
import { useApp } from '@/lib/store';
import { LIFE_STATUS, METAS, TRIGGERS, FREQS } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { AF, SFX } from '@/lib/audio';
import { today, dstr, uid } from '@/lib/utils';

const LBL = { 1: 'IDENTIFICAÇÃO', 2: 'IDENTIFICAÇÃO', 3: 'STATUS DE COMBATE', 4: 'LINHA DE BASE', 5: 'LINHA DE BASE', 6: 'MARCO ZERO', 7: 'META POR PATENTE', 8: 'INTELIGÊNCIA', 9: 'INTELIGÊNCIA', 10: 'O PORQUÊ', 11: 'O JURAMENTO' };

export default function Onboarding() {
  const { S, update, setPhase, toast, setTab } = useApp();
  const lang = S.settings.lang;
  const T = (id, fb) => cx(lang, 'ob', id) || fb;
  const [OB, setOB] = useState({});
  const [step, setStep] = useState(1);
  const [err, setErr] = useState('');
  const [stamped, setStamped] = useState(false);
  const set = (k, v) => setOB((o) => ({ ...o, [k]: v }));

  const seq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((n) => n !== 6 || (OB.status || 'single') !== 'committedA');
  const sid = seq[step - 1];
  const total = seq.length;

  const valid = () => {
    const fail = (m) => { setErr(m); AF.tone(110, 0.15, 'square', 0.08); return false; };
    setErr('');
    if (sid === 1 && !(OB.name || '').trim()) return fail(T('errName', '⚠ Informe seu nome de guerra.'));
    if (sid === 2) { const a = Number(OB.age); if (!OB.age || a < 10 || a > 99) return fail(T('errAge', '⚠ Idade inválida (10–99).')); }
    if (sid === 3 && !OB.status) return fail(T('errStatus', '⚠ Escolha seu status de combate.'));
    if (sid === 4 && !OB.dp) return fail(T('errDate', '⚠ Selecione a data.'));
    if (sid === 5 && !OB.dm) return fail(T('errDate', '⚠ Selecione a data.'));
    if (sid === 6 && !OB.dr) return fail(T('errDateZero', '⚠ Selecione a data do marco zero.'));
    if (sid === 7 && !OB.goal) return fail(T('errGoal', '⚠ Escolha a bandeira da sua primeira conquista.'));
    if (sid === 8 && !OB.trigger) return fail(T('errTrigger', '⚠ Escolha o seu maior gatilho.'));
    if (sid === 9 && OB.freq === undefined) return fail(T('errOpt', '⚠ Escolha uma opção.'));
    if (sid === 10 && !((OB.why || '').trim().length >= 5)) return fail(T('errWhy', '⚠ Escreva seu porquê (mín. 5 caracteres).'));
    return true;
  };

  const next = () => {
    if (!valid()) return;
    AF.click();
    if (step < total) { setStep(step + 1); SFX.step(); }
  };
  const back = () => { if (step > 1) { setStep(step - 1); AF.click(); } };

  const finish = () => {
    AF.seal(); setStamped(true);
    setTimeout(() => {
      update((d) => {
        d.name = OB.name.trim(); d.age = OB.age; d.lastPorn = OB.dp; d.lastMast = OB.dm;
        d.lifeStatus = OB.status || 'single'; d.retStart = OB.dr || today();
        d.goal = OB.goal || 7; d.trigger = OB.trigger; d.freq = Number(OB.freq);
        d.why = OB.why.trim(); d.onboarded = true; d.oath = true;
        d.forge.active = [];
        const st = today(), dl = dstr(new Date(Date.now() + 30 * 86400000));
        d.projects = [{ id: uid(), title: T('seedProj', 'Operação Corpo Blindado'), cat: 'Corpo', start: st, deadline: dl, tStart: '06:00', tEnd: '08:00' }];
        d.tasks = [
          { id: uid(), txt: T('seedT1', '20 flexões ao acordar'), pri: 'alta', time: '06:10', done: false, rep: 'diaria', doneDates: [], proj: d.projects[0].id },
          { id: uid(), txt: T('seedT2', 'Banho gelado pós-treino'), pri: 'media', time: '08:00', done: false, rep: 'diaria', doneDates: [], proj: d.projects[0].id },
        ];
        d.notes = [{ id: uid(), tag: '📜 Princípios', txt: T('seedNote', 'Dia 1: a disciplina começa quando a desculpa termina.'), ts: Date.now() }];
        d.best = 0;
      });
      setPhase('app'); setTab('qg');
      setTimeout(() => toast('⚔ ' + T('wel1', 'Bem-vindo ao QG, ') + OB.name.trim() + T('wel2', '. A guerra começou.')), 600);
    }, 900);
  };

  const DateCtl = ({ k, btn }) => (
    <div className="mb-2 flex gap-2">
      <input type="date" className="field flex-1" max={today()} value={OB[k] || ''} onChange={(e) => set(k, e.target.value)} />
      <button type="button" className="chip flex-none" onClick={() => set(k, today())}>[ {btn} ]</button>
    </div>
  );
  const Opts = ({ children }) => <div className="flex flex-col gap-2.5 text-left">{children}</div>;
  const Opt = ({ sel, onClick, children }) => (
    <button type="button" onClick={() => { AF.click(); onClick(); }} className={`rounded-r border p-3.5 text-left text-[13px] font-bold transition-colors ${sel ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface2 text-ink hover:border-gold/40'}`}>{children}</button>
  );

  let body = null;
  if (sid === 1) body = (<>
    <div className="mb-3 flex items-center gap-1.5">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted">🌐 {T('langLabel', 'Idioma')}</span>
      {['pt', 'en', 'es'].map((l) => (
        <button key={l} type="button" className={lang === l ? 'chip' : 'chip-dim'} onClick={() => { AF.click(); update((d) => { d.settings.lang = l; }); }}>{l.toUpperCase()}</button>
      ))}
    </div>
    <h2 className="obq">{T('q1', 'Como devemos nos referir a você no campo de batalha?')}</h2>
    <p className="obh">{T('h1', 'Seu nome de guerra. É assim que o QG falará com você.')}</p>
    <input className="field" maxLength={24} placeholder={T('phName', 'Digite seu nome...')} value={OB.name || ''} onChange={(e) => set('name', e.target.value)} /></>);
  if (sid === 2) body = (<><h2 className="obq">{T('q2', 'Qual é a sua idade?')}</h2>
    <p className="obh">{T('h2', 'Usada apenas localmente para contextualizar seu protocolo.')}</p>
    <input type="number" className="field" min={10} max={99} inputMode="numeric" placeholder={T('phAge', 'Ex: 24')} value={OB.age || ''} onChange={(e) => set('age', e.target.value)} /></>);
  if (sid === 3) body = (<><h2 className="obq">{T('q3', 'Qual é o seu status de combate / estilo de vida?')}</h2>
    <p className="obh">{T('h3', 'Define os pilares cobrados diariamente. Toque para selecionar e avançar.')}</p>
    <Opts>{Object.keys(LIFE_STATUS).map((m) => {
      const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
      return (
        <Opt key={m} sel={(OB.status || 'single') === m} onClick={() => { set('status', m); setTimeout(() => setStep((s) => Math.min(s + 1, total)), 220); }}>
          {LS.label}<br /><small className="font-semibold text-muted">{LS.desc}</small>
        </Opt>
      );
    })}</Opts></>);
  if (sid === 4) body = (<><h2 className="obq">{T('q4', 'Qual foi a última data em que você consumiu conteúdo pornográfico?')}</h2>
    <p className="obh">{T('h4', 'Seja honesto. O mapa de combate depende de dados reais.')}</p><DateCtl k="dp" btn={T('today', 'HOJE')} /></>);
  if (sid === 5) body = (<><h2 className="obq">{T('q5', 'Qual foi a última data em que você se masturbou?')}</h2>
    <p className="obh">{T('h5', 'Sem vergonha. Isto apenas calibra seus contadores.')}</p><DateCtl k="dm" btn={T('today', 'HOJE')} /></>);
  if (sid === 6) body = (<><h2 className="obq">{T('q6', 'Qual foi a data da sua última ejaculação (início da Retenção)?')}</h2>
    <p className="obh">{T('h6', 'Este é o marco zero do seu contador principal de dias.')}</p><DateCtl k="dr" btn={T('todayNow', 'HOJE — COMEÇANDO AGORA')} /></>);
  if (sid === 7) body = (<><h2 className="obq">{T('q7', 'Escolha a BANDEIRA da sua primeira conquista:')}</h2>
    <p className="obh">{T('h7', 'Sua meta de patamar. Toque para escolher — cada patente tem um som de selo próprio.')}</p>
    <Opts>{METAS.map((m) => {
      const MT = cx(lang, 'metas', m.d) || m;
      return (
        <Opt key={m.d} sel={OB.goal === m.d} onClick={() => { set('goal', m.d); SFX.step(); }}>
          <span className="mr-1">{m.icon}</span><b>{MT.n}</b> — {m.d} {T('daysWord', 'DIAS')}<br /><small className="font-semibold text-muted">{MT.sub}</small>
        </Opt>
      );
    })}</Opts></>);
  if (sid === 8) body = (<><h2 className="obq">{T('q8', 'Qual é o seu MAIOR gatilho para a recaída?')}</h2>
    <p className="obh">{T('h8', 'Conhecer o inimigo é metade da vitória.')}</p>
    <Opts>{TRIGGERS.map((x, i) => <Opt key={x} sel={OB.trigger === x} onClick={() => set('trigger', x)}>{T('trig' + i, x)}</Opt>)}</Opts></>);
  if (sid === 9) body = (<><h2 className="obq">{T('q9', 'Em média, quantas vezes por semana o vício roubava sua energia?')}</h2>
    <p className="obh">{T('h9', 'Usado para estimar o tempo/energia que você vai economizar.')}</p>
    <Opts>{FREQS.map((x, i) => <Opt key={x} sel={OB.freq === i} onClick={() => set('freq', i)}>{T('freq' + i, x)}</Opt>)}</Opts></>);
  if (sid === 10) body = (<><h2 className="obq">{T('q10', 'Escreva em poucas palavras: Por que você EXIGIU se livrar desses vícios imundos HOJE?')}</h2>
    <p className="obh">{T('h10a', 'Essa frase será gravada no seu ')}<b className="text-gold">{T('h10b', 'Código do Guerreiro')}</b>{T('h10c', ' e exibida diariamente na tela inicial.')}</p>
    <textarea className="field" rows={4} maxLength={200} placeholder={T('phWhy', 'Minha razão inegociável...')} value={OB.why || ''} onChange={(e) => set('why', e.target.value)} />
    <div className="text-right font-mono text-[11px] text-muted">{(OB.why || '').length}/200</div></>);
  if (sid === 11) body = (
    <div className="relative overflow-hidden rounded-r2 border border-gold2 bg-gradient-to-b from-surface to-surface2 p-7 text-center shadow-glow">
      <div className={`stamp ${stamped ? 'hit' : ''}`}>{T('stamped', '⚔ JURAMENTADO')}</div>
      <ShieldCheck size={52} className="mx-auto mb-3 text-gold2" strokeWidth={1.6} />
      <p className="text-[13.5px] leading-relaxed">
        "{T('oath1', 'Eu, ')}<b className="text-gold">{OB.name || T('warrior', 'GUERREIRO')}</b>{T('oath2', ', declaro guerra hoje contra a fraqueza, a ilusão da pornografia e o desperdício da minha energia vital. Reconheço minhas feridas, mas recuso-me a continuar escravo do prazer barato. A partir deste segundo, assumo o controle da minha mente, do meu corpo e do meu destino.')}"
      </p>
      <button className="btn-gold btn-big mt-5" onClick={finish}><PenLine size={16} /> {T('sign', 'ASSINAR JURAMENTO E ENTRAR NO QG')}</button>
    </div>);

  return (
    <div className="fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-bg">
      <div className="flex items-center gap-3 p-4">
        <span className="font-display text-lg tracking-widest text-gold">FORJANDO GUERREIROS</span>
        <button className="ml-auto text-muted" onClick={() => update((d) => { d.settings.sound = !d.settings.sound; })} aria-label={T('sound', 'Som')}>
          {S.settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <b key={i} className={`h-2 w-2 rounded-full ${i + 1 < step ? 'bg-gold' : i + 1 === step ? 'bg-gold2 shadow-[0_0_6px_rgba(229,169,60,.7)]' : 'bg-line'}`} />
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[560px] flex-1 px-5 pb-4 rise" key={step}>
        <span className="k">{T('stepWord', 'PASSO')} {step} / {total} · {cx(lang, 'ob', 'lbl' + sid) || LBL[sid]}</span>
        {body}
        {err && <p className="mt-3 text-[12.5px] font-bold text-danger shakeit">{err}</p>}
      </div>
      <div className="mx-auto flex w-full max-w-[604px] gap-2.5 p-4" style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom))' }}>
        {step > 1 && <button className="btn-dark flex-none" onClick={back}><ArrowLeft size={15} /> {T('back', 'VOLTAR')}</button>}
        {sid !== 11 && <button className="btn-gold flex-1" onClick={next}>{T('next', 'AVANÇAR')} <ArrowRight size={15} /></button>}
      </div>
    </div>
  );
}