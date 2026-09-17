'use client';
import React, { useState } from 'react';
import { ShieldAlert, Delete, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { AF } from '@/lib/audio';

export default function PinLock() {
  const { S, setPhase } = useApp();
  const [buf, setBuf] = useState('');
  const [err, setErr] = useState(false);

  const press = (k) => {
    AF.ac(); AF.click();
    let next = buf;
    if (k === 'del') next = buf.slice(0, -1);
    else if (k === 'c') next = '';
    else if (buf.length < 4) next = buf + k;
    setBuf(next);
    setErr(false);
    if (next.length === 4) {
      if (next === S.settings.pin) {
        sessionStorage.setItem('fg_unlock', '1');
        AF.chime();
        setPhase(S.onboarded ? 'app' : 'onboard');
      } else {
        setErr(true);
        AF.tone(110, 0.2, 'square', 0.1);
        setTimeout(() => setBuf(''), 350);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-bg p-6">
      <ShieldAlert size={60} className="text-gold" strokeWidth={1.5} />
      <div className="text-center">
        <div className="k" style={{ marginBottom: 0 }}>CÓDIGO DE GUERRA</div>
        <small className="text-[12px] text-muted">Digite seu PIN de 4 dígitos para entrar no QG</small>
      </div>
      <div className={`flex gap-3 ${err ? 'shakeit' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <b key={i} className={`h-3.5 w-3.5 rounded-full border ${i < buf.length ? 'border-gold bg-gold shadow-[0_0_8px_rgba(255,200,70,.6)]' : 'border-line bg-surface2'}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
          <button key={n} className="h-14 w-16 rounded-r border border-line bg-surface text-xl font-extrabold hover:border-gold/50" onClick={() => press(n)}>{n}</button>
        ))}
        <button className="h-14 w-16 rounded-r border border-line bg-surface text-[11px] font-bold text-muted" onClick={() => press('c')}><Trash2 size={16} className="mx-auto" /></button>
        <button className="h-14 w-16 rounded-r border border-line bg-surface text-xl font-extrabold hover:border-gold/50" onClick={() => press('0')}>0</button>
        <button className="h-14 w-16 rounded-r border border-line bg-surface text-muted" onClick={() => press('del')}><Delete size={18} className="mx-auto" /></button>
      </div>
    </div>
  );
}
