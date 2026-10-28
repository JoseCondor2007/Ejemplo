import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatriculasRoutingModule } from './matriculas-routing.module';
import { MatriculaListComponent } from './components/matricula-list/matricula-list.component';
import { MatriculaFormComponent } from './components/matricula-form/matricula-form.component';

@NgModule({
  declarations: [
    MatriculaListComponent,
    MatriculaFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatriculasRoutingModule
  ]
})
export class MatriculasModule { }