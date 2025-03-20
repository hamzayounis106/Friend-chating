// src/components/jobs/PatientInfo.tsx
'use client';
import Image from 'next/image';
import { PatientInfoProps } from './job';

export default function PatientInfo({ patient, isCreator }: PatientInfoProps) {
  if (!patient) return null;

  return (
    <div className="px-8 py-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg 
            className="w-5 h-5 text-blue-500 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Patient Information
        </h3>
        {isCreator && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
            <svg 
              className="w-3 h-3 mr-1" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Your Profile
          </span>
        )}
      </div>

      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-white">
          {patient.image ? (
            <Image
              src={patient.image}
              alt={patient.name || 'Patient'}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
              <svg 
                className="w-8 h-8" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="ml-6">
          <p className="text-lg font-medium text-gray-800 flex items-center">
            {patient.name || 'Anonymous Patient'}
            {isCreator && (
              <svg 
                className="w-4 h-4 text-blue-500 ml-2" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </p>
          
          {isCreator && (
            <div className="flex items-center text-gray-500 mt-1">
              <svg 
                className="w-4 h-4 mr-1.5" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>{patient.email}</span>
            </div>
          )}
          
          <div className="flex space-x-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Patient
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}