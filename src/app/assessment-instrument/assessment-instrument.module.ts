import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AssessmentInstrumentRoutingModule } from './assessment-instrument-routing.module';
import { AssessmentInstrumentListComponent } from './components/assessment-instrument-list/assessment-instrument-list.component';
import { AssessmentInstrumentFormComponent } from './components/assessment-instrument-form/assessment-instrument-form.component';

@NgModule({
  declarations: [
    AssessmentInstrumentListComponent,
    AssessmentInstrumentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AssessmentInstrumentRoutingModule
  ]
})
export class AssessmentInstrumentModule { }
