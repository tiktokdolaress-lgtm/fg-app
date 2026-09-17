'use client';
/* i18n ETAPA 2 — seletor PT/EN/ES da landing (cookie + refresh, sem recarregar a página) */
import React from 'react';
import { useRouter } from 'next/navigation';
import { LANGS, setLangCookie } from '@/lib/i18n';

export default function LangPick({ lang }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Idioma / Language / Idioma">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => { setLangCookie(l); router.refresh(); }}
          aria-current={l === lang ? 'true' : undefined}
          className={`px-2 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider transition-colors ${
            l === lang ? 'bg-gold/15 text-gold' : 'text-muted hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
