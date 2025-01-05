'use client';

import * as React from 'react';
import { ChartBarIcon, UserCircleIcon, Settings2, Activity, Bell, Loader2 } from 'lucide-react';

import { NavUser } from './nav-user';
import { NavMain } from './nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/common/ui/sidebar';
import { NavLogo } from './nav-logo';
import { NavFooter } from './nav-footer';
import { useAuth } from '@/lib/hooks/use-auth';
import { useAuthContext } from '@/providers/contexts/auth-context';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Activity',
      url: '/activity',
      icon: Activity,
      isActive: true,
      items: [
        {
          title: 'Feed',
          url: '/activity/feed'
        },
        {
          title: 'History',
          url: '#'
        }
      ]
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserCircleIcon,
      items: [
        {
          title: 'Personal',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        }
      ]
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartBarIcon,
      items: [
        {
          title: 'Personal',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Personal',
          url: '#'
        },
        {
          title: 'Group',
          url: '#'
        },
        {
          title: 'Account',
          url: '#'
        }
      ]
    },
    {
      title: 'Notifications',
      url: '#',
      icon: Bell,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Personal',
          url: '#'
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth();
  const { user } = useAuthContext();

  const userData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'johndoe@mail.com',
    avatar: '/avatars/user-profile.png'
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
        <NavFooter handleLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
