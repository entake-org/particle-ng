import { AfterViewInit, Component, OnDestroy, Renderer2, inject, input } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ScrollToTopText} from '../../models/particle-component-text.model';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'particle-scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    imports: [AsyncPipe]
})
export class ScrollToTopComponent implements OnDestroy, AfterViewInit {
  renderer = inject(Renderer2);


  readonly content = input<HTMLElement>(null as any);

  readonly scrollDistance = input(500);

  readonly bottomOffset = input(50);

  readonly text = input<ScrollToTopText>({
    scrollToTop: 'Scroll back to the top of the page'
} as ScrollToTopText);

  $scrollTop = new BehaviorSubject<number>(0);

  private _listener: any;

  ngAfterViewInit(): void {
    this._listener = this.renderer.listen(this.content(), 'scroll', () => {
      this.$scrollTop.next(this.content().scrollTop);
    });
  }

  ngOnDestroy(): void {
    this._listener();
  }

  scrollToTop(): void {
    const content = this.content();
    if (content) {
      content.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

}
