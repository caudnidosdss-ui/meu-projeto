import { createContext, useContext, useState, useCallback } from 'react';
import { processTextInput, processUploadedFile } from '../services/romaneioService';

const RomaneioContext = createContext(null);

/**
 * Romaneio Context Provider
 * Manages global state for active romaneio
 */
export const RomaneioProvider = ({ children }) => {
  const [romaneio, setRomaneio] = useState({
    validCodes: [],
    invalidCodes: [],
    stats: {
      totalExtracted: 0,
      unique: 0,
      valid: 0,
      invalid: 0,
      duplicatesRemoved: 0,
    },
    isActive: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    scannedCodes: [],
    correctScans: 0,
    errorScans: 0,
    completionPercentage: 0,
  });

  /**
   * Set active romaneio from processed data
   */
  const setActiveRomaneio = useCallback((data) => {
    setRomaneio({
      validCodes: data.valid,
      invalidCodes: data.invalid,
      stats: data.stats,
      isActive: true,
    });
    setError(null);
  }, []);

  /**
   * Process text input and set as active romaneio
   */
  const processText = useCallback((text) => {
    try {
      setLoading(true);
      const result = processTextInput(text);
      setActiveRomaneio(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setActiveRomaneio]);

  /**
   * Process uploaded file and set as active romaneio
   */
  const processFile = useCallback(async (file) => {
    try {
      setLoading(true);
      const result = await processUploadedFile(file);
      setActiveRomaneio(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setActiveRomaneio]);

  /**
   * Clear active romaneio
   */
  const clearRomaneio = useCallback(() => {
    setRomaneio({
      validCodes: [],
      invalidCodes: [],
      stats: {
        totalExtracted: 0,
        unique: 0,
        valid: 0,
        invalid: 0,
        duplicatesRemoved: 0,
      },
      isActive: false,
    });
    setProgress({
      scannedCodes: [],
      correctScans: 0,
      errorScans: 0,
      completionPercentage: 0,
    });
    setError(null);
  }, []);

  /**
   * Add codes to existing romaneio
   */
  const addToRomaneio = useCallback((data) => {
    setRomaneio((prev) => {
      const combinedValid = [...new Set([...prev.validCodes, ...data.valid])];
      const combinedInvalid = [...new Set([...prev.invalidCodes, ...data.invalid])];

      return {
        validCodes: combinedValid,
        invalidCodes: combinedInvalid,
        stats: {
          totalExtracted: prev.stats.totalExtracted + data.stats.totalExtracted,
          unique: combinedValid.length + combinedInvalid.length,
          valid: combinedValid.length,
          invalid: combinedInvalid.length,
          duplicatesRemoved:
            prev.stats.duplicatesRemoved + data.stats.duplicatesRemoved,
        },
        isActive: true,
      };
    });
    // Reset progress when romaneio changes
    setProgress({
      scannedCodes: [],
      correctScans: 0,
      errorScans: 0,
      completionPercentage: 0,
    });
    setError(null);
  }, []);

  /**
   * Record a scan and update progress
   */
  const recordScan = useCallback((code, isValid) => {
    setProgress((prev) => {
      const newScannedCodes = [...new Set([...prev.scannedCodes, code])];
      const newCorrectScans = isValid ? prev.correctScans + 1 : prev.correctScans;
      const newErrorScans = isValid ? prev.errorScans : prev.errorScans + 1;
      const totalItems = romaneio.validCodes.length;
      const newCompletionPercentage =
        totalItems > 0 ? (newScannedCodes.length / totalItems) * 100 : 0;

      return {
        scannedCodes: newScannedCodes,
        correctScans: newCorrectScans,
        errorScans: newErrorScans,
        completionPercentage: newCompletionPercentage,
      };
    });
  }, [romaneio.validCodes.length]);

  const value = {
    romaneio,
    loading,
    error,
    progress,
    processText,
    processFile,
    clearRomaneio,
    addToRomaneio,
    recordScan,
  };

  return (
    <RomaneioContext.Provider value={value}>
      {children}
    </RomaneioContext.Provider>
  );
};

/**
 * Hook to use romaneio context
 */
export const useRomaneio = () => {
  const context = useContext(RomaneioContext);
  if (!context) {
    throw new Error('useRomaneio must be used within RomaneioProvider');
  }
  return context;
};
