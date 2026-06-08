import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  input,
  output
} from '@angular/core';
import {addDays, endOfMonth, isWithinInterval, subDays} from 'date-fns';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import { AsyncPipe, NgClass } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CdkTrapFocus} from '@angular/cdk/a11y';
import {CalendarText} from '../../models/particle-component-text.model';
import {OrdinalNumberPipe} from '../../pipes/ordinal-number.pipe';

/**
 * Interface representing a date interval
 */
export declare interface Interval {
  start: Date | number;
  end: Date | number;
}

/**
 * Interface representing a Date broken down by date/month/year
 * with extended metadata
 */
declare interface MetaDate {

  /**
   * The day of the week (starting at 0)
   */
  day: number;

  /**
   * The day of the month (starting at 1)
   */
  date: number;

  /**
   * The month (starting at 0)
   */
  month: number;

  /**
   * The full year
   */
  year: number;

  /**
   * Whether the day is selectable
   */
  selectable: boolean;
}

/**
 * Component that allows a user to select a date from a calendar
 */
@Component({
    selector: 'particle-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    imports: [CdkTrapFocus, FormsModule, NgClass, AsyncPipe, OrdinalNumberPipe]
})
export class CalendarComponent implements OnDestroy, OnInit {
  private static readonly ARROW_KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

  @ViewChild('calendarWidgetDiv')
  calendarWidgetDiv: ElementRef<HTMLDivElement> = null as any;

  @ViewChild('yearSelect')
  yearSelect: ElementRef<HTMLSelectElement> = null as any;

  @ViewChild('doneButton')
  doneButton: ElementRef<HTMLButtonElement> = null as any;

  @ViewChildren('calendarDate')
  calendarDates: QueryList<ElementRef<HTMLButtonElement>> = null as any;

  @Input()
  set value(value: Date) {
    let metaDateValue: MetaDate = null as any;

    if (value) {
      metaDateValue = {
        day: value.getDay(),
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear(),
        selectable: true
      };
    }

    this._value.next(metaDateValue);
  }

  @Input()
  set dateRange(dateRange: { minDate: Date, maxDate: Date }) {
    if (dateRange?.minDate > dateRange?.maxDate) {
      throw new Error(this.text.minGreaterThenMax);
    }

    const {year} = this.currentDate;
    this._validSelectionInterval.next({
      start: dateRange?.minDate ?? new Date(year - 100, 0, 1),
      end: dateRange?.maxDate ?? new Date(year + 50, 11, 31)
    });
  }

  @Input()
  set text(text: CalendarText) {
    if (text) {
      this._text = text;
      this.weekDays = [
        text.sunday, text.monday, text.tuesday, text.wednesday,
        text.thursday, text.friday, text.saturday
      ];
    }
  }

  get text(): CalendarText {
    return this._text;
  }

  readonly showControls = input(true);

  private _text = {
    selectAYear: 'Select a Year',
    selectAMonth: 'Select a Month',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    sundayAbbr: 'Su',
    mondayAbbr: 'Mo',
    tuesdayAbbr: 'Tu',
    wednesdayAbbr: 'We',
    thursdayAbbr: 'Th',
    fridayAbbr: 'Fr',
    saturdayAbbr: 'Sa',
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    select: 'Select',
    the: 'the',
    resetDateToToday: 'Reset date selection to today\'s date',
    selectToday: 'Select Today',
    saveDate: 'Save date selection',
    done: 'Done',
    minGreaterThenMax: 'Min date must be less than max date'
  } as CalendarText;

  readonly selected = output<Date>();
  readonly closed = output<void>();

  readonly currentDate: MetaDate;

  weekDays = [
    this.text.sunday, this.text.monday, this.text.tuesday,
    this.text.wednesday, this.text.thursday, this.text.friday,
    this.text.saturday
  ];

