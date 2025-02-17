import { Outlet, useLocation } from 'react-router-dom';
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import Onboarding from '@/pages/onboarding/onboarding';

export default function AppLayout() {
  const pathname = useLocation();
  const isOnboarding = pathname.pathname === '/onboarding';
  return (
    <>
      {isOnboarding ? (
        <Onboarding />
      ) : (
        <AdminPanelLayout>
          <Outlet />
        </AdminPanelLayout>
      )}
    </>
  );
}
