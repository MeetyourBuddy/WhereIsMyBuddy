
import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "card";
  status?: "online" | "offline" | "busy" | "away" | "none";
  initials?: string;
  isGroup?: boolean;
  groupImages?: string[];
  /** Applied to the inner container when showing initials (no src) */
  fallbackClassName?: string;
}

const Avatar = ({
  src,
  alt = "User avatar",
  size = "md",
  status = "none",
  initials,
  isGroup = false,
  groupImages = [],
  className,
  fallbackClassName,
  ...props
}: AvatarProps) => {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    card: "w-full h-48 text-6xl rounded-sm",
  };

  const statusColorClasses = {
    online: "bg-buddy-green border-white",
    offline: "bg-buddy-gray-400 border-white",
    busy: "bg-buddy-orange border-white",
    away: "bg-buddy-orange-light border-white",
    none: "hidden",
  };

  const statusSizeClasses = {
    xs: "w-1.5 h-1.5 right-0 bottom-0",
    sm: "w-2 h-2 right-0 bottom-0",
    md: "w-3 h-3 right-0 bottom-0",
    lg: "w-3.5 h-3.5 right-0 bottom-0",
    xl: "w-4 h-4 right-0.5 bottom-0.5",
    card: "w-3 h-3 right-0 bottom-0",
  };

  if (isGroup && groupImages.length > 0) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {groupImages.slice(0, 3).map((img, index) => (
          <div
            key={index}
            className={cn(
              "absolute rounded-full border-2 border-white overflow-hidden",
              sizeClasses[size],
              index === 0 && "transform -translate-x-1/4",
              index === 2 && "transform translate-x-1/4"
            )}
            style={{ zIndex: 3 - index }}
          >
            <img src={img} alt={`Group member ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
        {groupImages.length > 3 && (
          <div
            className={cn(
              "absolute bottom-0 right-0 rounded-full bg-buddy-gray-800 text-white flex items-center justify-center text-xs w-5 h-5"
            )}
          >
            +{groupImages.length - 3}
          </div>
        )}
      </div>
    );
  }

  const isCardSize = size === "card";
  return (
    <div className={cn(isCardSize ? "block w-full" : "relative inline-block", !isCardSize && "rounded-full", className)} {...props}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden text-buddy-gray-700 font-medium",
          isCardSize ? "rounded-sm" : "rounded-full",
          !src && fallbackClassName ? fallbackClassName : "bg-buddy-gray-200",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <svg
            className="w-1/2 h-1/2 text-buddy-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      {status !== "none" && (
        <span
          className={cn(
            "absolute rounded-full border-2",
            statusColorClasses[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
