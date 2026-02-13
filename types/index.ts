export type Role = "ADMIN" | "PENGAWAS" | "MAHASISWA" | "KEUANGAN";
export type JobStatus = "OPEN" | "CLOSED";
export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "VERIFYING"
  | "COMPLETED";
export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: number;
  username: string;
  name: string;
  role: Role;
  nim: string | null;
  prodi: string | null;
  kelas: string | null;
  totalHours: number;
  password?: string;
  isLibraryClear: boolean;
  isAdminClear: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  hours: number;
  quota: number;
  category: string;
  status: JobStatus;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  proofImage1: string | null;
  proofImage2: string | null;
  submissionNote: string | null;
  user?: User;
  job?: Job;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  hoursEquivalent: number;
  proofUrl: string;
  status: PaymentStatus;
  note?: string;
  createdAt: string;
  user?: User;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  targetType: string;
  targetId?: number;
  details?: string;
  createdAt: string;
}

export interface SystemSettings {
  id: number;
  key: string;
  value: string;
}
