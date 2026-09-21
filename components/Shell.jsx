'use client';
import React from 'react';
import { Castle, Hammer, Target, BookOpen, ChartNoAxesColumn, Skull, Settings, Siren, ShieldCheck, ChevronDown, X } from 'lucide-react';
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

const ICONS = { qg: Castle, forge: Hammer, ops: Target, journal: BookOpen, stats: ChartNoAxesColumn, enemy: Skull, settings: Settings };
const VIEWS = { qg: QgView, forge: ForgeView, ops: OpsView, journal: JournalView, stats: StatsView, enemy: EnemyView, settings: SettingsView };

export default function Shell() {
  const { S, tab, setTab, t, openModal, update } = useApp();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const lifeLbl = (() => { const m = lifeMode(S); const LS = cx(lang, 'life', m) || LIFE_STATUS[m] || LIFE_STATUS.single; return LS.label; })();
  const go = (id) => { AF.click(); setTab(id); window.scrollTo({ top: 0 }); }
  const openSOS = () => { update((d) => { d.sos = (d.sos || 0) + 1; }); openModal(<SosModal />, 'full'); };
  const View = VIEWS[tab] || QgView;
  const TabIcon = ICONS[tab] || Castle;

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
            if (!Ic) return null;
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

      <main className="w-full min-w-0 max-w-full px-3.5 sm:px-4 pb-28 lg:px-8 lg:pb-16 overflow-x-hidden">
        {/* topbar */}
        <header className="sticky top-0 z-30 -mx-3.5 sm:-mx-4 mb-3 sm:mb-4 flex items-center justify-between gap-2 border-b border-gold/20 bg-[rgba(13,13,14,.92)] px-3.5 sm:px-4 py-2.5 backdrop-blur-md lg:-mx-8 lg:mb-6 lg:px-8">
          {/* Botão no canto superior com a SETINHA para alternar as abas no mobile */}
          <div className="relative flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-gold/40 bg-surface2/90 px-2.5 sm:px-3 py-1.5 text-left transition-all active:scale-[0.98] hover:border-gold lg:pointer-events-none lg:border-transparent lg:bg-transparent lg:p-0 min-w-0 max-w-full"
              aria-expanded={menuOpen}
              aria-label="Abrir menu de abas"
            >
              <TabIcon size={18} className="text-gold flex-none" />
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="truncate font-display text-lg sm:text-2xl tracking-[.06em] text-ink leading-tight">
                  {t(tab)}
                </h1>
                <span className="grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded bg-gold/15 text-gold lg:hidden flex-none">
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-none">
            <span className="chip flex-none text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5">{lifeLbl}</span>
            <button
              className="flex-none rounded-r border border-line bg-surface2 p-1.5 sm:p-2 text-muted hover:text-gold transition-colors"
              onClick={() => go('settings')}
              aria-label={t('adj')}
            >
              <Settings size={17} />
            </button>
          </div>

          {/* DROPDOWN FLUTUANTE DE ABAS (MOBILE) */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute left-3 right-3 top-[calc(100%+8px)] z-50 rounded-xl border border-gold/40 bg-[rgba(18,18,22,0.98)] p-2.5 shadow-[0_16px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:hidden">
                <div className="flex items-center justify-between border-b border-line/60 px-2 py-1.5 mb-1.5 text-[10px] uppercase font-extrabold tracking-widest text-muted">
                  <span>MENU DE ABAS</span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="p-1 text-muted hover:text-gold"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {TABS.map(([id]) => {
                    const Ic = ICONS[id];
                    if (!Ic) return null;
                    const lb = t(id).toLowerCase().replace(/(^|\s)\w/g, (c) => c.toUpperCase());
                    const active = tab === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          go(id);
                          setMenuOpen(false);
                        }}
                        className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-bold transition-all ${
                          active
                            ? 'border border-gold/50 bg-gold/15 text-gold shadow-sm'
                            : 'border border-transparent text-muted hover:bg-surface2 hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Ic size={18} className={active ? 'text-gold' : 'opacity-60'} />
                          <span className="text-sm font-semibold">{lb}</span>
                        </div>
                        {active && (
                          <span className="rounded bg-gold/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-gold">
                            Ativo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </header>
        <View key={tab} />
      </main>

      {/* fab S.O.S (Reposicionado para mobile sem a barra inferior) */}
      <button
        id="fab"
        onClick={openSOS}
        className="fixed bottom-5 right-4 z-40 grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full border-none bg-[radial-gradient(circle_at_32%_26%,#FF6A5E,#D52020_72%)] text-white shadow-[0_10px_30px_rgba(213,32,32,.5)] transition-transform hover:scale-105 lg:bottom-8 lg:right-8"
        aria-label="S.O.S"
      >
        <span className="absolute -inset-[6px] rounded-full border-2 border-danger/55" style={{ animation: 'pulseRing 1.6s ease-out infinite' }} />
        <Siren size={22} />
        <span className="absolute -bottom-0.5 font-display text-[9px] tracking-widest">S.O.S</span>
      </button>
    </div>
  );
}
