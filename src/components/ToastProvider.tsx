import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import { toPusherKey } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import UnseenChatToast from './UnseenChatToast';
import { useParams, usePathname } from 'next/navigation';
import { Session } from 'next-auth';

interface ToastProviderProps {
  session: Session | null;
}

const ToastProvider = ({ session }: ToastProviderProps) => {
  const dispatch = useDispatch();
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId || '';
  const sessionId = session?.user?.id;

  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    if (!sessionId) return;
    const notificationChannel = toPusherKey(`user:${sessionId}:chats`);
    pusherClient.subscribe(notificationChannel);
    console.log(
      '✅ Expected backend channel:',
      toPusherKey(`user:${sessionId}:chats`)
    );

    const chatHandler = (message: any) => {
      if (message.receiver !== sessionId) return;

      // Define the exact route where the toast should NOT be shown
      const blockedPath = `/dashboard/chat/${chatId}`;

      if (pathname === blockedPath) return;
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
    };
  }, [sessionId, dispatch, session, chatId, pathname]);
  return null;
};

export default ToastProvider;
