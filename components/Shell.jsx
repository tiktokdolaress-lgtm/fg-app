'use client';
import React from 'react';
import { Castle, Hammer, Target, BookOpen, ChartNoAxesColumn, Skull, Settings, Siren, ShieldCheck, Library } from 'lucide-react';
import { useApp } from '@/lib/store';
import { TABS, LIFE_STATUS } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { lifeMode, progressDays, allH } from '@/lib/logic';
import { ensureSw, scheduleLocalTimers } from '@/lib/notify';
import { AF } from '@/lib/audio';
import SosModal from './SosModal';
import QgView from './views/QgView';
import ForgeView from './views/ForgeView';
import OpsView from './views/OpsView';
import JournalView from './views/JournalView';
import StatsView from './views/StatsView';
import EnemyView from './views/EnemyView';
import SettingsView from './views/SettingsView';
import LibraryView from './views/LibraryView';

const ICONS = { qg: Castle, forge: Hammer, ops: Target, journal: BookOpen, stats: ChartNoAxesColumn, enemy: Skull, library: Library, settings: Settings };
const VIEWS = { qg: QgView, forge: ForgeView, ops: OpsView, journal: JournalView, stats: StatsView, enemy: EnemyView, library: LibraryView, settings: SettingsView };

export default function Shell() {
  const { S, tab, setTab, t, openModal, update } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const lifeLbl = (() => { const m = lifeMode(S); const LS = cx(lang, 'life', m) || LIFE_STATUS[m] || LIFE_STATUS.single; return LS.label; })();
  const go = (id) => { AF.click(); setTab(id); window.scrollTo({ top: 0 }); }
  const openSOS = () => { update((d) => { d.sos = (d.sos || 0) + 1; }); openModal(<SosModal />, 'full'); };
  const View = VIEWS[tab];

  /* PWA: registra o service worker + agenda lembretes locais (hábitos ⏰ e check-in 20h) */
  React.useEffect(() => {
    ensureSw();
    const clean = scheduleLocalTimers(S, allH(S), true);
    return clean;
  }, [S]);

  return (
    <div className="relative z-[2] min-h-dvh lg:grid lg:grid-cols-[242px_minmax(0,1fr)]">
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-1.5 overflow-y-auto border-r border-gold/20 bg-deep p-4 lg:flex">
        <div className="mb-5 flex items-center gap-2.5 px-2">
          <ShieldCheck size={40} className="flex-none text-gold" strokeWidth={1.6} />
          <div className="font-display text-[21px] leading-[.95] tracking-[.08em] text-gold">
            {S.settings.discreet ? <>FG<br />{t('brandMain')}<small className="block font-body text-[9px] font-extrabold tracking-[.3em] text-muted">{t('brand1')}</small></> : <>FORJANDO<br />GUERREIROS<small className="block font-body text-[9px] font-extrabold tracking-[.3em] text-muted">{t('brand2')}</small></>}
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map(([id, emo]) => {
            const Ic = ICONS[id];
            const lb = t(id).toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase());
            return (
              <button key={id} onClick={() => go(id)} className={`flex items-center gap-3 rounded-r border px-3.5 py-3 text-left text-sm font-bold transition-all ${tab === id ? 'border-gold/25 bg-gold/10 text-gold' : 'border-transparent text-muted hover:translate-x-[3px] hover:bg-surface hover:text-ink'}`}>
                <Ic size={17} className={tab === id ? '' : 'opacity-60'} /> {lb}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-r2 border border-gold/20 bg-surface p-3.5 text-center">
          <b className="block font-display text-[34px] leading-none text-gold">{progressDays(S)}</b>
          <small className="text-[9.5px] font-extrabold tracking-[.2em] text-muted">{t('dret')}</small>
        </div>
      </aside>

      <main className="max-w-full px-4 pb-[120px] lg:px-8 lg:pb-16">
        {/* topbar */}
        <header className="sticky top-0 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-2.5 border-b border-gold/20 bg-[rgba(13,13,14,.88)] px-5 py-3 backdrop-blur-md lg:-mx-8 lg:mb-6 lg:px-8">
          <h1 className="min-w-[120px] flex-1 truncate font-display text-2xl tracking-[.06em]">{t(tab)}</h1>
          <span className="chip flex-none">{lifeLbl}</span>
          <button className="flex-none rounded-r border border-line bg-surface2 p-2 text-muted hover:text-gold" onClick={() => go('settings')} aria-label={t('adj')}><Settings size={18} /></button>
        </header>
        <View key={tab} />
      </main>

      {/* fab S.O.S */}
      <button id="fab" onClick={openSOS} className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-4 z-40 grid h-16 w-16 place-items-center rounded-full border-none bg-[radial-gradient(circle_at_32%_26%,#FF6A5E,#D52020_72%)] text-white shadow-[0_10px_30px_rgba(213,32,32,.5)] transition-transform hover:scale-105 lg:bottom-8 lg:right-8" aria-label="S.O.S">
        <span className="absolute -inset-[7px] rounded-full border-2 border-danger/55" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
        <Siren size={24} />
        <span className="absolute -bottom-0.5 font-display text-[10px] tracking-widest">S.O.S</span>
      </button>

      {/* bottom nav mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-8 border-t border-gold/20 bg-[rgba(18,18,21,.97)] px-1 pt-2 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}>
        {TABS.map(([id, emo]) => {
          const Ic = ICONS[id];
          return (
            <button key={id} onClick={() => go(id)} className={`relative flex flex-col items-center gap-[3px] rounded-[10px] px-0.5 py-1.5 text-[9.5px] font-extrabold tracking-[.08em] transition-colors ${tab === id ? 'text-gold' : 'text-muted'}`}>
              {tab === id && <span className="absolute -top-2 h-[3px] w-[18px] rounded-full bg-gold shadow-[0_0_8px_#FFC846]" />}
              <Ic size={19} className={tab === id ? '-translate-y-[2px] scale-110' : 'opacity-60'} />
              {t('nav_' + id)}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
