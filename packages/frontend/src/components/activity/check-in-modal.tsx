'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Checkbox } from '@/components/common/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/common/ui/select';
import { Textarea } from '@/components/common/ui/textarea';
import { Input } from '@/components/common/ui/input';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal = ({ isOpen, onClose }: CheckInModalProps) => {
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [timeAmount, setTimeAmount] = useState('1');
  const [timeUnit, setTimeUnit] = useState('hour');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);

  const rules = [
    { id: '1', label: 'Rule 1' },
    { id: '2', label: 'Rule 2' },
    { id: '3', label: 'Rule 3' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      selectedRules,
      timeSpent: `${timeAmount} ${timeUnit}`,
      comment,
      photo
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[600px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 p-2">
              <Check className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">Check-in</DialogTitle>
              <p className="text-sm text-muted-foreground">{format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          <div>
            <Button variant="ghost" onClick={onClose} className="h-10 w-10 p-2 hover:bg-gray-20">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center space-x-2">
                <Checkbox
                  id={rule.id}
                  checked={selectedRules.includes(rule.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRules([...selectedRules, rule.id]);
                    } else {
                      setSelectedRules(selectedRules.filter((id) => id !== rule.id));
                    }
                  }}
                />
                <label htmlFor={rule.id} className="text-sm">
                  {rule.label}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="No file chosen"
                value={photo?.name || ''}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                className="text-primary hover:text-primary"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                Upload
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Time Spent</label>
            <div className="flex gap-2">
              <Select value={timeAmount} onValueChange={setTimeAmount}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeUnit} onValueChange={setTimeUnit}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">hour</SelectItem>
                  <SelectItem value="hours">hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm">Comment</label>
            <Textarea
              placeholder="Anything you'd like to add?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button className="w-full bg-primary text-primary-foreground" onClick={handleSubmit}>
            Mark as done!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
