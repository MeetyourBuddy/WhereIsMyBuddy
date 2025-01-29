import { DashboardCard } from '@/components/dashboard/dashboard-card';

const Dashboard = () => {
  return (
    <div className="container-default flex h-full flex-col space-y-6 bg-white py-8">
      <h3 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Dashboard Feed</h3>
      <DashboardCard />
    </div>
  );
};

export default Dashboard;
