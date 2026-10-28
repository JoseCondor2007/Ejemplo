import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Teacher } from '../../models/Teacher.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService extends ApiService {
  private endpoint = 'docente';

  findAll(): Observable<Teacher[]> {
    return this.get<Teacher[]>(this.endpoint);
  }

  findByState(state: string): Observable<Teacher[]> {
    return this.get<Teacher[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Teacher> {
    return this.get<Teacher>(`${this.endpoint}/${id}`);
  }

  findByDocument(documentType: string, documentNumber: string): Observable<Teacher> {
    return this.get<Teacher>(`${this.endpoint}/documento/${documentType}/${documentNumber}`);
  }

  findByDocumentType(documentType: string): Observable<Teacher[]> {
    return this.get<Teacher[]>(`${this.endpoint}/tipo-documento/${documentType}`);
  }

  findBySpecialty(specialty: string): Observable<Teacher[]> {
    return this.get<Teacher[]>(`${this.endpoint}/especialidad/${specialty}`);
  }

  save(teacher: Teacher): Observable<Teacher> {
    return this.post<Teacher>(`${this.endpoint}/guardar`, teacher);
  }

  update(id: number, teacher: Teacher): Observable<Teacher> {
    return this.put<Teacher>(`${this.endpoint}/actualizar/${id}`, teacher);
  }

  deleteById(id: number): Observable<Teacher> {
    return this.patch<Teacher>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Teacher> {
    return this.patch<Teacher>(`${this.endpoint}/restaurar/${id}`);
  }
}