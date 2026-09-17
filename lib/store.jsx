'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LSKEY, today } from './utils';
import { DEF, mergeS, T as translate, tierNow } from './logic';
import { setSoundGate, AF } from './audio';
import * as cloud from './supabase';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

function loadLocal() {
  try {
    const r = localStorage.getItem(LSKEY);
    if (r) return mergeS(JSON.parse(r));
  } catch (e) {}
  /* i18n ETAPA 2: conta nova herda o idioma escolhido na landing (cookie fg_lang) */
  const s = DEF();
  try {
    const c = document.cookie.match(/(^|; )fg_lang=(pt|en|es)/);
    if (c) s.settings.lang = c[2];
  } catch (e) {}
  return mergeS(s);
}

export function AppProvider({ children }) {
  const [S, setS] = useState(null);                 // estado de guerra (null = boot)
  const [phase, setPhase] = useState('boot');       // boot | auth | lock | onboard | app
  const [tab, setTab] = useState('qg');
  const [toastMsg, setToastMsg] = useState(null);
  const [modal, setModal] = useState(null);         // {node, cls}
  const [auth, setAuth] = useState({ email: '', userId: null });
  const [sub, setSub] = useState('inactive');       // inactive | trialing | active | canceled | local
  const [subChecking, setSubChecking] = useState(false);
  const authRef = useRef({ email: '', userId: null });
  const toastT = useRef(null);
  const SRef = useRef(null);
  SRef.current = S;

  /* gate de som ligado ao setting */
  useEffect(() => {
    setSoundGate(() => !!(SRef.current && SRef.current.settings.sound));
  }, []);

  /* tema + cosmic + modo discreto */
  useEffect(() => {
    if (!S) return;
    document.documentElement.dataset.theme = S.settings.theme || 'dark';
    document.body.classList.toggle('cosmic', tierNow(S).min >= 180);
    const disc = !!S.settings.discreet;
    document.title = disc ? 'FG Diário' : 'FORJANDO GUERREIROS ⚔ Retenção & Disciplina';
    let link = document.querySelector('link[rel="manifest"]');
    if (!link) { link = document.createElement('link'); link.rel = 'manifest'; document.head.appendChild(link); }
    link.href = disc ? '/manifest-discreto.webmanifest' : '/manifest.webmanifest';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = disc ? '#6C7684' : '#0D0D0E';
  }, [S && S.settings.theme, S && S.settings.discreet, S && S.purity, S && S.retStart]);

  const persist = useCallback((next) => {
    try { localStorage.setItem(LSKEY, JSON.stringify(next)); } catch (e) {}
    const a = authRef.current;
    if (a.userId) cloud.pushProfile(a.userId, a.email, next);
  }, []);

  const update = useCallback((fn) => {
    setS((prev) => {
      const draft = JSON.parse(JSON.stringify(prev || DEF()));
      fn(draft);
      persist(draft);
      return draft;
    });
  }, [persist]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const openModal = useCallback((node, cls) => setModal({ node, cls: cls || '' }), []);
  const closeModal = useCallback(() => setModal(null), []);
  const confirmBox = useCallback((title, msg, onYes, yesLabel) => {
    openModal(
      <div className="text-center">
        <h3 className="mb-2 font-display text-2xl tracking-wide text-danger">⚠ {title}</h3>
        <p className="mb-4 text-sm text-muted">{msg}</p>
        <button className="btn-red btn-big" onClick={() => { AF.click(); closeModal(); onYes(); }}>{yesLabel || 'SIM, EXCLUIR'}</button>
        <button className="btn-dark btn-big mt-2" onClick={closeModal}>Cancelar</button>
        <p className="fnote">Esta ação é irreversível.</p>
      </div>
    );
  }, [openModal, closeModal]);

  /* consulta o status de assinatura com paciência (espera o webhook chegar) */
  const refreshSub = useCallback(async (tries = 6) => {
    const uidNow = authRef.current.userId;
    if (!uidNow || String(uidNow).indexOf('local:') === 0) { setSub('local'); return 'local'; }
    setSubChecking(true);
    let st = 'inactive';
    for (let i = 0; i < tries; i++) {
      st = await cloud.getSubscription(uidNow);
      setSub(st);
      if (st === 'active' || st === 'trialing') break;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, 2500));
    }
    setSubChecking(false);
    return st;
  }, []);

  /* entra no app com sessão (nuvem ou local) */
  const enterApp = useCallback(async (sess) => {
    const email = (sess && (sess.user ? sess.user.email : sess.email)) || '';
    const userId = (sess && sess.user ? sess.user.id : null) || (sess && sess.local ? 'local:' + sess.email : 'local:' + email);
    authRef.current = { email, userId };
    setAuth({ email, userId });
    setSub(String(userId).indexOf('local:') === 0 ? 'local' : 'inactive');
    if (String(userId).indexOf('local:') !== 0) cloud.getSubscription(userId).then((s) => setSub(s || 'inactive'));
    if (typeof window !== 'undefined' && window.location.search.includes('success=true')) {
      window.history.replaceState({}, '', window.location.pathname);
      refreshSub(8);
    }
    const remote = await cloud.pullProfile(userId);
    let next = SRef.current;
    if (remote && remote.v) {
      next = mergeS(remote);
      try { localStorage.setItem(LSKEY, JSON.stringify(next)); } catch (e) {}
      setS(next);
    }
    cloud.subscribeProfile(userId, (data) => {
      setS((prev) => {
        const merged = mergeS(data);
        try { localStorage.setItem(LSKEY, JSON.stringify(merged)); } catch (e) {}
        return merged;
      });
      toast('☁️ Dados sincronizados da nuvem');
    });
    const cur = next || SRef.current;
    if (cur && cur.settings.pin && !sessionStorage.getItem('fg_unlock')) setPhase('lock');
    else if (cur && cur.onboarded) setPhase('app');
    else setPhase('onboard');
  }, [toast, refreshSub]);

  /* boot */
  useEffect(() => {
    let alive = true;
    (async () => {
      const local = loadLocal();
      if (!alive) return;
      setS(local);
      try {
        if (cloud.CLOUD) {
          const sess = await cloud.getSession();
          if (!alive) return;
          if (sess) { await enterApp(sess); return; }
        }
        const em = typeof window !== 'undefined' ? localStorage.getItem('fg_local_session') : null;
        if (em) { await enterApp({ local: true, email: em }); return; }
        setPhase('auth');
      } catch (e) {
        authRef.current = { email: '', userId: 'local:fail' };
        if (local.onboarded) setPhase('app'); else setPhase('onboard');
      }
    })();
    return () => { alive = false; };
  }, [enterApp]);

  /* pull ao voltar para a aba */
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && authRef.current.userId) {
        cloud.pullProfile(authRef.current.userId).then((d) => {
          if (d && d.v) setS(() => { const m = mergeS(d); try { localStorage.setItem(LSKEY, JSON.stringify(m)); } catch (e) {} return m; });
        });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  /* sync de token renovado / signout remoto */
  useEffect(() => {
    if (!cloud.CLOUD) return;
    return cloud.onAuth((ev, session) => {
      if (ev === 'SIGNED_OUT') {
        authRef.current = { email: '', userId: null };
        setAuth({ email: '', userId: null });
        try { localStorage.removeItem('fg_local_session'); } catch (e) {}
        setPhase('auth');
      }
      if (ev === 'TOKEN_REFRESHED' && session && authRef.current.userId) {
        cloud.pullProfile(authRef.current.userId).then((d) => { if (d && d.v) setS(mergeS(d)); });
      }
    });
  }, []);

  const t = useCallback((k) => translate(SRef.current, k), []);

  const value = useMemo(() => ({
    S, phase, setPhase, tab, setTab, toast, toastMsg,
    openModal, closeModal, confirmBox, modal,
    update, enterApp, auth, setAuth, authRef, t, AF,
    sub, subChecking, refreshSub,
  }), [S, phase, tab, toast, toastMsg, modal, openModal, closeModal, confirmBox, update, enterApp, auth, t, sub, subChecking, refreshSub]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
