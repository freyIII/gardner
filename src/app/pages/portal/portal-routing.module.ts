import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalComponent } from './portal.component';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      // GENERAL
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (o) => o.DashboardModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./pages/user/user.module').then((o) => o.UserModule),
      },
      {
        path: 'role',
        loadChildren: () =>
          import('./pages/role/role.module').then((o) => o.RoleModule),
      },
      {
        path: 'room',
        loadChildren: () =>
          import('./pages/room/room.module').then((o) => o.RoomModule),
      },
      {
        path: 'strand',
        loadChildren: () =>
          import('./pages/strand/strand.module').then((o) => o.StrandModule),
      },
      {
        path: 'subject',
        loadChildren: () =>
          import('./pages/subject/subject.module').then((o) => o.SubjectModule),
      },
      {
        path: 'professor',
        loadChildren: () =>
          import('./pages/professor/professor.module').then(
            (o) => o.ProfessorModule
          ),
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('./pages/schedule/schedule.module').then(
            (o) => o.ScheduleModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalRoutingModule {}
