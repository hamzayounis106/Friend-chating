import { authOptions } from '@/lib/auth';

import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import User from '@/app/models/User';
import FriendRequest from '@/app/models/Job';
import FriendRequests from '@/components/FriendRequests';

const Page = async () => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // Get incoming friend requests with sender details
  const incomingFriendRequests = await FriendRequest.find({
    receiver: session.user.id.toString(),
    status: 'pending',
  })
    .populate({
      path: 'sender',
      model: User,
      select: 'email name image',
    })
    .lean();

  // Convert to proper format
  const formattedRequests = incomingFriendRequests.map((request) => ({
    senderId: request.sender._id.toString(),
    senderEmail: (request.sender as any).email, // Adjust type as needed
  }));

  // Pusher integration for real-time updates

  pusherServer.trigger(
    `user-${session.user.id.toString()}`, // Convert to string and add prefix
    'incoming-friend-requests',
    { count: incomingFriendRequests.length }
  );

  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests
          incomingFriendRequests={formattedRequests}
          sessionId={session.user.id.toString()}
        />
      </div>
    </main>
  );
};

export default Page;
