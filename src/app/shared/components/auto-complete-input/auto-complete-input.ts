import {Component, ElementRef, input, output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgClass} from '@angular/common';
import {BehaviorSubject, debounceTime, tap} from 'rxjs';
import {PopoverComponent} from "../popover/popover.component";

@Component({
  selector: 'particle-auto-complete-input',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    PopoverComponent,
    AsyncPipe
  ],
  templateUrl: './auto-complete-input.html',
})
export class AutoCompleteInput {
  readonly placeholder = input<string>('Begin typing to find...')
  readonly classList = input<string>('access ptl_input_height ptl_input ptl_input_bg_color ptl_brdr_color ptl_brdr_size ptl_brdr_radius ptl_input_text_size ptl_input_padding');

  readonly searchString = output<string>();

  @ViewChild('popover')
  popover: PopoverComponent = null as any;

  @ViewChild('input')
  inputField: ElementRef<HTMLInputElement> = null as any;

  private _search$ = new BehaviorSubject<string>(null as any);

  search$ = this._search$.asObservable().pipe(
    debounceTime(350),
    tap(val => this.searchString.emit(val))
  );

  protected searchText = '';
  private preventFocus = true;

  doSearch(): void {
    this._search$.next(this.searchText);
  }

  openPopover(): void {
    if (!this.popover.isOpen()) {
      this.popover.toggle();
    }
  }

  closePopover(preventFocus?: boolean): void {
    this.preventFocus = !!preventFocus;
    if (this.popover.isOpen()) {
      this.popover.toggle();
    }
  }

  resetSearchText(): void {
    this.searchText = '';
    this._search$.next('');
  }

  onEscapeKeyUp(event: Event): void {
    if (this.popover.isOpen()) {
      event.stopImmediatePropagation();
      this.inputField.nativeElement.focus();
      setTimeout(() => this.popover.close(), 0);
    }
  }

  handlePopoverClose(): void {
    if (!this.preventFocus) {
      this.inputField.nativeElement.focus();
    }
    this.preventFocus = false;
  }

  onArrowUpDown(): void {
    if (this.popover.isOpen()) {
      this.popover.focusOnFirstElement();
    }
  }

  tabNext(): void {
    this.popover.focusOnNextElement();
  }

  tabPrevious(): void {
    this.popover.focusOnPreviousElement();
  }

}
