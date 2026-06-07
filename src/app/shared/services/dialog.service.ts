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
        // Only target the top-most dialog in the stack
        const topDialog = this.dialogs[this.dialogs.length - 1];

        if (topDialog.allowClose()) {
          // Calling close() triggers the component's object setter,
          // which naturally calls unregisterDialog() and cleans up the array.
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

    // Snapshot the currently focused element (e.g., the button clicked to open the dialog)
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

    // Restore focus back to the originating element
    const triggerElement = this.focusTriggers.get(dialog);
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }

    // Clean up memory
    this.focusTriggers.delete(dialog);

    if (this.dialogs.length === 0) {
      window.removeEventListener('keydown', this.escapeListener);
      document.body.classList.remove('scroll_none');
    }
  }

}