  readonly _value = new BehaviorSubject<MetaDate>(null as any);
  readonly _validSelectionInterval = new BehaviorSubject<Interval>(null as any);
  readonly _selectedMonth = new BehaviorSubject(0);
  readonly _selectedYear = new BehaviorSubject(1970);

  readonly fullMonth$: Observable<Array<MetaDate>> = combineLatest([
    this._selectedMonth,
    this._selectedYear,
    this._validSelectionInterval
  ]).pipe(
    map(([selectedMonth, selectedYear, validSelectionInterval]) => {
      return CalendarComponent.generateMonth(selectedMonth, selectedYear, validSelectionInterval);
    })
  );

  readonly validYearRange$: Observable<Array<number>> = this._validSelectionInterval.pipe(
    map(selectionInterval => {
      if (this._selectedYear.getValue() < (selectionInterval?.start as Date)?.getFullYear()) {
        this._selectedYear.next((selectionInterval?.start as Date)?.getFullYear());
      }
      return CalendarComponent.generateYearRange(
        (selectionInterval?.start as Date)?.getFullYear() ?? null as any,
        (selectionInterval?.end as Date)?.getFullYear() ?? null as any,
        this.currentDate.year
      );
    })
  );

  private readonly subscription = new Subscription();
  selectedDate: MetaDate | null = null;

  private static generateMonth(
    month: number,
    year: number,
    selectionInterval: Interval
  ): Array<MetaDate> {
    if (selectionInterval) {
      const beginningOfMonthDate = new Date(year, month, 1);
      const endOfMonthDate = endOfMonth(beginningOfMonthDate);

      const fullMonth: Array<MetaDate> = [];
      let dayOfMonth = beginningOfMonthDate.getDay();
      for (let i = 1; i <= endOfMonthDate.getDate(); i++) {
        const dateOfMonth = new Date(year, month, i);
        fullMonth.push({
          day: dayOfMonth,
          date: i,
          month,
          year,
          selectable: isWithinInterval(dateOfMonth, selectionInterval)
        });

        dayOfMonth = dayOfMonth === 6 ? 0 : dayOfMonth + 1;
      }

      if (beginningOfMonthDate.getDay() > 0) {
        const lastMonthDates: Array<MetaDate> = [];
        for (let i = beginningOfMonthDate.getDay(); i > 0; i--) {
          const subtractedDate = subDays(beginningOfMonthDate, i);
          lastMonthDates.push({
            day: subtractedDate.getDay(),
            date: subtractedDate.getDate(),
            month: subtractedDate.getMonth(),
            year: subtractedDate.getFullYear(),
            selectable: false
          });
        }

        fullMonth.unshift(...lastMonthDates);
      }

      let daysToAdd = 1;
      while (fullMonth.length < 42) {
        const addedDate = addDays(endOfMonthDate, daysToAdd++);
        fullMonth.push({
          day: addedDate.getDay(),
          date: addedDate.getDate(),
          month: addedDate.getMonth(),
          year: addedDate.getFullYear(),
          selectable: false
        });
      }

      return fullMonth;
    }

    return null as any;
  }

