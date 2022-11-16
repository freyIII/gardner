import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModule } from './pages/login/login.module';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'portal',
    loadChildren: () =>
      import('./pages/portal/portal.module').then((m) => m.PortalModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
