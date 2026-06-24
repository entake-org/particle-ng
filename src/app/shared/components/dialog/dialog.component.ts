import {Component, inject, Input, input, output, PLATFORM_ID} from '@angular/core';
import {DialogService} from '../../services/dialog.service';
import {fromEvent, Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DialogText} from '../../models/particle-component-text.model';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {AsyncPipe, isPlatformBrowser, NgClass, NgStyle} from '@angular/common';

/**
 * Component to display a dialog with dynamic content
 */
@Component({
    selector: 'particle-dialog',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
    imports: [NgClass, CdkTrapFocus, NgStyle, AsyncPipe]
})
export class DialogComponent {
  private dialogService = inject(DialogService);
  private platformId = inject(PLATFORM_ID);

  protected isMaximized = false;

  protected readonly dialogId = Math.random().toString(36).substring(2, 9);

  readonly title = input<string>(null as any);
  readonly titleClass = input('header_color');
  readonly showTitle = input(true);
  readonly allowClose = input(true);
  readonly bodyClass = input('content_color');
  readonly height = input('500px');
  readonly width = input('900px');
  readonly borderRadius = input('0px');

  readonly text = input<DialogText>({
    close: 'Close Dialog',
    maximize: 'Maximize',
    minimize: 'Minimize'
  } as DialogText);

  readonly closed = output();
  readonly closeAttempt = output();
  readonly opened = output<void>();

  effectiveWidth$: Observable<string> = isPlatformBrowser(this.platformId)
    ? fromEvent(window, 'resize').pipe(
      startWith(window.innerWidth),
      map(() => window.innerWidth),
      map(windowWidth => this.calculateEffectiveWidth(windowWidth))
    )
    : of(this.width());

  private _object: any;

  @Input()
  set object(value: any) {
    if (this._object && !value) {
      this.dialogService.unregisterDialog(this);
    }
    if (!this._object && value) {
      this.dialogService.registerDialog(this);
      setTimeout(() => this.opened.emit(), 0);
    }
    this._object = value;
  }

  get object(): any {
    return this._object;
  }

  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

  close(): void {
    this._object = null;
    this.isMaximized = false;
    this.dialogService.unregisterDialog(this);
    this.closed.emit();
  }

  private calculateEffectiveWidth(windowWidth: number): string {
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
  }

}
