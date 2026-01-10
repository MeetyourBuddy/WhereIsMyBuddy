
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { FeatureStatusType } from "./FeatureStatusBadge";

interface NewFeatureData {
  name: string;
  description: string;
  category: string;
  status: FeatureStatusType;
}

interface AddFeatureDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newFeature: NewFeatureData;
  setNewFeature: React.Dispatch<React.SetStateAction<NewFeatureData>>;
  handleAddFeature: () => void;
}

export const AddFeatureDialog = ({
  isOpen,
  setIsOpen,
  newFeature,
  setNewFeature,
  handleAddFeature,
}: AddFeatureDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2">
          <PlusCircle size={18} className="mr-1" /> Add Feature
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Feature</DialogTitle>
          <DialogDescription>
            Define a new feature for the platform. New features are
            disabled by default.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="feature-name">Feature Name</Label>
            <Input
              id="feature-name"
              placeholder="Enter feature name"
              value={newFeature.name}
              onChange={(e) =>
                setNewFeature({ ...newFeature, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feature-desc">Description</Label>
            <Textarea
              id="feature-desc"
              placeholder="Describe what the feature does"
              value={newFeature.description}
              onChange={(e) =>
                setNewFeature({
                  ...newFeature,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feature-category">Category</Label>
              <Select
                value={newFeature.category}
                onValueChange={(value) =>
                  setNewFeature({ ...newFeature, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Communication">
                    Communication
                  </SelectItem>
                  <SelectItem value="Privacy">Privacy</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-status">Status</Label>
              <Select
                value={newFeature.status}
                onValueChange={(value: string) => {
                  // Fix the TypeScript error by explicitly checking the value
                  let statusValue: FeatureStatusType = "development";
                  
                  if (
                    value === "stable" ||
                    value === "beta" ||
                    value === "development" ||
                    value === "experimental"
                  ) {
                    statusValue = value;
                  }
                  
                  setNewFeature({ ...newFeature, status: statusValue });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">
                    In Development
                  </SelectItem>
                  <SelectItem value="experimental">
                    Experimental
                  </SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleAddFeature}>Add Feature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
