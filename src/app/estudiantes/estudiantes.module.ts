import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EstudiantesRoutingModule } from './estudiantes-routing.module';
import { EstudianteListComponent } from './components/estudiante-list/estudiante-list.component';
import { EstudianteFormComponent } from './components/estudiante-form/estudiante-form.component';

@NgModule({
  declarations: [
    EstudianteListComponent,
    EstudianteFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EstudiantesRoutingModule
  ]
})
export class EstudiantesModule { }