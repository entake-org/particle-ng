import { Component } from '@angular/core';
import {ThemingService} from './modules/theming/services/theming.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  constructor(
    private themingService: ThemingService
  ) {
  }

  currentTheme$ = this.themingService.selectedTheme;

  dateRange: any = {
    start: new Date(new Date().setDate(new Date().getDate() - 14)),
    end: new Date(new Date().setDate(new Date().getDate() + 14))
  };

  sliderValue = 50;

  textEditorValue = '<h2 style="text-align: center">Beautiful <b>BOLD</b> <em>rich</em> text!</h2><p>Visit <a href="https://www.sdsolutions.io" target="_blank">sdsolutions.io</a> for more cool stuff!</p>';

  pickerRange: any = {};

}
