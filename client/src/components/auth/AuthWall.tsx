import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";

interface AuthWallProps {
  title: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  /**
   * Optional benefits list to display
   */
  benefits?: string[];
  /**
   * Optional callback to run before navigating to auth.
   * Use this to set post-auth intent in localStorage.
   */
  onAuthNavigate?: () => void;
  /**
   * Where to send users after sign-in/sign-up.
   * Defaults to current location (pathname + search).
   */
  returnTo?: string;
  /**
   * Alternative prop name for returnTo (for backwards compatibility)
   */
  returnToAfterAuth?: string;
  /**
   * Optional children to render below the CTA buttons
   */
  children?: React.ReactNode;
}

export const AuthWall = ({
  title,
  description,
  className,
  icon,
  benefits,
  onAuthNavigate,
  returnTo,
  returnToAfterAuth,
  children,
}: AuthWallProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const resolvedReturnTo =
    returnTo ?? returnToAfterAuth ?? `${location.pathname}${location.search || ""}`;

  const handleGo = (path: "/signin" | "/signup") => {
    onAuthNavigate?.();
    localStorage.setItem("returnToAfterAuth", resolvedReturnTo);
    navigate(path);
  };

  return (
    <Card className={cn("p-6 sm:p-8 text-center w-full", className)}>
      <div className="flex flex-col items-center">
        {/* Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          {icon ?? <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-buddy-gray-400" />}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base text-buddy-gray-600 mb-4 sm:mb-6">
            {description}
          </p>
        )}

        {/* Benefits List */}
        {benefits && benefits.length > 0 && (
          <ul className="list-none space-y-2 mb-4 sm:mb-6 text-left max-w-sm mx-auto text-buddy-gray-600">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-4 w-4 text-buddy-green mr-2 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => handleGo("/signin")}
            className="rounded-full text-sm sm:text-base"
          >
            Sign In
          </Button>
          <Button
            onClick={() => handleGo("/signup")}
            variant="outline"
            className="rounded-full text-sm sm:text-base"
          >
            Create Account
          </Button>
        </div>

        {/* Optional children */}
        {children}
      </div>
    </Card>
  );
};


