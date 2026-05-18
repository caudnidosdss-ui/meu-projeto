import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function CameraScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "camera-scanner",
      {
        fps: 10,
        qrbox: { width: 260, height: 160 },
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="camera-scanner-box">
      <div id="camera-scanner"></div>

      <button className="reset-btn" onClick={onClose}>
        Fechar câmera
      </button>
    </div>
  );
}