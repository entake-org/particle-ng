import { ChangeDetectorRef, Component, forwardRef, Input, inject, input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {CheckboxText} from '../../models/particle-component-text.model';

@Component({
    selector: 'particle-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ],
    imports: []
})
export class CheckboxComponent implements ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);


  _value: boolean = false;
  private _disabled = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {};

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set value(value: string | boolean) {
    if (typeof value === 'string') {
      this._value = value.toUpperCase() === 'Y';
      this.type = 'string';
    } else {
      this._value = value;
      this.type = 'boolean';
    }
  }

  get value(): string | boolean {
    if (this.type === 'boolean') {
      return this._value;
    }

    return this._value ? 'Y' : 'N';
  }

  readonly size = input<number>(30);

  readonly inputId = input<string>(null as any);

  readonly text = input({
    check: 'Check the Box',
    uncheck: 'Uncheck the Box'
} as CheckboxText);

  type: string = 'boolean';

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: string): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register control value accessor change function
   * @param fn the function to register
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Register touch handler
   * @param fn the touch handler to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set the disabled state
   * @param isDisabled whether or not the component should be disabled
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  click(): void {
    this._value = !this._value;
    this.onChange(this.value);
    this.changeDetectorRef.detectChanges();
  }

}
