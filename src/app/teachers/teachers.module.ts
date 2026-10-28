import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeacherListComponent } from './components/teacher-list/teacher-list.component';
import { TeacherFormComponent } from './components/teacher-form/teacher-form.component';

@NgModule({
  declarations: [
    TeacherListComponent,
    TeacherFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TeachersRoutingModule
  ]
})
export class TeachersModule { }