import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import { toPusherKey } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import UnseenChatToast from './UnseenChatToast';
import { useParams } from 'next/navigation';

interface ToastProviderProps {
  sessionId: string;
}

const ToastProvider = ({ sessionId }: ToastProviderProps) => {
  const dispatch = useDispatch();
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId || '';

  const [receiverId, senderId, jobId] = chatId.split('--') as [
    string,
    string,
    string
  ];
  console.log('console.log for the chat id', receiverId, senderId, jobId);
  useEffect(() => {
    if (!sessionId) return;

    const notificationChannel = toPusherKey(`user:${sessionId}:chats`);
    pusherClient.subscribe(notificationChannel);
    console.log('✅ Frontend subscribing to:', notificationChannel);
    console.log(
      '✅ Expected backend channel:',
      toPusherKey(`user:${sessionId}:chats`)
    );

    const chatHandler = (message: any) => {
      console.log('🔥 Event received in frontend!', message);
      if (message.receiver !== sessionId) return;
      if (
        message.receiver === receiverId &&
        message.sender === senderId &&
        message.jobId === jobId
      )
        return;
      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.sender}
          senderImg={message.senderImg}
          senderMessage={message.content}
          senderName={message.senderName}
          jobId={message?.jobId}
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
  }, [sessionId, dispatch]);

  return null;
};

export default ToastProvider;
