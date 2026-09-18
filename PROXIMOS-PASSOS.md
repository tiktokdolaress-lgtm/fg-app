# 🗺️ PROXIMOS-PASSOS.md — ORDEM OFICIAL DECIDIDA PELO DONO

**Regra de ouro:** só começar a vender (modo LIVE) quando TUDO estiver ok.
Depois do LIVE: criar os vídeos do YouTube para trazer tráfego.

---

## 🔧 FASE 1 — Ajustes e recursos restantes (antes de vender)
1. **Login com Google** — Supabase Auth → Provider Google + botão no AuthGate.
2. **Limite de sessões por conta** — bloquear uso simultâneo em muitos dispositivos.
3. **Painel admin do dono** — assinantes, status, receita, bloqueios (rota protegida por allowlist).
4. **E-mails transacionais** — boas-vindas, "seu teste acaba em 2 dias", recibo/cancelamento.
5. Ajustes pontuais de UI/UX que o dono notar no uso diário (registrar aqui antes de mexer).

## ⚖️ FASE 2 — Jurídico/confiança (obrigatório antes do LIVE)
6. **Depoimentos reais com autorização** (substituir os placeholders da landing) ou remover a seção.
   → Depoimento inventado = prática abusiva (CDC art. 37). Não publicar tráfego pago antes disso.
7. **E-mails oficiais** de suporte e privacidade no fim de /termos e /privacidade (hoje placeholders).

## 🔴 FASE 3 — MODO LIVE (virada de chave, ~30-40 min, sem mudança de código)
Checklist da virada:
- [ ] Ativar conta Stripe (CPF/CNPJ + banco para recebimento).
- [ ] Criar preços LIVE: R$ 9,90/mês (BRL) + $7.99/mês (USD).
- [ ] Pegar `sk_live_...` (Developers → API keys).
- [ ] Criar webhook LIVE → `https://forjando-guerreiros-oficial.vercel.app/api/stripe-webhook`
      (eventos: checkout.session.completed, customer.subscription.created/updated/deleted) → `whsec_...` live.
- [ ] Trocar na Vercel: STRIPE_SECRET_KEY, STRIPE_PRICE_ID_BRL, STRIPE_PRICE_ID_USD, STRIPE_WEBHOOK_SECRET → `vercel --prod`.
- [ ] Compra real de teste com o próprio cartão + reembolso imediato para validar ponta a ponta.
- [ ] Conferir primeiro repasse bancário e taxa por venda no painel.

## 🎥 FASE 4 — TRÁFEGO (YouTube) — só depois do LIVE
8. Vídeos de conteúdo (disciplina, retenção, rotina) → CTA para a landing.
9. Preparar cupom/UTM por campanha (Stripe coupons) para medir qual vídeo converte.
10. Página de captura opcional com isca gratuita (ex.: mini-protocolo de 3 dias) para crescer lista.

---

## ✅ Log de entregas concluídas
- **i18n 100% (ETAPA 4 final)**: app inteiro em PT/EN/ES — QG, Forja, Missões, Diário, Dados, Inimigo, Biblioteca, Ajustes, S.O.S, onboarding, landing, paywall, PIN, cartão do parceiro, /termos, /privacidade, datas, notificações locais e push do servidor (cron). Corrigidas 43 chaves de tradução que estavam faltando no dicionário (a UI mostrava códigos crus tipo `fail_t`/`vic_t` mesmo em português) + adicionada a aba Biblioteca que não tinha rótulo traduzido. Build de produção verificado ✓
- Sync em nuvem Supabase (warrior_profiles + RLS + realtime) · mobile overflow · Next.js completo
- Assinatura Stripe teste (7 dias grátis, moeda por país, webhook libera/corta) · portão de assinatura
- Landing de vendas · /termos · /privacidade · exclusão de conta LGPD · notificações push + lembretes
- Check-in com estado FALHOU (✕ vermelho) · layout desktop do QG (número flanqueado + painel da frase)
- Engajamento: Relatório Semanal shareável (imagem) + push de domingo · Mapa de Risco por horário (intensidade 1-10 no S.O.S) · Parceiro de Responsabilidade (link somente-leitura /p/token) · Salão da Fama anônimo opt-in (/api/hall) · Biblioteca do Guerreiro (21 lições por patamar + 8 leituras estoicas + 3 respirações guiadas com som)
