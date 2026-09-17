/* i18n ETAPA 2 — versão SERVER (páginas server component).
   Next 14: cookies() e headers() são síncronos. */
import { cookies, headers } from 'next/headers';
import { LANG_COOKIE, pickLang } from './i18n';

export function serverLang() {
  const c = cookies().get(LANG_COOKIE);
  const al = headers().get('accept-language');
  return pickLang(c ? c.value : null, al);
}
