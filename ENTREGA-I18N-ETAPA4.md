# 🌐 ENTREGA — i18n ETAPA 4 (FINAL): app 100% traduzido PT / EN / ES

Data: 18/09/2026 · Build de produção verificado (`npm run build` ✓) · Auditoria de chaves ✓ · Smoke test das páginas ✓

---

## 🐛 Bugs encontrados e corrigidos (eram a causa dos "problemas" que você via)

1. **43 chaves de tradução faltavam no dicionário** (`lib/data.js`). O QG e a Biblioteca
   chamavam `t('fail_t')`, `t('vic_t')`, `t('lib_l')` etc., mas essas chaves nunca foram
   entregues pelo chat anterior — então a tela mostrava o **código cru** (ex.: botão
   "vic_b", modal "fall_t") **até em português**. Todas as 43 foram criadas em PT/EN/ES.
2. **A aba "Biblioteca" não tinha rótulo** no menu (aparecia `library` / `nav_library` cru).
   Adicionadas as chaves `library` e `nav_library` nos 3 idiomas.
3. **Conteúdo traduzido pela metade**: os helpers `cxHab / cxTiers / cxDossier / cxTable / cxSos`
   existiam, mas as categorias de conteúdo (`hab`, `tiers`, `dos`, `table`, `sos`) **estavam
   vazias** — em EN/ES os hábitos, patamares, o dossiê do Inimigo e o S.O.S caíam em português.
   Tudo foi preenchido (20 hábitos, 7 patamares, dossiê completo com referências, 6 frases S.O.S,
   3 fases, 4 exercícios, 8 mantras, rótulos de respiração).

## ✅ O que foi traduzido nesta etapa (arquivo por arquivo)

| Arquivo | O que mudou |
|---|---|
| `lib/data.js` | +117 chaves I18N (43 faltantes + novas), `library`/`nav_library` |
| `lib/content-i18n.js` | +14 categorias: `quotes`, `hab`, `tiers`, `dos`, `table`, `sos`, `breath`, `stats`, `forge`, `sosui`, `enemy`, `partner`, `termos`, `priv`; helpers `cxTiers`/`cxSos` agora fazem merge seguro; novos `cxQuotes`/`cxBreath` |
| `components/views/QgView.jsx` | 100% traduzido: nível/recompensa do patamar, metas, mantras, modal de queda + protocolo de retomada, gatilhos, linha do tempo, modal de vitória, hábitos do dia |
| `components/views/StatsView.jsx` | 100% traduzido: KPIs, heatmap (nomes de mês + letras dos dias por idioma), relatório semanal, **imagem compartilhável (canvas)**, mapa de risco, salão da fama, histórico S.O.S |
| `components/views/ForgeView.jsx` | 100% traduzido: regra de slots, alerta de negligência, cards, modal de hábito, histórico 7 dias |
| `components/SosModal.jsx` | 100% traduzido: fases, validação de honra, orbe de respiração (INALE/SEGURE/EXALE…), crise |
| `components/views/EnemyView.jsx` | Título, subtítulo, tabela resumo e rodapé |
| `components/Shell.jsx` | Chip de status de vida + marca do modo discreto ("FG JOURNAL"/"FG DIARIO") |
| `components/views/LibraryView.jsx` | Rótulos da respiração guiada + título do card |
| `lib/store.jsx` | `document.title` por idioma, botões do `confirmBox` (Cancelar/SIM, EXCLUIR/irreversível), toast de sync |
| `lib/utils.js` | `fmtD` com locale configurável (`setLocaleLang`) — datas curtas no idioma do app |
| `lib/logic.js` | `mantraPool(S, quotes)` aceita mantras traduzidos |
| `lib/notify.js` | Lembretes locais (hábito ⏰ e check-in 20h) no idioma do usuário |
| `app/api/cron/daily/route.js` | Push do servidor (check-in + relatório de domingo) no idioma de cada perfil |
| `app/p/[token]/page.jsx` | Cartão do parceiro traduzido no idioma do **visitante** (cookie > navegador > PT) |
| `app/layout.jsx` | `<html lang>` dinâmico + metadata traduzida |
| `app/termos/page.jsx` · `app/privacidade/page.jsx` | **Traduzidos por completo** (EN/ES), seguindo o idioma do visitante |

## 🧪 Como testar em 5 minutos

1. `npm install && npm run dev` → abra http://localhost:3000
2. Na landing, clique em **EN** e **ES** no seletor (canto superior direito) — tudo troca na hora.
3. Entre no app → **Ajustes → Idioma** → troque PT/EN/ES e percorra: QG (marque uma vitória e uma
   queda para ver os modais), Forja, Missões, Diário, Dados (gere a imagem compartilhável),
   Inimigo, Biblioteca (lições + respiração guiada), botão S.O.S.
4. Abra `/termos` e `/privacidade` com o idioma EN/ES selecionado na landing.
5. `npm run build` deve terminar sem erros.

## 📤 Como publicar no GitHub (escolha UM jeito)

**Jeito A — substituir a pasta inteira (este ZIP já vem com o .git e o commit pronto):**
1. Feche o VS Code. Renomeie sua pasta local atual para `forjando-guerreiros-OLD`.
2. Extraia este ZIP como `forjando-guerreiros`.
3. Abra no VS Code → terminal: `git push origin main`
   (se o GitHub reclamar que há commits novos lá, rode antes: `git pull --rebase origin main`)

**Jeito B — copiar só os arquivos (mantém o seu .git atual):**
1. Extraia o ZIP numa pasta temporária.
2. Copie tudo **exceto a pasta `.git`** por cima da sua pasta do projeto (substituir).
3. `git add -A && git commit -m "i18n etapa 4 final: app 100% PT/EN/ES" && git push`

Depois: `vercel --prod` (ou deixe o deploy automático da Vercel fazer).

## 📝 Observações / pendências que continuam valendo

- **Placeholders de contato**: `/termos` (item 9) e `/privacidade` (item 10) ainda têm
  "substitua este texto pelo seu e-mail oficial" — trocar pelos e-mails reais (FASE 2 do
  PROXIMOS-PASSOS, obrigatório antes do modo LIVE).
- **Depoimentos da landing** continuam sendo placeholders — não rodar tráfego pago antes de
  trocar por depoimentos reais com autorização (CDC art. 37).
- **Nome do PWA (manifest)** continua "Forjando Guerreiros"/"FG Diário" em PT — é a marca;
  trocar o manifest por idioma exigiria manifests dinâmicos (posso fazer depois se quiser).
- **Mensagens de erro internas das APIs** (ex.: "Não autorizado" em JSON) continuam em PT —
  são caminhos raros de falha, não fazem parte da jornada normal.
- Os arquivos `i18n-*.patch` na raiz são relíquias das etapas anteriores (já aplicados) —
  pode apagá-los quando quiser.
