import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocenteListComponent } from './components/docente-list/docente-list.component';
import { DocenteFormComponent } from './components/docente-form/docente-form.component';

const routes: Routes = [
  {
    path: '',
    component: DocenteListComponent
  },
  {
    path: 'nuevo',
    component: DocenteFormComponent
  },
  {
    path: 'editar/:id',
    component: DocenteFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocentesRoutingModule { }