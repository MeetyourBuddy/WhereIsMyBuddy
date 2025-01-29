import { Navbar } from '@/components/admin-panel/navbar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/common/ui/breadcrumb';
import { useLocation, NavLink } from 'react-router-dom';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  const location = useLocation();

  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);

    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      const formattedPath = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

      return (
        <BreadcrumbItem key={path}>
          {!isLast ? (
            <>
              <BreadcrumbLink asChild>
                <NavLink to={href}>{formattedPath}</NavLink>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </>
          ) : (
            <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      );
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar title={title} />
      <div className="container min-h-screen bg-white px-4 sm:px-8">
        <Breadcrumb className="py-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <NavLink to="/dashboard">Home</NavLink>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
            {generateBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb>
        {children}
      </div>
    </div>
  );
}
