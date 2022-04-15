import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'particle-button',
  templateUrl: './particle-button.component.html',
  styleUrls: ['./particle-button.component.css']
})
export class ParticleButtonComponent {

  @Input()
  type: 'standard' | 'ok' | 'cancel' | 'delete' | 'save' | 'next' | 'previous' | 'open' | 'close' = 'standard';

  @Input()
  color: 'outline' | 'fill' = 'fill';

  @Input()
  rounded: 'none' | 'less' | 'more' | 'pill' | 'circle' = 'none';

  @Input()
  icon: string = null as any;

  @Input()
  iconSide: 'left' | 'right' | 'only' = 'left';

  @Input()
  text: string = null as any;

  @Input()
  width: string = 'auto';

  @Input()
  hover: string = null as any;

  @Input()
  margin: string = '0 5px 0 5px';

  @Input()
  size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' = 'md';

  get classList(): string {
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

  get label(): string {
    if (this.text && this.iconSide !== 'only') {
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
      default: return null as any;
    }
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
    if (this.type === 'standard') {
      return 'bg_overlay_rev brdr';
    }

    return `${this.type}_button_color`;
  }

  get border(): string {
    if (this.color === 'outline' && this.type !== 'standard') {
      const s = `1px solid var(--${this.getColor().split('_').join('-')})`
      console.log(s)
      return s;
    }

    return '';
  }

  get fontColor(): string {
    if (this.color === 'outline' && this.type !== 'standard') {
      const s = `var(--${this.getColor().split('_').join('-')})`
      console.log(s);
      return s;
    }

    return '';
  }

  constructor() { }

}
