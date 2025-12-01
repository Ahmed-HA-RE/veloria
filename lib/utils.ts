import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToPlainObject = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export const successToast = (message: string | undefined) => {
  toast.success(message, {
    style: {
      '--normal-bg':
        'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
      '--normal-text':
        'light-dark(var(--color-green-600), var(--color-green-400))',
      '--normal-border':
        'light-dark(var(--color-green-600), var(--color-green-400))',
    } as React.CSSProperties,
  });
};
export const destructiveToast = (message: string | undefined) => {
  toast.error(message, {
    style: {
      '--normal-bg':
        'color-mix(in oklab, var(--destructive) 10%, var(--background))',
      '--normal-text': 'var(--destructive)',
      '--normal-border': 'var(--destructive)',
    } as React.CSSProperties,
  });
};

export const infoToast = (message: string | undefined) => {
  toast.info(message, {
    style: {
      '--normal-bg':
        'color-mix(in oklab, var(--color-blue-500) 10%, var(--background))',
      '--normal-text': 'var(--color-blue-500)',
      '--normal-border': 'var(--color-blue-500)',
    } as React.CSSProperties,
  });
};

export const moneyAmountString = () => {
  return z
    .string()
    .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
      message: 'Must be a number with exactly 2 decimal places',
    })
    .refine((val) => Number.parseFloat(val) >= 0, {
      message: 'Money amount must be greater than 0',
    });
};

export const roundToTwoDecimals = (num: number) => {
  const factor = Math.pow(10, 2);
  return Math.round(num * factor) / factor;
};

// Cities list for select input
export const UAECITIES = [
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Sharjah', label: 'Sharjah' },
  { value: 'Ajman', label: 'Ajman' },
  { value: 'Umm Al Quwain', label: 'Umm Al Quwain' },
  { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
  { value: 'Fujairah', label: 'Fujairah' },
];

// Shorten orders id for display
export const formatId = (id: string) => {
  return `...${id.slice(id.length - 8)}`;
};

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const convertToNumber = (value: string | number): number => {
  if (typeof value === 'string') {
    return Number(value);
  } else {
    return value;
  }
};

// Sorting products options
export const PRODUCT_SORT_OPTIONS = ['newest', 'lowest', 'highest', 'rating'];

export const productsPriceRanges = [
  { id: 'all', label: 'All Prices', value: null },
  { id: '50-100', label: 'AED 50 - AED 100', value: '50-100' },
  { id: '100-200', label: 'AED 100 - AED 200', value: '100-200' },
  { id: '200-500', label: 'AED 200 - AED 500', value: '200-500' },
  { id: '500-1000', label: 'AED 500 - AED 1000', value: '500-1000' },
  { id: 'over-1000', label: 'Over AED 1000', value: '1000' },
];
