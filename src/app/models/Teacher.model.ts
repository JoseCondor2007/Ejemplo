export interface Teacher {
  teacherId?: number;
  documentType: string; // 'DNI' | 'CE'
  documentNumber: string;
  firstNames: string;
  lastNames: string;
  birthDate: string; // 'YYYY-MM-DD'
  specialty: string;
  email?: string;
  phone?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}