  private static generateYearRange(minYear: number, maxYear: number, currentYear: number): Array<number> {
    let start: number, end: number;

    if (!minYear && !!maxYear) {
      start = maxYear - 50;
      end = maxYear;
    } else if (!!minYear && !maxYear) {
      start = minYear;
      end = minYear + 50;
    } else if (!!minYear && !!maxYear) {
      start = minYear;
      end = maxYear;
    } else {
      start = currentYear - 100;
      end = currentYear + 50;
    }

    const range: Array<number> = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  constructor() {
    const currentDate = new Date();
    this.currentDate = {
      day: currentDate.getDay(),
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      selectable: true
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      combineLatest([this._value, this._validSelectionInterval]).subscribe(
        ([value, validSelectionInterval]) => {
          let selectionInterval = validSelectionInterval;

          if (!selectionInterval) {
            const {year} = this.currentDate;
            selectionInterval = {
              start: new Date(year - 100, 0, 1),
              end: new Date(year + 50, 11, 31)
            };

            this.currentDate.selectable = isWithinInterval(
              new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date),
              selectionInterval
            );
          }

          if (value) {
            const valueDate = new Date(value.year, value.month, value.date);
            if (isWithinInterval(valueDate, selectionInterval)) {
              this.selectedDate = value;
              this._selectedMonth.next(value.month);
              this._selectedYear.next(value.year);
            } else {
              this._value.next(null as any);
              this.selectedDate = null as any;
            }
          } else {
            this._selectedMonth.next(this.currentDate.month);
            this._selectedYear.next(this.currentDate.year);
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // FIX 5: Bind natively to the calendar element, capture keydown (not keyup) to prevent screen scroll
  onKeyDown(event: KeyboardEvent): void {
    const {key} = event;

    if (CalendarComponent.ARROW_KEYS.includes(key)) {
      event.preventDefault(); // Stop window from scrolling
      this.onArrowKeyUp(key);
    }
  }

  handleDateSelection(selectedDate: MetaDate): void {
    this.selectedDate = selectedDate;
    this.selected.emit(new Date(selectedDate.year, selectedDate.month, selectedDate.date));
  }

  selectToday(): void {
    this.handleDateSelection(this.currentDate);
    this._selectedMonth.next(this.currentDate.month);
    this._selectedYear.next(this.currentDate.year);
    this.doneButton.nativeElement.focus();
  }

  private onArrowKeyUp(key: string): void {
    const { activeElement } = document;

    if (activeElement) {
      const activeDate = activeElement.getAttribute('data-date');

      if (activeDate !== null && activeDate !== '') {
        if (key === 'ArrowLeft') {
          this.navigateLeft(Number.parseInt(activeDate, 10));
        } else if (key === 'ArrowRight') {
          this.navigateRight(Number.parseInt(activeDate, 10));
        } else if (key === 'ArrowUp') {
          this.navigateUp(Number.parseInt(activeDate, 10));
        } else if (key === 'ArrowDown') {
          this.navigateDown(Number.parseInt(activeDate, 10));
        }
      }
    }
  }

  private navigateLeft(date: number): void {
    if (date > 1) {
      const calendarDates = this.calendarDates.toArray();
      const foundIndex = calendarDates.findIndex(calendarDate => {
        return date === Number.parseInt(
          calendarDate.nativeElement.getAttribute('data-date') as string,
          10
        );
      });

      if (foundIndex > 0) {
        calendarDates[foundIndex - 1].nativeElement.focus();
      }
    }
  }

  private navigateRight(date: number): void {
    const calendarDates = this.calendarDates.toArray();
    const foundIndex = calendarDates.findIndex(calendarDate => {
      return date === Number.parseInt(
        calendarDate.nativeElement.getAttribute('data-date') as string,
        10
      );
    });

    if ((foundIndex > -1) && (foundIndex < (calendarDates.length - 1))) {
      calendarDates[foundIndex + 1].nativeElement.focus();
    }
  }

  private navigateUp(date: number): void {
    const calendarDates = this.calendarDates.toArray();
    const foundIndex = calendarDates.findIndex(calendarDate => {
      return date === Number.parseInt(
        calendarDate.nativeElement.getAttribute('data-date') as string,
        10
      );
    });

    if ((foundIndex > -1) && (foundIndex - 7 >= 0)) {
      calendarDates[foundIndex - 7].nativeElement.focus();
    }
  }

  private navigateDown(date: number): void {
    const calendarDates = this.calendarDates.toArray();
    const foundIndex = calendarDates.findIndex(calendarDate => {
      return date === Number.parseInt(
        calendarDate.nativeElement.getAttribute('data-date') as string,
        10
      );
    });

    if ((foundIndex > -1) && ((foundIndex + 7) < (calendarDates.length))) {
      calendarDates[foundIndex + 7].nativeElement.focus();
    }
  }

  clear(): void {
    this.selectedDate = null;
  }

}
