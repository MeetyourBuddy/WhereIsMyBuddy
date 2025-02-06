import { Menu } from '@/components/admin-panel/menu';
import { SidebarToggle } from '@/components/admin-panel/sidebar-toggle';
import { Button } from '@/components/common/ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Icons } from '../common/icons';
import { useAuth } from '@/lib/hooks/use-auth';

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  const { logout } = useAuth();

  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  const handleLogout = () => {
    logout();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative flex h-full flex-col overflow-y-auto bg-sidebar px-3 py-4 text-sidebar-foreground shadow-md"
      >
        <Button
          className={cn(
            'mb-1 transition-transform duration-300 ease-in-out',
            !getOpenState() ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild
        >
          <Link to="/dashboard" className="flex items-center gap-4">
            <Icons.logo className="" />
            <h2
              className={cn(
                'whitespace-nowrap font-bold text-sidebar-accent-foreground transition-[transform,opacity,display] duration-300 ease-in-out',
                !getOpenState() ? 'hidden -translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
              )}
            >
              Buddy?
            </h2>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} handleLogout={handleLogout} />
      </div>
    </aside>
  );
}
