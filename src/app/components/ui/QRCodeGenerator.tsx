// src/app/components/ui/QRCodeGenerator.tsx
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface QRCodeGeneratorProps {
  binId: string;
  location: string;
  wasteType: string;
  onClose: () => void;
}

export default function QRCodeGenerator({ binId, location, wasteType, onClose }: QRCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const qrData = JSON.stringify({
    binId,
    location,
    wasteType,
    timestamp: new Date().toISOString(),
  });

  const handleDownload = () => {
    const svg = document.getElementById('bin-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `TrashHoop-Bin-${binId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success('QR Code downloaded!');
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(binId);
    setCopied(true);
    toast.success('Bin ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#E8F5E9]">
          <h3 className="font-semibold text-[#1A2E1A]">Bin QR Code</h3>
          <button onClick={onClose} className="text-[#558B5A] hover:text-[#1A2E1A] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="bg-gray-50 p-4 rounded-xl inline-block mb-4">
            <QRCodeSVG
              id="bin-qr-code"
              value={qrData}
              size={220}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#1A2E1A"
            />
          </div>

          <div className="space-y-2 mb-5 text-left bg-[#F4FAF4] p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#1A2E1A]">
                <span className="font-medium">Bin ID:</span> {binId}
              </p>
              <button
                onClick={handleCopyId}
                className="p-1.5 text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-[#1A2E1A]">
              <span className="font-medium">Location:</span> {location}
            </p>
            <p className="text-sm text-[#1A2E1A]">
              <span className="font-medium">Waste Type:</span> {wasteType}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-white border border-[#A5D6A7] text-[#2E7D32] rounded-xl hover:bg-[#E8F5E9] transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          <p className="text-xs text-[#A5D6A7] mt-4">
            Print this QR code and attach it to the bin
          </p>
        </div>
      </div>
    </div>
  );
}