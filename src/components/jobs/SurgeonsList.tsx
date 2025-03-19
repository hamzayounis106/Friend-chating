// src/components/jobs/SurgeonsList.tsx
'use client';

import { SurgeonsListProps } from './job';

export default function SurgeonsList({ surgeons }: SurgeonsListProps) {
  if (!surgeons.length) return null;

  return (
    <div>
      <h3 className='text-xl font-semibold text-gray-800 mb-3'>
        Invited Surgeons
      </h3>
      <ul className='list-disc pl-6 space-y-2'>
        {surgeons.map((surgeon, idx) => (
          <li key={idx} className='text-gray-700'>
            {surgeon.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
