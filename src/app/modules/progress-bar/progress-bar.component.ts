import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'particle-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input()
  percentComplete: number = 0;

  @Input()
  backgroundColorClass: string = 'content_color_dark_1';

  @Input()
  progressColorClass: string = 'bg_blue';

  @Input()
  showPercentComplete: boolean = true;

  @Input()
  borderRadius: number = 9999;

  constructor() { }

  ngOnInit(): void {
  }

}
