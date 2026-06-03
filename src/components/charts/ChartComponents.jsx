import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "rgba(255, 255, 255, 0.7)",
        font: { size: 12, weight: "600" },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(2, 6, 23, 0.95)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        labelColor: function (context) {
          return {
            borderColor: context.dataset.borderColor || context.dataset.backgroundColor,
            backgroundColor: context.dataset.borderColor || context.dataset.backgroundColor,
          };
        },
      },
    },
  },
  scales: {
    y: {
      ticks: { color: "rgba(255, 255, 255, 0.5)", font: { size: 11 } },
      grid: { color: "rgba(255, 255, 255, 0.06)", drawBorder: false },
    },
    x: {
      ticks: { color: "rgba(255, 255, 255, 0.5)", font: { size: 11 } },
      grid: { color: "rgba(255, 255, 255, 0.06)", drawBorder: false },
    },
  },
};

/**
 * Line Chart Component
 */
export function RealisticLineChart({
  data = [],
  lines = [
    { key: "percentual", color: "#3b82f6", name: "% Acerto" },
    { key: "corretos", color: "#22c55e", name: "Corretos" },
  ],
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const chartData = {
    labels: data.map((d) => d.nome || ""),
    datasets: lines.map((line) => ({
      label: line.name,
      data: data.map((d) => d[line.key] || 0),
      borderColor: line.color,
      backgroundColor: line.color + "20",
      borderWidth: 2.5,
      fill: false,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: line.color,
      pointBorderColor: "white",
      pointBorderWidth: 2,
    })),
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Line data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
    </div>
  );
}

/**
 * Bar Chart Component
 */
export function RealisticBarChart({
  data = [],
  keys = [
    { key: "acertos", color: "#22c55e", name: "Acertos" },
    { key: "erros", color: "#ef4444", name: "Erros" },
  ],
  labelKey = "dia",
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const chartData = {
    labels: data.map((d) => d[labelKey] || ""),
    datasets: keys.map((k) => ({
      label: k.name,
      data: data.map((d) => d[k.key] || 0),
      backgroundColor: k.color,
      borderColor: k.color,
      borderRadius: 8,
      borderSkipped: false,
    })),
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
    </div>
  );
}

/**
 * Pie Chart Component
 */
export function RealisticPieChart({
  data = [],
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7", "#06b6d4"];

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "rgba(2, 6, 23, 0.95)",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    ...chartOptions,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "right",
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Pie data={chartData} options={pieOptions} />
    </div>
  );
}

/**
 * Doughnut Chart (similar to Pie but with hole in center)
 */
export function RealisticDoughnutChart({
  data = [],
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7", "#06b6d4"];

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "rgba(2, 6, 23, 0.95)",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    ...chartOptions,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Doughnut data={chartData} options={doughnutOptions} />
    </div>
  );
}

/**
 * Horizontal Bar Chart (for rankings)
 */
export function RealisticHBarChart({
  data = [],
  keys = [
    { key: "acertos", color: "#3b82f6", name: "Acertos" },
    { key: "erros", color: "#a855f7", name: "Erros" },
  ],
  labelKey = "operador",
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const chartData = {
    labels: data.map((d) => d[labelKey] || ""),
    datasets: keys.map((k) => ({
      label: k.name,
      data: data.map((d) => d[k.key] || 0),
      backgroundColor: k.color,
      borderColor: k.color,
      borderRadius: 8,
      borderSkipped: false,
    })),
  };

  const hbarOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 12, weight: "600" },
          padding: 16,
        },
      },
      tooltip: chartOptions.plugins.tooltip,
    },
    scales: {
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.5)", font: { size: 11 } },
        grid: { color: "rgba(255, 255, 255, 0.06)" },
      },
      y: {
        ticks: { color: "rgba(255, 255, 255, 0.5)", font: { size: 11 } },
        grid: { drawBorder: false },
      },
    },
  };

  return (
    <div style={{ position: "relative", height: `${height}px` }}>
      <Bar data={chartData} options={hbarOptions} />
    </div>
  );
}
