import {Component, inject, input} from '@angular/core';
import {NotificationService} from '../../services/notification.service';
import {NotificationText} from '../../models/particle-component-text.model';
import {AsyncPipe, NgClass} from '@angular/common';

/**
 * Component for displaying notifications
 */
@Component({
  selector: 'particle-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  imports: [NgClass, AsyncPipe]
})
export class NotificationComponent {

  private notificationService = inject(NotificationService);

  readonly text = input<NotificationText>({
    dismiss: 'Dismiss'
  } as NotificationText);

  /**
   * Array of notifications as an Observable
   */
  readonly notifications$ = this.notificationService.getNotifications();

  /**
   * Map of notification severity to color class
   */
  readonly severityColorMap = {
    'success': 'bg_green',
    'warn': 'bg_orange',
    'error': 'bg_red',
    'info': 'bg_purple'
  };

  /**
   * Map of notification severity to icon class
   */
  readonly severityIconMap = {
    'success': 'fa-check-circle',
    'warn': 'fa-exclamation-circle',
    'error': 'fa-circle-xmark',
    'info': 'fa-info-circle'
  };

  /**
   * Delete a notification
   * @param id the ID of the notification to delete
   */
  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id);
  }
}
