import {animate, AnimationEvent, style, transition, trigger} from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Input,
  input,
  model,
  output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, combineLatest, map, Observable, of, withLatestFrom} from 'rxjs';
import {DropdownText} from '../../models/particle-component-text.model';
import {AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {DropdownOption} from '../../models/dropdown-option.model';
import {DropdownOptionGroup} from '../../models/dropdown-option-group.model';
import {TooltipDirective} from '../../directives/tooltip.directive';

/**
 * Type representing the dropdown component option input
 */
declare type DropdownOptionInput = Array<DropdownOption | DropdownOptionGroup>;

/**
 * Dropdown component
 */
@Component({
    selector: 'particle-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css'],
    animations: [
        trigger('openClose', [
            transition('close => open', [
                style({ transform: 'scaleY(0.5)', opacity: 0 }),
                animate('200ms ease', style({ transform: 'scaleY(1)', opacity: 1 }))
            ]),
            transition('open => close', [
                style({ transform: 'scaleY(1)', opacity: 1 }),
                animate('200ms ease', style({ transform: 'scaleY(0.5)', opacity: 0 }))
            ]),
        ])
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownComponent),
            multi: true
        }
    ],
  imports: [NgIf, NgClass, NgTemplateOutlet, NgFor, FormsModule, AsyncPipe, TooltipDirective]
})
export class DropdownComponent implements ControlValueAccessor {
  private renderer = inject(Renderer2);
  private changeDetectorRef = inject(ChangeDetectorRef);

  /**
   * Set the value of the dropdown
   * @param value the value to set
   */
  @Input()
  set value(value: string | number) {
    this._value = value;
    this._internalValue.next(value);

    this.setSelectionIndex();
  }

  get value(): string | number {
    return this._value;
  }

