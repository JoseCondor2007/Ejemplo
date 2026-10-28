import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Competency } from '../../models/Competency.model';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService extends ApiService {
  private endpoint = 'competencia';

  findAll(): Observable<Competency[]> {
    return this.get<Competency[]>(this.endpoint);
  }

  findByState(state: string): Observable<Competency[]> {
    return this.get<Competency[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Competency> {
    return this.get<Competency>(`${this.endpoint}/${id}`);
  }

  findByCode(code: string): Observable<Competency> {
    return this.get<Competency>(`${this.endpoint}/codigo/${code}`);
  }

  findByCourseId(courseId: number): Observable<Competency[]> {
    return this.get<Competency[]>(`${this.endpoint}/curso/${courseId}`);
  }

  findByStatusAndCourseId(state: string, courseId: number): Observable<Competency[]> {
    return this.get<Competency[]>(`${this.endpoint}/estado/${state}/curso/${courseId}`);
  }

  save(competency: Competency): Observable<Competency> {
    return this.post<Competency>(`${this.endpoint}/guardar`, competency);
  }

  update(id: number, competency: Competency): Observable<Competency> {
    return this.put<Competency>(`${this.endpoint}/actualizar/${id}`, competency);
  }

  deleteById(id: number): Observable<Competency> {
    return this.patch<Competency>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Competency> {
    return this.patch<Competency>(`${this.endpoint}/restaurar/${id}`);
  }
}