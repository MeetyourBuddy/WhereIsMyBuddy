import { MyActivity } from '@/components/activity/my-activity';
import { ContentLayout } from '@/components/admin-panel/content-layout';
export const MyActivityPage = () => {
  return (
    <ContentLayout title="Activity">
      <MyActivity />
    </ContentLayout>
  );
};
