import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';
import { Icons } from '../common/icons';
import { IconButton } from '../common/ui/icon-button';

interface CheckInStats {
  checkedIn: number;
  notCheckedIn: number;
  skipping: number;
  onBreak: number;
}

interface CheckInCardProps {
  checkInStats: CheckInStats;
}

export const CheckInCard = ({ checkInStats }: CheckInCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Check-in</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">March 15, 2024</p>
        </div>
        <IconButton rightIcon="check" label="Check-in" className="w-[150px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div className="space-y-2">
          <p className="mt-2 text-sm font-medium">
            Saturday is here! How are your tasks going?{' '}
            <span className="text-blue-500">#studyday</span>
          </p>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-3">
            {Object.entries(checkInStats).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full ${
                      key === 'checkedIn'
                        ? 'bg-green-500'
                        : key === 'notCheckedIn'
                          ? 'bg-yellow-500'
                          : key === 'skipping'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                    }`}
                    style={{
                      width: `${(value / 28) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Icons.thumbsUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">24 likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Icons.messageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">12 comments</span>
            </div>
          </div>
          <Icons.bookmark className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};
