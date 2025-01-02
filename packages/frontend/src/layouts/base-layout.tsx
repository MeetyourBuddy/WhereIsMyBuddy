import { AppSidebar } from '@/components/common/navigation/sidebar/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/common/ui/sidebar';
import { Breadcrumb } from '@/components/common/navigation/topbar/breadcrumb';
import { Separator } from '@/components/common/ui/separator';
import { Outlet, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  return paths.map((path, index) => {
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    const fullPath = '/' + paths.slice(0, index + 1).join('/');
    return { label, path: fullPath };
  });
}

export default function RootLayout() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb breadcrumbs={breadcrumbs} />
            </div>
          </header>

          <main className="bg-gray-10 h-full flex-1 p-6">
            <Outlet />
          </main>

          <footer className="border-t bg-background">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  © {new Date().getFullYear()} | Where is my buddy?. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
