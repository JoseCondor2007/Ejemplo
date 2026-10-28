import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DocentesRoutingModule } from './docentes-routing.module';
import { DocenteListComponent } from './components/docente-list/docente-list.component';
import { DocenteFormComponent } from './components/docente-form/docente-form.component';

@NgModule({
  declarations: [
    DocenteListComponent,
    DocenteFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DocentesRoutingModule
  ]
})
export class DocentesModule { }