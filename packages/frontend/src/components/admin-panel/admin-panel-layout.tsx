import { Footer } from '@/components/admin-panel/footer';
import { Sidebar } from '@/components/admin-panel/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const sidebar = useStore(useSidebar, (x) => x);

  // Remove the early return and provide default values
  const getOpenState = sidebar?.getOpenState ?? (() => false);
  const settings = sidebar?.settings ?? { disabled: false };

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72')
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] duration-300 ease-in-out',
          !settings.disabled && (!getOpenState() ? 'lg:ml-[90px]' : 'lg:ml-72')
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
