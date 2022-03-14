import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'particle-slideover',
  templateUrl: './slideover.component.html',
  styleUrls: ['./slideover.component.css']
})
export class SlideoverComponent {

  private _position = 'right';

  slideoverOpen = false;

  @Input()
  set position(position: string) {
    if (position && ['left', 'right', 'top', 'bottom'].indexOf(position.toLowerCase()) > -1) {
      this._position = position.toLowerCase();
    } else {
      this._position = 'right';
    }
  }

  get position(): string {
    return this._position;
  }

  @Input()
  modal = true;

  @Input()
  width = '300px';

  @Input()
  height = '100px';

  @Output()
  opened = new EventEmitter<any>();

  @Output()
  closed = new EventEmitter<any>();

  constructor() { }

  open(): void {
    this.slideoverOpen = true;
    this.opened.emit();
  }

  close(): void {
    this.slideoverOpen = false;
    this.closed.emit();
  }

  toggle(): void {
    if (this.slideoverOpen) {
      this.close();
    } else {
      this.open();
    }
  }

}
