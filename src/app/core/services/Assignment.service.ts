import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Assignment } from '../../models/Assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService extends ApiService {
  private endpoint = 'asignacion';

  findAll(): Observable<Assignment[]> {
    return this.get<Assignment[]>(this.endpoint);
  }

  findByState(state: string): Observable<Assignment[]> {
    return this.get<Assignment[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Assignment> {
    return this.get<Assignment>(`${this.endpoint}/${id}`);
  }

  findByTeacherId(teacherId: number): Observable<Assignment[]> {
    return this.get<Assignment[]>(`${this.endpoint}/docente/${teacherId}`);
  }

  findByCourseId(courseId: number): Observable<Assignment[]> {
    return this.get<Assignment[]>(`${this.endpoint}/curso/${courseId}`);
  }

  findBySectionId(sectionId: number): Observable<Assignment[]> {
    return this.get<Assignment[]>(`${this.endpoint}/seccion/${sectionId}`);
  }

  findByYears(years: number): Observable<Assignment[]> {
    return this.get<Assignment[]>(`${this.endpoint}/anio/${years}`);
  }

  save(assignment: Assignment): Observable<Assignment> {
    return this.post<Assignment>(`${this.endpoint}/guardar`, assignment);
  }

  update(id: number, assignment: Assignment): Observable<Assignment> {
    return this.put<Assignment>(`${this.endpoint}/actualizar/${id}`, assignment);
  }

  deleteById(id: number): Observable<Assignment> {
    return this.patch<Assignment>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Assignment> {
    return this.patch<Assignment>(`${this.endpoint}/restaurar/${id}`);
  }
}