"use client";

import { useState, useEffect } from "react";
import {
  BellIcon,
  CheckIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";
import { Popover } from "@headlessui/react";
import { toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";

type Notification = {
  _id: string;
  message: string;
  link?: string;
  isSeen: boolean;
  senderId: string;
  receiverId: string;
  notificationType: string;
  createdAt: string;
  updatedAt: string;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const session = useSession();
  const sessionId = session?.data?.user?.id;
  const dispatch = useDispatch();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/notifications");
      console.log("notifications ", response.data.notifications);
      setNotifications(response.data.notifications);
      setUnseenCount(response.data.unseenCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as seen
  const markAsSeen = async (notificationIds: string[]) => {
    if (notificationIds.length === 0) return;

    try {
      await axios.patch("/api/notifications", { notificationIds });
      setNotifications((prev) =>
        prev.map((notification) =>
          notificationIds.includes(notification._id)
            ? { ...notification, isSeen: true }
            : notification
        )
      );
      setUnseenCount((prev) => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error("Failed to mark notifications as seen:", error);
    }
  };

  // Update notification count and optionally refresh notifications
  const incrementNotificationCount = (shouldRefresh = false) => {
    setUnseenCount((prevCount) => prevCount + 1);
    console.log("🔔 Notification count increased!");

    if (shouldRefresh) {
      fetchNotifications();
    }
  };

  // Set up Pusher for real-time notifications
  // useEffect(() => {
  //   if (!sessionId) return;

  //   const notificationChannel = toPusherKey(`user:${sessionId}:chats`);

  //   // Subscribe to the channel
  //   pusherClient.subscribe(notificationChannel);

  //   console.log("✅ Subscribed to channel:", notificationChannel);

  //   // Define the notification handler
  //   const notificationHandler = (message: any) => {
  //     if (message.receiver !== sessionId) return;

  //     console.log("✅ Received message:", message);

  //     // Handle specific notification types
  //     if (message.type === "offer") {
  //       console.log("🎉 Offer notification received!");
  //       incrementNotificationCount();
  //       return;
  //     }

  //     if (message.type === "invite_accepted") {
  //       console.log("🎉 Invite accepted notification received!");
  //       incrementNotificationCount();
  //       return;
  //     }

  //     // Handle other notification types
  //     console.log("📩 Other notification received, incrementing count");
  //     incrementNotificationCount();
  //   };

  //   // Set up connection event handlers
  //   pusherClient.connection.bind("connected", () => {
  //     console.log("✅ Pusher connected successfully!");
  //   });

  //   pusherClient.connection.bind("error", (error: any) => {
  //     console.error("❌ Pusher error:", error);
  //   });

  //   // Bind the notification handler to the event
  //   pusherClient.bind("notification_toast", notificationHandler);

  //   // Cleanup function
  //   return () => {
  //     console.log("Cleaning up Pusher subscriptions");
  //     pusherClient.unsubscribe(notificationChannel);
  //     pusherClient.unbind("notification_toast", notificationHandler);
  //     pusherClient.connection.unbind("connected");
  //     pusherClient.connection.unbind("error");
  //   };
  // }, [sessionId]);
  // Set up Pusher for real-time notifications
  useEffect(() => {
    if (!sessionId) return;

    // Channel for general notifications
    const notificationChannel = toPusherKey(`user:${sessionId}:chats`);

    // Channel for job notifications - use the user's email if available
    const jobChannel = session?.data?.user?.email
      ? toPusherKey(`surgeon:${session.data.user.email}:jobs`)
      : null;

    // Subscribe to the channels
    pusherClient.subscribe(notificationChannel);
    console.log("✅ Subscribed to notification channel:", notificationChannel);

    if (jobChannel) {
      pusherClient.subscribe(jobChannel);
      console.log("✅ Subscribed to job channel:", jobChannel);
    }

    // Define the notification handler for general notifications
    const notificationHandler = (message: any) => {
      console.log("✅ Received notification message in bell:", message);
      if (message.type !== "offer" || message.type !== "invite_accepted")
        return;
      if (message.receiver !== sessionId) return;

      console.log("✅ Received notification message:", message);

      // Handle specific notification types
      if (message.type === "offer") {
        console.log("🎉 Offer notification received!");
        incrementNotificationCount();
        return;
      }

      if (message.type === "invite_accepted") {
        console.log("🎉 Invite accepted notification received!");
        incrementNotificationCount();
        return;
      }

      // Handle other notification types
      console.log("📩 Other notification received, incrementing count");
      incrementNotificationCount();
    };

    // Define handler for job notifications
    const jobNotificationHandler = (message: any) => {
      console.log("✅ Received job notification:", message);

      if (message.typeOfNotification === "job") {
        console.log("🎉 New job notification received!");
        incrementNotificationCount(true); // True to refresh notifications
      }
    };

    // Set up connection event handlers
    pusherClient.connection.bind("connected", () => {
      console.log("✅ Pusher connected successfully!");
    });

    pusherClient.connection.bind("error", (error: any) => {
      console.error("❌ Pusher error:", error);
    });

    // Bind the notification handlers to the events
    pusherClient.bind("notification_toast", notificationHandler);

    if (jobChannel) {
      pusherClient.bind("new_job", jobNotificationHandler);
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up Pusher subscriptions");
      pusherClient.unsubscribe(notificationChannel);
      pusherClient.unbind("notification_toast", notificationHandler);

      if (jobChannel) {
        pusherClient.unsubscribe(jobChannel);
        pusherClient.unbind("new_job", jobNotificationHandler);
      }

      pusherClient.connection.unbind("connected");
      pusherClient.connection.unbind("error");
    };
  }, [sessionId, session?.data?.user?.email]);
  // Initial fetch
  useEffect(() => {
    if (sessionId) {
      fetchNotifications();
    }
  }, [sessionId]);

  // Refetch when pathname changes
  useEffect(() => {
    if (sessionId) {
      fetchNotifications();
    }
  }, [pathname, sessionId]);

  // Get notification color based on type
  const getNotificationColor = (type: string, isSeen: boolean): string => {
    let baseColor = "";

    switch (type) {
      case "job_invite":
        baseColor = "bg-blue-100 border-blue-300";
        break;
      case "job_acceptance":
        baseColor = "bg-green-100 border-green-300";
        break;
      case "offer_created":
        baseColor = "bg-indigo-100 border-indigo-300";
        break;
      case "offer_accepted":
        baseColor = "bg-green-100 border-green-300";
        break;
      case "offer_declined":
        baseColor = "bg-purple-100 border-purple-300";
        break;
      case "send_message":
        baseColor = "bg-yellow-100 border-yellow-300";
        break;
      default:
        baseColor = "bg-gray-100 border-gray-300";
    }

    // Add opacity for seen notifications
    return isSeen ? `${baseColor} opacity-70` : baseColor;
  };

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={() => {
              if (!open && unseenCount > 0) {
                const unseenIds = notifications
                  .filter((n) => !n.isSeen)
                  .map((n) => n._id);
                markAsSeen(unseenIds);
              }
            }}
          >
            <BellIcon
              onClick={() => fetchNotifications()}
              className="h-6 w-6 text-gray-700"
            />
            {unseenCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unseenCount}
              </span>
            )}
          </Popover.Button>

          <Popover.Panel className="absolute right-0 z-10 ml-5 mt-2 w-[280px] max-h-96 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-1 flex flex-col h-full max-h-96">
              <h3 className="text-lg font-medium text-gray-900 p-3 border-b sticky top-0 bg-white z-10">
                Notifications
              </h3>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <Link
                        key={notification._id}
                        href={notification.link || "#"}
                        className="block px-2 py-2 hover:bg-gray-50 transition"
                        onClick={() => {
                          if (!notification.isSeen) {
                            markAsSeen([notification._id]);
                          }
                        }}
                      >
                        <div
                          className={`flex items-start p-2 border rounded-md ${getNotificationColor(
                            notification.notificationType,
                            notification.isSeen
                          )}`}
                        >
                          <div className="mr-3 mt-1">
                            {notification.isSeen ? (
                              <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <EnvelopeIcon className="h-5 w-5 text-indigo-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                notification.isSeen
                                  ? "text-gray-600"
                                  : "text-gray-900 font-medium"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                          {notification.isSeen && (
                            <CheckIcon className="h-4 w-4 text-green-500 mt-1 ml-2" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center text-gray-500">
                    No notifications yet
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-3 bg-gray-50 text-center sticky bottom-0 border-t border-gray-100">
                  <button
                    onClick={() => markAsSeen(notifications.map((n) => n._id))}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default NotificationBell;
