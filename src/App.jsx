import "./App.css";
import { useEffect, useMemo, useState } from "react";
import Tesseract from "tesseract.js";

import { supabase } from "./lib/supabase";
import { audioService } from "./services/audioService";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Usuarios from "./components/Usuarios";
import CameraScanner from "./components/CameraScanner";

const CODIGO_REGEX = /\bA\s*N\s*\d(\s*\d){8}\s*B\s*R\b/gi;

const normalizeCodigo = (codigo = "") =>
  codigo.toUpperCase().replace(/[^A-Z0-9]/g, "");

const isValidCodigo = (codigo = "") =>
  /^AN\d{9}BR$/.test(normalizeCodigo(codigo));

const getCódigoFromTexto = (texto = "") => {
  const original = texto.toUpperCase();
  const cleaned = original.replace(/[^A-Z0-9]/g, "");

  const encontrados = new Set();

  for (const match of original.matchAll(CODIGO_REGEX)) {
    encontrados.add(normalizeCodigo(match[0]));
  }

  for (const match of cleaned.matchAll(/AN\d{9}BR/g)) {
    encontrados.add(match[0]);
  }

  return [...encontrados];
};

const usuariosTeste = [
  {
    id: 1,
    nome: "Líder XCOMM",
    email: "lider@xcomm.com",
    cargo: "lider",
  },
  {
    id: 2,
    nome: "Operador XCOMM",
    email: "operador@xcomm.com",
    cargo: "operador",
  },
];

const getCargoFromEmail = (email = "") => {
  if (email.includes("lider")) return "lider";
  if (email.includes("operador")) return "operador";
  return "operador";
};

