export interface Assignment {
  assignmentId?: number;
  teacherId: number;
  courseId: number;
  sectionId: number;
  years: number;
  assignmentDate: string; // 'YYYY-MM-DD'
  assignedHours?: number;
  observations?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}