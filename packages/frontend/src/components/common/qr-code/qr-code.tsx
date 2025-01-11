import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog';
import { QrCode } from 'lucide-react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Download, X } from 'lucide-react';

export const QRCodeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profileUrl = 'https://your-domain.com/profile'; // Replace with actual profile URL

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'profile-qr.png';
      link.href = url;
      link.click();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    // Optionally add a toast notification here
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-neutral-dark-600 text-base font-medium">Profile QR</Label>
        <div className="flex items-center gap-2">
          <QrCode className="h-24 w-24" />
          <Button onClick={() => setIsModalOpen(true)}>Generate QR Code</Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[500px] w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-center">Your Profile QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-8">
            <div className="relative rounded-lg bg-white p-6">
              <QRCodeCanvas
                id="qr-code"
                value={profileUrl}
                size={300}
                level="H"
                imageSettings={{
                  src: '/logo/buddy-logo.png',
                  height: 60,
                  width: 60,
                  excavate: true
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
