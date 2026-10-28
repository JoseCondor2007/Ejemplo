export interface Competency {
  competencyId?: number;
  courseId?: number;
  code: string;
  name: string;
  description?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}