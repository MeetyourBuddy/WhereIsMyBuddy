import {
  LayoutGrid,
  LucideIcon,
  Bell,
  Settings2,
  ChartBarIcon,
  UserCircleIcon,
  Activity
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: 'Dashboard',
          icon: LayoutGrid
        },
        {
          href: '/activity',
          label: 'Activity',
          icon: Activity
        },

        {
          href: '/profile',
          label: 'Profile',
          icon: UserCircleIcon
        },

        {
          href: '/analytics',
          label: 'Analytics',
          icon: ChartBarIcon
        },

        {
          href: '/settings',
          label: 'Settings',
          icon: Settings2
        },

        {
          href: '/notifications',
          label: 'Notifications',
          icon: Bell
        }
      ]
    }
  ];
}
