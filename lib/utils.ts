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
  return Math.round((num + Number.EPSILON) * 100) / 100;
};
