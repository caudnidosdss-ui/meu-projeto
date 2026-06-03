import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#a855f7", "#06b6d4"];

/**
 * Line Chart - Realista com Recharts
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

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="nome"
            stroke="rgba(255,255,255,0.4)"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
            }}
            cursor={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "rgba(255,255,255,0.7)",
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6 }}
              name={line.name}
              isAnimationActive
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Bar Chart - Realista com Recharts
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

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey={labelKey}
            stroke="rgba(255,255,255,0.4)"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
            }}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "rgba(255,255,255,0.7)",
            }}
          />
          {keys.map((k) => (
            <Bar
              key={k.key}
              dataKey={k.key}
              fill={k.color}
              name={k.name}
              radius={[8, 8, 0, 0]}
              isAnimationActive
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Area Chart - Realista com gradiente
 */
export function RealisticAreaChart({
  data = [],
  areas = [
    { key: "acertos", color: "#22c55e", name: "Acertos" },
    { key: "erros", color: "#ef4444", name: "Erros" },
  ],
  height = 300,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            {areas.map((area) => (
              <linearGradient
                key={`gradient-${area.key}`}
                id={`gradient-${area.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={area.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={area.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="nome"
            stroke="rgba(255,255,255,0.4)"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
            }}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "rgba(255,255,255,0.7)",
            }}
          />
          {areas.map((area) => (
            <Area
              key={area.key}
              type="monotone"
              dataKey={area.key}
              fill={`url(#gradient-${area.key})`}
              stroke={area.color}
              strokeWidth={2}
              name={area.name}
              isAnimationActive
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Pie/Donut Chart - Realista com animação
 */
export function RealisticPieChart({
  data = [],
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const CHART_COLORS = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#3b82f6",
    "#a855f7",
    "#06b6d4",
  ];

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
            }}
            formatter={(value) => [`${value}`, "Quantidade"]}
          />
          <Legend
            wrapperStyle={{
              color: "rgba(255,255,255,0.7)",
              paddingTop: "20px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Horizontal Bar Chart - Para ranking de operadores
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

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis type="number" stroke="rgba(255,255,255,0.4)" />
          <YAxis
            type="category"
            dataKey={labelKey}
            stroke="rgba(255,255,255,0.4)"
            width={100}
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(2,6,23,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "white",
            }}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              color: "rgba(255,255,255,0.7)",
            }}
          />
          {keys.map((k) => (
            <Bar
              key={k.key}
              dataKey={k.key}
              fill={k.color}
              name={k.name}
              radius={[0, 8, 8, 0]}
              isAnimationActive
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
