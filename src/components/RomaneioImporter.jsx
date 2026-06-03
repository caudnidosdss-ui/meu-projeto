import { useRomaneio } from '../context/RomaneioContext';
import RomaneioInput from './RomaneioInput';
import RomaneioDisplay from './RomaneioDisplay';
import './RomaneioImporter.css';

/**
 * Main component for romaneio import functionality
 * Integrates input and display components
 */
const RomaneioImporter = () => {
  const { error, loading } = useRomaneio();

  return (
    <div className="romaneio-importer">
      <div className="importer-header">
        <h2>Importador de Romaneio</h2>
        <p className="subtitle">
          Importe códigos de romaneio no formato ANXXXXXXXXXBR
        </p>
      </div>

      {error && (
        <div className="error-message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <span>Processando...</span>
        </div>
      )}

      <div className="importer-content">
        <RomaneioInput />
        <RomaneioDisplay />
      </div>
    </div>
  );
};

export default RomaneioImporter;
