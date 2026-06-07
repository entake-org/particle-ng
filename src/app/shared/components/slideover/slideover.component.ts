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
import {CdkTrapFocus} from "@angular/cdk/a11y";
import {debounceTime, fromEvent, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'particle-slideover',
  templateUrl: './slideover.component.html',
  styleUrls: ['./slideover.component.css'],
  imports: [NgClass, CdkTrapFocus]
})
export class SlideoverComponent implements AfterViewInit, OnDestroy {
  private _position = 'right';
  private destroy$ = new Subject<void>();
  private originatingFocusElement: HTMLElement | null = null;

  slideoverOpen = false;
  visible = false;
  breakpointExceeded = false;

  @Input()
  set position(position: string) {
    if (position && ['left', 'right', 'top', 'bottom'].includes(position.toLowerCase())) {
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
  readonly text = input<SlideoverText>({ close: 'Close Slideover' } as SlideoverText);
  readonly breakpoint = input(769);
  readonly hideCloseButton = input(false);

  readonly opened = output<void>();
  readonly closed = output<void>();

  @ViewChild('overlay')
  overlay: ElementRef<HTMLDivElement> = null as any;

  constructor() {
    // Debounce resize events to prevent performance thrashing
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this._determineBreakpointExceeded(window.innerWidth);
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (this.slideoverOpen) {
      event.stopPropagation();
      this.close();
    }
  }

  private _determineBreakpointExceeded(innerWidth: number): void {
    const currentBreakpoint = this.breakpoint();
    if (!currentBreakpoint) return;

    const widthString = this.width();
    const parsedWidth = parseFloat(widthString.replace(/[^0-9.]/g, '')) || 0;

    this.breakpointExceeded = innerWidth < currentBreakpoint || innerWidth < parsedWidth;
  }

  open(): void {
    this.originatingFocusElement = document.activeElement as HTMLElement;

    this.addModalMask();
    this.slideoverOpen = true;
    this.visible = true;
    this.opened.emit();
  }

  close(): void {
    this.removeModalMask();
    this.slideoverOpen = false;
    this.closed.emit();

    if (this.originatingFocusElement && typeof this.originatingFocusElement.focus === 'function') {
      this.originatingFocusElement.focus();
    }
    this.originatingFocusElement = null;

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
    if (this.modal() && this.overlay) {
      this.overlay.nativeElement.classList.add('particle_dialog_overlay');
      document.body.classList.add('scroll_none');
    }
  }

  private removeModalMask(): void {
    if (this.modal() && this.overlay) {
      this.overlay.nativeElement.classList.remove('particle_dialog_overlay');
      document.body.classList.remove('scroll_none');
    }
  }

  ngAfterViewInit(): void {
    // Allow initial render to settle before running layout math
    setTimeout(() => {
      this._determineBreakpointExceeded(window.innerWidth);
    }, 0);
  }

  ngOnDestroy(): void {
    this.removeModalMask();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
