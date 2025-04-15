
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline" | "accent";
  hover?: boolean;
  children: React.ReactNode;
  as?: React.ElementType;
}

const Card = ({
  variant = "default",
  hover = false,
  className,
  children,
  as: Component = "div",
  ...props
}: CardProps) => {
  const variantClasses = {
    default: "bg-white shadow-subtle dark:bg-buddy-gray-800 dark:border-buddy-gray-700",
    glass: "glass-card dark:glass-card-dark",
    outline: "border border-buddy-gray-200 dark:border-buddy-gray-700 bg-transparent",
    accent: "border-l-4 border-l-buddy-purple bg-white shadow-subtle dark:bg-buddy-gray-800 dark:border-buddy-gray-700",
  };

  const hoverClass = hover ? "hover-card" : "";

  return (
    <Component
      className={cn(
        "rounded-xl overflow-hidden",
        variantClasses[variant],
        hoverClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = ({ className, children, ...props }: CardHeaderProps) => (
  <div className={cn("px-6 pt-6 pb-3", className)} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const CardTitle = ({ className, children, ...props }: CardTitleProps) => (
  <h3 className={cn("text-xl font-semibold", className)} {...props}>
    {children}
  </h3>
);

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const CardDescription = ({ className, children, ...props }: CardDescriptionProps) => (
  <p className={cn("text-buddy-gray-500 text-sm", className)} {...props}>
    {children}
  </p>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = ({ className, children, ...props }: CardContentProps) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter = ({ className, children, ...props }: CardFooterProps) => (
  <div
    className={cn("px-6 py-4 border-t border-buddy-gray-100 dark:border-buddy-gray-700", className)}
    {...props}
  >
    {children}
  </div>
);

// Export the Card with its subcomponents
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
