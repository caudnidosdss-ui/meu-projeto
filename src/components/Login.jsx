import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import "../styles/Login.css";

export default function Login({
  email,
  senha,
  setEmail,
  setSenha,
  fazerLogin,
  error,
  loading,
}) {
  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="login-logo"
          animate={{
            boxShadow: [
              "0 0 40px rgba(37,99,235,.45)",
              "0 0 60px rgba(168,85,247,.5)",
              "0 0 40px rgba(37,99,235,.45)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          XC
        </motion.div>

        <span className="mini-title">ACESSO OPERACIONAL</span>
        <h1>XCOMM</h1>
        <p className="muted">
          Plataforma profissional de conferência logística
        </p>

        <form onSubmit={fazerLogin} className="login-form">
          <div className="input-icon-wrap">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-icon-wrap">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="btn-primary login-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? "Carregando..." : "Entrar"}
          </motion.button>
        </form>
        {error && <div className="login-error">{error}</div>}
        
      </motion.div>
    </div>
  );
}
