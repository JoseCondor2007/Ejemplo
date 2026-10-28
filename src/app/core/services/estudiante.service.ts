import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Estudiante } from '../../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService extends ApiService {
  private endpoint = 'estudiante';

  findAll(): Observable<Estudiante[]> {
    return this.get<Estudiante[]>(this.endpoint);
  }

  findByState(state: string): Observable<Estudiante[]> {
    return this.get<Estudiante[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Estudiante> {
    return this.get<Estudiante>(`${this.endpoint}/${id}`);
  }

  findByIdApoderado(idApoderado: number): Observable<Estudiante[]> {
    return this.get<Estudiante[]>(`${this.endpoint}/apoderado/${idApoderado}`);
  }

  save(estudiante: Estudiante): Observable<Estudiante> {
    return this.post<Estudiante>(`${this.endpoint}/guardar`, estudiante);
  }

  update(id: number, estudiante: Estudiante): Observable<Estudiante> {
    return this.put<Estudiante>(`${this.endpoint}/actualizar/${id}`, estudiante);
  }

  deleteById(id: number): Observable<Estudiante> {
    return this.patch<Estudiante>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Estudiante> {
    return this.patch<Estudiante>(`${this.endpoint}/restaurar/${id}`);
  }
}