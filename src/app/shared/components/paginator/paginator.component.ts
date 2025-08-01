import {AfterViewInit, Component, Input, input, OnChanges, output} from '@angular/core';
import {PaginatorText} from '../../models/particle-component-text.model';
import {PopoverComponent} from '../popover/popover.component';
import {FormsModule} from '@angular/forms';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {PaginationEvent} from '../../models/pagination-event.model';

/**
 * A Particle paginator, because we hated the other ones on the market.
 */
@Component({
    selector: 'particle-paginator',
    templateUrl: 'paginator.component.html',
    styleUrls: ['./paginator.component.css'],
    imports: [NgClass, PopoverComponent, NgTemplateOutlet, FormsModule]
})
export class PaginatorComponent implements OnChanges, AfterViewInit {

  private _pageSize: number = null as any;

  /**
   * An array of potential page sizes.
   */
  readonly pageSizeOptions = input<Array<number>>(null as any);

  /**
   * Current page size
   */
  @Input()
  set pageSize(pageSize: number) {
    this._pageSize = pageSize;
    this.resetPageStartEndValues();
  }

  get pageSize(): number {
    return this._pageSize;
  }

  /**
   * Total number of items
   */
  readonly totalLength = input<number>(null as any);

  readonly showPages = input(false);

  readonly showFirstLast = input(false);

  readonly showButtonLabels = input(true);

  readonly showResultsPanel = input(true);

  readonly startingPage = input(0 as any, {
    transform: (page: number) => {
      setTimeout(() => this.setActivePage(page, false), 0);
    }
  });

  readonly text = input<PaginatorText>({
    itemsPerPage: 'Items Per Page',
    choosePageSize: 'Choose Page Size',
    previousPage: 'Previous',
    nextPage: 'Next',
    disabled: 'Disabled',
    firstPage: 'First',
    lastPage: 'Last',
    jumpToPage: 'Jump to Page',
    page: 'Page',
    outOf: 'out of',
    of: 'of',
    results: 'Results'
} as PaginatorText);

  /**
   * Event Emitter for pagination or page size change.
   */
  readonly paginate = output<PaginationEvent>();

  /**
   * Currently active page
   */
  activePage = 0;

  /**
   * For the page jump text input
   */
  pageJumpInput = '';

  /**
   * Number of pages
   */
  numberOfPages: number = null as any;

  pageStartingValue: number = 0;
  pageEndingValue: number = 0;

  Math = Math;

  /**
   * Recalculate number of pages on input change
   */
  ngOnChanges(): void {
    this.numberOfPages = this.getNumberOfPages();
  }

  ngAfterViewInit(): void {
    this.resetPageStartEndValues();
  }

  private resetPageStartEndValues(): void {
    this.pageStartingValue = 1;
    this.pageEndingValue = this.pageSize;
    this.numberOfPages = this.getNumberOfPages();
  }

  /**
   * Goes to the first page
   */
  goToFirst(): void {
    this.goToPage(0);
  }

  /**
   * Goes to the last page
   */
  goToLast(): void {
    this.goToPage(this.getNumberOfPages() - 1);
  }

  /**
   * Calculates the number of pages
   */
  getNumberOfPages(): number {
    return Math.ceil(this.totalLength() / this.pageSize);
  }

  private _goToPage(pageNumber: number, emit: boolean, inputFocus?: boolean): void {
    this.activePage = pageNumber;
    this.pageStartingValue = this.getStartingValueForPage(this.activePage);
    this.pageEndingValue = this.getEndingValueForPage(this.activePage);

    if (inputFocus) {
      const element: HTMLElement = document.getElementById('activePage') as HTMLElement;
      if (element) {
        element.focus();
      }
    }

    if (emit) {
      this.emitEvent();
    }
  }

  /**
   * Goes to a given page and emits a pagination event
   *
   * @param pageNumber
   * @param inputFocus
   */
  goToPage(pageNumber: number, inputFocus?: boolean): void {
    this._goToPage(pageNumber, true, inputFocus);
  }

  /**
   * Goes to a given page, but does not emit a pagination event
   * @param pageNumber
   * @param inputFocus
   */
  setActivePage(pageNumber: number, inputFocus?: boolean): void {
    this._goToPage(pageNumber, false, inputFocus);
  }

  /**
   * Emits a pagination event with the current paginator data
   */
  emitEvent(): void {
    this.paginate.emit({
      activePage: this.activePage,
      pageSize: this.pageSize,
      totalLength: this.totalLength()
    } as PaginationEvent);
  }

  /**
   * Determines whether a given page exists or not.
   *
   * @param pageNumber
   */
  hasPage(pageNumber: number): boolean {
    if (pageNumber < 0) {
      return false;
    }

    return !(pageNumber >= this.getNumberOfPages());
  }

  /**
   * Gets the first value for a given page
   *
   * @param pageNumber
   */
  getStartingValueForPage(pageNumber: number): number {
    return (pageNumber * this.pageSize) + 1;
  }

  /**
   * Gets the last value for a given page
   *
   * @param pageNumber
   */
  getEndingValueForPage(pageNumber: number): number {
    // If it's the last page, return the total length
    if (pageNumber === this.getNumberOfPages() - 1) {
      return this.totalLength();
    }

    return (pageNumber + 1) * this.pageSize;
  }

  /**
   * When a page size is changed, go back to the first page and emit a pagination event
   */
  pageSizeChange(): void {
      this.goToFirst();
      this.numberOfPages = this.getNumberOfPages();
  }

  /**
   * Jump to a page based on user input
   */
  jumpPage(): void {
    let page: number =  +this.pageJumpInput;
    page--;

    if (isNaN(page)) {
      this.pageJumpInput = '';
      return;
    }

    if (this.hasPage(page)) {
      this.goToPage(page);
    }

    if (page > this.getNumberOfPages()) {
      this.goToLast();
    }

    if (page <= 0) {
      this.goToFirst();
    }

    this.pageJumpInput = '';
  }

}
