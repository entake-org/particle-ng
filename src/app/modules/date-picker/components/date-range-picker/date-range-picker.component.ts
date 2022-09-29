import {ChangeDetectorRef, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {DateRangePickerText} from '../../../../shared/models/particle-component-text.model';

@Component({
  selector: 'particle-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor {

  currentYear = new Date().getFullYear();
  _disabled = false;

  _value = new BehaviorSubject<any>(null);

  @Input()
  inputId: string = null as any;

  @Input()
  inputClassList = '';

  @Input()
  calendarButtonClassList = '';

  @Input()
  text: DateRangePickerText = {
    begin: 'Begin',
    end: 'End'
  } as DateRangePickerText;

  @Input()
  set dateRange(value: {minDate: Date,  maxDate: Date}) {
    this._dateRange = value;

    if (this.value && this.value.start) {
      this._endDateRange = {
        minDate: this.value.start,
        maxDate: value.maxDate
      };
    } else {
      this._endDateRange = value;
    }
  }

  get dateRange(): {minDate: Date,  maxDate: Date} {
    return this._dateRange;
}

  _dateRange = {
    minDate: new Date(this.currentYear - 100, 0, 1),
    maxDate: new Date(this.currentYear + 100, 11, 31)
  };

  _endDateRange = {
    minDate: new Date(this.currentYear - 100, 0, 1),
    maxDate: new Date(this.currentYear + 100, 11, 31)
  }

  @Input()
  set value(value: { start: Date, end: Date }) {
    this._value.next(value);

    if (value) {
      this.beginDate = value.start;
    }
  }

  get value(): {start: Date, end: Date} {
    return this._value.value;
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get beginDate(): Date {
    return this._value.value.start;
  }

  set beginDate(beginDate: Date) {
    let value = this._value.value;
    value.start = beginDate;

    this._value.next(value);

    if (!beginDate || beginDate > this.endDate) {
      this.endDate = null as any;
    }

    this._endDateRange = {
      minDate: beginDate,
      maxDate: this.dateRange.maxDate
    };
  }

  get endDate(): Date {
    return this._value.value.end;
  }

  set endDate(endDate: Date) {
    let value = this._value.value;
    value.end = endDate;

    this._value.next(value);
  }

  /**
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: { start: Date, end: Date }): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register function on change
   * @param fn the function to change
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
   * Set disabled state
   * @param isDisabled whether or not the control is disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

}
