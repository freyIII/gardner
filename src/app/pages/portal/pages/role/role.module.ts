import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { RoleFormComponent } from './role-form/role-form.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  declarations: [RoleComponent, RoleFormComponent],
  imports: [
    CommonModule,
    RoleRoutingModule,
    MaterialModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
})
export class RoleModule {}
