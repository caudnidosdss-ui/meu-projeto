import { motion } from "framer-motion";

export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = "default",
  delay = 0,
}) {
  return (
    <motion.div
      className={`stat-card stat-card--${tone}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {Icon && (
        <div className="stat-card__icon">
          <Icon size={22} />
        </div>
      )}
      <strong className="stat-card__value">{value}</strong>
      <p className="stat-card__label">{label}</p>
    </motion.div>
  );
}
