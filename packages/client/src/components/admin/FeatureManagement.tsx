
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  UserPlus,
  Activity,
  Bell,
  MapPin,
  Lock,
  Share2,
  LineChart,
  Sparkles,
  Heart,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CategoryFilter } from "./features/CategoryFilter";
import { AddFeatureDialog } from "./features/AddFeatureDialog";
import { FeatureCard, FeatureData } from "./features/FeatureCard";
import { FeatureStatusType } from "./features/FeatureStatusBadge";

// Mock feature data
const mockFeatures = [
  {
    id: 1,
    name: "Real-time Messaging",
    description: "Allow users to send messages to buddies in real-time",
    enabled: true,
    status: "stable" as FeatureStatusType,
    icon: MessageCircle,
    category: "Communication",
  },
  {
    id: 2,
    name: "Friend Requests",
    description: "Enable users to send and receive buddy requests",
    enabled: true,
    status: "stable" as FeatureStatusType,
    icon: UserPlus,
    category: "Social",
  },
  {
    id: 3,
    name: "Activity Tracking",
    description: "Track user participation in various activities",
    enabled: true,
    status: "stable" as FeatureStatusType,
    icon: Activity,
    category: "Core",
  },
  {
    id: 4,
    name: "Push Notifications",
    description: "Send push notifications for important events",
    enabled: false,
    status: "development" as FeatureStatusType,
    icon: Bell,
    category: "Communication",
  },
  {
    id: 5,
    name: "Location Sharing",
    description:
      "Let users share their location with buddies during activities",
    enabled: false,
    status: "beta" as FeatureStatusType,
    icon: MapPin,
    category: "Privacy",
  },
  {
    id: 6,
    name: "Private Activities",
    description: "Create invitation-only private activities",
    enabled: true,
    status: "stable" as FeatureStatusType,
    icon: Lock,
    category: "Privacy",
  },
  {
    id: 7,
    name: "Social Sharing",
    description: "Share activities on social media platforms",
    enabled: true,
    status: "stable" as FeatureStatusType,
    icon: Share2,
    category: "Social",
  },
  {
    id: 8,
    name: "Analytics Dashboard",
    description: "Personal analytics for users to track their activity",
    enabled: false,
    status: "development" as FeatureStatusType,
    icon: LineChart,
    category: "Analytics",
  },
  {
    id: 9,
    name: "Buddy Match Recommendations",
    description: "AI-powered buddy recommendations based on interests",
    enabled: false,
    status: "experimental" as FeatureStatusType,
    icon: Sparkles,
    category: "Social",
  },
];

const FeatureManagement = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<FeatureData[]>(mockFeatures);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    category: "Core",
    status: "development" as FeatureStatusType,
  });

  const categories = [
    "All",
    ...new Set(features.map((feature) => feature.category)),
  ];

  const filteredFeatures = features.filter((feature) => {
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "All" ||
      feature.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleToggleFeature = (id: number) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
      )
    );

    const feature = features.find((f) => f.id === id);

    toast({
      title: `Feature ${!feature?.enabled ? "enabled" : "disabled"}`,
      description: `"${feature?.name}" has been ${
        !feature?.enabled ? "enabled" : "disabled"
      }.`,
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.name || !newFeature.description) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields before adding a feature.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...features.map((f) => f.id)) + 1;

    setFeatures([
      ...features,
      {
        id: newId,
        name: newFeature.name,
        description: newFeature.description,
        enabled: false,
        status: newFeature.status,
        icon: Heart,
        category: newFeature.category,
      },
    ]);

    toast({
      title: "Feature added",
      description: `"${newFeature.name}" has been added to the features list.`,
    });

    setIsAddFeatureOpen(false);
    setNewFeature({
      name: "",
      description: "",
      category: "Core",
      status: "development" as FeatureStatusType,
    });
  };

  // Organize features by category for rendering
  const featuresByCategory: Record<string, FeatureData[]> = {};

  filteredFeatures.forEach((feature) => {
    if (!featuresByCategory[feature.category]) {
      featuresByCategory[feature.category] = [];
    }
    featuresByCategory[feature.category].push(feature);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <AddFeatureDialog
            isOpen={isAddFeatureOpen}
            setIsOpen={setIsAddFeatureOpen}
            newFeature={newFeature}
            setNewFeature={setNewFeature}
            handleAddFeature={handleAddFeature}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.keys(featuresByCategory).map((category) => (
          <div key={category} className="w-full space-y-4">
            {featuresByCategory[category].map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggle={handleToggleFeature}
              />
            ))}
          </div>
        ))}

        {filteredFeatures.length === 0 && (
          <div className="col-span-full flex items-center justify-center p-8 bg-gray-50 border rounded-lg">
            <div className="text-center">
              <p className="text-gray-500">
                No features match your search criteria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureManagement;
