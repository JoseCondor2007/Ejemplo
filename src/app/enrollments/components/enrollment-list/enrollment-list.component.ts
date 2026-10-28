import { Component, OnInit } from '@angular/core';
import { MatriculaService } from '../../../core/services/Enrollment.service'; // ✅ Inglés
import { Enrollment } from '../../../models/Enrollment.model'; // ✅ Asegúrate de importar la interfaz correcta

@Component({
  selector: 'app-enrollment-list', // ✅ Selector en inglés
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit { // ✅ Clase en inglés
  enrollments: Enrollment[] = []; // ✅ Variable en inglés
  loading = false;
  filterState = 'T';
  searchTerm = '';

  constructor(private enrollmentService: MatriculaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.enrollmentService.findByState(this.filterState).subscribe({
      next: (data) => {
        this.enrollments = data;
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

  get filteredEnrollments(): Enrollment[] { // ✅ Getter en inglés
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.enrollments;
    }

    return this.enrollments.filter(enrollment =>
      [
        enrollment.enrollmentId?.toString(),
        enrollment.studentId?.toString(),
        enrollment.sectionId?.toString(),
        enrollment.academicPeriod
      ].some(value => value?.toLowerCase().includes(term))
    );
  }

  desactivar(id: number): void {
    if (confirm('¿Estás seguro de desactivar esta matrícula?')) {
      this.loading = true;
      this.enrollmentService.deleteById(id).subscribe({
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
      this.enrollmentService.restore(id).subscribe({
        next: () => this.loadData(),
        error: (error) => {
          console.error('Error restaurando matrícula:', error);
          this.loading = false;
        }
      });
    }
  }
}
