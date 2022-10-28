import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-are-you-sure',
  templateUrl: './dialog-are-you-sure.component.html',
  styleUrls: ['./dialog-are-you-sure.component.scss'],
})
export class DialogAreYouSureComponent implements OnInit {
  leftButtonText: string = 'Cancel';
  rightButtonText: string = 'Confirm';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAreYouSureComponent>
  ) {}

  ngOnInit(): void {}

  onConfirm() {
    this.dialogRef.close(true);
  }
}
