import { getJobsByUserId } from "@/helpers/get-jobs-by-user-id";
import { authOptions } from "@/lib/auth";
// import { get } from "http";
import { getServerSession } from "next-auth";
// import { useSession } from "next-auth/react";
import React from "react";

export default async function page() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  console.log("userId", userId);
  const Posts = await getJobsByUserId(userId as string);
  console.log("Posts", Posts);
  return (
    <div>
      <h2 className="text-5xl">My Job Posts CREATED BY ME </h2>
      
      {Posts?.length === 0 ? (
        <p className='text-sm text-zinc-500'>No jobs assigned...</p>
      ) : (
        Posts?.map((job, index) => (
          <div
            key={index}
            className='flex flex-col gap-4 p-4 border rounded-md'
          >
            <h3 className='font-bold text-lg'>{job.title}</h3>
            <p className='text-sm text-gray-600'>{job.description}</p>
            <p className='text-xs text-gray-500'>
              Type: {job.type} | Date: {new Date(job.date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    
    </div>
  );
}
