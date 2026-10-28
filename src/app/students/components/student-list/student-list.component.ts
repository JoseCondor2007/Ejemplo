import { Component, OnInit } from '@angular/core';
import { EstudianteService } from '../../../core/services/Student.service';
import { Student } from '../../../models/Student.model';

@Component({
  selector: 'app-student-list', // ✅ Cambiado a inglés
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit { // ✅ Clase en inglés
  students: Student[] = []; // ✅ Variable y tipo en inglés
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
        this.students = data;
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

  get filteredStudents(): Student[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.students;
    }

    return this.students.filter(student =>
      [
        student.documentNumber,
        student.firstNames,
        student.lastNames
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