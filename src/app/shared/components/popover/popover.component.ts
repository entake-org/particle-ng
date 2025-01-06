import {animate, AnimationEvent, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2} from '@angular/core';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import { NgClass, NgStyle } from '@angular/common';

/**
 * Component to display a popover with custom content
 */
@Component({
    selector: 'particle-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.css'],
    animations: [
        trigger('openClose', [
            transition('void => open', [
                style({ transform: 'scaleY(0.5)', opacity: 0 }),
                animate('200ms ease', style({ transform: 'scaleY(1)', opacity: 1 }))
            ]),
            transition('open => close', [
                style({ transform: 'scaleY(1)', opacity: 1 }),
                animate('200ms ease', style({ transform: 'scaleY(0.5)', opacity: 0 }))
            ]),
        ])
    ],
    imports: [CdkTrapFocus, NgStyle, NgClass]
})
export class PopoverComponent implements OnDestroy {

  protected readonly window = window;

  /**
   * The offset of the popover from its target (in pixels)
   */
  @Input()
  offset = 5;

  /**
   * Set the width of the popover in pixels (defaults to auto)
   */
  @Input()
  set width(width: string) {
    this._width = !width ? 'auto' : `${width}px`;
  }

  get width(): string {
    return this._width;
  }

  /**
   * Set the height of the popover in pixels (defaults to auto)
   */
  @Input()
  set height(height: string) {
    this._height = !height ? 'auto' : `${height}px`;
  }

  get height(): string {
    return this._height;
  }

  /**
   * A class-list to apply to the popover content
   */
  @Input()
  classList = 'content_color particle_popover_shadow';

  @Input()
  targetOverride: EventTarget = null as any;

  @Input()
  openDirection: 'above' | 'below' = 'above';

  @Input()
  alignment: 'left' | 'center' = 'left';

  @Input()
  scaleForMobile = '1';

  /**
   * Event emitted on popover open
   */
  @Output()
  opened = new EventEmitter<void>();

  /**
   * Event emitted on popover close
   */
  @Output()
  closed = new EventEmitter<void>();

  /**
   * Whether the popover should render
   */
  render: boolean = false;

  /**
   * Whether the popover is visible
   */
  visible: boolean = false;

  /**
   * The width of the popover
   */
  private _width = 'auto';

  /**
   * The height of the popover
   */
  private _height = 'auto';

  /**
   * The element to target
   * @private
   */
  private target: EventTarget = null as any;

  /**
   * The popover content container
   * @private
   */
  private container: HTMLDivElement = null as any;

