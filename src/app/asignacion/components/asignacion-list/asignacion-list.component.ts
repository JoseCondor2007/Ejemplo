import { Component, OnInit } from '@angular/core';
import { AsignacionService } from '../../../core/services/asignacion.service';
import { Asignacion } from '../../../models/asignacion.model';

@Component({
  selector: 'app-asignacion-list',
  templateUrl: './asignacion-list.component.html',
  styleUrls: ['./asignacion-list.component.css']
})
export class AsignacionListComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  loading = false;
  filterState = 'T';

  constructor(private asignacionService: AsignacionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.asignacionService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando asignaciones:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(state: string): void {
    this.filterState = state;
    this.loadData();
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar esta asignación?')) {
      this.loading = true;
      this.asignacionService.deleteById(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error desactivando asignación:', error);
          this.loading = false;
        }
      });
    }
  }

  restaurar(id: number): void {
    if (confirm('¿Estás seguro de restaurar esta asignación?')) {
      this.loading = true;
      this.asignacionService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando asignación:', error);
          this.loading = false;
        }
      });
    }
  }
}