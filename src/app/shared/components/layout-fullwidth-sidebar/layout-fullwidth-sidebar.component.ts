import {Component, HostListener, TemplateRef, ViewChild, input} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {SlideoverComponent} from '../slideover/slideover.component';

@Component({
    selector: 'particle-layout-fullwidth-sidebar',
    templateUrl: './layout-fullwidth-sidebar.component.html',
    imports: [NgClass, NgTemplateOutlet, SlideoverComponent]
})
export class LayoutFullwidthSidebarComponent {

  readonly mainContent = input<TemplateRef<any>>(null as any);

  readonly rightSidebar = input<TemplateRef<any>>(null as any);

  readonly mainContentContainerClassList = input('');

  readonly rightSidebarContainerClassList = input('');

  readonly rightSidebarSticky = input(false);

  readonly headerHeight = input<string>('0');

  readonly footerHeight = input<string>('0');

  readonly rightSidebarWidth = input<string>('250px');

  readonly breakpoint = input<number>(1024);

  readonly rightSidebarCollapsedTabOffset = input(150);

  readonly collapsedClassList = input('');

  readonly mobileSidebarEnabled = input(true);

  @ViewChild('slideover')
  slideover: SlideoverComponent = null as any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.mobileSidebarEnabled() && event.target.innerWidth > 768 && this.slideover && this.slideover.slideoverOpen) {
      this.slideover.close();
    }
  }

  protected readonly window = window;

  get stickySidebarHeight(): string {
    const offset: number = +this.headerHeight().replace(/\D/g, "") +
      +this.footerHeight().replace(/\D/g, "");

    return `calc(100vh - ${offset}px)`;
  }

}
