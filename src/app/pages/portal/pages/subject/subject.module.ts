import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing.module';
import { SubjectComponent } from './subject.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { SubjectFormComponent } from './subject-form/subject-form.component';

@NgModule({
  declarations: [SubjectComponent, SubjectFormComponent],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    ComponentsModule,
    MaterialModule,
  ],
})
export class SubjectModule {}
