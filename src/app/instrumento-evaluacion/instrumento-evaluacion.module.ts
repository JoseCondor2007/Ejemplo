import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { InstrumentoEvaluacionRoutingModule } from './instrumento-evaluacion-routing.module';
import { InstrumentoEvaluacionListComponent } from './components/instrumento-evaluacion-list/instrumento-evaluacion-list.component';
import { InstrumentoEvaluacionFormComponent } from './components/instrumento-evaluacion-form/instrumento-evaluacion-form.component';

@NgModule({
  declarations: [
    InstrumentoEvaluacionListComponent,
    InstrumentoEvaluacionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InstrumentoEvaluacionRoutingModule
  ]
})
export class InstrumentoEvaluacionModule { } // <--- ESTA LÍNEA ES LA QUE FALTA