import { useRomaneio } from '../context/RomaneioContext';

/**
 * Component for displaying extracted codes and statistics
 */
const RomaneioDisplay = () => {
  const { romaneio, clearRomaneio } = useRomaneio();

  if (!romaneio.isActive) {
    return (
      <div className="romaneio-display empty">
        <p>Nenhum romaneio ativo. Importe códigos para começar.</p>
      </div>
    );
  }

  const { validCodes, invalidCodes, stats } = romaneio;

  return (
    <div className="romaneio-display">
      <div className="display-header">
        <h3>Romaneio Ativo</h3>
        <button onClick={clearRomaneio} className="btn-secondary">
          Limpar
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Extraído</span>
          <span className="stat-value">{stats.totalExtracted}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Únicos</span>
          <span className="stat-value">{stats.unique}</span>
        </div>
        <div className="stat-card valid">
          <span className="stat-label">Válidos</span>
          <span className="stat-value">{stats.valid}</span>
        </div>
        <div className="stat-card invalid">
          <span className="stat-label">Inválidos</span>
          <span className="stat-value">{stats.invalid}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Duplicados Removidos</span>
          <span className="stat-value">{stats.duplicatesRemoved}</span>
        </div>
      </div>

      <div className="codes-section">
        <div className="codes-container">
          <h4>Códigos Válidos ({validCodes.length})</h4>
          {validCodes.length > 0 ? (
            <div className="codes-list">
              {validCodes.map((code, index) => (
                <span key={index} className="code-tag valid">
                  {code}
                </span>
              ))}
            </div>
          ) : (
            <p className="empty-message">Nenhum código válido encontrado</p>
          )}
        </div>

        {invalidCodes.length > 0 && (
          <div className="codes-container">
            <h4>Códigos Inválidos ({invalidCodes.length})</h4>
            <div className="codes-list">
              {invalidCodes.map((code, index) => (
                <span key={index} className="code-tag invalid">
                  {code}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RomaneioDisplay;
