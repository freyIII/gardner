import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ComponentsModule } from '../components/components.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DialogAreYouSureComponent } from './dialog-are-you-sure/dialog-are-you-sure.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    DialogAreYouSureComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
  ],
  exports: [],
})
export class DialogsModule {}
