import { Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CarouselOptions} from '../models/carousel-options.model';

/**
 * This directive when applied to a div will hijack its background and apply a carousel of images.
 */
@Directive({
    selector: '[particleCarousel]',
    standalone: true
})
export class BackgroundCarouselDirective implements OnDestroy {

  /**
   * Carousel Options
   */
  private _options = new BehaviorSubject<CarouselOptions>({
   images: [],
   transitionTime: 2,
   viewTime: 10,
   resetInterval: false
  } as CarouselOptions);

  /**
   * Reference to the interval for swapping the background image.
   */
  private _interval: any;

  /**
   * Sets the options for the carousel
   *
   * @param value
   */
  @Input('particleCarouselOptions')
  set options(value: CarouselOptions) {
    this._options.next(value);
  }

  /**
   * Gets the options for the carousel
   */
  get options(): CarouselOptions {
    return this._options.getValue();
  }

  /**
   * Constructor will set up all of the behavior for the carousel based on the options supplied by the user.
   *
   * @param el
   */
  constructor() {
    const el = inject(ElementRef);

    this._options.subscribe(
      () => {
        this.initOptions();

        if (this.options.resetInterval) {
          clearInterval(this._interval);
          el.nativeElement.style.backgroundImage = null;
          this._interval = null;
        }

        if (this.options.images.length > 0 && !this._interval) {
          let imagePointer = 0;
          el.nativeElement.style.backgroundSize = 'cover';
          el.nativeElement.style.backgroundPosition = 'center center';
          el.nativeElement.style.backgroundRepeat = 'no-repeat';
          el.nativeElement.style.transition = `all ${this.options.transitionTime}s ease`;
          el.nativeElement.style.backgroundImage = `url(${this.options.images[imagePointer++]})`;

          if (!this._interval) {
            this._interval = setInterval(() => {
              el.nativeElement.style.backgroundImage = `url(${this.options.images[imagePointer++ % this.options.images.length]})`;
            }, this.options.viewTime * 1000);
          }
        }
      }
    );
  }

  /**
   * Initializes the options to default settings for whatever isn't provided by the developer
   */
  private initOptions(): void {
    if (!this.options.images) {
      this.options.images = [];
    }

    if (!this.options.transitionTime) {
      this.options.transitionTime = 2;
    }

    if (!this.options.viewTime) {
      this.options.viewTime = 10;
    }
  }

  /**
   * Clears the interval when the component is destroyed.
   */
  ngOnDestroy(): void {
    clearInterval(this._interval);
  }
}
