import {Component, ViewChild} from '@angular/core';
import {PushContainerComponent} from './modules/push-container/push-container.component';
import {endOfWeek, startOfWeek} from 'date-fns';
import {ToggleOptions} from './modules/toggle-switch/models/toggle-options.model';
import {Theme} from './modules/theming/models/theme.model';
import {Observable} from 'rxjs';
import {CarouselOptions} from './modules/background-carousel/carousel-options.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from './modules/notification/services/notification.service';
import {ThemingService} from './modules/theming/services/theming.service';
import {Notification} from './modules/notification/models/notification.model';
@Component({
  selector: 'particle-app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  readonly console = console;

  /**
   * App Title
   */
  title = 'app';

  dateRange: any = {start: new Date(new Date().setDate(new Date().getDate() - 14)), end: new Date(new Date().setDate(new Date().getDate() + 14))};

  /**
   * List of icons (name/class pairs)
   */
  readonly icons: Array<{ class: string }> = [
    { class: 'fa-address' },
    { class: 'fa-alpha-text' },
    { class: 'fa-checkbox' },
    { class: 'fa-date' },
    { class: 'fa-date-range' },
    { class: 'fa-divider' },
    { class: 'fa-document-upload' },
    { class: 'fa-dropdown' },
    { class: 'fa-email' },
    { class: 'fa-existing-license' },
    { class: 'fa-fein' },
    { class: 'fa-group-pid' },
    { class: 'fa-group-member-pid' },
    { class: 'fa-html' },
    { class: 'fa-icon-header' },
    { class: 'fa-lab-pid' },
    { class: 'fa-license' },
    { class: 'fa-mmis-npi' },
    { class: 'fa-money' },
    { class: 'fa-multi-select' },
    { class: 'fa-npi' },
    { class: 'fa-numeric-text' },
    { class: 'fa-percent-slider' },
    { class: 'fa-person-name' },
    { class: 'fa-pharmacy-pid' },
    { class: 'fa-phone' },
    { class: 'fa-physical-address' },
    { class: 'fa-physician-license' },
    { class: 'fa-physician-pid' },
    { class: 'fa-pid' },
    { class: 'fa-radio-buttons' },
    { class: 'fa-reply' },
    { class: 'fa-routing-number' },
    { class: 'fa-ssn' },
    { class: 'fa-sidebar-close' },
    { class: 'fa-sidebar-open' },
    { class: 'fa-text-area' },
    { class: 'fa-text-box' }
  ];

  /**
   * Object to be used to pop a dialog
   */
  obj: any;

  obj2: any;
  obj3: any;
  obj4: any;
  obj5: any;
  obj6: any;
  obj7: any;

  /**
   * Push Container component.
   */
  @ViewChild('pushContainerLeft')
  pushContainerLeft: PushContainerComponent = {} as PushContainerComponent;

  text = '';

  value = ['value', 'value6', 'value4'];

  icon = 'fas fa-car';

  dropdownValue = 'lightPurple';

  multiSelectValue = ['chicken', 'cheese', 'fish'];

  datePickerValue = new Date();

  weekPickerValue = { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };

  dateRangePickerValue = { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };

  textEditorValue = '<h2 style="text-align: center">Beautiful <b>BOLD</b> <em>rich</em> text!</h2><p>Visit <a href="https://www.sdsolutions.io" target="_blank">sdsolutions.io</a> for more cool stuff!</p>';

  colorPickerValue = '#44ff55';

  sliderValue = 69;

  toggleValue = true;

  toggleOptions: ToggleOptions = {
    affirmativeColorClass: 'bg_green',
    affirmativeLabel: 'Yes',
    affirmativeIcon: 'fas fa-check',
    negativeColorClass: 'bg_grey',
    negativeLabel: 'No',
    negativeIcon: 'fas fa-times',
    accessibilityLabel: 'Toggle Switch'
  } as ToggleOptions;

  currentTheme: Observable<Theme> = this.themingService.selectedTheme;

  carouselOptions = new CarouselOptions(
    [
      'http://www.pixlb.it/media/headlines/1089.png',
      'http://www.pixlb.it/media/headlines/1064.jpg',
      'http://www.pixlb.it/media/headlines/1031.jpg'
    ],
    2,
    10,
    false
  );

  buttonsDisabled = 'N';
  checkboxActive = true;

  progressBarAmount = 69.69696969;

  formGroup = new FormGroup({ dateTest: new FormControl(null, Validators.required)});

  /**
   * Constructor
   */
  constructor(
    private notificationService: NotificationService,
    private themingService: ThemingService
  ) {
  }

  /**
   * Icon Selected event handler.
   *
   * @param event
   */
  iconSelected(event: any): void {
    console.log(event.value);
  }

  /**
   * Icon select opened event handler
   */
  iconSelectOpened(): void {
    console.log('Icon select opened');
  }

  /**
   * Icon select closed event handler
   */
  iconSelectClosed(): void {
    console.log('Icon select closed');
  }

  /**
   * Rich text editor text changed event handler
   * @param event
   */
  handleEditorTextChange(event: any): void {
    const { textValue } = event;
    console.log('Editor is empty:');
    console.log(
      !(textValue as string)?.replace(/\s+/g, '')?.length
    );
  }

  onPushContainerClose(): void {
    console.log('Push container closed.');
  }

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

  doLogout(): void {
    this.notificationService.add({
      severity: 'info',
      summary: 'Timer Ended',
      detail: 'User logged out'
    });
  }
}
