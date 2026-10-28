import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Competencia } from '../../models/competencia.model';

@Injectable({
  providedIn: 'root'
})
export class CompetenciaService extends ApiService {
  private endpoint = 'competencia';

  findAll(): Observable<Competencia[]> {
    return this.get<Competencia[]>(this.endpoint);
  }

  findByState(state: string): Observable<Competencia[]> {
    return this.get<Competencia[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Competencia> {
    return this.get<Competencia>(`${this.endpoint}/${id}`);
  }

  save(competencia: Competencia): Observable<Competencia> {
    return this.post<Competencia>(`${this.endpoint}/guardar`, competencia);
  }

  update(id: number, competencia: Competencia): Observable<Competencia> {
    return this.put<Competencia>(`${this.endpoint}/actualizar/${id}`, competencia);
  }

  deleteById(id: number): Observable<Competencia> {
    return this.patch<Competencia>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Competencia> {
    return this.patch<Competencia>(`${this.endpoint}/restaurar/${id}`);
  }
}