import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import AppSidebar from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

const AppLayout = ({
  children,
  className,
  hideHeader = false,
}: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Only show AppSidebar on desktop (sm and above) */}
      {!isMobile && <AppSidebar />}
      
      {/* Main content area with left margin for sidebar */}
      {/* Uses peer-hover to expand margin when sidebar is hovered */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          !isMobile && "ml-[80px] peer-hover/sidebar:ml-64"
        )}
      >
        {!hideHeader && <Header isLoggedIn={true} />}
        <main className={cn("flex-1", className)}>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
