import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AsignacionRoutingModule } from './asignacion-routing.module';
import { AsignacionListComponent } from './components/asignacion-list/asignacion-list.component';
import { AsignacionFormComponent } from './components/asignacion-form/asignacion-form.component';

@NgModule({
  declarations: [
    AsignacionListComponent,
    AsignacionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsignacionRoutingModule
  ]
})
export class AsignacionModule { }