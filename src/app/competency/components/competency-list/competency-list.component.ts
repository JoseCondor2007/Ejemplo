import { Component, OnInit } from '@angular/core';
import { CompetenciaService } from '../../../core/services/Competency.service';
import { Competency } from '../../../models/Competency.model';

@Component({
  selector: 'app-competency-list',
  templateUrl: './competency-list.component.html',
  styleUrls: ['./competency-list.component.css']
})
export class CompetencyListComponent implements OnInit {
  competencias: Competency[] = []; // ✅ Usa Competency
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
}