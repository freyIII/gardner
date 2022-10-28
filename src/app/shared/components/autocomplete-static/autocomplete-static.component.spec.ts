import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteStaticComponent } from './autocomplete-static.component';

describe('AutocompleteStaticComponent', () => {
  let component: AutocompleteStaticComponent;
  let fixture: ComponentFixture<AutocompleteStaticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteStaticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
