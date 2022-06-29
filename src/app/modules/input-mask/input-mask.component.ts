import {
  Component,
  ElementRef,
  OnInit,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
export const INPUTMASK_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputMaskComponent),
  multi: true
};
@Component({
  selector: 'particle-input-mask',
  template: `<input #input [attr.id]="inputId" [attr.type]="type" [attr.name]="name" [ngStyle]="style" [ngClass]="styleClass" [attr.placeholder]="placeholder"
                    [attr.size]="size" [attr.autocomplete]="autocomplete" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [attr.aria-label]="ariaLabel" [attr.aria-required]="ariaRequired" [disabled]="disabled" [readonly]="readonly" [attr.required]="required"
                    (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (keydown)="onKeyDown($event)" (keypress)="onKeyPress($event)" [attr.autofocus]="autoFocus"
                    (input)="onInputChange($event)" (paste)="handleInputChange($event)" (click)="onClick()">`,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.ui-inputwrapper-filled]': 'filled',
    '[class.ui-inputwrapper-focus]': 'focus'
  },
  providers: [INPUTMASK_VALUE_ACCESSOR]
})
export class InputMaskComponent implements OnInit, ControlValueAccessor {
  @Input() type = 'text';
  @Input() slotChar = '_';
  @Input() autoClear = true;
  @Input() style: any;
  @Input() inputId: string = null as any;
  @Input() styleClass: string = null as any;
  @Input() placeholder: string = null as any;
  @Input() size: number = null as any;
  @Input() maxlength: number = null as any;
  @Input() tabindex: string = null as any;
  @Input() ariaLabel: string = null as any;
  @Input() ariaRequired: boolean = null as any;
  @Input() disabled: boolean = null as any;
  @Input() readonly: boolean = null as any;
  @Input() unmask: boolean = null as any;
  @Input() name: string = null as any;
  @Input() required: boolean = null as any;
  @Input() characterPattern = '[A-Za-z]';
  @Input() autoFocus = false;
  @Input() autocomplete: string = null as any;
  @ViewChild('input', { static: true }) inputViewChild: ElementRef = null as any;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onComplete: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onBlur: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onInput: EventEmitter<any> = new EventEmitter();
  value: any;
  _mask: string = null as any;
  input: HTMLInputElement = null as any;
  filled = false;
  defs: any;
  tests: any[] = null as any;
  partialPosition: any;
  firstNonMaskPos: number = null as any;
  lastRequiredNonMaskPos: any;
  len: number = null as any;
  oldVal: string = null as any;
  buffer: any;
  defaultBuffer: string = null as any;
  focusText: string = null as any;
  caretTimeoutId: any;
  androidChrome = false;
  focused = false;
  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};
  constructor() {}
  ngOnInit(): void {
    const ua = navigator.userAgent;
    this.androidChrome = /chrome/i.test(ua) && /android/i.test(ua);
    this.initMask();
  }
  @Input() get mask(): string {
    return this._mask;
  }
  set mask(val: string) {
    this._mask = val;
    this.initMask();
    this.writeValue('');
    this.onModelChange(this.value);
  }
  initMask(): void {
    this.tests = [];
    this.partialPosition = this.mask.length;
    this.len = this.mask.length;
    this.firstNonMaskPos = null as any;
    this.defs = {
      '9': '[0-9]',
      'a': this.characterPattern,
      '*': `${this.characterPattern}|[0-9]`
    };
    const maskTokens = this.mask.split('');
    for (let i = 0; i < maskTokens.length; i++) {
      const c = maskTokens[i];
      if (c === '?') {
        this.len--;
        this.partialPosition = i;
      } else if (this.defs[c]) {
        this.tests.push(new RegExp(this.defs[c]));
        if (this.firstNonMaskPos === null) {
          this.firstNonMaskPos = this.tests.length - 1;
        }
        if (i < this.partialPosition) {
          this.lastRequiredNonMaskPos = this.tests.length - 1;
        }
      } else {
        this.tests.push(null);
      }
    }
    this.buffer = [];
    for (let i = 0; i < maskTokens.length; i++) {
      const c = maskTokens[i];
      if (c !== '?') {
        if (this.defs[c]) {
          this.buffer.push(this.getPlaceholder(i));
        } else {
          this.buffer.push(c);
        }
      }
    }
    this.defaultBuffer = this.buffer.join('');
  }
  writeValue(value: any): void {
    this.value = value;
    if (this.inputViewChild && this.inputViewChild.nativeElement) {
      if (this.value === undefined || this.value == null) {
        this.inputViewChild.nativeElement.value = '';
      } else {
        this.inputViewChild.nativeElement.value = this.value;
      }
      this.checkVal();
      this.focusText = this.inputViewChild.nativeElement.value;
      this.updateFilledState();
    }
  }
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
  setDisabledState(val: boolean): void {
    this.disabled = val;
  }
  caret(first?: number, last?: number): any {
    let range, begin, end;
    if (!this.inputViewChild.nativeElement.offsetParent || this.inputViewChild.nativeElement !== document.activeElement) {
      return;
    }
    if (typeof first === 'number') {
      begin = first;
      end = (typeof last === 'number') ? last : begin;
      if (this.inputViewChild.nativeElement.setSelectionRange) {
        this.inputViewChild.nativeElement.setSelectionRange(begin, end);
      } else if (this.inputViewChild.nativeElement['createTextRange']) {
        range = this.inputViewChild.nativeElement['createTextRange']();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', begin);
        range.select();
      }
    } else {
      if (this.inputViewChild.nativeElement.setSelectionRange) {
        begin = this.inputViewChild.nativeElement.selectionStart;
        end = this.inputViewChild.nativeElement.selectionEnd;
      } else if ((document as any)['selection'] && (document as any)['selection'].createRange) {
        range = (document as any)['selection'].createRange();
        begin = 0 - range.duplicate().moveStart('character', -100000);
        end = begin + range.text.length;
      }
      return {begin: begin, end: end};
    }
    return null;
  }
  isCompleted(): boolean {
    for (let i = this.firstNonMaskPos; i <= this.lastRequiredNonMaskPos; i++) {
      if (this.tests[i] && this.buffer[i] === this.getPlaceholder(i)) {
        return false;
      }
    }
    return true;
  }
  getPlaceholder(i: number): string {
    if (i < this.slotChar.length) {
      return this.slotChar.charAt(i);
    }
    return this.slotChar.charAt(0);
  }
  seekNext(pos: number): number {
    while (++pos < this.len && !this.tests[pos]) {}
    return pos;
  }
  seekPrev(pos: number): number {
    while (--pos >= 0 && !this.tests[pos]) {}
    return pos;
  }
  shiftL(begin: number, end: number): void {
    let i, j;
    if (begin < 0) {
      return;
    }
    for (i = begin, j = this.seekNext(end); i < this.len; i++) {
      if (this.tests[i]) {
        if (j < this.len && this.tests[i].test(this.buffer[j])) {
          this.buffer[i] = this.buffer[j];
          this.buffer[j] = this.getPlaceholder(j);
        } else {
          break;
        }
        j = this.seekNext(j);
      }
    }
    this.writeBuffer();
    this.caret(Math.max(this.firstNonMaskPos, begin));
  }
  shiftR(pos: number): void {
    let i, c, j, t;
    for (i = pos, c = this.getPlaceholder(pos); i < this.len; i++) {
      if (this.tests[i]) {
        j = this.seekNext(i);
        t = this.buffer[i];
        this.buffer[i] = c;
        if (j < this.len && this.tests[j].test(t)) {
          c = t;
        } else {
          break;
        }
      }
    }
  }
  handleAndroidInput(e: Event): void {
    const curVal = this.inputViewChild.nativeElement.value;
    const pos = this.caret() as any;
    if (this.oldVal && this.oldVal.length && this.oldVal.length > curVal.length ) {
      // a deletion or backspace happened
      this.checkVal(true);
      while (pos.begin > 0 && !this.tests[pos.begin - 1]) {
        pos.begin--;
      }
      if (pos.begin === 0) {
        while (pos.begin < this.firstNonMaskPos && !this.tests[pos.begin]) {
          pos.begin++;
        }
      }
      setTimeout(() => {
        this.caret(pos.begin, pos.begin);
        this.updateModel(e);
        if (this.isCompleted()) {
          this.onComplete.emit();
        }
      }, 0);
    } else {
      this.checkVal(true);
      while (pos.begin < this.len && !this.tests[pos.begin]) {
        pos.begin++;
      }
      setTimeout(() => {
        this.caret(pos.begin, pos.begin);
        this.updateModel(e);
        if (this.isCompleted()) {
          this.onComplete.emit();
        }
      }, 0);
    }
  }
  onInputBlur(e: Event): void {
    this.focused = false;
    this.onModelTouched();
    this.checkVal();
    this.updateFilledState();
    this.onBlur.emit(e);
    if (this.inputViewChild.nativeElement.value !== this.focusText || this.inputViewChild.nativeElement.value !== this.value) {
      this.updateModel(e);
      const event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, false);
      this.inputViewChild.nativeElement.dispatchEvent(event);
    }
  }
  onKeyDown(e: KeyboardEvent): void {
    if (this.readonly) {
      return;
    }
    const k = e.which || e.keyCode;
    let pos,
      begin,
      end;
    const iPhone = /iphone/i.test(navigator.userAgent);
    this.oldVal = this.inputViewChild.nativeElement.value;
    // backspace, delete, and escape get special treatment
    if (k === 8 || k === 46 || (iPhone && k === 127)) {
      pos = this.caret() as any;
      begin = pos.begin;
      end = pos.end;
      if (end - begin === 0) {
        begin = k !== 46 ? this.seekPrev(begin) : (end = this.seekNext(begin - 1));
        end = k === 46 ? this.seekNext(end) : end;
      }
      this.clearBuffer(begin, end);
      this.shiftL(begin, end - 1);
      this.updateModel(e);
      e.preventDefault();
    } else if ( k === 13 ) { // enter
      this.onInputBlur(e);
      this.updateModel(e);
    } else if (k === 27) { // escape
      this.inputViewChild.nativeElement.value = this.focusText;
      this.caret(0, this.checkVal());
      this.updateModel(e);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const { selectionStart, selectionEnd } = this.inputViewChild.nativeElement as HTMLInputElement;
      const checkedVal = this.checkVal(true);
      if (selectionStart === selectionEnd && (selectionStart as any - 1) > checkedVal) {
        this.caret(checkedVal, checkedVal);
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight') {
      const { selectionStart, selectionEnd } = this.inputViewChild.nativeElement as HTMLInputElement;
      const checkedVal = this.checkVal(true);
      if (selectionStart === selectionEnd && (selectionStart as any + 1) > checkedVal) {
        this.caret(checkedVal, checkedVal);
        e.preventDefault();
      }
    }
  }
  onKeyPress(e: KeyboardEvent): void {
    if (this.readonly) {
      return;
    }
    const k = e.which || e.keyCode;
    const pos = this.caret() as any;
    let next = 0;
    let p, c, completed;
    if (e.ctrlKey || e.altKey || e.metaKey || k < 32  || (k > 34 && k < 41)) {// Ignore
      return;
    } else if ( k && k !== 13 ) {
      if (pos.end - pos.begin !== 0) {
        this.clearBuffer(pos.begin, pos.end);
        this.shiftL(pos.begin, pos.end - 1);
      }
      p = this.seekNext(pos.begin - 1);
      if (p < this.len) {
        c = String.fromCharCode(k);
        if (this.tests[p].test(c)) {
          this.shiftR(p);
          this.buffer[p] = c;
          this.writeBuffer();
          next = this.seekNext(p);
          if (/android/i.test(navigator.userAgent)) {
            // Path for CSP Violation on FireFox OS 1.1
            const proxy = (): void => {
              this.caret(next);
            };
            setTimeout(proxy, 0);
          } else {
            this.caret(next);
          }
          if (pos.begin <= this.lastRequiredNonMaskPos) {
            completed = this.isCompleted();
          }
        }
      }
      e.preventDefault();
    }
    this.updateModel(e);
    this.updateFilledState();
    if (completed) {
      this.onComplete.emit();
    }
  }
  /**
   * Adjust cursor position if clicked on empty space ahead of the existing input
   */
  onClick(): void {
    const { selectionStart, selectionEnd } = this.inputViewChild.nativeElement as HTMLInputElement;
    const checkedVal = this.checkVal(true);
    if (selectionStart === selectionEnd && selectionStart as any > checkedVal) {
      this.caret(checkedVal, checkedVal);
    }
  }
  clearBuffer(start: number, end: number): void {
    let i;
    for (i = start; i < end && i < this.len; i++) {
      if (this.tests[i]) {
        this.buffer[i] = this.getPlaceholder(i);
      }
    }
  }
  writeBuffer(): void {
    this.inputViewChild.nativeElement.value = this.buffer.join('');
  }
  checkVal(allow?: boolean): number {
    // try to place characters where they belong
    const test = this.inputViewChild.nativeElement.value;
    let lastMatch = -1,
      i,
      c,
      pos;
    for (i = 0, pos = 0; i < this.len; i++) {
      if (this.tests[i]) {
        this.buffer[i] = this.getPlaceholder(i);
        while (pos++ < test.length) {
          c = test.charAt(pos - 1);
          if (this.tests[i].test(c)) {
            this.buffer[i] = c;
            lastMatch = i;
            break;
          }
        }
        if (pos > test.length) {
          this.clearBuffer(i + 1, this.len);
          break;
        }
      } else {
        if (this.buffer[i] === test.charAt(pos)) {
          pos++;
        }
        if ( i < this.partialPosition) {
          lastMatch = i;
        }
      }
    }
    if (allow) {
      this.writeBuffer();
    } else if (lastMatch + 1 < this.partialPosition) {
      if (this.autoClear || this.buffer.join('') === this.defaultBuffer) {
        // Invalid value. Remove it and replace it with the
        // mask, which is the default behavior.
        if (this.inputViewChild.nativeElement.value) {
          this.inputViewChild.nativeElement.value = '';
        }
        this.clearBuffer(0, this.len);
      } else {
        // Invalid value, but we opt to show the value to the
        // user and allow them to correct their mistake.
        this.writeBuffer();
      }
    } else {
      this.writeBuffer();
      this.inputViewChild.nativeElement.value = this.inputViewChild.nativeElement.value.substring(0, lastMatch + 1);
    }
    return (this.partialPosition ? i : this.firstNonMaskPos);
  }
  onInputFocus(event: Event): void {
    if (this.readonly) {
      return;
    }
    this.focused = true;
    clearTimeout(this.caretTimeoutId);
    let pos: number;
    this.focusText = this.inputViewChild.nativeElement.value;
    pos = this.checkVal();
    this.caretTimeoutId = setTimeout(() => {
      if (this.inputViewChild.nativeElement !== document.activeElement) {
        return;
      }
      this.writeBuffer();
      if (pos === this.mask.replace('?', '').length) {
        this.caret(0, pos);
      } else {
        this.caret(pos);
      }
    }, 10);
    this.onFocus.emit(event);
  }
  onInputChange(event: Event): void {
    if (this.androidChrome) {
      this.handleAndroidInput(event);
    } else {
      this.handleInputChange(event);
    }
    this.onInput.emit(event);
  }
  handleInputChange(event: Event): void {
    if (this.readonly) {
      return;
    }
    setTimeout(() => {
      const pos = this.checkVal(true);
      this.caret(pos);
      this.updateModel(event);
      if (this.isCompleted()) {
        this.onComplete.emit();
      }
    }, 0);
  }
  getUnmaskedValue(): string {
    const unmaskedBuffer = [];
    for (let i = 0; i < this.buffer.length; i++) {
      const c = this.buffer[i];
      if (this.tests[i] && c !== this.getPlaceholder(i)) {
        unmaskedBuffer.push(c);
      }
    }
    return unmaskedBuffer.join('');
  }
  updateModel(e: any): void {
    const updatedValue = this.unmask ? this.getUnmaskedValue() : e.target?.value;
    if (updatedValue !== null && updatedValue !== undefined) {
      this.value = updatedValue;
      this.onModelChange(this.value);
    }
  }
  updateFilledState(): void {
    this.filled = this.inputViewChild.nativeElement && this.inputViewChild.nativeElement.value !== '';
  }
  focus(): void {
    this.inputViewChild.nativeElement.focus();
  }
}
