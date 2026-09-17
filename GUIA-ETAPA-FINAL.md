# 🏁 ETAPA FINAL — Assinatura Stripe (7 dias grátis) + Deploy definitivo

Este zip (**forjando-next.zip**) já contém TUDO: o app completo em Next.js + a camada de
assinatura (checkout com trial de 7 dias, moeda automática BRL/USD anti-burla, webhook e
portão de acesso). **Não use mais a pasta antiga `forjando-guerreiros-oficial` que ficou
misturada com `src/` — ela é a causa do loop de erros.**

---

## 1️⃣ Por que o build ficava quebrando no seu PC (e como não repetir)

1. **A pasta estava em `C:\Windows\System32`** → o Windows bloqueia a gravação de
   `node_modules`; o `npm install` "fingia" instalar e o build nunca achava o Tailwind/Stripe.
   ✅ Regra de ouro: projetos sempre em `C:\Users\Michel\Desktop\` ou `Documentos\`.
2. **Estrutura misturada**: o `create-next-app` criou `src/app/` e este projeto usa `app/` na
   raiz. Com as duas juntas, o Next se perde. ✅ Este zip é autocontido: **não existe pasta
   `src/` aqui — não crie**.
3. **Faltavam dependências no `package.json` certo**. ✅ Aqui o `package.json` já inclui
   `next`, `tailwindcss@3`, `lucide-react`, `@supabase/supabase-js` e `stripe`.

## 2️⃣ Rodar no seu PC (10 minutos)

1. Extraia o zip numa pasta nova, ex.: `C:\Users\Michel\Desktop\forjando-guerreiros-oficial`
   (apague/renomeie a pasta antiga problemática antes, para não confundir).
2. Abra a pasta no VS Code (File → Open Folder).
3. Crie o arquivo `.env.local` na raiz (mesmo conteúdo das variáveis da Vercel):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://txtvusttcbdkcXgsdazm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...(sua chave completa)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_ID_BRL=price_1UFIiVEEIBe3YZDlieQdvgrA
   STRIPE_PRICE_ID_USD=price_1UFIbtEEIBe3YZDlGmE9yX4l
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...   ← veja o passo 4
   ```
4. **Pegar a SUPABASE_SERVICE_ROLE_KEY** (nova, necessária p/ o webhook liberar acesso):
   Supabase → Project Settings ⚙️ → API → **service_role** → Revealed → copiar.
   ⚠️ Ela é SECRET absoluta: só em `.env.local` e na Vercel como *Secret*. Nunca no código.
5. Terminal do VS Code (menu Terminal → New Terminal):
   ```
   npm install
   npm run dev
   ```
   Abra http://localhost:3000 → login → você verá o **portão de assinatura** → clique em
   "INICIAR MEUS 7 DIAS GRÁTIS" → checkout Stripe em **modo teste** com o cartão
   `4242 4242 4242 4242`, validade futura qualquer, CVC qualquer.
   Ao voltar (`?success=true`), o webhook ativa `trialing` e o QG abre.

## 3️⃣ Publicar na Vercel (substituindo o deploy quebrado)

1. No mesmo terminal: `npm i -g vercel` (se ainda não tiver) → `vercel login`.
2. `vercel` → **Link to existing project? → y** → escolha `forjando-guerreiros-oficial`
   (ou crie um novo, se preferir) → diretório `./` → não modificar settings.
3. No painel da Vercel → projeto → **Settings → Environment Variables**, confira/adicione:
   | Key | Tipo | Valor |
   |---|---|---|
   | NEXT_PUBLIC_SUPABASE_URL | Config | https://txtvusttcbdkcXgsdazm.supabase.co |
   | NEXT_PUBLIC_SUPABASE_ANON_KEY | Config | sb_publishable_... |
   | STRIPE_SECRET_KEY | **Secret** | sk_test_... |
   | STRIPE_WEBHOOK_SECRET | **Secret** | whsec_... |
   | STRIPE_PRICE_ID_BRL | Config | price_1UFIiVEEIBe3YZDlieQdvgrA |
   | STRIPE_PRICE_ID_USD | Config | price_1UFIbtEEIBe3YZDlGmE9yX4l |
   | SUPABASE_SERVICE_ROLE_KEY | **Secret** | sb_secret_... |
4. Terminal: `vercel --prod` → aguarde `✓ Ready`.

## 4️⃣ Atualizar a URL do Webhook no Stripe (obrigatório!)

Seu webhook hoje aponta para o projeto ANTIGO (`versao-indol.vercel.app`).
1. Stripe → Developers → Webhooks → clique no endpoint existente → **Edit**.
2. Troque a URL para: `https://SEU-DOMINIO-ATUAL.vercel.app/api/stripe-webhook`
   (ex.: `https://forjando-guerreiros-oficial.vercel.app/api/stripe-webhook`).
3. Eventos já necessários (confira marcados): `checkout.session.completed`,
   `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`.
4. Quando comprar seu domínio próprio, edite a mesma URL depois (1 minuto).

## 5️⃣ Como o fluxo funciona (regras de negócio implementadas)

- Login OK → coluna `subscription_status` da `warrior_profiles` é consultada.
  - `trialing` ou `active` → entra no QG.
  - `inactive` / `canceled` / `past_due` → **tela de assinatura** (7 dias grátis).
  - Modo local (sem nuvem) → acesso normal (fallback offline).
- Checkout: o **servidor** escolhe o price pelo país (`x-vercel-ip-country`: BR → BRL,
  senão USD) — o cliente não consegue burlar a moeda.
- `trial_period_days: 7` injetado no código (vale para BRL e USD).
- Webhook valida a assinatura (`STRIPE_WEBHOOK_SECRET`) e atualiza o status com a
  **service role** (bypass seguro de RLS, só no servidor).
- Configurações → "Conta & Nuvem" mostra o status da assinatura com botão de atualizar.

## 6️⃣ Teste de ponta a ponta (checklist da vitória)

- [ ] Login em aba anônima puxa os dados da nuvem (sem onboarding repetido).
- [ ] Conta nova sem assinatura vê o portão com "7 dias grátis".
- [ ] Checkout abre em R$ 0,00 hoje / cobrança em 7 dias (cartão 4242...).
- [ ] Após pagar, volta e o QG abre sozinho (`trialing`).
- [ ] Em Stripe → Subscriptions, a assinatura aparece como *Trialing*.
- [ ] Cancelar a assinatura no painel Stripe → webhook marca `canceled` → portão volta.

Qualquer erro: rode `npm run build` e me mande o texto vermelho — ou me diga o passo que
travou que eu resolvo daqui. 👊
