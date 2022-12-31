import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { format, isEqual, isValid, isWithinInterval, parse } from 'date-fns';
import {DatePickerText} from '../../shared/models/particle-component-text.model';
import {PopoverComponent} from '../popover/popover.component';

/**
 * Component to allow a user to input/select a date
 */
@Component({
  selector: 'particle-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  animations: [
    trigger('openClose', [
      transition('void => open', [
        style({ transform: 'scaleY(0.5)', opacity: 0 }),
        animate('200ms ease',
          style({ transform: 'scaleY(1)', opacity: 1 }))
      ]),
      transition('open => close', [
        style({ transform: 'scaleY(1)', opacity: 1 }),
        animate('200ms ease',
          style({ transform: 'scaleY(0.5)', opacity: 0 }))
      ]),
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnDestroy, OnInit {

  /**
   * Allowed keys for date input
   */
  private static readonly ALLOWED_KEYS = [
    '0', '1', '2', '3', '4', '5', '6', '7',
    '8', '9', 'Tab', 'Enter', '/', 'ArrowLeft',
    'ArrowUp', 'ArrowRight', 'ArrowDown',
    'ShiftLeft', 'ShiftRight', 'Backspace',
    'Delete'
  ];

  /**
   * Matches MM/DD/YYYY
   * @private
   */
  private static readonly FULL_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches M/D/YYYY
   * @private
   */
  private static readonly SHORT_DATE_FORMAT = new RegExp('^\\d\\/\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches M/DD/YYYY
   * @private
   */
  private static readonly SHORT_MONTH_DATE_FORMAT = new RegExp('^\\d\\/\\d\\d\\/\\d\\d\\d\\d$');

  /**
   * Matches MM/D/YYYY
   * @private
   */
  private static readonly SHORT_DAY_DATE_FORMAT = new RegExp('^\\d\\d\\/\\d\\/\\d\\d\\d\\d$');

  /**
   * A reference date with all fields set to 0
   * @private
   */
  private static readonly referenceDate = new Date(0, 0, 0, 0, 0, 0, 0);

  /**
   * Value input setter
   */
  @Input()
  set value(value: Date) {
    if (!value) {
      this._value = null as any;
      this.dateString = null as any;
    } else if (!isEqual(value, this._value)) {
      this._value = value;
      this.dateString = this.dateString = DatePickerComponent.parseDate(value);
    }
  }

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
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

  /**
   * The ID to set on the input
   */
  @Input()
  inputId: string = null as any;

  /**
   * Value to use as the date picker input's aria label
   */
  @Input()
  ariaLabel = 'Date';

  /**
   * Optional class-list to add to the date picker input
   */
  @Input()
  inputClassList = null as any;

  /**
   * Optional class-list to add to the calendar button
   */
  @Input()
  calendarButtonClassList = '';

  /**
   * Close the picker when a selection is made
   */
  @Input()
  closeOnSelect: boolean = true;

  /**
   * Placeholder override
   */
  @Input()
  placeholder = 'mm/dd/yyyy';

  @Input()
  inputOnly = false;

  private _text: DatePickerText = {
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

  /**
   * Event emitted on date picker input
   */
  @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
  input = new EventEmitter<void>();

  /**
   * Event emitted on valid date selection/input
   */
  @Output()
  dateSelected = new EventEmitter<Date>();

  /**
   * ViewChild of the date picker div
   */
  @ViewChild('datePickerDiv')
  datePickerDiv: ElementRef<HTMLDivElement> = null as any;

  /**
   * ViewChild of the calendar div
   */
  @ViewChild('calendarDiv')
  calendarDiv: ElementRef<HTMLDivElement> = null as any;

  @ViewChild('calendarPopover')
  calendarPopover: PopoverComponent = null as any;

  /**
   * The current date
   */
  private readonly currentDate = new Date();

  /**
   * The fixed height of the calendar widget
   */
  private readonly calendarHeight = 340;

  /**
   * The fixed width of the calendar widget
   */
  private readonly calendarWidth = 300;

  /**
   * The amount of padding to apply between the date picker input and the calendar widget
   */
  private readonly calendarPadding = 0;

  /**
   * String tracking date picker input
   */
  dateString = '';

  /**
   * Whether to show the calendar
   */
  showCalendar: { currentValue: Date } = null as any;

  /**
   * The valid selection interval
   * @private
   */
  validSelectionInterval = {
    start: new Date(this.currentDate.getFullYear() - 100, 0, 1),
    end: new Date(this.currentDate.getFullYear() + 50, 0, 1)
  };

  /**
   * The internal control accessor value
   * @private
   */
  private _value: Date = null as any;

  /**
   * The internal disabled state
   * @private
   */
  private _disabled = false;

  /**
   * Window resize unlisten function
   */
  private resizeListener: (() => void) | undefined;

  /**
   * Parse the input Date value into a string
   * @param value the value to parse
   * @private
   */
  private static parseDate(value: Date): string {
    return !value ? null as any : format(value, 'MM/dd/yyyy');
  }

  /**
   * Parse the input date string into a Date
   * @param dateString the string to parse
   * @private
   */
  private static parseDateString(dateString: string): Date {
    let parsedDate: Date;
    try {
      parsedDate = parse(dateString, DatePickerComponent.getDateFormat(dateString), this.referenceDate);
    } catch (e) {
      parsedDate = null as any;
    }

    return isValid(parsedDate) ? parsedDate : null as any;
  }

  /**
   * Get the date format that matches the input date string, null if no match
   * @param dateString the string to test
   * @private
   */
  private static getDateFormat(dateString: string): string {
    this.FULL_DATE_FORMAT.lastIndex = 0;
    this.SHORT_MONTH_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DAY_DATE_FORMAT.lastIndex = 0;
    this.SHORT_DATE_FORMAT.lastIndex = 0;

    let dateFormat: string = null as any;
    if (this.FULL_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/dd/yyyy';
    } else if (this.SHORT_MONTH_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/dd/yyyy';
    } else if (this.SHORT_DAY_DATE_FORMAT.test(dateString)) {
      dateFormat = 'MM/d/yyyy';
    } else if (this.SHORT_DATE_FORMAT.test(dateString)) {
      dateFormat = 'M/d/yyyy';
    }

    return dateFormat;
  }

  /**
   * Function to call on change
   */
  onChange: (value: any) => void = () => {};

  /**
   * Function to call on touch
   */
  onTouched: () => any = () => {};

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef the Angular change detector
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Value getter
   */
  get value(): Date {
    return DatePickerComponent.parseDateString(this.dateString);
  }

  /**
   * Disabled getter
   */
  get disabled(): boolean { return this._disabled; }

  /**
   * Init component, set up window resize listener
   */
  ngOnInit(): void {
    this.resizeListener = this.renderer.listen(window, 'resize', () => {
      if (this.showCalendar) {
        this.setCalendarPosition();
      }
    });
  }

  /**
   * Destroy component, invoke window resize unlisten function
   */
  ngOnDestroy(): void {
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  /**
   * Write value
   * @param value the value to write
   */
  writeValue(value: Date): void {
    if (value !== null && isWithinInterval(value, this.validSelectionInterval)) {
      this.value = value;
    } else {
      this.value = null as any;
    }

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

  /**
   * Only allow input from digits, forward slashes, and navigation keys
   */
  filterInput(event: KeyboardEvent): void {
    const {key} = event;
    if (!DatePickerComponent.ALLOWED_KEYS.includes(key) && !event.ctrlKey) {
      event.preventDefault();
    }
  }

  /**
   * Clear value if no input, write parsed date if input requirements fulfilled
   */
  handleBlur(): void {
    try {
      this.updateModel(DatePickerComponent.parseDateString(this.dateString));
    } catch (e) {
      this.updateModel(null as any);
    }
  }

  /**
   * Write on input if valid date within interval
   */
  handleInput(): void {
    try {
      const parsedDate = DatePickerComponent.parseDateString(this.dateString);
      if (parsedDate !== null && isWithinInterval(parsedDate, this.validSelectionInterval)) {
        this.updateModel(parsedDate);
      }
    } catch (e) { }

    this.input.emit();
  }

  /**
   * Update the model value
   * @param value the value to update the model to
   */
  updateModel(value: Date): void {
    const valueBeforeUpdate = this._value;

    if (!this.disabled) {
      if (value !== null && isWithinInterval(value, this.validSelectionInterval)) {
        this.value = value;

        if (!isEqual(this.value, valueBeforeUpdate)) {
          this.dateSelected.emit(value);

          if (this.closeOnSelect) {
            setTimeout(() => this.handleCalendarClose(), 200);
          }
        }
      } else {
        this.value = null as any;
      }

      if (!isEqual(this.value, valueBeforeUpdate)) {
        this.onChange(this.value);
      }
    }
  }

  /**
   * Open the calendar widget
   * @param event the click MouseEvent
   */
  openCalendar(event: MouseEvent): void {
    event.stopImmediatePropagation();

    this.showCalendar = { currentValue: this.value };
    this.calendarPopover.toggle(event);
  }

  /**
   * Hide calendar overlay and remove calendar from the DOM
   */
  handleCalendarClose(): void {
    this.showCalendar = null as any;
    this.calendarPopover.close();
  }

  /**
   * Calculate and set the calendar's position based on the screen height.
   * Positioning prefers to open at the bottom, if not enough room on bottom,
   * positioning is attempted at the top, otherwise it attempts to vertically
   * center
   */
  private setCalendarPosition(): void {
    const {left, top, bottom} = this.datePickerDiv.nativeElement.getBoundingClientRect();
    const datePickerBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - datePickerBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetCalendarHeight = this.calendarHeight + this.calendarPadding;
    let leftPosition: number, topPosition: number, transformOrigin: string;

    if (availableBottomSpace > offsetCalendarHeight) {
      transformOrigin = 'top left';
      topPosition = datePickerBottomLeftAnchor + this.calendarPadding;
    } else if (availableTopSpace > offsetCalendarHeight) {
      transformOrigin = 'bottom left';
      topPosition = top - offsetCalendarHeight;
    } else {
      transformOrigin = 'top left';

      if (this.calendarHeight > window.innerHeight) {
        topPosition = 0;
      } else {
        const availableSpace = window.innerHeight - this.calendarHeight;
        topPosition = availableSpace / 2;
      }
    }

    leftPosition = left;
    if ((left + this.calendarWidth) > window.innerWidth) {
      leftPosition = left - ((left + this.calendarWidth) - window.innerWidth) - 10;
    }

    this.renderer.setStyle(this.calendarDiv.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.calendarDiv.nativeElement, 'left', `${leftPosition}px`);
    this.renderer.setStyle(this.calendarDiv.nativeElement, 'top', `${topPosition}px`);
  }
}
