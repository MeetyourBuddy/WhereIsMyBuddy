import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        {/* Only show AppSidebar on desktop */}
        {!isMobile && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {!hideHeader && <Header isLoggedIn={true} />}
          <main className={cn("flex-1 min-w-0", className)}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
