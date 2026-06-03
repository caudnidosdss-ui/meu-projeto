import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock } from "lucide-react";
import "../styles/PLPChecklist.css";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Conferir arquivos PLP",
    description: "Verificar se a PLP está completa e sem divergências.",
    done: false,
  },
  {
    id: 2,
    title: "Validar transportadora",
    description: "Confirmar dados de frete, peso e volumes.",
    done: false,
  },
  {
    id: 3,
    title: "Liberar checklist final",
    description: "Marcar como pronto após conferência completa.",
    done: false,
  },
];

export default function PLPChecklist() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks]
  );

  const pendingCount = tasks.length - completedCount;
  const progressPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const handleAddTask = (event) => {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        description: "Tarefa adicionada pelo usuário.",
        done: false,
      },
    ]);
    setNewTask("");
  };

  const toggleTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const removeTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks((current) => current.filter((task) => !task.done));
  };

  return (
    <motion.div
      className="plp-checklist-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="page-header">
        <div>
          <span className="mini-title">PLP CHECKLIST</span>
          <h1>Gestao de tarefas operacionais</h1>
        </div>
      </div>

      {/* Stat Cards - Top Row */}
      <div className="plp-stats-grid">
        <motion.div
          className="stat-card stat-card--primary"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-card__header">
            <CheckCircle2 size={24} className="stat-icon" />
            <span className="stat-label">Concluidos</span>
          </div>
          <div className="stat-card__value">{completedCount}</div>
          <div className="stat-card__subtitle">Tarefas finalizadas</div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--warning"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-card__header">
            <Clock size={24} className="stat-icon" />
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="stat-card__value">{pendingCount}</div>
          <div className="stat-card__subtitle">Itens em aberto</div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--info"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-card__header">
            <AlertCircle size={24} className="stat-icon" />
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card__value">{tasks.length}</div>
          <div className="stat-card__subtitle">Checklist completo</div>
        </motion.div>

        <motion.div
          className="stat-card stat-card--progress"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-card__header">
            <span className="stat-label">Progresso</span>
          </div>
          <div className="stat-card__value">{progressPercent}%</div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="plp-content-grid">
        {/* Checklist Panel */}
        <section className="glass-panel plp-panel-checklist">
          <div className="panel-header">
            <div>
              <h2>Checklist de conferencia</h2>
              <p>Adicione e acompanhe os itens necessarios para a PLP.</p>
            </div>
          </div>

          <form className="checklist-form" onSubmit={handleAddTask}>
            <div className="form-input-group">
              <input
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="Adicionar novo item..."
                aria-label="Adicionar novo item"
              />
              <motion.button
                type="submit"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} />
                Adicionar
              </motion.button>
            </div>
          </form>

          <div className="checklist-actions">
            {completedCount > 0 && (
              <motion.button
                type="button"
                className="btn-secondary"
                onClick={clearCompleted}
                whileHover={{ scale: 1.02 }}
              >
                Limpar concluidos ({completedCount})
              </motion.button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="checklist-empty">
              <CheckCircle2 size={40} />
              <p>Nao ha tarefas no checklist.</p>
              <span>Comece adicionando um novo item acima.</span>
            </div>
          ) : (
            <div className="checklist-list">
              <AnimatePresence>
                {tasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    className={`checklist-item ${task.done ? "done" : ""}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                  >
                    <motion.button
                      type="button"
                      className="checklist-checkbox"
                      onClick={() => toggleTask(task.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={
                        task.done
                          ? "Marcar como pendente"
                          : "Marcar como concluida"
                      }
                    >
                      {task.done && <CheckCircle2 size={20} />}
                    </motion.button>

                    <div className="checklist-content">
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                    </div>

                    <motion.button
                      type="button"
                      className="checklist-delete"
                      onClick={() => removeTask(task.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remover tarefa"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Summary Panel */}
        <aside className="glass-panel plp-panel-summary">
          <div className="panel-header">
            <h2>Resumo operacional</h2>
            <p>Status consolidado da conferencia</p>
          </div>

          {/* Progress Ring */}
          <div className="summary-progress-ring">
            <motion.svg
              viewBox="0 0 120 120"
              className="progress-svg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(75, 85, 99, 0.3)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercent / 100)}`}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 50 * (1 - progressPercent / 100),
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--success-neon)" />
                  <stop offset="100%" stopColor="var(--accent-blue-neon)" />
                </linearGradient>
              </defs>
            </motion.svg>

            <div className="progress-ring-content">
              <motion.div
                className="progress-value"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {progressPercent}%
              </motion.div>
              <motion.div
                className="progress-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Completo
              </motion.div>
            </div>
          </div>

          {/* Summary Blocks */}
          <div className="summary-blocks">
            <div className="summary-block summary-block--success">
              <span className="block-label">Concluido</span>
              <strong className="block-value">{completedCount}</strong>
            </div>
            <div className="summary-block summary-block--warning">
              <span className="block-label">Pendente</span>
              <strong className="block-value">{pendingCount}</strong>
            </div>
            <div className="summary-block summary-block--info">
              <span className="block-label">Total</span>
              <strong className="block-value">{tasks.length}</strong>
            </div>
          </div>

          <div className="summary-note">
            <p>
              Atualize os itens diariamente para manter o fluxo de corte em
              conformidade com as metas operacionais.
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
