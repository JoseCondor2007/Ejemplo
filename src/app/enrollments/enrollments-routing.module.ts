import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrollmentListComponent } from './components/enrollment-list/enrollment-list.component';
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component';

const routes: Routes = [
  {
    path: '',
    component: EnrollmentListComponent
  },
  {
    path: 'nuevo',
    component: EnrollmentFormComponent
  },
  {
    path: 'editar/:id',
    component: EnrollmentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculasRoutingModule { }