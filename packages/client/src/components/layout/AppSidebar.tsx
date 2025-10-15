import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  Search,
  BarChart2,
  Bell,
  Layout,
  Zap,
  User,
  Heart,
  LucideIcon,
  HeartHandshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/auth.store";

// Custom styles for mobile sidebar
const mobileSidebarStyles = `
  /* Mobile sidebar container */
  [data-sidebar="sidebar"][data-mobile="true"] {
    background-color: rgb(139 92 246) !important; /* buddy-purple */
    color: white !important;
  }
  
  /* Mobile sidebar content */
  [data-sidebar="sidebar"][data-mobile="true"] > div {
    background-color: rgb(139 92 246) !important; /* buddy-purple */
  }
  
  /* Mobile sidebar header */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="header"] {
    background-color: rgb(139 92 246) !important; /* buddy-purple */
    color: white !important;
  }
  
  /* Mobile sidebar content area */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="content"] {
    background-color: rgb(139 92 246) !important; /* buddy-purple */
    color: white !important;
  }
  
  /* Mobile sidebar footer */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="footer"] {
    background-color: rgb(139 92 246) !important; /* buddy-purple */
    color: white !important;
  }
  
  /* Mobile sidebar menu buttons */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="menu-button"] {
    color: rgb(229 231 235) !important; /* buddy-gray-200 */
    background-color: transparent !important;
  }
  
  /* Mobile sidebar menu button hover */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="menu-button"]:hover {
    color: white !important;
    background-color: rgba(139 92 246, 0.4) !important; /* buddy-purple-dark/40 */
  }
  
  /* Mobile sidebar active menu button */
  [data-sidebar="sidebar"][data-mobile="true"] [data-sidebar="menu-button"][data-state="active"] {
    background-color: rgb(139 92 246) !important; /* buddy-purple-dark */
    color: white !important;
  }
  
  /* Ensure all text is white on mobile */
  [data-sidebar="sidebar"][data-mobile="true"] p,
  [data-sidebar="sidebar"][data-mobile="true"] span,
  [data-sidebar="sidebar"][data-mobile="true"] div {
    color: white !important;
  }
  
  /* Mobile sidebar links */
  [data-sidebar="sidebar"][data-mobile="true"] a {
    color: white !important;
  }
  
  /* Mobile sidebar icons */
  [data-sidebar="sidebar"][data-mobile="true"] svg {
    color: white !important;
  }
`;

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
    // badge: 10,
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
    // badge: 2,
  },
  {
    title: "Boost Wall",
    href: "/boost-wall",
    icon: Zap,
  },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  //   icon: BarChart2,
  // },
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

const SearchInput = () => {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-buddy-purple/10 text-buddy-gray-500 border-2 border-gray-300">
            <Search className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Search</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-buddy-gray-500" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full bg-gray-200 border-none pl-9 text-sm h-9 text-buddy-purple-dark placeholder:text-buddy-gray-400"
      />
    </div>
  );
};

const AppSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();

  const { user } = useAuthStore();

  // Helper function to check if a route is active (including child routes)
  const isRouteActive = (href: string) => {
    if (href === "/dashboard" && location.pathname === "/") {
      return true; // Home route special case
    }
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  // Inject mobile sidebar styles
  React.useEffect(() => {
    const styleId = "mobile-sidebar-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = mobileSidebarStyles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <Sidebar
      className={cn(
        "bg-buddy-purple border-none",
        state === "collapsed" && "sidebar-icon-mode",
        // Override mobile styling to ensure solid background
        "[&[data-mobile='true']]:bg-buddy-purple [&[data-mobile='true']]:text-white"
      )}
      variant="sidebar"
      collapsible="icon"
      side="left"
    >
      <SidebarHeader
        className={cn(
          "py-4 bg-buddy-purple",
          state === "expanded" ? "px-3" : "px-2",
          // Ensure mobile header has proper styling
          "[&[data-mobile='true']]:bg-buddy-purple [&[data-mobile='true']]:text-white"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            state === "expanded" ? "justify-between" : "justify-center"
          )}
        >
          {/* Always show full logo on mobile, collapsed/expanded on desktop */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-buddy-blue to-buddy-blue flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div
              className={cn(
                "flex flex-col ml-2",
                state === "collapsed" ? "hidden" : "block"
              )}
            >
              <span className="text-2xl font-bold text-white">Buddy</span>
            </div>
          </Link>
          {state === "expanded" && (
            <SidebarTrigger className="text-white hover:bg-buddy-purple-dark" />
          )}
        </div>
        {state === "collapsed" && (
          <div className="flex justify-center mt-3">
            <SidebarTrigger className="text-white hover:bg-buddy-purple-dark" />
          </div>
        )}
        <div className="mt-4">{/* <SearchInput /> */}</div>
      </SidebarHeader>

      <SidebarContent className="bg-buddy-purple [&[data-mobile='true']]:bg-buddy-purple [&[data-mobile='true']]:text-white">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isRouteActive(item.href)}
                tooltip={item.title}
                className={cn(
                  "text-buddy-gray-200 hover:text-white hover:bg-buddy-purple-dark/40",
                  "transform transition-all duration-200 hover:scale-105",
                  "min-h-[44px] sm:min-h-[40px]", // Better touch targets on mobile
                  isRouteActive(item.href) &&
                    "bg-buddy-purple-dark text-white hover:bg-buddy-purple-dark"
                )}
              >
                <Link to={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-buddy-purple">
                      {item.badge}
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-buddy-purple-dark/30 pt-2 bg-buddy-purple [&[data-mobile='true']]:bg-buddy-purple [&[data-mobile='true']]:text-white">
        <div className={cn("py-2", state === "expanded" ? "px-3" : "px-2")}>
          <div className="flex items-center">
            <Avatar className="h-9 w-9 border-2 border-buddy-purple-light">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div
              className={cn("ml-3", state === "collapsed" ? "hidden" : "block")}
            >
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-buddy-gray-400">Basic Member</p>
            </div>
            <Link
              to={`/profile/${user?._id || user?.id}`}
              className={cn(
                "text-buddy-gray-400 hover:text-white",
                state === "collapsed" ? "ml-auto" : "ml-auto"
              )}
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
