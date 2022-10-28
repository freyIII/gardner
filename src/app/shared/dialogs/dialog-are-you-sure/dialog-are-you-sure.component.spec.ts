import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../material/material.module';

import { DialogAreYouSureComponent } from './dialog-are-you-sure.component';

describe('DialogAreYouSureComponent', () => {
  let component: DialogAreYouSureComponent;
  let fixture: ComponentFixture<DialogAreYouSureComponent>;
  const mockData = {
    header: 'foo',
    msg: 'bar',
  };
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [DialogAreYouSureComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAreYouSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header and message', () => {
    let headerContainer = fixture.debugElement.query(
      By.css('.mat-dialog-title')
    );
    let messageContainer = fixture.debugElement.query(
      By.css('.mat-dialog-content')
    );
    expect(headerContainer.nativeElement.innerText).toContain(mockData.header);
    expect(messageContainer.nativeElement.innerText).toContain(mockData.msg);
  });

  it('submit button should close the dialog', () => {
    let submitBtn = fixture.nativeElement.querySelector('#submitBtn');
    submitBtn.dispatchEvent(new Event('click'));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('cancel button should close the dialog', () => {
    let cancelBtn = fixture.nativeElement.querySelector('#cancelBtn');
    cancelBtn.dispatchEvent(new Event('click'));
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
