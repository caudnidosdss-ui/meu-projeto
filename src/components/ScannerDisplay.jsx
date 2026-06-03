import { useState, useEffect } from 'react';

/**
 * Component for displaying real-time scan results
 * Shows recent scans with instant visual feedback
 */
const ScannerDisplay = ({ maxItems = 10 }) => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    const handleScan = (event) => {
      const scanData = event.detail;
      setScans((prev) => {
        const newScan = {
          ...scanData,
          timestamp: new Date(),
          id: Date.now(),
        };
        return [newScan, ...prev].slice(0, maxItems);
      });
    };

    window.addEventListener('scan', handleScan);
    return () => window.removeEventListener('scan', handleScan);
  }, [maxItems]);

  const clearScans = () => {
    setScans([]);
  };

  if (scans.length === 0) {
    return (
      <div className="scanner-display empty">
        <p>Nenhuma leitura realizada</p>
      </div>
    );
  }

  const successCount = scans.filter((s) => s.status === 'success').length;
  const errorCount = scans.filter((s) => s.status === 'error').length;

  return (
    <div className="scanner-display">
      <div className="display-header">
        <h3>Leituras Recentes</h3>
        <button onClick={clearScans} className="btn-clear">
          Limpar
        </button>
      </div>

      <div className="scan-stats">
        <div className="stat success">
          <span className="stat-value">{successCount}</span>
          <span className="stat-label">Válidos</span>
        </div>
        <div className="stat error">
          <span className="stat-value">{errorCount}</span>
          <span className="stat-label">Inválidos</span>
        </div>
      </div>

      <div className="scan-list">
        {scans.map((scan) => (
          <div key={scan.id} className={`scan-item ${scan.status}`}>
            <div className="scan-info">
              <span className="scan-code">{scan.code}</span>
              <span className="scan-time">
                {scan.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="scan-status">
              {scan.status === 'success' ? (
                <span className="status-badge success">✔</span>
              ) : (
                <span className="status-badge error">❌</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScannerDisplay;
