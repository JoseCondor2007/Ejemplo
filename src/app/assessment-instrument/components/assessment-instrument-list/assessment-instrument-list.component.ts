import { Component, OnInit } from '@angular/core';
import { AssessmentInstrumentService } from '../../../core/services/AssessmentInstrument.service'; 
import { AssessmentInstrument } from '../../../models/AssessmentInstrument.model'; 

@Component({
  selector: 'app-assessment-instrument-list',
  templateUrl: './assessment-instrument-list.component.html',
  styleUrls: ['./assessment-instrument-list.component.css']
})
export class AssessmentInstrumentListComponent implements OnInit {
  instrumentos: AssessmentInstrument[] = [];
  loading = false;
  filterState = 'T';

  constructor(private instrumentoService: AssessmentInstrumentService) {}

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