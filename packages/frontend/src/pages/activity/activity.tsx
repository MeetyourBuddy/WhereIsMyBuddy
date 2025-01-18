import { Button } from '@/components/common/ui/button';
import { Link } from 'react-router-dom';

export const Activity = () => {
  return (
    <div>
      <h2 className="mt-6 scroll-m-20 font-extrabold tracking-tight">Activity Feed</h2>

      <Button asChild className="mt-6">
        <Link to="/activity/create">Create Activity</Link>
      </Button>
    </div>
  );
};
