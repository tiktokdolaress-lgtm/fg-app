'use client';
import React, { useEffect, useState } from 'react';
import { cx } from '@/lib/content-i18n';

/* Mostra o preço DA REGIÃO do visitante (uma moeda só, sem vazar a outra).
   i18n ETAPA 2: o sufixo "/mês" acompanha o idioma da página. */
export default function PriceTag({ lang = 'pt' }) {
  const [price, setPrice] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/region-price').then((r) => r.json()).then((d) => { if (alive && d && (d.amount || d.price)) setPrice(d.amount || d.price); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const suffix = cx(lang, 'land', 'per_month') || '/mês';
  return <b className="text-gold">{price ? `${price}${suffix}` : '—'}</b>;
}
