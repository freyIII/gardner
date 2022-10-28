import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Professor } from 'src/app/models/professor.interface';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Schedule } from 'src/app/models/schedule.interface';
import { Subject } from 'src/app/models/subject.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';
import { ScheduleCreatorComponent } from './schedule-creator/schedule-creator.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { SCHEDULE_TABLE_CONFIG } from './schedule.configs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  tableConfig: SharedTableConfig = SCHEDULE_TABLE_CONFIG;
  dataSource: Array<Schedule> = [];
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
    this.api.schedule.getAllSchedules(query).subscribe(
      (response) => {
        console.log(response);
        this.dataSource = response.env.schedules;
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

  onRowClick(row: Schedule) {
    this.dialog
      .open(ScheduleCreatorComponent, {
        disableClose: true,
        panelClass: 'fullscreen-dialog-container',
        data: { form: row, action: 'update', title: 'Update Schedule' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    this.dialog
      .open(ScheduleCreatorComponent, {
        disableClose: true,
        panelClass: 'fullscreen-dialog-container',
        data: { action: 'add', title: 'Add Schedule' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }
}
