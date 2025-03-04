'use client';

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import UnseenChatToast from '@/components/UnseenChatToast';
import { toPusherKey } from '@/lib/utils';

interface ToastProviderProps {
  sessionId: string;
  jobId: string;
}

const ToastProvider = ({ sessionId, jobId }: ToastProviderProps) => {
  useEffect(() => {
    if (!sessionId || !jobId) return;

    const chatChannel = toPusherKey(`user:${sessionId}--${jobId}:chats`);
    const notificationChannel = toPusherKey(`user:${sessionId}:chats`);
    console.log('channel', notificationChannel);
    console.log('Subscribing to channels:', {
      chatChannel,
      notificationChannel,
    });

    pusherClient.subscribe(chatChannel);
    pusherClient.subscribe(notificationChannel);

    // ✅ Chat message notification
    const chatHandler = (message: any) => {
      if (message.receiver !== sessionId) return;

      toast.custom((t) => (
        <UnseenChatToast
          t={t}
          sessionId={sessionId}
          senderId={message.sender}
          senderImg={message.senderImg}
          senderMessage={message.content}
          senderName={message.senderName}
        />
      ));
    };

    // ✅ General notification toast
    const notificationHandler = (message: any) => {
      if (message.receiver !== sessionId) return;

      toast.success(`New message from ${message.senderName}`);
    };

    pusherClient.bind('new_message', chatHandler);
    pusherClient.bind('notificaiton_toast', notificationHandler);

    pusherClient.connection.bind('connected', () => {
      console.log('Pusher connected');
    });

    pusherClient.connection.bind('error', (error) => {
      console.error('Pusher error:', error);
    });

    return () => {
      pusherClient.unsubscribe(chatChannel);
      pusherClient.unsubscribe(notificationChannel);
      pusherClient.unbind('new_message', chatHandler);
      pusherClient.unbind('notificaiton_toast', notificationHandler);
    };
  }, [sessionId, jobId]);

  return null;
};

export default ToastProvider;
