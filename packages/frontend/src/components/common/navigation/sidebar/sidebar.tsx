'use client';

import * as React from 'react';
import {
  ChartBarIcon,
  UserCircleIcon,
  Settings2,
  Activity,
  Bell,
  Loader2,
  LayoutDashboard
} from 'lucide-react';

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

// This is sample navigation data. Will replace with actual data when structure is finalized.
const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard
    },
    {
      title: 'Activity',
      url: '/activity',
      icon: Activity
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserCircleIcon
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartBarIcon
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: Bell
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

  const handleLogout = () => {
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
