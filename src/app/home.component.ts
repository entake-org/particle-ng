import { Component } from '@angular/core';
import {ThemingService} from './modules/theming/services/theming.service';
import {NotificationService} from './modules/notification/services/notification.service';
import {Notification} from './modules/notification/models/notification.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
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

  textEditorValue = '<h2 style="text-align: center">Beautiful <b>BOLD</b> <em>rich</em> text!</h2><p>Visit <a href="https://www.sdsolutions.io" target="_blank">sdsolutions.io</a> for more cool stuff!</p>';

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
