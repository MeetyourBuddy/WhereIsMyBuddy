'use client';
import React, { useCallback, useState, forwardRef, useEffect } from 'react';

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/common/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/ui/popover';

// utils
import { cn } from '@/lib/utils';

// assets
import { ChevronDown, CheckIcon, Globe } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';

// data
import { countries } from 'country-data-list';

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export const CountryDropdown = React.forwardRef<HTMLButtonElement, CountryDropdownProps>(
  ({ className, value, onChange, onBlur, disabled, placeholder, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined);

    useEffect(() => {
      if (value) {
        const initialCountry = countries.all.find((country) => country.alpha3 === value);
        if (initialCountry) {
          setSelectedCountry(initialCountry);
        } else {
          // Reset selected country if defaultValue is not found
          setSelectedCountry(undefined);
        }
      } else {
        // Reset selected country if defaultValue is undefined or null
        setSelectedCountry(undefined);
      }
    }, [value]);

    const handleSelect = useCallback(
      (country: Country) => {
        console.log('🌍 CountryDropdown value: ', country);
        setSelectedCountry(country);
        onChange?.(country.alpha3);
        setOpen(false);
      },
      [onChange]
    );

    const triggerClasses = cn(
      'flex h-12 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm  placeholder:text-muted-foreground focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
          {selectedCountry ? (
            <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
              <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <CircleFlag countryCode={selectedCountry.alpha2.toLowerCase()} height={20} />
              </div>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountry.name}
              </span>
            </div>
          ) : (
            <span>{placeholder || setSelectedCountry?.name}</span>
          )}
          <ChevronDown size={16} />
        </PopoverTrigger>
        <PopoverContent
          collisionPadding={10}
          side="bottom"
          className="min-w-[--radix-popper-anchor-width] p-0"
        >
          <Command className="max-h-[200px] w-full sm:max-h-[270px]">
            <CommandList>
              <div className="sticky top-0 z-10 bg-popover">
                <CommandInput placeholder="Search country..." />
              </div>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.all
                  .filter((x) => x.name)
                  .map((option, key: number) => (
                    <CommandItem
                      className="flex w-full items-center gap-2"
                      key={key}
                      onSelect={() => handleSelect(option)}
                    >
                      <div className="flex w-0 flex-grow space-x-2 overflow-hidden">
                        <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                          <CircleFlag countryCode={option.alpha2.toLowerCase()} height={20} />
                        </div>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                          {option.name}
                        </span>
                      </div>
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4 shrink-0',
                          option.alpha3 === value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

CountryDropdown.displayName = 'CountryDropdown';
