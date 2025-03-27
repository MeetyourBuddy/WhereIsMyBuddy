
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FeatureStatusBadge, FeatureStatusType } from "./FeatureStatusBadge";
import { LucideIcon } from "lucide-react";

export interface FeatureData {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  status: FeatureStatusType;
  icon: LucideIcon;
  category: string;
}

interface FeatureCardProps {
  feature: FeatureData;
  onToggle: (id: number) => void;
}

export const FeatureCard = ({ feature, onToggle }: FeatureCardProps) => {
  return (
    <Card key={feature.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-buddy-purple/10 flex items-center justify-center text-buddy-purple">
              <feature.icon size={20} />
            </div>
            <div>
              <CardTitle className="text-lg">
                {feature.name}
              </CardTitle>
            </div>
          </div>
          <FeatureStatusBadge status={feature.status} />
        </div>
        <CardDescription className="mt-2">
          {feature.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={`feature-toggle-${feature.id}`}
            className="text-sm font-medium"
          >
            {feature.enabled ? "Enabled" : "Disabled"}
          </Label>
          <Switch
            id={`feature-toggle-${feature.id}`}
            checked={feature.enabled}
            onCheckedChange={() => onToggle(feature.id)}
          />
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t border-gray-100 text-xs text-gray-500">
        Category: {feature.category}
      </CardFooter>
    </Card>
  );
};
