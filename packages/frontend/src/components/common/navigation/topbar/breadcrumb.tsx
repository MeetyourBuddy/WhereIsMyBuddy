import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/common/ui/breadcrumb';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { BreadcrumbList } from '@/components/common/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps extends React.ComponentProps<'nav'> {
  breadcrumbs?: BreadcrumbItem[];
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ breadcrumbs, className, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="breadcrumb" className={cn('flex', className)} {...props}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <NavLink to="/" className="hover:text-foreground">
              Dashboard
            </NavLink>
          </BreadcrumbItem>
          {breadcrumbs?.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <NavLink to={item.path} className="hover:text-foreground">
                    {item.label}
                  </NavLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </nav>
    );
  }
);
