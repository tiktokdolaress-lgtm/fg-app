import React from 'react';
import Link from 'next/link';
import { cx } from '@/lib/content-i18n';
import { serverLang } from '@/lib/i18n-server';

/* i18n ETAPA 4: termos traduzidos via cookie fg_lang (PT inline como fallback). */
export async function generateMetadata() {
  const lang = serverLang();
  return { title: cx(lang, 'termos', 'meta') || 'Termos de Uso — Forjando Guerreiros' };
}

const H = ({ children }) => <h2 className="mb-2 mt-8 font-display text-xl tracking-wide text-gold">{children}</h2>;
const P = ({ children }) => <p className="mb-3 text-[13px] leading-relaxed text-muted">{children}</p>;

export default function Termos() {
  const lang = serverLang();
  const T = (id, fb) => cx(lang, 'termos', id) || fb;
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/" className="text-[12px] text-gold underline">{T('back', '← Voltar ao início')}</Link>
      <h1 className="mb-2 mt-4 font-display text-4xl tracking-wide">{T('title', 'TERMOS DE USO')}</h1>
      <P>{T('upd', 'Última atualização: setembro de 2026. Ao criar uma conta e utilizar a plataforma Forjando Guerreiros, você concorda com estes termos.')}</P>
      <H>{T('h1', '1. O que é a plataforma')}</H>
      <P>{T('p1', 'Ferramenta digital de autodisciplina, registro pessoal e formação de hábitos (check-ins, hábitos, diário, relatórios e protocolo de emergência S.O.S). Não é serviço de saúde, não realiza diagnóstico e não substitui terapia, aconselhamento médico ou psicológico.')}</P>
      <H>{T('h2', '2. Conta e assinatura')}</H>
      <P>{T('p2', 'O acesso exige conta individual com e-mail e senha. Novos assinantes passam por período de teste de 7 dias, após o qual é cobrada a mensalidade vigente exibida no checkout (em sua moeda local). O pagamento é processado pela Stripe; o cancelamento pode ser feito a qualquer momento e o acesso permanece até o fim do período já pago.')}</P>
      <H>{T('h3', '3. Conduta do usuário')}</H>
      <P>{T('p3', 'Você é responsável pela veracidade dos registros que insere e por manter a confidencialidade da sua senha. É proibido revender acesso, compartilhar a conta com terceiros, usar automações para burlar limites ou tentar acessar dados de outros usuários.')}</P>
      <H>{T('h4', '4. Conteúdo e propriedade intelectual')}</H>
      <P>{T('p4', 'Textos, nomes, protocolos, visual e códigos da plataforma são de propriedade do Forjando Guerreiros. Seus registros pessoais (diário, check-ins, notas) são de sua propriedade e podem ser exportados ou excluídos por você a qualquer momento.')}</P>
      <H>{T('h5', '5. Disponibilidade')}</H>
      <P>{T('p5', 'Empregamos esforços para manter a plataforma disponível, mas não garantimos funcionamento ininterrupto. Manutenções e falhas de provedores (hospedagem, banco de dados, pagamentos) podem causar indisponibilidade temporária.')}</P>
      <H>{T('h6', '6. Limitação de responsabilidade')}</H>
      <P>{T('p6', 'A plataforma não se responsabiliza por decisões pessoais tomadas com base nos registros, nem por recaídas, danos emocionais ou indiretos. Em caso de crise de saúde mental, procure serviços de emergência ou um profissional qualificado.')}</P>
      <H>{T('h7', '7. Encerramento')}</H>
      <P>{T('p7', 'Você pode excluir sua conta e todos os seus dados pelas Configurações ("Excluir minha conta e dados") — o que cancela a assinatura ativa e apaga perfil, registros e inscrições de notificação. Podemos suspender contas que violem estes termos.')}</P>
      <H>{T('h8', '8. Alterações destes termos')}</H>
      <P>{T('p8', 'Alterações relevantes serão comunicadas por aviso na plataforma ou por e-mail com antecedência mínima de 15 dias. O uso continuado após o prazo implica concordância.')}</P>
      <H>{T('h9', '9. Contato')}</H>
      <P>{T('p9', 'Dúvidas sobre estes termos: substitua este texto pelo seu e-mail oficial de suporte (ex.: suporte@seudominio.com).')}</P>
    </main>
  );
}
