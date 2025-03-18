import { formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__');
}

export function chatHrefConstructor(
  id1: string,
  id2: string,
  id3: string,
  session: any
) {
  if (session?.user?.role === 'surgeon') {
    return `${id2}--${id1}--${id3}`;
  }
  // return `${sortedIds[0]}--${sortedIds[1]}--${id3}`;
  return `${id1}--${id2}--${id3}`;
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | Date) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};
export const formatTimeAgo = (date: string | Date) => {
  if (!date) return 'Unknown date';
  const postedDate = new Date(date);
  if (isNaN(postedDate.getTime())) return 'Invalid date';
  return formatDistanceToNow(postedDate, { addSuffix: true });
};
