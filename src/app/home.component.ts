import {Component} from '@angular/core';

import {AsyncPipe} from '@angular/common';
import {LayoutFullFramingComponent} from './shared/components/layout-full-framing/layout-full-framing.component';
import {DatePickerComponent} from './shared/components/date-picker/date-picker.component';
import {FormsModule} from '@angular/forms';
import {WeekPickerComponent} from './shared/components/week-picker/week-picker.component';
import {DateRangePickerComponent} from './shared/components/date-range-picker/date-range-picker.component';
import {DropdownComponent} from './shared/components/dropdown/dropdown.component';
import {MultiSelectComponent} from './shared/components/multi-select/multi-select.component';
import {SliderComponent} from './shared/components/slider/slider.component';
import {PaginatorComponent} from './shared/components/paginator/paginator.component';
import {IconSelectComponent} from './shared/components/icon-select/icon-select.component';
import {ThemingService} from './shared/services/theming.service';
import {NotificationService} from './shared/services/notification.service';
import {Notification} from './shared/models/notification.model';
import {RichTextComponent} from './shared/components/rich-text/rich-text.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [LayoutFullFramingComponent, DatePickerComponent, RichTextComponent, FormsModule, WeekPickerComponent, DateRangePickerComponent, DropdownComponent, MultiSelectComponent, SliderComponent, PaginatorComponent, IconSelectComponent, AsyncPipe]
})
export class HomeComponent {

  constructor(
    private themingService: ThemingService,
    private notificationService: NotificationService
  ) {
  }

  currentTheme$ = this.themingService.selectedTheme;

  date = 862891200000;

  dateRange: any = {
    start: new Date(new Date().setDate(new Date().getDate() - 14)),
    end: new Date(new Date().setDate(new Date().getDate() + 14))
  };

  sliderValue = 50;

  textEditorValue = '<h2 style="text-align: center">Beautiful <b>BOLD</b> <em>rich</em> text!</h2><p>Visit <a href="https://www.entake.io" target="_blank">entake.io</a> for more cool stuff!</p><img src="https://media.entake.io/images/masthead/57d44b23-b872-4f29-a2b5-dc39551d2bec.jpg"/>';

  pickerRange: any = {};

  addNotification(severity: 'success' | 'warn' | 'error' | 'info'): void {
    const notification = { severity } as Notification;

    switch (severity) {
      case 'success':
        notification.summary = 'Success Message';
        notification.detail = 'This is a success message!';
        break;
      case 'warn':
        notification.summary = 'Warning Message';
        notification.detail = 'This is a warning message!';
        break;
      case 'error':
        notification.summary = 'Error Message';
        notification.detail = 'This is an error message!';
        break;
      case 'info':
        notification.summary = 'Info Message';
        notification.detail = 'This is an info message!';
        break;
    }

    this.notificationService.add(notification);
  }

}
