import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Matricula } from '../../models/matricula.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService extends ApiService {
  private endpoint = 'matricula';

  findAll(): Observable<Matricula[]> {
    return this.get<Matricula[]>(this.endpoint);
  }

  findByState(state: string): Observable<Matricula[]> {
    return this.get<Matricula[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Matricula> {
    return this.get<Matricula>(`${this.endpoint}/${id}`);
  }

  findByIdEstudiante(idEstudiante: number): Observable<Matricula[]> {
    return this.get<Matricula[]>(`${this.endpoint}/estudiante/${idEstudiante}`);
  }

  findByIdSeccion(idSeccion: number): Observable<Matricula[]> {
    return this.get<Matricula[]>(`${this.endpoint}/seccion/${idSeccion}`);
  }

  findByPeriodo(periodo: string): Observable<Matricula[]> {
    return this.get<Matricula[]>(`${this.endpoint}/periodo/${periodo}`);
  }

  save(matricula: Matricula): Observable<Matricula> {
    return this.post<Matricula>(`${this.endpoint}/guardar`, matricula);
  }

  update(id: number, matricula: Matricula): Observable<Matricula> {
    return this.put<Matricula>(`${this.endpoint}/actualizar/${id}`, matricula);
  }

  deleteById(id: number): Observable<Matricula> {
    return this.patch<Matricula>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Matricula> {
    return this.patch<Matricula>(`${this.endpoint}/restaurar/${id}`);
  }
}