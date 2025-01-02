import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbLink
} from '../../ui/breadcrumb';
import React from 'react';

import { BreadcrumbList } from '../../ui/breadcrumb';
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
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs?.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.path}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </nav>
    );
  }
);
