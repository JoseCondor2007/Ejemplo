import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetencyListComponent } from './components/competency-list/competency-list.component';
import { CompetencyFormComponent } from './components/competency-form/competency-form.component';

const routes: Routes = [
  { path: '', component: CompetencyListComponent },
  { path: 'nuevo', component: CompetencyFormComponent },
  { path: 'editar/:id', component: CompetencyFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetencyRoutingModule { }