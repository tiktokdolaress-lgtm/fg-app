import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Flame, Siren, BookOpen, ChartNoAxesColumn, RefreshCw, Sword, HeartCrack, Droplet, Castle, CheckCircle2, Lock } from 'lucide-react';
import PriceTag from '@/components/landing/PriceTag';
import Faq from '@/components/landing/Faq';
import LangPick from '@/components/LangPick';
import { cx } from '@/lib/content-i18n';
import { serverLang } from '@/lib/i18n-server';

/* i18n ETAPA 2: landing traduzida via cookie fg_lang / Accept-Language.
   PT fica inline como fallback (padrão do projeto). */

export async function generateMetadata() {
  const lang = serverLang();
  const L = (id, fb) => cx(lang, 'land', id) || fb;
  return {
    title: L('meta_title', 'Forjando Guerreiros — Vença o vício, reconquiste sua energia'),
    description: L('meta_desc', 'Plataforma de retenção, disciplina e forja de hábitos: check-in diário dos 3 pilares, protocolo S.O.S de 5 minutos, relatórios de combate e sincronização em nuvem. 7 dias grátis.'),
    openGraph: {
      title: L('og_title', 'Forjando Guerreiros ⚔ Retenção & Disciplina'),
      description: L('og_desc', 'O QG de quem declarou guerra ao vício. 7 dias grátis, cancele quando quiser.'),
      type: 'website',
    },
  };
}

