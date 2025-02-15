import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, inject, input } from '@angular/core';

/**
 * Directive to create a tooltip around the host element
 * TODO: Open/Close animation with AnimationFactory
 */
@Directive({
    selector: '[particleTooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private renderer = inject(Renderer2);


  /**
   * The number of pixels from the host to offset the tooltip
   * @private
   */
  private readonly TOOLTIP_OFFSET = 15;

  /**
   * Tooltip text input
   * @param text the text to set for the tooltip
   */
  @Input()
  set particleTooltip(text: string) {
    this._text = text;

    if (text) {
      if (this.tooltip?.parentElement) {
        this.setTooltipText();
        this.alignTooltip();
      }
    } else {
      this.deleteTooltip();
    }
  }
  get particleTooltip(): string { return this._text; }

  /**
   * The direction of the tooltip around the host element
   */
  readonly tooltipPosition = input<'left' | 'right' | 'top' | 'bottom'>('bottom');

  /**
   * Whether to disable the tooltip
   * @param disabled disabled or not
   */
  @Input()
  set tooltipDisabled(disabled: boolean) {
    this._tooltipDisabled = disabled;
    if (disabled && !!this.tooltip?.parentElement) {
      this.deleteTooltip();
    }
  }

  get tooltipDisabled(): boolean {
    return this._tooltipDisabled;
  }

  /**
   * The DIV element housing the tooltip
   * @private
   */
  private tooltip: HTMLDivElement = null as any;

  /**
   * The tooltip text
   * @private
   */
  private _text: string = null as any;

  /**
   * Whether or not the tooltip is disabled
   * @private
   */
  private _tooltipDisabled: boolean = false;

  /**
   * Array of scroll unlisten functions
   * @private
   */
  private scrollUnlisteners: Array<() => void> = [];

  /**
   * Get window scroll top
   * @private
   */
  private static getWindowScrollTop(): number {
    const { scrollTop, clientTop } = document.documentElement;
    return (window.scrollY ?? scrollTop) - (clientTop ?? 0);
  }

  /**
   * Get window scroll left
   * @private
   */
  private static getWindowScrollLeft(): number {
    const { scrollLeft, clientLeft } = document.documentElement;
    return (window.scrollX ?? scrollLeft) - (clientLeft ?? 0);
  }

  /**
   * Destroy directive, invoke scroll unlisteners
   */
  ngOnDestroy(): void {
    this.removeScrollListeners();
  }

  /**
   * Handle host mouse enter event
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTooltip();
  }

  /**
   * Handle host mouse leave event
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.deleteTooltip();
  }

  /**
   * Handle host click event
   */
  @HostListener('click')
  onClick(): void {
    this.deleteTooltip();
  }

  /**
   * Create tooltip, set the text and align it
   * @private
   */
  private showTooltip(): void {
    if (!this.tooltipDisabled) {
      this.createTooltip();
      this.setTooltipText();
      this.alignTooltip();

      this.addScrollListeners();
    }
  }

  /**
   * Add the tooltip to the DOM
   * @private
   */
  private createTooltip(): void {
    this.deleteTooltip();

    this.tooltip = this.renderer.createElement('div');
    this.renderer.appendChild(document.body, this.tooltip);
    this.renderer.addClass(this.tooltip, 'particle_tooltip');
  }

  /**
   * Set tooltip text
   * @private
   */
  private setTooltipText(): void {
    this.renderer.setProperty(this.tooltip, 'innerHTML', this.particleTooltip);
  }

  /**
   * Align the tooltip to the input position or the next best fit
   * @private
   */
  private alignTooltip(): void {
    switch (this.tooltipPosition()) {
      case 'left':
        this.renderer.addClass(this.tooltip, 'left');
        this.alignLeft();

        if (this.tooltipOutOfWindow()) {
          this.renderer.removeClass(this.tooltip, 'left');
          this.renderer.addClass(this.tooltip, 'top');
          this.alignTop();

          if (this.tooltipOutOfWindow()) {
            this.renderer.removeClass(this.tooltip, 'top');
            this.renderer.addClass(this.tooltip, 'right');
            this.alignRight();

            if (this.tooltipOutOfWindow()) {
              this.renderer.removeClass(this.tooltip, 'right');
              this.renderer.addClass(this.tooltip, 'bottom');
              this.alignBottom();
            }
          }
        }
        break;
      case 'top':
        this.renderer.addClass(this.tooltip, 'top');
        this.alignTop();

        if (this.tooltipOutOfWindow()) {
          this.renderer.removeClass(this.tooltip, 'top');
          this.renderer.addClass(this.tooltip, 'right');
          this.alignRight();

          if (this.tooltipOutOfWindow()) {
            this.renderer.removeClass(this.tooltip, 'right');
            this.renderer.addClass(this.tooltip, 'bottom');
            this.alignBottom();

            if (this.tooltipOutOfWindow()) {
              this.renderer.removeClass(this.tooltip, 'bottom');
              this.renderer.addClass(this.tooltip, 'left');
              this.alignLeft();
            }
          }
        }
        break;
      case 'right':
        this.renderer.addClass(this.tooltip, 'right');
        this.alignRight();

        if (this.tooltipOutOfWindow()) {
          this.renderer.removeClass(this.tooltip, 'right');
          this.renderer.addClass(this.tooltip, 'bottom');
          this.alignBottom();

          if (this.tooltipOutOfWindow()) {
            this.renderer.removeClass(this.tooltip, 'bottom');
            this.renderer.addClass(this.tooltip, 'left');
            this.alignLeft();

            if (this.tooltipOutOfWindow()) {
              this.renderer.removeClass(this.tooltip, 'left');
              this.renderer.addClass(this.tooltip, 'top');
              this.alignTop();
            }
          }
        }
        break;
      case 'bottom':
        this.renderer.addClass(this.tooltip, 'bottom');
        this.alignBottom();

        if (this.tooltipOutOfWindow()) {
          this.renderer.removeClass(this.tooltip, 'bottom');
          this.renderer.addClass(this.tooltip, 'left');
          this.alignLeft();

          if (this.tooltipOutOfWindow()) {
            this.renderer.removeClass(this.tooltip, 'left');
            this.renderer.addClass(this.tooltip, 'top');
            this.alignTop();

            if (this.tooltipOutOfWindow()) {
              this.renderer.removeClass(this.tooltip, 'top');
              this.renderer.addClass(this.tooltip, 'right');
              this.alignRight();
            }
          }
        }
    }
  }

  /**
   * Align the tooltip to the left of the host
   * @private
   */
  private alignLeft(): void {
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left - this.tooltip.offsetWidth - this.TOOLTIP_OFFSET;
    const top = hostOffset.top + (this.element.nativeElement.offsetHeight - this.tooltip.offsetHeight) / 2;

    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
  }

  /**
   * Align the tooltip to the right of the host
   * @private
   */
  private alignRight(): void {
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + this.element.nativeElement.offsetWidth + this.TOOLTIP_OFFSET;
    const top = hostOffset.top + (this.element.nativeElement.offsetHeight - this.tooltip.offsetHeight) / 2;

    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
  }

  /**
   * Align the tooltip to the top of the host
   * @private
   */
  private alignTop(): void {
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + (this.element.nativeElement.offsetWidth - this.tooltip.offsetWidth) / 2;
    const top = hostOffset.top - this.tooltip.offsetHeight - this.TOOLTIP_OFFSET;

    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
  }

  /**
   * Align the tooltip to the bottom of the host
   * @private
   */
  private alignBottom(): void {
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + (this.element.nativeElement.offsetWidth - this.tooltip.offsetWidth) / 2;
    const top = hostOffset.top + this.element.nativeElement.offsetHeight + this.TOOLTIP_OFFSET;

    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
  }

  /**
   * Get the host's top and left position offset by window scroll
   * @private
   */
  private getHostOffset(): { left: number, top: number } {
    const { left, top } = this.element.nativeElement.getBoundingClientRect();
    const targetLeft = left + TooltipDirective.getWindowScrollLeft();
    const targetTop = top + TooltipDirective.getWindowScrollTop();

    return { left: targetLeft, top: targetTop };
  }

  /**
   * Remove the tooltip from the DOM
   * @private
   */
  private deleteTooltip(): void {
    if (this.tooltip?.parentElement) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null as any;
    }

    this.removeScrollListeners();
  }

  /**
   * Checks if the tooltip fits in the window
   * @private
   */
  private tooltipOutOfWindow(): boolean {
    const { top, left } = this.tooltip.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = this.tooltip;
    const { innerWidth, innerHeight } = window;

    return (left + offsetWidth > innerWidth) || (left < 0) || (top < 0) || (top + offsetHeight > innerHeight);
  }

  /**
   * Listen for scrolling on all scrollable parents of the host element
   * @private
   */
  private addScrollListeners(): void {
    const overflowRegex = /(auto|scroll)/;
    const overflowCheck = (node: any): boolean => {
      overflowRegex.lastIndex = 0;
      const styleDeclaration = window['getComputedStyle'](node, null);
      return overflowRegex.test(styleDeclaration.getPropertyValue('overflow')) ||
             overflowRegex.test(styleDeclaration.getPropertyValue('overflowX')) ||
             overflowRegex.test(styleDeclaration.getPropertyValue('overflowY'));
    };

    const parents = this.getParentElements(this.element.nativeElement);
    for (const parent of parents) {
      const scrollSelectors = parent.nodeType === 1 && parent.dataset['scrollselectors'];
      if (scrollSelectors) {
        const selectors = scrollSelectors.split(',');
        for (const selector of selectors) {
          const el = parent.querySelector(selector);
          if (el && overflowCheck(el)) {
            this.scrollUnlisteners.push(
              this.renderer.listen(el, 'scroll', () => this.deleteTooltip())
            );
          }
        }
      } else if (parent.nodeType !== 9 && overflowCheck(parent)) {
        this.scrollUnlisteners.push(
          this.renderer.listen(parent, 'scroll', () => this.deleteTooltip())
        );
      }
    }
  }

  /**
   * Invoke scroll unlisten functions and clear unlisteners list
   * @private
   */
  private removeScrollListeners(): void {
    for (const unlisten of this.scrollUnlisteners) {
      unlisten();
    }

    this.scrollUnlisteners = [];
  }

  /**
   * Get the parent elements for the input element
   * @param element the element to get parents for
   * @param parents the parent elements
   * @private
   */
  private getParentElements(element: any, parents: Array<any> = []): Array<any> {
    const { parentNode } = element;
    return !parentNode
      ? parents
      : this.getParentElements(parentNode, parents.concat([parentNode]));
  }
}
