import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  ScanLine,
  Target,
  XCircle,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import "../styles/Dashboard.css";
import StatCard from "./ui/StatCard";
import AnimatedCounter from "./ui/AnimatedCounter";
import {
  RealisticLineChart,
  RealisticBarChart,
  RealisticPieChart,
  RealisticHBarChart,
} from "./charts/ChartComponents";
import {
  RadarChart,
  RadialChart,
  MetricsRadarChart,
} from "./charts/AdvancedCharts";

function parseDataBR(dataStr) {
  if (!dataStr) return null;
  const partes = String(dataStr).split(",")[0]?.trim();
  const d = new Date(partes);
  return Number.isNaN(d.getTime()) ? null : d;
}

export default function Dashboard({ historico = [], usuarios = [] }) {
  const totais = useMemo(() => {
    const totalRomaneios = historico.length;
    const totalBipagens = historico.reduce((a, i) => a + (i.totalBipado || 0), 0);
    const totalErros = historico.reduce((a, i) => a + (i.divergentes || 0), 0);
    const totalAcertos = historico.reduce((a, i) => a + (i.corretos || 0), 0);
    const totalObjetos = historico.reduce((a, i) => a + (i.totalRomaneio || 0), 0);
    const produtividade =
      totalObjetos === 0
        ? 0
        : Math.round((totalAcertos / totalObjetos) * 100);

    return {
      totalRomaneios,
      totalBipagens,
      totalErros,
      totalAcertos,
      totalObjetos,
      produtividade,
    };
  }, [historico]);

  const porDia = useMemo(() => {
    const map = {};
    historico.forEach((item) => {
      const d = parseDataBR(item.data);
      const chave = d
        ? d.toLocaleDateString("pt-BR")
        : String(item.data).split(",")[0] || "—";
      if (!map[chave]) {
        map[chave] = { dia: chave, conferencias: 0, acertos: 0, erros: 0 };
      }
      map[chave].conferencias += 1;
      map[chave].acertos += item.corretos || 0;
      map[chave].erros += item.divergentes || 0;
    });
    return Object.values(map).slice(0, 14);
  }, [historico]);

  const porOperador = useMemo(() => {
    const map = {};
    historico.forEach((item) => {
      const op = item.operador || "Desconhecido";
      if (!map[op]) {
        map[op] = { operador: op, conferencias: 0, acertos: 0, erros: 0 };
      }
      map[op].conferencias += 1;
      map[op].acertos += item.corretos || 0;
      map[op].erros += item.divergentes || 0;
    });
    return Object.values(map);
  }, [historico]);

  const pizzaData = useMemo(() => {
    const items = [
      { name: "Acertos", value: totais.totalAcertos },
      { name: "Erros", value: totais.totalErros },
    ];
    const pendentes = Math.max(
      0,
      totais.totalObjetos - totais.totalAcertos - totais.totalErros
    );
    if (pendentes > 0) {
      items.push({ name: "Pendentes", value: pendentes });
    }
    if (items.every((i) => i.value === 0)) {
      return [{ name: "Sem dados", value: 1 }];
    }
    return items;
  }, [totais]);

  const linhaHistorico = useMemo(() => {
    return [...historico]
      .slice(0, 12)
      .reverse()
      .map((item, idx) => ({
        nome: `#${idx + 1}`,
        percentual: item.percentual || 0,
        corretos: item.corretos || 0,
      }));
  }, [historico]);

  const radarData = useMemo(() => {
    const map = {};
    historico.slice(0, 6).forEach((item) => {
      const d = parseDataBR(item.data);
      const chave = d
        ? d.toLocaleDateString("pt-BR", { month: "long" })
        : String(item.data).split(",")[0] || "—";
      if (!map[chave]) {
        map[chave] = { nome: chave, desktop: 0, mobile: 0 };
      }
      map[chave].desktop += item.corretos || 0;
      map[chave].mobile += item.divergentes || 0;
    });
    return Object.values(map).length > 0
      ? Object.values(map)
      : [
          { nome: "Jan", desktop: 90, mobile: 70 },
          { nome: "Fev", desktop: 85, mobile: 80 },
          { nome: "Mar", desktop: 92, mobile: 88 },
        ];
  }, [historico]);

  const metricsComparacao = useMemo(() => {
    return porOperador.slice(0, 4).map((op) => ({
      nome: op.operador,
      Acertos: op.acertos,
      Erros: op.erros,
      Conferencias: op.conferencias,
    }));
  }, [porOperador]);

  return (
    <div className="dashboard-page">
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="mini-title">PAINEL EXECUTIVO</span>
          <h1>Dashboard Operacional</h1>
          <p className="muted">
            Indicadores em tempo real da operação de conferência
          </p>
        </div>
        <div className="live-indicator">
          <Activity size={16} />
          <span>Ao vivo</span>
        </div>
      </motion.header>

      <section className="dashboard-kpis">
        <StatCard
          icon={Package}
          label="Total Romaneios"
          value={<AnimatedCounter value={totais.totalRomaneios} />}
        />
        <StatCard
          icon={ScanLine}
          label="Total Bipagens"
          value={<AnimatedCounter value={totais.totalBipagens} />}
        />
        <StatCard
          icon={Target}
          label="Total Acertos"
          value={<AnimatedCounter value={totais.totalAcertos} />}
          tone="success"
        />
        <StatCard
          icon={XCircle}
          label="Total Erros"
          value={<AnimatedCounter value={totais.totalErros} />}
          tone="error"
        />
        <StatCard
          icon={TrendingUp}
          label="Produtividade"
          value={`${totais.produtividade}%`}
          tone="purple"
        />
        <StatCard
          icon={Users}
          label="Usuários"
          value={usuarios.length}
        />
      </section>

      <div className="charts-grid">
        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3>Evolução por conferência</h3>
          <RealisticLineChart data={linhaHistorico} height={300} />
        </motion.div>

        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3>Estatísticas por dia</h3>
          <RealisticBarChart data={porDia} labelKey="dia" height={300} />
        </motion.div>

        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3>Distribuição geral</h3>
          <RealisticPieChart data={pizzaData} height={300} />
        </motion.div>

        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3>Por operador</h3>
          <RealisticHBarChart data={porOperador} labelKey="operador" height={350} />
        </motion.div>
      </div>

      <div className="charts-grid-advanced">
        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3>Análise Comparativa (Radar)</h3>
          <RadarChart data={radarData} height={300} />
        </motion.div>

        <motion.div className="chart-card glass-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3>Performance por Operador</h3>
          <MetricsRadarChart data={metricsComparacao} height={300} />
        </motion.div>
      </div>

      <section className="glass-panel">
        <h2>Últimas conferências</h2>
        <div className="history-list">
          {historico.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma conferência salva ainda.
            </div>
          ) : (
            historico.slice(0, 10).map((item) => (
              <motion.div
                className="history-card"
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
              >
                <div className="history-user">
                  <div className="history-avatar">
                    {item.operador?.charAt(0)?.toUpperCase() || "O"}
                  </div>
                  <div>
                    <strong>{item.operador}</strong>
                    <p>{item.data}</p>
                    <p className="muted">{item.cargo}</p>
                  </div>
                </div>
                <div className="history-metrics">
                  <span>{item.totalRomaneio} objetos</span>
                  <span className="ok">{item.corretos} corretos</span>
                  <span className="error">{item.divergentes} erros</span>
                  <span className="blue">{item.percentual}%</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
