import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrandRoutingModule } from './strand-routing.module';
import { StrandComponent } from './strand.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { StrandFormComponent } from './strand-form/strand-form.component';

@NgModule({
  declarations: [StrandComponent, StrandFormComponent],
  imports: [
    CommonModule,
    StrandRoutingModule,
    ComponentsModule,
    MaterialModule,
  ],
})
export class StrandModule {}
