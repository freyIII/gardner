import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ComponentsModule } from '../components/components.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DialogAreYouSureComponent } from './dialog-are-you-sure/dialog-are-you-sure.component';

@NgModule({
  declarations: [ChangePasswordComponent, DialogAreYouSureComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
  ],
  exports: [DialogAreYouSureComponent],
})
export class DialogsModule {}
