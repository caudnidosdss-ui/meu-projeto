import "../styles/StatsCircle.css";

export default function StatsCircle({
  title,
  value,
  color = "#38bdf8",
}) {
  return (
    <div className="stats-circle-card">
      <div
        className="stats-circle"
        style={{
          background: `conic-gradient(
            ${color} ${value}%,
            rgba(255,255,255,.06) 0%
          )`,
        }}
      >
        <div className="stats-circle-inner">
          <strong>{value}%</strong>
        </div>
      </div>

      <p>{title}</p>
    </div>
  );
}