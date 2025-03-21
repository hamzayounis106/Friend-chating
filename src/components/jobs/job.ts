import { SurgeonEmail } from '@/types/surgeon';

// src/types/job.ts
export interface JobData {
  _id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  surgeonEmails: SurgeonEmail[];
  AttachmentUrls: string[];
  createdBy: string;
  status: string;
  createdAt: string;
  location: string[];
  patientId?: {
    // ✅ Made optional with `?`
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}

export interface JobHeaderProps {
  title: string;
  type: string;
  date: string;
  createdAt: string;
  status: JobData['status'];
}

export interface JobContentProps {
  description: string;
  attachments?: string[];
}

export interface PatientInfoProps {
  patient?: JobData['patientId'];
  isCreator: boolean;
}

export interface SurgeonsListProps {
  surgeons: JobData['surgeonEmails'];
}

export interface JobActionsProps {
  isCreator: boolean;
  isSurgeon: boolean;
  isJobClosed: boolean;
  jobId: string;
  onClose: () => void;
  onReply: () => void;
  onBack: () => void;
}
