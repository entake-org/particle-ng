import {Component, inject, input, model, output, PLATFORM_ID, ViewChild} from '@angular/core';
import {isPlatformBrowser, NgClass} from '@angular/common';
import {PopoverComponent} from "../popover/popover.component";
import {ContextMenuEntry} from "../../models/context-menu-entry.model";

@Component({
    selector: 'particle-context-menu',
    templateUrl: './context-menu.component.html',
    imports: [PopoverComponent, NgClass]
})
export class ContextMenuComponent {
  private platformId = inject(PLATFORM_ID);

  readonly title = model<string>(null as any);
  readonly entries = model<Array<ContextMenuEntry>>(null as any);

  readonly width = input<string>('175');
  readonly height = input<string>('auto');
  readonly openDirection = input<'above' | 'below'>('below');
  readonly scaleForMobile = input(1.5);

  readonly selected = output<string>();
  readonly closed = output<void>();

  @ViewChild('popover')
  popover: PopoverComponent = null as any;

  protected isDesktop = isPlatformBrowser(this.platformId) ? window.innerWidth > 768 : true;

  get mobileWidth(): string {
    return (+this.width() * this.scaleForMobile()) + '';
  }

  get mobileHeight(): string {
    const height = this.height();
    if (height !== 'auto') {
      return (+height * this.scaleForMobile()) + '';
    }
    return height;
  }

  toggle(event?: Event): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth > 768;
    }
    this.popover.toggle(event);
  }

  close(): void {
    this.popover.close();
  }

  handleSelection(event: Event, key: string): void {
    event.stopImmediatePropagation();
    this.selected.emit(key);
    this.popover.close();
  }

}
