import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  viewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import { CdkTrapFocus } from "@angular/cdk/a11y";
import { debounceTime, fromEvent } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SlideoverText } from '../../models/particle-component-text.model';

@Component({
  selector: 'particle-slideover',
  templateUrl: './slideover.component.html',
  styleUrls: ['./slideover.component.css'],
  imports: [NgClass, CdkTrapFocus]
})
export class SlideoverComponent implements AfterViewInit {
  slideoverOpen = false;
  breakpointExceeded = false;
  isInitialized = false;
  private originatingFocusElement: HTMLElement | null = null;

  readonly position = input('right', {
    transform: (value: string | undefined | null) => {
      const normalized = value?.toLowerCase();
      return normalized && ['left', 'right', 'top', 'bottom'].includes(normalized)
        ? normalized
        : 'right';
    }
  });

  readonly modal = input(true);
  readonly width = input('300px');
  readonly height = input('100px');
  readonly bgClass = input('content_color');
  readonly text = input<SlideoverText>({close: 'Close Slideover', title: 'Slideover'} as SlideoverText);
  readonly breakpoint = input(769);
  readonly hideCloseButton = input(false);

  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly overlay = viewChild<ElementRef<HTMLDivElement>>('overlay');

  constructor() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed()
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._determineBreakpointExceeded(window.innerWidth);
      this.isInitialized = true;
    }, 50);
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

    if (this.modal()) {
      document.body.classList.add('scroll_none');
    }

    this.slideoverOpen = true;
    this.opened.emit();
  }

  close(): void {
    if (this.modal()) {
      document.body.classList.remove('scroll_none');
    }

    this.slideoverOpen = false;
    this.closed.emit();

    if (this.originatingFocusElement && typeof this.originatingFocusElement.focus === 'function') {
      this.originatingFocusElement.focus();
    }
    this.originatingFocusElement = null;
  }

  toggle(): void {
    if (this.slideoverOpen) {
      this.close();
    } else {
      this.open();
    }
  }

}
