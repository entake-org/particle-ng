import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {format, isEqual, isValid, isWithinInterval, parse} from 'date-fns';
import {DatePickerText} from '../../models/particle-component-text.model';
import {PopoverComponent} from '../popover/popover.component';
import {NgClass} from '@angular/common';
import {CalendarComponent} from '../calendar/calendar.component';

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
    }
  ],
  imports: [NgClass, FormsModule, PopoverComponent, CalendarComponent]
})
export class DatePickerComponent implements ControlValueAccessor {
  private changeDetectorRef = inject(ChangeDetectorRef);

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
      // FIX 4: Removed double assignment
      this.dateString = DatePickerComponent.parseDate(value);
      this.setMobileValue();
    }
  }

  get value(): Date {
    return DatePickerComponent.parseDateString(this.dateString);
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
  isMobile = window.innerWidth <= 768;

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

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.isMobile = event.target.innerWidth <= 768;
  }

  writeValue(value: Date): void {
    if (value !== null && isWithinInterval(value, this.validSelectionInterval)) {
      this.value = value;
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

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  filterInput(event: KeyboardEvent): void {
    const {key} = event;

    if (!DatePickerComponent.ALLOWED_KEYS.includes(key) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }

    if (key === 'Enter') {
      setTimeout(() => this.openCalendar(), 0);
    }
  }

  handleBlur(): void {
    try {
      this.updateModel(DatePickerComponent.parseDateString(this.dateString));
    } catch (e) {
      this.updateModel(null as any);
    }
  }

  handleInput(): void {
    try {
      const parsedDate = DatePickerComponent.parseDateString(this.dateString);
      if (parsedDate !== null && isWithinInterval(parsedDate, this.validSelectionInterval)) {
        this.updateModel(parsedDate);
      }
    } catch (e) {
      // console.log(e);
    }

    this.input.emit();
  }

  handleMobileInput(): void {
    this.dateString = this.mobileDateString;
    this.handleInput();
  }

  setMobileValue(): void {
    if (this.value) {
      this.mobileDateString = format(this.value, 'yyyy-MM-dd');
    }
  }

  updateModel(value: Date): void {
    const valueBeforeUpdate = this._value;

    if (!this.disabled) {
      if (value !== null && isWithinInterval(value, this.validSelectionInterval)) {
        this.value = value;

        if (!isEqual(this.value, valueBeforeUpdate)) {
          this.dateSelected.emit(value);

          if (this.closeOnSelect()) {
            setTimeout(() => this.handleCalendarClose(), 200);
          }
        }
      } else {
        this.value = null as any;
      }

      if (!isEqual(this.value, valueBeforeUpdate)) {
        this.onChange(this.value);
        this.setMobileValue();
      }
    }
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
