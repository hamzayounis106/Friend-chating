import { ClassValue, clsx } from 'clsx';

import { twMerge } from 'tailwind-merge';

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
