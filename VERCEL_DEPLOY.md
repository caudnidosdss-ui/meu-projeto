# Deploy no Vercel

Este projeto já está no GitHub em `https://github.com/caudnidosdss-ui/meu-projeto` e contém a configuração `vercel.json` para deploy automático.

## Passo 1 — Conectar o repositório no Vercel

1. Acesse https://vercel.com.
2. Faça login com sua conta.
3. Clique em **New Project**.
4. Conecte o GitHub e escolha o repositório `caudnidosdss-ui/meu-projeto`.
5. Se o repositório estiver dentro de uma subpasta, defina o **Root Directory** para `.` (normalmente não é necessário se o repo já estiver no root).

## Passo 2 — Configurar Build

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `Vite`

> O arquivo `vercel.json` já define a build para `package.json` e suporta funções em `api/**/*.js`.

## Passo 3 — Definir variáveis de ambiente

No painel do projeto Vercel, em **Settings > Environment Variables**, adicione:

- `VITE_SUPABASE_URL` = sua URL do Supabase
- `VITE_SUPABASE_ANON_KEY` = sua chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY` = sua chave `service_role` do Supabase (NÃO publique em código)
- `DELETE_API_KEY` = uma chave secreta para proteger o endpoint de exclusão
- `VITE_DELETE_API_KEY` = mesma chave que `DELETE_API_KEY`
- `VITE_USE_DELETE_ENDPOINT` = `true`

## Passo 4 — Aplicar políticas Supabase

1. Abra o Supabase Studio.
2. Vá em SQL Editor.
3. Cole o conteúdo de `sql/supabase_policies.sql`.
4. Execute.

Isso permitirá que:
- um usuário delete o próprio registro se `id = auth.uid()`;
- um administrador delete outros usuários se `cargo = 'admin'`.

## Passo 5 — Testar no deploy

Depois do deploy, verifique:

- A página principal carrega sem erro.
- A autenticação funciona.
- A exclusão de usuário funciona para o fluxo esperado.

## Passo 6 — Testar localmente

No terminal:

```bash
npm run dev
```

E para testar o endpoint de deleção:

```bash
npm run test-delete-user <id> [email]
```

## Observações

- Se o projeto estiver com o repositório configurado em uma subpasta do GitHub, ajuste o **Root Directory** no Vercel para `meu-projeto`.
- Verifique se as variáveis de ambiente no Vercel estão corretas e não contêm espaços extras.
- O endpoint `api/deleteUser.js` deve funcionar apenas se `VITE_USE_DELETE_ENDPOINT=true`.
