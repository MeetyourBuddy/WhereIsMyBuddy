'use client';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/common/ui/sidebar';
import Logo_alt from '../icons/Logo_alt';

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Logo_alt className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Buddy</h1>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
