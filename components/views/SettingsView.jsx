'use client';
import React, { useRef, useState } from 'react';
import { 
  Cloud, RefreshCw, LogOut, Download, Upload, Skull, Plus, X, 
  ShieldCheck, Languages, Bell, BellOff, UserX, Handshake, Copy, 
  Trophy, Palette, Check, Volume2, Shield, Database, ChevronRight, Lock,
  MoreVertical
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { Card, K, Toggle, Chk, Empty } from '@/components/ui';
import { LIFE_STATUS, genHallName } from '@/lib/data';
import { cx } from '@/lib/content-i18n';
import { setLangCookie } from '@/lib/i18n';
import * as cloud from '@/lib/supabase';
import * as L from '@/lib/logic';
import { AF } from '@/lib/audio';
import { today, LSKEY } from '@/lib/utils';
import { pushSupported, askPermission, subscribePush, unsubscribePush } from '@/lib/notify';

const SUB_LBL_FALLBACK = {
  pt: { active: '✅ ATIVA', trialing: '🎁 TESTE GRÁTIS EM CURSO', inactive: '⛔ INATIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGAMENTO PENDENTE', local: '💾 MODO LOCAL' },
  en: { active: '✅ ACTIVE', trialing: '🎁 FREE TRIAL ACTIVE', inactive: '⛔ INACTIVE', canceled: '🚫 CANCELED', past_due: '⚠️ PAYMENT PENDING', local: '💾 LOCAL MODE' },
  es: { active: '✅ ACTIVA', trialing: '🎁 PRUEBA GRATIS ACTIVA', inactive: '⛔ INACTIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGO PENDIENTE', local: '💾 MODO LOCAL' },
};

const THEMES = [
  { id: 'dark', nameKey: 'theme_dark', fallbackName: 'Forja Dourada', icon: '👑', descKey: 'theme_dark_desc', fallbackDesc: 'Preto ônix com ouro real' },
  { id: 'stealth', nameKey: 'theme_stealth', fallbackName: 'Black Ops', icon: '⚔️', descKey: 'theme_stealth_desc', fallbackDesc: 'Titânio fosco & cinza tático' },
  { id: 'military', nameKey: 'theme_military', fallbackName: 'Exército', icon: '🪖', descKey: 'theme_military_desc', fallbackDesc: 'Verde oliva camuflado' },
];

const SETTINGS_CATEGORIES = [
  { id: 'general', key: 'cat_general', label: 'Geral & Visual', icon: Palette },
  { id: 'security', key: 'cat_security', label: 'Segurança & Acesso', icon: Shield },
  { id: 'data', key: 'cat_data', label: 'Conta & Dados', icon: Database },
];

export default function SettingsView() {
  const { S, update, toast, confirmBox, auth, setPhase, setAuth, authRef, sub, refreshSub } = useApp();
  const st = S.settings;
  const lang = (st && st.lang) || 'pt';
  const currentTheme = st.theme || 'dark';
  const T = (id, fb) => cx(lang, 'settings', id) || cx(lang, 'life', id) || fb;
  
  // Categorias para organização minimalista
  const [activeCategory, setActiveCategory] = useState('general');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [pinCur, setPinCur] = useState('');
  const [pinNew, setPinNew] = useState('');
  const [ph, setPh] = useState('');
  const fileRef = useRef(null);
  const [perm, setPerm] = useState(() => (pushSupported() ? Notification.permission : 'denied'));
  const [notifBusy, setNotifBusy] = useState(false);

  const enableNotif = async () => {
    if (notifBusy) return;
    setNotifBusy(true);
    try {
      const p = await askPermission();
      setPerm(p);
      if (p !== 'granted') { toast(T('err_notifDenied', '⚠ Permissão de notificação negada no navegador.')); return; }
      const sess = await cloud.getSession();
      if (!sess || !sess.access_token) throw new Error(T('err_sessExpired', 'Sessão expirada — entre novamente.'));
      await subscribePush(sess.access_token);
      update((s) => { s.settings.notifOn = true; });
      toast(T('ok_notifOn', '🔔 Notificações de guerra ativadas neste dispositivo.'));
    } catch (e) {
      toast('⚠ ' + (e.message || T('err_notifFail', 'Falha ao ativar notificações.')));
    }
    setNotifBusy(false);
  };

  const disableNotif = async () => {
    try {
      const sess = await cloud.getSession();
      await unsubscribePush(sess && sess.access_token);
      update((s) => { s.settings.notifOn = false; });
      toast(T('ok_notifOff', '🔕 Notificações desativadas neste dispositivo.'));
    } catch (e) { toast(T('err_notifOffFail', '⚠ Falha ao desativar.')); }
  };

  const deleteAccount = () =>
    confirmBox(
      T('c_delTitle', 'EXCLUIR CONTA E DADOS?'),
      T('c_delBody', 'Isto cancela a assinatura ativa e apaga PERMANENTEMENTE perfil, registros, diário, notas e notificações (direito LGPD). Esta ação é irreversível.'),
      async () => {
        try {
          const sess = await cloud.getSession();
          const res = await fetch('/api/account/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (sess && sess.access_token) } });
          if (!res.ok) { const d = await res.json().catch(() => ({})); toast('⚠ ' + (d.error || T('err_delFail', 'Falha ao excluir a conta.'))); return; }
          try { localStorage.removeItem(LSKEY); localStorage.removeItem('fg_local_session'); } catch (e) {}
          toast(T('ok_deleted', '🕊 Conta e dados excluídos. Até a próxima, guerreiro.'));
          setTimeout(() => { window.location.href = '/'; }, 900);
        } catch (e) { toast(T('err_delConn', '⚠ Erro de conexão ao excluir.')); }
      },
      T('c_delOk', 'SIM, EXCLUIR TUDO')
    );

  const setStatus = (m) => {
    if (L.lifeMode(S) === m) return;
    const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
    confirmBox(T('c_stTitle', 'MUDAR STATUS DE COMBATE?'), LS.desc + T('c_stBody2', ' Os pilares cobrados diariamente mudarão. O histórico de dias NUNCA é apagado.'), () => { update((s) => { s.lifeStatus = m; }); toast(T('ok_stUpdated', '🛡 Status atualizado.')); }, T('c_stOk', 'SIM, MUDAR'));
  };

  const setPin = () => {
    const nv = pinNew.trim();
    if (st.pin) {
      if (pinCur !== st.pin) { toast(T('err_pinCur', '⚠ PIN atual incorreto.')); return; }
      if (nv) { if (!/^\d{4}$/.test(nv)) { toast(T('err_pin4', '⚠ Use exatamente 4 dígitos.')); return; } update((s) => { s.settings.pin = nv; }); toast(T('ok_pinUpd', '🛡 PIN atualizado.')); }
      else { update((s) => { s.settings.pin = ''; }); toast(T('ok_pinRemoved', '🔓 Bloqueio por PIN removido.')); }
    } else {
      if (!/^\d{4}$/.test(nv)) { toast(T('err_pin4', '⚠ Use exatamente 4 dígitos.')); return; }
      update((s) => { s.settings.pin = nv; }); toast(T('ok_pinOn', '🛡 Bloqueio por PIN ativado.'));
    }
    setPinCur(''); setPinNew('');
  };

  const exportBk = () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'forjando-guerreiros-backup-' + today() + '.json';
    a.click();
    toast(T('ok_bkExp', '💾 Backup exportado.'));
  };

  const importBk = (f) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const o = JSON.parse(r.result);
        if (typeof o !== 'object' || o.onboarded === undefined) throw 0;
        update((s) => Object.assign(s, o));
        toast(T('ok_bkImp', '⬆ Backup importado com sucesso.'));
        setTimeout(() => location.reload(), 800);
      } catch (e) { toast(T('err_bkInvalid', '⚠ Arquivo de backup inválido.')); }
    };
    r.readAsText(f);
  };

  const syncNow = async () => {
    if (!cloud.CLOUD) { toast(T('err_noCloud', '⚠ Supabase não configurado: sincronização indisponível (modo local).')); return; }
    toast(T('sync_ing', '🔄 Sincronizando com a nuvem...'));
    cloud.pushProfile(authRef.current.userId, authRef.current.email, S, true);
    const d = await cloud.pullProfile(authRef.current.userId);
    if (d && d.v) update((s) => Object.assign(s, d));
    toast(T('ok_syncDone', '✅ Sincronização concluída com a nuvem.'));
  };

  const signOut = async () => {
    if (cloud.CLOUD) await cloud.signOut();
    try { localStorage.removeItem('fg_local_session'); } catch (e) {}
    authRef.current = { email: '', userId: null };
    setAuth({ email: '', userId: null });
    setPhase('auth');
    toast(T('ok_signOut', '🚪 Sessão encerrada.'));
  };

  const selectTheme = (themeId) => {
    update((s) => { s.settings.theme = themeId; });
    document.documentElement.dataset.theme = themeId;
    AF.click();
    toast('🎨 ' + (THEMES.find((t) => t.id === themeId)?.name || 'Tema Atualizado'));
  };

  const subLabels = SUB_LBL_FALLBACK[lang] || SUB_LBL_FALLBACK.pt;

  const showGeneral = activeCategory === 'general';
  const showSecurity = activeCategory === 'security';
  const showData = activeCategory === 'data';

  const activeCatObj = SETTINGS_CATEGORIES.find(c => c.id === activeCategory) || SETTINGS_CATEGORIES[0];
  const ActiveIcon = activeCatObj.icon;

  return (
    <div className="flex flex-col gap-3 pb-16">
      {/* 1. SELETOR NO CELULAR (3 PONTINHOS PARA ABRIR AS OPÇÕES) */}
      <div className="relative sm:hidden">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-line bg-surface p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => { AF.click(); setMobileMenuOpen(prev => !prev); }}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-gold/10 border border-gold/30 text-gold text-xs font-bold text-left"
          >
            <ActiveIcon size={14} className="flex-none" />
            <span className="truncate">{T(activeCatObj.key, activeCatObj.label)}</span>
          </button>

          <button
            type="button"
            onClick={() => { AF.click(); setMobileMenuOpen(prev => !prev); }}
            className={`flex items-center justify-center h-8 w-8 rounded border transition-all ${
              mobileMenuOpen
                ? 'border-gold bg-gold text-[#141414] shadow-[0_0_8px_rgba(255,200,70,0.3)]'
                : 'border-line/60 bg-surface2 text-muted hover:text-ink hover:border-gold/40'
            }`}
            aria-label="Opções de configurações"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Dropdown Flutuante no Celular */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1.5 z-50 w-full rounded-lg border border-line bg-surface p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 border-b border-line/40 mb-1 flex items-center justify-between text-muted">
                <span className="text-[10px] font-mono uppercase tracking-wider">
                  ⚙️ {T('sec_settings', 'CONFIGURAÇÕES')}
                </span>
                <span className="text-[10px] font-mono text-gold font-bold">3 SEÇÕES</span>
              </div>
              <div className="space-y-1">
                {SETTINGS_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const sel = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        AF.click();
                        setActiveCategory(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2.5 rounded px-3 py-2 text-xs transition-all ${
                        sel
                          ? 'bg-gold text-[#141414] font-bold shadow-[0_0_8px_rgba(255,200,70,0.25)]'
                          : 'text-muted hover:bg-surface2 hover:text-ink font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={14} className={sel ? 'text-[#141414]' : 'text-gold'} />
                        <span>{T(cat.key, cat.label)}</span>
                      </div>
                      {sel && <Check size={14} className="text-[#141414]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. SELETOR NO PC / DESKTOP (COMO ESTAVA) */}
      <div className="hidden sm:flex items-center justify-between gap-2 rounded-lg border border-line bg-surface p-1.5 shadow-sm">
        <div className="flex items-center gap-1">
          {SETTINGS_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const sel = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { AF.click(); setActiveCategory(cat.id); }}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 text-xs font-bold transition-all ${
                  sel
                    ? 'bg-gold text-[#141414] shadow-[0_0_10px_rgba(255,200,70,0.25)]'
                    : 'text-muted hover:bg-surface2 hover:text-ink'
                }`}
              >
                <Icon size={13} />
                <span>{T(cat.key, cat.label)}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-muted pr-2">
          ⚙️ {T('sec_settings', 'CONFIGURAÇÕES DO QG')}
        </span>
      </div>

      {/* 1. SEÇÃO GERAL & VISUAL */}
      {showGeneral && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* IDENTIDADE VISUAL & ÁUDIO */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Palette size={13} className="mr-1 inline text-gold" /> {T('sec_theme', 'TEMA & IDENTIDADE VISUAL')}</K>
                <span className="text-[10px] font-mono text-gold uppercase px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
                  {(() => {
                    const curr = THEMES.find(t => t.id === currentTheme);
                    return curr ? T(curr.nameKey, curr.fallbackName) : currentTheme;
                  })()}
                </span>
              </div>

              {/* Seletor Compacto de Temas */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {THEMES.map((th) => {
                  const sel = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => selectTheme(th.id)}
                      className={`flex flex-col items-center justify-center rounded border p-2 text-center transition-all ${
                        sel
                          ? 'border-gold bg-gold/15 text-gold shadow-[0_0_8px_rgba(255,200,70,0.2)] font-bold'
                          : 'border-line bg-surface2 text-muted hover:border-gold/40 hover:text-ink'
                      }`}
                    >
                      <span className="text-base mb-0.5">{th.icon}</span>
                      <span className="text-[11.5px] leading-tight truncate w-full">{T(th.nameKey, th.fallbackName)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Linhas integradas de Idioma & Efeitos Sonoros */}
              <div className="space-y-2 pt-2.5 border-t border-line/60">
                <div className="flex items-center justify-between gap-3 p-2 rounded bg-surface2/60 border border-line/40">
                  <div className="flex items-center gap-2">
                    <Languages size={14} className="text-gold" />
                    <div>
                      <b className="text-xs text-ink">{T('lang_title', 'Idioma')}</b>
                      <small className="block text-[10px] text-muted">{T('lang_desc', 'Interface do sistema')}</small>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {['pt', 'en', 'es'].map((l) => (
                      <button
                        key={l}
                        className={st.lang === l ? 'chip text-[10.5px] py-0.5 px-2.5' : 'chip-dim text-[10.5px] py-0.5 px-2.5'}
                        onClick={() => {
                          update((s) => { s.settings.lang = l; });
                          setLangCookie(l);
                          toast(T('lang_toast', '🌐 Idioma: ') + l.toUpperCase());
                        }}
                      >
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 p-2 rounded bg-surface2/60 border border-line/40">
                  <div className="flex items-center gap-2">
                    <Volume2 size={14} className="text-gold" />
                    <div>
                      <b className="text-xs text-ink">{T('sound_title', 'Efeitos Sonoros')}</b>
                      <small className="block text-[10px] text-muted">{T('sound_desc', 'Feedback tático nas ações')}</small>
                    </div>
                  </div>
                  <Toggle
                    on={st.sound}
                    onChange={() => {
                      update((s) => { s.settings.sound = !s.settings.sound; });
                      if (!st.sound) AF.click();
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* STATUS DE VIDA & PILARES */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K>💍 {T('sec_status', 'STATUS DE VIDA & PILARES')}</K>
                <span className="text-[10px] font-mono text-muted">{T('status_impact_badge', 'IMPACTO NO QG')}</span>
              </div>
              <p className="text-[11.5px] text-muted mb-2 leading-relaxed">
                {T('status_desc', 'Define quais hábitos e pilares são cobrados diariamente no seu Quartel General.')}
              </p>

              <div className="space-y-1.5">
                {Object.keys(LIFE_STATUS).map((m) => {
                  const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
                  const sel = L.lifeMode(S) === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setStatus(m)}
                      className={`w-full flex items-start gap-2.5 p-2 rounded border text-left transition-all ${
                        sel
                          ? 'border-gold bg-gold/10 text-ink'
                          : 'border-line/60 bg-surface2/60 text-muted hover:border-gold/30 hover:text-ink'
                      }`}
                    >
                      <span className={`grid h-4 w-4 flex-none place-items-center rounded-full border text-[9px] font-bold mt-0.5 ${
                        sel ? 'border-gold bg-gold text-[#141414]' : 'border-line text-transparent'
                      }`}>✓</span>
                      <div className="flex-1 min-w-0">
                        <b className={`text-xs ${sel ? 'text-gold' : 'text-ink'}`}>{LS.label}</b>
                        <p className="text-[10.5px] text-muted leading-tight truncate">{LS.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 2. SEÇÃO SEGURANÇA & ACESSO */}
      {showSecurity && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* BLOQUEIO POR PIN */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><ShieldCheck size={13} className="mr-1 inline text-gold" /> {T('sec_pin', 'BLOQUEIO POR PIN')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  st.pin ? 'text-ok bg-ok/10 border-ok/30' : 'text-muted bg-surface2 border-line'
                }`}>
                  {st.pin ? T('badge_active', '✓ ATIVADO') : T('badge_disabled', 'DESATIVADO')}
                </span>
              </div>

              {st.pin ? (
                <div className="space-y-2">
                  <p className="text-xs text-ok font-medium">
                    {T('pin_on', '✓ Bloqueio ativo de 4 dígitos blindando o acesso ao app.')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinCur', 'PIN atual')} value={pinCur} onChange={(e) => setPinCur(e.target.value)} />
                    <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew1', 'Novo PIN (ou vazio)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                  </div>
                  <button className="btn-gold w-full text-xs py-1.5" onClick={setPin}>{T('pin_upd', 'ATUALIZAR / REMOVER PIN')}</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {T('pin_intro', 'Defina um PIN de 4 dígitos para impedir o acesso caso alguém pegue seu aparelho.')}
                  </p>
                  <div className="flex gap-2">
                    <input type="password" className="field flex-1 text-xs text-center font-mono tracking-widest" maxLength={4} inputMode="numeric" placeholder={T('ph_pin4_simple', 'Código de 4 dígitos')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                    <button className="btn-gold flex-none px-4 text-xs font-bold py-1.5" onClick={setPin}>{T('pin_act', 'ATIVAR PIN')}</button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* NOTIFICAÇÕES */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Bell size={13} className="mr-1 inline text-gold" /> {T('sec_notif', 'NOTIFICAÇÕES DE GUERRA')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  perm === 'granted' ? 'text-ok bg-ok/10 border-ok/30' : 'text-gold2 bg-gold/10 border-gold/20'
                }`}>
                  {perm === 'granted' ? T('badge_device_active', 'DISPOSITIVO ATIVO') : T('badge_not_authorized', 'NÃO AUTORIZADO')}
                </span>
              </div>

              {perm !== 'granted' ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {T('notif_intro', 'Receba o lembrete noturno de check-in e alertas dos hábitos mesmo com o app fechado.')}
                  </p>
                  <button className="btn-gold w-full text-xs py-2" disabled={notifBusy} onClick={enableNotif}>
                    <Bell size={13} /> {T('notif_on', 'AUTORIZAR NOTIFICAÇÕES NO DISPOSITIVO')}
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_daily_t', 'Lembrete noturno')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_daily_d', 'Push às ~19h se não fez check-in')}</small>
                    </div>
                    <Toggle on={st.notifDaily !== false} onChange={() => update((s) => { s.settings.notifDaily = s.settings.notifDaily === false; })} />
                  </div>
                  <div className="p-2 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-2">
                    <div>
                      <b className="text-xs text-ink">{T('notif_hab_t', 'Horários dos hábitos')}</b>
                      <small className="block text-[10px] text-muted">{T('notif_hab_d', 'Alertas nos horários agendados')}</small>
                    </div>
                    <Toggle on={st.notifHabits !== false} onChange={() => update((s) => { s.settings.notifHabits = s.settings.notifHabits === false; })} />
                  </div>
                  <button className="btn-dark w-full text-[11px] py-1 text-muted hover:text-ink mt-1" onClick={disableNotif}>
                    <BellOff size={12} /> {T('notif_off', 'Desativar neste dispositivo')}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* PARCEIRO DE RESPONSABILIDADE */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Handshake size={13} className="mr-1 inline text-gold" /> {T('sec_partner', 'PARCEIRO DE RESPONSABILIDADE')}</K>
                <span className="text-[10px] font-mono text-muted">{T('badge_accountability', 'ACCOUNTABILITY')}</span>
              </div>

              {S.partnerToken ? (
                <div className="space-y-2">
                  <p className="text-[11.5px] text-muted">
                    {T('partner_have', 'Link somente-leitura ativo. Exibe apenas pseudônimo, dias e streak:')}
                  </p>
                  <div className="flex gap-1.5">
                    <input className="field flex-1 font-mono text-[11px] py-1" readOnly value={(typeof window !== 'undefined' ? window.location.origin : '') + '/p/' + S.partnerToken} />
                    <button className="btn-gold flex-none px-3" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/p/' + S.partnerToken); toast(T('ok_linkCopied', '🔗 Link copiado.')); }}>
                      <Copy size={13} />
                    </button>
                  </div>
                  <button className="btn-dark w-full text-xs py-1 text-danger hover:bg-danger/10" onClick={() => confirmBox(T('c_plTitle', 'DESATIVAR LINK?'), T('c_plBody', 'Seu parceiro perderá o acesso ao seu cartão de responsabilidade.'), () => update((s) => { s.partnerToken = null; }), T('c_plOk', 'SIM, DESATIVAR'))}>
                    {T('partner_off', 'Desativar Link')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted leading-relaxed">
                    {T('partner_intro', 'Gere um link seguro para um amigo ou mentor acompanhar seu progresso sem expor notas ou dados privados.')}
                  </p>
                  <button className="btn-gold w-full text-xs py-2" onClick={() => { const tok = Math.random().toString(36).slice(2) + Date.now().toString(36); update((s) => { s.partnerToken = tok; if (!s.hallName) s.hallName = genHallName(); }); toast(T('ok_linkCreated', '🤝 Link de responsabilidade criado.')); }}>
                    <Handshake size={13} /> {T('btn_partner_create', 'GERAR LINK DE AUDITORIA')}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* SALÃO DA FAMA */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <K><Trophy size={13} className="mr-1 inline text-gold" /> {T('sec_hall', 'SALÃO DA FAMA')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  S.hallOptIn ? 'text-gold bg-gold/10 border-gold/30' : 'text-muted bg-surface2 border-line'
                }`}>
                  {S.hallOptIn ? T('badge_participating', 'PARTICIPANDO') : T('badge_hidden', 'OCULTO')}
                </span>
              </div>

              <div className="p-2.5 rounded bg-surface2 border border-line/60 flex items-center justify-between gap-3 mb-2">
                <div>
                  <b className="text-xs text-ink">{T('hall_t', 'Participar do ranking anônimo')}</b>
                  <small className="block text-[10.5px] text-muted">
                    {S.hallOptIn ? T('hall_pseudo', 'Pseudônimo: ') + (S.hallName || 'Guerreiro') : T('hall_optin', 'Apenas quem opta explicitamente é exibido')}
                  </small>
                </div>
                <Toggle
                  on={!!S.hallOptIn}
                  onChange={() => update((s) => {
                    s.hallOptIn = !s.hallOptIn;
                    if (s.hallOptIn && !s.hallName) s.hallName = genHallName();
                  })}
                />
              </div>

              <p className="text-[11px] text-muted leading-relaxed">
                {T('hall_intro', '100% anônimo. Apenas seu pseudônimo de combate e sequência de dias são visíveis para inspirar a tropa.')}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* 3. SEÇÃO CONTA, DADOS & CÓDIGO */}
      {showData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
          {/* CONTA & NUVEM */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K><Cloud size={13} className="mr-1 inline text-gold" /> {T('sec_account', 'SUA CONTA & NUVEM')}</K>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  cloud.CLOUD ? 'text-ok bg-ok/10 border-ok/30' : 'text-gold2 bg-gold/10 border-gold/30'
                }`}>
                  {cloud.CLOUD ? T('badge_cloud_active', 'NUVEM ATIVA') : T('badge_local', 'LOCAL')}
                </span>
              </div>

              <div className="p-2.5 rounded bg-surface2 border border-line/60 text-xs space-y-1.5 mb-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-muted">{T('lbl_warrior', 'Guerreiro:')}</span>
                  <b className="text-gold font-mono truncate max-w-[200px]">{auth.email || '—'}</b>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">{T('lbl_subscription', 'Assinatura:')}</span>
                  <span className="flex items-center gap-1.5">
                    <b className={sub === 'active' || sub === 'trialing' ? 'text-ok font-bold' : 'text-gold2 font-bold'}>
                      {subLabels[sub] || sub}
                    </b>
                    <button
                      className="underline text-[10px] text-muted hover:text-gold"
                      onClick={() => { refreshSub(2); toast(T('ok_subUpd', '🔄 Status atualizado.')); }}
                    >
                      {T('sub_refresh', '(atualizar)')}
                    </button>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="btn-ghost text-xs py-1.5" onClick={syncNow}>
                  <RefreshCw size={13} /> {T('btn_sync', 'Sincronizar Agora')}
                </button>
                <button className="btn-red text-xs py-1.5" onClick={signOut}>
                  <LogOut size={13} /> {T('btn_signout', 'Sair da Conta')}
                </button>
              </div>
            </div>
          </Card>

          {/* BACKUP LOCAL */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K><Download size={13} className="mr-1 inline text-gold" /> {T('sec_backup', 'BACKUP EM ARQUIVO')}</K>
                <span className="text-[10px] font-mono text-muted">FORMATO .JSON</span>
              </div>
              <p className="text-xs text-muted mb-2.5 leading-relaxed">
                {T('backup_desc', 'Exporte uma cópia completa dos seus dados criptografados para backup físico ou migração de aparelho.')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-ghost text-xs py-1.5" onClick={exportBk}>
                  <Download size={13} /> {T('btn_export', 'Exportar Backup')}
                </button>
                <button className="btn-ghost text-xs py-1.5" onClick={() => fileRef.current && fileRef.current.click()}>
                  <Upload size={13} /> {T('btn_import', 'Importar Arquivo')}
                </button>
              </div>
              <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) importBk(f); e.target.value = ''; }} />
            </div>
          </Card>

          {/* FRASES DO CÓDIGO DO GUERREIRO */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K>📜 {T('sec_phrases', 'FRASES DO CÓDIGO DO GUERREIRO')}</K>
                <span className="text-[10px] font-mono text-muted">{S.phrases.length} {T('lbl_extras', 'EXTRAS')}</span>
              </div>

              <div className="mb-2 flex gap-1.5">
                <input
                  className="field flex-1 text-xs py-1.5"
                  maxLength={140}
                  placeholder={T('phrases_placeholder', 'Adicionar lema ou princípio de guerra...')}
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ph.trim()) {
                      update((s) => { s.phrases.push(ph.trim()); });
                      setPh('');
                      toast(T('ok_phraseAdd', '✨ Frase adicionada.'));
                    }
                  }}
                />
                <button
                  className="btn-gold flex-none px-3 py-1.5"
                  onClick={() => {
                    if (!ph.trim()) return;
                    update((s) => { s.phrases.push(ph.trim()); });
                    setPh('');
                    toast(T('ok_phraseAdd', '✨ Frase adicionada.'));
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1">
                {S.phrases.length ? (
                  S.phrases.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 rounded border border-line/60 bg-surface2/60 px-2 py-1.5 text-xs">
                      <span className="italic text-ink truncate">"{p}"</span>
                      <button
                        className="text-muted hover:text-danger flex-none p-0.5"
                        onClick={() => confirmBox(T('c_phTitle', 'EXCLUIR FRASE?'), `Remover "${p}" do Código?`, () => update((s) => { s.phrases.splice(i, 1); s.phraseIdx = 0; }))}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <Empty className="py-2 text-[11px]">{T('phrases_empty', 'Nenhuma frase customizada adicionada ainda.')}</Empty>
                )}
              </div>
            </div>
          </Card>

          {/* ZONA CRÍTICA */}
          <Card className="border-danger/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <K className="text-danger flex items-center gap-1"><Skull size={13} /> {T('sec_danger', 'ZONA CRÍTICA')}</K>
                <span className="text-[10px] font-mono text-danger/80">{T('badge_irreversible', 'AÇÕES IRREVERSÍVEIS')}</span>
              </div>
              <p className="text-xs text-muted mb-2.5 leading-relaxed">
                {T('danger_desc', 'Ações definitivas que redefinem o banco de dados local ou apagam sua conta na nuvem.')}
              </p>
              <div className="space-y-1.5">
                <button className="btn-red w-full text-xs py-1.5" onClick={() => confirmBox(T('c_wipeTitle', 'APAGAR TUDO?'), T('c_wipeBody', 'Onboarding, streaks, diário, hábitos, tarefas e notas serão destruídos para sempre.'), () => { try { localStorage.removeItem(LSKEY); } catch (e) {} location.reload(); }, T('c_wipeOk', 'SIM, QUEIMAR TUDO E RECOMEÇAR'))}>
                  <Skull size={13} /> {T('btn_wipe', 'Resetar Dados Locais')}
                </button>
                <button className="btn-red w-full border border-danger/40 bg-transparent text-danger hover:bg-danger/10 text-xs py-1.5" onClick={deleteAccount}>
                  <UserX size={13} /> {T('btn_delAcct', 'Excluir Conta & Dados (LGPD)')}
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
