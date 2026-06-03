import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ScanLine,
  Target,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import StatCard from "../ui/StatCard";
import AnimatedCounter from "../ui/AnimatedCounter";

export default function BipagemStep({ conferencia }) {
  const {
    stats,
    progressPercent,
    produtividade,
    codigoBipado,
    setCodigoBipado,
    biparCodigo,
    bipagens,
    romaneio,
    setEtapa,
    ultimoFeedback,
  } = conferencia;

  const inputClass =
    ultimoFeedback?.tipo === "ok"
      ? "scan-input scan-input--ok"
      : ultimoFeedback?.tipo === "erro"
      ? "scan-input scan-input--error"
      : "scan-input";

  return (
    <>
      <section className="stats-grid">
        <StatCard
          icon={Package}
          label="Total Romaneio"
          value={<AnimatedCounter value={stats.totalRomaneio} />}
          delay={0}
        />
        <StatCard
          icon={ScanLine}
          label="Total Bipado"
          value={<AnimatedCounter value={stats.totalBipado} />}
          delay={0.05}
        />
        <StatCard
          icon={Target}
          label="Corretos"
          value={<AnimatedCounter value={stats.corretos} />}
          tone="success"
          delay={0.1}
        />
        <StatCard
          icon={XCircle}
          label="Divergentes"
          value={<AnimatedCounter value={stats.divergentes} />}
          tone="error"
          delay={0.15}
        />
        <StatCard
          icon={Clock}
          label="Pendentes"
          value={<AnimatedCounter value={stats.pendentes} />}
          tone="warning"
          delay={0.2}
        />
        <StatCard
          icon={TrendingUp}
          label="Produtividade"
          value={`${produtividade}%`}
          tone="purple"
          delay={0.25}
        />
      </section>

      <section className="content-grid">
        <div className="glass-panel scanner-panel">
          <div className="progress-header">
            <div>
              <h2>Aguardando Leitura</h2>
              <p className="muted">
                <AnimatedCounter value={progressPercent} />% concluído
              </p>
            </div>
            <strong className="neon-blue">
              {stats.corretos}/{stats.totalRomaneio}
            </strong>
          </div>

          <div className="progress-bar progress-bar--lg">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 60 }}
            />
          </div>

          <div className="scanner-box">
            <p className="scanner-title">Bipe o código do pacote</p>
            <input
              className={inputClass}
              placeholder="AN123456789BR"
              value={codigoBipado}
              autoFocus
              onChange={(e) => setCodigoBipado(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") biparCodigo();
              }}
            />
            <motion.button
              className="btn-primary scan-btn"
              onClick={biparCodigo}
              whileTap={{ scale: 0.97 }}
            >
              Bipar Código
            </motion.button>
          </div>

          <button
            type="button"
            className="btn-primary finish-btn w-full"
            onClick={() => setEtapa("finalizacao")}
          >
            Finalizar Conferência
          </button>
        </div>

        <div className="glass-panel">
          <h2>Últimas Leituras</h2>
          <div className="list">
            <AnimatePresence>
              {bipagens.length === 0 && (
                <p className="muted">Nenhum código bipado ainda.</p>
              )}
              {bipagens.map((item) => {
                const correto = romaneio.includes(item.codigo);
                return (
                  <motion.div
                    key={`${item.codigo}-${item.hora}`}
                    className={`list-item list-item--${correto ? "ok" : "error"}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <div>
                      <strong>{item.codigo}</strong>
                      <p>{item.hora}</p>
                    </div>
                    <span
                      className={correto ? "badge-ok" : "badge-error"}
                    >
                      {correto ? "OK" : "ERRO"}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
