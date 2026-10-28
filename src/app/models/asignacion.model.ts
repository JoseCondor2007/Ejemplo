export interface Asignacion {
  idAsignacion?: number;
  idDocente: number;
  idCurso: number;
  idSeccion: number;
  anio: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}