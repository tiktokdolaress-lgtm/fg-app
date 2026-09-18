'use client';
import React, { useRef, useState } from 'react';
import { BookOpen, BookMarked, Waves, Lock, Play, Square } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { LESSONS, READINGS } from '@/lib/data';
import { BREATH_PROGRAMS, createBreath, AF } from '@/lib/audio';
import * as L from '@/lib/logic';
import { cx, cxBreath } from '@/lib/content-i18n';

export default function LibraryView() {
  const { S, t } = useApp();
  const lang = S.settings.lang;
  const LT = (ls) => Object.assign({}, ls, cx(lang, 'les', ls.day) || {});
  const RT = (i, r) => Object.assign({}, r, cx(lang, 'read', i + 1) || {});
  const PN = (k) => cx(lang, 'prog', k) || BREATH_PROGRAMS[k].nome;
  const BR = (l) => cxBreath(lang, l);
  const [tab, setTab] = useState('licoes');
  const [prog, setProg] = useState('combate');
  const [br, setBr] = useState({ lab: BR('PRONTO'), num: 0, ph: '' });
  const [on, setOn] = useState(false);
  const breathRef = useRef(null);
  const d = L.progressDays(S);

  const toggle = () => {
    if (on) { if (breathRef.current) breathRef.current.stop(); breathRef.current = null; setOn(false); setBr({ lab: BR('PRONTO'), num: 0, ph: '' }); return; }
    const b = createBreath(BREATH_PROGRAMS[prog].phases);
    breathRef.current = b;
    b.onTick = (num, p) => setBr({ lab: BR(p.l), num, ph: p.k });
    b.start();
    setOn(true);
    AF.click();
  };
  React.useEffect(() => () => { if (breathRef.current) breathRef.current.stop(); }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {[['licoes', t('lib_l')], ['leituras', t('lib_r')], ['audios', t('lib_a')]].map(([k, lb]) => (
          <button key={k} className={tab === k ? 'chip' : 'chip-dim'} onClick={() => { AF.click(); setTab(k); }}>{lb}</button>
        ))}
      </div>

      {tab === 'licoes' && (
        <div className="grid gap-3.5 md:grid-cols-2">
          {LESSONS.map((ls, i) => {
            const unlocked = d >= ls.day;
            return (
              <Card key={i} className={unlocked ? '' : 'opacity-60'}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="chip-dim px-2 py-0.5 text-[9px]">{t('lib_dia')} {ls.day}+</span>
                  {!unlocked && <Lock size={13} className="text-muted" />}
                  <b className="min-w-0 flex-1 truncate text-[14px]">{LT(ls).t}</b>
                </div>
                {unlocked
                  ? <p className="text-[12.5px] leading-relaxed text-muted">{LT(ls).x}</p>
                  : <p className="text-[12px] text-muted">{t('lib_lock')} {ls.day} {t('lib_keep')}</p>}
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'leituras' && (
        <div className="grid gap-3.5 md:grid-cols-2">
          {READINGS.map((r0, i) => {
            const r = RT(i, r0);
            return (
            <Card key={i}>
              <p className="mb-2 border-l-[3px] border-gold2 pl-3.5 text-[14px] font-bold italic leading-relaxed text-[#f3ead2]">"{r.q}"</p>
              <p className="k2 mb-2">{r.a} — {r.w}</p>
              <p className="rounded-r border border-gold/20 bg-gold/5 p-2.5 text-[12px] leading-relaxed text-gold2">🤔 {r.r}</p>
            </Card>
            );
          })}
        </div>
      )}

      {tab === 'audios' && (
        <Card className="mx-auto max-w-md text-center">
          <K><Waves size={12} className="mr-1 inline" /> {t('lib_bk')}</K>
          <div className="mb-4 flex flex-col gap-2">
            {Object.keys(BREATH_PROGRAMS).map((k) => (
              <button key={k} className={`btn-big ${prog === k ? 'btn-gold' : 'btn-dark'}`} onClick={() => { setProg(k); if (on) { if (breathRef.current) breathRef.current.stop(); breathRef.current = null; setOn(false); setBr({ lab: BR('PRONTO'), num: 0, ph: '' }); } }}>
                {PN(k)}
              </button>
            ))}
          </div>
          <div className="mb-2 text-[12px] font-extrabold tracking-[.2em] text-gold">{br.lab}</div>
          <div className={`b-orb ${br.ph ? 'ph-' + br.ph : ''}`}><b className="font-display text-3xl text-gold">{br.num || '•'}</b></div>
          <button className={`btn-big mt-5 ${on ? 'btn-red' : 'btn-gold'}`} onClick={toggle}>
            {on ? <><Square size={15} /> {t('lib_stop')}</> : <><Play size={15} /> {t('lib_start')}</>}
          </button>
          <p className="fnote">{t('lib_note')}</p>
        </Card>
      )}
    </div>
  );
}
