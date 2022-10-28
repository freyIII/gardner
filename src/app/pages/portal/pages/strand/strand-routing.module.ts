import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrandComponent } from './strand.component';

const routes: Routes = [{ path: '', component: StrandComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrandRoutingModule {}
