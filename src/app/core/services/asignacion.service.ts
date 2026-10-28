import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Asignacion } from '../../models/asignacion.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService extends ApiService {
  private endpoint = 'asignacion';

  findAll(): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(this.endpoint);
  }

  findByState(state: string): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(`${this.endpoint}/estado/${state}`);
  }

  findById(id: number): Observable<Asignacion> {
    return this.get<Asignacion>(`${this.endpoint}/${id}`);
  }

  findByIdDocente(idDocente: number): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(`${this.endpoint}/docente/${idDocente}`);
  }

  findByIdCurso(idCurso: number): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(`${this.endpoint}/curso/${idCurso}`);
  }

  findByIdSeccion(idSeccion: number): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(`${this.endpoint}/seccion/${idSeccion}`);
  }

  findByAnio(anio: number): Observable<Asignacion[]> {
    return this.get<Asignacion[]>(`${this.endpoint}/anio/${anio}`);
  }

  save(asignacion: Asignacion): Observable<Asignacion> {
    return this.post<Asignacion>(`${this.endpoint}/guardar`, asignacion);
  }

  update(id: number, asignacion: Asignacion): Observable<Asignacion> {
    return this.put<Asignacion>(`${this.endpoint}/actualizar/${id}`, asignacion);
  }

  deleteById(id: number): Observable<Asignacion> {
    return this.patch<Asignacion>(`${this.endpoint}/eliminar/${id}`);
  }

  restore(id: number): Observable<Asignacion> {
    return this.patch<Asignacion>(`${this.endpoint}/restaurar/${id}`);
  }
}