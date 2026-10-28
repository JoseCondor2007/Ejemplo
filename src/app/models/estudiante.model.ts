export interface Estudiante {
  idEstudiante?: number;
  tipoDocumento: string; // 'DNI' | 'CE'
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string; // 'YYYY-MM-DD'
  sexo: string; // 'M' | 'F'
  idApoderado: number;
  idUbicacion?: number;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}