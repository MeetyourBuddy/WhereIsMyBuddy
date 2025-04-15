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

  return (
    <Sidebar
      className="bg-buddy-purple border-none"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader className="py-4 px-3">
        <div className="flex items-center justify-between">
          {state === "expanded" ? (
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-buddy-blue to-buddy-blue flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-2xl font-bold text-white">Buddy</span>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-md flex items-center justify-center mx-auto">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-buddy-purple to-buddy-blue flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          <SidebarTrigger className="text-white hover:bg-buddy-purple-dark" />
        </div>
        <div className="mt-4">{/* <SearchInput /> */}</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.href}
                tooltip={item.title} // Always provide the tooltip, will only show when collapsed
              >
                <Link
                  to={item.href}
                  className={cn(
                    "text-buddy-gray-200 hover:text-white hover:bg-buddy-purple-dark/40 min-h-10",
                    "transform transition-all duration-200 hover:scale-105",
                    location.pathname === item.href &&
                      "bg-buddy-purple-dark text-white hover:bg-buddy-purple-dark"
                  )}
                >
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

      <SidebarFooter className="border-t border-buddy-purple-dark/30 pt-2">
        <div className="px-3 py-2">
          {state === "expanded" ? (
            <div className="flex items-center">
              <Avatar className="h-9 w-9 border-2 border-buddy-purple-light">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-buddy-gray-400">Basic Member</p>
              </div>
              <Link
                to="/profile"
                className="ml-auto text-buddy-gray-400 hover:text-white"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <Avatar className="h-9 w-9 border-2 border-buddy-purple-light cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">John Doe</TooltipContent>
            </Tooltip>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
