import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // ✅ Necesario para routerLink

import { StudentsRoutingModule } from './students-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';

@NgModule({
  declarations: [
    StudentListComponent, // ✅ Clases en inglés
    StudentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule, // ✅ Añadido para evitar errores de routerLink
    StudentsRoutingModule
  ]
})
export class StudentsModule { }
