import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Docente } from '../../../models/docente.model';

@Component({
  selector: 'app-docente-list',
  templateUrl: './docente-list.component.html',
  styleUrls: ['./docente-list.component.css']
})
export class DocenteListComponent implements OnInit {
  docentes: Docente[] = [];
  loading = false;
  filterState = 'T';

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.docenteService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.docentes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando docentes:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar este docente?')) {
      this.loading = true;
      this.docenteService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando docente:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar este docente?')) {
      this.loading = true;
      this.docenteService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando docente:', error);
          this.loading = false;
        }
      });
    }
  }
}