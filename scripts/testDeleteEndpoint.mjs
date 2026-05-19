import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: './.env' });

const useEndpoint = process.env.USE_DELETE_ENDPOINT === 'true' || process.env.VITE_USE_DELETE_ENDPOINT === 'true';
const endpointUrl = process.env.DELETE_ENDPOINT_URL || 'http://localhost:3000/api/deleteUser';
const apiKey = process.env.DELETE_API_KEY || process.env.VITE_DELETE_API_KEY;
const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL;

const args = process.argv.slice(2);
const [idArg, emailArg] = args;

if (!idArg && !emailArg) {
  console.error('Uso: node scripts/testDeleteEndpoint.mjs <id> [email]');
  console.error('Exemplo: node scripts/testDeleteEndpoint.mjs 123e4567-e89b-12d3-a456-426614174000 usuario@exemplo.com');
  process.exit(1);
}

async function testEndpoint() {
  if (!apiKey) {
    console.error('DELETE_API_KEY ou VITE_DELETE_API_KEY não está definido no .env');
    process.exit(1);
  }

  console.log('Chamando endpoint:', endpointUrl);
  const payload = {
    id: idArg || undefined,
    email: emailArg || undefined,
  };

  const res = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  console.log('Status:', res.status);
  console.log('Resposta:', body);
}

async function testDirectSupabase() {
  if (!svcKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY não está definido no .env');
    process.exit(1);
  }
  if (!supabaseUrl) {
    console.error('VITE_SUPABASE_URL não está definido no .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, svcKey);
  const payload = {};
  if (idArg) payload.id = idArg;
  if (emailArg) payload.email = emailArg;

  console.log('Executando exclusão direta com service role...');

  let response;
  if (payload.id) {
    response = await supabase.from('usuarios').delete().select().eq('id', payload.id);
  }
  if ((!response || !response.data || response.data.length === 0) && payload.email) {
    response = await supabase.from('usuarios').delete().select().eq('email', payload.email);
  }

  console.log('Response:', JSON.stringify(response, null, 2));
}

(async () => {
  try {
    if (useEndpoint) {
      await testEndpoint();
    } else {
      await testDirectSupabase();
    }
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
})();
