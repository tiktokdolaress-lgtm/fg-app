'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = [
  ['É anônimo? Alguém vai ver o que eu marco?', 'Sim, é anônimo. Seus registros são privados: ficam criptografados na sua conta e protegidos por regras de segurança no banco (RLS) — nem outro usuário, nem visitantes conseguem ver. Apenas você, no seu login.'],
  ['Preciso colocar cartão para testar?', 'O teste de 7 dias pede um cartão para evitar abusos (1 conta = 1 teste), mas a cobrança de hoje é R$ 0,00. Se você cancelar antes do 7º dia, não paga nada.'],
  ['Como funciona o cancelamento?', 'Um clique: pelo próprio e-mail da Stripe ou pelas Configurações do app ("Excluir minha conta"). Seu acesso continua até o fim do período já pago/testado. Sem multa, sem ligação, sem culpa.'],
  ['Isso substitui terapia ou tratamento?', 'Não. O Forjando Guerreiros é uma ferramenta de disciplina, hábitos e registro pessoal. Se você enfrenta dependência severa, ansiedade ou depressão, procure um profissional de saúde. O app complementa — nunca substitui.'],
  ['Funciona no celular e no computador?', 'Sim. É um PWA: funciona no navegador de qualquer dispositivo e pode ser instalado na tela inicial do celular. Com o login, seus dados sincronizam em tempo real entre todos os aparelhos.'],
  ['Meus dados são vendidos ou compartilhados?', 'Nunca. Os dados de uso ficam no banco (região São Paulo, Brasil) e o pagamento é processado pela Stripe — o app nunca vê nem guarda os dados do seu cartão. Você pode excluir tudo a qualquer momento pelas Configurações.'],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-2.5 text-left">
      {FAQ.map(([q, a], i) => (
        <div key={i} className="rounded-r2 border border-line bg-surface">
          <button className="flex w-full items-center gap-3 p-4 text-left text-[14px] font-extrabold" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="flex-1">{q}</span>
            <ChevronDown size={16} className={`flex-none text-gold transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <p className="border-t border-line p-4 text-[13px] leading-relaxed text-muted">{a}</p>}
        </div>
      ))}
    </div>
  );
}