const createUsuarioFromSupabase = (user) => ({
  id: user.id,
  email: user.email,
  nome: user.user_metadata?.full_name || user.email,
  cargo: user.user_metadata?.cargo || getCargoFromEmail(user.email),
});

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telaAtual, setTelaAtual] = useState("romaneio");

  const [usuarios, setUsuarios] = useState(usuariosTeste);
  const [historico, setHistorico] = useState([]);

  const [etapa, setEtapa] = useState("importacao");
  const [romaneio, setRomaneio] = useState([]);
  const [textoBruto, setTextoBruto] = useState("");
  const [bipagens, setBipagens] = useState([]);
  const [codigoBipado, setCodigoBipado] = useState("");
  const [carregandoOCR, setCarregandoOCR] = useState(false);
  const [progressoOCR, setProgressoOCR] = useState(0);
  const [cameraAberta, setCameraAberta] = useState(false);

  useEffect(() => {
    async function init() {
      await carregarSessao();
      await buscarConferencias();
    }

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUsuarioLogado(createUsuarioFromSupabase(session.user));
        } else {
          setUsuarioLogado(null);
          setTelaAtual("romaneio");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const stats = useMemo(() => {
    const corretos = bipagens.filter((b) => romaneio.includes(b.codigo));
    const divergentes = bipagens.filter((b) => !romaneio.includes(b.codigo));

    return {
      totalRomaneio: romaneio.length,
      totalBipado: bipagens.length,
      corretos: corretos.length,
      divergentes: divergentes.length,
    };
  }, [romaneio, bipagens]);

  const progressPercent =
    stats.totalRomaneio === 0
      ? 0
      : Math.round((stats.corretos / stats.totalRomaneio) * 100);

  async function carregarSessao() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao recuperar sessão de usuário:", error);
      return;
    }

    if (data?.session?.user) {
      setUsuarioLogado(createUsuarioFromSupabase(data.session.user));
    }
  }

  async function buscarConferencias() {
    console.log("Buscando conferências no Supabase...");

    const { data, error } = await supabase
      .from("conferencias")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar conferências:", error);
      return;
    }

    console.log("Conferências carregadas:", data);

    const historicoFormatado = data.map((item) => ({
      id: item.id,
      data: new Date(item.created_at).toLocaleString(),
      operador: item.operador_nome,
      cargo: item.cargo,
      totalRomaneio: item.total_romaneio,
      totalBipado: item.total_bipado,
      corretos: item.corretos,
      divergentes: item.divergentes,
      percentual: item.percentual,
    }));

    setHistorico(historicoFormatado);
  }

  async function fazerLogin(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.error("Login Supabase error:", error);
      if (error.message === "Failed to fetch") {
        alert(
          "Não foi possível conectar ao Supabase. Verifique o .env, reinicie o servidor e confirme que o URL está correto."
        );
        return;
      }
      if (error.code === "invalid_credentials") {
        alert(
          "Credenciais inválidas. Crie o usuário no Supabase Auth ou use o e-mail/senha corretos."
        );
        return;
      }
      alert("Erro no login: " + error.message);
      return;
    }

    const user = data.user;
    if (user) {
      setUsuarioLogado(createUsuarioFromSupabase(user));
      setTelaAtual("romaneio");
    }
  }

  async function sair() {
    await supabase.auth.signOut();

    setUsuarioLogado(null);
    setEmail("");
    setSenha("");
    resetarConferencia();
  }

  function extrairCodigos(texto) {
    const encontrados = getCódigoFromTexto(texto);
    const validos = encontrados.filter((codigo) => isValidCodigo(codigo));
    const unicos = [...new Set(validos)];

    setRomaneio(unicos);
    setBipagens([]);

    if (unicos.length > 0) {
      setEtapa("confirmacao");
    } else {
      alert("Nenhum código válido encontrado. Verifique se o romaneio contém AN + 9 dígitos + BR.");
    }
  }

  function importarTexto() {
    extrairCodigos(textoBruto);
  }

  async function lerImagemOCR(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    setCarregandoOCR(true);
    setProgressoOCR(0);

    try {
      const resultado = await Tesseract.recognize(arquivo, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgressoOCR(Math.round(m.progress * 100));
          }
        },
      });

      const texto = resultado.data.text;
      setTextoBruto(texto);
      extrairCodigos(texto);
    } catch (error) {
      console.error(error);
      alert("Erro ao ler imagem.");
    } finally {
      setCarregandoOCR(false);
    }
  }

  function confirmarRomaneio() {
    setEtapa("bipagem");
  }

  function biparCodigo() {
    const codigo = codigoBipado.toUpperCase().trim();

    if (!codigo) return;

    audioService.init();

    if (bipagens.some((b) => b.codigo === codigo)) {
      audioService.playDuplicate();
      alert("Código já bipado.");
      setCodigoBipado("");
      return;
    }

    const correto = romaneio.includes(codigo);
    setBipagens((prev) => [
      {
        codigo,
        hora: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);

    setCodigoBipado("");

    if (correto) {
      audioService.playSuccess();
    } else {
      audioService.playError();
      alert("Código não pertence ao romaneio.");
    }
  }

  function resetarConferencia() {
    setEtapa("importacao");
    setRomaneio([]);
    setTextoBruto("");
    setBipagens([]);
    setCodigoBipado("");
    setCarregandoOCR(false);
    setProgressoOCR(0);
    setCameraAberta(false);
  }

  async function finalizarConferencia() {
    if (stats.totalRomaneio === 0 || progressPercent < 100) {
      alert("Finalize a conferência completa antes de salvar.");
      return;
    }

    const registro = {
      operador_nome: usuarioLogado?.nome || "Operador desconhecido",
      cargo: usuarioLogado?.cargo || "não informado",
      total_romaneio: stats.totalRomaneio,
      total_bipado: stats.totalBipado,
      corretos: stats.corretos,
      divergentes: stats.divergentes,
      percentual: progressPercent,
    };

    const { data, error } = await supabase
      .from("conferencias")
      .insert(registro)
      .select();

    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      alert("Erro ao salvar no Supabase: " + error.message);
      return;
    }

    audioService.init();
    audioService.playFinalizado();
    alert("Conferência salva no Supabase!");

    await buscarConferencias();
    resetarConferencia();
    setTelaAtual("dashboard");
  }

  if (!usuarioLogado) {
    return (
      <Login
        email={email}
        senha={senha}
        setEmail={setEmail}
        setSenha={setSenha}
        fazerLogin={fazerLogin}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        usuarioLogado={usuarioLogado}
        telaAtual={telaAtual}
        setTelaAtual={setTelaAtual}
        sair={sair}
      />

      <main className="main">
        {telaAtual === "dashboard" && (
          <Dashboard historico={historico} usuarios={usuarios} />
        )}

        {telaAtual === "configuracoes" && (
          <Usuarios usuarios={usuarios} setUsuarios={setUsuarios} />
        )}

        {telaAtual === "romaneio" && (
          <>
            <header className="header">
              <div>
                <span className="mini-title">PAINEL OPERACIONAL</span>
                <h1>Conferência de Romaneio</h1>
              </div>

              <button className="reset-btn" onClick={resetarConferencia}>
                Reiniciar
              </button>
            </header>

            <section className="stepper">
              <div
                className={`step-wrap ${
                  etapa === "importacao"
                    ? "active"
                    : romaneio.length > 0
                    ? "done"
                    : ""
                }`}
              >
                <div className="step-icon">📦</div>
                <span>Importar</span>
              </div>

              <div className="step-line"></div>

              <div
                className={`step-wrap ${
                  etapa === "confirmacao"
                    ? "active"
                    : etapa === "bipagem"
                    ? "done"
                    : ""
                }`}
              >
                <div className="step-icon">✈️</div>
                <span>Conferir</span>
              </div>

              <div className="step-line"></div>

              <div className={`step-wrap ${etapa === "bipagem" ? "active" : ""}`}>
                <div className="step-icon">✅</div>
                <span>Bipagem</span>
              </div>
            </section>

            {etapa === "importacao" && (
              <section className="panel">
                <h2>Importar romaneio</h2>

                <p className="muted">
                  Envie uma imagem, abra a câmera ou cole o conteúdo do romaneio.
                </p>

                <div className="import-grid">
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={lerImagemOCR}
                      hidden
                    />

                    {carregandoOCR
                      ? `Lendo... ${progressoOCR}%`
                      : "Enviar imagem"}
                  </label>

                  <button
                    className="primary-btn"
                    onClick={() => setCameraAberta(true)}
                  >
                    📷 Abrir câmera
                  </button>

                  {cameraAberta && (
                    <CameraScanner
                      onScan={(codigo) => {
                        const codigoFormatado = codigo.toUpperCase().trim();

                        setTextoBruto((prev) =>
                          prev.includes(codigoFormatado)
                            ? prev
                            : `${prev}\n${codigoFormatado}`
                        );
                      }}
                      onClose={() => setCameraAberta(false)}
                    />
                  )}

                  <textarea
                    placeholder="Cole aqui o romaneio..."
                    value={textoBruto}
                    onChange={(e) => setTextoBruto(e.target.value)}
                  />

                  <button className="primary-btn" onClick={importarTexto}>
                    Extrair códigos
                  </button>
                </div>
              </section>
            )}

            {etapa === "confirmacao" && (
              <section className="panel">
                <h2>Conferir romaneio</h2>

                <p className="muted">{romaneio.length} códigos encontrados</p>

                <div className="codes">
                  {romaneio.map((codigo) => (
                    <div className="code-chip" key={codigo}>
                      {codigo}
                    </div>
                  ))}
                </div>

                <button className="primary-btn" onClick={confirmarRomaneio}>
                  Confirmar romaneio
                </button>
              </section>
            )}

            {etapa === "bipagem" && (
              <>
                <section className="stats-grid">
                  <div className="card">
                    <h3>{stats.totalRomaneio}</h3>
                    <p>Total Romaneio</p>
                  </div>

                  <div className="card">
                    <h3>{stats.totalBipado}</h3>
                    <p>Total Bipado</p>
                  </div>

                  <div className="card success">
                    <h3>{stats.corretos}</h3>
                    <p>Corretos</p>
                  </div>

                  <div className="card error">
                    <h3>{stats.divergentes}</h3>
                    <p>Divergentes</p>
                  </div>
                </section>

                <section className="content-grid">
                  <div className="panel">
                    <div className="progress-header">
                      <div>
                        <h2>Progresso da conferência</h2>
                        <p className="muted">{progressPercent}% concluído</p>
                      </div>

                      <strong>
                        {stats.corretos}/{stats.totalRomaneio}
                      </strong>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    <div className="scan-box">
                      <input
                        className="scan-input"
                        placeholder="Bipar código..."
                        value={codigoBipado}
                        onChange={(e) => setCodigoBipado(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") biparCodigo();
                        }}
                      />

                      <button className="scan-btn" onClick={biparCodigo}>
                        Bipar
                      </button>
                    </div>

                    {progressPercent === 100 && stats.totalRomaneio > 0 && (
                      <div className="completed-box">
                        <div>
                          <h2>✅ Conferência concluída</h2>
                          <p>Todos os objetos foram conferidos.</p>
                        </div>
                        <button
                          className="primary-btn"
                          onClick={finalizarConferencia}
                        >
                          Finalizar Conferência
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="panel">
                    <h2>Conferidos</h2>

                    <div className="list">
                      {bipagens.map((item) => {
                        const correto = romaneio.includes(item.codigo);

                        return (
                          <div className="list-item" key={item.codigo}>
                            <div>
                              <strong>{item.codigo}</strong>
                              <p>{item.hora}</p>
                            </div>

                            <span className={correto ? "badge-ok" : "badge-error"}>
                              {correto ? "OK" : "ERRO"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        <nav className="bottom-nav">
          <button onClick={() => setTelaAtual("romaneio")}>📦</button>

          {usuarioLogado.cargo !== "operador" && (
            <button onClick={() => setTelaAtual("dashboard")}>📊</button>
          )}

          <button onClick={() => setTelaAtual("configuracoes")}>⚙️</button>
        </nav>
      </main>
    </div>
  );
}