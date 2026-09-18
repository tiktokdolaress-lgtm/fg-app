'use client';
import React, { useState } from 'react';
import { Shield, ShieldCheck, LogIn, UserPlus, KeyRound, CloudOff } from 'lucide-react';
import { useApp } from '@/lib/store';
import * as cloud from '@/lib/supabase';
import { AF } from '@/lib/audio';
import { cx } from '@/lib/content-i18n';

/* Ícone oficial do Google em SVG */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block mr-2">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

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

  const handleGoogleLogin = async () => {
    if (busy) return;
    setBusy(true);
    setMsg({ k: '', t: T('wait_google', '⏳ Conectando com o Google...') });
    try {
      if (cloud.signInWithGoogle) {
        await cloud.signInWithGoogle();
      } else if (cloud.supabase) {
        const { error } = await cloud.supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
        });
        if (error) throw error;
      } else {
        throw new Error(T('nocloud_google', 'Login com Google exige a nuvem configurada.'));
      }
    } catch (err) {
      setMsg({ k: 'err', t: authErr(err) });
      setBusy(false);
    }
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
        <p className="mb-4 mt-1 text-[12px] text-muted">{mode === 'signup' ? T('sub_signup', 'Criar conta de guerreiro') : T('sub_login', 'Entrar com sua conta')}</p>
        
        {!cloud.CLOUD && (
          <p className="mb-3 flex items-center justify-center gap-2 rounded-r border border-gold/30 bg-gold/10 p-2 text-[11px] text-gold2">
            <CloudOff size={14} /> {T('nocloud', 'Nuvem não configurada. Modo local ativo.')}
          </p>
        )}

        {/* Botão Oficial do Google */}
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-center rounded-r border border-line bg-surface2 py-3 px-4 text-[13px] font-bold text-ink hover:border-gold/50 hover:bg-gold/5 transition-all shadow-sm"
          disabled={busy}
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
          <span>{mode === 'signup' ? T('btn_google_signup', 'Cadastrar com Google') : T('btn_google_login', 'Continuar com Google')}</span>
        </button>

        {/* Divisor "OU" */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-full border-t border-line"></div>
          <span className="absolute bg-surface px-3 text-[10px] font-extrabold uppercase tracking-widest text-muted">{T('or_divider', 'OU')}</span>
        </div>

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
        <button className="btn-gold btn-big mt-1" disabled={busy} onClick={() => { AF.click(); submit(); }}>
          {mode === 'signup' ? <UserPlus size={17} /> : <LogIn size={17} />}
          {mode === 'signup' ? T('btn_signup', 'CRIAR CONTA COM E-MAIL') : T('btn_login', 'ENTRAR NO QG')}
        </button>
        <div className="mt-3 flex justify-center gap-4 text-[12px] font-bold">
          <button className="text-gold hover:underline" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}>
            {mode === 'login' ? T('link_signup', 'Criar conta') : T('link_login', 'Já tenho conta — entrar')}
          </button>
          <button className="text-muted hover:underline" onClick={forgot}><KeyRound size={12} className="mr-1 inline" />{T('link_forgot', 'Esqueci minha senha')}</button>
        </div>
        {msg && <p className={`mt-3 text-[12.5px] font-semibold ${msg.k === 'err' ? 'text-danger' : msg.k === 'ok' ? 'text-ok' : 'text-muted'}`}>{msg.t}</p>}
        <p className="fnote mt-4"><Shield size={11} className="mr-1 inline" /> {T('foot', 'Seus dados são sincronizados com criptografia e visíveis apenas para você.')}</p>
      </div>
    </div>
  );
}
