import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from './schedule.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ScheduleCreatorComponent } from './schedule-creator/schedule-creator.component';

@NgModule({
  declarations: [ScheduleComponent, ScheduleFormComponent, ScheduleCreatorComponent],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    ComponentsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ScheduleModule {}
