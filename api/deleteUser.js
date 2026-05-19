const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = req.headers['x-api-key'];
  if (!process.env.DELETE_API_KEY) {
    console.error('DELETE_API_KEY não configurado no ambiente');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (!apiKey || apiKey !== process.env.DELETE_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id, email } = req.body || {};
  if (!id && !email) return res.status(400).json({ error: 'id or email required' });

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    let resp;
    if (id) {
      resp = await supabase.from('usuarios').delete().eq('id', id).select();
    }

    if ((!resp || !resp.data || resp.data.length === 0) && email) {
      resp = await supabase.from('usuarios').delete().eq('email', email).select();
    }

    if (resp && resp.error) {
      console.error('Erro ao excluir via service role:', resp.error);
      return res.status(500).json({ error: resp.error.message || resp.error });
    }

    if (!resp || !resp.data || resp.data.length === 0) {
      return res.status(404).json({ error: 'Nenhum usuário encontrado para exclusão' });
    }

    return res.status(200).json({ message: 'Usuário excluído com sucesso', data: resp.data });
  } catch (err) {
    console.error('Exception ao excluir usuário:', err);
    return res.status(500).json({ error: err.message || err });
  }
};
