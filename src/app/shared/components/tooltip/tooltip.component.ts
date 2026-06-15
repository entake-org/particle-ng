import { Component, input } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'particle-tooltip',
  template: `
    <div class="particle_tooltip" [ngClass]="position()">
      {{ text() }}
    </div>
  `,
  imports: [
    NgClass
  ]
})
export class TooltipComponent {
  text = input<string>('');
  position = input<string>('');
}
