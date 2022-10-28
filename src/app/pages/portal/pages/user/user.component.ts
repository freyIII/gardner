import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { NavNode } from 'src/app/models/treesidenav.interface';
import { User } from 'src/app/models/user.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UserFormComponent } from './user-form/user-form.component';
import { USER_TABLE_CONFIG } from './user.configs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  tableConfig: SharedTableConfig = USER_TABLE_CONFIG;
  dataSource: Array<User> = [];
  dataLength: number = 0;
  loading: boolean = true;
  saving: boolean = false;

  recentQuery: QueryParams;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {}

  fetchData(query: QueryParams) {
    this.recentQuery = query;
    this.dataSource = [];
    this.loading = true;
    this.api.user.getAllUsers(query).subscribe(
      (response) => {
        console.log(response);
        this.dataSource = response.env.users;
        this.dataLength = response.total_docs;
        this.loading = false;
      },
      (err) => {
        this.sb.open('Error: ' + err.error.message, 'Okay', {
          duration: 5000,
        });
        this.loading = false;
      }
    );
  }

  onRowClick(row: User) {
    this.dialog
      .open(UserFormComponent, {
        disableClose: true,
        width: '50%',
        data: { form: row, action: 'update', title: 'Update User' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    this.dialog
      .open(UserFormComponent, {
        disableClose: true,
        width: '50%',
        data: { action: 'add', title: 'Add User' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }
}
