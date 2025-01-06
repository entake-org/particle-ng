import {Component, Input, input} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'particle-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.css'],
    imports: [NgClass]
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

  readonly backgroundColorClass = input<string>('content_color_dark_1');

  readonly progressColorClass = input<string>('bg_blue');

  readonly showPercentComplete = input<boolean>(true);

  readonly borderRadius = input<number>(9999);

  readonly height = input<number>(20);

  readonly showBorder = input<boolean>(true);

  readonly showMovement = input<boolean>(false);

}