  /**
   * Array of escape keyup unlisten functions
   * @private
   */
  private escapeKeyUpUnlisteners: Array<() => void> = [];

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) {
  }

  /**
   * Destroy component, clean up event listeners
   */
  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  /**
   * Close popover on click
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.visible) {
      const {pageX, pageY} = event;

      if (pageX > 0 && pageY > 0) {
        const {left, right, top, bottom} = this.container.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;
        const shouldClose = !(xPositionValid && yPositionValid);

        if (shouldClose) {
          this.close();
        }
      }
    }
  }

  /**
   * Re-position popover on window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.visible) {
      this.positionPopover();
    }
  }

  /**
   * Toggle the popover from open to closed or closed to open
   * @param event the event whose target element will act as
   *              the popover target. If an event is not provided,
   *              the popover will close
   */
  toggle(event?: Event): void {
    if (this.targetOverride) {
      this.target = this.targetOverride;
    } else {
      if (event) {
        this.target = event.currentTarget ?? event.target as EventTarget;
        event.stopImmediatePropagation();
      } else {
        this.target = null as any;
      }
    }

    if (!this.visible && this.target) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Handle animation start
   * @param event the AnimationEvent
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.toState === 'open') {
      this.container = event.element;
      this.addEventListeners();
      this.positionPopover();
      this.opened.emit();
    }
  }

  /**
   * Handle animation end
   * @param event the AnimationEvent
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'close') {
      this.render = false;
      this.removeEventListeners();
      this.closed.emit();
    }
  }

  /**
   * Open the popover
   * @private
   */
  private open(): void {
    this.render = true;
    this.visible = true;
  }

  /**
   * Close the popover
   */
  public close(): void {
    this.visible = false;
  }

  /**
   * Position the popover
   * @private
   */
  private positionPopover(): void {
    const {left, top, bottom, width} = (this.target as HTMLElement).getBoundingClientRect();
    const {offsetHeight, offsetWidth} = this.container;
    const popoverBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - popoverBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + this.offset;
    let transformOrigin: string = null as any;
    let positionTop: string = null as any;

    const canOpenAbove = availableTopSpace > offsetListHeight;
    const canOpenBelow = availableBottomSpace > offsetListHeight;

    if (canOpenAbove && this.openDirection === 'above') {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    }

    if (canOpenBelow && this.openDirection === 'below') {
      transformOrigin = 'top left';
      positionTop = `${popoverBottomLeftAnchor + this.offset}px`;
    }

    if (!transformOrigin) {
      if (availableTopSpace > offsetListHeight) {
        transformOrigin = 'bottom left';
        positionTop = `${top - offsetListHeight}px`;
      } else if (availableBottomSpace > offsetListHeight) {
        transformOrigin = 'top left';
        positionTop = `${popoverBottomLeftAnchor + this.offset}px`;
      } else {
        if (offsetHeight > window.innerHeight) {
          positionTop = '0px';
        } else {
          const availableSpace = window.innerHeight - offsetHeight;
          positionTop = `${String(availableSpace / 2)}px`;
        }

        transformOrigin = 'top left';
      }
    }

    let leftPosition = left;

    if (this.alignment === 'center') {
      leftPosition = (leftPosition - (offsetWidth / 2)) + (width / 2);
    }

    if ((left + offsetWidth) > window.innerWidth) {
      leftPosition = left - ((left + offsetWidth) - window.innerWidth) - 10;
    }

    if (leftPosition < 0) {
      leftPosition = 0;
    }

    this.renderer.setStyle(this.container, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.container, 'left', `${leftPosition}px`);
    this.renderer.setStyle(this.container, 'top', positionTop);
  }

  /**
   * Add escape keyup listeners to all focusable elements to close
   * the popover
   * @private
   */
  private addEventListeners(): void {
    const focusableElements = this.getFocusableElements(this.container);

    for (const element of focusableElements) {
      this.renderer.setAttribute(element, 'data-dialog-close-override', 'true');
      this.escapeKeyUpUnlisteners.push(
        this.renderer.listen(element, 'keyup', (event: KeyboardEvent) => {
          if (this.visible) {
            event.stopImmediatePropagation();

            const {key} = event;

            if (key === 'Esc' || key === 'Escape') {
              this.close();
            }
          }
        })
      );
    }
  }

  /**
   * Get all focusable child elements of the input node
   * @param node the node to query for focusable children
   * @param elements the found focusable elements
   * @private
   */
  private getFocusableElements(node: Node, elements: Array<Element> = []): Array<any> {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(child => elements.concat(this.getFocusableElements(child, elements)));

      if ('tabIndex' in node) {
        const {tabIndex} = node as unknown as HTMLOrSVGElement;

        if (tabIndex >= 0) {
          elements.push(node as any);
        }
      }

      return elements;
    } else {
      if ('tabIndex' in node) {
        const {tabIndex} = node as unknown as HTMLOrSVGElement;

        if (tabIndex >= 0) {
          elements.push(node as any);
        }
      }

      return elements;
    }
  }

  /**
   * Invoke escape keyup unlisten functions
   * @private
   */
  private removeEventListeners(): void {
    for (const unlistener of this.escapeKeyUpUnlisteners) {
      unlistener();
    }

    this.escapeKeyUpUnlisteners = [];
  }

}
