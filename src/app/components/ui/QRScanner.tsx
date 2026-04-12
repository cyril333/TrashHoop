// src/app/components/ui/QRScanner.tsx
import { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, X, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  mode: 'verify' | 'track';
}

export default function QRScanner({ onScan, onClose, mode }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then(setHasCamera).catch(() => setHasCamera(false));
  }, []);

  useEffect(() => {
    if (!videoRef.current || !hasCamera) return;

    scannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        if (result.data && !isProcessing && result.data !== lastScan) {
          setLastScan(result.data);
          setIsProcessing(true);
          setError(null);
          setScanSuccess(true);

          setTimeout(() => setScanSuccess(false), 1000);

          onScan(result.data);

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(() => {
            setIsProcessing(false);
            setLastScan(null);
          }, 2000);
        }
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      }
    );

    scannerRef.current.start();

    return () => {
      scannerRef.current?.destroy();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasCamera, onScan, isProcessing, lastScan]);

  useEffect(() => {
    if (!hasCamera) {
      setError('No camera found on this device.');
    }
  }, [hasCamera]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#2E7D32]" />
            <h3 className="font-semibold text-[#1A2E1A]">
              {mode === 'verify' ? 'Verify Disposal' : 'Track Collection'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#558B5A] hover:text-[#1A2E1A] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner */}
        <div className="relative aspect-square bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1B5E20] transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />

              {/* Scanning frame */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-[#2E7D32] opacity-40 m-8 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-0.5 bg-[#2E7D32] animate-pulse" />
                </div>

                {/* Corner brackets */}
                <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-[#2E7D32] rounded-tl-lg" />
                <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-[#2E7D32] rounded-tr-lg" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-[#2E7D32] rounded-bl-lg" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-[#2E7D32] rounded-br-lg" />
              </div>

              {/* Success overlay */}
              {scanSuccess && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                </div>
              )}

              {/* Processing overlay */}
              {isProcessing && !scanSuccess && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
                    <span className="text-[#1A2E1A] font-medium">Processing...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-[#E8F5E9]">
          <p className="text-xs text-[#558B5A] text-center">
            {mode === 'verify'
              ? 'Scan QR code on the bin to verify proper waste disposal'
              : 'Scan QR code to mark collection as completed'}
          </p>
        </div>
      </div>
    </div>
  );
}