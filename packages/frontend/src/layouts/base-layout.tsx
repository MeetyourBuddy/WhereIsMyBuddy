import { AppSidebar } from '@/components/common/navigation/sidebar/sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/common/ui/sidebar';
import { Breadcrumb } from '@/components/common/navigation/topbar/breadcrumb';
import { Separator } from '@/components/common/ui/separator';
import { Outlet, useLocation } from 'react-router-dom';
import { Input } from '@/components/common/ui/input';
import { Button } from '@/components/common/ui/button';
import { Search } from 'lucide-react';

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
          <header className="sticky top-0 z-[1000] flex h-16 shrink-0 items-center gap-2 border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white">
            <div className="flex w-full flex-row items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb breadcrumbs={breadcrumbs} />
              </div>

              {/* search input */}
              <div className="flex items-center gap-2">
                <Input placeholder="Search" className="w-64 rounded-lg" />
                <Button variant="outline" className="rounded-lg">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="container h-full flex-1 bg-gray-10 px-8">
            <Outlet />
          </main>

          <footer className="border-t bg-white">
            <div className="container py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
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
