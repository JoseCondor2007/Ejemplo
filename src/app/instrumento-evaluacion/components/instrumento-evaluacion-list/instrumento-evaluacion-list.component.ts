import { Component, OnInit } from '@angular/core';
import { InstrumentoEvaluacionService } from '../../../core/services/instrumento-evaluacion.service';
import { InstrumentoEvaluacion } from '../../../models/instrumento-evaluacion.model';

@Component({
  selector: 'app-instrumento-evaluacion-list',
  templateUrl: './instrumento-evaluacion-list.component.html',
  styleUrls: ['./instrumento-evaluacion-list.component.css']
})
export class InstrumentoEvaluacionListComponent implements OnInit {
  instrumentos: InstrumentoEvaluacion[] = [];
  loading = false;
  filterState = 'T';

  constructor(private instrumentoService: InstrumentoEvaluacionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.instrumentoService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.instrumentos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando instrumentos de evaluación:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar este instrumento?')) {
      this.loading = true;
      this.instrumentoService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando instrumento:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar este instrumento?')) {
      this.loading = true;
      this.instrumentoService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando instrumento:', error);
          this.loading = false;
        }
      });
    }
  }
}