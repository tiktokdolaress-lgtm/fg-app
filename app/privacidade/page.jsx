import React from 'react';
import Link from 'next/link';

export const metadata = { title: 'Política de Privacidade — Forjando Guerreiros' };

const H = ({ children }) => <h2 className="mb-2 mt-8 font-display text-xl tracking-wide text-gold">{children}</h2>;
const P = ({ children }) => <p className="mb-3 text-[13px] leading-relaxed text-muted">{children}</p>;

export default function Privacidade() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/" className="text-[12px] text-gold underline">← Voltar ao início</Link>
      <h1 className="mb-2 mt-4 font-display text-4xl tracking-wide">POLÍTICA DE PRIVACIDADE</h1>
      <P>Última atualização: setembro de 2026. Esta política explica quais dados tratamos, por quê, e os seus direitos conforme a LGPD (Lei nº 13.709/2018).</P>
      <H>1. Dados que coletamos</H>
      <P>(a) Cadastrais: e-mail e senha (hasheada pelo provedor de autenticação). (b) De uso, fornecidos por você: check-ins dos pilares, hábitos, tarefas, diário, notas, registros do protocolo S.O.S e configurações. (c) Técnicos: identificadores de sessão e, se você ativar notificações, um token de push do navegador. (d) De cobrança: gerenciados exclusivamente pela Stripe (o aplicativo nunca recebe nem armazena números de cartão).</P>
      <H>2. Finalidades e base legal</H>
      <P>Execução do contrato (prestar a plataforma), exercício regular de direitos e, quando aplicável, seu consentimento (ex.: notificações push, que podem ser desativadas a qualquer momento). Não usamos seus dados para publicidade de terceiros nem os vendemos.</P>
      <H>3. Onde os dados ficam</H>
      <P>Banco de dados Supabase hospedado na região de São Paulo (Brasil), com criptografia em trânsito e em repouso, e controle de acesso por linha (RLS): cada usuário enxerga apenas os próprios dados. Pagamentos: infraestrutura Stripe (PCI-DSS nível 1).</P>
      <H>4. Compartilhamento</H>
      <P>Apenas com operadores essenciais: Supabase (banco/auth), Vercel (hospedagem/funções), Stripe (pagamento) e provedor de e-mail transacional, se habilitado. Nenhum outro compartilhamento, exceto obrigação legal.</P>
      <H>5. Retenção e exclusão</H>
      <P>Seus registros permanecem enquanto a conta existir. Você pode (a) exportar tudo em JSON pelas Configurações e (b) excluir definitivamente conta e dados pelo botão "Excluir minha conta e dados", que cancela a assinatura e apaga perfil, registros e tokens de push. Backups de segurança são rotacionados em até 30 dias.</P>
      <H>6. Notificações</H>
      <P>Somente com sua permissão explícita do navegador. Você desativa pelas Configurações ou pelas opções do próprio sistema operacional/navegador.</P>
      <H>7. Seus direitos (LGPD art. 18)</H>
      <P>Confirmação de tratamento, acesso, correção, anonimização, portabilidade (exportação JSON), eliminação, informação sobre compartilhamento e revogação de consentimento — exercidos pelas Configurações ou pelo canal de contato abaixo.</P>
      <H>8. Segurança</H>
      <P>Senhas com hash no provedor de autenticação; chaves secretas apenas no servidor; comunicações HTTPS; políticas de acesso por linha no banco. Nenhum sistema é 100% imune: em incidente relevante, avisaremos você e a autoridade nacional (ANPD).</P>
      <H>9. Menores de idade</H>
      <P>A plataforma destina-se a maiores de 18 anos. Não coletamos deliberadamente dados de menores; se identificados, serão eliminados.</P>
      <H>10. Contato do encarregado (DPO)</H>
      <P>Substitua este texto pelo e-mail oficial de privacidade (ex.: privacidade@seudominio.com). Responderemos em até 15 dias, conforme LGPD.</P>
    </main>
  );
}
