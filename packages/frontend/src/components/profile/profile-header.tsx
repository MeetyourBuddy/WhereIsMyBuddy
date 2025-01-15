import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { Camera } from 'lucide-react';
import { PreviewModal } from '@/components/common/modal/preview-modal';
import { IconButton } from '../common/ui/icon-button';
import { useNavigate } from 'react-router-dom';
interface ProfileHeaderProps {
  name: string;
  email?: string;
  avatarUrl: string;
  bannerUrl?: string;
  onAvatarUpdate: (newAvatarUrl: string, file: File) => Promise<void>;
  onBannerUpdate: (newBannerUrl: string, file: File) => Promise<void>;
}

const ProfileHeader = ({
  name,
  email,
  avatarUrl,
  bannerUrl,
  onAvatarUpdate,
  onBannerUpdate
}: ProfileHeaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(avatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(bannerUrl || '');
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsModalOpen(true);
    }
  };

  const handleSave = async (croppedImageUrl?: string) => {
    if (selectedFile && onAvatarUpdate && croppedImageUrl) {
      try {
        // Convert base64 to File object
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        const croppedFile = new File([blob], selectedFile.name, { type: 'image/jpeg' });

        await onAvatarUpdate(croppedImageUrl, croppedFile);
        setIsModalOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error('Failed to update avatar:', error);
      }
    }
  };

  const handleBannerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedBannerFile(file);
      setBannerPreviewUrl(URL.createObjectURL(file));
      setIsBannerModalOpen(true);
    }
  };

  const handleBannerSave = async () => {
    if (selectedBannerFile && onBannerUpdate) {
      try {
        await onBannerUpdate(bannerPreviewUrl, selectedBannerFile);
        setIsBannerModalOpen(false);
        // Clear the temporary file data after successful upload
        setSelectedBannerFile(null);
      } catch (error) {
        console.error('Failed to update banner:', error);
        // Handle error (you might want to show an error toast here)
      }
    }
  };

  return (
    <>
      <div className="relative mb-[70px] h-[160px] w-full">
        <div
          className="h-full w-full bg-warning-10 bg-cover bg-center"
          style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined }}
        >
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Camera className="h-8 w-8 text-white" />
            <input type="file" className="hidden" accept="image/*" onChange={handleBannerSelect} />
          </label>
        </div>

        <div className="absolute left-6 top-1/3 flex items-end">
          <div className="group relative">
            <Avatar className="h-[160px] w-[160px] bg-brand-50">
              <AvatarImage src={avatarUrl} alt={`${name}'s profile picture`} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>

            <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-8 w-8 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            </label>
          </div>

          <div className="bottom-[-70px] left-[200px] flex flex-col">
            <h6 className="font-bold">{name}</h6>
            <p className="text-paragraph-md italic text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="absolute bottom-[-55px] right-0 flex items-end">
          <IconButton
            className="max-w-[200px] rounded-xl px-4 py-2 text-xs font-bold text-white"
            rightIcon="eye"
            onClick={() => navigate(`/profile/card`)}
            label="View Profile"
          />
        </div>
      </div>

      <PreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        previewUrl={previewUrl}
        handleSave={handleSave}
      />

      <PreviewModal
        isModalOpen={isBannerModalOpen}
        setIsModalOpen={setIsBannerModalOpen}
        previewUrl={bannerPreviewUrl}
        handleSave={handleBannerSave}
      />
    </>
  );
};

export default ProfileHeader;
