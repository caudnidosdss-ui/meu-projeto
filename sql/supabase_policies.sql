-- Habilita Row Level Security (RLS) na tabela `usuarios`
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Permite que o próprio usuário delete seu registro (assume que `id` armazena uid do Auth)
CREATE POLICY "Usuário pode deletar próprio registro"
  ON public.usuarios
  FOR DELETE
  USING ( auth.uid() = id );

-- Permite que administradores (campo `cargo`) deletem qualquer usuário
CREATE POLICY "Admin pode deletar usuários"
  ON public.usuarios
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios u
      WHERE u.id = auth.uid() AND u.cargo = 'admin'
    )
  );

-- Observações:
-- 1) Cole este arquivo no SQL editor do Supabase e execute.
-- 2) Ajuste os nomes de colunas caso sua tabela use outro campo para cargo/id.
-- 3) Se a tabela precisa de políticas de SELECT/UPDATE, crie políticas similares para cada operação.
-- 4) Teste deleção com um usuário admin e com um usuário comum.
