import { Component, OnInit } from '@angular/core';
import { CompetenciaService } from '../../../core/services/competencia.service';
import { Competencia } from '../../../models/competencia.model';

@Component({
  selector: 'app-competencia-list',
  templateUrl: './competencia-list.component.html',
  styleUrls: ['./competencia-list.component.css']
})
export class CompetenciaListComponent implements OnInit {
  competencias: Competencia[] = [];
  loading = false;
  filterState = 'T';

  constructor(private competenciaService: CompetenciaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.competenciaService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.competencias = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando competencias:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar esta competencia?')) {
      this.loading = true;
      this.competenciaService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando competencia:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar esta competencia?')) {
      this.loading = true;
      this.competenciaService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando competencia:', error);
          this.loading = false;
        }
      });
    }
  }

  /**
   * Convierte el string JSON de capacidades a un arreglo de strings.
   * Si falla el parseo, devuelve un arreglo vacío.
   */
  getCapacidades(capacidades: string | undefined | null): string[] {
    if (!capacidades) return [];
    try {
      const parsed = JSON.parse(capacidades);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error parseando capacidades:', e);
      return [];
    }
  }
}