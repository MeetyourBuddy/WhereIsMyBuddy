import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/hooks/use-toast";

const ImageUploadDemo: React.FC = () => {
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUploaded = (fileId: string, url: string) => {
    setUploadedFileId(fileId);
    setImageUrl(url);
  };

  const handleImageRemoved = () => {
    setUploadedFileId(null);
    setImageUrl(null);
  };

  const handleTestUpload = () => {
    if (uploadedFileId) {
      toast({
        title: "Upload successful!",
        description: `File ID: ${uploadedFileId}`,
      });
    } else {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Image Upload Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
            maxSize={5}
            className="w-full"
          />

          {uploadedFileId && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600"
                >
                  Upload Successful
                </Badge>
                <span className="text-sm text-buddy-gray-600">
                  File ID: {uploadedFileId}
                </span>
              </div>

              {imageUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-buddy-gray-700">
                    Image URL:
                  </p>
                  <div className="p-3 bg-buddy-gray-50 rounded-lg">
                    <code className="text-xs text-buddy-gray-600 break-all">
                      {imageUrl}
                    </code>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleTestUpload} variant="outline">
                  Test Upload
                </Button>
                <Button
                  onClick={() => {
                    if (imageUrl) {
                      window.open(imageUrl, "_blank");
                    }
                  }}
                  variant="outline"
                  disabled={!imageUrl}
                >
                  View Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadDemo;
