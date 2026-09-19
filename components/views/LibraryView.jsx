'use client';
import React, { useRef, useState } from 'react';
import { BookOpen, BookMarked, Waves, Lock, Play, Square, MoreVertical } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { LESSONS, READINGS } from '@/lib/data';
import { BREATH_PROGRAMS, createBreath, AF } from '@/lib/audio';
import * as L from '@/lib/logic';
import { cx, cxBreath } from '@/lib/content-i18n';

const LIB_CATEGORIES = [
  { id: 'licoes', labelKey: 'lib_l', icon: BookOpen },
  { id: 'leituras', labelKey: 'lib_r', icon: BookMarked },
  { id: 'audios', labelKey: 'lib_a', icon: Waves },
];

export default function LibraryView() {
  const { S, t } = useApp();
  const lang = S.settings.lang;
  const LT = (ls) => Object.assign({}, ls, cx(lang, 'les', ls.day) || {});
  const RT = (i, r) => Object.assign({}, r, cx(lang, 'read', i + 1) || {});
  const PN = (k) => cx(lang, 'prog', k) || BREATH_PROGRAMS[k].nome;
  const BR = (l) => cxBreath(lang, l);
  const [tab, setTab] = useState('licoes');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="grid gap-3.5">
      {/* SELETOR DE CATEGORIAS RESPONSIVO (Desktop: Abas / Mobile: 3 Pontinhos) */}
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        {/* Mobile: Categoria Ativa + 3 Pontinhos */}
        <div className="sm:hidden flex items-center justify-between w-full relative">
          <div className="flex items-center gap-2">
            {(() => {
              const currentCat = LIB_CATEGORIES.find((c) => c.id === tab) || LIB_CATEGORIES[0];
              const IconComp = currentCat.icon;
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface2 border border-gold/30 text-gold font-bold text-xs">
                  <IconComp size={15} />
                  <span>{t(currentCat.labelKey)}</span>
                </div>
              );
            })()}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-line bg-surface hover:border-gold/50 text-ink transition-colors flex items-center justify-center"
              aria-label="Abrir menu de categorias"
            >
              <MoreVertical size={16} />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-line bg-surface2 shadow-xl z-50 p-1">
                {LIB_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = tab === cat.id;
                  const count = cat.id === 'licoes' ? LESSONS.length : cat.id === 'leituras' ? READINGS.length : null;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setTab(cat.id);
                        setMobileMenuOpen(false);
                        AF.click();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-gold/15 text-gold font-bold'
                          : 'text-muted hover:text-ink hover:bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted'} />
                        <span>{t(cat.labelKey)}</span>
                      </div>
                      {count !== null && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-line">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Abas Horizontais */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {LIB_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = tab === cat.id;
              const count = cat.id === 'licoes' ? LESSONS.length : cat.id === 'leituras' ? READINGS.length : null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setTab(cat.id);
                    AF.click();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                    isSelected
                      ? 'border-gold bg-gold/15 text-gold shadow-sm'
                      : 'border-line bg-surface hover:bg-surface2 text-muted hover:text-ink'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted'} />
                  <span>{t(cat.labelKey)}</span>
                  {count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected ? 'bg-gold/20 text-gold' : 'bg-surface2 text-muted'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
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
