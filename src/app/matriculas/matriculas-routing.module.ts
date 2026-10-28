import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';

const routes: Routes = [
  {
    path: '',
    component: MatriculaListComponent
  },
  {
    path: 'nuevo',
    component: MatriculaFormComponent
  },
  {
    path: 'editar/:id',
    component: MatriculaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatriculasRoutingModule { }