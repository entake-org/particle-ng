import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  input,
  OnInit,
  output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SliderText} from '../../models/particle-component-text.model';
import {NgClass} from '@angular/common';

/**
 * Component that wraps the native HTML5 slider
 */
@Component({
    selector: 'particle-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ],
    imports: [FormsModule, NgClass]
})
export class SliderComponent implements ControlValueAccessor, OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);


  /**
   * ViewChild of the slider input
   */
  @ViewChild('sliderInput')
  sliderInput: ElementRef<HTMLInputElement> = null as any;

  /**
   * Set the value of the component
   * @param value the value to set
   */
  @Input()
  set value(value: number) {
    this._value = value;
    this.setSliderWidth();
  }

  get value(): number {
    return this._value;
  }

  /**
   * Set the minimum slider value
   * @param min the value to set
   */
  @Input()
  set min(min: number) {
    this._min = isNaN(min) ? 0 : min;
  }

  /**
   * Set the maximum slider value
   * @param max the value to set
   */
  @Input()
  set max(max: number) {
    this._max = isNaN(max) ? 100 : max;
  }

  /**
   * Set the slider step size
   * @param step the value to set
   */
  @Input()
  set step(step: number) {
    this._step = isNaN(step) ? 1 : step;
  }

  /**
   * Set the disabled state of the slider/input
   * @param disabled the value to set
   */
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  /**
   * Set the input class list
   * @param inputClassList the value to set
   */
  @Input()
  set inputClassList(inputClassList: string) {
    this._inputClassList = inputClassList ? inputClassList : 'access input sm';
  }

  /**
   * The unit being represented by the slider
   */
  readonly unit = input<string>(null as any);

  /**
   * The aria-label to append to the slider/input
   */
  readonly ariaLabel = input<string>(null as any);

  readonly text = input<SliderText>({
    selectAValue: 'Select a value',
    enterAValue: 'Enter a value'
} as SliderText);

  /**
   * Event emitted on slider/slider input input event
   */
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly input = output<number>();

  /**
   * The internal value of the component
   */
  _value: number = null as any;

  /**
   * The minimum slider value
   */
  _min = 0;

  /**
   * The maximum slider value
   */
  _max = 100;

  /**
   * The step size of the slider
   */
  _step = 1;

  /**
   * Whether the slider is disabled or not
   */
  _disabled: boolean = false;

  /**
   * The class list to apply to the number input
   */
  _inputClassList = 'access ptl_input ptl_input_height ptl_input_text_size ptl_input_padding ptl_input_bg_color ptl_brdr_color ptl_brdr_size ptl_brdr_radius';

  /**
   * The width of the colored section of the slider bar
   */
  sliderWidth = 0;


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: any) => void = () => {
  };


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => any = () => {
  };

  /**
   * Init component
   */
  ngOnInit(): void {
    if (isNaN(this.value)) {
      this.value = isNaN(this._min) ? 0 : this._min;
    }
  }

  /**
   * Set internal value when external value changes
   * @param value the external value
   */
  writeValue(value: number): void {
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
   * Set the disabled state of the component
   * @param isDisabled disabled or not
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Update value on input
   * @param value the new value of the component
   */
  handleInput(value: number): void {
    if (!this._disabled) {
      let valueToSet: number;

      if (isNaN(value) || value < this._min) {
        valueToSet = this._min;
      } else {
        valueToSet = Math.min(this._max, value);
      }

      if (this.value !== valueToSet) {
        this.value = valueToSet;
        this.sliderInput.nativeElement.value = String(valueToSet);
        this.onChange(valueToSet);
      } else {
        this.sliderInput.nativeElement.value = String(valueToSet);
      }
    }
  }

  /**
   * Prevent the paste event from completing
   * @param event the paste ClipboardEvent
   */
  preventPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  /**
   * Set the slider width
   * @private
   */
  private setSliderWidth(): void {
    this.sliderWidth = Math.min(100, (this.value - this._min) / (this._max - this._min) * 100);
  }
}
