'use client';

import { Dialog, DialogContent } from '@/components/common/ui/dialog';
import { Button } from '@/components/common/ui/button';
import { CropIcon, Trash2Icon } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop';
import { useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

interface PreviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  previewUrl: string;
  handleSave: (croppedImageUrl?: string) => void;
}

export const PreviewModal = ({
  isModalOpen,
  setIsModalOpen,
  previewUrl,
  handleSave
}: PreviewModalProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');

  // Initialize crop on image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));

    // Load previous crop from localStorage if it exists
    const savedCrop = localStorage.getItem('lastImageCrop');
    if (savedCrop) {
      setCrop(JSON.parse(savedCrop));
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return canvas.toDataURL('image/png', 1.0);
  };

  const onCropComplete = (pixelCrop: PixelCrop) => {
    if (imgRef.current && pixelCrop.width && pixelCrop.height) {
      const croppedImg = getCroppedImg(imgRef.current, pixelCrop);
      setCroppedImageUrl(croppedImg);

      // Save crop to localStorage
      localStorage.setItem('lastImageCrop', JSON.stringify(crop));
    }
  };

  const onSave = () => {
    handleSave(croppedImageUrl);
    setIsModalOpen(false);
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setCroppedImageUrl('');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="gap-0 p-0">
        <div className="size-full p-6">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={1}
            className="w-full"
          >
            <img
              ref={imgRef}
              src={previewUrl}
              alt="Preview"
              className="max-h-[460px] w-full object-contain"
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <div className="flex justify-center gap-4 p-6 pt-0">
          <Button size="sm" variant="outline" onClick={onCancel} className="w-fit">
            <Trash2Icon className="mr-1.5 size-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={onSave} className="w-fit">
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
        height: 50
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
