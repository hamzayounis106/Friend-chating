// src/components/jobs/PatientInfo.tsx
'use client';
import Image from 'next/image';
import { PatientInfoProps } from './job';

export default function PatientInfo({ patient, isCreator }: PatientInfoProps) {
  if (!patient) return null;

  return (
    <div>
      <h3 className='text-xl font-semibold text-gray-800 mb-3'>
        Patient Information
      </h3>
      <div className='flex items-center space-x-6'>
        {patient.image && (
          <div className='relative w-16 h-16 rounded-full overflow-hidden shadow-md'>
            <Image
              src={patient.image}
              alt={patient.name || 'Patient'}
              fill
              sizes='64px'
              className='object-cover'
            />
          </div>
        )}
        <div>
          <p className='text-lg font-medium text-gray-800'>
            {patient.name || 'Anonymous Patient'}
          </p>
          {isCreator && <p className='text-gray-500'>{patient.email}</p>}
        </div>
      </div>
    </div>
  );
}
