import { motion } from "framer-motion";
import {
  Package,
  LayoutDashboard,
  Settings,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import "../styles/Sidebar.css";

const CARGO_LABELS = {
  admin: "Administrador",
  lider: "Líder",
  operador: "Operador",
};

export default function Sidebar({
  usuarioLogado,
  telaAtual,
  setTelaAtual,
  sair,
  onFechar,
  isMobileDrawer = false,
}) {
  const podeVerDashboard =
    usuarioLogado?.cargo === "lider" ||
    usuarioLogado?.cargo === "admin";

  const podeConfiguracoes = usuarioLogado?.cargo === "lider";

  const iniciais =
    usuarioLogado?.nome?.charAt(0)?.toUpperCase() || "U";

  const menuItems = [
    {
      id: "romaneio",
      label: "Romaneio",
      desc: "Importação e bipagem",
      icon: Package,
    },
    ...(podeVerDashboard
      ? [
          {
            id: "dashboard",
            label: "Dashboard",
            desc: "Gestão e estatísticas",
            icon: LayoutDashboard,
          },
        ]
      : []),
    ...(podeConfiguracoes
      ? [
          {
            id: "configuracoes",
            label: "Configurações",
            desc: "Sistema e usuários",
            icon: Settings,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`sidebar ${isMobileDrawer ? "sidebar--in-drawer" : ""}`}
    >
      <div className="sidebar__top">
        <div className="logo">
          <motion.div className="logo-icon" whileHover={{ scale: 1.05 }}>
            XC
          </motion.div>
          <div>
            <h2>XCOMM</h2>
            <p>Conferência Correios</p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar__close-mobile"
          onClick={onFechar}
          aria-label="Fechar menu"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = telaAtual === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              className={active ? "menu-active" : ""}
              onClick={() => setTelaAtual(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="menu-icon-wrap">
                <Icon size={22} />
              </span>
              <div>
                <strong>{item.label}</strong>
                <p>{item.desc}</p>
              </div>
                {active && (
                  <span className="menu-active-indicator" />
                )}
            </motion.button>
          );
        })}
      </nav>

      <div className="user-box">
        <div
          className="user-avatar"
          style={
            usuarioLogado?.avatar
              ? {
                  backgroundImage: `url(${usuarioLogado.avatar})`,
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          {!usuarioLogado?.avatar && iniciais}
        </div>
        <div className="user-info">
          <strong>{usuarioLogado?.nome}</strong>
          <p>
            <Shield size={12} />
            {CARGO_LABELS[usuarioLogado?.cargo] || usuarioLogado?.cargo}
          </p>
        </div>
        <motion.button
          type="button"
          className="sidebar-logout"
          onClick={sair}
          whileTap={{ scale: 0.95 }}
          title="Sair"
        >
          <LogOut size={18} />
        </motion.button>
      </div>
    </aside>
  );
}
