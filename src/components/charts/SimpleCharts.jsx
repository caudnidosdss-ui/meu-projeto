const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#a855f7", "#06b6d4"];

export function SimpleLineChart({
  data = [],
  lines = [
    { key: "percentual", color: "#3b82f6", name: "% Acerto" },
    { key: "corretos", color: "#22c55e", name: "Corretos" },
  ],
  height = 220,
}) {
  const w = 100;
  const h = 60;
  const padX = 8;
  const padY = 8;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const allValues = data.flatMap((d) => lines.map((l) => Number(d[l.key]) || 0));
  const maxV = Math.max(...allValues, 1);

  const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;

  return (
    <div className="simple-chart">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="simple-chart__svg"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de linhas"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            y1={padY + innerH * (1 - t)}
            x2={w - padX}
            y2={padY + innerH * (1 - t)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.3"
          />
        ))}
        {lines.map((line) => {
          const points = data
            .map((d, i) => {
              const x = padX + (data.length > 1 ? i * xStep : innerW / 2);
              const v = Number(d[line.key]) || 0;
              const y = padY + innerH * (1 - v / maxV);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polyline
              key={line.key}
              points={points}
              fill="none"
              stroke={line.color}
              strokeWidth="1.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="simple-chart__labels">
        {data.map((d, i) => (
          <span key={i}>{d.nome || d.dia || i + 1}</span>
        ))}
      </div>
      <div className="simple-chart__legend">
        {lines.map((l) => (
          <span key={l.key}>
            <i style={{ background: l.color }} />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SimpleBarChart({
  data = [],
  keys = [
    { key: "acertos", color: "#22c55e", name: "Acertos" },
    { key: "erros", color: "#ef4444", name: "Erros" },
  ],
  labelKey = "dia",
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const maxV = Math.max(
    ...data.flatMap((d) => keys.map((k) => Number(d[k.key]) || 0)),
    1
  );

  return (
    <div className="simple-chart simple-chart--bars">
      <div className="bar-groups">
        {data.map((row, i) => (
          <div className="bar-group" key={i}>
            <div className="bar-group__bars">
              {keys.map((k) => {
                const v = Number(row[k.key]) || 0;
                const pct = (v / maxV) * 100;
                return (
                  <div
                    key={k.key}
                    className="bar"
                    style={{
                      height: `${Math.max(pct, 2)}%`,
                      background: k.color,
                    }}
                    title={`${k.name}: ${v}`}
                  />
                );
              })}
            </div>
            <span className="bar-group__label">
              {String(row[labelKey] || "").slice(0, 8)}
            </span>
          </div>
        ))}
      </div>
      <div className="simple-chart__legend">
        {keys.map((k) => (
          <span key={k.key}>
            <i style={{ background: k.color }} />
            {k.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SimpleHBarChart({
  data = [],
  keys = [
    { key: "acertos", color: "#3b82f6", name: "Acertos" },
    { key: "erros", color: "#a855f7", name: "Erros" },
  ],
  labelKey = "operador",
}) {
  if (!data.length) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  const maxV = Math.max(
    ...data.flatMap((d) => keys.map((k) => Number(d[k.key]) || 0)),
    1
  );

  return (
    <div className="simple-chart simple-chart--hbars">
      {data.map((row, i) => (
        <div className="hbar-row" key={i}>
          <span className="hbar-row__label" title={row[labelKey]}>
            {String(row[labelKey] || "").slice(0, 14)}
          </span>
          <div className="hbar-row__track">
            {keys.map((k) => {
              const v = Number(row[k.key]) || 0;
              const pct = (v / maxV) * 100;
              return (
                <div
                  key={k.key}
                  className="hbar-segment"
                  style={{
                    width: `${Math.max(pct, v > 0 ? 2 : 0)}%`,
                    background: k.color,
                  }}
                  title={`${k.name}: ${v}`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="simple-chart__legend">
        {keys.map((k) => (
          <span key={k.key}>
            <i style={{ background: k.color }} />
            {k.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SimplePieChart({ data = [] }) {
  const total = data.reduce((a, d) => a + (Number(d.value) || 0), 0);
  if (!total) {
    return <p className="chart-empty">Sem dados para exibir</p>;
  }

  let angle = -90;
  const slices = data.map((item, i) => {
    const value = Number(item.value) || 0;
    const pct = value / total;
    const sweep = pct * 360;
    const start = angle;
    angle += sweep;
    const end = angle;
    const large = sweep > 180 ? 1 : 0;
    const r = 40;
    const ir = 24;
    const cx = 50;
    const cy = 50;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const ix1 = cx + ir * Math.cos(toRad(end));
    const iy1 = cy + ir * Math.sin(toRad(end));
    const ix2 = cx + ir * Math.cos(toRad(start));
    const iy2 = cy + ir * Math.sin(toRad(start));
    const color =
      item.name === "Sem dados"
        ? "#475569"
        : COLORS[i % COLORS.length];
    const d =
      pct >= 0.999
        ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} L ${cx} ${cy - ir} A ${ir} ${ir} 0 1 0 ${cx} ${cy - ir} Z`
        : `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`;
    return { d, color, name: item.name, value, pct };
  });

  return (
    <div className="simple-chart simple-chart--pie">
      <svg viewBox="0 0 100 100" className="simple-chart__svg-pie" role="img">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} stroke="#0f172a" strokeWidth="0.5" />
        ))}
      </svg>
      <ul className="pie-legend">
        {slices.map((s, i) => (
          <li key={i}>
            <i style={{ background: s.color }} />
            <span>
              {s.name}: <strong>{s.value}</strong> ({Math.round(s.pct * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
