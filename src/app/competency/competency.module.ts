import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompetencyRoutingModule } from './competency-routing.module';
import { CompetencyListComponent } from './components/competency-list/competency-list.component';
import { CompetencyFormComponent } from './components/competency-form/competency-form.component';

@NgModule({
  declarations: [
    CompetencyListComponent, 
    CompetencyFormComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CompetencyRoutingModule
  ]
})
export class CompetencyModule { }