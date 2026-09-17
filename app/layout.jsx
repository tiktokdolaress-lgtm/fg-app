import './globals.css';
import { Bebas_Neue, Manrope, Share_Tech_Mono } from 'next/font/google';

const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--fd' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--fb' });
const mono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--fm' });

export const metadata = {
  title: 'FORJANDO GUERREIROS ⚔ Retenção & Disciplina',
  description: 'QG de retenção, disciplina e forja de hábitos.',
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0D0D0E',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-theme="dark" className={`${bebas.variable} ${manrope.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
