import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { EstudianteService } from '../../../core/services/Student.service';
import { DocenteService } from '../../../core/services/Teacher.service';
import { MatriculaService } from '../../../core/services/Enrollment.service';
import { AsignacionService } from '../../../core/services/Assignment.service';
import { CompetenciaService } from '../../../core/services/Competency.service';
import { AssessmentInstrumentService} from '../../../core/services/AssessmentInstrument.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  loading = true;

  // ✅ Solo los 6 módulos del frontend
  stats = {
    estudiantes: 0,
    docentes: 0,
    matriculas: 0,
    asignaciones: 0,
    competencias: 0,
    instrumentos: 0
    // ❌ SIN apoderados, evaluaciones, asistencias
  };

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private docenteService: DocenteService,
    private matriculaService: MatriculaService,
    private asignacionService: AsignacionService,
    private competenciaService: CompetenciaService,
    private instrumentService: AssessmentInstrumentService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // ✅ forkJoin (moderno) en lugar de Promise.all + toPromise()
    forkJoin({
      estudiantes: this.estudianteService.findByState('A'),
      docentes: this.docenteService.findByState('A'),
      matriculas: this.matriculaService.findByState('A'),
      asignaciones: this.asignacionService.findByState('A'),
      competencias: this.competenciaService.findByState('A'),
      instrumentos: this.instrumentService.findByState('A')
    }).subscribe({
      next: (result) => {
        this.stats.estudiantes = result.estudiantes?.length || 0;
        this.stats.docentes = result.docentes?.length || 0;
        this.stats.matriculas = result.matriculas?.length || 0;
        this.stats.asignaciones = result.asignaciones?.length || 0;
        this.stats.competencias = result.competencias?.length || 0;
        this.stats.instrumentos = result.instrumentos?.length || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}