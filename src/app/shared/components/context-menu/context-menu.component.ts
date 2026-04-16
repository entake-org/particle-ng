import {Component, input, model, output, ViewChild} from '@angular/core';
import {NgClass} from '@angular/common';
import {PopoverComponent} from "../popover/popover.component";
import {ContextMenuEntry} from "../../models/context-menu-entry.model";

@Component({
    selector: 'particle-context-menu',
    templateUrl: './context-menu.component.html',
    imports: [PopoverComponent, NgClass]
})
export class ContextMenuComponent {

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

  protected readonly window = window;

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
