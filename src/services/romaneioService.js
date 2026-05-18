/**
 * Service layer for romaneio code processing
 * Handles validation, parsing, and deduplication of romaneio codes
 */

const ROMANEIO_REGEX = /AN\d{9}BR/g;

/**
 * Extract valid romaneio codes from text using regex
 * @param {string} text - Input text to search for codes
 * @returns {string[]} Array of valid romaneio codes
 */
export const extractValidCodes = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const matches = text.match(ROMANEIO_REGEX);
  return matches ? [...matches] : [];
};

/**
 * Remove duplicate codes from array
 * @param {string[]} codes - Array of codes
 * @returns {string[]} Array of unique codes
 */
export const removeDuplicates = (codes) => {
  return [...new Set(codes)];
};

/**
 * Validate if a code matches the romaneio pattern
 * @param {string} code - Code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidCode = (code) => {
  return /^AN\d{9}BR$/.test(code);
};

/**
 * Separate valid and invalid codes
 * @param {string[]} codes - Array of codes to validate
 * @returns {Object} Object with valid and invalid arrays
 */
export const validateCodes = (codes) => {
  const valid = [];
  const invalid = [];

  codes.forEach((code) => {
    if (isValidCode(code)) {
      valid.push(code);
    } else {
      invalid.push(code);
    }
  });

  return { valid, invalid };
};

/**
 * Process text input: extract, validate, and deduplicate codes
 * @param {string} text - Raw input text
 * @returns {Object} Object with valid codes, invalid codes, and stats
 */
export const processTextInput = (text) => {
  const extractedCodes = extractValidCodes(text);
  const uniqueCodes = removeDuplicates(extractedCodes);
  const { valid, invalid } = validateCodes(uniqueCodes);

  return {
    valid,
    invalid,
    stats: {
      totalExtracted: extractedCodes.length,
      unique: uniqueCodes.length,
      valid: valid.length,
      invalid: invalid.length,
      duplicatesRemoved: extractedCodes.length - uniqueCodes.length,
    },
  };
};

/**
 * Parse CSV file content
 * @param {string} content - CSV file content
 * @returns {string[]} Array of all values from CSV
 */
export const parseCSV = (content) => {
  const lines = content.split(/\r?\n/);
  const values = [];

  lines.forEach((line) => {
    // Split by comma and trim whitespace
    const rowValues = line.split(',').map((val) => val.trim());
    values.push(...rowValues);
  });

  return values.filter((val) => val.length > 0);
};

/**
 * Parse TXT file content
 * @param {string} content - TXT file content
 * @returns {string[]} Array of lines from TXT
 */
export const parseTXT = (content) => {
  const lines = content.split(/\r?\n/);
  return lines.map((line) => line.trim()).filter((line) => line.length > 0);
};

/**
 * Process file content based on file type
 * @param {string} content - File content
 * @param {string} fileType - File type ('txt' or 'csv')
 * @returns {Object} Processed result with valid codes, invalid codes, and stats
 */
export const processFileContent = (content, fileType) => {
  let parsedValues = [];

  if (fileType === 'csv') {
    parsedValues = parseCSV(content);
  } else if (fileType === 'txt') {
    parsedValues = parseTXT(content);
  }

  const text = parsedValues.join(' ');
  return processTextInput(text);
};

/**
 * Read file as text
 * @param {File} file - File object to read
 * @returns {Promise<string>} Promise resolving to file content
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

/**
 * Process uploaded file
 * @param {File} file - File object to process
 * @returns {Promise<Object>} Promise resolving to processed result
 */
export const processUploadedFile = async (file) => {
  try {
    const content = await readFileAsText(file);
    const fileType = file.name.split('.').pop().toLowerCase();
    return processFileContent(content, fileType);
  } catch (error) {
    throw new Error(`Erro ao ler arquivo: ${error.message}`);
  }
};
