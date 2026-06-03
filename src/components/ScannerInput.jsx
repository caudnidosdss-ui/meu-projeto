import { useState, useEffect, useRef, useCallback } from 'react';
import { useRomaneio } from '../context/RomaneioContext';
import { audioService } from '../services/audioService';

/**
 * Scanner input component with keyboard wedge support
 * Maintains auto-focus and continuous reading
 */
const ScannerInput = ({ onScan }) => {
  const { romaneio, recordScan } = useRomaneio();
  const [inputValue, setInputValue] = useState('');
  const [lastScanned, setLastScanned] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, success, error
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize audio on first user interaction
  const initAudio = useCallback(() => {
    audioService.init();
  }, []);

  // Maintain auto-focus
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    const interval = setInterval(focusInput, 100);

    return () => clearInterval(interval);
  }, []);

  // Reset scan status after delay
  useEffect(() => {
    if (scanStatus !== 'idle') {
      timeoutRef.current = setTimeout(() => {
        setScanStatus('idle');
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scanStatus]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Scanner typically sends complete code followed by Enter
    // Check if value ends with newline or if it's a complete scan
    if (value.includes('\n') || value.includes('\r')) {
      const code = value.trim().replace(/[\n\r]/g, '');
      if (code) {
        processScan(code);
      }
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    initAudio();

    // Handle Enter key (scanner typically sends Enter after code)
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = inputValue.trim();
      if (code) {
        processScan(code);
      }
      setInputValue('');
    }
  };

  const processScan = useCallback(
    (code) => {
      // Avoid duplicate reading of the same code
      if (code === lastScanned) {
        return;
      }

      setLastScanned(code);

      // Validate against active romaneio
      if (!romaneio.isActive) {
        setScanStatus('error');
        audioService.playError();
        if (onScan) {
          onScan({ code, status: 'error', message: 'Nenhum romaneio ativo' });
        }
        return;
      }

      const isValid = romaneio.validCodes.includes(code);

      if (isValid) {
        setScanStatus('success');
        audioService.playSuccess();
        const scanData = { code, status: 'success', message: 'Código válido' };
        if (onScan) {
          onScan(scanData);
        }
        // Emit custom event for ScannerDisplay
        window.dispatchEvent(new CustomEvent('scan', { detail: scanData }));
        // Record scan in progress
        recordScan(code, true);
      } else {
        setScanStatus('error');
        audioService.playError();
        const scanData = { code, status: 'error', message: 'Código não encontrado no romaneio' };
        if (onScan) {
          onScan(scanData);
        }
        // Emit custom event for ScannerDisplay
        window.dispatchEvent(new CustomEvent('scan', { detail: scanData }));
        // Record scan in progress
        recordScan(code, false);
      }

      // Reset last scanned after a delay to allow re-scanning
      setTimeout(() => {
        setLastScanned(null);
      }, 2000);
    },
    [romaneio, lastScanned, onScan, recordScan]
  );

  const handleFocus = () => {
    initAudio();
  };

  return (
    <div className="scanner-input">
      <div className="scanner-header">
        <h3>Scanner de Bipagem</h3>
        <span className={`status-indicator ${scanStatus}`}>
          {scanStatus === 'idle' && 'Aguardando leitura...'}
          {scanStatus === 'success' && '✔ Válido'}
          {scanStatus === 'error' && '❌ Inválido'}
        </span>
      </div>

      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Posicione o scanner aqui..."
          className={`scanner-field ${scanStatus}`}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <div className="input-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
          </svg>
        </div>
      </div>

      <div className="scanner-info">
        <p>
          <small>O input mantém foco automático para leitura contínua</small>
        </p>
      </div>
    </div>
  );
};

export default ScannerInput;
