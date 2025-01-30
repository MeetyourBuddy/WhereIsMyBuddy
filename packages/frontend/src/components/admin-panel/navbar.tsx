import { ModeToggle } from '@/components/mode-toggle';
import { UserNav } from '@/components/admin-panel/user-nav';
import { SheetMenu } from '@/components/admin-panel/sheet-menu';
import { Input } from '@/components/common/ui/input';
import { Search } from 'lucide-react';
import { Separator } from '@radix-ui/react-separator';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { useAuth } from '@/lib/hooks/use-auth';
interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  console.log(user);

  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'johndoe@mail.com',
    avatar: '/avatars/user-profile.png'
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="h-10 pl-10" />
          </div>
          <Separator className="h-[32px] border-2 border-gray-200" orientation="vertical" />
          <ModeToggle />
          <UserNav user={userData} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
