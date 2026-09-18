import './globals.css';
import { Bebas_Neue, Manrope, Share_Tech_Mono } from 'next/font/google';
import { I18N } from '@/lib/data';
import { serverLang } from '@/lib/i18n-server';

const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--fd' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--fb' });
const mono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--fm' });

/* i18n ETAPA 4: metadata + <html lang> seguem o idioma do visitante (cookie fg_lang) */
export function generateMetadata() {
  const lang = serverLang();
  return {
    title: (I18N[lang] && I18N[lang].title_full) || I18N.pt.title_full,
    description: lang === 'en'
      ? 'HQ for retention, discipline and habit forging.'
      : lang === 'es'
        ? 'QG de retención, disciplina y forja de hábitos.'
        : 'QG de retenção, disciplina e forja de hábitos.',
    manifest: '/manifest.webmanifest',
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D0D0E',
};

const HTML_LANG = { pt: 'pt-BR', en: 'en', es: 'es' };

export default function RootLayout({ children }) {
  const lang = serverLang();
  return (
    <html lang={HTML_LANG[lang] || 'pt-BR'} data-theme="dark" className={`${bebas.variable} ${manrope.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
