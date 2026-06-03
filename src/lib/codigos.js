export const CODIGO_EXATO_REGEX = /^AN\d{9}BR$/;
export const CODIGO_OCR_REGEX =
  /A\s*N[\s\-_.:/\\|]*(?:[0-9Oº°Il|]\s*[\s\-_.:/\\|]*){9}B\s*R/gi;

export function normalizarCodigo(codigo) {
  return String(codigo || "")
    .toUpperCase()
    .replace(/O/g, "0")
    .replace(/º/g, "0")
    .replace(/°/g, "0")
    .replace(/[Il|]/g, "1")
    .replace(/[^A-Z0-9]/g, "");
}

export function formatarCodigo(codigo) {
  const n = normalizarCodigo(codigo);
  if (!CODIGO_EXATO_REGEX.test(n)) return n;
  return n;
}

export function extrairCodigosDoTexto(texto) {
  const bruto = String(texto || "").toUpperCase();
  const encontrados = [];

  const matchesFlexiveis = bruto.match(CODIGO_OCR_REGEX) || [];
  matchesFlexiveis.forEach((item) => {
    const codigo = normalizarCodigo(item);
    if (CODIGO_EXATO_REGEX.test(codigo)) {
      encontrados.push(codigo);
    }
  });

  const textoSemSeparadores = normalizarCodigo(bruto);
  const matchesJuntos = textoSemSeparadores.match(/AN\d{9}BR/g) || [];
  matchesJuntos.forEach((codigo) => {
    if (CODIGO_EXATO_REGEX.test(codigo)) {
      encontrados.push(codigo);
    }
  });

  return [...new Set(encontrados)];
}

export function analisarTexto(texto) {
  const validos = extrairCodigosDoTexto(texto);
  const bruto = normalizarCodigo(texto);
  const candidatos = bruto.match(/AN[A-Z0-9]{9,12}BR/g) || [];
  const invalidos = candidatos
    .map(normalizarCodigo)
    .filter((c) => !CODIGO_EXATO_REGEX.test(c) && c.startsWith("AN"));

  return {
    validos,
    invalidos: [...new Set(invalidos.filter((c) => !validos.includes(c)))],
    totalEncontrado: validos.length + invalidos.length,
    totalValido: validos.length,
    totalInvalido: invalidos.length,
  };
}

export function isCodigoValido(codigo) {
  return CODIGO_EXATO_REGEX.test(normalizarCodigo(codigo));
}
