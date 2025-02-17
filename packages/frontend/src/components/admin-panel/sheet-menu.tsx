import { Link } from 'react-router-dom';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/common/ui/button';
import { Menu } from '@/components/admin-panel/menu';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/common/ui/sheet';
import Logo_alt from '../common/icons/Logo_alt';
import { useAuth } from '@/lib/hooks/use-auth';

export function SheetMenu() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-10" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button className="flex items-center justify-center pb-2 pt-1" variant="link" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Logo_alt className="h-10 w-10" />
              <SheetTitle className="text-lg font-bold">Where is my buddy?</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen handleLogout={handleLogout} />
      </SheetContent>
    </Sheet>
  );
}
