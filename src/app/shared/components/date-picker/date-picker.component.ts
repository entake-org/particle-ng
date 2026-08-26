import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  input,
  output,
  ViewChild,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { format, isEqual, isValid, isWithinInterval, parse } from 'date-fns';
import { DatePickerText } from '../../models/particle-component-text.model';
import { PopoverComponent } from '../popover/popover.component';
import { CalendarComponent } from '../calendar/calendar.component';

/**
 * Component to allow a user to input/select a date
 */
@Component({
  selector: 'particle-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  imports: [NgClass, FormsModule, PopoverComponent, CalendarComponent]
})
export class DatePickerComponent implements ControlValueAccessor, Validator {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  private static readonly ALLOWED_KEYS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'Tab', 'Enter', '/', 'ArrowLeft',
    'ArrowUp', 'ArrowRight', 'ArrowDown',
    'ShiftLeft', 'ShiftRight', 'Backspace',
    'Delete'
  ];

  private static readonly BROWSER_DATE_PICKER_FORMAT = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d$');
  private static readonly FULL_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d$');
  private static readonly SHORT_DATE_FORMAT = new RegExp('^\\d\\/\\d\\/\\d\\d\\d\\d$');
  private static readonly SHORT_MONTH_DATE_FORMAT = new RegExp('^\\d\\/\\d\\d\\/\\d\\d\\d\\d$');
  private static readonly SHORT_DAY_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\/\\d\\d\\d\\d$');
  private static readonly referenceDate = new Date(0, 0, 0, 0, 0, 0, 0);

  @Input()
  set value(value: Date) {
    if (!value) {
      this._value = null as any;
      this.dateString = null as any;
      this.mobileDateString = null as any;
    } else if (!isEqual(value, this._value)) {
      this._value = value;
      this.dateString = DatePickerComponent.parseDate(value);
      this.mobileDateString = format(this._value, 'yyyy-MM-dd');
    }
  }

  get value(): Date {
    return this._value;
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  set dateRange(dateRange: { minDate: Date, maxDate: Date }) {
    if (dateRange?.minDate > dateRange?.maxDate) {
      throw new Error('Min date must be less than max date');
    }

    const year = this.currentDate.getFullYear();
    this.validSelectionInterval = {
      start: dateRange?.minDate ?? new Date(year - 100, 0, 1),
      end: dateRange?.maxDate ?? new Date(year + 50, 11, 31)
    };
  }

  readonly inputId = input<string>(null as any);
  readonly ariaLabel = input('Date');
  readonly inputClassList = input(null as any);
  readonly calendarButtonClassList = input('');
  readonly closeOnSelect = input<boolean>(true);
  readonly placeholder = input('mm/dd/yyyy');
  readonly inputOnly = input(false);
  readonly htmlDate = input(false);

  private _text = {
    enterInFormat: 'enter in format',
    openCalendar: 'Open the calendar'
  } as DatePickerText;

  @Input()
  set text(text: DatePickerText) {
    if (text) {
      this._text = text;
    }
  }

  get text(): DatePickerText {
    return this._text;
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly input = output<void>();
  readonly dateSelected = output<Date>();

  @ViewChild('datePickerDiv')
  datePickerDiv: ElementRef<HTMLDivElement> = null as any;

  @ViewChild('calendarPopover')
  calendarPopover: PopoverComponent = null as any;

  private readonly currentDate = new Date();

  dateString = '';
  mobileDateString = '';
  showCalendar: { currentValue: Date } = null as any;

  isMobile = isPlatformBrowser(this.platformId) ? window.innerWidth <= 768 : false;

  validSelectionInterval = {
    start: new Date(this.currentDate.getFullYear() - 100, 0, 1),
    end: new Date(this.currentDate.getFullYear() + 50, 0, 1)
  };

  private _value: Date = null as any;
  private _disabled = false;

  private static parseDate(value: Date): string {
    return !value ? null as any : format(value, 'MM/dd/yyyy');
  }

  private static parseDateString(dateString: string): Date {
    if (!dateString) {
      return null as any;
    }

    let parsedDate: Date;
    try {
      parsedDate = parse(dateString, DatePickerComponent.getDateFormat(dateString), this.referenceDate);
    } catch (e) {
      parsedDate = null as any;
    }

    return isValid(parsedDate) ? parsedDate : null as any;
  }

  private static getDateFormat(dateString: string): string {
    this.FULL_DATE_FORMAT.lastIndex = 0;
    this.SHORT_MONTH_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DAY_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DATE_FORMAT.lastIndex = 0;
    this.BROWSER_DATE_PICKER_FORMAT.lastIndex = 0;

    let dateFormat: string = null as any;
    if (this.FULL_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/dd/yyyy';
    } else if (this.SHORT_MONTH_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/dd/yyyy';
    } else if (this.SHORT_DAY_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/d/yyyy';
    } else if (this.SHORT_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/d/yyyy';
    } else if (this.BROWSER_DATE_PICKER_FORMAT.test(dateString)) {
      dateFormat = 'yyyy-MM-dd';
    }

    return dateFormat;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onValidatorChange: () => void = () => {};

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.isMobile = event.target.innerWidth <= 768;
  }

  writeValue(value: any): void {
    let dateValue = value;

    if (typeof value === 'string') {
      dateValue = DatePickerComponent.parseDateString(value);

      if (!dateValue && value.includes('-')) {
        const parts = value.split('-');
        if (parts.length === 3) {
          dateValue = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        }
      }
    }

    if (dateValue !== null && isValid(dateValue) && isWithinInterval(dateValue, this.validSelectionInterval)) {
      this.value = dateValue;
    } else {
      this.value = null as any;
    }

    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(): ValidationErrors | null {
    const hasValidDate = this._value && isValid(this._value) && isWithinInterval(this._value, this.validSelectionInterval);

    if (!hasValidDate) {
      return { invalid: true };
    }

    return null;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  filterInput(event: KeyboardEvent): void {
    const { key } = event;

    if (!DatePickerComponent.ALLOWED_KEYS.includes(key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }

    if (key === 'Enter') {
      setTimeout(() => this.openCalendar(), 0);
    }
  }

  handleBlur(): void {
    const parsedDate = DatePickerComponent.parseDateString(this.dateString);

    if (parsedDate !== null && isWithinInterval(parsedDate, this.validSelectionInterval)) {
      this.updateModel(parsedDate);
    } else {
      this.dateString = null as any;
      this.mobileDateString = null as any;
      this.updateModel(null as any);
    }
  }

  handleInput(): void {
    if (!this.dateString) {
      this.updateModel(null as any);
    } else {
      try {
        const parsedDate = DatePickerComponent.parseDateString(this.dateString);
        if (parsedDate !== null && isWithinInterval(parsedDate, this.validSelectionInterval)) {
          this.updateModel(parsedDate);
        } else {
          this._value = null as any;
          this.mobileDateString = null as any;
          this.onChange(this._value);
          if (this.onValidatorChange) this.onValidatorChange();
        }
      } catch (e) {}
    }

    this.input.emit();
  }

  handleMobileInput(): void {
    this.onTouched();

    if (!this.mobileDateString) {
      this.dateString = null as any;
      this.updateModel(null as any);
    } else {
      const parts = this.mobileDateString.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts.map(p => parseInt(p, 10));
        const parsedDate = new Date(year, month - 1, day);

        if (isValid(parsedDate) && isWithinInterval(parsedDate, this.validSelectionInterval)) {
          this.updateModel(parsedDate);
        } else {
          this.updateModel(null as any);
        }
      } else {
        this.updateModel(null as any);
      }
    }

    this.input.emit();
  }

  updateModel(value: any): void {
    const valueBeforeUpdate = this._value;

    if (this.disabled) {
      return;
    }

    let safeDate = value;

    if (typeof value === 'string') {
      const parts = value.split('-');
      if (parts.length === 3) {
        safeDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      } else {
        safeDate = DatePickerComponent.parseDateString(value);
      }
    }

    if (safeDate !== null && isValid(safeDate) && isWithinInterval(safeDate, this.validSelectionInterval)) {
      this._value = safeDate;
      this.dateString = DatePickerComponent.parseDate(safeDate);
      this.mobileDateString = format(this._value, 'yyyy-MM-dd');

      if (!isEqual(this._value, valueBeforeUpdate)) {
        this.dateSelected.emit(safeDate);
        if (this.closeOnSelect()) {
          setTimeout(() => this.handleCalendarClose(), 200);
        }
      }
    } else {
      this._value = null as any;
      this.dateString = null as any;
      this.mobileDateString = null as any;
    }

    this.onChange(this._value);
    this.changeDetectorRef.detectChanges();
  }

  openCalendar(event?: MouseEvent): void {
    if (!this.disabled) {
      if (event) {
        event.stopImmediatePropagation();
      }

      this.showCalendar = {currentValue: this.value};
      this.calendarPopover.toggle(event);
    }
  }

  handleCalendarClose(): void {
    this.showCalendar = null as any;
    if (this.calendarPopover) {
      this.calendarPopover.close();
    }
  }
}
