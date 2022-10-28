import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Room } from 'src/app/models/room.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { RoomFormComponent } from './room-form/room-form.component';
import { ROOM_TABLE_CONFIG } from './room.configs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit {
  tableConfig: SharedTableConfig = ROOM_TABLE_CONFIG;
  dataSource: Array<Room> = [];
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
    this.api.room.getAllRooms(query).subscribe(
      (response) => {
        console.log(response);
        this.dataSource = response.env.rooms;
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

  onRowClick(row: Room) {
    this.dialog
      .open(RoomFormComponent, {
        disableClose: true,
        width: '50%',
        data: { form: row, action: 'update', title: 'Update Room' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    this.dialog
      .open(RoomFormComponent, {
        disableClose: true,
        width: '50%',
        data: { action: 'add', title: 'Add Room' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }
}
