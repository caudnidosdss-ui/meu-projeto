import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  ImagePlus,
  FileText,
  ClipboardPaste,
  Loader2,
  X,
} from "lucide-react";
import { analisarTexto } from "../../lib/codigos";

export default function ImportStep({ conferencia }) {
  const {
    textoBruto,
    setTextoBruto,
    carregandoOCR,
    progressoOCR,
    importarTexto,
    extrairCodigos,
    lerImagemOCR,
  } = conferencia;

  const [resultadoPreview, setResultadoPreview] = useState(null);
  const [mostrarFallback, setMostrarFallback] = useState(false);
  const [textoLens, setTextoLens] = useState("");
  const [imagemPreview, setImagemPreview] = useState(null);
  const previewUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function definirPreview(arquivo) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    if (arquivo) {
      previewUrlRef.current = URL.createObjectURL(arquivo);
      setImagemPreview(previewUrlRef.current);
    } else {
      previewUrlRef.current = null;
      setImagemPreview(null);
    }
  }

  function limparPreview() {
    definirPreview(null);
  }

  async function handleImagem(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    definirPreview(arquivo);

    const res = await lerImagemOCR(e);
    if (res?.validos?.length) {
      setResultadoPreview({
        encontrados: res.totalEncontrado || res.validos.length,
        validos: res.validos.length,
        invalidos: res.totalInvalido || 0,
        codigos: res.validos,
      });
    } else {
      setMostrarFallback(true);
      setResultadoPreview(null);
    }
    e.target.value = "";
  }

  function handleTexto() {
    const analise = analisarTexto(textoBruto);
    const res = importarTexto();
    setResultadoPreview({
      encontrados: analise.validos.length + analise.invalidos.length,
      validos: analise.validos.length,
      invalidos: analise.invalidos.length,
      codigos: analise.validos,
    });
    if (!res?.ok) {
      setMostrarFallback(true);
      alert(
        "Nenhum código válido encontrado. Use o padrão AN + 9 números + BR."
      );
    }
  }

  function handleLens() {
    const analise = analisarTexto(textoLens);
    extrairCodigos(textoLens);
    setResultadoPreview({
      encontrados: analise.validos.length + analise.invalidos.length,
      validos: analise.validos.length,
      invalidos: analise.invalidos.length,
      codigos: analise.validos,
    });
    if (analise.validos.length === 0) {
      alert(
        "Nenhum código válido no texto colado. Use o padrão AN123456789BR."
      );
    }
  }

  return (
    <section className="glass-panel romaneio-import">
      <div className="romaneio-import__header">
        <h2>Importar Romaneio</h2>
        <p className="muted">
          Tire uma foto nítida do romaneio inteiro ou envie da galeria.
        </p>
      </div>

      {/* Bloco de imagem — largura total no mobile */}
      <div className="romaneio-import__foto">
        {imagemPreview && !carregandoOCR && (
          <div className="image-preview-wrap">
            <img
              src={imagemPreview}
              alt="Prévia do romaneio"
              className="image-preview"
            />
            <button
              type="button"
              className="image-preview__close"
              onClick={limparPreview}
              aria-label="Remover imagem"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {carregandoOCR && imagemPreview && (
          <div className="image-preview-wrap image-preview-wrap--loading">
            <img
              src={imagemPreview}
              alt="Processando"
              className="image-preview image-preview--dim"
            />
            <div className="image-preview__overlay">
              <Loader2 className="spin" size={32} />
              <span>Lendo imagem… {progressoOCR}%</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressoOCR}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {!imagemPreview && !carregandoOCR && (
          <div className="upload-actions">
            <label className="upload-card upload-card--camera">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImagem}
                hidden
              />
              <Camera size={28} />
              <strong>Tirar foto</strong>
              <span className="muted">Câmera traseira</span>
            </label>

            <label className="upload-card upload-card--gallery">
              <input
                type="file"
                accept="image/*"
                onChange={handleImagem}
                hidden
              />
              <ImagePlus size={28} />
              <strong>Galeria</strong>
              <span className="muted">Escolher imagem salva</span>
            </label>
          </div>
        )}
      </div>

      {/* Texto — abaixo da foto */}
      <div className="import-text-block">
        <label>
          <FileText size={18} /> Ou cole os códigos em texto
        </label>
        <textarea
          placeholder="Cole ou digite. Ex: AN976031285BR"
          value={textoBruto}
          onChange={(e) => setTextoBruto(e.target.value)}
          rows={5}
        />
        <motion.button
          className="btn-primary w-full"
          onClick={handleTexto}
          whileTap={{ scale: 0.98 }}
          type="button"
        >
          Conferir códigos
        </motion.button>
      </div>

      {resultadoPreview && (
        <motion.div
          className="ocr-result"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="ocr-result__stats">
            <div>
              <span>Encontrados</span>
              <strong>{resultadoPreview.encontrados}</strong>
            </div>
            <div className="ok">
              <span>Válidos</span>
              <strong>{resultadoPreview.validos}</strong>
            </div>
            <div className="err">
              <span>Inválidos</span>
              <strong>{resultadoPreview.invalidos}</strong>
            </div>
          </div>
          {resultadoPreview.codigos?.length > 0 && (
            <div className="code-chips">
              {resultadoPreview.codigos.slice(0, 12).map((c) => (
                <span key={c} className="code-chip">
                  {c}
                </span>
              ))}
              {resultadoPreview.codigos.length > 12 && (
                <span className="code-chip muted">
                  +{resultadoPreview.codigos.length - 12}
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}

      <button
        type="button"
        className="btn-link"
        onClick={() => setMostrarFallback((v) => !v)}
      >
        <ClipboardPaste size={16} />
        {mostrarFallback ? "Ocultar" : "Colar texto do Google Lens"}
      </button>

      {mostrarFallback && (
        <motion.div
          className="lens-fallback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <textarea
            placeholder="Cole aqui o texto copiado do Google Lens…"
            value={textoLens}
            onChange={(e) => setTextoLens(e.target.value)}
            rows={4}
          />
          <button type="button" className="btn-secondary w-full" onClick={handleLens}>
            Extrair códigos válidos
          </button>
        </motion.div>
      )}
    </section>
  );
}
