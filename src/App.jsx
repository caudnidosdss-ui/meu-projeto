import { lazy, Suspense, useEffect, useState, useRef } from "react";
import "./styles/global.css";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import MobileDrawer from "./components/MobileDrawer";
import { MobileTopBar } from "./components/MobileNav";
import ToastContainer, { useToast } from "./components/ui/ToastContainer";
import { useAppStorage } from "./hooks/useAppStorage";
import { useConferencia } from "./hooks/useConferencia";

const Dashboard = lazy(() => import("./components/Dashboard"));
const Configuracoes = lazy(() => import("./components/Configuracoes"));
const RomaneioPage = lazy(() => import("./components/Romaneio/RomaneioPage"));

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="skeleton">
        <div className="skeleton-row" />
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
      <p>Carregando módulo…</p>
    </div>
  );
}

export default function App() {
  const { usuarios, setUsuarios, historico, setHistorico, tema, setTema } =
    useAppStorage();

  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [telaAtual, setTelaAtual] = useState("romaneio");
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const conferencia = useConferencia(usuarioLogado, setHistorico);
  const { toasts, addToast, removeToast } = useToast();
  const mainRef = useRef(null);

  useEffect(() => {
    if (
      usuarioLogado &&
      telaAtual === "configuracoes" &&
      usuarioLogado.cargo !== "lider"
    ) {
      setTelaAtual("romaneio");
    }
  }, [telaAtual, usuarioLogado]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setSidebarAberta(false);
  }, [telaAtual]);

  useEffect(() => {
    document.body.classList.toggle("menu-mobile-open", sidebarAberta);
    return () => document.body.classList.remove("menu-mobile-open");
  }, [sidebarAberta]);

  function navegar(id) {
    setTelaAtual(id);
    setSidebarAberta(false);
  }

  function fecharMenu() {
    setSidebarAberta(false);
  }

  function fazerLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    // Simulate quick validation (replace with real auth call)
    const usuario = usuarios.find((u) => u.email === email && u.senha === senha);
    if (!usuario) {
      setLoginError("Email ou senha incorretos.");
      addToast("Email ou senha incorretos.", "error");
      setLoginLoading(false);
      return;
    }
    setUsuarioLogado(usuario);
    addToast("Login efetuado com sucesso.", "success");
    setTelaAtual("romaneio");
    setSidebarAberta(false);
    setLoginLoading(false);
  }

  function sair() {
    setUsuarioLogado(null);
    setEmail("");
    setSenha("");
    setSidebarAberta(false);
    conferencia.resetarConferencia();
  }

  if (!usuarioLogado) {
  return (
    <Login
      email={email}
      senha={senha}
      setEmail={setEmail}
      setSenha={setSenha}
      fazerLogin={fazerLogin}
      error={loginError}
      loading={loginLoading}
    />
  );
}

  const podeDashboard =
    usuarioLogado.cargo === "lider" || usuarioLogado.cargo === "admin";

  const podeConfiguracoes = usuarioLogado.cargo === "lider";

  return (
    <div className="app">
      {/* Desktop: sidebar no fluxo */}
      <div className="sidebar-desktop">
        <Sidebar
          usuarioLogado={usuarioLogado}
          telaAtual={telaAtual}
          setTelaAtual={navegar}
          sair={sair}
        />
      </div>

      {/* Mobile: drawer com overlay */}
      <MobileDrawer
        aberto={sidebarAberta}
        onFechar={fecharMenu}
        usuarioLogado={usuarioLogado}
        telaAtual={telaAtual}
        setTelaAtual={navegar}
        sair={sair}
      />

      <div className="app-shell">
        <MobileTopBar
          onMenuClick={() => setSidebarAberta((v) => !v)}
          menuAberto={sidebarAberta}
          telaAtual={telaAtual}
        />

        <main className="main" ref={mainRef}>
          <Suspense fallback={<LoadingScreen />}>
            <div key={telaAtual} className="page">
              {telaAtual === "dashboard" && podeDashboard && (
                <Dashboard historico={historico} usuarios={usuarios} />
              )}

              {telaAtual === "configuracoes" && podeConfiguracoes && (
                <Configuracoes
                  usuarios={usuarios}
                  setUsuarios={setUsuarios}
                  tema={tema}
                  setTema={setTema}
                />
              )}

              {telaAtual === "romaneio" && (
                <RomaneioPage conferencia={conferencia} />
              )}
            </div>
          </Suspense>
        </main>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
}
