import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Icons } from '../common/icons';
import { IconButton } from '../common/ui/icon-button';
import { Button } from '../common/ui/button';

interface CheckInStats {
  checkedIn: number;
  notCheckedIn: number;
}

const ProgressBar = ({ value, total }: { value: number; total: number }) => {
  const percentage = Math.round((value / total) * 100);

  return (
    <div className="w-full">
      <div className="relative h-10 w-full rounded-lg bg-gray-200">
        <div
          className="h-10 rounded-l-lg bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute left-0 right-0 top-2 flex justify-between px-2">
          <span className="text-base font-medium text-white">{percentage}%</span>
          <span className="text-base font-medium text-primary">{100 - percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export const CheckInCard = () => {
  // Example stats - replace with actual data
  const stats: CheckInStats = {
    checkedIn: 12,
    notCheckedIn: 4
  };

  const totalMembers = stats.checkedIn + stats.notCheckedIn;

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-between rounded-t-xl border-2 border-brand-10 bg-gray-10">
        <div className="flex w-full items-center justify-between gap-2">
          <div>
            <CardTitle className="text-2xl">Check-in</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">March 15, 2024</p>
          </div>
          <IconButton rightIcon="check" label="Check-in" className="w-[150px]" />
        </div>
        <div className="flex w-full items-center justify-center gap-2 pt-2">
          <div className="flex w-full flex-col">
            <h3 className="mb-2 text-sm font-medium">
              Check-in Progress - {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </h3>
            <ProgressBar value={stats.checkedIn} total={totalMembers} />
          </div>
        </div>
        {/* <Separator /> */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="mt-2 text-sm font-medium">
            Saturday is here! How are your tasks going?{' '}
            <span className="text-blue-500">#studyday</span>
          </p>
        </div>

        <img
          src="/background/ski-race.jpg"
          alt="Check-in-image"
          className="h-[400px] w-full rounded-xl"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Icons.thumbsUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">24 likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Icons.messageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">12 check-ins</span>
            </div>
            <div className="flex items-center gap-1">
              <Icons.share className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Share</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-primary bg-transparent text-primary"
          >
            View All Check-ins
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
