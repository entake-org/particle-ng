import {Component, HostListener, Input, TemplateRef, ViewChild} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {SlideoverComponent} from '../slideover/slideover.component';

@Component({
    selector: 'particle-layout-full-framing',
    templateUrl: './layout-full-framing.component.html',
    imports: [NgClass, NgTemplateOutlet, SlideoverComponent]
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
  headerClassList = '';

  @Input()
  footerClassList = '';

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

  @Input()
  mobileSidebarEnabled = true;

  @ViewChild('slideover')
  slideover: SlideoverComponent = null as any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.mobileSidebarEnabled && event.target.innerWidth > 768 && this.slideover && this.slideover.slideoverOpen) {
      this.slideover.close();
    }
  }

  protected readonly window = window;

  get stickySidebarHeight(): string {
    const offset: number = +this.headerHeight.replace(/\D/g, "") +
      +this.footerHeight.replace(/\D/g, "");

    return `calc(100vh - ${offset}px)`;
  }

  get contentSidebarHeight(): string {
    const offset: number = +this.headerHeight.replace(/\D/g, "") +
      +this.footerHeight.replace(/\D/g, "");

    return `calc(100% - ${offset}px)`;
  }

}
