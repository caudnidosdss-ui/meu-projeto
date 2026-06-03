import { useEffect, useState } from "react";

const usuariosTeste = [
  {
    id: 1,
    nome: "Líder XCOMM",
    email: "lider@xcomm.com",
    senha: "123456",
    cargo: "lider",
    avatar: null,
    permissoes: ["dashboard", "romaneio", "configuracoes", "usuarios"],
  },
  {
    id: 2,
    nome: "Operador XCOMM",
    email: "operador@xcomm.com",
    senha: "123456",
    cargo: "operador",
    avatar: null,
    permissoes: ["romaneio"],
  },
];

const CARGO_PERMISSOES = {
  admin: ["dashboard", "romaneio"],
  lider: ["dashboard", "romaneio", "configuracoes", "usuarios"],
  operador: ["romaneio"],
};

export function permissoesPorCargo(cargo) {
  return CARGO_PERMISSOES[cargo] || ["romaneio"];
}

export function useAppStorage() {
  const [usuarios, setUsuarios] = useState(() => {
    const salvos = localStorage.getItem("xcomm_usuarios");
    if (salvos) {
      try {
        return JSON.parse(salvos);
      } catch {
        return usuariosTeste;
      }
    }
    return usuariosTeste;
  });

  const [historico, setHistorico] = useState(() => {
    const salvo = localStorage.getItem("xcomm_historico");
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [tema, setTema] = useState(() => {
    return localStorage.getItem("xcomm_tema") || "dark-neon";
  });

  useEffect(() => {
    localStorage.setItem("xcomm_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem("xcomm_historico", JSON.stringify(historico));
  }, [historico]);

  useEffect(() => {
    localStorage.setItem("xcomm_tema", tema);
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  return {
    usuarios,
    setUsuarios,
    historico,
    setHistorico,
    tema,
    setTema,
  };
}
