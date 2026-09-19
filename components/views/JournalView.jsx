'use client';
import React, { useState } from 'react';
import { BookOpen, Calendar, Send, Trash2, Smile, Meh, Frown, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty } from '@/components/ui';
import { today, fdmy, dstr, fmtD } from '@/lib/utils';
import { AF } from '@/lib/audio';

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
      {/* 1. TOPO COMPACTO */}
      <Card className="border-gold/30 bg-surface2/60 p-3.5 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <K className="mb-0.5">📖 {tx.title[curLang]}</K>
            <p className="text-xs text-muted">{tx.subtitle[curLang]}</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-gold font-bold bg-gold/10 px-3 py-1.5 rounded border border-gold/30">
            <Calendar size={13} />
            <span>{fmtD(today())}</span>
          </div>
        </div>
      </Card>

      {/* 2. KPIS DE AUDITORIA & REGULARIDADE (Padrão Denso QG/Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Total de Relatórios</span>
          <b className="text-lg font-mono text-gold mt-1">{entries.length}</b>
        </div>
        <div className="p-3 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Auditoria de Hoje</span>
          <span className={`text-xs font-mono font-bold mt-1 inline-flex items-center gap-1 ${hasTodayEntry ? 'text-gold' : 'text-danger'}`}>
            {hasTodayEntry ? '✓ Concluída' : '⚠️ Pendente'}
          </span>
        </div>
        <div className="p-3 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Vigor Predominante</span>
          <span className="text-xs font-semibold text-ink mt-1 truncate">{topMoodLabel}</span>
        </div>
        <div className="p-3 rounded-lg border border-line bg-surface2/80 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider">Último Relatório</span>
          <span className="text-xs font-mono text-gold2 mt-1 truncate">{entries.length > 0 ? fmtD(entries[0].date || today()) : 'Nenhum'}</span>
        </div>
      </div>

      {/* 3. GRADE NO PC (5 Colunas: Registro / 7 Colunas: Histórico) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        
        {/* COLUNA ESQUERDA: Formulário de Registro */}
        <div className="lg:col-span-5">
          <Card className="p-3.5 sm:p-4 border-line bg-surface2/80">
            <K className="mb-2">✍️ {tx.newEntry[curLang]}</K>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div>
                <span className="lbl mb-1.5 block">{tx.moodLabel[curLang]}</span>
                <div className="grid grid-cols-2 gap-1.5">
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
                      className={`text-xs py-1.5 px-2 rounded border font-semibold text-center transition-all ${
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
                className="btn-gold w-full py-2 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 mt-1"
              >
                <Send size={13} />
                <span>{tx.saveBtn[curLang]}</span>
              </button>
            </form>
          </Card>
        </div>

        {/* COLUNA DIREITA: Histórico Cronológico */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <Card className="p-3.5 sm:p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-line/60">
              <K className="mb-0">📜 {tx.historyTitle[curLang]} ({entries.length})</K>
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
                      className="p-3 rounded-r border border-line bg-surface2/70 hover:border-gold/30 transition-all flex flex-col gap-2"
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
              <div className="py-8 text-center">
                <Empty>{tx.noEntries[curLang]}</Empty>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
