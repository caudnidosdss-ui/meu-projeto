import "../styles/dashboard.css";
import StatsCircle from "./StatsCircle";

export default function Dashboard({ historico = [], usuarios = [] }) {
  const totalConferencias = historico.length;

  const totalCorretos = historico.reduce(
    (acc, item) => acc + item.corretos,
    0
  );

  const totalErros = historico.reduce(
    (acc, item) => acc + item.divergentes,
    0
  );

  const totalObjetos = historico.reduce(
    (acc, item) => acc + item.totalRomaneio,
    0
  );

  const percentual =
    totalObjetos === 0
      ? 0
      : Math.round((totalCorretos / totalObjetos) * 100);

  const percentualErro =
    totalObjetos === 0
      ? 0
      : Math.round((totalErros / totalObjetos) * 100);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <span className="mini-title">PAINEL ADMINISTRATIVO</span>
          <h1>Dashboard do Líder</h1>
        </div>
      </div>

      <section className="dashboard-grid">
        <StatsCircle
          title="Taxa de acerto"
          value={percentual}
          color="#22c55e"
        />

        <StatsCircle
          title="Taxa de erro"
          value={percentualErro}
          color="#ef4444"
        />

        <StatsCircle
          title="Produtividade"
          value={Math.min(100, totalConferencias * 10)}
          color="#38bdf8"
        />

        <StatsCircle
          title="Eficiência"
          value={percentual >= 95 ? 100 : percentual}
          color="#a855f7"
        />
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-title">
          <h2>📊 Visão geral da operação</h2>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card">
            <span>📦</span>
            <strong>{totalConferencias}</strong>
            <p>Conferências</p>
          </div>

          <div className="summary-card">
            <span>📮</span>
            <strong>{totalObjetos}</strong>
            <p>Objetos</p>
          </div>

          <div className="summary-card success">
            <span>✅</span>
            <strong>{totalCorretos}</strong>
            <p>Corretos</p>
          </div>

          <div className="summary-card error">
            <span>❌</span>
            <strong>{totalErros}</strong>
            <p>Erros</p>
          </div>

          <div className="summary-card purple">
            <span>👥</span>
            <strong>{usuarios.length}</strong>
            <p>Usuários</p>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-title">
          <h2>📦 Conferências realizadas</h2>
        </div>

        <div className="history-list">
          {historico.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma conferência salva ainda.
            </div>
          ) : (
            historico.map((item) => (
              <div className="history-card" key={item.id}>
                <div className="history-user">
                  <div className="history-avatar">
                    {item.operador?.charAt(0)?.toUpperCase() || "O"}
                  </div>

                  <div>
                    <strong>👤 {item.operador}</strong>
                    <p>🕒 {item.data}</p>
                    <p>🎯 {item.cargo}</p>
                  </div>
                </div>

                <div className="history-metrics">
                  <span>📦 {item.totalRomaneio} objetos</span>
                  <span className="ok">✅ {item.corretos} corretos</span>
                  <span className="error">❌ {item.divergentes} erros</span>
                  <span className="blue">📊 {item.percentual}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}