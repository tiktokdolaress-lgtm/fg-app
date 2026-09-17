'use client';
import React, { useEffect, useState } from 'react';

/* Mostra o preço DA REGIÃO do visitante (uma moeda só, sem vazar a outra). */
export default function PriceTag() {
  const [price, setPrice] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch('/api/region-price').then((r) => r.json()).then((d) => { if (alive && d && d.price) setPrice(d.price); }).catch(() => {});
    return () => { alive = false; };
  }, []);
  return <b className="text-gold">{price || '—'}</b>;
}
