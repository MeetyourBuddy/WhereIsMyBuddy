import { EditActivityForm } from '@/components/activity';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { useParams } from 'react-router-dom';

export const EditActivityPage = () => {
  const { id } = useParams();
  return (
    <ContentLayout title="Edit Activity">
      <EditActivityForm id={id as string} />
    </ContentLayout>
  );
};
