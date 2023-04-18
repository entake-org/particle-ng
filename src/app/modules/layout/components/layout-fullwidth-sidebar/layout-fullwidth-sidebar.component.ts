import {Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'particle-layout-fullwidth-sidebar',
  templateUrl: './layout-fullwidth-sidebar.component.html',
  styleUrls: ['../../layout.css']
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
  width: string = '250px';

  get stickySidebarHeight(): string {
    const offset: number = +this.headerHeight.replace(/\D/g, "") +
      +this.footerHeight.replace(/\D/g, "");

    return `calc(100vh - ${offset}px)`;
  }

  constructor() { }

}
