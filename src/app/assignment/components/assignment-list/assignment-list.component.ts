import { Component, OnInit } from '@angular/core';
import { AsignacionService } from '../../../core/services/Assignment.service';
import { Assignment } from '../../../models/Assignment.model';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {
  asignaciones: Assignment[] = []; 
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