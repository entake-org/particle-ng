import {Component, ElementRef, inject, Input, input, output, ViewChild} from '@angular/core';
import {DialogService} from '../../services/dialog.service';
import {fromEvent, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';
import {DialogText} from '../../models/particle-component-text.model';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';

/**
 * Component to display a dialog with dynamic content
 */
@Component({
    selector: 'particle-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
    animations: [
        trigger('dialog', [
            state('void', style({ transform: 'scale(0.5)', opacity: '0' })),
            transition('void => *', [
                style({ height: '*', width: '*' }),
                animate('.15s 0ms ease-in-out', style({ transform: 'scale(1)', opacity: '1' }))
            ]),
            transition(':leave', [
                animate('.15s 0ms ease-in-out', style({ transform: 'scale(0.5)', opacity: '0' }))
            ]),
        ])
    ],
    imports: [NgClass, CdkTrapFocus, NgStyle, AsyncPipe]
})
export class DialogComponent {
  private dialogService = inject(DialogService);

  /**
   * Element reference to the dialog close button
   */
  @ViewChild('closeButton')
  closeButton: ElementRef<HTMLButtonElement> = null as any;

  protected isMaximized = false;

  /**
   * Observable to update the effective width of the dialog on screen resize
   */
  effectiveWidth$: Observable<string> = fromEvent(window, 'resize').pipe(
    startWith(window.innerWidth),
    map(() => window.innerWidth),
    map(windowWidth => {
      let width: number;
      const widthValue = this.width();
      if (widthValue.includes('px')) {
        width = parseInt(widthValue.substring(0, widthValue.length - 2), 10);
        if (width > windowWidth) {
          width = windowWidth;
        }
        return width + 'px';
      }
      return widthValue;
    })
  );

  /**
   * Object to operate whether the dialog is open/closed
   */
  private _object: any;

  /**
   * Object to operate whether the dialog is open/closed
   */
  @Input()
  set object(value: any) {
    if (this._object && !value) {
      this.dialogService.unregisterDialog(this);
    }
    if (!this._object && value) {
      this.dialogService.registerDialog(this);
    }
    this._object = value;
  }

  get object(): any {
    return this._object;
  }

  /**
   * Title to show at the top of the dialog
   */
  readonly title = input<string>(null as any);

  /**
   * Class to apply to the title of the dialog
   */
  readonly titleClass = input('header_color');

  /**
   * Show or hide the title bar
   */
  readonly showTitle = input(true);

  /**
   * Whether to show close button and allow escape to close
   */
  readonly allowClose = input(true);

  /**
   * Class to apply to the body of the dialog
   */
  readonly bodyClass = input('content_color');

  /**
   * Height of the dialog (can use any height measurement)
   */
  readonly height = input('500px');

  /**
   * Width of the dialog (can use any width measurement)
   */
  readonly width = input('900px');

  readonly borderRadius = input('0px');

  readonly text = input<DialogText>({
    close: 'Close Dialog',
    maximize: 'Maximize',
    minimize: 'Minimize'
} as DialogText);

  /**
   * Event Emitter for when the dialog is closed
   */
  readonly closed = output();

  /**
   * Event emitted when dialog has finished opening
   */
  readonly opened = output<void>();

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

  /**
   * Null the object to close the dialog, emit the close event.
   */
  close(): void {
    this._object = null;
    this.isMaximized = false;
    this.dialogService.unregisterDialog(this);
  }

  /**
   * Emit closed/opened events based on state when dialog animation ends
   * @param event
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.fromState === 'void') {
      this.opened.emit();
    } else if (event.toState === 'void') {
      this.closed.emit();
    }
  }
}
