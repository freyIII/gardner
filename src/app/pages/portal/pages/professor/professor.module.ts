import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfessorRoutingModule } from './professor-routing.module';
import { ProfessorComponent } from './professor.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { ProfessorFormComponent } from './professor-form/professor-form.component';

@NgModule({
  declarations: [ProfessorComponent, ProfessorFormComponent],
  imports: [
    CommonModule,
    ProfessorRoutingModule,
    MaterialModule,
    ComponentsModule,
  ],
})
export class ProfessorModule {}
