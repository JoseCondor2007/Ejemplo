import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatriculasRoutingModule } from './enrollments-routing.module'; 
import { EnrollmentListComponent } from './components/enrollment-list/enrollment-list.component'; 
import { EnrollmentFormComponent } from './components/enrollment-form/enrollment-form.component'; 

@NgModule({
  declarations: [
    EnrollmentListComponent,
    EnrollmentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatriculasRoutingModule
  ]
})
export class EnrollmentsModule { } // ✅ Clase en inglés