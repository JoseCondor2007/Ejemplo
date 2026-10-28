export interface Competencia {
  idCompetencia?: number;
  idCurso?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  capacidades?: string; // JSON string
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}