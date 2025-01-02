import { LogOut } from 'lucide-react';
import { Button } from '../../ui/button';

interface NavFooterProps {
  handleLogout?: () => void;
}

export function NavFooter({ handleLogout }: NavFooterProps) {
  return (
    <Button className="mt-4 flex flex-row justify-start space-x-2" onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
