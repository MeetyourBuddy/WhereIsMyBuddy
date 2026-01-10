import { Badge } from "@/components/ui/badge";
import { activityCategories } from "@/lib/constants/category-interests.constants";
import { cn } from "@/lib/utils";

interface ActivityTagsProps {
  selectedCategories?: string[];
  onCategorySelect?: (category: string) => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export const ActivityTags = ({
  selectedCategories = [],
  onCategorySelect,
  variant = "outline",
  className,
}: ActivityTagsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {activityCategories.map((category) => (
        <Badge
          key={category.value}
          variant={variant}
          className={cn(
            "cursor-pointer transition-colors duration-200",
            selectedCategories.includes(category.value)
              ? "bg-buddy-purple/20 text-buddy-purple border-buddy-purple/30"
              : "hover:bg-buddy-purple/10",
            className
          )}
          onClick={() => onCategorySelect?.(category.value)}
        >
          {category.label}
        </Badge>
      ))}
    </div>
  );
};
