import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetenciaListComponent } from './components/competencia-list/competencia-list.component';
import { CompetenciaFormComponent } from './components/competencia-form/competencia-form.component';

const routes: Routes = [
  { path: '', component: CompetenciaListComponent },
  { path: 'nuevo', component: CompetenciaFormComponent },
  { path: 'editar/:id', component: CompetenciaFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetenciaRoutingModule { }   // ✅ singular