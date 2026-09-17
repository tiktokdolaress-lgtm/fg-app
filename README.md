# FORJANDO GUERREIROS ⚔ — Next.js (App Router) + Tailwind CSS + Lucide

Conversão completa do PWA legado (HTML/JS/CSS puro, ~2.200 linhas) para uma base moderna,
modular e tipada por componentes. **Mesmo modelo de dados, mesma chave de localStorage
(`forjando_guerreiros_v1`) e mesma tabela Supabase (`warrior_profiles`)** — ou seja: quem já
usa o PWA antigo entra na versão Next sem perder nada (e a sincronização em nuvem continua
idêntica, incluindo entre as duas versões).

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
# produção:
npm run build && npm start
```

Deploy Vercel: importe o repositório — framework detectado automaticamente (Next.js).
Credenciais Supabase: já embutidas como fallback em `lib/supabase.js`; opcionalmente defina
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ver `.env.example`).
O banco precisa do schema + RLS + realtime do arquivo `supabase-setup.sql` (raiz do workspace
anterior) — no projeto atual isso já foi aplicado.

## Estrutura

```
app/
  layout.jsx            # fontes (Bebas Neue, Manrope, Share Tech Mono) + metadata + PWA manifest
  page.jsx              # 'use client' → AppProvider + gates (boot/auth/lock/onboard/app)
  globals.css           # Tailwind + design system dark/guerreiro (cards, chips, btns, heatmap…)
  manifest.webmanifest  # PWA
lib/
  utils.js              # datas, uid, pad, fdmy…
  data.js               # QUOTES, TIERS, METAS, HABITS, DOSSIÊ, I18N(pt/en/es), S.O.S…
  logic.js              # lógica pura: streaks, pilares, tiers, reps, projetos, T()
  audio.js              # síntese Web Audio (AF/SFX) + ciclo de respiração 4×4
  supabase.js           # client + auth + pull/push/subscribe (warrior_profiles) + modo local
  store.jsx             # Context global: estado S, update()+persist+push, toasts, modais, gates
components/
  AuthGate.jsx          # login/signup/recuperação (nuvem ou modo local)
  PinLock.jsx           # bloqueio por PIN (teclado numérico)
  Onboarding.jsx        # juramento em 11 passos (seq. adaptativa p/ status de vida)
  Shell.jsx             # topbar + sidebar desktop + bottom nav mobile + FAB S.O.S
  SosModal.jsx          # protocolo S.O.S 5 min (3 fases, orbe de respiração, reps, validação)
  ui.jsx                # Card, Chk, Toggle, Bar, WeekStrip, ModalHost, ToastHost…
  views/
    QgView.jsx          # dashboard: mantra, hero, check-in, forja do dia, linha do tempo
    ForgeView.jsx       # hábitos (slots por patamar), horários, falhas, histórico 7d, CRUD custom
    OpsView.jsx         # projetos + tarefas recorrentes + painel tático (segbars/KPIs)
    JournalView.jsx     # diário por dia (humor/+/−/desabafo) + caderno de notas com busca
    StatsView.jsx       # KPIs, heatmap mensal navegável, consistência, histórico S.O.S
    EnemyView.jsx       # dossiê científico em acordeão + tabela resumo
    SettingsView.jsx    # idioma/tema/som, status de vida, PIN, nuvem, frases, backup, perigo
```

## Regras de conversão aplicadas

- `class` → `className`; tags auto-fechadas (`<input />`, `<br />`…); SVGs de UI → **lucide-react**
  (emojis de *conteúdo* — hábitos, selos — permanecem, pois são dados, não cromo de UI).
- CSS nativo → utilitários **Tailwind** (+ camada `components` para o design system);
  temas Ônix/Grafite via CSS vars RGB com `<alpha-value>`; tema cósmico (180d+) no `body.cosmic`.
- JS imperativo (`innerHTML`, `data-act`, `$()`) → **hooks** (`useState/useEffect/useContext`);
  modais/confirm/toast viraram API declarativa no store (`openModal/confirmBox/toast`).
- Estado global `S` com o **mesmo shape** do legado (`DEF()`/`mergeS()`), persistido em
  localStorage e com push/pull/realtime Supabase idênticos (debounce 400ms, pull on-focus).
- Áudio 100% Web Audio API portado sem arquivos externos (`lib/audio.js`).

## Diferenças conscientes vs. legado

- Animações de contagem (`animateCount`) e o install-prompt PWA (`beforeinstallprompt`)
  foram simplificados/removidos (manifest mantém instalabilidade).
- Fluxos de modal reescritos em React preservando textos, penalidades e regras de negócio
  (queda −12/−10/−18, pureza +2, slots por patamar, reps semanais/personalizadas etc.).
