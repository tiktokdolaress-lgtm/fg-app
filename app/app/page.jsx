'use client';
import React from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { ModalHost, ToastHost } from '@/components/ui';
import AuthGate from '@/components/AuthGate';
import PinLock from '@/components/PinLock';
import Onboarding from '@/components/Onboarding';
import Paywall from '@/components/Paywall';
import Shell from '@/components/Shell';

function Gates() {
  const { phase, S, sub } = useApp();
  if (!S || phase === 'boot') return <div className="grid min-h-dvh place-items-center font-display text-2xl tracking-[.2em] text-gold">FORJANDO...</div>;
  if (phase === 'auth') return <AuthGate />;
  if (phase === 'lock') return <PinLock />;
  if (phase === 'onboard') return <Onboarding />;
  const pago = sub === 'local' || sub === 'active' || sub === 'trialing';
  if (!pago) return <Paywall />;
  return <Shell />;
}

export default function AppPage() {
  return (
    <AppProvider>
      <Gates />
      <ModalHost />
      <ToastHost />
    </AppProvider>
  );
}
