import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionListComponent } from './components/asignacion-list/asignacion-list.component';
import { AsignacionFormComponent } from './components/asignacion-form/asignacion-form.component';

const routes: Routes = [
  {
    path: '',
    component: AsignacionListComponent
  },
  {
    path: 'nuevo',
    component: AsignacionFormComponent
  },
  {
    path: 'editar/:id',
    component: AsignacionFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionRoutingModule { }