import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteInput } from './auto-complete-input';

describe('AutoCompleteInput', () => {
  let component: AutoCompleteInput;
  let fixture: ComponentFixture<AutoCompleteInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCompleteInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoCompleteInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
