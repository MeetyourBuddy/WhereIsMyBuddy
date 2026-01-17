import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Zap,
  User,
  LucideIcon,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

type SidebarNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

const navItems: SidebarNavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Activities",
    href: "/activities",
    icon: CheckSquare,
  },
  {
    title: "Buddies",
    href: "/buddies",
    icon: Users,
  },
  {
    title: "Boost Wall",
    href: "/boost-wall",
    icon: Zap,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/support",
    icon: HelpCircle,
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  // Helper function to check if a route is active (including child routes)
  const isRouteActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/") {
      return true;
    }
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <aside
      className={cn(
        "peer/sidebar group/sidebar fixed left-0 top-0 z-50 h-screen",
        "w-[80px] hover:w-64",
        "bg-buddy-purple",
        "transition-all duration-300 ease-in-out",
        "flex flex-col",
        "shadow-xl",
        "overflow-hidden"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-buddy-purple-dark/30">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-buddy-blue to-buddy-blue-dark flex items-center justify-center flex-shrink-0">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <span
            className={cn(
              "ml-3 text-2xl font-bold text-white",
              "opacity-0 group-hover/sidebar:opacity-100",
              "transition-opacity duration-200 delay-75",
              "whitespace-nowrap"
            )}
          >
            Buddy
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center py-3 rounded-xl",
                    "justify-center group-hover/sidebar:justify-start",
                    "px-0 group-hover/sidebar:px-3",
                    "gap-0 group-hover/sidebar:gap-4",
                    "transition-all duration-200",
                    // Default state
                    "text-buddy-gray-200",
                    // Hover state
                    "hover:bg-buddy-purple-dark/50 hover:text-white",
                    // Active state
                    isActive && [
                      "bg-buddy-purple-dark",
                      "text-white",
                      "shadow-md",
                    ]
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-6 h-6 flex-shrink-0",
                      "transition-colors duration-200",
                      isActive ? "text-white" : "text-buddy-gray-300"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap",
                      "w-0 group-hover/sidebar:w-auto overflow-hidden",
                      "opacity-0 group-hover/sidebar:opacity-100",
                      "transition-all duration-200 delay-75",
                      isActive && "font-semibold"
                    )}
                  >
                    {item.title}
                  </span>
                  {item.badge && (
                    <div
                      className={cn(
                        "ml-auto flex h-5 min-w-5 items-center justify-center",
                        "rounded-full bg-white text-xs font-semibold text-buddy-purple",
                        "opacity-0 group-hover/sidebar:opacity-100",
                        "transition-opacity duration-200 delay-75"
                      )}
                    >
                      {item.badge}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section - Stacked Vertically */}
      <div className="border-t border-buddy-purple-dark/30 px-3 py-3 flex-shrink-0">
        <div className="flex flex-col items-center gap-2">
          {/* User Avatar - Always visible */}
          <Avatar className="h-10 w-10 border-2 border-buddy-purple-light flex-shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-buddy-purple-dark text-white text-sm font-semibold">
              {user?.name?.charAt(0) || "G"}
            </AvatarFallback>
          </Avatar>

          {/* User Info - Hidden when collapsed */}
          <div
            className={cn(
              "flex flex-col items-center text-center w-full",
              "opacity-0 group-hover/sidebar:opacity-100",
              "transition-all duration-200 delay-75",
              "max-h-0 group-hover/sidebar:max-h-12 overflow-hidden"
            )}
          >
            <p className="text-sm font-semibold text-white truncate max-w-full leading-tight">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-buddy-gray-300 leading-tight">Basic Member</p>
          </div>

          {/* Profile Button - Hidden when collapsed */}
          <div
            className={cn(
              "w-full",
              "opacity-0 group-hover/sidebar:opacity-100",
              "transition-all duration-200 delay-100",
              "max-h-0 group-hover/sidebar:max-h-9 overflow-hidden"
            )}
          >
            <Link to={`/profile/${user?._id || user?.id}`}>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full h-8 border-buddy-purple-light/50 text-buddy-gray-500 hover:text-white text-xs",
                  "hover:bg-buddy-purple-dark hover:border-buddy-purple-light",
                  "transition-colors duration-200"
                )}
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
