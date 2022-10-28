import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteApiComponent } from './autocomplete-api.component';

describe('AutocompleteApiComponent', () => {
  let component: AutocompleteApiComponent;
  let fixture: ComponentFixture<AutocompleteApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
