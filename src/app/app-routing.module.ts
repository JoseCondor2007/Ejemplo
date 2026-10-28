import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Componentes públicos
import { InicioComponent } from './core/inicio/inicio.component'; // Splash
import { LoadingPageComponent } from './core/loading-page/loading-page.component'; // Landing
import { VerificacionComponent } from './core/verificacion/verificacion.component';

const routes: Routes = [
  // 1. INICIO / SPLASH (Pantalla de carga inicial)
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },

  // 2. LOADING PAGE / LANDING (Información y botón de login)
  { path: 'loading', component: LoadingPageComponent },

  // 3. LOGIN
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 4. VERIFICACIÓN
  { path: 'verificacion', component: VerificacionComponent },

  // 5. MÓDULOS PROTEGIDOS (Nombres de archivos y clases en inglés)
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'docentes',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./teachers/teachers.module').then(m => m.TeachersModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'estudiantes',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./students/students.module').then(m => m.StudentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'matriculas',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./enrollments/enrollments.module').then(m => m.EnrollmentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'asignaciones',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./assignment/assignment.module').then(m => m.AssignmentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'competencias',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./competency/competency.module').then(m => m.CompetencyModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'instrumentos',
    // ✅ Apunta al nuevo módulo en inglés
    loadChildren: () => import('./assessment-instrument/assessment-instrument.module').then(m => m.AssessmentInstrumentModule),
    canActivate: [AuthGuard]
  },

  // 6. FALLBACK
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }