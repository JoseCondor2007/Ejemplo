export interface Docente {
  idDocente?: number;
  tipoDocumento: string; // 'DNI' | 'CE'
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  correo?: string;
  telefono?: string;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}