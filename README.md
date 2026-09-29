# Rumo a Barcelona

Central da mudança do Aleff e da Paula (e do Boris e da Sol) para Barcelona.

- Front-end: React + Vite + TypeScript
- Back-end: Supabase, projeto `rumo-barcelona` (ref `swvbemetanjhxtwheqro`, região Paris)
- Acesso: login com Google; só entram os e-mails da tabela `allowed_emails` (Aleff e Paula)
- Tempo real: o que um altera, o outro vê na hora

## Estrutura

```
src/
  App.tsx              login, menu lateral e troca de telas
  lib/                 cliente Supabase, tipos, datas, upload de arquivos
  components/          avatar, checklist, tela de login
  pages/               Painel, Perfis, Linha, Vistos, Gatos, Documentos, Agenda, Chat, Fontes
```

## 1. Ligar o login com Google (uma vez só)

**No Google Cloud** (https://console.cloud.google.com):

1. Crie um projeto chamado `Rumo a Barcelona`.
2. Em *APIs e serviços › Tela de consentimento OAuth*: tipo **Externo**, nome do app `Rumo a Barcelona`, e adicione os dois e-mails como **usuários de teste**.
3. Em *Credenciais › Criar credenciais › ID do cliente OAuth*: tipo **Aplicativo da Web**.
   - Origens JavaScript autorizadas: `http://localhost:5173` e, depois do deploy, o endereço da Vercel.
   - URIs de redirecionamento autorizados: `https://swvbemetanjhxtwheqro.supabase.co/auth/v1/callback`
4. Copie o **ID do cliente** e a **chave secreta**.

**No Supabase**:

1. https://supabase.com/dashboard/project/swvbemetanjhxtwheqro/auth/providers → **Google** → ativar, colar ID e chave secreta, salvar.
2. https://supabase.com/dashboard/project/swvbemetanjhxtwheqro/auth/url-configuration
   - Site URL: o endereço da Vercel (ou `http://localhost:5173` enquanto testa)
   - Redirect URLs: `http://localhost:5173` e o endereço da Vercel

## 2. Publicar na Vercel (recomendado, não precisa rodar nada no computador)

1. Crie um repositório **privado** no GitHub chamado `rumo-barcelona` e envie estes arquivos (pelo site do GitHub dá para arrastar a pasta, sem `node_modules`).
2. Na Vercel: *Add New › Project › Import* o repositório. Framework: **Vite** (detecta sozinho).
3. Em *Environment Variables*, cadastre as duas do arquivo `.env.example`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy. Copie o endereço gerado (ex.: `rumo-barcelona.vercel.app`) e coloque no Google Cloud (origens) e no Supabase (Site URL e Redirect URLs).

A chave "publishable" pode ficar no navegador: quem protege os dados são as regras de acesso (RLS) do banco.

## 3. Rodar no computador (opcional)

Precisa de Node 20+. Evite rodar dentro do OneDrive (a pasta `node_modules` tem milhares de arquivos e trava a sincronização): copie o projeto para uma pasta fora dele.

```
npm install
cp .env.example .env
npm run dev
```

Abre em http://localhost:5173.

## Próximas fases

3. Google Agenda: compromissos criados nas agendas dos dois, com lembrete por e-mail.
4. Alertas por e-mail D-30, D-7, D-1 e resumo semanal (Resend).
5. Chat com a API do Claude usando as fontes e os dados do banco.
6. Radar semanal das fontes oficiais.
