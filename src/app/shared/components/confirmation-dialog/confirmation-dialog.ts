import {Component, input, output} from '@angular/core';
import {DialogComponent} from "../dialog/dialog.component";
import {ConfirmationDialogText, TemplatedDialogText} from "../../models/particle-component-text.model";

@Component({
  selector: 'particle-confirmation-dialog',
  imports: [
    DialogComponent,
  ],
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  private _item: any;

  message: string = '';

  isOpen: any;

  title: string = null as any;

  readonly iconClass = input('fas fa-circle-question');

  readonly width = input<string>('400px');

  readonly height = input<string>('180px');

  readonly text = input<ConfirmationDialogText>({
    defaultTitle: 'Please Confirm',
    yes: 'Yes',
    no: 'No',
    close: 'Close'
  } as ConfirmationDialogText);

  readonly confirmed = output<any>();

  readonly closed = output<boolean>();

  open(item: any, message: string, title?: string): void {
    this._item = item;
    this.message = message;
    this.title = title ?? this.text().defaultTitle;

    this.isOpen = {};
  }

  close(): void {
    this.message = '';
    this.title = this.text().defaultTitle;
    this.isOpen = null;
    this.closed.emit(false);
  }

  handleOk(): void {
    this.closed.emit(true);
    this.confirmed.emit(this._item);
    this.close();
  }
}
