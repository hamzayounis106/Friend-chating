"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [job, setJob] = useState(null);
  const params = useParams();
  const jobId = params?.jobId;
  const session = useSession();
  const userRole = session?.data?.user?.role;

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const { data } = await axios.get(`/api/Jobs/${jobId}`);
          setJob(data.job);
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchJob();
    }
  }, [jobId]);

  if (!job) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-4">{job.title}</h1>

      <div className="grid grid-cols-2 gap-4">
        <p className="text-gray-600"><strong className="text-gray-800">Type:</strong> {job.type}</p>
        <p className="text-gray-600"><strong className="text-gray-800">Date:</strong> {new Date(job.date).toLocaleDateString()}</p>
        {job.patientId && (
          <>
            <p className="text-gray-600"><strong className="text-gray-800">Patient:</strong> {job.patientId.name} ({job.patientId.email})</p>
            <img src={job.patientId.image} alt="Patient" className="w-24 h-24 rounded-full object-cover" />
          </>
        )}
        {userRole !== "surgeon" && (
          <p className="text-gray-600"><strong className="text-gray-800">Created By:</strong> {job.createdBy}</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800">Description</h2>
        <p className="text-gray-600 mt-2">{job.description}</p>
      </div>

      {job.AttachmentUrls?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Attachments</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {job.AttachmentUrls.map((url, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-lg flex justify-center">
                {url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") ? (
                  <img src={url} alt={`Attachment ${index + 1}`} className="w-full rounded-md" />
                ) : url.endsWith(".mp4") ? (
                  <video controls className="w-full rounded-md">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Attachment {index + 1}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole === "patient" && job.surgeonEmails?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">Surgeon Emails</h2>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            {job.surgeonEmails.map((surgeon, index) => (
              <li key={index} className="py-1">{surgeon.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}