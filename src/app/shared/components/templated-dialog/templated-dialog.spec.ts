import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatedDialog } from './templated-dialog';

describe('TemplatedDialog', () => {
  let component: TemplatedDialog;
  let fixture: ComponentFixture<TemplatedDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatedDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatedDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
