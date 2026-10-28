import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AssessmentInstrument } from '../../models/AssessmentInstrument.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentInstrumentService extends ApiService {
  private endpoint = 'instrumento';

  findAll(): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(this.endpoint);
  }

  findByState(state: string): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<AssessmentInstrument> {
    return this.get<AssessmentInstrument>(`${this.endpoint}/${id}`);
  }

  findByCompetencyId(competencyId: number): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/competencia/${competencyId}`);
  }

  findByType(type: string): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/tipo/${type}`);
  }

  findByAssessmentDate(date: string): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/fecha/${date}`);
  }

  findByAssessmentDateBetween(startDate: string, endDate: string): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/fecha-entre/${startDate}/${endDate}`);
  }

  findByCompetencyIdAndStatus(competencyId: number, state: string): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/competencia/${competencyId}/estado/${state}`);
  }

  findByCapacityId(capacityId: number): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/capacidad/${capacityId}`);
  }

  findByAssignmentId(assignmentId: number): Observable<AssessmentInstrument[]> {
    return this.get<AssessmentInstrument[]>(`${this.endpoint}/asignacion/${assignmentId}`);
  }

  save(instrument: AssessmentInstrument): Observable<AssessmentInstrument> {
    return this.post<AssessmentInstrument>(`${this.endpoint}/guardar`, instrument);
  }

  update(id: number, instrument: AssessmentInstrument): Observable<AssessmentInstrument> {
    return this.put<AssessmentInstrument>(`${this.endpoint}/actualizar/${id}`, instrument);
  }

  deleteById(id: number): Observable<AssessmentInstrument> {
    return this.patch<AssessmentInstrument>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<AssessmentInstrument> {
    return this.patch<AssessmentInstrument>(`${this.endpoint}/restaurar/${id}`);
  }
}