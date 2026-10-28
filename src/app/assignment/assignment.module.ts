import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AssignmentRoutingModule } from './assignment-routing.module';
import { AssignmentListComponent } from './components/assignment-list/assignment-list.component';
import { AssignmentFormComponent } from './components/assignment-form/assignment-form.component';

@NgModule({
  declarations: [
    AssignmentListComponent,
    AssignmentFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AssignmentRoutingModule
  ]
})
export class AssignmentModule { }