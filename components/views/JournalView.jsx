'use client';
import React, { useState } from 'react';
import { BookOpen, Calendar, Send, Trash2, Smile, Meh, Frown, Flame, ShieldAlert, Sparkles, MoreVertical, Check, PenTool, History, BarChart3 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';

const JOURNAL_CATEGORIES = [
  { id: 'write', label: 'Novo Relatório', icon: PenTool },
  { id: 'history', label: 'Histórico de Auditorias', icon: History },
  { id: 'metrics', label: 'Métricas & Vigor', icon: BarChart3 },
];

const I18N = {
  title: { pt: 'DIÁRIO DE BORDO', en: 'CAPTAIN\'S LOG', es: 'DIARIO DE A BORDO' },
  subtitle: { pt: 'Auditoria noturna do guerreiro. Registre suas vitórias e gatilhos.', en: 'Warrior\'s evening audit. Log victories and triggers.', es: 'Auditoría nocturna del guerrero. Registra victorias y detonantes.' },
  newEntry: { pt: 'NOVO REGISTRO DO DIA', en: 'NEW DAILY ENTRY', es: 'NUEVO REGISTRO DEL DÍA' },
  moodLabel: { pt: 'Estado de Espírito / Vigor:', en: 'State of Mind / Vigor:', es: 'Estado de Ánimo / Vigor:' },
  moodGreat: { pt: 'Em Chamas 🔥', en: 'On Fire 🔥', es: 'En Llamas 🔥' },
  moodGood: { pt: 'Firme ⚔️', en: 'Steady ⚔️', es: 'Firme ⚔️' },
  moodTired: { pt: 'Cansado 🛡️', en: 'Tired 🛡️', es: 'Cansado 🛡️' },
  moodUrge: { pt: 'Guerra / Fissura ⚠️', en: 'Urges / War ⚠️', es: 'Guerra / Ansiedad ⚠️' },
  textLabel: { pt: 'Reflexão & Prestação de Contas:', en: 'Reflection & Accountability:', es: 'Reflexión y Rendición de Cuentas:' },
  textPh: { pt: 'Como você venceu suas batalhas hoje? Que tentação enfrentou?', en: 'How did you win your battles today? What urge did you conquer?', es: '¿Cómo venciste tus batallas hoy? ¿Qué tentación enfrentaste?' },
  saveBtn: { pt: 'GRAVAR NO DIÁRIO', en: 'SAVE TO LOG', es: 'GUARDAR EN DIARIO' },
  historyTitle: { pt: 'HISTÓRICO DE AUDITORIAS', en: 'LOG HISTORY', es: 'HISTORIAL DE AUDITORÍAS' },
  noEntries: { pt: 'Nenhum registro no diário ainda. Escreva seu primeiro relatório hoje!', en: 'No log entries yet. Write your first report today!', es: 'Sin registros aún. ¡Escribe tu primer reporte hoy!' },
};

export default function JournalView() {
  const { S, update, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const curLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const tx = I18N;

  const [mood, setMood] = useState('firme');
  const [text, setText] = useState('');
  const [activeCategory, setActiveCategory] = useState('write');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* Normalização compatível com formato array ou objeto de journal */
  const rawJournal = (S && S.journal) || [];
  let entries = [];
  if (Array.isArray(rawJournal)) {
    entries = rawJournal;
  } else if (typeof rawJournal === 'object') {
    entries = Object.keys(rawJournal).map((dateKey) => ({
      id: dateKey,
      date: dateKey,
      ...(typeof rawJournal[dateKey] === 'object' ? rawJournal[dateKey] : { text: String(rawJournal[dateKey]) }),
    })).reverse();
  }

  // Indicadores táticos de consistência de auditoria
  const hasTodayEntry = entries.some((e) => String(e.date) === today() || String(e.id) === today());
  const moodCounts = entries.reduce((acc, e) => {
    const m = e.mood || e.ch || 'firme';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'firme';
  const topMoodLabel = {
    firme: tx.moodGood[curLang],
    fogo: tx.moodGreat[curLang],
    cansado: tx.moodTired[curLang],
    guerra: tx.moodUrge[curLang],
  }[topMood] || 'Firme ⚔️';

  const handleSave = (e) => {
    e.preventDefault();
    if (!text.trim()) return toast('Escreva sua reflexão antes de salvar');

    update((s) => {
      if (Array.isArray(s.journal)) {
        s.journal.unshift({
          id: 'j_' + Date.now(),
          date: today(),
          mood,
          text: text.trim(),
          createdAt: Date.now(),
        });
      } else {
        s.journal = s.journal || {};
        s.journal[today()] = {
          mood,
          text: text.trim(),
          good: text.trim(),
          ch: mood,
          updatedAt: Date.now(),
        };
      }
    });

    setText('');
    AF.click();
    toast('✅ Relatório gravado no Diário de Bordo!');
  };

  const deleteEntry = (id) => {
    if (!window.confirm('Excluir este registro do diário?')) return;
    update((s) => {
      if (Array.isArray(s.journal)) {
        s.journal = s.journal.filter((x) => String(x.id) !== String(id));
      } else if (s.journal && s.journal[id]) {
        delete s.journal[id];
      }
    });
    AF.click();
    toast('Registro excluído');
  };

  return (
    <div className="grid gap-3.5">
      {/* 1. SELETOR DE CATEGORIAS RESPONSIVO (Desktop: Abas / Mobile: 3 Pontinhos) */}
      <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
        {/* Mobile: Categoria Ativa + 3 Pontinhos */}
        <div className="sm:hidden flex items-center justify-between w-full relative">
          <div className="flex items-center gap-2">
            {(() => {
              const currentCat = JOURNAL_CATEGORIES.find((c) => c.id === activeCategory) || JOURNAL_CATEGORIES[0];
              const IconComp = currentCat.icon;
              return (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface2 border border-gold/30 text-gold font-bold text-xs">
                  <IconComp size={15} />
                  <span>{currentCat.label}</span>
                </div>
              );
            })()}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 font-mono text-[11px] text-gold font-bold bg-gold/10 px-2 py-1 rounded border border-gold/20">
              <Calendar size={11} />
              <span>{fmtD(today())}</span>
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
                  {JOURNAL_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategory === cat.id;
                    const count = cat.id === 'history' ? entries.length : null;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-gold/15 text-gold font-bold'
                            : 'text-muted hover:text-ink hover:bg-surface'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted'} />
                          <span>{cat.label}</span>
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
        </div>

        {/* Desktop: Abas Horizontais */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {JOURNAL_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              const count = cat.id === 'history' ? entries.length : null;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                    isSelected
                      ? 'border-gold bg-gold/15 text-gold shadow-sm'
                      : 'border-line bg-surface hover:bg-surface2 text-muted hover:text-ink'
                  }`}
                >
                  <Icon size={14} className={isSelected ? 'text-gold' : 'text-muted'} />
                  <span>{cat.label}</span>
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

          <div className="flex items-center gap-2 font-mono text-xs text-gold font-bold bg-gold/10 px-3 py-1.5 rounded border border-gold/30">
            <Calendar size={13} />
            <span>{fmtD(today())}</span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORIA: NOVO RELATÓRIO */}
      {activeCategory === 'write' && (
        <div className="max-w-2xl mx-auto w-full">
          {hasTodayEntry && (
            <div className="mb-3 p-3 rounded-lg border border-gold/30 bg-gold/10 flex items-center justify-between gap-2 text-xs">
              <span className="text-gold font-semibold flex items-center gap-1.5">
                <Check size={14} /> Você já registrou um relatório hoje! Pode registrar outro ou consultar o histórico.
              </span>
              <button
                type="button"
                onClick={() => setActiveCategory('history')}
                className="text-xs font-bold underline text-gold hover:text-ink"
              >
                Ver histórico
              </button>
            </div>
          )}

          <Card className="p-4 sm:p-5 border-line bg-surface2/80">
            <K className="mb-3">✍️ {tx.newEntry[curLang]}</K>
            <form onSubmit={handleSave} className="flex flex-col gap-3.5">
              <div>
                <span className="lbl mb-1.5 block">{tx.moodLabel[curLang]}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'firme', label: tx.moodGood[curLang] },
                    { id: 'fogo', label: tx.moodGreat[curLang] },
                    { id: 'cansado', label: tx.moodTired[curLang] },
                    { id: 'guerra', label: tx.moodUrge[curLang] },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`text-xs py-2 px-2 rounded border font-semibold text-center transition-all ${
                        mood === m.id
                          ? 'border-gold bg-gold/20 text-gold shadow-sm font-bold'
                          : 'border-line bg-surface text-muted hover:border-gold/40 hover:text-ink'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="lbl mb-1.5 block">{tx.textLabel[curLang]}</span>
                <textarea
                  rows={6}
                  placeholder={tx.textPh[curLang]}
                  className="field w-full text-xs sm:text-[13px] leading-relaxed resize-none"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 mt-1"
              >
                <Send size={13} />
                <span>{tx.saveBtn[curLang]}</span>
              </button>
            </form>
          </Card>
        </div>
      )}

      {/* 3. CATEGORIA: HISTÓRICO DE AUDITORIAS */}
      {activeCategory === 'history' && (
        <Card className="p-3.5 sm:p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-line/60">
            <K className="mb-0">📜 {tx.historyTitle[curLang]} ({entries.length})</K>
            <button
              type="button"
              onClick={() => setActiveCategory('write')}
              className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
            >
              <PenTool size={12} /> + Novo Relatório
            </button>
          </div>

          {entries.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {entries.map((item, idx) => {
                const itemMood = item.mood || item.ch || 'firme';
                const itemText = item.text || item.vent || item.good || '';
                const moodBadge = {
                  firme: 'border-gold/40 bg-gold/10 text-gold',
                  fogo: 'border-danger/40 bg-danger/10 text-danger',
                  cansado: 'border-line bg-surface text-muted',
                  guerra: 'border-danger bg-danger text-white font-bold',
                }[itemMood] || 'border-line text-muted';

                return (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded border border-line bg-surface2/70 hover:border-gold/30 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-ink">
                          {fmtD(item.date || today())}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${moodBadge}`}>
                          {itemMood}
                        </span>
                      </div>
                      <button
                        type="button"
                        title="Excluir Registro"
                        onClick={() => deleteEntry(item.id || item.date)}
                        className="text-muted/60 hover:text-danger p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-xs sm:text-[13px] text-[#e0e0e8] whitespace-pre-wrap leading-relaxed bg-surface/60 p-2.5 rounded border border-line/40 font-sans">
                      {itemText || 'Sem anotações textuais.'}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <Empty>{tx.noEntries[curLang]}</Empty>
              <button
                type="button"
                onClick={() => setActiveCategory('write')}
                className="btn-gold py-1.5 px-4 text-xs font-bold mt-3"
              >
                Escrever Primeiro Relatório
              </button>
            </div>
          )}
        </Card>
      )}

      {/* 4. CATEGORIA: MÉTRICAS & VIGOR */}
      {activeCategory === 'metrics' && (
        <div className="grid gap-3.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Total de Relatórios</span>
              <b className="text-xl font-mono text-gold mt-1">{entries.length}</b>
            </div>
            <div className="p-3.5 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Auditoria de Hoje</span>
              <span className={`text-xs font-mono font-bold mt-1 inline-flex items-center gap-1 ${hasTodayEntry ? 'text-gold' : 'text-danger'}`}>
                {hasTodayEntry ? '✓ Concluída' : '⚠️ Pendente'}
              </span>
            </div>
            <div className="p-3.5 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Vigor Predominante</span>
              <span className="text-xs font-semibold text-ink mt-1 truncate">{topMoodLabel}</span>
            </div>
            <div className="p-3.5 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Último Relatório</span>
              <span className="text-xs font-mono text-gold2 mt-1 truncate">{entries.length > 0 ? fmtD(entries[0].date || today()) : 'Nenhum'}</span>
            </div>
          </div>

          <Card className="p-4 border-line">
            <K className="mb-3">📊 DISTRIBUIÇÃO DE ESTADOS DE ESPÍRITO</K>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'firme', label: 'Firme ⚔️', count: moodCounts.firme || 0, color: 'bg-gold' },
                { id: 'fogo', label: 'Em Chamas 🔥', count: moodCounts.fogo || 0, color: 'bg-danger' },
                { id: 'cansado', label: 'Cansado 🛡️', count: moodCounts.cansado || 0, color: 'bg-muted' },
                { id: 'guerra', label: 'Guerra / Fissura ⚠️', count: moodCounts.guerra || 0, color: 'bg-amber-500' },
              ].map((m) => {
                const pct = entries.length ? Math.round((m.count / entries.length) * 100) : 0;
                return (
                  <div key={m.id} className="p-3 rounded border border-line/60 bg-surface2/40">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <span>{m.label}</span>
                      <span className="font-mono text-muted">{m.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded bg-surface border border-line overflow-hidden">
                      <div className={`h-full ${m.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
