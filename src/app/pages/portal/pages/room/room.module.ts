import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RoomFormComponent } from './room-form/room-form.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
  declarations: [RoomComponent, RoomFormComponent],
  imports: [CommonModule, RoomRoutingModule, ComponentsModule, MaterialModule],
})
export class RoomModule {}
