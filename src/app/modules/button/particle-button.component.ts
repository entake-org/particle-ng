import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'particle-button',
  templateUrl: './particle-button.component.html',
  styleUrls: ['./particle-button.component.css']
})
export class ParticleButtonComponent {

  @Input()
  type: 'standard' | 'ok' | 'cancel' | 'delete' | 'save' | 'next' | 'previous' | 'open' | 'close' | 'basic' = 'standard';

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
  hover: string = 'none';

  @Input()
  margin: string = '0 5px 0 5px';

  @Input()
  size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg' = 'md';

  get classList(): string {
    let classList = 'pb_button pb_access ';

    if (this.rounded) {
      classList += this.getRoundedClass();
      classList += ' ';
    }

    if (this.type) {
      classList += this.getColor();
      classList += ' ';
    }

    if (this.size) {
      classList += this.size;
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
      default: return '';
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
    switch (this.type) {
      case 'ok': return 'bg_blue';
      case 'save': return 'bg_green';
      case 'cancel': return 'bg_grey';
      case 'delete': return 'bg_red';
      case 'next': return 'bg_blue';
      case 'previous': return 'bg_purple';
      case 'open': return 'bg_orange';
      case 'close': return 'bg_grey_dark_2';
      case 'basic': return 'bg_overlay_rev brdr';
      default: return 'bg_overlay';
    }
  }

  constructor() { }

}
