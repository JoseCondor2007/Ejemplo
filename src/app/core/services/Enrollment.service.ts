import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Enrollment } from '../../models/Enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService extends ApiService {
  private endpoint = 'matricula';

  findAll(): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(this.endpoint);
  }

  findByState(state: string): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Enrollment> {
    return this.get<Enrollment>(`${this.endpoint}/${id}`);
  }

  findByStudentId(studentId: number): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(`${this.endpoint}/estudiante/${studentId}`);
  }

  findBySectionId(sectionId: number): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(`${this.endpoint}/seccion/${sectionId}`);
  }

  findByAcademicPeriod(academicPeriod: string): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(`${this.endpoint}/periodo/${academicPeriod}`);
  }

  findByGuardianId(guardianId: number): Observable<Enrollment[]> {
    return this.get<Enrollment[]>(`${this.endpoint}/apoderado/${guardianId}`);
  }

  save(enrollment: Enrollment): Observable<Enrollment> {
    return this.post<Enrollment>(`${this.endpoint}/guardar`, enrollment);
  }

  update(id: number, enrollment: Enrollment): Observable<Enrollment> {
    return this.put<Enrollment>(`${this.endpoint}/actualizar/${id}`, enrollment);
  }

  deleteById(id: number): Observable<Enrollment> {
    return this.patch<Enrollment>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Enrollment> {
    return this.patch<Enrollment>(`${this.endpoint}/restaurar/${id}`);
  }
}