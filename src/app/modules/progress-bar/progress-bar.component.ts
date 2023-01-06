import {Component, Input} from '@angular/core';

@Component({
  selector: 'particle-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {

  private _percentComplete: number = 0;

  @Input()
  set percentComplete(percentComplete: number) {
    this._percentComplete = Math.floor(percentComplete);
  }

  get percentComplete(): number {
    return this._percentComplete;
  }

  @Input()
  backgroundColorClass: string = 'content_color_dark_1';

  @Input()
  progressColorClass: string = 'bg_blue';

  @Input()
  showPercentComplete: boolean = true;

  @Input()
  borderRadius: number = 9999;

  @Input()
  height: number = 20;

  @Input()
  showBorder: boolean = true;

  @Input()
  showMovement: boolean = false;

  constructor() { }

}
