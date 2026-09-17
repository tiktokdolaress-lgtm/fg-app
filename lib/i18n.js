/* i18n ETAPA 2 — idioma do visitante via cookie fg_lang.
   Usado pela landing (server) e pelo seletor LangPick (client).
   O idioma DENTRO do app continua sendo settings.lang (store) —
   ao entrar no /app, o cookie semeia o settings.lang de contas novas. */

export const LANGS = ['pt', 'en', 'es'];
export const LANG_COOKIE = 'fg_lang';

/* Prioridade: cookie > Accept-Language do navegador > pt */
export function pickLang(cookieLang, acceptLanguage) {
  if (LANGS.includes(cookieLang)) return cookieLang;
  const al = (acceptLanguage || '').toLowerCase();
  if (al.includes('pt')) return 'pt';
  if (al.includes('es')) return 'es';
  if (al.includes('en')) return 'en';
  return 'pt';
}

/* Client: grava o cookie por 1 ano (router.refresh() aplica na hora) */
export function setLangCookie(l) {
  if (typeof document === 'undefined') return;
  if (!LANGS.includes(l)) return;
  document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

/* Client: lê o cookie (usado pelo store pra semear contas novas) */
export function readLangCookie() {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(^|; )${LANG_COOKIE}=([a-z]{2})`));
  return m && LANGS.includes(m[2]) ? m[2] : null;
}