export default function Landing() {
  const lang = serverLang();
  const L = (id, fb) => cx(lang, 'land', id) || fb;

  const PILARES = [
    [HeartCrack, L('pil1t', 'SEM PORNOGRAFIA'), L('pil1d', 'Feche a porta de entrada do vício: menos estímulo, mais sensibilidade e presença no mundo real.')],
    [Droplet, L('pil2t', 'SEM MASTURBAÇÃO COMPULSIVA'), L('pil2d', 'Quebre o ciclo de dopamina barata que treina o cérebro a fugir do desconforto.')],
    [Flame, L('pil3t', 'RETENÇÃO SEMINAL'), L('pil3d', 'Preserve e transmute sua energia vital: o contador principal da sua guerra.')],
  ];

  const RECURSOS = [
    [Castle, L('rec1t', 'QG do Guerreiro'), L('rec1d', 'Contador de dias, pureza, patamares (Recruta → Lenda) e linha do tempo de vitórias × quedas.')],
    [Sword, L('rec2t', 'A Forja'), L('rec2d', '20 hábitos de elite + personalizados, com slots liberados por patamar e histórico de 7 dias.')],
    [Siren, L('rec3t', 'Protocolo S.O.S'), L('rec3d', '5 minutos guiados contra o impulso: choque térmico, respiração 4×4 com som e exaustão física.')],
    [BookOpen, L('rec4t', 'Diário de Bordo'), L('rec4d', 'Humor, vitórias, desafios, desabafos de queda e caderno de notas com busca e tags.')],
    [ChartNoAxesColumn, L('rec5t', 'Relatórios de Combate'), L('rec5d', 'Mapa de calor mensal, consistência da Forja, KPIs e histórico de intervenções vencidas.')],
    [RefreshCw, L('rec6t', 'Sincronização em nuvem'), L('rec6d', 'Marque no celular, veja no PC. Login protegido e dados privados por usuário (RLS).')],
  ];

  const PASSOS = [
    ['1', L('how1t', 'CRIE SUA CONTA'), L('how1d', 'Login protegido por e-mail e senha. Onboarding de guerra calibra seus contadores e seu porquê.')],
    ['2', L('how2t', 'TRAVE A GUERRA DIÁRIA'), L('how2d', 'Marque os pilares, forje hábitos e, se o impulso apertar, acione o S.O.S de 5 minutos.')],
    ['3', L('how3t', 'EVOLUA DE PATAMAR'), L('how3d', 'De Recruta a Lenda: streaks, pureza, relatórios e recompensas medem sua transformação.')],
  ];

  /* ⚠️ PLACEHOLDERS: substitua por depoimentos REAIS com autorização por escrito antes de publicar.
     Depoimento inventado em publicidade é prática abusiva (CDC art. 37) e pode gerar condenação. */
  const VOZES = [
    [L('voz1w', 'G. · 34 anos · 96 dias'), L('voz1t', 'O S.O.S de 5 minutos me salvou às 2h da manhã. Três vezes na primeira semana. Hoje é automático: aperta, eu ajo.')],
    [L('voz2w', 'R. · 27 anos · 210 dias'), L('voz2t', 'Ver o mapa de calor e a pureza subindo virou meu espelho. Pela primeira vez eu não me sinto refém da minha própria mente.')],
    [L('voz3w', 'M. · 41 anos · 45 dias'), L('voz3t', 'Caí duas vezes. O app não me julgou: registrou, mostrou o gatilho e me levantou. É disso que homem precisa.')],
  ];

  const BENEFICIOS = [
    L('pr_f1', 'Todos os módulos desbloqueados'),
    L('pr_f2', 'Sincronização celular + PC em tempo real'),
    L('pr_f3', 'Protocolo S.O.S ilimitado'),
    L('pr_f4', 'Relatórios e histórico completos'),
    L('pr_f5', 'Cancelamento em 1 clique, sem multa'),
  ];

  return (
    <main className="min-h-dvh bg-bg text-ink">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-gold/15 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5">
          <ShieldCheck size={26} className="text-gold" strokeWidth={1.8} />
          <span className="font-display text-xl tracking-[.12em]">FORJANDO GUERREIROS</span>
          <div className="ml-auto flex items-center gap-3">
            <LangPick lang={lang} />
            <Link href="/app" className="btn-ghost px-4 py-2 text-[12px]">🛡️ {L('nav_enter', 'ENTRAR')}</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-20 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,70,.10),transparent_65%)]" />
        <p className="k2 mb-4 tracking-[.3em] text-gold2">{L('kick', 'RETENÇÃO · DISCIPLINA · TRANSMUTAÇÃO')}</p>
        <h1 className="mx-auto max-w-4xl font-display text-[clamp(44px,7vw,84px)] leading-[.95] tracking-wide">
          {L('h1a', 'VENÇA O VÍCIO.')}<br /><span className="bg-gradient-to-r from-[#FFE79A] via-gold to-gold2 bg-clip-text text-transparent">{L('h1b', 'RECONQUISTE SUA ENERGIA.')}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
          {L('hero_sub', 'O QG digital de quem declarou guerra à pornografia e ao desperdício de energia vital: check-in diário dos 3 pilares, hábitos de elite, protocolo de emergência contra o impulso e relatórios de combate — tudo sincronizado entre celular e PC.')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="btn-gold px-8 py-4 text-[15px]">{L('cta_start', '⚔️ COMEÇAR MEUS 7 DIAS GRÁTIS')}</Link>
          <Link href="/app" className="btn-dark px-6 py-4 text-[14px]">{L('cta_back', 'Já sou guerreiro →')}</Link>
        </div>
        <p className="fnote mt-4">{L('note_after', 'Depois, apenas')} <PriceTag lang={lang} /> · {L('note_cancel', 'Cancele quando quiser')} · {L('note_data', 'Seus dados são só seus')}</p>
      </section>

      {/* PILARES */}
      <section className="border-y border-line bg-surface2/40 px-5 py-16">
        <h2 className="mb-10 text-center font-display text-3xl tracking-wide">{L('pil_title', 'OS 3 PILARES DA TRÍADE')}</h2>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {PILARES.map(([Ic, t, d], i) => (
            <div key={i} className="card rise border-gold/25 text-center">
              <Ic size={30} className="mx-auto mb-3 text-gold" strokeWidth={1.7} />
              <b className="block font-display text-lg tracking-[.1em] text-gold">{t}</b>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECURSOS */}
      <section className="px-5 py-16">
        <h2 className="mb-3 text-center font-display text-3xl tracking-wide">{L('rec_title', 'UM ARSENAL COMPLETO DE DISCIPLINA')}</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-[13px] text-muted">{L('rec_sub', 'Nada de app de hábito genérico: cada módulo foi forjado para esta guerra específica.')}</p>
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RECURSOS.map(([Ic, t, d], i) => (
            <div key={i} className="card rise">
              <Ic size={22} className="mb-2.5 text-gold" strokeWidth={1.8} />
              <b className="block text-[14px]">{t}</b>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-line bg-surface2/40 px-5 py-16">
        <h2 className="mb-10 text-center font-display text-3xl tracking-wide">{L('how_title', 'COMO FUNCIONA')}</h2>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          {PASSOS.map(([n, t, d]) => (
            <div key={n} className="text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-gold/10 font-display text-xl text-gold">{n}</div>
              <b className="block font-display text-lg tracking-[.08em]">{t}</b>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="px-5 py-16">
        <h2 className="mb-10 text-center font-display text-3xl tracking-wide">{L('voz_title', 'VOZES DA FORJA')}</h2>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {VOZES.map(([who, txt], i) => (
            <figure key={i} className="card rise border-gold/20">
              <blockquote className="text-[13px] italic leading-relaxed text-[#f3ead2]">"{txt}"</blockquote>
              <figcaption className="k2 mt-3 text-gold2">{who}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PREÇO */}
      <section className="border-y border-line bg-surface2/40 px-5 py-16 text-center">
        <h2 className="font-display text-3xl tracking-wide">{L('pr_title', 'UM PREÇO DE CAFÉ. UMA GUERRA INTEIRA.')}</h2>
        <div className="mx-auto mt-8 max-w-md rounded-r2 border border-gold/40 bg-surface p-7 shadow-glow">
          <p className="k2 mb-1">{L('pr_k', 'ACESSO COMPLETO')}</p>
          <p className="font-display text-5xl text-gold">{L('pr_days', '7 dias')}</p>
          <p className="mb-5 text-[13px] text-muted">{L('pr_free', 'grátis · depois')} <PriceTag lang={lang} /></p>
          <ul className="mb-6 space-y-2 text-left text-[12.5px] font-semibold">
            {BENEFICIOS.map((x) => (
              <li key={x} className="flex items-center gap-2"><CheckCircle2 size={15} className="flex-none text-ok" /> {x}</li>
            ))}
          </ul>
          <Link href="/app" className="btn-gold btn-big">{L('pr_cta', '⚔️ INICIAR MEU TESTE GRÁTIS')}</Link>
          <p className="fnote"><Lock size={11} className="mr-1 inline" /> {L('pr_pay', 'Pagamento processado pela Stripe. O app nunca vê seu cartão.')}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-16">
        <h2 className="mb-8 text-center font-display text-3xl tracking-wide">{L('faq_title', 'PERGUNTAS DE GUERRA')}</h2>
        <Faq lang={lang} />
      </section>

      {/* CTA FINAL */}
      <section className="px-5 pb-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-[clamp(32px,5vw,56px)] leading-tight">{L('cta1', 'O IMPULSO É PASSAGEIRO.')}<br /><span className="text-gold">{L('cta2', 'A HONRA É PERMANENTE.')}</span></h2>
        <Link href="/app" className="btn-gold mt-8 px-10 py-4 text-[15px]">{L('cta_btn', '⚔️ ENTRAR PARA A FORJA')}</Link>
      </section>

      {/* APOIO EM CRISE */}
      <section className="border-t border-line bg-ok/5 px-5 py-10 text-center">
        <h2 className="mb-3 font-display text-2xl tracking-wide text-ok">{L('cr_title', '💚 ISTO NÃO SUBSTITUI TERAPIA')}</h2>
        <p className="mx-auto max-w-2xl text-[13px] leading-relaxed text-muted">
          {lang === 'pt' ? (
            <>
              O Forjando Guerreiros é uma ferramenta de autodisciplina e registro pessoal. Em sofrimento intenso,
              ideação de autolesão ou dependência que coloca sua vida em risco, procure um profissional de saúde —
              e conte com a rede de apoio: <b className="text-ok">CVV 188</b> (24h, gratuito, sigiloso) · chat em{' '}
              <b className="text-ok">cvv.org.br</b> · emergências médicas: <b className="text-ok">SAMU 192</b>.
            </>
          ) : (
            L('cr_txt', '')
          )}
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line px-5 py-8 text-center">
        <p className="text-[12px] font-bold tracking-[.14em] text-gold2">{L('ft_tag', 'FORJANDO GUERREIROS ⚔ RETENÇÃO & DISCIPLINA')}</p>
        <p className="mt-2 text-[11.5px] text-muted">
          <Link className="underline hover:text-gold" href="/termos">{L('ft_terms', 'Termos de Uso')}</Link> ·{' '}
          <Link className="underline hover:text-gold" href="/privacidade">{L('ft_priv', 'Política de Privacidade')}</Link> ·{' '}
          <Link className="underline hover:text-gold" href="/app">{L('ft_enter', 'Entrar')}</Link>
        </p>
        <p className="fnote">{L('ft_note', 'Ferramenta de autodisciplina e registro pessoal. Não substitui acompanhamento médico ou psicológico profissional.')}</p>
      </footer>
    </main>
  );
}
