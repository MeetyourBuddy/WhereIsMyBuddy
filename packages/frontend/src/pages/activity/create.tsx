import { CreateActivityForm } from '@/components/activity/create-activity-form';
import { ContentLayout } from '@/components/admin-panel/content-layout';
export const CreateActivityPage = () => {
  return (
    <ContentLayout title="Create Activity">
      <CreateActivityForm />
    </ContentLayout>
  );
};
