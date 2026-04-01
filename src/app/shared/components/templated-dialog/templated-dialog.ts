import {Component, input, Input, output, TemplateRef, ViewChild} from '@angular/core';
import {ConfirmationDialog} from '../confirmation-dialog/confirmation-dialog';
import _ from 'lodash';
import {NgTemplateOutlet} from '@angular/common';
import {DialogComponent} from "../dialog/dialog.component";
import {TemplatedDialogText} from "../../models/particle-component-text.model";

@Component({
  selector: 'particle-templated-dialog',
  imports: [
    ConfirmationDialog,
    DialogComponent,
    NgTemplateOutlet
  ],
  templateUrl: './templated-dialog.html',
})
export class TemplatedDialog<T> {
  private _data: T = null as any;
  private _originalData: T = null as any;

  dialogOpen: any;

  @Input()
  set data(t: T) {
    this._data = t;
    this._originalData = _.cloneDeep(this._data);
  }

  get data(): T {
    return this._data;
  }

  readonly text = input<TemplatedDialogText>({
    unsavedChanges: 'You have unsaved changes, are you sure you want to continue?',
    continue: 'Continue?',
    close: 'Close',
    maximize: 'Toggle Maximize',
  } as TemplatedDialogText);

  readonly height = input<string>('480px');

  readonly width = input<string>('854px');

  readonly icon = input<string>('fas fa-cog');

  readonly title = input<string>(null as any);

  readonly description = input<string>(null as any);

  readonly checkUnsavedChanges = input<boolean>(false);

  readonly showMaximize = input<boolean>(true);

  readonly subheaderTemplate = input<TemplateRef<any>>(null as any);

  readonly contentTemplate = input<TemplateRef<any>>(null as any);

  readonly footerTemplate = input<TemplateRef<any>>(null as any);

  readonly closed = output<void>();

  @ViewChild('confirmationDialog')
  confirmationDialog: ConfirmationDialog = null as any;

  open(): void {
    this.dialogOpen = {};
  }

  close(): void {
    this.closed.emit();
    this.dialogOpen = null as any;
  }

  checkClose(): void {
    if (this.checkUnsavedChanges() && !_.isEqual(JSON.stringify(this._data), JSON.stringify(this._originalData))) {
      this.confirmationDialog.open(null, this.text().unsavedChanges);
    } else {
      this.close();
    }
  }
}
