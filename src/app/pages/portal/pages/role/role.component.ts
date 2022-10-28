import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Role } from 'src/app/models/role.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { ROOM_TABLE_CONFIG } from '../room/room.configs';
import { RoleFormComponent } from './role-form/role-form.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  tableConfig: SharedTableConfig = ROOM_TABLE_CONFIG;
  dataSource: Array<Role> = [];
  dataLength: number = 0;

  addBtnAccess: boolean = true;
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
    this.api.role.getAllRoles(query).subscribe(
      (response) => {
        console.log(response);
        this.dataSource = response.env.roles;
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

  onRowClick(row: Role) {
    this.dialog
      .open(RoleFormComponent, {
        disableClose: true,
        width: '50%',
        data: { form: row, action: 'update', title: 'Update Role' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    this.dialog
      .open(RoleFormComponent, {
        disableClose: true,
        width: '50%',
        data: { action: 'add', title: 'Add Role' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }
}
