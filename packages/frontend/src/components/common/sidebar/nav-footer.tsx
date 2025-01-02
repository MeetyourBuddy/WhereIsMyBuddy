import { LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface NavFooterProps {
  handleLogout: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function NavFooter({ handleLogout }: NavFooterProps) {
  return (
    <Button
      variant="outline"
      className="mt-4 flex flex-row justify-start space-x-2"
      onClick={handleLogout}
    >
      <LogOut />
      Logout
    </Button>
  );
}
