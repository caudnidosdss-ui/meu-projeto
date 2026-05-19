Instruções para habilitar deleção segura de usuários

1) Aplicar políticas RLS (SQL):
- Abra o Supabase Studio → SQL Editor → New query.
- Cole o conteúdo de `sql/supabase_policies.sql` e execute.
- Verifique se a tabela `usuarios` tem RLS habilitado e as policies criadas.

2) Endpoint serverless (para deleções administrativas):
- Arquivo criado: `api/deleteUser.js` (usa `SUPABASE_SERVICE_ROLE_KEY`).
- Variáveis de ambiente necessárias no provedor (Vercel/Netlify):
  - `VITE_SUPABASE_URL` (já usado no cliente)
  - `SUPABASE_SERVICE_ROLE_KEY` (service role key **privada**, NÃO comitar)
  - `DELETE_API_KEY` (chave simples para proteger o endpoint)
  - `VITE_DELETE_API_KEY` (mesma chave que `DELETE_API_KEY`, exposta apenas para o cliente)
  - `VITE_USE_DELETE_ENDPOINT=true` para ativar o uso do endpoint no app
- Deploy: ao fazer deploy no Vercel, defina essas variáveis no painel de Environment Variables.

3) Como chamar o endpoint (exemplo curl):

```bash
curl -X POST https://SEU_DOMINIO/api/deleteUser \
  -H "Content-Type: application/json" \
  -H "x-api-key: SUA_DELETE_API_KEY" \
  -d '{"id":"usuario-id-ou", "email":"opcional@exemplo.com"}'
```

4) Recomendações de segurança:
- Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no cliente.
- Use `DELETE_API_KEY` longa e rotacione-a conforme necessário.
- Restrinja o endpoint via autenticação adicional (IP allowlist, JWT checks).

5) Testes:
- Teste localmente usando `vercel dev` ou `netlify dev` se usar provider.
- Após aplicar as policies, teste a deleção pelo cliente (usuário comum deve ser capaz de deletar apenas o próprio registro; admins podem deletar qualquer usuário se o policy estiver correto).

Se quiser, eu aplico o SQL automaticamente (você terá que colar no SQL editor) ou posso criar um PR com essas mudanças. Diga qual prefere.
