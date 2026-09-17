'use client';
import React, { useState } from 'react';
import { Shield, ShieldCheck, LogIn, UserPlus, KeyRound, CloudOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import * as cloud from '@/lib/supabase';
import { AF } from '@/lib/audio';
import { cx } from '@/lib/content-i18n';

/* i18n ETAPA 3a: tela de login/criar conta traduzida */
export default function AuthGate() {
  const { S, enterApp, toast } = useApp();
  const lang = (S && S.settings && S.settings.lang) || 'pt';
  const T = (id, fb) => cx(lang, 'auth', id) || fb;
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  /* erros do Supabase chegam em inglês → mapa pro idioma do guerreiro */
  const authErr = (m) => {
    const s = String((m && m.message) || m || '');
    if (/invalid login credentials/i.test(s)) return T('e_invalid', '⚠ Credenciais inválidas.');
    if (/email not confirmed/i.test(s)) return T('e_notconf', '⚠ Confirme seu e-mail antes de entrar.');
    if (/already registered/i.test(s)) return T('e_exists', '⚠ Este e-mail já está cadastrado.');
    if (/rate limit/i.test(s)) return T('e_rate', '⚠ Muitas tentativas. Aguarde um pouco.');
    return '⚠ ' + s;
  };

  const valid = () => {
    const em = email.trim(), pw = pass;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setMsg({ k: 'err', t: T('err_email', '⚠ Informe um e-mail válido.') }); return null; }
    if (pw.length < 6) { setMsg({ k: 'err', t: T('err_pass', '⚠ A senha deve ter no mínimo 6 caracteres.') }); return null; }
    if (mode === 'signup' && pw !== pass2) { setMsg({ k: 'err', t: T('err_match', '⚠ As senhas não conferem.') }); return null; }
    return { em, pw };
  };

  const submit = async () => {
    if (busy) return;
    const v = valid();
    if (!v) return;
    setBusy(true);
    setMsg({ k: '', t: T('wait', '⏳ Aguarde...') });
    try {
      if (cloud.CLOUD) {
        if (mode === 'login') {
          const data = await cloud.signIn(v.em, v.pw);
          await enterApp(data.session || data);
        } else {
          const data = await cloud.signUp(v.em, v.pw);
          if (data && data.session) await enterApp(data.session);
          else setMsg({ k: 'ok', t: T('ok_signup', '✅ Conta criada! Confira seu e-mail para confirmar o cadastro e depois entre.') });
        }
      } else {
        const users = cloud.localUsers();
        if (mode === 'signup') {
          if (users[v.em]) throw new Error(T('err_local_exists', 'Este e-mail já possui conta local. Use "Já tenho conta".'));
          users[v.em] = { pw: cloud.hash(v.pw), ts: Date.now() };
          cloud.saveLocalUsers(users);
          localStorage.setItem('fg_local_session', v.em);
          await enterApp({ local: true, email: v.em });
        } else {
          const u = users[v.em];
          if (!u || u.pw !== cloud.hash(v.pw)) throw new Error(T('err_local_bad', 'E-mail ou senha incorretos (modo local).'));
          localStorage.setItem('fg_local_session', v.em);
          await enterApp({ local: true, email: v.em });
        }
      }
    } catch (err) {
      setMsg({ k: 'err', t: authErr(err) });
    }
    setBusy(false);
  };

  const forgot = async () => {
    const em = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setMsg({ k: 'err', t: T('forgot_need_email', '✍️ Digite seu e-mail no campo acima para redefinir a senha.') }); return; }
    if (!cloud.CLOUD) { setMsg({ k: 'err', t: T('forgot_nocloud', '⚠ Modo local ativo: o envio do e-mail de redefinição exige configurar o Supabase.') }); return; }
    try {
      await cloud.resetPassword(em);
      setMsg({ k: 'ok', t: T('forgot_ok', '📬 E-mail de redefinição enviado. Confira sua caixa de entrada.') });
    } catch (err) { setMsg({ k: 'err', t: authErr(err) }); }
  };

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto p-5">
      <div className="w-full max-w-sm rounded-r2 border border-gold/25 bg-surface p-6 text-center shadow-glow rise">
        <ShieldCheck size={56} className="mx-auto mb-3 text-gold" strokeWidth={1.6} />
        <h2 className="font-display text-2xl tracking-wide">{S && S.settings.discreet ? T('title_disc', 'FG DIÁRIO — ACESSO') : T('title', 'FORJANDO GUERREIROS — ACESSO AO RECURSO')}</h2>
        <p className="mb-5 mt-1 text-[12px] text-muted">{mode === 'signup' ? T('sub_signup', 'Criar conta de guerreiro') : T('sub_login', 'Entrar com e-mail e senha')}</p>
        {!cloud.CLOUD && (
          <p className="mb-3 flex items-center justify-center gap-2 rounded-r border border-gold/30 bg-gold/10 p-2 text-[11px] text-gold2">
            <CloudOff size={14} /> {T('nocloud', 'Nuvem não configurada. Modo local ativo.')}
          </p>
        )}
        <label className="mb-3 block text-left"><span className="lbl">{T('lbl_email', 'E-mail')}</span>
          <input type="email" className="field" autoComplete="email" placeholder={T('ph_email', 'guerreiro@exemplo.com')} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </label>
        <label className="mb-3 block text-left"><span className="lbl">{T('lbl_pass', 'Senha')}</span>
          <input type="password" className="field" autoComplete="current-password" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </label>
        {mode === 'signup' && (
          <label className="mb-3 block text-left"><span className="lbl">{T('lbl_pass2', 'Confirmar senha')}</span>
            <input type="password" className="field" autoComplete="new-password" placeholder="••••••••" value={pass2} onChange={(e) => setPass2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </label>
        )}
        <button className="btn-gold btn-big" disabled={busy} onClick={() => { AF.click(); submit(); }}>
          {mode === 'signup' ? <UserPlus size={17} /> : <LogIn size={17} />}
          {mode === 'signup' ? T('btn_signup', 'CRIAR CONTA') : T('btn_login', 'ENTRAR NO QG')}
        </button>
        <div className="mt-3 flex justify-center gap-4 text-[12px] font-bold">
          <button className="text-gold hover:underline" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}>
            {mode === 'login' ? T('link_signup', 'Criar conta') : T('link_login', 'Já tenho conta — entrar')}
          </button>
          <button className="text-muted hover:underline" onClick={forgot}><KeyRound size={12} className="mr-1 inline" />{T('link_forgot', 'Esqueci minha senha')}</button>
        </div>
        {msg && <p className={`mt-3 text-[12.5px] font-semibold ${msg.k === 'err' ? 'text-danger' : msg.k === 'ok' ? 'text-ok' : 'text-muted'}`}>{msg.t}</p>}
        <p className="fnote"><Shield size={11} className="mr-1 inline" /> {T('foot', 'Seus dados são sincronizados com criptografia e visíveis apenas para você.')}</p>
      </div>
    </div>
  );
}
