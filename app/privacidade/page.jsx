import React from 'react';
import Link from 'next/link';
import { cx } from '@/lib/content-i18n';
import { serverLang } from '@/lib/i18n-server';

/* i18n ETAPA 4: privacidade traduzida via cookie fg_lang (PT inline como fallback). */
export async function generateMetadata() {
  const lang = serverLang();
  return { title: cx(lang, 'priv', 'meta') || 'Política de Privacidade — Forjando Guerreiros' };
}

const H = ({ children }) => <h2 className="mb-2 mt-8 font-display text-xl tracking-wide text-gold">{children}</h2>;
const P = ({ children }) => <p className="mb-3 text-[13px] leading-relaxed text-muted">{children}</p>;

export default function Privacidade() {
  const lang = serverLang();
  const T = (id, fb) => cx(lang, 'priv', id) || fb;
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/" className="text-[12px] text-gold underline">{T('back', '← Voltar ao início')}</Link>
      <h1 className="mb-2 mt-4 font-display text-4xl tracking-wide">{T('title', 'POLÍTICA DE PRIVACIDADE')}</h1>
      <P>{T('upd', 'Última atualização: setembro de 2026. Esta política explica quais dados tratamos, por quê, e os seus direitos conforme a LGPD (Lei nº 13.709/2018).')}</P>
      <H>{T('h1', '1. Dados que coletamos')}</H>
      <P>{T('p1', '(a) Cadastrais: e-mail e senha (hasheada pelo provedor de autenticação). (b) De uso, fornecidos por você: check-ins dos pilares, hábitos, tarefas, diário, notas, registros do protocolo S.O.S e configurações. (c) Técnicos: identificadores de sessão e, se você ativar notificações, um token de push do navegador. (d) De cobrança: gerenciados exclusivamente pela Stripe (o aplicativo nunca recebe nem armazena números de cartão).')}</P>
      <H>{T('h2', '2. Finalidades e base legal')}</H>
      <P>{T('p2', 'Execução do contrato (prestar a plataforma), exercício regular de direitos e, quando aplicável, seu consentimento (ex.: notificações push, que podem ser desativadas a qualquer momento). Não usamos seus dados para publicidade de terceiros nem os vendemos.')}</P>
      <H>{T('h3', '3. Onde os dados ficam')}</H>
      <P>{T('p3', 'Banco de dados Supabase hospedado na região de São Paulo (Brasil), com criptografia em trânsito e em repouso, e controle de acesso por linha (RLS): cada usuário enxerga apenas os próprios dados. Pagamentos: infraestrutura Stripe (PCI-DSS nível 1).')}</P>
      <H>{T('h4', '4. Compartilhamento')}</H>
      <P>{T('p4', 'Apenas com operadores essenciais: Supabase (banco/auth), Vercel (hospedagem/funções), Stripe (pagamento) e provedor de e-mail transacional, se habilitado. Nenhum outro compartilhamento, exceto obrigação legal.')}</P>
      <H>{T('h5', '5. Retenção e exclusão')}</H>
      <P>{T('p5', 'Seus registros permanecem enquanto a conta existir. Você pode (a) exportar tudo em JSON pelas Configurações e (b) excluir definitivamente conta e dados pelo botão "Excluir minha conta e dados", que cancela a assinatura e apaga perfil, registros e tokens de push. Backups de segurança são rotacionados em até 30 dias.')}</P>
      <H>{T('h6', '6. Notificações')}</H>
      <P>{T('p6', 'Somente com sua permissão explícita do navegador. Você desativa pelas Configurações ou pelas opções do próprio sistema operacional/navegador.')}</P>
      <H>{T('h7', '7. Seus direitos (LGPD art. 18)')}</H>
      <P>{T('p7', 'Confirmação de tratamento, acesso, correção, anonimização, portabilidade (exportação JSON), eliminação, informação sobre compartilhamento e revogação de consentimento — exercidos pelas Configurações ou pelo canal de contato abaixo.')}</P>
      <H>{T('h8', '8. Segurança')}</H>
      <P>{T('p8', 'Senhas com hash no provedor de autenticação; chaves secretas apenas no servidor; comunicações HTTPS; políticas de acesso por linha no banco. Nenhum sistema é 100% imune: em incidente relevante, avisaremos você e a autoridade nacional (ANPD).')}</P>
      <H>{T('h9', '9. Menores de idade')}</H>
      <P>{T('p9', 'A plataforma destina-se a maiores de 18 anos. Não coletamos deliberadamente dados de menores; se identificados, serão eliminados.')}</P>
      <H>{T('h10', '10. Contato do encarregado (DPO)')}</H>
      <P>{T('p10', 'Substitua este texto pelo e-mail oficial de privacidade (ex.: privacidade@seudominio.com). Responderemos em até 15 dias, conforme LGPD.')}</P>
    </main>
  );
}