  /**
   * The dropdown options/option groups
   */
  @Input()
  set options(options: DropdownOptionInput) {
    this._options.next(DropdownComponent.sanitizeOptionInput(options));
    this._allOptions = DropdownComponent.getAllOptions(this._options.value);
    this.setSelectionIndex();
  }

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef reference to the Angular change detector
   */
  constructor() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    this.dropdownId = `dropdown-${result}${new Date().getTime()}`;
  }

  /**
   * The amount of offset (in pixels) to place between the dropdown
   * and its list overlay
   * @private
   */
  private static readonly DROPDOWN_LIST_OFFSET = 0;

  /**
   * List of arrow key keycodes
   * @private
   */
  private static readonly ARROW_KEYS = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

  /**
   * ViewChild of the dropdown
   */
  @ViewChild('dropdown')
  dropdown: ElementRef<HTMLDivElement> = null as any;

  /**
   * ViewChild of the dropdown button
   */
  @ViewChild('dropdownButton')
  dropdownButton: ElementRef<HTMLButtonElement> = null as any;

  /**
   * ViewChild of the dropdown list
   */
  @ViewChild('dropdownList')
  dropdownList: ElementRef<HTMLDivElement> = null as any;

  /**
   * QueryList of dropdown option ViewChildren
   */
  @ViewChildren('dropdownOption')
  dropdownOptions: QueryList<ElementRef<HTMLButtonElement>> = null as any;

  /**
   * ContentChild of the dropdown option template
   */
  @ContentChild(TemplateRef)
  template: TemplateRef<HTMLElement> = null as any;

  /**
   * Whether the dropdown should be disabled
   */
  readonly disabled = model<boolean>(false);

  readonly text = input<DropdownText>({
    placeholder: 'Make a selection'
  });

  /**
   * Class list to assign to the dropdown
   */
  readonly classList = input<string>(null as any);

  readonly buttonClassList = input<string>(null as any);

  readonly collapsedButtonTemplate = input<TemplateRef<any>>(null as any);

  readonly collapsedButtonTooltipEnabled = input<boolean>(true);

  readonly dropdownBoxMinWidth = input<number>(200);

  /**
   * Event emitted on value change, emits the new value
   */
  readonly changed = output<string | number>();

  /**
   * BehaviorSubject tracking the input dropdown options/option groups
   */
  readonly _options = new BehaviorSubject<DropdownOptionInput>(null as any);

  /**
   * Full list of all active options, whether they are in a group or not
   * @private
   */
  private _allOptions: Array<DropdownOption> = null as any;

  /**
   * Typeahead string while users are typing into the input field
   * @private
   */
  private _fullPredictiveTextString = '';

  /**
   * Timeout to clear the _fullPredictiveTextString after a user stops typing for a certain amount of time
   * @private
   */
  private _timeout = null as any;


  /**
   * BehaviorSubject tracking the current value of the dropdown
   */
  readonly _internalValue = new BehaviorSubject<number | string>(null as any);

  /**
   * Observable map of option value (stringified if a number) to data context
   */
  private readonly dataContextMap$: Observable<Record<string, Record<string, unknown>>> = this._options.pipe(
    map(options => {
      let dataContextMap: Record<string, Record<string, unknown>> = null as any;

      if (options?.length) {
        dataContextMap = {};

        for (const option of options) {
          if ('options' in option) {
            for (const groupOption of option.options) {
              dataContextMap[String(groupOption.value)] = JSON.parse(JSON.stringify(groupOption.dataContext));
            }
          } else if ('dataContext' in option) {
            dataContextMap[String(option.value)] = JSON.parse(JSON.stringify(option.dataContext));
          }
        }
      }

      return dataContextMap;
    })
  );

  /**
   * The data context of the selected option as an Observable
   */
  readonly selectedDataContext$: Observable<Record<string, unknown>> = this._internalValue.pipe(
    withLatestFrom(this.dataContextMap$),
    map(([value, dataContextMap]) => {
      let dataContext: Record<string, unknown> = null as any;

      if (value !== null && dataContextMap !== null) {
        const entry = dataContextMap[String(value)];

        if (entry) {
          dataContext = JSON.parse(JSON.stringify(entry));
        }
      }

      return dataContext;
    })
  );

  tooltipData$ = combineLatest([
    of(this.text().placeholder),
    this._internalValue.asObservable(),
    this.dataContextMap$
  ]).pipe(map(results => {
    const placeholder = results[0];
    const value = results[1];
    const optionMap = results[2];

    if (!value) {
      return placeholder;
    }

    const option = optionMap[String(value)];

    return option ? option.$implicit : value;
  }));

  private static getAllOptions(options: DropdownOptionInput): Array<DropdownOption> {
    const allOptions: Array<DropdownOption> = [];
    for (const option of options) {
      if (option.type === 'group') {
        for (const groupOption of option.options) {
          if (!groupOption.disabled) {
            allOptions.push(groupOption);
          }
        }
      } else if (option.type === 'option' && !option.disabled) {
        allOptions.push(option as DropdownOption);
      }
    }

    return allOptions;
  }

  /**
   * Unique ID to assign to the dropdown
   */
  readonly dropdownId;

  /**
   * Whether the dropdown should be rendered
   */
  render = false;

  /**
   * Whether the dropdown is open
   */
  opened = false;

  /**
   * The index of the focused option in the dropdown list
   */
  selectionIndex: number = null as any;

  /**
   * In mobile (screen width is less than 768), swap to a native input
   */
  isMobile = window.innerWidth <= 768;

  /**
   * The current value of the dropdown
   * @private
   */
  private _value: string | number = null as any;

  /**
   * Removes options that do not have both a label and a value,
   * also removes empty groups (or groups that have no valid options)
   * @param options the options to sanitize
   * @private
   */
  private static sanitizeOptionInput(options: DropdownOptionInput): DropdownOptionInput {
    const sanitizedOptions: DropdownOptionInput = [];

    for (const option of options) {
      if (('groupLabel' in option) && ('options' in option)) {
        const validOptions: Array<DropdownOption> = [];
        for (const groupOption of (option.options ?? [])) {
          if (!!groupOption.label && (!!groupOption.value || (+groupOption.value >= 0))) {
            const groupOptionCopy = JSON.parse(JSON.stringify(groupOption));
            groupOptionCopy.dataContext = this.addLabelToDataContext(groupOptionCopy.label, groupOptionCopy.dataContext);
            groupOptionCopy.type = 'group';

            validOptions.push(groupOptionCopy);
          }
        }

        if (validOptions.length) {
          sanitizedOptions.push({groupLabel: option.groupLabel, options: validOptions, type: 'group'});
        }
      } else if (('label' in option) && ('value' in option)) {
        if (!!option.label && (!!option.value || (+option.value >= 0))) {
          const optionCopy = JSON.parse(JSON.stringify(option));
          optionCopy.dataContext = this.addLabelToDataContext(optionCopy.label, optionCopy.dataContext);
          optionCopy.type = 'option';

          sanitizedOptions.push(optionCopy);
        }
      }
    }

    return sanitizedOptions;
  }

  /**
   * Add option label to data context if not present. If $implicit
   * value is not present, it will be added with the label as its value.
   * If $implicit is already present, it will add a label key to the context
   * @param label the option label
   * @param dataContext the option data context
   * @private
   */
  private static addLabelToDataContext(label: string, dataContext: Record<string, unknown>): Record<string, unknown> {
    if (!dataContext) {
      dataContext = {};
    }

    if (label) {
      const implicitValue = dataContext['$implicit'];

      if (!!implicitValue || implicitValue as number >= 0) {
        const labelExists = !!dataContext['label'];

        if (!labelExists) {
          dataContext['label'] = label;
        }
      } else {
        dataContext['$implicit'] = label;
      }
    }

    return dataContext;
  }

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
   * Write value
   * @param value the value to write
   */
  writeValue(value: string | number): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Register function on change
   * @param fn the function to register
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
   * Set the disabled state
   * @param isDisabled disabled or not
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Reposition and resize the dropdown on window resize
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.isMobile = event.target.innerWidth <= 768;

    if (this.opened) {
      this.positionDropdownList();
      this.resizeDropdownList();
    }
  }

  /**
   * Prevent default behavior for arrow key keydown event
   * @param event the keydown KeyboardEvent
   */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (document.activeElement?.id?.includes(this.dropdownId) && !this.disabled()) {
      const {key} = event;

      if (DropdownComponent.ARROW_KEYS.includes(key)) {
        event.preventDefault();
      }
    }
  }

  /**
   * Close the dropdown list on tab and handle arrow key navigation
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (document.activeElement?.id?.includes(this.dropdownId) && !this.disabled()) {
      const {key} = event;

      if (DropdownComponent.ARROW_KEYS.includes(key)) {
        this.onArrowKeyUp(key);
      } else if (key === 'Tab') {
        this.closeDropdown();
      } else {
        this._fullPredictiveTextString += key;
        if (this._timeout) {
          clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(() => this._fullPredictiveTextString = '', 500);

        const filteredOptions = this._allOptions.filter(option => {
          return option.label && option.label.toLowerCase().startsWith(this._fullPredictiveTextString.toLowerCase())
        });

        if (filteredOptions && filteredOptions.length > 0) {
          this.handleDropdownOptionSelect(filteredOptions[0].value);
        }
      }
    }
  }

  /**
   * Close the dropdown list (if opened) on click if outside the list
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.opened) {
      const {pageX, pageY} = event;

      if (pageX > 0 && pageY > 0) {
        const {left, right, top, bottom} = this.dropdownList.nativeElement.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;
        const shouldClose = !(xPositionValid && yPositionValid);

        if (shouldClose) {
          this.closeDropdown();
          this.dropdownButton.nativeElement.focus();
        }
      }
    }
  }

  /**
   * Close dropdown on escape keyup and focus on dropdown button
   * @param event the keyup KeyboardEvent
   */
  onEscapeKeyUp(event: Event): void {
    if (this.opened) {
      event.stopImmediatePropagation();

      this.closeDropdown();
      this.dropdownButton.nativeElement.focus();
    }
  }

  /**
   * Set focus to dropdown option on mouse enter and update selected index
   * @param option the dropdown option to focus
   * @param index the index of the option to focus
   */
  onDropdownOptionMouseEnter(option: HTMLButtonElement, index: number): void {
    this.selectionIndex = index;
    option.focus();
  }

  /**
   * Set focus to dropdown option on mouse move and update selected index
   * @param option the dropdown option to focus
   * @param index the index of the option to focus
   */
  onDropdownOptionMouseMove(option: HTMLButtonElement, index: number): void {
    if (this.selectionIndex !== index) {
      this.selectionIndex = index;
      option.focus();
    }
  }

  /**
   * Write value and close dropdown on option select
   * @param value the value to write
   * @param disabled whether or not the selected option is disabled
   */
  onDropdownOptionSelect(value: string | number, disabled: boolean): void {
    if (!disabled) {
      this.handleDropdownOptionSelect(value);
      this.closeDropdown();
      this.dropdownButton.nativeElement.focus();
    }
  }

  /**
   * Open the dropdown list and align it
   * @param event the click MouseEvent
   */
  openDropdown(event: MouseEvent): void {
    event.stopImmediatePropagation();

    if (!this.disabled()) {
      this.render = true;
      this.opened = true;
    }
  }

  /**
   * Close the dropdown list
   */
  closeDropdown(): void {
    this.opened = false;
  }

  /**
   * Position and resize dropdown list on animation start if toState is open
   * @param event the Angular AnimationEvent
   */
  onAnimationStart(event: AnimationEvent): void {
    if (event.toState === 'open') {
      this.resizeDropdownList();
      this.setSelectionIndex();

      if (this.selectionIndex !== null) {
        setTimeout(() => {
          this.dropdownOptions.toArray()[this.selectionIndex]
            .nativeElement
            .focus();
        });
      }

      /*
        The height of the dropdown list is zero at the point where the above code executes,
        this is a workaround to align the list after its height is known to avoid a frame
        or two of the list at origin
       */
      this.renderer.setStyle(this.dropdownList.nativeElement, 'top', '-999px');
      this.renderer.setStyle(this.dropdownList.nativeElement, 'left', '-999px');
      setTimeout(() => this.positionDropdownList());
    }
  }

  /**
   * Stop rendering dropdown list on animation done if toState is close
   * @param event the Angular AnimationEvent
   */
  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'close') {
      this.render = false;
    }
  }

  /**
   * Focus on the selected dropdown option on dropdown open
   * @private
   */
  setSelectionIndex(): void {
    this.selectionIndex = null as any;

    if ((!!this.value || +this.value >= 0) && !!this.dropdownOptions?.length) {
      const dropdownOptionsArray = this.dropdownOptions.toArray();
      const foundIndex = dropdownOptionsArray.findIndex(option => {
        return String(this.value) === option.nativeElement.getAttribute('data-value');
      });

      this.selectionIndex = foundIndex > -1 ? foundIndex : null as any;
    }
  }

  /**
   * Update internal value and emit change events if input value differs from current value
   * @param value the selected value
   * @private
   */
  private handleDropdownOptionSelect(value: string | number): void {
    if (this.value !== value && !this.disabled()) {
      this.value = value;

      this.onChange(value);
      this.changed.emit(value);
    }
  }

  onModelChangeMobile(value: any): void {
    this.onChange(value);
    this.changed.emit(value);
  }

  /**
   * Align the dropdown list with the dropdown
   * @private
   */
  private positionDropdownList(): void {
    const {left, right, top, bottom} = this.dropdown.nativeElement.getBoundingClientRect();
    const {offsetHeight} = this.dropdownList.nativeElement;
    const bottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - bottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + DropdownComponent.DROPDOWN_LIST_OFFSET;
    let transformOrigin: string, positionTop: string;

    if (availableBottomSpace > offsetListHeight) {
      transformOrigin = 'top left';
      positionTop = `${bottomLeftAnchor + DropdownComponent.DROPDOWN_LIST_OFFSET}px`;
    } else if (availableTopSpace > offsetListHeight) {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    } else {
      if (offsetHeight > window.innerHeight) {
        positionTop = '0px';
      } else {
        const availableSpace = window.innerHeight - offsetHeight;
        positionTop = `${String(availableSpace / 2)}px`;
      }

      transformOrigin = 'top left';
    }

    this.renderer.setStyle(this.dropdownList.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.dropdownList.nativeElement, 'top', positionTop);

    const buttonWidth = right - left;
    const width = buttonWidth < this.dropdownBoxMinWidth() ? this.dropdownBoxMinWidth() : buttonWidth;
    if (left + width > window.innerWidth) {
      const newLeft = left - (this.dropdownBoxMinWidth() - buttonWidth);
      this.renderer.setStyle(this.dropdownList.nativeElement, 'left', `${newLeft}px`);
    } else {
      this.renderer.setStyle(this.dropdownList.nativeElement, 'left', `${left}px`);
    }
  }

  /**
   * Match the dropdown list width to the dropdown's width
   * @private
   */
  private resizeDropdownList(): void {
    const {left, right} = this.dropdown.nativeElement.getBoundingClientRect();
    let width = right - left;
    width = width < this.dropdownBoxMinWidth() ? this.dropdownBoxMinWidth() : width;

    this.renderer.setStyle(this.dropdownList.nativeElement, 'width', `${width}px`);
  }

  /**
   * Handle arrow keyup event
   * @param key the arrow key
   */
  private onArrowKeyUp(key: string): void {
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      const previousOption = this.getPreviousOption();

      if (previousOption !== null) {
        if (this.opened) {
          previousOption.focus();
        } else {
          this.handleDropdownOptionSelect(previousOption.getAttribute('data-value') as string);
        }
      }
    } else if (key === 'ArrowRight' || key === 'ArrowDown') {
      const nextOption = this.getNextOption();

      if (nextOption !== null) {
        if (this.opened) {
          nextOption.focus();
        } else {
          this.handleDropdownOptionSelect(nextOption.getAttribute('data-value') as string);
        }
      }
    }
  }

  /**
   * Get the next enabled dropdown option (relative to the current selection index).
   * If the currently selected option is the final available option, it is
   * returned. If no selection has been made, the first available option is returned
   * @private
   */
  private getNextOption(): HTMLButtonElement {
    const optionsArray = this.dropdownOptions.toArray();

    const startIndex = this.selectionIndex === null ? 0 : this.selectionIndex + 1;
    for (let i = startIndex; i < optionsArray.length; i++) {
      const option = optionsArray[i].nativeElement;

      if (!option.disabled) {
        this.selectionIndex = i;
        break;
      }
    }

    return this.selectionIndex === null
      ? null as any
      : optionsArray[this.selectionIndex].nativeElement;
  }

  /**
   * Get the previous enabled dropdown option (relative to the current selection index).
   * If the currently selected option is the first available option, it is
   * returned
   * @private
   */
  private getPreviousOption(): HTMLButtonElement {
    let previousOption: HTMLButtonElement = null as any;

    if (this.selectionIndex !== null) {
      const optionsArray = this.dropdownOptions.toArray();

      for (let i = this.selectionIndex - 1; i >= 0; i--) {
        const option = optionsArray[i].nativeElement;

        if (!option.disabled) {
          this.selectionIndex = i;
          previousOption = option;
          break;
        }
      }
    }

    return previousOption;
  }
}
