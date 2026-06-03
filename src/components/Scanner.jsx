import ScannerInput from './ScannerInput';
import ScannerDisplay from './ScannerDisplay';
import ProgressDisplay from './ProgressDisplay';
import './Scanner.css';

/**
 * Main scanner component integrating input and display
 * Provides complete bipagem functionality
 */
const Scanner = () => {
  return (
    <div className="scanner">
      <div className="scanner-header">
        <h2>Módulo de Bipagem</h2>
        <p className="subtitle">
          Escaneie códigos para validar contra o romaneio ativo
        </p>
      </div>

      <ProgressDisplay />

      <div className="scanner-content">
        <ScannerInput />
        <ScannerDisplay />
      </div>
    </div>
  );
};

export default Scanner;
