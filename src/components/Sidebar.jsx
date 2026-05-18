import "../styles/sidebar.css";

export default function Sidebar({
  usuarioLogado,
  telaAtual,
  setTelaAtual,
  sair,
}) {
  const podeVerDashboard =
    usuarioLogado?.cargo === "lider" ||
    usuarioLogado?.cargo === "admin";

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">
          <div className="logo-icon">XC</div>

          <div>
            <h2>XCOMM</h2>
            <p>Conferência Correios</p>
          </div>
        </div>

        <nav className="menu">
          <button
            className={telaAtual === "romaneio" ? "menu-active" : ""}
            onClick={() => setTelaAtual("romaneio")}
          >
            <span>📦</span>
            <div>
              <strong>Romaneio</strong>
              <p>Importação e bipagem</p>
            </div>
          </button>

          {podeVerDashboard && (
            <button
              className={telaAtual === "dashboard" ? "menu-active" : ""}
              onClick={() => setTelaAtual("dashboard")}
            >
              <span>📊</span>
              <div>
                <strong>Dashboard</strong>
                <p>Gestão e estatísticas</p>
              </div>
            </button>
          )}

          <button
            className={telaAtual === "configuracoes" ? "menu-active" : ""}
            onClick={() => setTelaAtual("configuracoes")}
          >
            <span>⚙️</span>
            <div>
              <strong>Configurações</strong>
              <p>Sistema e usuários</p>
            </div>
          </button>
        </nav>
      </div>

      <div className="user-box">
        <div className="online-dot"></div>

        <div>
          <strong>{usuarioLogado?.nome}</strong>
          <p>{usuarioLogado?.cargo}</p>
        </div>

        <button className="sidebar-logout" onClick={sair}>
          Sair
        </button>
      </div>
    </aside>
  );
}