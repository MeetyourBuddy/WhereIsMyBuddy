import { clsx, type ClassValue } from 'clsx';
import { CityByCountry } from './constants/location-constant';
import { twMerge } from 'tailwind-merge';
import { Country } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LocationOption {
  label: string;
  value: string;
}

export const countries: LocationOption[] = Object.values(Country).map((country) => ({
  label: country,
  value: country
}));

export const citiesByCountry: Record<Country, LocationOption[]> = Object.entries(
  CityByCountry
).reduce(
  (acc, [country, cities]) => ({
    ...acc,
    [country]: cities.map((city) => ({
      label: city,
      value: city
    }))
  }),
  {} as Record<Country, LocationOption[]>
);
