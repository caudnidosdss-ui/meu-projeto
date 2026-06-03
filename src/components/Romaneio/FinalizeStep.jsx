import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import StatCard from "../ui/StatCard";
import AnimatedCounter from "../ui/AnimatedCounter";
import {
  Package,
  ScanLine,
  Target,
  XCircle,
  Clock,
} from "lucide-react";

export default function FinalizeStep({
  stats,
  progressPercent,
  onVoltar,
  onSalvar,
  onNova,
}) {
  const [salvando, setSalvando] = useState(false);
  const aprovado = stats.divergentes === 0 && stats.pendentes === 0;

  async function handleSalvar() {
    setSalvando(true);
    const res = await onSalvar();
    setSalvando(false);
    if (res?.ok) {
      alert("Conferência salva no Supabase.");
    } else {
      alert("Erro ao salvar no Supabase.");
    }
  }

  return (
    <section className="glass-panel final-panel">
      <div className="final-header">
        {aprovado ? (
          <CheckCircle2 size={48} className="text-success" />
        ) : (
          <AlertTriangle size={48} className="text-warning" />
        )}
        <h2>
          {aprovado
            ? "Conferência Aprovada"
            : "Conferência com Divergências"}
        </h2>
        <p className="muted">
          Produtividade: <strong>{progressPercent}%</strong> — Confira o resumo
          antes de salvar.
        </p>
      </div>

      <section className="stats-grid stats-grid--compact">
        <StatCard
          icon={Package}
          label="Romaneio"
          value={<AnimatedCounter value={stats.totalRomaneio} />}
        />
        <StatCard
          icon={ScanLine}
          label="Bipados"
          value={<AnimatedCounter value={stats.totalBipado} />}
        />
        <StatCard
          icon={Target}
          label="Corretos"
          value={<AnimatedCounter value={stats.corretos} />}
          tone="success"
        />
        <StatCard
          icon={XCircle}
          label="Divergentes"
          value={<AnimatedCounter value={stats.divergentes} />}
          tone="error"
        />
        <StatCard
          icon={Clock}
          label="Pendentes"
          value={<AnimatedCounter value={stats.pendentes} />}
          tone="warning"
        />
      </section>

      <div className="final-actions">
        <button type="button" className="btn-ghost" onClick={onVoltar}>
          Voltar
        </button>
        <motion.button
          type="button"
          className="btn-primary"
          onClick={handleSalvar}
          disabled={salvando}
          whileTap={{ scale: 0.98 }}
        >
          {salvando ? (
            <>
              <Loader2 className="spin" size={18} /> Salvando…
            </>
          ) : (
            "Salvar Conferência"
          )}
        </motion.button>
        <button type="button" className="btn-ghost" onClick={onNova}>
          Nova Conferência
        </button>
      </div>
    </section>
  );
}
