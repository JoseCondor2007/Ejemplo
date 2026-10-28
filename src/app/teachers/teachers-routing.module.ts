import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './components/teacher-form/teacher-form.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherListComponent
  },
  {
    path: 'nuevo',
    component: TeacherFormComponent
  },
  {
    path: 'editar/:id',
    component: TeacherFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }