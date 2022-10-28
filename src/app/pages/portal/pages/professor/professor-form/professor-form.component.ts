import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { Subject } from 'src/app/models/subject.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { AutocompleteApi } from 'src/app/shared/components/autocomplete-api/autocomplete-api.component';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { SUBJECT_AUTOCOMPLETE_CONFIG } from '../../strand/strand-form/strand-form.configs';
import { PROFESSOR_FORM } from './professor-form.configs';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.scss'],
})
export class ProfessorFormComponent implements OnInit {
  @ViewChild('professorDetails') professorDetails!: NewFormComponent;
  apiConfig: AutocompleteApi = JSON.parse(
    JSON.stringify(SUBJECT_AUTOCOMPLETE_CONFIG)
  );
  field: any = { label: 'Subject' };
  professorFormField: Section[] = JSON.parse(JSON.stringify(PROFESSOR_FORM));
  professorInterface: any;
  subjArray: Array<any> = [
    {
      config: this.apiConfig,
      field: { label: 'Subject' },
    },
  ];
  message: string;
  saving: boolean;
  resetting: boolean = false;
  title: string;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.data.action.concat(
        this.data.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${this.professorDetails.form.value.firstName} ${this.professorDetails.form.value.lastName} !`;
      this.sb.open(this.message, 'Okay', {
        duration: 3500,
        panelClass: ['success'],
      });
      this.saving = false;
      this.dialogRef.close(true);
    },
    error: (err: any) => {
      console.log(err);
      this.saving = false;
      this.sb.open(
        'Error: ' + (err.error.message || 'Something went wrong'),
        'Okay',
        {
          duration: 3500,
          panelClass: ['failed'],
        }
      );
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProfessorFormComponent>,
    private sb: MatSnackBar,
    private api: ApiService,
    private util: UtilService
  ) {
    console.log(data.form);
    if (data.action === 'update') {
      this.professorInterface = this.util.deepCopy(data.form);
      if (this.professorInterface._subjects.length) {
        this.subjArray = [];
        for (let subject of this.professorInterface._subjects) {
          this.subjArray.push({
            config: JSON.parse(JSON.stringify(SUBJECT_AUTOCOMPLETE_CONFIG)),
            field: {
              label: 'Subject',
              default: `${subject.name} - ${subject.code}`,
            },
            _id: subject._id,
          });
        }
      }
    }
  }

  ngOnInit(): void {
    this.title = this.data.title;
  }

  autocompleteListener(event: Subject, index: number) {
    this.subjArray[index] = {
      ...this.subjArray[index],
      field: { label: 'Subject', default: `${event.name} - ${event.code}` },
      _id: event._id,
    };
    let uniqueArr = [];
    let newArr = [];

    this.subjArray.forEach((c) => {
      if (!uniqueArr.includes(c._id)) {
        uniqueArr.push(c._id);
        newArr.push(c);
      }
    });

    this.subjArray = newArr;

    console.log(this.subjArray);
  }

  addSubject() {
    let conf = JSON.parse(JSON.stringify(SUBJECT_AUTOCOMPLETE_CONFIG));
    this.subjArray.push({
      config: conf,
      field: { label: 'Subject' },
    });
  }
  removeSubject(index: number) {
    this.subjArray.splice(index, 1);
  }

  onSubmit() {
    this.saving = true;
    if (this.data.action === 'add') {
      this.onAdd();
    } else {
      this.onUpdate();
    }
  }

  onAdd() {
    this.sb.open(
      `Adding ${this.professorDetails.form.value.firstName} ${this.professorDetails.form.value.lastName}...`,
      undefined
    );
    let subjects = this.subjArray.map((subject) => subject._id);
    let body = {
      ...this.professorDetails.form.getRawValue(),
      _subjects: subjects,
    };
    console.log(body);
    this.api.professor.createProfessor(body).subscribe(this.apiObserver);
  }

  onUpdate() {
    this.sb.open(
      `Updating ${this.professorDetails.form.value.firstName} ${this.professorDetails.form.value.lastName}...`,
      undefined
    );

    let subjects = this.subjArray.map((subject) => subject._id);
    let body = {
      ...this.professorDetails.form.getRawValue(),
      _subjects: subjects,
    };
    this.api.professor
      .updateProfessor(this.data.form._id, body)
      .subscribe(this.apiObserver);
  }

  onDelete() {
    this.sb.open(
      `Deleting ${this.professorDetails.form.value.firstName} ${this.professorDetails.form.value.lastName}...`,
      undefined
    );
    this.api.professor
      .deleteProfessor(this.data.form._id)
      .subscribe(this.apiObserver);
  }

  onCancel() {
    if (!this.saving) this.dialogRef.close(false);
  }

  isDisabled() {
    if (this.professorDetails && !this.professorDetails.form?.valid)
      return true;
    for (let subject of this.subjArray) {
      if (!subject._id) return true;
    }

    return false;
  }
}
