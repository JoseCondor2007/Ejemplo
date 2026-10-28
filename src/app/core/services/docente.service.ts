import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Docente } from '../../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class DocenteService extends ApiService {
  private endpoint = 'docente';

  findAll(): Observable<Docente[]> {
    return this.get<Docente[]>(this.endpoint);
  }

  findByState(state: string): Observable<Docente[]> {
    return this.get<Docente[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Docente> {
    return this.get<Docente>(`${this.endpoint}/${id}`);
  }

  findByEspecialidad(especialidad: string): Observable<Docente[]> {
    return this.get<Docente[]>(`${this.endpoint}/especialidad/${especialidad}`);
  }

  save(docente: Docente): Observable<Docente> {
    return this.post<Docente>(`${this.endpoint}/guardar`, docente);
  }

  update(id: number, docente: Docente): Observable<Docente> {
    return this.put<Docente>(`${this.endpoint}/actualizar/${id}`, docente);
  }

  deleteById(id: number): Observable<Docente> {
    return this.patch<Docente>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Docente> {
    return this.patch<Docente>(`${this.endpoint}/restaurar/${id}`);
  }
}