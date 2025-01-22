'use client';

import { CardBody, CardContainer, CardItem } from '@/components/common/ui/3d-card';
import { Clock, MapPin, Target, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { Badge } from '@/components/common/ui/badge';
import { type IUserData } from '@/types/user-types';
import { Separator } from '@radix-ui/react-separator';
import { IconButton } from '../common/ui/icon-button';

interface ProfileCardProps {
  profile: IUserData;
  onConnect?: () => void;
}

const profileImage = '/avatars/user-profile.png';

export const ProfileCard = ({ profile, onConnect }: ProfileCardProps) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-white p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] sm:w-[30rem]">
        {/* Header with Avatar and Basic Info */}
        <div className="flex h-full flex-col">
          <CardItem translateZ="50" className="flex w-full flex-col items-center gap-6">
            <Avatar className="h-[100px] w-[100px] bg-gradient-to-r from-green-500 to-primary ring-2 ring-primary/20">
              <AvatarImage src={profileImage} alt={profile.name} />
              <AvatarFallback>
                <User2 className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-3">
              <CardItem
                translateZ="60"
                className="w-full text-center text-xl font-semibold tracking-tight text-neutral-600 dark:text-white"
              >
                {profile?.name?.toUpperCase()}
              </CardItem>
              <CardItem
                translateZ="50"
                className="flex w-full items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {profile.city}, {profile.country}
                </span>
                <Separator orientation="vertical" className="h-4 border-2" />
                <span>
                  <Clock className="h-4 w-4" />
                  {profile.timezone}
                </span>
              </CardItem>
            </div>
          </CardItem>

          {/* Bio Section */}
          <CardItem translateZ="40" className="mt-6">
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-300">
              {profile.bio}
            </p>
          </CardItem>

          {/* Interests Section - Now centered vertically */}
          <CardItem translateZ="40" className="flex flex-1 items-center">
            <div className="w-full space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Interests</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.interestsCommodities && profile.interestsCommodities.length > 0 ? (
                  profile.interestsCommodities?.map((interest) => (
                    <Badge
                      key={interest}
                      variant="default"
                      className="transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                    >
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <div>
                    No interests selected. Go to your profile to select interests to make this place
                    look less empty 😉.
                  </div>
                )}
              </div>
            </div>
          </CardItem>

          {/* Collaboration Status and Share Button - Now at bottom */}
          <CardItem translateZ="30" className="mb-20 w-full">
            <div className="text-center">
              <Badge
                variant="secondary"
                className={`transition-all hover:scale-105 ${
                  profile.collaborationStatus === 'open'
                    ? 'border-0 bg-gradient-to-r from-green-500 to-primary text-white'
                    : 'border-0 bg-gray-500 text-white'
                }`}
              >
                {profile.collaborationStatus === 'open'
                  ? '✨ Open to Collaborate'
                  : 'Not Available'}
              </Badge>
            </div>
          </CardItem>
          <div className="flex w-full justify-end">
            <IconButton
              onClick={onConnect}
              className="max-w-[200px] rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
              rightIcon="send"
              label="Share Profile"
            />
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );
};
