import {
  Chart as ChartJS,
  RadarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/**
 * Radar Chart Component - Similar to shadcn/ui
 */
export function RadarChart({
  data = [],
  metrics = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"],
  datasets = [
    {
      label: "Desktop",
      key: "desktop",
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      label: "Mobile",
      key: "mobile",
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.15)",
    },
  ],
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const chartData = {
    labels: metrics,
    datasets: datasets.map((ds) => ({
      label: ds.label,
      data: data.map((d) => d[ds.key] || 0),
      borderColor: ds.borderColor,
      backgroundColor: ds.backgroundColor,
      borderWidth: 2.5,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: ds.borderColor,
      pointBorderColor: "white",
      pointBorderWidth: 2,
      tension: 0.4,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 12, weight: "600" },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(2, 6, 23, 0.95)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      r: {
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { size: 11 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}

/**
 * Radial Bar Chart Component - Similar to shadcn/ui
 */
export function RadialChart({
  data = [],
  categories = ["Acertos", "Erros", "Pendentes"],
  colors = ["#10b981", "#ef4444", "#f59e0b"],
  height = 280,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  // Criar dataset para radial chart (usando radar como base)
  const chartData = {
    labels: data.map((d) => d.nome || ""),
    datasets: categories.map((cat, idx) => ({
      label: cat,
      data: data.map((d) => d[cat.toLowerCase()] || 0),
      borderColor: colors[idx],
      backgroundColor: colors[idx] + "20",
      borderWidth: 2,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: colors[idx],
      pointBorderColor: "white",
      pointBorderWidth: 1.5,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: undefined,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 12, weight: "600" },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(2, 6, 23, 0.95)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      r: {
        min: 0,
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { size: 10 },
          stepSize: 20,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.06)",
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}

/**
 * Bubble-like Scatter (Radar-based) - Comparação de métricas
 */
export function MetricsRadarChart({
  data = [],
  title = "Comparação de Métricas",
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const labels = Object.keys(data[0] || {}).filter((k) => k !== "nome");
  const chartData = {
    labels,
    datasets: data.map((item, idx) => {
      const colors = [
        { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
        { border: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
        { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
        { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
      ];
      const color = colors[idx % colors.length];

      return {
        label: item.nome,
        data: labels.map((l) => item[l] || 0),
        borderColor: color.border,
        backgroundColor: color.bg,
        borderWidth: 2.5,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color.border,
        pointBorderColor: "white",
        pointBorderWidth: 2,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 12, weight: "600" },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(2, 6, 23, 0.95)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      r: {
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { size: 10 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Radar data={chartData} options={chartOptions} />
    </div>
  );
}
