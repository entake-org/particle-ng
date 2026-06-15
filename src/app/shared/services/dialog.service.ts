import {Injectable} from '@angular/core';
import {DialogComponent} from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: DialogComponent[] = [];

  private focusTriggers = new Map<DialogComponent, HTMLElement | null>();

  private escapeListener = (event: KeyboardEvent): void => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      if (this.dialogs.length > 0) {
        const topDialog = this.dialogs[this.dialogs.length - 1];

        if (topDialog.allowClose()) {
          topDialog.close();
          event.stopPropagation();
          event.preventDefault();
        } else {
          topDialog.closeAttempt.emit();
        }
      }
    }
  }

  registerDialog(dialog: DialogComponent): void {
    if (!dialog || this.dialogs.includes(dialog)) return;

    this.focusTriggers.set(dialog, document.activeElement as HTMLElement);

    if (this.dialogs.length === 0) {
      window.addEventListener('keydown', this.escapeListener);
      document.body.classList.add('scroll_none');
    }

    this.dialogs.push(dialog);
  }

  unregisterDialog(dialog: DialogComponent): void {
    const index = this.dialogs.indexOf(dialog);
    if (index > -1) {
      this.dialogs.splice(index, 1);
    }

    const triggerElement = this.focusTriggers.get(dialog);
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }

    this.focusTriggers.delete(dialog);

    if (this.dialogs.length === 0) {
      window.removeEventListener('keydown', this.escapeListener);
      document.body.classList.remove('scroll_none');
    }
  }

}
