// app/success/statusContentMap.ts
import { JSX } from 'react';
import { SuccessIcon, ErrorIcon, InfoIcon } from './icons'; // Import the icons

export const STATUS_CONTENT_MAP: Record<
  string,
  { text: string; iconColor: string; icon: JSX.Element }
> = {
  succeeded: {
    text: 'Payment succeeded',
    iconColor: '#30B130',
    icon: SuccessIcon,
  },
  processing: {
    text: 'Your payment is processing.',
    iconColor: '#6D6E78',
    icon: InfoIcon,
  },
  requires_payment_method: {
    text: 'Your payment was not successful, please try again.',
    iconColor: '#DF1B41',
    icon: ErrorIcon,
  },
  default: {
    text: 'Something went wrong, please try again.',
    iconColor: '#DF1B41',
    icon: ErrorIcon,
  },
};
