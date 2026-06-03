import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  extrairCodigosDoTexto,
  isCodigoValido,
  normalizarCodigo,
} from "../lib/codigos";
import { lerImagemComOCR } from "../lib/ocr";
import { feedbackAcerto, feedbackErro } from "../lib/sounds";

export function useConferencia(usuarioLogado, setHistorico) {
  const [etapa, setEtapa] = useState("importacao");
  const [romaneio, setRomaneio] = useState([]);
  const [textoBruto, setTextoBruto] = useState("");
  const [bipagens, setBipagens] = useState([]);
  const [codigoBipado, setCodigoBipado] = useState("");
  const [carregandoOCR, setCarregandoOCR] = useState(false);
  const [progressoOCR, setProgressoOCR] = useState(0);
  const [ultimoFeedback, setUltimoFeedback] = useState(null);

  const stats = useMemo(() => {
    const corretos = bipagens.filter((b) => romaneio.includes(b.codigo));
    const divergentes = bipagens.filter((b) => !romaneio.includes(b.codigo));
    const pendentes = romaneio.filter(
      (codigo) => !bipagens.some((b) => b.codigo === codigo)
    );

    return {
      totalRomaneio: romaneio.length,
      totalBipado: bipagens.length,
      corretos: corretos.length,
      divergentes: divergentes.length,
      pendentes: pendentes.length,
    };
  }, [romaneio, bipagens]);

  const progressPercent =
    stats.totalRomaneio === 0
      ? 0
      : Math.round((stats.corretos / stats.totalRomaneio) * 100);

  const produtividade =
    stats.totalBipado === 0
      ? 0
      : Math.round((stats.corretos / stats.totalBipado) * 100);

  function resetarConferencia() {
    setEtapa("importacao");
    setRomaneio([]);
    setTextoBruto("");
    setBipagens([]);
    setCodigoBipado("");
    setCarregandoOCR(false);
    setProgressoOCR(0);
    setUltimoFeedback(null);
  }

  function aplicarCodigosExtraidos(codigos) {
    const unicos = [...new Set(codigos)];
    setRomaneio(unicos);
    setBipagens([]);
    if (unicos.length > 0) {
      setTextoBruto(unicos.join("\n"));
      setEtapa("confirmacao");
      return { ok: true, count: unicos.length };
    }
    return { ok: false, count: 0 };
  }

  function extrairCodigos(texto) {
    const codigos = extrairCodigosDoTexto(texto);
    return aplicarCodigosExtraidos(codigos);
  }

  function importarTexto() {
    return extrairCodigos(textoBruto);
  }

  function confirmarRomaneio() {
    if (romaneio.length === 0) return false;
    setEtapa("bipagem");
    return true;
  }

  async function lerImagemOCR(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return { ok: false };

    setCarregandoOCR(true);
    setProgressoOCR(0);

    try {
      const resultado = await lerImagemComOCR(arquivo, setProgressoOCR);
      if (resultado.validos.length > 0) {
        aplicarCodigosExtraidos(resultado.validos);
        return { ok: true, ...resultado };
      }
      return { ok: false, ...resultado };
    } catch (error) {
      console.error(error);
      return { ok: false, error };
    } finally {
      setCarregandoOCR(false);
      setProgressoOCR(0);
      event.target.value = "";
    }
  }

  function biparCodigo() {
    const codigo = normalizarCodigo(codigoBipado);
    if (!codigo) return { ok: false };

    if (!isCodigoValido(codigo)) {
      feedbackErro();
      setUltimoFeedback({ tipo: "erro", codigo, motivo: "invalido" });
      setCodigoBipado("");
      return { ok: false, motivo: "invalido" };
    }

    if (bipagens.some((b) => b.codigo === codigo)) {
      feedbackErro();
      setUltimoFeedback({ tipo: "erro", codigo, motivo: "duplicado" });
      setCodigoBipado("");
      return { ok: false, motivo: "duplicado" };
    }

    const existeNoRomaneio = romaneio.includes(codigo);

    if (existeNoRomaneio) {
      feedbackAcerto();
      setUltimoFeedback({ tipo: "ok", codigo });
    } else {
      feedbackErro();
      setUltimoFeedback({ tipo: "erro", codigo, motivo: "divergente" });
    }

    setBipagens((prev) => [
      { codigo, hora: new Date().toLocaleTimeString(), correto: existeNoRomaneio },
      ...prev,
    ]);
    setCodigoBipado("");
    return { ok: true, correto: existeNoRomaneio };
  }

  async function finalizarConferencia() {
    const registro = {
      id: Date.now(),
      data: new Date().toLocaleString(),
      operador: usuarioLogado.nome,
      cargo: usuarioLogado.cargo,
      totalRomaneio: stats.totalRomaneio,
      totalBipado: stats.totalBipado,
      corretos: stats.corretos,
      divergentes: stats.divergentes,
      pendentes: stats.pendentes,
      percentual: progressPercent,
    };

    const itens = bipagens.map((item) => ({
      codigo: item.codigo,
      hora: item.hora,
      status: romaneio.includes(item.codigo) ? "OK" : "ERRO",
    }));

    const { error } = await supabase.from("bipagens_finalizadas").insert({
      operador: usuarioLogado.nome,
      total: stats.totalRomaneio,
      corretos: stats.corretos,
      erros: stats.divergentes,
      duplicados: 0,
      percentual: progressPercent,
      itens,
    });

    if (error) {
      console.error(error);
      return { ok: false, error };
    }

    setHistorico((prev) => [registro, ...prev]);
    resetarConferencia();
    return { ok: true };
  }

  return {
    etapa,
    setEtapa,
    romaneio,
    textoBruto,
    setTextoBruto,
    bipagens,
    codigoBipado,
    setCodigoBipado,
    carregandoOCR,
    progressoOCR,
    ultimoFeedback,
    stats,
    progressPercent,
    produtividade,
    resetarConferencia,
    extrairCodigos,
    importarTexto,
    confirmarRomaneio,
    lerImagemOCR,
    biparCodigo,
    finalizarConferencia,
  };
}
