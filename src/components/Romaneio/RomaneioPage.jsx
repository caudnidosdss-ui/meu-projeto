import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Radio,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import ImportStep from "./ImportStep";
import ConfirmStep from "./ConfirmStep";
import BipagemStep from "./BipagemStep";
import FinalizeStep from "./FinalizeStep";
import "../../styles/Romaneio.css";

const STEPS = [
  { id: "importacao", label: "Importar", icon: Package },
  { id: "confirmacao", label: "Conferir", icon: Search },
  { id: "bipagem", label: "Bipagem", icon: Radio },
  { id: "finalizacao", label: "Finalizar", icon: CheckCircle2 },
];

function stepStatus(stepId, etapa, romaneioLength) {
  const order = ["importacao", "confirmacao", "bipagem", "finalizacao"];
  const current = order.indexOf(etapa);
  const step = order.indexOf(stepId);

  if (etapa === stepId) return "active";
  if (step < current) return "done";
  if (stepId === "importacao" && romaneioLength > 0 && etapa !== "importacao")
    return "done";
  return "";
}

export default function RomaneioPage({ conferencia }) {
  const {
    etapa,
    setEtapa,
    romaneio,
    resetarConferencia,
    finalizarConferencia,
    stats,
    progressPercent,
  } = conferencia;

  return (
    <div className="romaneio-page">
      <header className="page-header">
        <div>
          <span className="mini-title">PAINEL OPERACIONAL</span>
          <h1>Conferência de Romaneio</h1>
        </div>
        <motion.button
          className="btn-ghost"
          onClick={resetarConferencia}
          whileTap={{ scale: 0.97 }}
        >
          <RotateCcw size={18} />
          Reiniciar
        </motion.button>
      </header>

      <nav className="romaneio-stepper" aria-label="Etapas da conferência">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const status = stepStatus(step.id, etapa, romaneio.length);
          return (
            <div key={step.id} className="romaneio-stepper__group">
              <div className={`romaneio-step romaneio-step--${status}`}>
                <div className="romaneio-step__icon">
                  <Icon size={22} />
                </div>
                <span>{step.label}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`romaneio-stepper__line ${
                    status === "done" ? "romaneio-stepper__line--done" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        {etapa === "importacao" && (
          <motion.div
            key="import"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ImportStep conferencia={conferencia} />
          </motion.div>
        )}

        {etapa === "confirmacao" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ConfirmStep conferencia={conferencia} />
          </motion.div>
        )}

        {etapa === "bipagem" && (
          <motion.div
            key="bipagem"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <BipagemStep conferencia={conferencia} />
          </motion.div>
        )}

        {etapa === "finalizacao" && (
          <motion.div
            key="final"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FinalizeStep
              stats={stats}
              progressPercent={progressPercent}
              onVoltar={() => setEtapa("bipagem")}
              onSalvar={finalizarConferencia}
              onNova={resetarConferencia}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
