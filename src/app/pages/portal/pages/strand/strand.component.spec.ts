import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrandComponent } from './strand.component';

describe('StrandComponent', () => {
  let component: StrandComponent;
  let fixture: ComponentFixture<StrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
