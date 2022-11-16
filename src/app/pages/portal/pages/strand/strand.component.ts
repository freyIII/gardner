import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryParams } from 'src/app/models/queryparams.interface';
import { Strand } from 'src/app/models/strand.interface';
import { SharedTableConfig } from 'src/app/models/table.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { StrandFormComponent } from './strand-form/strand-form.component';
import { STRAND_TABLE_CONFIG } from './strand.configs';

@Component({
  selector: 'app-strand',
  templateUrl: './strand.component.html',
  styleUrls: ['./strand.component.scss'],
})
export class StrandComponent implements OnInit {
  tableConfig: SharedTableConfig = STRAND_TABLE_CONFIG;
  dataSource: Array<Strand> = [];
  dataLength: number = 0;
  subjectsLength: number = 0;

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
    this.api.strand.getAllStrands(query).subscribe(
      (response) => {
        this.dataSource = response.env.strands;
        this.dataLength = response.total_docs;
        this.subjectsLength = response.total_subjects;
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

  onRowClick(row: Strand) {
    this.dialog
      .open(StrandFormComponent, {
        disableClose: true,
        width: '50%',
        data: { form: row, action: 'update', title: 'Update Strand' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) this.fetchData(this.recentQuery);
      });
  }

  onAdd() {
    if (this.subjectsLength) {
      this.dialog
        .open(StrandFormComponent, {
          disableClose: true,
          width: '50%',
          data: { action: 'add', title: 'Add Strand' },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) this.fetchData(this.recentQuery);
        });
    } else {
      this.sb.open('Error: No Subject yet!', 'Okay', {
        duration: 3500,
        panelClass: ['failed'],
      });
    }
  }
}
