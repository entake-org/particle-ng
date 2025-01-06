import {ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ToggleOptions} from '../../models/toggle-options.model';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe, NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
    selector: 'particle-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.css'],
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleSwitchComponent),
            multi: true
        }],
    imports: [NgClass, NgTemplateOutlet, AsyncPipe]
})
export class ToggleSwitchComponent implements ControlValueAccessor {

  private _options$ = new BehaviorSubject<ToggleOptions>({
    affirmativeColorClass: 'ok_button_color',
    affirmativeLabel: 'On',
    affirmativeIcon: 'fas fa-check',
    negativeColorClass: 'cancel_button_color',
    negativeLabel: 'Off',
    negativeIcon: 'fas fa-times',
    accessibilityLabel: 'Toggle Switch',
  } as ToggleOptions);

  options$ = this._options$.asObservable();

  @Input()
  set options(options: ToggleOptions) {
    if (!options.negativeIcon) {
      options.negativeIcon = 'mar_right5';
    }

    if (!options.affirmativeIcon) {
      options.affirmativeIcon = 'mar_right5';
    }

    this._options$.next(options);
  }

  @Input()
  disabled: boolean = false;

  @Output()
  changed = new EventEmitter<boolean>();

  private _value: boolean = null as any;

  get value(): boolean {
    return this._value;
  }

  set value(value: boolean) {
    if (value !== this._value) {
      this._value = value;
      if (this.onChange) {
        this.onChange(value);
      }
    }
  }

  /**
   * Function called on change
   */
  onChange: ((value: boolean) => void) | undefined;

  /**
   * Function called on touch
   */
  onTouched: (() => void) | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  handleClick(): void {
    this.value = !this._value;
    this.changed.emit(this._value);
  }

  /**
   * Register function on change
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register function on touch
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set the disabled state
   * @param isDisabled disabled or not
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  writeValue(value: boolean): void {
    if (value !== this._value) {
      this.value = value;
    }
  }

}
