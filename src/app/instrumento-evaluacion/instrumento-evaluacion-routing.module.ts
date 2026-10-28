import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstrumentoEvaluacionListComponent } from './components/instrumento-evaluacion-list/instrumento-evaluacion-list.component';
import { InstrumentoEvaluacionFormComponent } from './components/instrumento-evaluacion-form/instrumento-evaluacion-form.component';

const routes: Routes = [
  {
    path: '',
    component: InstrumentoEvaluacionListComponent
  },
  {
    path: 'nuevo',
    component: InstrumentoEvaluacionFormComponent
  },
  {
    path: 'editar/:id',
    component: InstrumentoEvaluacionFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstrumentoEvaluacionRoutingModule { }