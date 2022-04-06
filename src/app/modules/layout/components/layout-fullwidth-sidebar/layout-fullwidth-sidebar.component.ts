import {Component, Input, TemplateRef} from '@angular/core';

@Component({
  selector: 'particle-layout-fullwidth-sidebar',
  templateUrl: './layout-fullwidth-sidebar.component.html',
  styleUrls: ['./layout-fullwidth-sidebar.component.css']
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

  constructor() { }

}
