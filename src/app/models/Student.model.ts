export interface Student {
  studentId?: number;
  documentType: string; // 'DNI' | 'CE'
  documentNumber: string;
  firstNames: string;
  lastNames: string;
  birthDate: string; // 'YYYY-MM-DD'
  sex: string; // 'M' | 'F'
  guardianId: number;
  ubigeoId?: number;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}