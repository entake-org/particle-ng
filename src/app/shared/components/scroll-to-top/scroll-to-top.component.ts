import {AfterViewInit, Component, Input, OnDestroy, Renderer2} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ScrollToTopText} from '../../models/particle-component-text.model';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'particle-scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    standalone: true,
    imports: [AsyncPipe]
})
export class ScrollToTopComponent implements OnDestroy, AfterViewInit {

  @Input()
  content: HTMLElement = null as any;

  @Input()
  scrollDistance = 500;

  @Input()
  bottomOffset = 50;

  @Input()
  text: ScrollToTopText = {
    scrollToTop: 'Scroll back to the top of the page'
  } as ScrollToTopText;

  $scrollTop = new BehaviorSubject<number>(0);

  private _listener: any;

  constructor(
    public renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this._listener = this.renderer.listen(this.content, 'scroll', () => {
      this.$scrollTop.next(this.content.scrollTop);
    });
  }

  ngOnDestroy(): void {
    this._listener();
  }

  scrollToTop(): void {
    if (this.content) {
      this.content.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

}
