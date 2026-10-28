export interface Matricula {
  idMatricula?: number;
  idEstudiante: number;
  idSeccion: number;
  periodoAcademico: string;
  fechaMatricula: string; // 'YYYY-MM-DD'
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}