import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Palette,
  Shield,
  UserPlus,
  Trash2,
} from "lucide-react";
import { permissoesPorCargo } from "../hooks/useAppStorage";
import "../styles/Configuracoes.css";

const TABS = [
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "permissoes", label: "Permissões", icon: Shield },
  { id: "tema", label: "Tema visual", icon: Palette },
];

const TEMAS = [
  { id: "dark-neon", label: "Dark Neon", desc: "Azul, roxo e detalhes neon" },
  { id: "dark-ocean", label: "Dark Ocean", desc: "Tons oceânicos profundos" },
  { id: "dark-purple", label: "Dark Purple", desc: "Roxo corporativo" },
];

const CARGOS = [
  { value: "operador", label: "Operador" },
  { value: "lider", label: "Líder" },
  { value: "admin", label: "Administrador" },
];

export default function Configuracoes({
  usuarios,
  setUsuarios,
  tema,
  setTema,
}) {
  const [aba, setAba] = useState("usuarios");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("operador");

  function criarUsuario(e) {
    e.preventDefault();
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    setUsuarios((prev) => [
      ...prev,
      {
        id: Date.now(),
        nome,
        email,
        senha,
        cargo,
        avatar: null,
        permissoes: permissoesPorCargo(cargo),
      },
    ]);

    setNome("");
    setEmail("");
    setSenha("");
    setCargo("operador");
  }

  function excluirUsuario(id) {
    if (!confirm("Deseja realmente excluir este usuário?")) return;
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  function alterarCargo(id, novoCargo) {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              cargo: novoCargo,
              permissoes: permissoesPorCargo(novoCargo),
            }
          : u
      )
    );
  }

  function atualizarAvatar(id, dataUrl) {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, avatar: dataUrl } : u))
    );
  }

  function handleAvatarFile(id, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => atualizarAvatar(id, reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="config-page">
      <header className="page-header">
        <div>
          <span className="mini-title">CENTRAL DO SISTEMA</span>
          <h1>Configurações</h1>
        </div>
      </header>

      <div className="config-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={aba === tab.id ? "config-tab active" : "config-tab"}
              onClick={() => setAba(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {aba === "usuarios" && (
          <motion.div
            key="usuarios"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="config-content"
          >
            <section className="glass-panel">
              <h2>
                <UserPlus size={22} /> Novo usuário
              </h2>
              <form className="config-form" onSubmit={criarUsuario}>
                <input
                  type="text"
                  placeholder="Nome completo"
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
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  {CARGOS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-primary">
                  Criar usuário
                </button>
              </form>
            </section>

            <section className="glass-panel">
              <h2>Usuários cadastrados</h2>
              <div className="user-cards">
                {usuarios.map((usuario) => (
                  <div className="user-card" key={usuario.id}>
                    <label className="user-card__avatar">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          handleAvatarFile(
                            usuario.id,
                            e.target.files?.[0]
                          )
                        }
                      />
                      {usuario.avatar ? (
                        <img src={usuario.avatar} alt="" />
                      ) : (
                        usuario.nome?.charAt(0)?.toUpperCase()
                      )}
                    </label>
                    <div className="user-card__info">
                      <strong>{usuario.nome}</strong>
                      <p>{usuario.email}</p>
                    </div>
                    <div className="user-card__actions">
                      <select
                        value={usuario.cargo}
                        onChange={(e) =>
                          alterarCargo(usuario.id, e.target.value)
                        }
                      >
                        {CARGOS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-danger-icon"
                        onClick={() => excluirUsuario(usuario.id)}
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {aba === "permissoes" && (
          <motion.div
            key="perm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-panel"
          >
            <h2>Matriz de permissões por cargo</h2>
            <div className="perm-table">
              <div className="perm-row perm-header">
                <span>Cargo</span>
                <span>Romaneio</span>
                <span>Dashboard</span>
                <span>Configurações</span>
              </div>
              {CARGOS.map((c) => {
                const perms = permissoesPorCargo(c.value);
                return (
                  <div className="perm-row" key={c.value}>
                    <strong>{c.label}</strong>
                    <span className={perms.includes("romaneio") ? "on" : "off"}>
                      {perms.includes("romaneio") ? "✓" : "—"}
                    </span>
                    <span
                      className={perms.includes("dashboard") ? "on" : "off"}
                    >
                      {perms.includes("dashboard") ? "✓" : "—"}
                    </span>
                    <span
                      className={
                        perms.includes("configuracoes") ? "on" : "off"
                      }
                    >
                      {perms.includes("configuracoes") ? "✓" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {aba === "tema" && (
          <motion.div
            key="tema"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="theme-grid"
          >
            {TEMAS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-card ${tema === t.id ? "theme-card--active" : ""}`}
                onClick={() => setTema(t.id)}
              >
                <div className={`theme-preview theme-preview--${t.id}`} />
                <strong>{t.label}</strong>
                <p>{t.desc}</p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
