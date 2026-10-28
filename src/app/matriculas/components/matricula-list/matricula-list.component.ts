import { Component, OnInit } from '@angular/core';
import { MatriculaService } from '../../../core/services/matricula.service';
import { Matricula } from '../../../models/matricula.model';

@Component({
  selector: 'app-matricula-list',
  templateUrl: './matricula-list.component.html',
  styleUrls: ['./matricula-list.component.css']
})
export class MatriculaListComponent implements OnInit {
  matriculas: Matricula[] = [];
  loading = false;
  filterState = 'T';
  searchTerm = '';

  constructor(private matriculaService: MatriculaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.matriculaService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.matriculas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando matrículas:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  get filteredMatriculas(): Matricula[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.matriculas;
    }

    return this.matriculas.filter(matricula =>
      [
        matricula.idMatricula?.toString(),
        matricula.idEstudiante?.toString(),
        matricula.idSeccion?.toString(),
        matricula.periodoAcademico
      ].some(value => value?.toLowerCase().includes(term))
    );
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar esta matrícula?')) {
      this.loading = true;
      this.matriculaService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando matrícula:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar esta matrícula?')) {
      this.loading = true;
      this.matriculaService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando matrícula:', error);
          this.loading = false;
        }
      });
    }
  }
}