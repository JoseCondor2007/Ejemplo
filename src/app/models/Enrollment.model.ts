export interface Enrollment {
  enrollmentId?: number;
  studentId: number;
  sectionId: number;
  guardianId?: number;
  academicPeriod: string;
  enrollmentDate: string; // 'YYYY-MM-DD'
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}