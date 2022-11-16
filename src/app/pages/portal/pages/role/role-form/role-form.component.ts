import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Section } from 'src/app/models/form.interface';
import { NavNode } from 'src/app/models/treesidenav.interface';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilService } from 'src/app/services/util/util.service';
import { NewFormComponent } from 'src/app/shared/components/new-form/new-form.component';
import { DialogAreYouSureComponent } from 'src/app/shared/dialogs/dialog-are-you-sure/dialog-are-you-sure.component';
import { USER_NAVS } from '../../../portal.configs';
import { ROLE_FORM } from './role-form.configs';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  @ViewChild('roleDetails') roleDetails!: NewFormComponent;

  roleFormField: Section[] = ROLE_FORM;
  roleInterface: any;

  message: string;
  title: string;
  action: string;
  accesses: NavNode[] = this.util.deepCopy(USER_NAVS);
  lguAccesses: NavNode[] = [];

  checkedAll: boolean;
  someChecked: boolean;
  accessChanged: boolean;
  saving: boolean;
  loader: any;

  apiObserver = {
    next: (response: any) => {
      let pastTense = this.action.concat(
        this.action.endsWith('e') ? 'd' : 'ed'
      );
      this.message = `Successfully ${pastTense}: ${this.roleDetails.form.value.name} !`;
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
    private dialogRef: MatDialogRef<RoleFormComponent>,
    private sb: MatSnackBar,
    private dialog: MatDialog,
    private api: ApiService,
    private util: UtilService
  ) {
    this.title = this.data.title;
    this.action = this.util.deepCopy(this.data.action);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.roleInterface = this.data.form;
    const userNavs = this.util.deepCopy(USER_NAVS);

    if (this.data.action === 'update') {
      this.accesses = this.updateValues(
        JSON.parse(JSON.stringify(this.initDefaultAccessModules(userNavs))),
        this.data.form.accesses
      );
    }

    this.checkBoxChecker();
  }

  initDefaultAccessModules(accesses: any) {
    const accessCopy = this.util.deepCopy(accesses);
    for (let access of accessCopy) {
      if (access.label === 'Dashboard') {
        access.hasAccess = true;
      } else {
        access.hasAccess = false;
        if (access?.subaccess?.length) {
          console.log(access.subaccess);
          access.subaccess = this.initDefaultAccessModules(access.subaccess);
        }
      }
    }

    return accessCopy;
  }

  checkAll(event: any, navs: any) {
    navs.forEach((res: any) => {
      if (res.label !== 'Dashboard') {
        res.hasAccess = event.checked;
        res.subaccess?.forEach((child: any) => {
          child.hasAccess = res.hasAccess;
          this.check(child);
        });
      }
    });
    this.accessChanged = true;
    if (event.checked === 'false') {
      this.checkBoxChecker();
    }
  }

  check(item: NavNode) {
    if (item.subaccess && item.subaccess.length) {
      item.subaccess.forEach((child) => {
        child.hasAccess = item.hasAccess;
        this.check(child);
      });
    }

    this.checkMotherAccess(this.accesses);
    this.accessChanged = true;
    //Check if accessible module has checked values
    // if (this.accesses.filter((o) => o.hasAccess === true).length) {
    //   this.accessChanged = true;
    // } else {
    //   this.accessChanged = false;
    // }
    this.checkBoxChecker();
  }

  private checkMotherAccess(items: any) {
    items.forEach((item: NavNode) => {
      if (item.subaccess) {
        if (!item.subaccess.filter((c) => c.hasAccess === true).length) {
          item.hasAccess = false;
        }
        this.checkMotherAccess(item.subaccess);
      }
    });
  }

  private updateValues(newObj: NavNode[], oldObj: NavNode[]) {
    const cpyNewObj: NavNode[] = JSON.parse(JSON.stringify(newObj));
    const cpyOldObj: NavNode[] = JSON.parse(JSON.stringify(oldObj));
    for (let old of cpyOldObj) {
      let foundObj = cpyNewObj.find((obj: NavNode) => obj.label === old.label);
      if (foundObj) {
        this.updateChildValues(foundObj, old);
        foundObj.hasAccess = old.hasAccess;
        foundObj = { ...old, ...foundObj };
      }
    }
    return cpyNewObj;
  }

  private updateChildValues(found: NavNode, old: NavNode) {
    if (
      found.subaccess &&
      found.subaccess.length &&
      old.subaccess &&
      old.subaccess.length
    ) {
      for (let child of old.subaccess) {
        let foundChild = found.subaccess.find(
          (cObj: NavNode) => cObj.label === child.label
        );
        if (foundChild) {
          this.updateChildValues(foundChild, child);
          foundChild.hasAccess = child.hasAccess;
          foundChild = { ...child, ...foundChild };
        }
      }
    }
    found = { ...old, ...found };
  }

  checkBoxChecker() {
    for (let access of this.accesses) {
      this.someChecked =
        this.accesses.filter((res) => res.hasAccess).length > 0;
      if (!access.hasAccess) {
        this.checkedAll = false;
        break;
      } else {
        this.checkedAll = true;
      }
    }
  }

  onCancel() {
    let changed: boolean =
      this.roleDetails.form.dirty &&
      (this.data.action === 'update'
        ? !this.dataChanges()
        : !this.util.emptyDetails(this.roleDetails.form.getRawValue()));

    if (changed || this.accessChanged) {
      this.dialog
        .open(DialogAreYouSureComponent, {
          data: {
            header: 'Before you proceed...',
            msg:
              this.data.action === 'add'
                ? 'stop adding new role'
                : `stop editing the details of ${this.data.form.name}`,
          },
        })
        .afterClosed()
        .subscribe((confirm: boolean) => {
          if (confirm) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  onSubmit() {
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `${this.data.action} ${this.roleDetails.form.value.name}`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          if (this.data.action === 'add') {
            this.onAdd();
          } else {
            this.onUpdate();
          }
        }
      });
  }

  onUpdate() {
    this.sb.open(`Updating ${this.roleDetails.form.value.name}...`, undefined);
    let body = {
      ...this.roleDetails.form.getRawValue(),
      accesses: this.accesses,
    };
    this.api.role
      .updateRole(this.data.form._id, body)
      .subscribe(this.apiObserver);
  }
  onAdd() {
    this.sb.open(`Adding ${this.roleDetails.form.value.name}...`, undefined);

    let body = {
      ...this.roleDetails.form.getRawValue(),
      accesses: this.accesses,
    };
    this.api.role.createRole(body).subscribe(this.apiObserver);
  }

  onDelete() {
    this.action = 'delete';
    this.dialog
      .open(DialogAreYouSureComponent, {
        data: {
          header: 'Before you proceed...',
          msg: `delete ${this.roleDetails.form.value.name}`,
        },
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.saving = true;
          this.sb.open(
            `Deleting ${this.roleDetails.form.value.name}...`,
            undefined
          );
          this.api.role
            .deleteRole(this.data.form._id)
            .subscribe(this.apiObserver);
        }
      });
  }

  isDisabled() {
    if (!this.roleDetails) return true;

    if (this.roleDetails) {
      if (
        !this.roleDetails.form.valid &&
        (this.roleDetails.form.dirty || !this.accessChanged)
      ) {
        return true;
      }
    }

    if (this.data.action === 'update') {
      if (!this.dataChanges() || this.accessChanged) return false;
      else return true;
    }
    return false;
  }

  dataChanges() {
    let changes: boolean = true;
    let originalDetail = JSON.parse(JSON.stringify(this.data.form));

    changes = this.util.dataChanges(
      this.roleDetails.form.getRawValue(),
      originalDetail
    );

    return changes;
  }
}
