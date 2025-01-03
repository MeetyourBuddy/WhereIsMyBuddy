import { Dialog, DialogContent, DialogTitle } from '@/components/common/ui/dialog';
import { Button } from '@/components/common/ui/button';
import { X } from 'lucide-react';

interface PreviewModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  previewUrl: string;
  handleSave: () => void;
}

export const PreviewModal = ({
  isModalOpen,
  setIsModalOpen,
  previewUrl,
  handleSave
}: PreviewModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-h-[788px] min-w-[688px]">
        <DialogTitle className="mb-4 flex items-center justify-between">
          <h6 className="font-semibold">Edit Profile Picture</h6>
          <Button variant="ghost" className="h-8 p-2" onClick={() => setIsModalOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </DialogTitle>
        <div className="flex h-[600px] flex-col items-center gap-4 rounded-xl bg-brand-10 p-4">
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        </div>
        <div className="my-4 flex justify-between gap-4">
          <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full">
            Cancel
          </Button>
          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
