import { ContentLayout } from '@/components/admin-panel/content-layout';
import { DashboardCard } from '@/components/dashboard/dashboard-card';

const Dashboard = () => {
  return (
    <ContentLayout title="Dashboard">
      <div className="container-default flex h-full flex-col space-y-6 bg-white py-8">
        <DashboardCard />
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
