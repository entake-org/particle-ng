import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFullwidthSidebarComponent } from './layout-fullwidth-sidebar.component';

describe('LayoutFullwidthSidebarComponent', () => {
  let component: LayoutFullwidthSidebarComponent;
  let fixture: ComponentFixture<LayoutFullwidthSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LayoutFullwidthSidebarComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutFullwidthSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
