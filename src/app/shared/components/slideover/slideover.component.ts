import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  input,
  OnDestroy,
  output,
  ViewChild
} from '@angular/core';
import {SlideoverText} from '../../models/particle-component-text.model';
import {NgClass} from '@angular/common';

@Component({
    selector: 'particle-slideover',
    templateUrl: './slideover.component.html',
    styleUrls: ['./slideover.component.css'],
    imports: [NgClass]
})
export class SlideoverComponent implements AfterViewInit, OnDestroy {

  private _position = 'right';

  slideoverOpen = false;
  visible = false;

  @Input()
  set position(position: string) {
    if (position && ['left', 'right', 'top', 'bottom'].indexOf(position.toLowerCase()) > -1) {
      this._position = position.toLowerCase();
    } else {
      this._position = 'right';
    }
  }

  get position(): string {
    return this._position;
  }

  readonly modal = input(true);

  readonly width = input('300px');

  readonly height = input('100px');

  readonly bgClass = input('content_color');

  readonly text = input<SlideoverText>({
    close: 'Close Slideover'
} as SlideoverText);

  /**
   * Breakpoint that will make the container take over the screen when it's crossed.
   */
  readonly breakpoint = input(769);

  readonly hideCloseButton = input(false);

  readonly opened = output<any>();

  readonly closed = output<any>();

  @ViewChild('overlay')
  overlay: ElementRef = null as any;

  breakpointExceeded = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this._determineBreakpointExceeded(event.target.innerWidth);
  }

  private _determineBreakpointExceeded(innerWidth: number): void {
    const breakpoint = this.breakpoint();
    if (breakpoint) {
      this.breakpointExceeded = innerWidth < breakpoint || innerWidth < +this.width().substring(0, this.width().length - 2);
    }
  }

  open(): void {
    this.addModalMask();
    this.slideoverOpen = true;
    this.visible = true;
    this.opened.emit(null as any);
  }

  close(): void {
    this.removeModalMask();
    this.slideoverOpen = false;
    this.closed.emit(null as any);

    setTimeout(() => this.visible = false, 200);
  }

  toggle(): void {
    if (this.slideoverOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private addModalMask(): void {
    if (this.modal()) {
      this.overlay.nativeElement.classList.add('particle_dialog_overlay');
      document.body.classList.add('scroll_none');
    }
  }

  private removeModalMask(): void {
    if (this.modal()) {
      this.overlay.nativeElement.classList.remove('particle_dialog_overlay');
      document.body.classList.remove('scroll_none');
    }
  }

  ngOnDestroy(): void {
    this.removeModalMask();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._determineBreakpointExceeded(window.innerWidth)
    }, 100);
  }

}
