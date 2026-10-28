import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InstrumentoEvaluacion } from '../../models/instrumento-evaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class InstrumentoEvaluacionService extends ApiService {
  private endpoint = 'instrumento';

  findAll(): Observable<InstrumentoEvaluacion[]> {
    return this.get<InstrumentoEvaluacion[]>(this.endpoint);
  }

  findByState(state: string): Observable<InstrumentoEvaluacion[]> {
    return this.get<InstrumentoEvaluacion[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<InstrumentoEvaluacion> {
    return this.get<InstrumentoEvaluacion>(`${this.endpoint}/${id}`);
  }

  findByIdCompetencia(idCompetencia: number): Observable<InstrumentoEvaluacion[]> {
    return this.get<InstrumentoEvaluacion[]>(`${this.endpoint}/competencia/${idCompetencia}`);
  }

  save(instrumento: InstrumentoEvaluacion): Observable<InstrumentoEvaluacion> {
    return this.post<InstrumentoEvaluacion>(`${this.endpoint}/guardar`, instrumento);
  }

  update(id: number, instrumento: InstrumentoEvaluacion): Observable<InstrumentoEvaluacion> {
    return this.put<InstrumentoEvaluacion>(`${this.endpoint}/actualizar/${id}`, instrumento);
  }

  deleteById(id: number): Observable<InstrumentoEvaluacion> {
    return this.patch<InstrumentoEvaluacion>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<InstrumentoEvaluacion> {
    return this.patch<InstrumentoEvaluacion>(`${this.endpoint}/restaurar/${id}`);
  }
}