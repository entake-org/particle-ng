import {Component, OnInit, ViewChild} from '@angular/core';
import {endOfWeek, startOfWeek} from 'date-fns';
import {Notification} from './modules/notification/models/notification.model';
import {NotificationService} from './modules/notification/services/notification.service';
import {PushContainerComponent} from './modules/push-container/push-container.component';
import {ThemingService} from './modules/theming/services/theming.service';
import {Theme} from './modules/theming/models/theme.model';
import {ToggleOptions} from "./modules/toggle-switch/models/toggle-options.model";
import {Observable} from "rxjs";
import {CarouselOptions} from "./modules/background-carousel/carousel-options.model";

/**
 * App Component to test out stuff built here. Not useful for anything else. Should not be exported by this package.
 */
@Component({
  selector: 'particle-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  readonly console = console;

  /**
   * App Title
   */
  title = 'app';

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
    affirmativeColorClass: 'bg_blue',
    affirmativeLabel: 'Yes',
    affirmativeIcon: 'fas fa-check',
    negativeColorClass: 'bg_red',
    negativeLabel: 'No',
    negativeIcon: 'fas fa-times',
    accessibilityLabel: 'Toggle Switch'
  } as ToggleOptions;

  themes: Array<Theme> = [
    {
      themeId: 'b170c2d1-5ce4-449b-9519-0b7082be9200',
      isDefault: true,
      name: 'Default',
      layoutColors: {
        menuColor: '#3f6570',
        headerColor: '#1f5a69',
        footerColor: '#4d4d4d',
        bodyColor: '#d9d9d9',
        contentColor: '#FEFEFE',
      },
      colorPalette: {
        bgRed: '#823841',
        bgOrange: '#946a15',
        bgYellow: '#7a7626',
        bgGreen: '#447d4c',
        bgBlue: '#317d99',
        bgPurple: '#7b507d',
        bgBrown: '#67523f',
        bgGrey: '#707070',
        extension: [
          {className: 'bg_red_alt', color: '#944646'},
          {className: 'bg_orange_alt', color: '#a1660d'},
          {className: 'bg_yellow_alt', color: '#7a7a0f'},
          {className: 'bg_green_alt', color: '#37852b'},
          {className: 'bg_blue_alt', color: '#0b799e'},
          {className: 'bg_purple_alt', color: '#8a4878'},
          {className: 'bg_brown_alt', color: '#6b6032'},
          {className: 'bg_grey_alt', color: '#616161'},
        ],
      },
      buttonColorPalette: {
        cancelButtonColor: '#7e7e7e',
        closeButtonColor: '#444141',
        deleteButtonColor: '#944646',
        okButtonColor: '#0b799e',
        nextButtonColor: '#a1660d',
        openButtonColor: '#544310',
        previousButtonColor: '#8a4878',
        saveButtonColor: '#37852b'
      },
      layoutVariables: {
        headerHeight: '100px',
        footerHeight: '0',
        menuWidth: '250'
      },
      fonts: [
        {name: 'Roboto'},
        {name: 'Montserrat', isDefault: true}
      ],
      accessibility: {
        enabled: true,
        hoverEnabled: false,
        highlightColor: '#0b799e',
        highlightOffset: '1px',
        highlightThickness: '2px'
      }
    } as Theme,
    {
      themeId: 'c12fd008-88eb-49ec-bcfe-bb4cfced56a5',
      isDefault: false,
      name: 'Other',
      layoutColors: {
        menuColor: '#230e26',
        headerColor: '#2c0a38',
        footerColor: '#192752',
        bodyColor: '#151515',
        contentColor: '#000000',
      },
      colorPalette: {
        bgRed: '#910f20',
        bgOrange: '#9f6f03',
        bgYellow: '#6e680d',
        bgGreen: '#1c962a',
        bgBlue: '#1a5d75',
        bgPurple: '#56185b',
        bgBrown: '#493c31',
        bgGrey: '#4b4848',
        extension: [
          {className: 'bg_red_alt', color: '#944646'},
          {className: 'bg_orange_alt', color: '#a1660d'},
          {className: 'bg_yellow_alt', color: '#7a7a0f'},
          {className: 'bg_green_alt', color: '#37852b'},
          {className: 'bg_blue_alt', color: '#0b799e'},
          {className: 'bg_purple_alt', color: '#8a4878'},
          {className: 'bg_brown_alt', color: '#6b6032'},
          {className: 'bg_grey_alt', color: '#616161'},
        ],
      },
      buttonColorPalette: {
        cancelButtonColor: '#616161',
        closeButtonColor: '#444141',
        deleteButtonColor: '#944646',
        okButtonColor: '#0b799e',
        nextButtonColor: '#a1660d',
        openButtonColor: '#544310',
        previousButtonColor: '#8a4878',
        saveButtonColor: '#37852b'
      },
      layoutVariables: {
        headerHeight: '150px',
        footerHeight: '0',
        menuWidth: '300'
      },
      fonts: [
        {name: 'acumin-pro', id: 'gna4twy', source: 'adobe', isSerif: false, isDefault: true},
        {name: 'Open Sans'}
      ],
      accessibility: {
        enabled: true,
        hoverEnabled: true,
        highlightColor: '#0b799e',
        highlightOffset: '1px',
        highlightThickness: '2px'
      }
    } as Theme
  ];

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

  /**
   * Constructor
   */
  constructor(
    private notificationService: NotificationService,
    private themingService: ThemingService
  ) { }

  ngOnInit(): void {
    this.themingService.appInit('particle_ng', this.themes);
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
