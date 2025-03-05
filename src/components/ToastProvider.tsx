import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { toast } from 'react-hot-toast';
import { toPusherKey } from '@/lib/utils';
import { useDispatch } from 'react-redux';
import UnseenChatToast from './UnseenChatToast';
import { useParams } from 'next/navigation';
import { Session } from 'next-auth';
import { JobData } from '@/app/(dashboard)/dashboard/requests/page';

interface ToastProviderProps {
  session: Session | null;
}

const ToastProvider = ({ session }: ToastProviderProps) => {
  const dispatch = useDispatch();
  const params = useParams<{ chatId?: string }>();
  const chatId = params?.chatId || '';
  const sessionId = session?.user?.id;
  const userEmail = session?.user?.email;
  const [receiverId, senderId, jobId] = chatId.split('--') as [
    string,
    string,
    string
  ];
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
  }, [sessionId, dispatch, jobId, receiverId, senderId, session]);
  // useEffect(() => {
  //   if (!userEmail) return;

  //   const jobChannel = toPusherKey(`surgeon:${userEmail}:jobs`);
  //   pusherClient.subscribe(jobChannel);

  //   const jobHandler = (newJob: JobData) => {
  //     toast.success(`New job assigned: ${newJob.title}`, {
  //       position: 'top-right',
  //       icon: '📨',
  //     });
  //     setNewJob(newJob);
  //   };

  //   pusherClient.bind('new_job', jobHandler);

  //   return () => {
  //     pusherClient.unsubscribe(jobChannel);
  //     pusherClient.unbind('new_job', jobHandler);
  //   };
  // }, [userEmail]);
  return null;
};

export default ToastProvider;
