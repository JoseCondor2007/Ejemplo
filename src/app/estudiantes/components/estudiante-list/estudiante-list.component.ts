import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { Estudiante } from '../../../models/estudiante.model';

@Component({
  selector: 'app-estudiante-list',
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.css']
})
export class EstudianteListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = false;
  filterState = 'T';
  searchTerm = '';

  constructor(private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.estudianteService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando estudiantes:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  get filteredEstudiantes(): Estudiante[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.estudiantes;
    }

    return this.estudiantes.filter(estudiante =>
      [
        estudiante.numeroDocumento,
        estudiante.nombres,
        estudiante.apellidos
      ].some(value => value?.toLowerCase().includes(term))
    );
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar este estudiante?')) {
      this.loading = true;
      this.estudianteService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando estudiante:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar este estudiante?')) {
      this.loading = true;
      this.estudianteService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando estudiante:', error);
          this.loading = false;
        }
      });
    }
  }
}