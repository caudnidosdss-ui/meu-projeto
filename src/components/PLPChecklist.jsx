import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
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

  const cards = [
    {
      label: "Itens da lista",
      value: tasks.length,
      description: "Total de itens cadastrados",
      variant: "default",
    },
    {
      label: "Concluídos",
      value: completedCount,
      description: "Tarefas finalizadas",
      variant: "success",
    },
    {
      label: "Pendentes",
      value: pendingCount,
      description: "Itens ainda em aberto",
      variant: "warning",
    },
    {
      label: "Progresso",
      value: `${progressPercent}%`,
      description: "Checklist consolidado",
      variant: "info",
    },
  ];

  const gravityNodes = [
    { id: 1, label: "Shopee XC", status: "concluido", x: 18, y: 18 },
    { id: 2, label: "Shopee MC", status: "concluido", x: 80, y: 20 },
    { id: 3, label: "Amazon MC", status: "pendente", x: 82, y: 76 },
    { id: 4, label: "Tática MC", status: "concluido", x: 54, y: 88 },
    { id: 5, label: "Portal XC", status: "concluido", x: 14, y: 68 },
  ];

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
          <h1>Visão geral de operação</h1>
        </div>
      </div>

      <div className="plp-checklist-metrics">
        {cards.map((card) => (
          <motion.div
            key={card.label}
            className={`stat-card stat-card--${card.variant}`}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-card__meta">{card.label}</div>
            <div className="stat-card__value">{card.value}</div>
            <p className="stat-card__desc">{card.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="plp-checklist-grid">
        <section className="glass-panel gravity-map-panel">
          <div className="gravity-map-header">
            <div>
              <span className="mini-title">GRAVITY MAP</span>
              <h2>Rede operacional</h2>
            </div>
            <div className="gravity-map-tags">
              <span className="gravity-tag gravity-tag--success">Concluído</span>
              <span className="gravity-tag gravity-tag--warning">Pendente</span>
            </div>
          </div>

          <div className="gravity-map-board">
            <svg className="gravity-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {gravityNodes.map((node) => (
                <line
                  key={`line-${node.id}`}
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke={node.status === "concluido" ? "rgba(16, 185, 129, 0.35)" : "rgba(245, 158, 11, 0.35)"}
                  strokeWidth="0.8"
                />
              ))}
            </svg>
            <div className="gravity-map-center">
              <strong>CORE</strong>
              <span>Sincronização</span>
            </div>
            {gravityNodes.map((node) => (
              <div
                key={node.id}
                className={`gravity-node gravity-node--${node.status}`}
                style={{ top: `${node.y}%`, left: `${node.x}%` }}
              >
                <span>{node.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="glass-panel checklist-panel">
          <div className="checklist-panel-header">
            <div>
              <h2>Checklist de conferência</h2>
              <p>Adicione e acompanhe os itens necessários para a PLP.</p>
            </div>
            <div className="checklist-status-pill">
              <strong>{progressPercent}%</strong>
              <span>Completo</span>
            </div>
          </div>

          <form className="checklist-form" onSubmit={handleAddTask}>
            <input
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Adicionar novo item"
              aria-label="Adicionar novo item"
            />
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              Adicionar
            </button>
          </form>

          <div className="checklist-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={clearCompleted}
              disabled={!completedCount}
            >
              Limpar completos
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="checklist-empty">
              <CheckCircle2 size={32} />
              <p>Não há tarefas no checklist.</p>
            </div>
          ) : (
            <div className="checklist-list">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  className={`checklist-item ${task.done ? "done" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    type="button"
                    className="checklist-toggle"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.done ? "Marcar como pendente" : "Marcar como concluída"
                    }
                  >
                    {task.done ? "✓" : ""}
                  </button>
                  <div className="checklist-content">
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                  </div>
                  <button
                    type="button"
                    className="task-remove"
                    onClick={() => removeTask(task.id)}
                    aria-label="Remover tarefa"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <aside className="glass-panel summary-panel">
          <div className="summary-header">
            <span className="mini-title">RESUMO DA OPERAÇÃO</span>
            <h2>Status consolidado</h2>
          </div>

          <div className="summary-ring">
            <div className="summary-ring__outer">
              <div
                className="summary-ring__fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="summary-ring__text">
                  <strong>{progressPercent}%</strong>
                  <span>Completo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-blocks">
            <div className="summary-block summary-block--success">
              <span>Concluído</span>
              <strong>{completedCount}</strong>
            </div>
            <div className="summary-block summary-block--warning">
              <span>Pendente</span>
              <strong>{pendingCount}</strong>
            </div>
            <div className="summary-block summary-block--info">
              <span>Total</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="summary-note">
            <p>
              Atualize os itens diariamente para manter o fluxo de corte em
              conformidade.
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
