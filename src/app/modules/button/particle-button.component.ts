import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'particle-button',
  templateUrl: './particle-button.component.html',
  styleUrls: ['./particle-button.component.css']
})
export class ParticleButtonComponent {

  @Input()
  type: 'standard' | 'ok' | 'cancel' | 'delete' | 'save' = 'standard';

  @Input()
  color: 'solid' | 'fill' = 'fill';

  @Input()
  rounded: 'none' | 'slight' | 'heavy' | 'pill' | 'circle' = 'none';

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
  padding: string = null as any;

  @Input()
  size: string = null as any;

  get classList(): string {
    let classList = 'btn access ';

    if (this.rounded) {
      classList += this.getRoundedClass();
      classList += ' ';
    }

    if (this.type) {
      classList += this.getColor();
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
      default: return '';
    }
  }

  private getRoundedClass(): string {
    switch(this.rounded) {
      case 'circle': return '';
      case 'heavy': return 'brad_5';
      case 'slight': return 'brad_3';
      case "pill": return 'brad_10';
      default: return '';
    }
  }

  private getColor(): string {
    switch (this.type) {
      case 'ok': return 'bg_blue';
      case 'save': return 'bg_green';
      case 'cancel': return 'bg_grey';
      case 'delete': return 'bg_red';
      default: return 'bg_overlay';
    }
  }

  constructor() { }

}
