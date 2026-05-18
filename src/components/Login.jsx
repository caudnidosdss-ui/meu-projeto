import "../styles/login.css";

export default function Login({
  email,
  senha,
  setEmail,
  setSenha,
  fazerLogin,
}) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          XC
        </div>

        <span className="mini-title">
          ACESSO OPERACIONAL
        </span>

        <h1>XCOMM</h1>

        <p className="muted">
          Entre para acessar o sistema de romaneio. Use um usuário existente no Supabase Auth.
        </p>

        <form
          onSubmit={fazerLogin}
          className="login-form"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Entrar
          </button>
        </form>

        <div className="login-help">
          <p>
            <strong>Líder:</strong>
            {" "}
            lider@xcomm.com / 123456
          </p>

          <p>
            <strong>Operador:</strong>
            {" "}
            operador@xcomm.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}