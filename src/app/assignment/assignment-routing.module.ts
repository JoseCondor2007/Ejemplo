import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentListComponent } from './components/assignment-list/assignment-list.component';
import { AssignmentFormComponent } from './components/assignment-form/assignment-form.component';

const routes: Routes = [
  {
    path: '',
    component: AssignmentListComponent
  },
  {
    path: 'nuevo',
    component: AssignmentFormComponent
  },
  {
    path: 'editar/:id',
    component: AssignmentFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentRoutingModule { }