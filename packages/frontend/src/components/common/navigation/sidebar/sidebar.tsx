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
import { NavLink } from 'react-router-dom';

import { NavUser } from './nav-user';
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
    name: user?.data?.name || 'John Doe',
    email: user?.data?.email || 'johndoe@mail.com',
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
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
        <NavFooter handleLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function SidebarNavMain({
  items
}: {
  items: Array<{ title: string; url: string; icon: any }>;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavLink
          key={item.url}
          to={item.url}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              isActive ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50' : ''
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
