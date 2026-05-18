import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Erro: faltam variáveis de ambiente. Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const email = process.env.NEW_USER_EMAIL || "lider@xcomm.com";
const password = process.env.NEW_USER_PASSWORD || "123456";
const nome = process.env.NEW_USER_NAME || "Líder XCOMM";
const cargo = process.env.NEW_USER_ROLE || "lider";

console.log(`Criando usuário ${email} no Supabase...`);

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    full_name: nome,
    cargo,
  },
});

if (error) {
  console.error("Erro ao criar usuário:", error);
  process.exit(1);
}

console.log("Usuário criado com sucesso:", data);
