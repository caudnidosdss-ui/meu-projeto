import { useRomaneio } from '../context/RomaneioContext';
import './ProgressDisplay.css';

/**
 * Component for displaying real-time progress statistics
 * Shows total items, scanned items, correct/error counts, and completion percentage
 */
const ProgressDisplay = () => {
  const { romaneio, progress } = useRomaneio();

  if (!romaneio.isActive) {
    return (
      <div className="progress-display empty">
        <p>Importe um romaneio para começar a acompanhar o progresso</p>
      </div>
    );
  }

  const totalItems = romaneio.validCodes.length;
  const scannedItems = progress.scannedCodes.length;
  const correctScans = progress.correctScans;
  const errorScans = progress.errorScans;
  const completionPercentage = progress.completionPercentage;

  return (
    <div className="progress-display">
      <div className="progress-header">
        <h3>Progresso em Tempo Real</h3>
      </div>

      <div className="progress-stats">
        <div className="progress-card total">
          <span className="progress-label">Total de Itens</span>
          <span className="progress-value">{totalItems}</span>
        </div>

        <div className="progress-card scanned">
          <span className="progress-label">Itens Bipados</span>
          <span className="progress-value">{scannedItems}</span>
        </div>

        <div className="progress-card correct">
          <span className="progress-label">Itens Corretos</span>
          <span className="progress-value">{correctScans}</span>
        </div>

        <div className="progress-card error">
          <span className="progress-label">Itens com Erro</span>
          <span className="progress-value">{errorScans}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-info">
          <span className="progress-text">Conclusão</span>
          <span className="progress-percentage">
            {completionPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          >
            <span className="progress-fill-text">
              {completionPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div className="progress-details">
        <div className="detail-item">
          <span className="detail-label">Restantes:</span>
          <span className="detail-value">{totalItems - scannedItems}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Taxa de Acerto:</span>
          <span className="detail-value">
            {scannedItems > 0
              ? ((correctScans / scannedItems) * 100).toFixed(1)
              : 0}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;
