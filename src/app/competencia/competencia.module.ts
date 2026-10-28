import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // ✅
import { RouterModule } from '@angular/router';                       // ✅

import { CompetenciaRoutingModule } from './competencia-routing.module';
import { CompetenciaListComponent } from './components/competencia-list/competencia-list.component';
import { CompetenciaFormComponent } from './components/competencia-form/competencia-form.component';

@NgModule({
  declarations: [
    CompetenciaListComponent,
    CompetenciaFormComponent
  ],
  imports: [
    CommonModule,               // ✅ para *ngIf, *ngFor
    FormsModule,                // ✅ para [(ngModel)]
    ReactiveFormsModule,        // ✅ para [formGroup], formControlName
    RouterModule,               // ✅ para routerLink
    CompetenciaRoutingModule
  ]
})
export class CompetenciaModule { }
