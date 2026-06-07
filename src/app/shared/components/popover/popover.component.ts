import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Input,
  input,
  output,
  Renderer2,
  signal,
  ViewChild
} from '@angular/core';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {NgClass, NgStyle} from '@angular/common';

/**
 * Component to display a popover with custom content
 */
@Component({
  selector: 'particle-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.css'],
  imports: [CdkTrapFocus, NgStyle, NgClass]
})
export class PopoverComponent {
  private renderer = inject(Renderer2);
  private changeDetectorRef = inject(ChangeDetectorRef);

  protected readonly window = window;

  readonly offset = input(5);

  @Input()
  set width(width: string) {
    this._width = !width ? 'auto' : `${width}px`;
  }
  get width(): string { return this._width; }

  @Input()
  set height(height: string) {
    this._height = !height ? 'auto' : `${height}px`;
  }

  get height(): string {
    return this._height;
  }

  readonly classList = input('content_color particle_popover_shadow');
  readonly targetOverride = input<EventTarget>(null as any);
  readonly openDirection = input<'above' | 'below'>('above');
  readonly alignment = input<'left' | 'center'>('left');
  readonly scaleForMobile = input('1');

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly arrowDown = output<void>();
  readonly arrowUp = output<void>();

  @ViewChild('container')
  container: ElementRef<HTMLDivElement> = null as any;

  render: boolean = false;
  visible: boolean = false;

  private _width = 'auto';
  private _height = 'auto';
  private target: EventTarget = null as any;
  private _elements: Array<any> = [];

  isOpen = signal(false);
  isPositioned = signal(false);

  constructor() {
    effect(() => {
      if (this.isOpen() && this.render) {
        this.onAnimationStart();
      } else {
        setTimeout(() => {
          this.onAnimationDone();
          this.changeDetectorRef.markForCheck();
        }, 300);
      }
    });
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.visible) {
      const {pageX, pageY} = event;
      if (pageX > 0 && pageY > 0) {
        const {left, right, top, bottom} = this.container.nativeElement.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;

        if (!(xPositionValid && yPositionValid)) {
          this.close();
        }
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.visible) {
      this.positionPopover();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.visible) return;

    const { key } = event;

    if (key === 'Escape' || key === 'Esc') {
      event.stopPropagation(); // Prevent dialog beneath from closing
      this.close();
    } else if (key === 'ArrowDown') {
      this.arrowDown.emit();
    } else if (key === 'ArrowUp') {
      this.arrowUp.emit();
    }
  }

  toggle(event?: Event): void {
    const targetOverride = this.targetOverride();
    if (targetOverride) {
      this.target = targetOverride;
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

  onAnimationStart(): void {
    this._elements = this.getFocusableElements(this.container.nativeElement);
    this.opened.emit();
    setTimeout(() => this.positionPopover(), 0);
  }

  onAnimationDone(): void {
    (document.activeElement as any)?.blur();
    this.render = false;
    this.closed.emit();
  }

  private open(): void {
    this.isPositioned.set(false); // Reset position buffer
    this.render = true;
    this.visible = true;
    setTimeout(() => this.toggleOpen(), 0);
  }

  public close(): void {
    this.visible = false;
    this.isOpen.update(() => false);
    this.isPositioned.set(false); // Hide immediately to prevent visual artifacts
  }

  private positionPopover(): void {
    const {left, top, bottom, width} = (this.target as HTMLElement).getBoundingClientRect();
    const {offsetHeight, offsetWidth} = this.container.nativeElement;
    const popoverBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - popoverBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + this.offset();
    let transformOrigin: string = null as any;
    let positionTop: string = null as any;

    const canOpenAbove = availableTopSpace > offsetListHeight;
    const canOpenBelow = availableBottomSpace > offsetListHeight;

    const openDirection = this.openDirection();
    if (canOpenAbove && openDirection === 'above') {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    }

    if (canOpenBelow && openDirection === 'below') {
      transformOrigin = 'top left';
      positionTop = `${popoverBottomLeftAnchor + this.offset()}px`;
    }

    if (!transformOrigin) {
      if (availableTopSpace > offsetListHeight) {
        transformOrigin = 'bottom left';
        positionTop = `${top - offsetListHeight}px`;
      } else if (availableBottomSpace > offsetListHeight) {
        transformOrigin = 'top left';
        positionTop = `${popoverBottomLeftAnchor + this.offset()}px`;
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

    if (this.alignment() === 'center') {
      leftPosition = (leftPosition - (offsetWidth / 2)) + (width / 2);
    }

    if ((left + offsetWidth) > window.innerWidth) {
      leftPosition = left - ((left + offsetWidth) - window.innerWidth) - 10;
    }

    if (leftPosition < 0) {
      leftPosition = 0;
    }

    this.renderer.setStyle(this.container.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.container.nativeElement, 'left', `${leftPosition}px`);
    this.renderer.setStyle(this.container.nativeElement, 'top', positionTop);

    this.isPositioned.set(true);
  }

  private getFocusableElements(node: Node, elements: Array<Element> = []): Array<any> {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(child => elements.concat(this.getFocusableElements(child, elements)));
      if ('tabIndex' in node) {
        const {tabIndex} = node as unknown as HTMLOrSVGElement;
        if (tabIndex >= 0) elements.push(node as any);
      }
      return elements;
    } else {
      if ('tabIndex' in node) {
        const {tabIndex} = node as unknown as HTMLOrSVGElement;
        if (tabIndex >= 0) elements.push(node as any);
      }
      return elements;
    }
  }

  toggleOpen(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  focusOnFirstElement(): void {
    this._elements[0]?.focus();
  }

  focusOnNextElement(): void {
    let index = 0;
    for (const element of this._elements) {
      if (element === document.activeElement) break;
      index++;
    }
    index = (index + 1 > this._elements.length - 1) ? 0 : index + 1;
    this._elements[index]?.focus();
  }

  focusOnPreviousElement(): void {
    let index = 0;
    for (const element of this._elements) {
      if (element === document.activeElement) break;
      index++;
    }
    index = (index - 1 < 0) ? this._elements.length - 1 : index - 1;
    this._elements[index]?.focus();
  }

}
