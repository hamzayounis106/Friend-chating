import { Icon, Icons } from "@/components/Icons";
import SignOutButton from "@/components/SignOutButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import JobNotificationsSidebar from "@/components/JobNotificationsSidebar";
import SidebarChatList from "@/components/SidebarChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
import { SidebarOption } from "@/types/typings";
import NotificationBell from "@/components/NotificationBell";
import {
  getJobCountBySurgeon,
  getJobsForSurgeon,
} from "@/helpers/get-jobs-of-surgeon";
import { getJobsByUserId } from "@/helpers/get-jobs-by-user-id";
import { JobData } from "./requests/page";

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Secure Cosmetics | Dashboard",
  description: "Your dashboard",
};

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const userRole = session.user.role; // Ensure this exists in your auth setup
  let jobs: JobData[] = [];

  if (userRole === "surgeon") {
    jobs = await getJobsForSurgeon(session.user.email as string);
  } else if (userRole === "patient") {
    jobs = await getJobsByUserId(session.user.id as string); // Fetch jobs created by the patient
  }

  // Define sidebar options based on user role
  const bothUserOptions: SidebarOption[] = [
    {
      id: 3,
      name: "My Surgeries",
      href: "/dashboard/surgeries",
      Icon: "UserPlus",
    },
   
  ];
  const sidebarOptions: SidebarOption[] =
    userRole === "patient"
      ? [
          {
            id: 1,
            name: "Add Post",
            href: "/dashboard/add",
            Icon: "UserPlus",
          },
          {
            id: 2,
            name: "My Posts",
            href: "/dashboard/myPosts",
            Icon: "UserPlus",
          },
       
        ]
      : [];

  const unseenJobCount =
    userRole === "surgeon"
      ? await getJobCountBySurgeon(session.user.email as string)
      : 0;

  return (
    <div className="w-full flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <MobileChatLayout
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenJobCount}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-full max-w-xs flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        {/* Header with logo and notification bell */}
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Icons.Logo className="h-8 w-auto text-indigo-600" />
          </Link>
          <NotificationBell />
        </div>

        {/* Chats section */}
        {jobs?.length > 0 && (
          <div>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your chats
            </div>
            <SidebarChatList
              sessionId={session.user.id.toString()}
              sessionEmail={session.user.email as string}
              jobs={jobs}
              session={session}
            />
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex flex-1 flex-col justify-between">
          <div>
            <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
              Overview
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {sidebarOptions.map((option) => {
                const Icon = Icons[option.Icon];
                return (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                );
              })}
              {bothUserOptions.map((option) => {
                const Icon = Icons[option.Icon];
                return (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{option.name}</span>
                    </Link>
                  </li>
                );
              })}

              {userRole === "surgeon" && (
                <li>
                  <JobNotificationsSidebar
                    initialUnseenJobCount={unseenJobCount}
                    sessionEmail={session?.user?.email as string}
                  />
                </li>
              )}
            </ul>
          </div>

          {/* Profile & SignOut */}
          <div className="mt-auto border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="relative h-8 w-8 bg-gray-50 rounded-full overflow-hidden">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="object-cover"
                    src={session.user.image || "/default.png"}
                    alt="Your profile picture"
                    sizes="32px"
                  />
                </div>
                <div className="flex flex-col max-w-[140px]">
                  <span className="text-sm font-semibold truncate">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="" />
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
