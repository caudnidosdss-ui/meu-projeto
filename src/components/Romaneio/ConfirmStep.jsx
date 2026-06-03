import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function ConfirmStep({ conferencia }) {
  const { romaneio, confirmarRomaneio, resetarConferencia } = conferencia;

  return (
    <section className="glass-panel">
      <div className="progress-header">
        <div>
          <h2>
            <CheckCircle2 size={24} className="inline-icon-svg" /> Conferir
            Romaneio
          </h2>
          <p className="muted">
            <AnimatedCounter value={romaneio.length} /> códigos únicos
            encontrados
          </p>
        </div>
        <strong className="neon-blue">
          <AnimatedCounter value={romaneio.length} />
        </strong>
      </div>

      <div className="code-chips code-chips--scroll">
        {romaneio.map((codigo, i) => (
          <motion.span
            key={codigo}
            className="code-chip code-chip--valid"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(i * 0.02, 0.5) }}
          >
            {codigo}
          </motion.span>
        ))}
      </div>

      <div className="romaneio-actions">
        <button type="button" className="btn-ghost" onClick={resetarConferencia}>
          <ArrowLeft size={18} />
          Voltar
        </button>
        <motion.button
          type="button"
          className="btn-primary"
          onClick={confirmarRomaneio}
          whileTap={{ scale: 0.98 }}
        >
          Confirmar Romaneio
        </motion.button>
      </div>
    </section>
  );
}
