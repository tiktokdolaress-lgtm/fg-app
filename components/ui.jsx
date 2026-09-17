'use client';
import React from 'react';
import { useApp } from '@/lib/store';
import { X } from 'lucide-react';
import { AF } from '@/lib/audio';
import { fdmy } from '@/lib/utils';
import { cx } from '@/lib/content-i18n';

export const Card = ({ children, className = '', glow = false }) => (
  <article className={`card rise ${glow ? 'shadow-glow border-gold/40' : ''} ${className}`}>{children}</article>
);

export const K = ({ children, className = '' }) => <span className={`k ${className}`}>{children}</span>;

export const Bar = ({ pct }) => (
  <div className="bar"><i style={{ width: Math.max(0, Math.min(100, pct)) + '%' }} /></div>
);

export const Toggle = ({ on, onChange }) => (
  <button type="button" role="switch" aria-checked={on} className={`tswitch ${on ? 'on' : ''}`} onClick={onChange}><span /></button>
);

export const Chk = ({ on, failed, onClick, children, className = '' }) => (
  <div className={`chk ${on ? 'on' : ''} ${failed ? 'failed' : ''} ${className}`} onClick={onClick}>
    <span className="box">{on ? '✓' : failed ? '✕' : ''}</span>
    <span className="flex-1 min-w-0">{children}</span>
  </div>
);

export const Empty = ({ children }) => <div className="empty">{children}</div>;

/* faixa dos últimos 7 dias (hábitos e tarefas) */
export function WeekStrip({ kind, cells, hint }) {
  return (
    <>
      <div className="wkstrip">
        {cells.map((c) => (
          <button key={c.d} title={fdmy(c.d) + ' · ' + c.lab} onClick={c.onClick} className={`tlc ${c.cls}`} style={{ animation: 'none' }} />
        ))}
      </div>
      <p className="fnote" style={{ textAlign: 'left', margin: '2px 0 0' }}>{hint}</p>
    </>
  );
}

export function ToastHost() {
  const { toastMsg } = useApp();
  return (
    <div
      className={`fixed left-1/2 z-[80] -translate-x-1/2 rounded-r border border-gold/40 bg-[#16161a] px-5 py-3 text-[13px] font-bold text-ink shadow-glow transition-all duration-300 ${toastMsg ? 'bottom-24 opacity-100' : 'bottom-16 opacity-0 pointer-events-none'}`}
      style={{ maxWidth: '92vw', textAlign: 'center' }}
    >
      {toastMsg}
    </div>
  );
}

export function ModalHost() {
  const { modal, closeModal, S } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  return (
    <div className={`fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-sm transition-opacity ${modal ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      {modal && (
        <div className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-r2 border border-gold/25 bg-[#16161a] p-5 rise ${modal.cls}`} style={{ maxWidth: modal.cls.includes('wide') ? 880 : 540 }}>
          <button className="absolute right-3 top-3 text-muted hover:text-ink" onClick={closeModal} aria-label={cx(lang, 'ui', 'close') || 'Fechar'}><X size={18} /></button>
          {modal.node}
        </div>
      )}
    </div>
  );
}

export const Field = ({ label, children }) => (
  <label className="mb-3 block text-left">
    <span className="lbl">{label}</span>
    {children}
  </label>
);

export function playClick() { AF.click(); }
