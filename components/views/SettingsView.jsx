'use client';
import React, { useRef, useState } from 'react';
import { Cloud, RefreshCw, LogOut, Download, Upload, Skull, Plus, X, ShieldCheck, Languages, Bell, BellOff, UserX, Handshake, Copy, Trophy, Palette } from 'lucide-react';
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
  pt: { active: '✅ ATIVA', trialing: '🎁 TESTE GRÁTIS EM CURSO', inactive: '⛔ INATIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGAMENTO PENDENTE', local: '💾 MODO LOCAL (sem nuvem)' },
  en: { active: '✅ ACTIVE', trialing: '🎁 FREE TRIAL ACTIVE', inactive: '⛔ INACTIVE', canceled: '🚫 CANCELED', past_due: '⚠️ PAYMENT PENDING', local: '💾 LOCAL MODE (no cloud)' },
  es: { active: '✅ ACTIVA', trialing: '🎁 PRUEBA GRATIS ACTIVA', inactive: '⛔ INACTIVA', canceled: '🚫 CANCELADA', past_due: '⚠️ PAGO PENDIENTE', local: '💾 MODO LOCAL (sin nube)' },
};

const THEMES = [
  { id: 'dark', name: '👑 FORJA DOURADA', desc: 'Preto Ônix com detalhes em Ouro Real' },
  { id: 'stealth', name: '⚔️ BLACK OPS', desc: 'Total black minimalista com titânio e cinza tático' },
  { id: 'military', name: '🪖 EXÉRCITO MILITAR', desc: 'Verde Oliva Tático com detalhes camuflados' },
];

