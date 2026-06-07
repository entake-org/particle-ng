import { ChangeDetectorRef, Component, forwardRef, Input, ViewChild, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { PopoverComponent } from '../popover/popover.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { DateRangePickerText } from '../../models/particle-component-text.model';

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
    ],
    imports: [NgClass, PopoverComponent, DatePickerComponent, FormsModule, CalendarComponent, AsyncPipe, DatePipe]
})
export class DateRangePickerComponent implements ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);

  currentYear = new Date().getFullYear();
  _disabled = false;

  private _value$ = new BehaviorSubject<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  valueObs$ = this._value$.asObservable();

  readonly inputId = input<string>(null as any);
  readonly inputClassList = input('');
  readonly calendarButtonClassList = input('');

  readonly text = input({
    begin: 'Begin',
    end: 'End',
    done: 'Done',
    clear: 'Clear',
    openCalendar: 'Open Calendar',
    selectRange: 'Choose a Range'
  } as DateRangePickerText);

  private _dateRange = {
    minDate: new Date(this.currentYear - 100, 0, 1),
    maxDate: new Date(this.currentYear + 100, 11, 31)
  };

  private _endDateRange = { ...this._dateRange };

  @Input()
  set dateRange(value: { minDate: Date, maxDate: Date }) {
    this._dateRange = value;
    const currentStart = this._value$.value.start;
    this._endDateRange = {
      minDate: currentStart ? currentStart : value.minDate,
      maxDate: value.maxDate
    };
  }

  get dateRange(): { minDate: Date, maxDate: Date } {
    return this._dateRange;
  }

  get endDateRange(): { minDate: Date, maxDate: Date } {
    return this._endDateRange;
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  readonly ariaLabel = input<string>(null as any);
  readonly dateFormat = input('MM/dd/y');

  @ViewChild('calendarPopover')
  calendarPopover: PopoverComponent = null as any;

  @ViewChild('beginCalendar')
  beginCalendar: CalendarComponent = null as any;

  @ViewChild('endCalendar')
  endCalendar: CalendarComponent = null as any;

  get beginDate(): Date {
    return this._value$.value.start as Date;
  }

  set beginDate(beginDate: Date) {
    const currentState = this._value$.value;

    if (!beginDate && this.beginCalendar) {
      this.beginCalendar.clear();
    }

    let newEnd = currentState.end;
    if (!beginDate || (newEnd && beginDate > newEnd)) {
      newEnd = null;
    }

    this._endDateRange = {
      minDate: beginDate || this.dateRange.minDate,
      maxDate: this.dateRange.maxDate
    };

    this.updateAndEmit({ start: beginDate, end: newEnd });
  }

  get endDate(): Date {
    return this._value$.value.end as Date;
  }

  set endDate(endDate: Date) {
    const currentState = this._value$.value;

    if (endDate && currentState.start && endDate < currentState.start) {
      endDate = null as any;
      if (this.endCalendar) {
        this.endCalendar.clear();
      }
    }

    if (!endDate && this.endCalendar) {
      this.endCalendar.clear();
    }

    this.updateAndEmit({ start: currentState.start, end: endDate });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {};

  writeValue(value: { start: Date | null, end: Date | null } | null): void {
    const normalizedValue = value || { start: null, end: null };
    this._value$.next(normalizedValue);

    if (normalizedValue.start) {
      this._endDateRange = { minDate: normalizedValue.start, maxDate: this.dateRange.maxDate };
    }

    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  private updateAndEmit(newValue: { start: Date | null, end: Date | null }): void {
    this._value$.next(newValue);
    this.onChange(newValue);
  }

  openCalendar(event: Event): void {
    if (!this.disabled) {
      this.calendarPopover.toggle(event);
    }
  }

  updateModel(isBegin: boolean, date: Date): void {
    if (isBegin) {
      this.beginDate = date;
    } else {
      this.endDate = date;
    }
  }

  checkState(): void {
    const val = this._value$.value;
    if (val && val.start && val.end && val.start > val.end) {
      this.clear();
    }
    this.onTouched();
  }

  clear(): void {
    this.updateAndEmit({ start: null, end: null });
  }
}
