import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Student } from '../../models/Student.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService extends ApiService {
  private endpoint = 'estudiante';

  findAll(): Observable<Student[]> {
    return this.get<Student[]>(this.endpoint);
  }

  findByState(state: string): Observable<Student[]> {
    return this.get<Student[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Student> {
    return this.get<Student>(`${this.endpoint}/${id}`);
  }

  findByGuardianId(guardianId: number): Observable<Student[]> {
    return this.get<Student[]>(`${this.endpoint}/apoderado/${guardianId}`);
  }

  findByDocument(documentType: string, documentNumber: string): Observable<Student> {
    return this.get<Student>(`${this.endpoint}/documento/${documentType}/${documentNumber}`);
  }

  findByDocumentType(documentType: string): Observable<Student[]> {
    return this.get<Student[]>(`${this.endpoint}/tipo-documento/${documentType}`);
  }

  findByUbigeoId(ubigeoId: number): Observable<Student[]> {
    return this.get<Student[]>(`${this.endpoint}/ubicacion/${ubigeoId}`);
  }

  save(student: Student): Observable<Student> {
    return this.post<Student>(`${this.endpoint}/guardar`, student);
  }

  update(id: number, student: Student): Observable<Student> {
    return this.put<Student>(`${this.endpoint}/actualizar/${id}`, student);
  }

  deleteById(id: number): Observable<Student> {
    return this.patch<Student>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Student> {
    return this.patch<Student>(`${this.endpoint}/restaurar/${id}`);
  }
}