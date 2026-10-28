import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentInstrumentListComponent } from './components/assessment-instrument-list/assessment-instrument-list.component';
import { AssessmentInstrumentFormComponent } from './components/assessment-instrument-form/assessment-instrument-form.component';

const routes: Routes = [
  { path: '', component: AssessmentInstrumentListComponent },
  { path: 'nuevo', component: AssessmentInstrumentFormComponent },
  { path: 'editar/:id', component: AssessmentInstrumentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentInstrumentRoutingModule { }