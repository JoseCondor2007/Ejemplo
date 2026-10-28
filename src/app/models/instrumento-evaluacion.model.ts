export interface InstrumentoEvaluacion {
  idInstrumento?: number;
  idCompetencia: number;
  nombre: string;
  tipo: string;
  descripcion?: string;
  pesoConceptual: number; // BigDecimal en Java equivale a number en TS
  fechaEvaluacion?: string; // 'YYYY-MM-DD'
  evidencias?: string; // JSON string
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}