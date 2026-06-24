import { Component, HostListener, TemplateRef, ViewChild, input, inject, PLATFORM_ID } from '@angular/core';
import { NgClass, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { SlideoverComponent } from '../slideover/slideover.component';

@Component({
  selector: 'particle-layout-fullwidth-sidebar',
  templateUrl: './layout-fullwidth-sidebar.component.html',
  imports: [NgClass, NgTemplateOutlet, SlideoverComponent]
})
export class LayoutFullwidthSidebarComponent {
  private platformId = inject(PLATFORM_ID);

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

  protected isMobileMode = isPlatformBrowser(this.platformId) ? window.innerWidth <= this.breakpoint() : false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isMobileMode = event.target.innerWidth <= this.breakpoint();

    if (this.mobileSidebarEnabled() && event.target.innerWidth > 768 && this.slideover && this.slideover.slideoverOpen) {
      this.slideover.close();
    }
  }

  get stickySidebarHeight(): string {
    const offset: number = +this.headerHeight().replace(/\D/g, "") +
      +this.footerHeight().replace(/\D/g, "");

    return `calc(100vh - ${offset}px)`;
  }

}
