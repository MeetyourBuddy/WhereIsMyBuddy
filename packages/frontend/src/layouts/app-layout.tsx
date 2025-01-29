import { Outlet } from 'react-router-dom';
import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
export default function AppLayout() {
  return (
    <AdminPanelLayout>
      <Outlet />
    </AdminPanelLayout>
  );
}
