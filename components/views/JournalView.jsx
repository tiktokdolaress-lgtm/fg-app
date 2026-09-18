'use client';
import React, { useState } from 'react';
import { BookOpen, Brain, Pencil, X, Plus, Search, Save } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Empty, Field } from '@/components/ui';
import { NOTE_TAGS, FAIL_LBL } from '@/lib/data';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, fdmy, uid, yesterday, dstr } from '@/lib/utils';

const MOODS = [['🔥', 'Forte'], ['⚖️', 'Estável'], ['⚡', 'Ansioso'], ['⚠️', 'Vulnerável']];

export default function JournalView() {
  const { S, update, toast, confirmBox, t } = useApp();
  const LOCD = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const fallLbl = (x) => { const k = t('fall_' + x); return k === 'fall_' + x ? (FAIL_LBL[x] || x) : k; };
  const NT_TR = (tag) => { const i = NOTE_TAGS.indexOf(tag); return i >= 0 ? t('nt' + (i + 1)) : tag; };
  const [jDate, setJDate] = useState(today());
  const [noteTag, setNoteTag] = useState(NOTE_TAGS[0]);
  const [noteEditId, setNoteEditId] = useState(null);
  const [noteTxt, setNoteTxt] = useState('');
  const [q, setQ] = useState('');

  const j = S.journal[jDate] || { mood: '', good: '', ch: '', vent: '' };
  const setJ = (key, val) => update((s) => { s.journal[jDate] = s.journal[jDate] || { mood: '', good: '', ch: '' }; s.journal[jDate][key] = val; });
  const hist = Object.keys(S.journal).sort().reverse().slice(0, 10);

  const notes = S.notes
    .filter((n) => !q || n.txt.toLowerCase().includes(q.toLowerCase()) || n.tag.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.ts - a.ts);

  const saveNote = () => {
    const txt = noteTxt.trim();
    if (!txt) { toast(t('j_write')); return; }
    update((s) => {
      if (noteEditId != null) { const n = s.notes.find((x) => x.id === noteEditId); if (n) { n.txt = txt; n.tag = noteTag; n.ts = Date.now(); } }
      else s.notes.push({ id: uid(), txt, tag: noteTag, ts: Date.now() });
    });
    setNoteTxt(''); setNoteEditId(null);
    toast(noteEditId != null ? t('j_upd') : t('j_new'));
  };

  return (
    <div className="grid gap-3.5 lg:grid-cols-2">
      <section>
        <Card className="mb-3.5">
          <K>📖 {t('journal')} — {fdmy(jDate)}{jDate === today() ? ' · ' + t('hj') : ''}</K>
          <div className="ciday-row mb-2.5 flex flex-wrap gap-1.5">
            <button className="chip-dim" style={{ flex: '0 0 auto' }} onClick={() => { AF.click(); setJDate(yesterday(jDate)); }}>{t('j_prev')}</button>
            <button className="chip justify-center" style={{ flex: '1 1 100%', order: -1 }} onClick={() => { AF.click(); setJDate(today()); }}>📅 {t('hj')} ({fdmy(today())})</button>
            <button className="chip-dim" style={{ flex: '0 0 auto', ...(jDate >= today() ? { opacity: .35, cursor: 'not-allowed' } : {}) }} disabled={jDate >= today()} onClick={() => { AF.click(); setJDate(dstr(new Date(L.parseD(jDate).getTime() + 86400000))); }}>{t('j_next')}</button>
          </div>
          {j.fall && <div className="chip-dim mb-2.5 border-danger/50 text-danger">{t('j_fall')}{((j.fallTypes || []).length ? ': ' + (j.fallTypes || []).map((x) => fallLbl(x)).join(' + ') : '')}</div>}
          <div className="k2 mb-2">{t('j_mood')}</div>
          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {MOODS.map(([ic, lb]) => (
              <button key={lb} className={`rounded-r border p-2 text-center text-[11px] font-bold transition-colors ${j.mood === lb ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface2 text-muted'}`} onClick={() => { AF.click(); setJ('mood', lb); }}>
                <i className="block text-lg not-italic">{ic}</i>{t('mood_' + lb)}
              </button>
            ))}
          </div>
          <Field label={t('j_good')}><textarea className="field" maxLength={500} value={j.good || ''} onChange={(e) => setJ('good', e.target.value)} /></Field>
          <Field label={t('j_ch')}><textarea className="field" maxLength={500} value={j.ch || ''} onChange={(e) => setJ('ch', e.target.value)} /></Field>
          {(j.fall || j.vent) && <Field label={t('j_vent')}><textarea className="field" maxLength={600} value={j.vent || ''} onChange={(e) => setJ('vent', e.target.value)} /></Field>}
          <button className="btn-gold btn-big" onClick={() => { AF.click(); toast('💾'); }}><Save size={15} /> {t('j_save')}</button>
        </Card>
        <Card>
          <K>{t('j_hist')}</K>
          {hist.length ? hist.map((d) => {
            const e = S.journal[d];
            const mm = { Forte: '🔥', Estável: '⚖️', Ansioso: '⚡', Vulnerável: '⚠️' }[e.mood] || '•';
            return (
              <div key={d} className="mb-2 rounded-r border border-line bg-surface2 p-3 text-[12.5px] leading-relaxed">
                <div className="mb-1 flex justify-between"><b>{mm} {d.slice(8, 10) + '/' + d.slice(5, 7)}</b><span className="font-mono text-[10px] text-muted">{d}</span></div>
                {e.good && <p><b className="text-ok">+</b> {e.good}</p>}
                {e.ch && <p><b className="text-danger">−</b> {e.ch}</p>}
                {(e.fallTypes || []).length > 0 && <p><b className="text-danger">{t('j_queda')}</b> {e.fallTypes.map((x) => fallLbl(x)).join(' + ')}</p>}
                {(e.fallTriggers || []).length > 0 && <p><b className="text-danger">{t('j_gat')}</b> {e.fallTriggers.join(', ')}</p>}
                {e.vent && <p><b className="text-gold">{t('j_desab')}</b> {e.vent}</p>}
              </div>
            );
          }) : <Empty>{t('j_empty')}</Empty>}
        </Card>
      </section>

      <section>
        <Card>
          <K><Brain size={12} className="mr-1 inline" /> {t('j_notes')}</K>
          <textarea className="field mb-2" maxLength={400} placeholder={t('j_ph')} value={noteTxt} onChange={(e) => setNoteTxt(e.target.value)} />
          <div className="mb-3 flex flex-wrap gap-1.5">
            {NOTE_TAGS.map((tg, ti) => <button key={tg} className={`tag ${noteTag === tg ? 'sel' : ''}`} onClick={() => setNoteTag(tg)}>{t('nt' + (ti + 1))}</button>)}
          </div>
          <div className="mb-3 flex items-center gap-2">
            <button className="btn-gold flex-1" onClick={saveNote}><Plus size={15} /> {noteEditId != null ? t('j_saveedit') : t('j_add')}</button>
            {noteEditId != null && <button className="chip-dim flex-none" onClick={() => { setNoteEditId(null); setNoteTxt(''); }}>{t('j_cancel')}</button>}
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="field pl-9" placeholder={t('j_search')} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {notes.length ? notes.map((n) => (
            <div key={n.id} className="mb-2 rounded-r border border-line bg-surface2 p-3">
              <p className="text-[13px] leading-relaxed">{n.txt}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="chip-dim px-2 py-0.5 text-[9px]">{NT_TR(n.tag)}</span>
                <span className="font-mono text-[10px] text-muted">{new Date(n.ts).toLocaleDateString(LOCD[lang] || 'pt-BR')}</span>
                <span className="ml-auto flex gap-1.5">
                  <button className="text-muted hover:text-gold" title={t('j_edit_t')} onClick={() => { setNoteEditId(n.id); setNoteTxt(n.txt); setNoteTag(n.tag); }}><Pencil size={13} /></button>
                  <button className="text-muted hover:text-danger" title={t('j_del_t')} onClick={() => confirmBox(t('j_del_q'), '"' + String(n.txt).slice(0, 70) + '" ' + t('j_del_m'), () => { update((s) => { s.notes = s.notes.filter((x) => x.id != n.id); }); if (noteEditId == n.id) { setNoteEditId(null); setNoteTxt(''); } toast(t('j_del_ok')); })}><X size={13} /></button>
                </span>
              </div>
            </div>
          )) : <Empty>{t('j_nempty')}</Empty>}
        </Card>
      </section>
    </div>
  );
}
