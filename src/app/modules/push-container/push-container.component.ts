import {AfterViewInit, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PushContainerState} from './push-container-state.model';
import {BehaviorSubject} from 'rxjs';

/**
 * Push Container that'll either push the content or overlay the content based on screen width.
 */
@Component({
  selector: 'particle-push-container',
  templateUrl: './push-container.component.html',
  styleUrls: ['./push-container.component.css']
})
export class PushContainerComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Width of the container in pixels.
   */
  @Input()
  width = 230;

  /**
   * Show the side panel on load?
   */
  @Input()
  showSidePanel = false;

  /**
   * Main Content ID that will be pushed by this
   */
  @Input()
  mainContentId: string = null as any;

  /**
   * Side to push from (left/right)
   */
  @Input()
  side = 'left';

  /**
   * Top offset to account for a nav bar
   */
  @Input()
  set topOffset(topOffset: string) {
    this._topOffset = topOffset;
    this.setDefaultHeight();
    this.updateContainerState();
  }

  get topOffset(): string {
    return this._topOffset;
  }

  private _topOffset = '0px';

  @Input()
  set bottomOffset(bottomOffset: string) {
    this._bottomOffset = bottomOffset;
    this.setDefaultHeight();
    this.updateContainerState();
  }

  get bottomOffset(): string {
    return this._bottomOffset;
  }

  private _bottomOffset = '0px';

  /**
   * If the screen resizes, it will either overlay or close depending on this variable
   */
  @Input()
  closeOnResize = false;

  /**
   * Background color for the container
   */
  @Input()
  backgroundColorClass = 'content_color';

  /**
   * Breakpoint that will make the container take over the screen when it's crossed.
   */
  @Input()
  breakpoint = 769;

  /**
   * Whether or not to always hide the close button, defaults to false.
   */
  @Input()
  hideCloseButton = false;

  @Input()
  showTabOnClose = false;

  @Input()
  tabColorClass = 'content_color_dark_2';

  /**
   * Event emitter for open
   */
  @Output()
  opened: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitter for close
   */
  @Output()
  closed: EventEmitter<any> = new EventEmitter();

  /**
   * Visibility variable for accessibility
   */
  visibility = false;

  private unclickable: boolean = false;

  /**
   * Private variable to detect if the breakpoint is exceeded
   */
  breakpointExceeded = false;

  containerState: BehaviorSubject<PushContainerState> = new BehaviorSubject<PushContainerState>({} as PushContainerState);

  zIndex: number = null as any;
  private _height: string = null as any;

  private _lastWidth = 0;
  private _originalTopOffset: string = null as any;
  private _originalHideCloseButton: boolean = null as any;

  /**
   * Constructor
   */
  ngOnInit(): void {
    this.visibility = this.showSidePanel;
  }

  /**
   * Show or close the push container on load depending on the state passed in.
   */
  ngAfterViewInit(): void {
    this._lastWidth = window.innerWidth;
    this._originalTopOffset = this.topOffset + '';
    this._originalHideCloseButton = Boolean(this.hideCloseButton);
    this.setDefaultHeight();

    const element = document.getElementById(this.mainContentId);

    if (element) {
      element.style.transition = 'all 0.2s ease-in-out';
    }

    if (window.innerWidth > 768 && this.showSidePanel) {
      this.setMargin(this.width + 'px');
    } else {
      setTimeout(() => {
        this.close();
      }, 100);
    }

    setTimeout(() => {
      if (this.breakpoint && (window.innerWidth <= this.breakpoint)) {
        this.breakpointExceeded = true;
      }

      this.updateContainerState();
    });
  }

  /**
   * Close the push container on destroy
   */
  ngOnDestroy(): void {
    this.showTabOnClose = false;
    this.close();
  }

  /**
   * Monitor the screen size and perform actions as specified by the input options
   *
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth <= 768 && this._lastWidth > 768 && this.showSidePanel) {
      if (this.closeOnResize) {
        this.showSidePanel = false;
        setTimeout(() => this.visibility = false, 200);
        this.closed.emit();
      }

      this.setMargin('0px');
    } else if (event.target.innerWidth > 768 && this.showSidePanel) {
      this.setMargin(this.width + 'px');
      this.topOffset = this._originalTopOffset + '';
      this.hideCloseButton = Boolean(this._originalHideCloseButton);
      this.zIndex = null as any;
      this.setDefaultHeight();
    }

    if (event.target.innerWidth > 768 && this._lastWidth <= 768 && this.closeOnResize) {
      this.showSidePanel = true;
      this.visibility = true;
      this.opened.emit();

      this.setMargin(this.width + 'px');
    }

    if (this.breakpoint) {
      this.breakpointExceeded = event.target.innerWidth < this.breakpoint;
    }

    this.updateContainerState();
    this._lastWidth = event.target.innerWidth;
  }

  /**
   * Open or close based on current state.
   */
  toggle(): void {
    if (!this.unclickable) {
      this.unclickable = true;
      setTimeout(() => this.unclickable = false, 500);

      if (this.showSidePanel) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  /**
   * Open the push container
   *
   * @param init
   */
  open(init?: boolean): void {
    if (init && window.innerWidth <= 768) {
      return;
    }

    this.visibility = true;
    this.showSidePanel = true;
    this.opened.emit({});

    if (window.innerWidth > 768) {
      this.setMargin(this.width + 'px');
    } else {
      this.topOffset = '0';
      this.zIndex = 1000;
      this.hideCloseButton = false;
      this._height = '100%';
    }

    this.updateContainerState();
  }

  /**
   * Close the push container
   */
  close(): void {
    this.showSidePanel = false;
    this.closed.emit({});
    this.setMargin('0px');
    this.setDefaultHeight();
    this.updateContainerState();

    setTimeout(() => {
      this.visibility = false;
      this.topOffset = this._originalTopOffset + '';
      this.hideCloseButton = Boolean(this._originalHideCloseButton);
      this.zIndex = null as any;
    }, 200);
  }

  /**
   * Set the margin
   *
   * @param size
   */
  private setMargin(size: string): void {
    const element = document.getElementById(this.mainContentId);
    if (!element) {
      return;
    }

    if (this.showTabOnClose && size === '0px' && window.innerWidth > 768) {
      size = '15px';
    }

    if (this.side.toLowerCase() === 'left') {
      element.style.marginLeft = size;

      if (size === '0px') {
        element.style.removeProperty('margin-left');
      }
    } else if (this.side.toLowerCase() === 'right') {
      element.style.marginRight = size;

      if (size === '0px') {
        element.style.removeProperty('margin-right');
      }
    }
  }

  /**
   * Get the width of the container
   */
  getWidth(): string {
    if (this.breakpointExceeded && this.showSidePanel) {
      return '100%';
    } else {
      return this.width + 'px';
    }
  }

  /**
   * Get the side panel class based on the current state.
   */
  private getSidePanelClass(): string {
    if (this.showSidePanel) {
      return this.backgroundColorClass + ' layout_sidebar_active_' + this.side.toLowerCase();
    } else {
      return this.backgroundColorClass + ' layout_sidebar_inactive_' + this.side.toLowerCase();
    }
  }

  /**
   * Get the left size based on the options
   */
  private getLeftProperty(): string {
    if (this.side !== 'left') {
      return '';
    } else {
      if (this.showSidePanel) {
        return '0';
      } else {
        return '-' + this.width + 'px';
      }
    }
  }

  /**
   * Get the right size based on the options
   */
  private getRightProperty(): string {
    if (this.side !== 'right') {
      return '';
    } else {
      if (this.showSidePanel) {
        return '0';
      } else {
        return '-' + (this.width + 20) + 'px';
      }
    }
  }

  private updateContainerState(): void {
    this.containerState.next({
      right: this.getRightProperty(),
      left: this.getLeftProperty(),
      sidePanelClass: this.getSidePanelClass(),
      height: this._height,
      topOffset: this._topOffset
    } as PushContainerState);
  }

  private setDefaultHeight(): void {
    const offset: number = +this.topOffset.replace(/\D/g, "") +
      +this.bottomOffset.replace(/\D/g, "");

    this._height = `calc(100% - ${offset}px)`;
  }

}
