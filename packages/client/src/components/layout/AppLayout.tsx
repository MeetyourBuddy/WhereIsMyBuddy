
import React from "react";
import { cn } from "@/lib/utils";
import Header from "@/components/common/Header";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
}

const AppLayout = ({ children, className, hideHeader = false }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {!hideHeader && <Header isLoggedIn={true} />}
          <main className={cn("flex-1", className)}>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
