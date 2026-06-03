import { useState, useRef } from "react";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { Copy, Trash2, Upload, AlertCircle, CheckCircle } from "lucide-react";
import "../styles/ConsultaNF.css";

export default function ConsultaNF() {
  const [baseData, setBaseData] = useState([]);
  const [results, setResults] = useState([]);
  const [pedidosText, setPedidosText] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const limparCodigo = (valor) => {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  };

  const normalizarChave = (chave) => {
    return String(chave || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const extrairPedidos = (texto) => {
    const encontrados = texto.match(/\b\d{6}[A-Z0-9]{4,30}\b/gi) || [];
    if (encontrados.length)
      return [...new Set(encontrados.map(limparCodigo))];
    return texto
      .split(/[\n,;\t ]+/)
      .map(limparCodigo)
      .filter(Boolean);
  };

  const extrairNF = (linha) => {
    for (const [chave, valor] of Object.entries(linha)) {
      const k = normalizarChave(chave);
      const v = String(valor || "").trim();
      if (!v) continue;

      const pareceNF =
        k.includes("notafiscal") ||
        k.includes("numeronota") ||
        k.includes("numeronf") ||
        k.includes("nfe") ||
        k === "nf" ||
        k === "nota";

      if (pareceNF) {
        const numeros = v.replace(/\D/g, "");
        if (numeros.length >= 4 && numeros.length <= 12) return numeros;
      }
    }
    return "-";
  };

  const extrairData = (linha) => {
    for (const [chave, valor] of Object.entries(linha)) {
      const k = normalizarChave(chave);
      if (k.includes("data")) return String(valor || "-");
    }
    return "-";
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setBaseData(jsonData);
      setResults([]);
    } catch (error) {
      console.error("Erro ao ler arquivo:", error);
      alert("Erro ao processar arquivo");
    }
  };

  const consultar = () => {
    const pedidos = extrairPedidos(pedidosText);

    if (!baseData.length) {
      alert("Importe a planilha primeiro.");
      return;
    }

    const newResults = pedidos.map((pedido) => {
      const pedidoLimpo = limparCodigo(pedido);

      const linha = baseData.find((row) =>
        Object.values(row).some(
          (valor) =>
            limparCodigo(String(valor)).includes(pedidoLimpo)
        )
      );

      if (!linha) {
        return { pedido, nf: "-", data: "-", status: "Não encontrado" };
      }

      const nf = extrairNF(linha);
      const data = extrairData(linha);

      return {
        pedido,
        nf,
        data,
        status: nf !== "-" ? "Encontrado" : "Não encontrado",
      };
    });

    setResults(newResults);
  };

  const copiarNFs = () => {
    const nfs = results
      .filter((r) => r.status === "Encontrado" && r.nf !== "-")
      .map((r) => r.nf)
      .join("\n");

    navigator.clipboard.writeText(nfs);
    alert("NFs copiadas para clipboard!");
  };

  const limpar = () => {
    setPedidosText("");
    setResults([]);
  };

  const found = results.filter((r) => r.status === "Encontrado").length;
  const notFound = results.filter((r) => r.status !== "Encontrado").length;

  return (
    <motion.div
      className="consulta-nf-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="consulta-header">
        <div>
          <h1>Consulta NF</h1>
          <p>Importe a planilha e consulte seus pedidos</p>
        </div>
      </div>

      <div className="metrics-grid">
        <motion.div
          className="metric-card"
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="metric-label">BASE IMPORTADA</div>
          <div className="metric-value">{baseData.length}</div>
        </motion.div>

        <motion.div
          className="metric-card accent-success"
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="metric-label">ENCONTRADOS</div>
          <div className="metric-value">{found}</div>
        </motion.div>

        <motion.div
          className="metric-card accent-error"
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="metric-label">NÃO ENCONTRADOS</div>
          <div className="metric-value">{notFound}</div>
        </motion.div>
      </div>

      <div className="glass-panel">
        <h3>Importar Planilha XLSX / XLS / CSV</h3>
        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            id="fileInput"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="file-input"
          />
          <label htmlFor="fileInput" className="file-label">
            <Upload size={20} />
            <span>Clique para selecionar arquivo</span>
          </label>
          {fileName && <div className="file-name">📄 {fileName}</div>}
        </div>
      </div>

      <div className="glass-panel">
        <h3>Cole os Pedidos para Consultar</h3>
        <textarea
          id="pedidosText"
          value={pedidosText}
          onChange={(e) => setPedidosText(e.target.value)}
          placeholder="Ex: 260528HE2P1683 ou 260528HE2P1683, 260528HE2P1684..."
          className="consulta-textarea"
        />

        <div className="action-buttons">
          <button onClick={consultar} className="btn-primary">
            <CheckCircle size={16} />
            Consultar
          </button>
          <button onClick={copiarNFs} className="btn-secondary">
            <Copy size={16} />
            Copiar NFs
          </button>
          <button onClick={limpar} className="btn-danger">
            <Trash2 size={16} />
            Limpar
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <motion.div
          className="glass-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3>Resultados</h3>
          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>NF</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={idx} className={result.status === "Encontrado" ? "found" : "not-found"}>
                    <td className="pedido-col">{result.pedido}</td>
                    <td className="nf-col">{result.nf}</td>
                    <td className="data-col">{result.data}</td>
                    <td className={`status-col ${result.status === "Encontrado" ? "success" : "error"}`}>
                      {result.status === "Encontrado" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {result.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
