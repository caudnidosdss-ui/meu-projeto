import Sidebar from "./Sidebar";

/**
 * Menu lateral mobile: overlay + painel sempre acima do conteúdo.
 */
export default function MobileDrawer({
  aberto,
  onFechar,
  usuarioLogado,
  telaAtual,
  setTelaAtual,
  sair,
}) {
  return (
    <div
      className={`mobile-drawer ${aberto ? "mobile-drawer--open" : ""}`}
      aria-hidden={!aberto}
    >
      <button
        type="button"
        className="mobile-drawer__overlay"
        aria-label="Fechar menu"
        onClick={onFechar}
        tabIndex={aberto ? 0 : -1}
      />

      <div className="mobile-drawer__panel">
        <Sidebar
          usuarioLogado={usuarioLogado}
          telaAtual={telaAtual}
          setTelaAtual={setTelaAtual}
          sair={sair}
          onFechar={onFechar}
          isMobileDrawer
        />
      </div>
    </div>
  );
}
