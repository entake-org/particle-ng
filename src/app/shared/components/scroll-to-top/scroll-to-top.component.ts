import { AfterViewInit, Component, OnDestroy, Renderer2, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ScrollToTopText } from '../../models/particle-component-text.model';

@Component({
  selector: 'particle-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  imports: [AsyncPipe]
})
export class ScrollToTopComponent implements OnDestroy, AfterViewInit {
  private renderer = inject(Renderer2);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  readonly content = input<HTMLElement>(null as any);

  readonly scrollDistance = input(500);

  readonly bottomOffset = input(50);

  readonly text = input<ScrollToTopText>({
    scrollToTop: 'Scroll back to the top of the page'
  } as ScrollToTopText);

  $scrollTop = new BehaviorSubject<number>(0);

  private _listener: any;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    const scrollTarget = this.content() || window;

    this._listener = this.renderer.listen(scrollTarget, 'scroll', () => {
      const currentScroll = this.content() ? this.content().scrollTop
        : (window.scrollY || document.documentElement.scrollTop);

      this.$scrollTop.next(currentScroll);
    });
  }

  ngOnDestroy(): void {
    if (this._listener) {
      this._listener();
    }
  }

  scrollToTop(): void {
    if (!this.isBrowser) {
      return;
    }

    if (this.content()) {
      this.content().scroll({ top: 0, behavior: 'smooth' });
    } else {
      window.scroll({ top: 0, behavior: 'smooth' });
    }
  }
}
