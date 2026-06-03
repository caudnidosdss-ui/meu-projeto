import { Menu, X } from "lucide-react";

const TITULOS = {
  romaneio: "Romaneio",
  dashboard: "Dashboard",
  configuracoes: "Configurações",
};

export function MobileTopBar({ onMenuClick, menuAberto, telaAtual }) {
  return (
    <header className="mobile-topbar">
      <button
        type="button"
        className="mobile-topbar__menu"
        onClick={onMenuClick}
        aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuAberto}
      >
        {menuAberto ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="mobile-topbar__brand">
        <div className="mobile-topbar__logo">XC</div>
        <div className="mobile-topbar__text">
          <strong>{TITULOS[telaAtual] || "XCOMM"}</strong>
          <span>Toque no menu para navegar</span>
        </div>
      </div>
    </header>
  );
}
