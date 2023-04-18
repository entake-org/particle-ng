import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFullFramingComponent } from './layout-full-framing.component';

describe('LayoutFullwidthHeaderComponent', () => {
  let component: LayoutFullFramingComponent;
  let fixture: ComponentFixture<LayoutFullFramingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutFullFramingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutFullFramingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
