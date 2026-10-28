import { Component, OnInit } from '@angular/core';
// ✅ Importación de la clase en inglés y en minúsculas
import { DocenteService } from '../../../core/services/Teacher.service'; 
import { Teacher } from '../../../models/Teacher.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = []; 
  loading = false;
  filterState = 'T';

  // ✅ Inyección de TeacherService
  constructor(private teacherService: DocenteService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.teacherService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.teachers = data;
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
      this.teacherService.deleteById(id).subscribe({
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
      this.teacherService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando docente:', error);
          this.loading = false;
        }
      });
    }
  }
}