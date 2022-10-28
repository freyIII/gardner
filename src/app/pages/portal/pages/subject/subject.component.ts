import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Subject } from 'src/app/models/subject.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { SubjectFormComponent } from './subject-form/subject-form.component';
import { SUBJECT_TABLE_CONFIG } from './subject.configs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent implements OnInit {
  tableConfig: SharedTableConfig = SUBJECT_TABLE_CONFIG;
  dataSource: Array<Subject> = [];
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
    this.api.subject.getAllSubjects(query).subscribe(
      (response) => {
        this.dataSource = response.env.subjects;
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

  onRowClick(row: Subject) {
    this.dialog
      .open(SubjectFormComponent, {
        disableClose: true,
        width: '50%',
        data: { form: row, action: 'update', title: 'Update Subject' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    this.dialog
      .open(SubjectFormComponent, {
        disableClose: true,
        width: '50%',
        data: { action: 'add', title: 'Add Subject' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }
}
