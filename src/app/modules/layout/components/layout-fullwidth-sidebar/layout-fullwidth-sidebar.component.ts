import {Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'particle-layout-fullwidth-sidebar',
  templateUrl: './layout-fullwidth-sidebar.component.html'
})
export class LayoutFullwidthSidebarComponent {

  @Input()
  mainContent: TemplateRef<any> = null as any;

  @Input()
  rightSidebar: TemplateRef<any> = null as any;

  @Input()
  mainContentContainerClassList = '';

  @Input()
  rightSidebarContainerClassList = '';

  @Input()
  rightSidebarSticky = false;

  @Input()
  headerHeight: string = '0';

  @Input()
  footerHeight: string = '0';

  @Input()
  rightSidebarWidth: string = '250px';

  @Input()
  breakpoint: number = 1024;

  @Input()
  rightSidebarCollapsedTabOffset = 150;

  @Input()
  collapsedClassList = '';

  protected readonly window = window;

  get stickySidebarHeight(): string {
    const offset: number = +this.headerHeight.replace(/\D/g, "") +
      +this.footerHeight.replace(/\D/g, "");

    return `calc(100vh - ${offset}px)`;
  }

  constructor() { }

}
