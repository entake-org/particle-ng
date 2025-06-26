import {ChangeDetectorRef, Component, forwardRef, inject, input, signal} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DropdownOption} from '../../models/dropdown-option.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'particle-radio-buttons',
  imports: [
    NgClass
  ],
  templateUrl: './radio-buttons.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonsComponent),
      multi: true
    }
  ],
})
export class RadioButtonsComponent implements ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly disabled = signal<boolean>(false);
  readonly value = signal<string>(null as any);
  readonly options = input<Array<DropdownOption>>([]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {
  };


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {
  };

  /**
   * Set internal value when external value changes
   * @param value the external value
   */
  writeValue(value: string): void {
    this.value.set(value);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register onChange function
   * @param fn the function to register
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register onTouched function
   * @param fn the function to register
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set the disabled state of the component
   * @param isDisabled disabled or not
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }

  handleInput(value: string | number): void {
    this.value.set(value as string);
    this.onChange(value);
  }
}
