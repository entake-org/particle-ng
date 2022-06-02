import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ButtonState} from "./button-state.model";

@Component({
  selector: 'particle-button',
  templateUrl: './particle-button.component.html',
  styleUrls: ['./particle-button.component.css']
})
export class ParticleButtonComponent implements OnInit {

  @Input()
  type: 'standard' | 'ok' | 'cancel' | 'delete' | 'save' | 'next' | 'previous' | 'open' | 'close' = 'standard';

  @Input()
  color: 'outline' | 'fill' = 'fill';

  @Input()
  rounded: 'none' | 'less' | 'more' | 'pill' | 'circle' | 'square' = 'none';

  private _icon: string = null as any;

  @Input()
  set icon(icon: string) {
    this._icon = icon;
    this.updateButtonState();
  }

  get icon(): string {
    return this._icon;
  }

  @Input()
  iconSide: 'left' | 'right' | 'only' = 'left';

  private _text: string = null as any;

  @Input()
  set text(text: string) {
    this._text = text;
    this.updateButtonState();
  }

  get text(): string {
    return this._text;
  }

  private _width: string = 'auto';

  @Input()
  set width(width: string) {
    this._width = width;
    this.updateButtonState();
  }

  get width(): string {
    return this._width;
  }

  @Input()
  hover: 'slide_up' | 'slide_down' | 'slide_right' | 'slide_left' | 'grow' | 'shrink' | 'lighten' | 'darken' = null as any;

  @Input()
  margin: string = '0 5px 0 5px';

  @Input()
  size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' = 'md';

  @Input()
  colorClassOverride: string = null as any;

  private _buttonState: BehaviorSubject<ButtonState> = new BehaviorSubject<ButtonState>(null as any);

  buttonState = this._buttonState.asObservable();

  constructor() { }

  ngOnInit(): void {
    this.updateButtonState();
  }

  updateButtonState(): void {
    this._buttonState.next({
      icon: this.icon,
      border: this.getBorder(),
      classList: this.getClassList(),
      fontColor: this.getFontColor(),
      iconSide: this.iconSide,
      label: this.getLabel(),
      margin: this.margin,
      width: this.width
    });
  }

  private getClassList(): string {
    let classList = 'pb_button access ';

    if (this.rounded) {
      classList += this.getRoundedClass();
      classList += ' ';
    }

    if (this.type) {
      if (this.color === 'fill') {
        classList += this.getColor();
      } else {
        classList += 'bg_overlay';
      }

      classList += ' ';
    }

    if (this.size) {
      if (this.rounded === 'circle') {
        classList += 'circle_' + this.size;
      } else if (this.rounded === 'square') {
        classList += 'square_' + this.size;
      } else {
        classList += this.size;
      }

      classList += ' ';
    }

    if (this.hover) {
      classList += this.hover;
      classList += ' ';
    }

    return classList;
  }

  private getLabel(): string {
    if (this.iconSide !== 'only') {
      if (this.text) {
        return this.text;
      }

      switch (this.type) {
        case 'ok': return 'OK';
        case 'save': return 'Save';
        case 'cancel': return 'Cancel';
        case 'delete': return 'Delete';
        case 'next': return 'Next';
        case 'previous': return 'Previous';
        case 'open': return 'Open';
        case 'close': return 'Close';
      }
    }

    return null as any;
  }

  private getRoundedClass(): string {
    switch(this.rounded) {
      case 'less': return 'pb_border_3';
      case 'more': return 'pb_border_6';
      case 'circle': return 'pb_circle';
      case "pill": return 'pb_pill';
      default: return '';
    }
  }

  private getColor(): string {
    if (this.colorClassOverride) {
      return this.colorClassOverride;
    }

    if (this.type === 'standard') {
      return 'bg_overlay_rev';
    }

    return `${this.type}_button_color`;
  }

  private getBorder(): string {
    if (this.color === 'outline' && this.type !== 'standard') {
      return `1px solid var(--${this.getColor().split('_').join('-')})`
    } else if (this.type === 'standard') {
      return '1px solid rgba(150,150,150,0.5)';
    }

    return '';
  }

  private getFontColor(): string {
    if (this.color === 'outline' && this.type !== 'standard') {
      return `var(--${this.getColor().split('_').join('-')})`
    }

    return '';
  }

}
