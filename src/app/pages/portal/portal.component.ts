import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Event as NavigationEvent,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { NavNode } from 'src/app/models/treesidenav.interface';
import { USER_NAVS } from './portal.configs';
import { User } from 'src/app/models/user.interface';
import { setUser } from 'src/app/user/user.action';
import { ChangePasswordComponent } from 'src/app/shared/dialogs/change-password/change-password.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav: any = MatSidenav;
  me: any;
  routeLabel: string = '';
  routeIcon: string = '';
  changeLabel = new EventEmitter<NavNode>();

  routerChangeLoad: boolean = false;
  loadingCredentials: boolean = false;
  loggingOut: boolean = false;
  loading: boolean = false;
  dashboard = {
    label: 'Dashboard',
    metadata: 'dashboard',
    route: 'dashboard',
    hasAccess: false,
  };
  navigation = USER_NAVS;

  responseSpeed!: number;
  hasConnection: boolean = true;
  checkSpeedInterval: number = 5001;
  sbConnection: boolean = false;

  constructor(
    public router: Router,
    private store: Store<{ user: User }>,
    private auth: AuthService,
    private sb: MatSnackBar,
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.auth.me().subscribe(
      (res: any) => {
        this.me = res.env.user;
        console.log(
          this.me.type !== 'Superadmin' &&
            this.me._role &&
            this.me._role.accesses
        );
        this.store.dispatch(setUser({ user: this.me }));

        if (
          this.me.type !== 'Superadmin' &&
          this.me._role &&
          this.me._role.accesses &&
          this.me._role.accesses.length
        ) {
          this.navigation = this.me._role.accesses;
        } else {
          this.navigation = USER_NAVS;
        }

        console.log(this.navigation);

        const currRoute = this.router.url.split('/').pop();
        let page = this.navigation.find((o: NavNode) => o.route == currRoute);

        if (!page) {
          this.navigation.forEach((res: NavNode) => {
            if (res.subaccess) {
              let tempPage = res.subaccess.find(
                (c: NavNode) => c.route == currRoute
              );
              if (tempPage) page = tempPage;
            }
          });
        }
        this.routeLabel = page ? page.label : '';

        this.loading = false;
        if (this.me.isNewUser) this.onChangePassword();
      },
      (error: any) => {
        this.sb.open('Error: ' + error.error.message, 'Okay', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
        this.loading = false;
      }
    );
  }

  changeRoute(nav: NavNode) {
    this.routerChangeLoad = true;
    if (this.router.url.split('/').pop() == nav.route) {
      setTimeout(() => {
        this.routerChangeLoad = false;
      }, 1000);
    }
    let routeEvent = this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.routerChangeLoad = true;
      } else if (event instanceof NavigationEnd) {
        routeEvent.unsubscribe();
        setTimeout(() => {
          this.routerChangeLoad = false;
        }, 1000);
      }
    });
    this.changeLabel.emit(nav);
    this.routeLabel = nav.label;
    if (nav.metadata) this.routeIcon = nav.metadata;
  }

  confirmLogout() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: { header: 'Before you proceed...', msg: 'logout' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.logout();
      });
  }

  logout() {
    this.loggingOut = true;
    this.auth.logout().subscribe(
      (res: any) => {
        localStorage.removeItem('SESSION_TOKEN');
        localStorage.removeItem('SESSION_AUTH');
        // this.store.dispatch(resetUser());
        setTimeout(() => {
          this.sb.open('Logged Out', undefined, { duration: 1500 });
          this.router.navigate(['/login']);
          this.loggingOut = false;
        }, 2000);
      },
      (err: any) => {
        this.loggingOut = false;
        this.sb.open(err.error.message, undefined, { duration: 1500 });
      }
    );
  }

  onChangePassword() {
    this.dialog
      .open(ChangePasswordComponent, {
        disableClose: true,
        data: this.me,
      })
      .afterClosed()
      .subscribe((res: Boolean) => {
        if (res) {
          this.sb.open('Logging out of your account...', undefined, {
            duration: 2000,
          });
          this.logout();
        }
      });
  }
}