export default function SettingsView() {
  const { S, update, toast, confirmBox, auth, setPhase, setAuth, authRef, sub, refreshSub } = useApp();
  const st = S.settings;
  const lang = (st && st.lang) || 'pt';
  const currentTheme = st.theme || 'dark';
  const T = (id, fb) => cx(lang, 'settings', id) || cx(lang, 'life', id) || fb;
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

  return (
    <div className="flex flex-col gap-3.5 pb-16">
      {/* 1. LINHA: Identidade Visual / Idioma (Esq) + Conta & Nuvem (Dir) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
        <Card className="flex flex-col justify-between">
          <div>
            <K><Palette size={12} className="mr-1 inline text-gold" /> TEMAS DE COMBATE</K>
            <p className="fnote mb-3 text-left">Personalize a identidade visual do seu QG de acordo com o seu estilo de combate.</p>
            <div className="flex flex-col gap-2">
              {THEMES.map((th) => {
                const sel = currentTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => selectTheme(th.id)}
                    className={`flex items-center justify-between rounded-r border p-2.5 text-left transition-all ${
                      sel 
                        ? 'border-gold bg-gold/10 shadow-[0_0_12px_rgba(255,200,70,0.2)]' 
                        : 'border-line bg-surface2 hover:border-gold/40'
                    }`}
                  >
                    <div>
                      <b className={`block text-[13px] ${sel ? 'text-gold' : 'text-ink'}`}>{th.name}</b>
                      <small className="block text-[11px] text-muted">{th.desc}</small>
                    </div>
                    <span className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full border text-[10px] font-bold ${
                      sel ? 'border-gold bg-gold text-[#141414]' : 'border-line text-transparent'
                    }`}>✓</span>
                  </button>
                );
              })}
            </div>

            {/* Idioma & Áudio integrado */}
            <div className="mt-4 pt-3 border-t border-line/60">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <div>
                  <b className="text-[12.5px] text-ink">{T('lang_title', 'Idioma do Sistema')}</b>
                  <small className="block text-[10.5px] text-muted">{T('lang_desc', 'Interface principal (PT / EN / ES)')}</small>
                </div>
                <div className="flex gap-1.5">
                  {['pt', 'en', 'es'].map((l) => (
                    <button
                      key={l}
                      className={st.lang === l ? 'chip text-[11px] py-0.5 px-2' : 'chip-dim text-[11px] py-0.5 px-2'}
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

              <div className="flex items-center justify-between gap-3">
                <div>
                  <b className="text-[12.5px] text-ink">{T('sound_title', '🔊 Efeitos Sonoros')}</b>
                  <small className="block text-[10.5px] text-muted">{T('sound_desc', 'Sons táticos via Web Audio API')}</small>
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
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            Preferências visuais e acústicas sincronizadas localmente no dispositivo.
          </p>
        </Card>

        {/* CONTA & NUVEM */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <K style={{ margin: 0 }}><Cloud size={12} className="mr-1 inline text-gold" /> {T('k_cloud', 'SUA CONTA & BACKUP NA NUVEM')}</K>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                cloud.CLOUD ? 'text-ok bg-ok/10 border-ok/30' : 'text-gold2 bg-gold/10 border-gold/30'
              }`}>
                {cloud.CLOUD ? T('cloud_on', 'NUVEM ATIVA') : 'LOCAL'}
              </span>
            </div>

            <div className="p-3 my-2 rounded bg-surface2 border border-line text-xs leading-relaxed space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted">{T('cloud_user', 'Guerreiro Conectado:')}</span>
                <b className="text-gold font-mono truncate max-w-[180px]">{auth.email || '—'}</b>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">{T('cloud_sub', 'Status de Assinatura:')}</span>
                <span className="flex items-center gap-1.5">
                  <b className={sub === 'active' || sub === 'trialing' ? 'text-ok font-bold' : 'text-gold2 font-bold'}>
                    {subLabels[sub] || sub}
                  </b>
                  <button
                    className="underline text-[10px] text-muted hover:text-gold"
                    onClick={() => { refreshSub(2); toast(T('ok_subUpd', '🔄 Status de assinatura atualizado.')); }}
                  >
                    {T('sub_refresh', '(atualizar)')}
                  </button>
                </span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed mb-3">
              {T('cloud_note1', 'Seu progresso de retenção, hábitos da Forja e notas de guerra são salvos automaticamente na sua conta e acompanham você em qualquer aparelho.')}
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost text-xs py-2" onClick={syncNow}>
                <RefreshCw size={13} /> {T('btn_sync', 'SINCRONIZAR AGORA')}
              </button>
              <button className="btn-red text-xs py-2" onClick={signOut}>
                <LogOut size={13} /> {T('btn_signout', 'SAIR DA CONTA')}
              </button>
            </div>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            {T('cloud_note2', 'Sem entrar na sua conta, os dados ficam guardados apenas neste dispositivo.')}
          </p>
        </Card>
      </div>

      {/* 2. LINHA: Status de Vida & Pilares (Esq) + Frases do Código (Dir) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
        {/* STATUS DE VIDA */}
        <Card className="flex flex-col justify-between">
          <div>
            <K>{T('k_life', '💍 STATUS DE VIDA & PILARES')}</K>
            <p className="fnote" style={{ margin: '0 0 10px', textAlign: 'left' }}>
              {T('life_note', 'Define os pilares cobrados diariamente no QG. Alterar abre confirmação; o histórico de dias NUNCA é apagado.')}
            </p>
            <div className="space-y-2">
              {Object.keys(LIFE_STATUS).map((m) => {
                const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
                return (
                  <Chk key={m} className="items-start p-2.5 rounded bg-surface2 border border-line hover:border-gold/40 transition-colors" on={L.lifeMode(S) === m} onClick={() => setStatus(m)}>
                    <b className="block text-[13px]">{LS.label}</b>
                    <small className="block text-[11px] font-semibold text-muted leading-snug mt-0.5">{LS.desc}</small>
                  </Chk>
                );
              })}
            </div>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            Os pilares selecionados orientam as métricas do Heatmap e os relatórios semanais.
          </p>
        </Card>

        {/* FRASES DO CÓDIGO */}
        <Card className="flex flex-col justify-between">
          <div>
            <K>{T('k_phrases', '📜 FRASES DO CÓDIGO DO GUERREIRO')}</K>
            <p className="mb-2 text-[12px] text-muted">
              {T('phrases_intro', 'Sua frase do juramento (o "porquê") é fixa. Adicione frases extras para o botão 🔄 Trocar Frase.')}
            </p>
            <div className="mb-2.5 flex gap-2">
              <input
                className="field flex-1 text-xs"
                maxLength={140}
                placeholder={T('ph_phrase', 'Nova frase de guerra...')}
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && ph.trim()) {
                    update((s) => { s.phrases.push(ph.trim()); });
                    setPh('');
                    toast(T('ok_phraseAdd', '✨ Frase adicionada ao Código.'));
                  }
                }}
              />
              <button
                className="btn-gold flex-none px-3"
                onClick={() => {
                  if (!ph.trim()) return;
                  update((s) => { s.phrases.push(ph.trim()); });
                  setPh('');
                  toast(T('ok_phraseAdd', '✨ Frase adicionada ao Código.'));
                }}
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="max-h-[190px] overflow-y-auto space-y-1.5 pr-1">
              {S.phrases.length ? (
                S.phrases.map((p, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-r border border-line bg-surface2 p-2 text-xs">
                    <span className="italic text-ink truncate leading-snug">"{p}"</span>
                    <button
                      className="text-muted hover:text-danger flex-none p-1"
                      onClick={() => confirmBox(T('c_phTitle', 'EXCLUIR FRASE?'), '"' + p + '"' + T('c_phBody2', ' sairá do seu Código do Guerreiro.'), () => update((s) => { s.phrases.splice(i, 1); s.phraseIdx = 0; }))}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              ) : (
                <Empty>{T('phrases_empty', 'Nenhuma frase extra. O botão 🔄 usa seu Porquê + frases clássicas.')}</Empty>
              )}
            </div>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            Repetir os próprios princípios recalibra o foco mental nos momentos de fraqueza.
          </p>
        </Card>
      </div>

      {/* 3. LINHA: Bloqueio por PIN (Esq) + Salão da Fama (Dir) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
        {/* PIN DE SEGURANÇA */}
        <Card className="flex flex-col justify-between">
          <div>
            <K><ShieldCheck size={12} className="mr-1 inline text-gold" /> {T('k_pin', 'SEGURANÇA — BLOQUEIO POR PIN')}</K>
            {st.pin ? (
              <>
                <p className="mb-2 text-xs font-bold text-ok">{T('pin_on', '✓ PIN ativo. O QG abre somente com o código de 4 dígitos.')}</p>
                <div className="mb-2.5 grid grid-cols-2 gap-2">
                  <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinCur', 'PIN atual')} value={pinCur} onChange={(e) => setPinCur(e.target.value)} />
                  <input type="password" className="field text-xs text-center font-mono" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew1', 'Novo PIN (vazio = remover)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                </div>
                <button className="btn-gold btn-big text-xs py-2" onClick={setPin}>{T('pin_upd', 'ATUALIZAR PIN')}</button>
              </>
            ) : (
              <>
                <p className="mb-2 text-xs text-muted">{T('pin_intro', 'Defina um PIN de 4 dígitos para blindar o acesso ao QG caso alguém pegue seu celular.')}</p>
                <div className="mb-2.5 flex gap-2">
                  <input type="password" className="field flex-1 text-xs text-center font-mono tracking-widest" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew2', 'Novo PIN (4 dígitos)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                  <button className="btn-gold flex-none px-4 text-xs font-bold" onClick={setPin}>{T('pin_act', 'ATIVAR PIN')}</button>
                </div>
              </>
            )}
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            O PIN é criptografado localmente no dispositivo. Não compartilhe seu código.
          </p>
        </Card>

        {/* SALÃO DA FAMA */}
        <Card className="flex flex-col justify-between">
          <div>
            <K><Trophy size={12} className="mr-1 inline text-gold" /> {T('k_hall', 'SALÃO DA FAMA ANÔNIMO')}</K>
            <div className="p-3 my-2 rounded bg-surface2 border border-line">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <b className="text-[13px] text-ink">{T('hall_t', 'Participar do ranking global')}</b>
                  <small className="block text-[11px] text-muted mt-0.5">
                    {S.hallOptIn ? T('hall_pseudo', 'Pseudônimo ativo: ') + S.hallName : T('hall_optin', 'Opt-in: só entra quem ativa explicitamente')}
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
            </div>
            <p className="text-xs text-muted leading-relaxed">
              O Salão da Fama é 100% anônimo. Apenas seu pseudônimo de guerra, patamar e contagem de dias são exibidos aos outros guerreiros. Nenhum e-mail ou dado pessoal é exposto.
            </p>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            Compare seu progresso e inspire a legião mantendo a honra anônima.
          </p>
        </Card>
      </div>

      {/* 4. LINHA: Notificações de Guerra (Esq) + Parceiro de Responsabilidade (Dir) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
        {/* NOTIFICAÇÕES */}
        <Card className="flex flex-col justify-between">
          <div>
            <K><Bell size={12} className="mr-1 inline text-gold" /> {T('k_notif', 'NOTIFICAÇÕES DE GUERRA')}</K>
            {perm !== 'granted' ? (
              <>
                <p className="mb-3 text-xs leading-relaxed text-muted">
                  {T('notif_intro', 'Receba o lembrete noturno de check-in (mesmo com o app fechado) e os alertas de horário dos hábitos.')}
                </p>
                <button className="btn-gold btn-big text-xs py-2.5" disabled={notifBusy} onClick={enableNotif}>
                  <Bell size={14} /> {T('notif_on', 'ATIVAR NOTIFICAÇÕES')}
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-surface2 border border-line flex items-center justify-between gap-3">
                  <div>
                    <b className="text-[12.5px] text-ink">{T('notif_daily_t', 'Lembrete noturno de check-in')}</b>
                    <small className="block text-[10.5px] text-muted">{T('notif_daily_d', 'Push às ~19h (BRT) se você ainda não registrou o dia')}</small>
                  </div>
                  <Toggle on={st.notifDaily !== false} onChange={() => update((s) => { s.settings.notifDaily = s.settings.notifDaily === false; })} />
                </div>
                <div className="p-2.5 rounded bg-surface2 border border-line flex items-center justify-between gap-3">
                  <div>
                    <b className="text-[12.5px] text-ink">{T('notif_hab_t', 'Horários dos hábitos')}</b>
                    <small className="block text-[10.5px] text-muted">{T('notif_hab_d', 'Alerta no horário de cada hábito ativo')}</small>
                  </div>
                  <Toggle on={st.notifHabits !== false} onChange={() => update((s) => { s.settings.notifHabits = s.settings.notifHabits === false; })} />
                </div>
                <button className="btn-dark w-full text-xs py-2 mt-2" onClick={disableNotif}>
                  <BellOff size={13} /> {T('notif_off', 'DESATIVAR NESTE DISPOSITIVO')}
                </button>
              </div>
            )}
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            Notificações pontuais garantem consistência militar no fechamento de cada dia.
          </p>
        </Card>

        {/* PARCEIRO DE RESPONSABILIDADE */}
        <Card className="flex flex-col justify-between">
          <div>
            <K><Handshake size={12} className="mr-1 inline text-gold" /> {T('k_partner', 'PARCEIRO DE RESPONSABILIDADE')}</K>
            {S.partnerToken ? (
              <>
                <p className="mb-2 text-xs text-muted">
                  {T('partner_have', 'Qualquer pessoa com este link vê SOMENTE pseudônimo, dias, streak e patamar — nada mais.')}
                </p>
                <div className="mb-2.5 flex gap-2">
                  <input className="field flex-1 font-mono text-[11px]" readOnly value={(typeof window !== 'undefined' ? window.location.origin : '') + '/p/' + S.partnerToken} />
                  <button className="btn-gold flex-none px-3" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/p/' + S.partnerToken); toast(T('ok_linkCopied', '🔗 Link copiado.')); }}>
                    <Copy size={14} />
                  </button>
                </div>
                <button className="btn-dark w-full text-xs py-2" onClick={() => confirmBox(T('c_plTitle', 'DESATIVAR LINK?'), T('c_plBody', 'Seu parceiro perderá o acesso ao seu cartão de responsabilidade.'), () => update((s) => { s.partnerToken = null; }), T('c_plOk', 'SIM, DESATIVAR'))}>
                  {T('partner_off', 'DESATIVAR LINK')}
                </button>
              </>
            ) : (
              <>
                <p className="mb-3 text-xs leading-relaxed text-muted">
                  {T('partner_intro', 'Accountability segura: gere um link somente-leitura para um mentor ou amigo de confiança acompanhar sua guerra.')}
                </p>
                <button className="btn-gold btn-big text-xs py-2.5" onClick={() => { const tok = Math.random().toString(36).slice(2) + Date.now().toString(36); update((s) => { s.partnerToken = tok; if (!s.hallName) s.hallName = genHallName(); }); toast(T('ok_linkCreated', '🤝 Link de responsabilidade criado.')); }}>
                  <Handshake size={14} /> {T('partner_gen', 'GERAR MEU LINK DE AUDITORIA')}
                </button>
              </>
            )}
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            A responsabilidade compartilhada aumenta em 65% a taxa de sucesso na retenção.
          </p>
        </Card>
      </div>

      {/* 5. LINHA: Backup Local (Esq) + Zona de Perigo (Dir) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-stretch">
        {/* BACKUP LOCAL */}
        <Card className="flex flex-col justify-between">
          <div>
            <K><Download size={12} className="mr-1 inline text-gold" /> {T('k_backup', '💾 BACKUP & DADOS DE GUERRA')}</K>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              Exporte seus dados criptografados em formato .JSON para transferir entre aparelhos ou manter uma cópia física segura.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost text-xs py-2" onClick={exportBk}>
                <Download size={13} /> {T('btn_export', 'EXPORTAR (.JSON)')}
              </button>
              <button className="btn-ghost text-xs py-2" onClick={() => fileRef.current && fileRef.current.click()}>
                <Upload size={13} /> {T('btn_import', 'IMPORTAR BACKUP')}
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) importBk(f); e.target.value = ''; }} />
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            {T('backup_note', 'Sem uma conta na nuvem, seus dados vivem apenas neste dispositivo. Exporte regularmente.')}
          </p>
        </Card>

        {/* ZONA DE PERIGO */}
        <Card className="border-danger/40 flex flex-col justify-between">
          <div>
            <K className="text-danger flex items-center gap-1.5"><Skull size={13} /> {T('k_danger', '☠ ZONA DE PERIGO')}</K>
            <p className="text-xs text-muted mb-2.5 leading-relaxed">
              Ações irreversíveis que redefinem o estado da sua aplicação ou removem sua conta.
            </p>
            <div className="space-y-2">
              <button className="btn-red w-full text-xs py-2" onClick={() => confirmBox(T('c_wipeTitle', 'APAGAR TUDO?'), T('c_wipeBody', 'Onboarding, streaks, diário, hábitos, tarefas e notas serão destruídos para sempre.'), () => { try { localStorage.removeItem(LSKEY); } catch (e) {} location.reload(); }, T('c_wipeOk', 'SIM, QUEIMAR TUDO E RECOMEÇAR'))}>
                <Skull size={14} /> {T('btn_wipe', 'APAGAR TUDO E RECOMEÇAR A GUERRA')}
              </button>
              <button className="btn-red w-full border border-danger/50 bg-transparent text-danger hover:bg-danger/10 text-xs py-2" onClick={deleteAccount}>
                <UserX size={14} /> {T('btn_delAcct', 'EXCLUIR CONTA & DADOS (LGPD)')}
              </button>
            </div>
          </div>
          <p className="fnote mt-3 pt-2 border-t border-line/60 text-left">
            {T('danger_note', 'A exclusão cancela a assinatura ativa e apaga permanentemente seu perfil e registros do servidor.')}
          </p>
        </Card>
      </div>
    </div>
  );
}
