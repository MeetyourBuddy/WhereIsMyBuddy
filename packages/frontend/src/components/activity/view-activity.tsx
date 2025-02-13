import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { Badge } from '@/components/common/ui/badge';
import { Icons } from '../common/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/ui/tabs';
import { IconButton } from '../common/ui/icon-button';
import { CheckInCard } from './check-in-card';
import { AvatarStack } from '../common/ui/avatar-stack';
import { useNavigate } from 'react-router-dom';
import { MembersTable } from './members-table';

// TODO: Remove this - this is a mock activity
const activity: ViewActivityProps['activity'] = {
  id: '1',
  title: 'Learn React and Lucide Icons',
  description:
    'This is an actvity for the learning of the react and javascript language along with the use of the lucide icons. This is to encourage collaboration and to learn new things.',
  bannerUrl: '/background/balloons.jpg',
  stats: {
    leader: {
      position: 1,
      name: 'John Doe'
    },
    yourPosition: {
      position: 4,
      name: 'Jane Doe'
    },
    daysLeft: 2
  },
  organizer: {
    name: 'Jack Bauer',
    avatar: '/avatars/msnice.png'
  },
  details: {
    groupType: 'Public',
    status: 'Flexible',
    capacity: 10,
    startDate: '2024-01-01',
    duration: '90 days',
    frequency: 'Daily'
  },
  rules: [
    'You must be 18 years or older',
    'You must be willing to learn',
    'You must be willing to share your knowledge',
    'You must be willing to help others'
  ],
  tags: ['React', 'Lucide Icons', 'JavaScript']
};

const members = [
  {
    id: '1',
    name: 'John Doe',
    image: '/avatars/mrnice.png',
    username: 'johndoe',
    standing: '1st',
    checkIns: 18,
    profileUrl: '/profile/johndoe'
  },
  {
    id: '2',
    name: 'Jane Smith',
    image: '/avatars/msnice.png',
    username: 'jan3esmith',
    standing: '3rd',
    checkIns: 10,
    profileUrl: '/profile/janesmith'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    image: '/avatars/mrnobody.png',
    username: 'bobjohnson',
    standing: '4th',
    checkIns: 8,
    profileUrl: '/profile/bobjohnson'
  },
  {
    id: '4',
    name: 'Alice Brown',
    image: '/avatars/msnobody.png',
    username: 'alicebrown',
    standing: '2nd',
    checkIns: 16,
    profileUrl: '/profile/alicebrown'
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    image: '/avatars/mra.png',
    username: 'charliewilson',
    standing: '5th',
    checkIns: 6,
    profileUrl: '/profile/charliewilson'
  }
];

interface ViewActivityProps {
  activity: {
    id: string;
    title: string;
    description: string;
    bannerUrl: string;
    stats: {
      leader: {
        position: number;
        name: string;
      };
      yourPosition: {
        position: number;
        name: string;
      };
      daysLeft: number;
    };
    organizer: {
      name: string;
      avatar: string;
    };
    details: {
      groupType: string;
      status: string;
      capacity: number;
      startDate: string;
      duration: string;
      frequency: string;
    };
    rules: string[];
    tags: string[];
  };
}

export const ViewActivity = () => {
  const navigate = useNavigate();
  return (
    <div className="container-default min-h-full max-w-full px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left Column - 2/3 width */}
        <Card className="h-full flex-1 md:w-2/3">
          <CardContent className="space-y-6 p-6">
            {/* Banner */}
            <div className="h-48 w-full overflow-hidden rounded-lg">
              <img
                src={activity.bannerUrl}
                alt="Activity banner"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{activity.title}</h1>
                <IconButton
                  rightIcon="edit"
                  variant="outline"
                  label="Edit Activity"
                  className="h-10 w-auto"
                  onClick={() => {
                    navigate(`/activity/${activity.id}/update`);
                  }}
                />
              </div>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            {/* Stats Section */}
            <Card>
              <CardContent className="grid grid-cols-3 gap-4 p-6">
                <div className="flex flex-col items-center">
                  <Icons.crown className="h-8 w-8" />
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold">{activity.stats.leader.position}</p>
                    <p className="text-sm text-gray-600">Leader: {activity.stats.leader.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Icons.userCircle className="h-8 w-8" />
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold">{activity.stats.yourPosition.position}</p>
                    <p className="text-sm text-gray-600">You: {activity.stats.yourPosition.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Icons.calendarDays className="h-8 w-8" />
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold">{activity.stats.daysLeft}</p>
                    <p className="text-sm text-gray-600">Days Left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <CheckInCard />
              </TabsContent>

              <TabsContent value="members">
                <MembersTable members={members} />
              </TabsContent>

              <TabsContent value="gallery">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Gallery content coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground">Calendar content coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Column - 1/3 width */}
        <Card className="h-full md:w-1/3">
          <CardContent className="space-y-6 p-6">
            <h3 className="text-2xl font-bold">Activity Details</h3>
            <IconButton rightIcon="check" label="Check-In" />
            {/* Members Section */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Members</h3>
                  <span className="text-sm text-gray-600">{members.length} members</span>
                </div>
                <div className="flex justify-end -space-x-2">
                  {/* Add dynamic avatar list here */}
                  <AvatarStack users={members} maxCount={4} />
                </div>
              </CardContent>
            </Card>

            {/* About Activity */}
            <Card>
              <CardHeader>
                <CardTitle>About Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-justify text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center gap-2">
                  <Icons.userCircle className="h-5 w-5" />
                  <span>Organizer: {activity.organizer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.users className="h-5 w-5" />
                  <span>Group Type: {activity.details.groupType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status: </span>
                  <Badge variant="outline">{activity.details.status}</Badge>
                </div>
                <div>
                  <span>Capacity: {activity.details.capacity} members</span>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Details */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <Icons.calendarDays className="h-5 w-5" />
                  <span>Starts: {activity.details.startDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.clock className="h-5 w-5" />
                  <span>Duration: {activity.details.duration}</span>
                </div>
                <div>
                  <span>Frequency: {activity.details.frequency}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.rules?.map((rule) => (
                  <ul key={rule} className="list-disc">
                    <li className="ml-6 text-sm text-gray-600">{rule}</li>
                  </ul>
                ))}
              </CardContent>
            </Card>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
