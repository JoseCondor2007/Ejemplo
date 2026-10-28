export interface AssessmentInstrument {
  instrumentId?: number;
  competencyId: number;
  assignmentId?: number;
  capacityId?: number;
  instrumentName: string;
  type: string;
  description?: string;
  conceptualWeight: number; // BigDecimal en Java equivale a number en TS
  assessmentDate?: string; // 'YYYY-MM-DD'
  evidence?: string; // JSON string
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  restoredAt?: string;
}