
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "small" | "default" | "large" | "icon";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = ({
  children,
  className,
  variant = "primary",
  size = "default",
  isLoading = false,
  icon,
  iconPosition = "left",
  disabled,
  ...props
}: ButtonProps) => {
  // Base classes
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buddy-purple-light disabled:opacity-70 disabled:cursor-not-allowed";
  
  // Variant classes
  const variantClasses = {
    primary: "bg-buddy-purple text-white hover:bg-buddy-purple-dark shadow-sm button-shine",
    secondary: "bg-buddy-gray-100 text-buddy-gray-800 hover:bg-buddy-gray-200 shadow-sm",
    outline: "border border-buddy-gray-300 text-buddy-gray-800 hover:bg-buddy-gray-100 bg-transparent",
    ghost: "text-buddy-gray-700 hover:bg-buddy-gray-100 bg-transparent",
    link: "text-buddy-purple hover:text-buddy-purple-dark underline-offset-4 hover:underline bg-transparent p-0",
  };
  
  // Size classes
  const sizeClasses = {
    small: "text-sm px-3 py-1.5 rounded-md",
    default: "text-base px-4 py-2 rounded-lg",
    large: "text-lg px-6 py-3 rounded-xl",
    icon: "p-2 rounded-full",
  };
  
  // Loading indicator classes
  const loadingClasses = isLoading ? "relative !text-transparent" : "";
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loadingClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      
      {icon && iconPosition === "left" && !isLoading && (
        <span className={cn("mr-2", size === "icon" ? "mr-0" : "")}>{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === "right" && !isLoading && (
        <span className={cn("ml-2", size === "icon" ? "ml-0" : "")}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
