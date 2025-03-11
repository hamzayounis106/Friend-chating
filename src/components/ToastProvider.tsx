import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import { toPusherKey } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import UnseenChatToast from './toasts/UnseenChatToast';
import { useParams, usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { addOffer } from '@/store/slices/offerSlice';

interface ToastProviderProps {
  session: Session | null;
}

const ToastProvider = ({ session }: ToastProviderProps) => {
  const dispatch = useDispatch();
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId || '';
  const sessionId = session?.user?.id;
  const [userId1_p, userId2_p, jobId_p] = chatId.split('--');
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    if (!sessionId) return;
    const notificationChannel = toPusherKey(`user:${sessionId}:chats`);
    if (pusherClient.channel(notificationChannel)) {
      console.log('Already subscribed to channel:', notificationChannel);
      return;
    }
    pusherClient.subscribe(notificationChannel);
    console.log(
      '✅ Subscribed to channel:',
      notificationChannel
      // toPusherKey(`user:${sessionId}:chats`)
    );

    const chatHandler = (message: any) => {
      if (message.receiver !== sessionId) return;
      // If the message type is "offer", always show the toast
      if (message.type === 'offer_created') {
        console.log('��� Offer notification received!', message);
        dispatch(addOffer(message));
        toast.custom((t) => (
          <UnseenChatToast
            t={t}
            sessionId={sessionId}
            senderId={message.sender}
            senderImg={message.senderImg}
            senderMessage={message.content}
            senderName={message.senderName}
            jobId={message?.jobId}
            session={session}
          />
        ));
        return;
      }
      if (message.type === 'invite_accepted') {
        console.log('update the noticiation count here 🔔🔔🔔🔔🔔🔔🔔🔔🔔');
        console.log('🎉 invite accepted', message);
        toast.custom((t) => (
          <UnseenChatToast
            t={t}
            sessionId={sessionId}
            senderId={message.sender}
            senderImg={message.senderImg}
            senderMessage={message.content}
            senderName={message.senderName}
            jobId={message?.jobId}
            session={session}
          />
        ));
        return;
      }

      // If type is undefined or not provided, apply existing logic
      const isOnDetailOrOfferPage =
        chatId.includes('job-detail') || chatId.includes('offer');

      if (
        userId1_p === message.receiver &&
        userId2_p === message.sender &&
        jobId_p === message.jobId &&
        !isOnDetailOrOfferPage
      )
        return;

      console.log('all conditions matched 😎😎😎😎😎😎😎😎😎😎😎😎');

      const blockedPath = `/dashboard/chat/${chatId}`;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.sender}
          senderImg={message.senderImg}
          senderMessage={message.content}
          senderName={message.senderName}
          jobId={message?.jobId}
          session={session}
        />
      ));
    };

    pusherClient.bind('notification_toast', chatHandler);
    pusherClient.connection.bind('connected', () => {
      console.log('✅ Pusher connected successfully!');
    });
    pusherClient.connection.bind('error', (error: any) => {
      console.log('❌ Pusher error:', error);
    });

    return () => {
      pusherClient.unsubscribe(notificationChannel);
      pusherClient.unbind('notification_toast', chatHandler);
      console.log('❌ Unsubscribed from channel:', notificationChannel);
    };
  }, [
    sessionId,
    dispatch,
    session,
    chatId,
    pathname,
    jobId_p,
    userId1_p,
    userId2_p,
  ]);
  return null;
};

export default ToastProvider;
