import { useState } from 'react';
import { useRomaneio } from '../context/RomaneioContext';

/**
 * Component for text paste only
 */
const RomaneioInput = () => {
  const { processText, loading } = useRomaneio();
  const [text, setText] = useState('');

  const handleTextSubmit = () => {
    if (text.trim()) {
      processText(text);
      setText('');
    }
  };

  return (
    <div className="romaneio-input">
      <div className="input-section">
        <h3>Colar Texto</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole os códigos de romaneio aqui..."
          rows={6}
          disabled={loading}
        />
        <button
          onClick={handleTextSubmit}
          disabled={loading || !text.trim()}
          className="btn-primary"
        >
          {loading ? 'Processando...' : 'Processar Texto'}
        </button>
      </div>
    </div>
  );
};

export default RomaneioInput;
