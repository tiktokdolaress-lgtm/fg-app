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
    <div className="grid gap-3.5 lg:grid-cols-2">
      <section>
        {/* TEMAS DE GUERRA */}
        <Card className="mb-3.5">
          <K><Palette size={12} className="mr-1 inline" /> TEMAS DE COMBATE</K>
          <p className="fnote mb-3 text-left">Personalize a identidade visual do seu QG de acordo com o seu estilo de combate.</p>
          <div className="flex flex-col gap-2">
            {THEMES.map((th) => {
              const sel = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => selectTheme(th.id)}
                  className={`flex items-center justify-between rounded-r border p-3 text-left transition-all ${
                    sel 
                      ? 'border-gold bg-gold/10 shadow-[0_0_12px_rgba(255,200,70,0.2)]' 
                      : 'border-line bg-surface2 hover:border-gold/40'
                  }`}
                >
                  <div>
                    <b className={`block text-[13px] ${sel ? 'text-gold' : 'text-ink'}`}>{th.name}</b>
                    <small className="block text-[11px] text-muted">{th.desc}</small>
                  </div>
                  <span className={`grid h-[20px] w-[20px] flex-none place-items-center rounded-full border text-[11px] font-bold ${
                    sel ? 'border-gold bg-gold text-[#141414]' : 'border-line text-transparent'
                  }`}>✓</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* IDIOMA & SOM */}
        <Card className="mb-3.5">
          <K><Languages size={12} className="mr-1 inline" /> {T('k_lang', 'IDIOMA & ÁUDIO')}</K>
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-3">
            <div><b className="text-[13px]">{T('lang_title', 'Idioma')}</b><small className="block text-[11px] text-muted">{T('lang_desc', 'Interface principal (PT / EN / ES)')}</small></div>
            <div className="flex gap-1.5">{['pt', 'en', 'es'].map((l) => <button key={l} className={st.lang === l ? 'chip' : 'chip-dim'} onClick={() => { update((s) => { s.settings.lang = l; }); setLangCookie(l); toast(T('lang_toast', '🌐 Idioma: ') + l.toUpperCase()); }}>{l.toUpperCase()}</button>)}</div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div><b className="text-[13px]">{T('sound_title', '🔊 Efeitos Sonoros')}</b><small className="block text-[11px] text-muted">{T('sound_desc', 'Sons sintetizados via Web Audio API')}</small></div>
            <Toggle on={st.sound} onChange={() => { update((s) => { s.settings.sound = !s.settings.sound; }); if (!st.sound) AF.click(); }} />
          </div>
        </Card>

        {/* STATUS DE VIDA */}
        <Card className="mb-3.5">
          <K>{T('k_life', '💍 STATUS DE VIDA & PILARES')}</K>
          <p className="fnote" style={{ margin: '0 0 10px', textAlign: 'left' }}>{T('life_note', 'Define os pilares cobrados diariamente no QG. Alterar abre confirmação; o histórico de dias NUNCA é apagado.')}</p>
          {Object.keys(LIFE_STATUS).map((m) => {
            const LS = cx(lang, 'life', m) || LIFE_STATUS[m];
            return (
              <Chk key={m} className="mb-2 items-start" on={L.lifeMode(S) === m} onClick={() => setStatus(m)}>
                <b className="block text-[13px]">{LS.label}</b><small className="block text-[11px] font-semibold text-muted">{LS.desc}</small>
              </Chk>
            );
          })}
        </Card>

        {/* NOTIFICAÇÕES */}
        <Card className="mb-3.5">
          <K><Bell size={12} className="mr-1 inline" /> {T('k_notif', 'NOTIFICAÇÕES DE GUERRA')}</K>
          {perm !== 'granted' ? (
            <>
              <p className="mb-2.5 text-[13px] text-muted">{T('notif_intro', 'Receba o lembrete noturno de check-in (mesmo com o app fechado) e os alertas de horário dos hábitos.')}</p>
              <button className="btn-gold btn-big" disabled={notifBusy} onClick={enableNotif}><Bell size={15} /> {T('notif_on', 'ATIVAR NOTIFICAÇÕES')}</button>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-3">
                <div><b className="text-[13px]">{T('notif_daily_t', 'Lembrete noturno de check-in')}</b><small className="block text-[11px] text-muted">{T('notif_daily_d', 'Push às ~19h (BRT) se você ainda não registrou o dia')}</small></div>
                <Toggle on={st.notifDaily !== false} onChange={() => update((s) => { s.settings.notifDaily = s.settings.notifDaily === false; })} />
              </div>
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-line pb-3">
                <div><b className="text-[13px]">{T('notif_hab_t', 'Horários dos hábitos')}</b><small className="block text-[11px] text-muted">{T('notif_hab_d', 'Alerta no horário de cada hábito ativo (com o app aberto)')}</small></div>
                <Toggle on={st.notifHabits !== false} onChange={() => update((s) => { s.settings.notifHabits = s.settings.notifHabits === false; })} />
              </div>
              <button className="btn-dark btn-big" onClick={disableNotif}><BellOff size={15} /> {T('notif_off', 'DESATIVAR NESTE DISPOSITIVO')}</button>
            </>
          )}
        </Card>

        {/* PARCEIRO DE RESPONSABILIDADE */}
        <Card className="mb-3.5">
          <K><Handshake size={12} className="mr-1 inline" /> {T('k_partner', 'PARCEIRO DE RESPONSABILIDADE')}</K>
          {S.partnerToken ? (
            <>
              <p className="mb-2.5 text-[12.5px] text-muted">{T('partner_have', 'Qualquer pessoa com este link vê SOMENTE pseudônimo, dias, streak e patamar — nada mais.')}</p>
              <div className="mb-2.5 flex gap-2">
                <input className="field flex-1 font-mono text-[11px]" readOnly value={(typeof window !== 'undefined' ? window.location.origin : '') + '/p/' + S.partnerToken} />
                <button className="btn-gold flex-none" onClick={() => { navigator.clipboard.writeText(window.location.origin + '/p/' + S.partnerToken); toast(T('ok_linkCopied', '🔗 Link copiado.')); }}><Copy size={14} /></button>
              </div>
              <button className="btn-dark btn-big" onClick={() => confirmBox(T('c_plTitle', 'DESATIVAR LINK?'), T('c_plBody', 'Seu parceiro perderá o acesso ao seu cartão de responsabilidade.'), () => update((s) => { s.partnerToken = null; }), T('c_plOk', 'SIM, DESATIVAR'))}>{T('partner_off', 'DESATIVAR LINK')}</button>
            </>
          ) : (
            <>
              <p className="mb-2.5 text-[13px] text-muted">{T('partner_intro', 'Accountability segura: gere um link somente-leitura para um mentor ou amigo de confiança acompanhar sua guerra.')}</p>
              <button className="btn-gold btn-big" onClick={() => { const tok = Math.random().toString(36).slice(2) + Date.now().toString(36); update((s) => { s.partnerToken = tok; if (!s.hallName) s.hallName = genHallName(); }); toast(T('ok_linkCreated', '🤝 Link de responsabilidade criado.')); }}><Handshake size={15} /> {T('partner_gen', 'GERAR MEU LINK')}</button>
            </>
          )}
        </Card>

        {/* SALÃO DA FAMA */}
        <Card className="mb-3.5">
          <K><Trophy size={12} className="mr-1 inline" /> {T('k_hall', 'SALÃO DA FAMA ANÔNIMO')}</K>
          <div className="flex items-center justify-between gap-3">
            <div><b className="text-[13px]">{T('hall_t', 'Participar do ranking')}</b><small className="block text-[11px] text-muted">{S.hallOptIn ? T('hall_pseudo', 'Pseudônimo: ') + S.hallName : T('hall_optin', 'Opt-in: só entra quem ativa')}</small></div>
            <Toggle on={!!S.hallOptIn} onChange={() => update((s) => { s.hallOptIn = !s.hallOptIn; if (s.hallOptIn && !s.hallName) s.hallName = genHallName(); })} />
          </div>
        </Card>

        {/* PIN */}
        <Card>
          <K><ShieldCheck size={12} className="mr-1 inline" /> {T('k_pin', 'SEGURANÇA — BLOQUEIO POR PIN')}</K>
          {st.pin ? (
            <>
              <p className="mb-2.5 text-[13px] font-bold text-ok">{T('pin_on', '✓ PIN ativo. O QG abre somente com o código.')}</p>
              <div className="mb-2.5 grid grid-cols-2 gap-2">
                <input type="password" className="field" maxLength={4} inputMode="numeric" placeholder={T('ph_pinCur', 'PIN atual')} value={pinCur} onChange={(e) => setPinCur(e.target.value)} />
                <input type="password" className="field" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew1', 'Novo PIN (vazio = remover)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
              </div>
              <button className="btn-gold btn-big" onClick={setPin}>{T('pin_upd', 'ATUALIZAR PIN')}</button>
            </>
          ) : (
            <>
              <p className="mb-2.5 text-[13px] text-muted">{T('pin_intro', 'Defina um PIN de 4 dígitos para blindar o acesso ao QG.')}</p>
              <div className="mb-2.5 flex gap-2">
                <input type="password" className="field flex-1" maxLength={4} inputMode="numeric" placeholder={T('ph_pinNew2', 'Novo PIN (4 dígitos)')} value={pinNew} onChange={(e) => setPinNew(e.target.value)} />
                <button className="btn-gold flex-none" onClick={setPin}>{T('pin_act', 'ATIVAR')}</button>
              </div>
            </>
          )}
        </Card>
      </section>

      <section>
        {/* CONTA & NUVEM */}
        <Card className="mb-3.5">
          <K><Cloud size={12} className="mr-1 inline" /> {T('k_cloud', 'SUA CONTA & BACKUP NA NUVEM')}</K>
          <p className="mb-3 text-[12.5px] leading-relaxed text-muted">
            {T('cloud_sync_lbl', 'Status da sincronização: ')}{cloud.CLOUD ? <b className="text-ok">{T('cloud_on', 'ATIVA')}</b> : <b className="text-gold2">{T('cloud_off_lbl', 'SOMENTE NESTE DISPOSITIVO')}</b>}<br />
            {T('cloud_user', 'Conectado como: ')}<b className="text-gold">{auth.email || '—'}</b><br />
            {T('cloud_sub', 'Assinatura: ')}<b className={sub === 'active' || sub === 'trialing' ? 'text-ok' : 'text-gold2'}>{subLabels[sub] || sub}</b>{' '}
            <button className="underline text-[11px] text-muted hover:text-gold" onClick={() => { refreshSub(2); toast(T('ok_subUpd', '🔄 Status de assinatura atualizado.')); }}>{T('sub_refresh', '(atualizar)')}</button><br />
            {T('cloud_note1', 'Seu progresso é salvo automaticamente na sua conta e acompanha você em qualquer aparelho.')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-ghost" onClick={syncNow}><RefreshCw size={14} /> {T('btn_sync', 'SINCRONIZAR AGORA')}</button>
            <button className="btn-red" onClick={signOut}><LogOut size={14} /> {T('btn_signout', 'SAIR DA CONTA')}</button>
          </div>
          <p className="fnote">{T('cloud_note2', 'Sem entrar na sua conta, os dados ficam guardados apenas neste dispositivo. Entre com sua conta para protegê-los.')}</p>
        </Card>

        {/* FRASES DO CÓDIGO */}
        <Card className="mb-3.5">
          <K>{T('k_phrases', '📜 FRASES DO CÓDIGO DO GUERREIRO')}</K>
          <p className="mb-2.5 text-[12px] text-muted">{T('phrases_intro', 'Sua frase do juramento (o "porquê") é fixa. Adicione frases extras para o botão 🔄 Trocar Frase.')}</p>
          <div className="mb-2.5 flex gap-2">
            <input className="field flex-1" maxLength={140} placeholder={T('ph_phrase', 'Nova frase de guerra...')} value={ph} onChange={(e) => setPh(e.target.value)} />
            <button className="btn-gold flex-none" onClick={() => { if (!ph.trim()) return; update((s) => { s.phrases.push(ph.trim()); }); setPh(''); toast(T('ok_phraseAdd', '✨ Frase adicionada ao Código.')); }}><Plus size={15} /></button>
          </div>
          {S.phrases.length ? S.phrases.map((p, i) => (
            <div key={i} className="mb-1.5 flex items-center justify-between gap-2 rounded-r border border-line bg-surface2 p-2.5 text-[12.5px]">
              <span>"{p}"</span>
              <button className="text-muted hover:text-danger" onClick={() => confirmBox(T('c_phTitle', 'EXCLUIR FRASE?'), '"' + p + '"' + T('c_phBody2', ' sairá do seu Código do Guerreiro.'), () => update((s) => { s.phrases.splice(i, 1); s.phraseIdx = 0; }))}><X size={13} /></button>
            </div>
          )) : <Empty>{T('phrases_empty', 'Nenhuma frase extra. O botão 🔄 usa seu Porquê + frases clássicas.')}</Empty>}
        </Card>

        {/* BACKUP */}
        <Card className="mb-3.5">
          <K>{T('k_backup', '💾 BACKUP DE GUERRA')}</K>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-ghost" onClick={exportBk}><Download size={14} /> {T('btn_export', 'EXPORTAR (.JSON)')}</button>
            <button className="btn-ghost" onClick={() => fileRef.current && fileRef.current.click()}><Upload size={14} /> {T('btn_import', 'IMPORTAR')}</button>
          </div>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) importBk(f); e.target.value = ''; }} />
          <p className="fnote" style={{ marginTop: 10 }}>{T('backup_note', 'Sem uma conta na nuvem, seus dados vivem apenas neste dispositivo. Exporte regularmente.')}</p>
        </Card>

        {/* ZONA DE PERIGO */}
        <Card className="border-danger/40">
          <K className="text-danger">{T('k_danger', '☠ ZONA DE PERIGO')}</K>
          <button className="btn-red btn-big" onClick={() => confirmBox(T('c_wipeTitle', 'APAGAR TUDO?'), T('c_wipeBody', 'Onboarding, streaks, diário, hábitos, tarefas e notas serão destruídos para sempre.'), () => { try { localStorage.removeItem(LSKEY); } catch (e) {} location.reload(); }, T('c_wipeOk', 'SIM, QUEIMAR TUDO E RECOMEÇAR'))}>
            <Skull size={15} /> {T('btn_wipe', 'APAGAR TUDO E RECOMEÇAR A GUERRA')}
          </button>
          <button className="btn-red btn-big mt-2 border border-danger/50 bg-transparent text-danger hover:bg-danger/10" onClick={deleteAccount}>
            <UserX size={15} /> {T('btn_delAcct', 'EXCLUIR MINHA CONTA E DADOS (LGPD)')}
          </button>
          <p className="fnote">{T('danger_note', 'A exclusão cancela a assinatura ativa e apaga permanentemente seu perfil e registros do servidor.')}</p>
        </Card>
      </section>
    </div>
  );
}
