import "../styles/Usuarios.css";
import { useState } from "react";

export default function Usuarios({ usuarios, criarUsuario, excluirUsuario, alterarCargo }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("operador");

  async function criarUsuarioLocal(e) {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    await criarUsuario({ nome, email, senha, cargo });

    setNome("");
    setEmail("");
    setSenha("");
    setCargo("operador");
  }

  function excluirUsuarioLocal(id) {
    excluirUsuario(id);
  }

  function alterarCargoLocal(id, novoCargo) {
    alterarCargo(id, novoCargo);
  }

  return (
    <div className="usuarios-page">
      <section className="usuarios-panel">
        <div className="usuarios-header">
          <div>
            <span className="mini-title">GESTÃO DE ACESSOS</span>
            <h1>Usuários</h1>
          </div>
        </div>

        <form className="usuarios-form" onSubmit={criarUsuarioLocal}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="operador">📦 Operador</option>
            <option value="lider">📊 Líder</option>
            <option value="admin">👑 Admin</option>
          </select>

          <button type="submit" className="primary-btn">
            Criar usuário
          </button>
        </form>
      </section>

      <section className="usuarios-list">
        <div className="usuarios-title">
          <h2>Usuários cadastrados</h2>
        </div>

        <div className="usuarios-grid">
          {usuarios.map((usuario) => (
            <div className="usuario-card" key={usuario.id}>
              <div className="usuario-avatar">
                {usuario.nome?.charAt(0)?.toUpperCase()}
              </div>

              <div className="usuario-info">
                <strong>{usuario.nome}</strong>
                <p>{usuario.email}</p>
              </div>

              <div className="usuario-actions">
                <select
                  className="cargo-select"
                  value={usuario.cargo}
                  onChange={(e) => alterarCargoLocal(usuario, e.target.value)}
                >
                  <option value="operador">📦 Operador</option>
                  <option value="lider">📊 Líder</option>
                  <option value="admin">👑 Admin</option>
                </select>

                <button
                  className="delete-user-btn"
                  onClick={() => excluirUsuarioLocal(usuario)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}