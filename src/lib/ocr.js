import { extrairCodigosDoTexto } from "./codigos";

function aplicarNitidez(data, width, height) {
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const copy = new Uint8ClampedArray(data);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      let ki = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          sum += copy[idx] * kernel[ki];
          ki++;
        }
      }
      const idx = (y * width + x) * 4;
      const v = Math.max(0, Math.min(255, sum));
      data[idx] = data[idx + 1] = data[idx + 2] = v;
    }
  }
}

function processarPixels(imageData, { brilho = 1.08, contraste = 1.35 } = {}) {
  const { data, width, height } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    let cinza =
      data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    cinza = (cinza - 128) * contraste + 128;
    cinza = cinza * brilho;
    cinza = Math.max(0, Math.min(255, cinza));
    data[i] = data[i + 1] = data[i + 2] = cinza;
  }

  aplicarNitidez(data, width, height);

  for (let i = 0; i < data.length; i += 4) {
    const cinza = data[i];
    const limiar = cinza > 140 ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = limiar;
  }

  return imageData;
}

/** Corrige rotação EXIF (fotos de celular) antes do OCR */
async function carregarImagemOrientada(arquivo) {
  let objectUrl = null;

  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(arquivo, {
        imageOrientation: "from-image",
      });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close?.(),
      };
    } catch {
      /* fallback abaixo */
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    objectUrl = URL.createObjectURL(arquivo);
    img.onload = () =>
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        },
      });
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Erro ao carregar imagem."));
    };
    img.src = objectUrl;
  });
}

export function prepararImagemOCR(arquivo, graus = 0, escala = 2.5) {
  return new Promise(async (resolve, reject) => {
    let loaded;
    try {
      loaded = await carregarImagemOrientada(arquivo);
    } catch (err) {
      reject(err);
      return;
    }

    const { source, width: larguraOriginal, height: alturaOriginal, cleanup } =
      loaded;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (!ctx) {
        reject(new Error("Não foi possível preparar a imagem."));
        return;
      }

      if (graus === 90 || graus === 270) {
        canvas.width = Math.round(alturaOriginal * escala);
        canvas.height = Math.round(larguraOriginal * escala);
      } else {
        canvas.width = Math.round(larguraOriginal * escala);
        canvas.height = Math.round(alturaOriginal * escala);
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((graus * Math.PI) / 180);
      ctx.drawImage(
        source,
        (-larguraOriginal * escala) / 2,
        (-alturaOriginal * escala) / 2,
        larguraOriginal * escala,
        alturaOriginal * escala
      );

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(processarPixels(imageData), 0, 0);

      canvas.toBlob(
        (blob) => {
          cleanup?.();
          resolve(blob || arquivo);
        },
        "image/jpeg",
        0.96
      );
    } catch (err) {
      cleanup?.();
      reject(err);
    }
  });
}

export async function lerImagemComOCR(arquivo, onProgress) {
  const Tesseract = (await import("tesseract.js")).default;
  const rotacoes = [0, 90, 180, 270];
  let todosOsTextos = "";
  let melhorResultado = { validos: [], invalidos: [], totalEncontrado: 0 };

  for (let i = 0; i < rotacoes.length; i += 1) {
    const graus = rotacoes[i];
    const imagem = await prepararImagemOCR(arquivo, graus);

    const resultado = await Tesseract.recognize(imagem, "eng", {
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
      logger: (m) => {
        if (m.status === "recognizing text" && onProgress) {
          const parte = Math.round(m.progress * 25);
          onProgress(Math.min(99, i * 25 + parte));
        }
      },
    });

    todosOsTextos += "\n" + (resultado.data.text || "");
    const codigos = extrairCodigosDoTexto(todosOsTextos);

    if (codigos.length > melhorResultado.validos.length) {
      melhorResultado = {
        validos: codigos,
        invalidos: [],
        totalEncontrado: codigos.length,
        totalValido: codigos.length,
        totalInvalido: 0,
        textoBruto: todosOsTextos,
      };
    }

    if (codigos.length >= 3) {
      onProgress?.(100);
      return melhorResultado;
    }
  }

  onProgress?.(100);
  return {
    ...melhorResultado,
    textoBruto: todosOsTextos,
  };
}
