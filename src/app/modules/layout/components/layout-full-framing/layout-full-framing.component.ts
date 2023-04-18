import {Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'particle-layout-full-framing',
  templateUrl: './layout-full-framing.component.html',
  styleUrls: ['../../layout.module.css']
})
export class LayoutFullFramingComponent {

  @Input()
  mainContent: TemplateRef<any> = null as any;

  @Input()
  rightSidebar: TemplateRef<any> = null as any;

  @Input()
  header: TemplateRef<any> = null as any;

  @Input()
  footer: TemplateRef<any> = null as any;

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
