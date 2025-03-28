import { IActivityResult } from '@/types/activity-types';
import { CheckInForm } from './check-in/check-in-form';
import { useCheckIn } from '@/lib/hooks/use-checkin';
import { useState } from 'react';

interface ActivityDetailProps {
  activity: IActivityResult;
}

export const ActivityDetail = ({ activity }: ActivityDetailProps) => {
  const { getCheckIns } = useCheckIn(activity.id);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCheckInSuccess = async () => {
    setRefreshKey((prev) => prev + 1);
    await getCheckIns();
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold">{activity.title}</h2>
        <p className="text-muted-foreground">{activity.description}</p>

        {/* Activity details */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Type</h3>
            <p className="capitalize">{activity.type.toLowerCase()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Participants</h3>
            <p>
              {activity.currentSize} / {activity.maxSize}
            </p>
          </div>
          {/* Add more activity details as needed */}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Check-in</h3>
        <CheckInForm
          key={refreshKey}
          activityId={activity.id}
          allowedTypes={activity.allowedCheckInTypes as any[]}
          onSuccess={handleCheckInSuccess}
        />
      </div>
    </div>
  );
};
