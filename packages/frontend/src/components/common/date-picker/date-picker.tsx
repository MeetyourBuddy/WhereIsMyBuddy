'use client';

import { format } from 'date-fns';
import * as React from 'react';

import { Button } from '@/components/common/ui/button';
import { Calendar } from '@/components/common/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export default function DatePicker({
  className,
  placeholder
}: {
  className?: string;
  placeholder?: string;
}) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-gray-40',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          autoFocus
          startMonth={new Date(1999, 11)}
          endMonth={new Date(2025, 2)}
          className="w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
