import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  input,
  OnDestroy,
  output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, combineLatest, Observable, Subject, Subscription} from 'rxjs';
import {map, tap, withLatestFrom} from 'rxjs/operators';
import {AsyncPipe, NgClass, NgStyle} from '@angular/common';
import {TooltipDirective} from '../../directives/tooltip.directive';
import {DialogComponent} from '../dialog/dialog.component';
import {IconSelectText} from '../../models/particle-component-text.model';
import {IconsService} from '../../services/icons.service';

/**
 * Particle Icon Select component provides a button and an icon picker that includes all of the Particle Icons as well as the FAS icons.
 */
@Component({
    selector: 'particle-icon-select',
    templateUrl: 'icon-select.component.html',
    styleUrls: ['./icon-select.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => IconSelectComponent),
            multi: true
        }
    ],
    imports: [NgClass, NgStyle, TooltipDirective, DialogComponent, FormsModule, AsyncPipe]
})
export class IconSelectComponent implements ControlValueAccessor, OnDestroy {
  private service = inject(IconsService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  /**
   * The number of items to display per page
   * @private
   */
  private static readonly PAGE_SIZE = 48;

  /**
   * Set the value of the icon select
   * @param value the value to set
   */
  @Input()
  set value(value: string) {
    this._value = value;

    if (value) {
      const [prefix, name] = value.split(' ');
      this._internalValue.next({prefix, name});
      this.showIconSelectionPreview = true;
    }
  }

  get value(): string {
    return this._value;
  }

  /**
   * Set disabled
   * @param disabled whether or not the icon picker should be disabled
   */
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Color class of the button
   */
  readonly buttonColorClass = input<string>(null as any);

  /**
   * The value to set to the button's width, min-width, height and min-height
   */
  readonly buttonSizing = input('40px');

  readonly text = input({
    selectAnIcon: 'Select an Icon',
    seeAllIcons: 'See All Icons',
    fontAwesomeIcons: 'Font Awesome Icons',
    all: 'All',
    solid: 'Solid',
    regular: 'Regular',
    brands: 'Brands',
    customIcons: 'Custom Icons',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    searchIcons: 'Search Icons',
    submitSearch: 'Submit Search',
    clearResults: 'Clear Results',
    couldntFindAnything: 'We couldn\'t find anything',
    modifySearchCriteria: 'Please try modifying your search criteria',
    selection: 'Selection',
    confirm: 'Confirm',
    select: 'Select',
    close: 'Close'
} as IconSelectText);

  /**
   * Icon select opened event emitter
   */
  readonly opened = output<void>();

  /**
   * Icon selected event emitter
   */
  readonly selected = output<any>();

  /**
   * Dialog closed event emitter
   */
  readonly closed = output<any>();

  /**
   * The scrollable icon container
   */
  @ViewChild('iconScrollContainer')
  iconScrollContainer: ElementRef<HTMLDivElement> = null as any;

  /**
   * BehaviorSubject tracking the input value destructed into its prefix and class name
   */
  readonly _internalValue = new BehaviorSubject<{ prefix: string, name: string }>(null as any);

  /**
   * BehaviorSubject tracking the current filter value selection for icons
   */
  readonly _filter = new BehaviorSubject<{
    style: 'all' | 'solid' | 'regular' | 'brands',
    type: 'all' | 'particle' | 'fontawesome'
  }>({style: 'all', type: 'all'});

  /**
   * BehaviorSubject tracking the current icon search text value
   */
  readonly _searchText = new BehaviorSubject('');

  /**
   * BehaviorSubject that emits when search button has been clicked
   */
  readonly _searchClick = new BehaviorSubject('');

  /**
   * BehaviorSubject tracking the active pagination page
   */
  readonly _activePage = new BehaviorSubject(0);

  /**
   * Subject that emits on search input enter keyup
   */
  readonly _searchInputEnterKeyup = new Subject<void>();

  /**
   * An array of all icons (as strings) that meet the current filter/search criteria as an Observable
   * @private
   */
  private readonly icons$: Observable<Array<{ prefix: string, name: string }>> = combineLatest([
    this._filter,
    this._searchClick
  ]).pipe(
    map(([filter, searchText]) => this.service.getIcons(
      filter.type,
      filter.style,
      searchText
    ))
  );

  /**
   * The count of total paginator pages as an Observable
   */
  readonly totalPages$: Observable<number> = this.icons$.pipe(
    map(icons => icons.length
      ? Math.ceil(icons.length / IconSelectComponent.PAGE_SIZE)
      : 0
    )
  );

  /**
   * Observable boolean indicating whether or not the user can perform an icon text search
   */
  readonly canSearch$: Observable<boolean> = this._searchText.pipe(
    map(searchText => !!searchText.trim().length)
  );

  /**
   * Observable boolean indicating whether or not the user can paginate to the previous page
   */
  readonly canPaginatePrevious$: Observable<boolean> = this._activePage.pipe(
    map(activePage => activePage > 0)
  );

  /**
   * Observable boolean indicating whether or not the user can paginate to the next page
   */
  readonly canPaginateNext$: Observable<boolean> = this.totalPages$.pipe(
    withLatestFrom(this._activePage),
    map(([totalPages, activePage]) => activePage < (totalPages - 1))
  );

  /**
   * Paginated icons array as an Observable
   */
  readonly paginatedIcons$: Observable<Array<{ prefix: string, name: string }>> = combineLatest([
    this._activePage,
    this.icons$
  ]).pipe(
    map(([activePage, icons]) => {
      let paginatedIcons: Array<{ prefix: string, name: string }> = null as any;

      if (activePage >= 0 && icons.length) {
        paginatedIcons = icons.slice(
          IconSelectComponent.PAGE_SIZE * activePage,
          IconSelectComponent.PAGE_SIZE * (activePage + 1)
        );
      }

      return paginatedIcons;
    }),
    tap(() => {
      if (this.iconScrollContainer) {
        this.iconScrollContainer.nativeElement.scrollTop = 0;
      }
    })
  );

  /**
   * Object that controls whether to show the dialog or not
   */
  showDialog: any;

  /**
   * Whether or not to show the icon selection preview
   */
  showIconSelectionPreview = false;

  /**
   * Subscription object to store search input enter keyup subscription
   * @private
   */
  private readonly subscription: Subscription;

  /**
   * The value of the icon select
   * @private
   */
  private _value: string = null as any;

  /**
   * Whether or not the icon picker is disabled
   * @private
   */
  private _disabled: boolean = false;

  /**
   * Function to call on change
   */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {
  };

  /**
   * Function to call on touch
   */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {
  };

  /**
   * Dependency injection site
   * @param service the IconsService
   * @param changeDetectorRef the Angular ChangeDetectorRef
   */
  constructor() {
    this.subscription = this._searchInputEnterKeyup.pipe(
      withLatestFrom(this.canSearch$)
    ).subscribe(results => {
      if (results[1]) {
        this._searchClick.next(this._searchText.getValue());
        this._activePage.next(0);
      }
    });
  }

  /**
   * Destroy component, unsubscribe from search input enter keyup subscription
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Write the input value
   * @param value the value to write
   */
  writeValue(value: string): void {
    this.value = value;
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
   * Set disabled state
   * @param isDisabled whether or not the icon picker should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Open the icon select dialog
   */
  openDialog(): void {
    if (!this.disabled) {
      this.reset();
      this.showDialog = {};
      this.opened.emit();

      if (this.value) {
        this.showIconSelectionPreview = true;
      }
    }
  }

  /**
   * Close the icon select dialog
   */
  closeDialog(): void {
    let internalValue = null;
    if (this._value) {
      const [prefix, name] = this._value.split(' ');
      internalValue = {prefix, name};
    }

    this._internalValue.next(internalValue as any);
    this.showDialog = null;
    this.closed.emit(null as any);
  }

  /**
   * Handle filter select
   * @param filter the selected filter
   */
  handleFilterSelect(
    filter: {
      style: 'all' | 'solid' | 'regular' | 'brands',
      type: 'all' | 'particle' | 'fontawesome'
    }
  ): void {
    this._filter.next(filter);
    this._activePage.next(0);
  }

  /**
   * Update internal value on icon select
   * @param icon the selected icon
   */
  handleIconSelect(icon: { prefix: string, name: string }): void {
    this._internalValue.next(icon);
    this.showIconSelectionPreview = false;
    setTimeout(() => this.showIconSelectionPreview = true);
  }

  /**
   * Write value on confirm
   */
  handleIconSelectConfirm(): void {
    const icon = this._internalValue.getValue();
    this.updateModel(`${icon.prefix} ${icon.name}`);
    this.closeDialog();
  }

  /**
   * Go to the next pagination page
   */
  paginateNext(): void {
    this._activePage.next(this._activePage.getValue() + 1);
  }

  /**
   * Go to the previous pagination page
   */
  paginatePrevious(): void {
    this._activePage.next(this._activePage.getValue() - 1);
  }

  /**
   * Clear search text and reset paginator
   */
  clearSearch(): void {
    this._searchText.next('');
    this._searchClick.next('');
    this._activePage.next(0);
  }

  /**
   * Update model
   * @param value the new value of the model
   * @private
   */
  private updateModel(value: string): void {
    const valueBeforeUpdate = this._value;

    if (!this.disabled) {
      this.value = value;

      if (valueBeforeUpdate !== this._value) {
        this.onChange(this._value);
      }

      this.selected.emit({value: this._value});
    }
  }

  /**
   * Reset filtering/pagination BehaviorSubject values
   * @private
   */
  private reset(): void {
    this._filter.next({style: 'all', type: 'all'});
    this._searchText.next('');
    this._searchClick.next('');
    this._activePage.next(0);
  }
}
