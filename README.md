# Particle for Angular by Entake

This package offers a small selection of reusable components that are meant to replace usage of other Angular component libraries, like Angular Material and PrimeNG. If you're looking for a themeable alternative that gives you unprecedented control of your Angular components, give Particle a try! If you're interested in contributing or find any bugs, feel free to catch us on GitHub.

## ParticleColorPickerModule
### ColorPickerComponent
The color picker component is a simple way to choose/input a color in hexadecimal format. It offers a text input that allows for free entry in hexadecimal format along with a color picker for supported browsers. If the browser does not support the HTML5 color picker, it is replaced with a simple color swatch that acts as a preview of the contents of the text input.
#### Usage
The color picker accepts a hexadecimal color string (either in short or full form, leading `#` optional, case is ignored) through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the color picker, you can listen for its `ngModelChange` event (if using `ngModel`) or its `colorSelected` event. The value emitted from the component is a full hexadecimal color string (ex: `#0a50d3`). Model updates on every color picker input, every valid text input entry and when the contents of the text input are deleted by the user.
#### Selector: particle-color-picker
#### Inputs
- `value` setter for the internal value of the component
- `disabled` whether the component should be disabled
- `ariaLabel` the aria label to set for the color picker/text input
- `classList` CSS class list to apply to the text input
#### Outputs
- `input` event emitted on text input, emits the current value of the component
- `colorSelected` event emitted on color picker close or on valid hexadecimal string input from the text input, emits the selected color as a hexadecimal string

## ParticleDatePickerModule
### DatePickerComponent
The date picker component allows the user to enter a date via a text input (in the form of month/day/year) or through a calendar widget.
#### Usage
The date picker accepts a Date object through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the date picker, you can listen for its `ngModelChange` event (if using `ngModel`) or its `dateSelected` event. The value emitted from the component is a Date object representing the user's typed/selected date. Model updates on every calendar widget selection, every valid text input entry and when the contents of the text input are deleted by the user.
#### Selector: particle-date-picker
#### Inputs
- `value` setter for the internal value of the component
- `disabled` whether the component should be disabled
- `dateRange` object in the form of `{ minDate: Date, maxDate: Date}` that acts as the valid selection range for the input/calendar widget. Min date must be less than max date. If min date is not provided, the min date is set to January 1st, {currentYear - 100}. If max date is not provided, the max date is set to December 31st, {current year + 50}.
- `inputId` the ID to assign to the text input
- `ariaLabel` the aria label to assign to the text input
- `inputClassList` CSS class list to apply to the text input
- `calendarButtonClassList` CSS class list to apply to the calendar widget button
#### Outputs
- `input` event emitted on text input
- `dateSelected` event emitted on valid date input/widget date selection, emits the selected date
### CalendarComponent
The calendar component displays a calendar widget with accessibility features such as arrow key navigation of calendar dates.
#### Usage
The calendar accepts a Date object through its `value` input. To read in the value of the calendar, you can listen for its `selected` event. The value emitted from the component is a Date object representing the user's selection.
#### Selector: particle-calendar
#### Inputs
- `value` setter for the internal value of the component
- `dateRange` object in the form of { minDate: Date, maxDate: Date} that acts as the valid selection range for the calendar. Min date must be less than max date. If min date is not provided, the min date is set to January 1st, {currentYear - 100}. If max date is not provided, the max date is set to December 31st, {current year + 50}.
#### Outputs
- `selected` event emitted on calendar date selection, emits the selected date
- `closed` event emitted when the user clicks outside the widget, triggers a keyup.escape event or clicks the done button. It is the parent component's responsibility to hide the calendar, the event is merely a signal that action should be taken.

## ParticleDialogModule
### DialogComponent
The dialog component displays dynamic content within a dialog and supports nested dialogs within that dynamic content.
#### Usage
The dialog component essentially wraps an `ng-content` block. It is the responsibility of the parent component to show/hide the dialog based on its `object` input and `closed` event. The dialog listens for `keyup.escape` events (if enabled) to trigger a dialog close. If you have components in the dynamic dialog content that also rely on escape events to close, those components must listen for keyups on its own focusable elements (as opposed to listening for `window.keyup`) and either stop immediate propagation, or those focusable elements must have the `data-dialog-close-override` attribute on them, or else the escape event will close both the child component and the parent dialog.
#### Selector: particle-dialog
#### Inputs
- `object` an input of type `any` where that input becoming truthy will show the dialog and falsy will hide
- `title` the title of the dialog. Note: always use the Angular input syntax (`[title]="'Title'"`) to avoid IE11 triggering a native tooltip of the dialog title
- `titleClass` CSS class to apply to the title section of the dialog
- `bodyClass` CSS class to apply to the body section of the dialog
- `showTitle` whether to show the title section of the dialog (default `true`)
- `allowClose` whether to show the dialog close button and enable escape to close (default `true`)
- `height` the height of dialog (can be any valid CSS measurement)
- `width` the width of dialog (can be any valid CSS measurement)
#### Outputs
- `opened` event emitted on dialog open
- `closed` event emitted on dialog close

## ParticleDropdownModule
### DropdownComponent
The dropdown component acts as an enhanced HTML select. It supports both regular dropdown options (only the label being displayed) and templated options (options for which you can supply a ng-template to act as a template for each dropdown option). The dropdown is fully accessible as well, and supports all the accessibility options that a native select would (such as arrow key controls for option selection).
#### Usage
The dropdown accepts a string or number through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the dropdown, you can listen for its `ngModelChange` event (if using `ngModel`) or its `change` event. The value emitted from the component is a string or number representing the value of the user's selected option. Model updates on every option change, whether it be triggered by clicking on an option or using arrow key controls.
#### Using Dropdown Options
The dropdown supports both flat options or option groups, and the options for a single dropdown can be a mix of the two. A dropdown option has a value (string or number), a label, disabled indicator, and an optional data context object (the data context object is not needed if you're not planning to use templating). Whether data context is passed in or not for an option, each option internally will have a data context object which will minimally contain the option's label (inserted into the `$implicit` property if not already taken, or the `label` property if `$implicit` is already present in the object). Dropdown option groups contain a group label, and an array of dropdown options.
#### Using Dropdown Option Templating
Dropdown option templating relies on Angular's `ng-template` syntax. To provide an option template to the dropdown, you simply define a `ng-template` as the content of the dropdown. If you do not wish to use templating, pass nothing into the content between the dropdown tags. To display data from an option's data context within the option template, you use Angular's `ng-template` `let-var` syntax. This allows you to define variables within the option template that will then be filled by the corresponding property in an option's data context. As mentioned in the previous section, the option's label is automatically added to each option's data context, so to display the label in the template, you can just define a variable without a value, and it will be filled by the `$implicit` entry. Here's an example of how a typical use case of the dropdown with templating would look:

```html
  <particle-dropdown [options]="[
                    { value: 'red', label: 'Red', dataContext: { 'colorClass': 'bg_red' } },
                    { value: 'green', label: 'Green', disabled: true, dataContext: { 'colorClass': 'bg_green' } },
                    { value: 'blue', label: 'Blue', dataContext: { 'colorClass': 'bg_blue' } },
                    { groupLabel: 'Purple Values', options: [
                        { value: 'darkPurple', label: 'Dark Purple', dataContext: { 'colorClass': 'bg_purple_dark_4' } },
                        { value: 'purple', label: 'Purple', dataContext: { 'colorClass': 'bg_purple' } },
                        { value: 'lightPurple', label: 'Light Purple', dataContext: { 'colorClass': 'bg_purple_light_4' } }
                    ]}
                 ]">
    <ng-template let-colorClass="colorClass" let-label>
      <div class="circle_14px mar_right5"
           [ngClass]="colorClass">
      </div> {{label}}
    </ng-template>
  </particle-dropdown>
```
Notice how, in the `ng-template`, the variable definition value (in quotes) for `colorClass` matches up with the property of the same name in the data context objects for each option. Also notice how the variable definition for `label` has no value assigned, that's because the dropdown component will automatically put an option's label into the `$implicit` property, which Angular uses to fill in the value for any referenced variables that do not have a specified value. You can of course choose to explicitly add the label to the option's data context and use that value in the label variable assignment as well.
#### Selector: particle-dropdown
#### Inputs
- `value` string or number representing the value of the selected option
- `options` array of `DropdownOption | DropdownOptionGroup` acting as the options to populate the dropdown
- `disabled` whether the dropdown should be disabled or not
- `placeholder` placeholder text to show in the dropdown when no option is selected
- `ariaLabel` aria label to assign to the dropdown
- `classList` CSS class list to apply to the dropdown
#### Outputs
- change: event emitted on dropdown option selection if selection has changed from the previous value, emits the selected value

## ParticleEndpointStateModule
### EndpointStateComponent
The endpoint state component serves as a catch-all for displaying endpoint states (loading, not found and error).
#### Usage
The endpoint state component is split into four different possible states: loading, loadingOverlay, empty and error. You specify which state the component should be in by passing in `true` to the desired state as an input. Note: only one state should be active at a time.
#### Inputs
- `loading` whether the component should be in the loading state
- `loadingIcon` an icon class to display in the loading state
- `loadingText` main text to display in the loading state
- `loadingSubtext` subtext to display in the loading state
- `loadingOverlay` whether the component should be in the loading overlay state (whole-screen overlay)
- `loadingOverlayIcon` an icon class to display in the loading overlay state
- `loadingOverlayText` main text to display in the loading overlay state
- `loadingOverlaySubtext` subtext to display in the loading overlay state
- `empty` whether the component should be in the empty (not found) state
- `emptyIcon` an icon class to display in the empty state
- `emptyText` main text to display in the empty state
- `emptySubtext` subtext to display in the empty state
- `error` whether the component should be in the error state
- `errorIcon` an icon class to display in the error state
- `errorText` main text to display in the error state
- `errorSubtext` subtext to display in the error state

## ParticleIconsModule
### IconSelectComponent
The icon select component allows a user to search for and select either a Fontawesome or Particle (custom) icon.
### Usage
The icon select accepts an icon class through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the icon select, you can listen for its `ngModelChange` event (if using `ngModel`) or its `selected` event. The value emitted from the component is the selected icon class. Model updates on confirm button click.
### Inputs
- `value` setter for the internal value of the component
- `disabled` whether the component is disabled
- `buttonColorClass` CSS class to apply to the icon dialog show button
- `buttonSizing` the size (width/height) of the icon dialog show button in pixels
#### Outputs
- `opened` event emitted on icon dialog open
- `selected` event emitted on icon dialog confirmation, emits the selected icon in the form of `{ value: string }`
- `closed` event emitted on icon dialog close

## ParticleKeyfilterModule
### KeyfilterDirective
Directive to apply to HTML input elements to filter out certain input.
#### Usage
Supported filter types are `alpha` (English alphabet only), `numeric` (digits only) and `alphanumeric` (English alphabet and digits).
#### Selector: particleKeyfilter
#### Inputs
- `particleKeyfilter` the filter type to apply to the host input
- `allowSpaces` whether to allow spaces in input (default `false`)

## ParticleMultiSelectModule
### MultiSelectComponent
The multi-select component acts as an enhanced HTML select that allows multiple selections. It supports both regular multi-select options (only the label being displayed) and templated options (options for which you can supply a ng-template to act as a template for each multi-select option). The multi-select is fully accessible as well, and supports all the accessibility options that a multi-select should (such as arrow key controls for option selection).
#### Usage
The multi-select accepts an array of strings or numbers through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the multi-select, you can listen for its `ngModelChange` event (if using `ngModel`) or its `change` event. The value emitted from the component is an array of strings or numbers representing the values of the user's selected options. Model updates on every option select/de-select, whether it be triggered by clicking on an option or using arrow key controls.
#### Using Dropdown Options
The multi-select supports both flat options or option groups, and the options for a single multi-select can be a mix of the two. A multi-select option has a value (string or number), a label, disabled indicator, and an optional data context object (the data context object is not needed if you're not planning to use templating). Whether data context is passed in or not for an option, each option internally will have a data context object which will minimally contain the option's label (inserted into the `$implicit` property if not already taken, or the `label` property if `$implicit` is already present in the object). Multi-select option groups contain a group label, and an array of multi-select options.
#### Using Dropdown Option Templating
Multi-select option templating relies on Angular's `ng-template` syntax. To provide an option template to the multi-select, you simply define a `ng-template` as the content of the multi-select. If you do not wish to use templating, pass nothing into the content between the multi-select tags. To display data from an option's data context within the option template, you use Angular's `ng-template` `let-var` syntax. This allows you to define variables within the option template that will then be filled by the corresponding property in an option's data context. As mentioned in the previous section, the option's label is automatically added to each option's data context, so to display the label in the template, you can just define a variable without a value, and it will be filled by the `$implicit` entry. Here's an example of how a typical use case of the multi-select with templating would look:

```html
  <particle-multi-select [options]="[
                    { value: 'red', label: 'Red', dataContext: { 'colorClass': 'bg_red' } },
                    { value: 'green', label: 'Green', disabled: true, dataContext: { 'colorClass': 'bg_green' } },
                    { value: 'blue', label: 'Blue', dataContext: { 'colorClass': 'bg_blue' } },
                    { groupLabel: 'Purple Values', options: [
                        { value: 'darkPurple', label: 'Dark Purple', dataContext: { 'colorClass': 'bg_purple_dark_4' } },
                        { value: 'purple', label: 'Purple', dataContext: { 'colorClass': 'bg_purple' } },
                        { value: 'lightPurple', label: 'Light Purple', dataContext: { 'colorClass': 'bg_purple_light_4' } }
                    ]}
                 ]">
    <ng-template let-colorClass="colorClass" let-label>
      <div class="circle_14px mar_right5"
           [ngClass]="colorClass">
      </div> {{label}}
    </ng-template>
  </particle-multi-select>
```
Notice how, in the `ng-template`, the variable definition value (in quotes) for `colorClass` matches up with the property of the same name in the data context objects for each option. Also notice how the variable definition for `label` has no value assigned, that's because the multi-select component will automatically put an option's label into the `$implicit` property, which Angular uses to fill in the value for any referenced variables that do not have a specified value. You can of course choose to explicitly add the label to the option's data context and use that value in the label variable assignment as well.
#### Selector: particle-multi-select
#### Inputs
- `value` array of strings or numbers representing the value of the selected options
- `options` array of `MultiSelectOption | MultiSelectOptionGroup` acting as the options to populate the multi-select
- `disabled` whether the multi-select should be disabled or not
- `placeholder` placeholder text to show in the multi-select when no options are selected
- `ariaLabel` aria label to assign to the multi-select
- `classList` CSS class list to apply to the multi-select
#### Outputs
- `change` event emitted on multi-select option selection if selection has changed from the previous value, emits the selected values

## ParticleNotificationModule
### Notifications
A notification is a simple way to provide feedback to a user in respect to some action (successful resource save, some error occurred, etc).
Notifications have an ID (system generated), severity (`'success' | 'info' | 'warn' | 'error'`), summary and detail message (optional).
### NotificationComponent
The notification component allows for the display of notifications in an application.
#### Usage
The notification component should be dropped into the app root so that the display of notifications is available throughout the entire application. Once the component has been placed, no further action is needed. It's up to other components/services to add notifications for display in the notification component.
### NotificationService
The notification service is a root `Injectable` that allows components/services throughout an application to add notifications to the notification pool for display.
#### Usage
The notification service can be injected into components/services to add a notification through its `add` method, which accepts a notification object, adds it and then removes it after the configured notification life has passed. Notification life (the time before a notification is automatically removed from the view) can also be configured via the service's `setNotificationLife` method.
#### Methods
- `add` accepts a notification object and adds it to the current notifications array
- `deleteNotification` accepts a notification ID and deletes the corresponding notification (if it exists)
- `getNotifications` get an array of the current notifications as an RxJS Observable
- `setNotificationLife` set the notification life for new notifications

## ParticleOrdinalNumberPipeModule
### OrdinalNumberPipe
The ordinal number pipe transforms a number into an ordinal number (1 => 1st, 2 => 2nd, 3 => 3rd, etc).
#### Usage
The ordinal number pipe accepts a number or a numeric string and transforms it into ordinal format.
#### Name: ordinalNumber

## ParticlePaginatorModule
### PaginatorComponent
The paginator component is a widget that provides controls for paginating a list.
#### Usage
The paginator component accepts an array of page size options, the current page size, and the total size of the paginated list without pagination applied, and from those inputs calculates the page number display and enables/disables the next/previous pagination buttons. Pagination control interactions emit a `PaginationEvent`, it is up to the parent component to react to that event and update the pagination as a result.
#### Selector: particle-paginator
#### Inputs
- `version` which version of the paginator to user (1-4 available)
- `pageSizeOptions` an array of numbers representing the available page size options
- `pageSize` a number representing the currently selected page size
- `totalLength` the total length of the unpaginated list
#### Outputs
- `pagination` event emitted on pagination control interactions, emits a `PaginationEvent` (`{ activePage: number, pageSize: number, totalLength: number }`)

## ParticlePopoverModule
### PopoverComponent
The popover component displays a popover with dynamic content around a given target.
#### Usage
The popover component is a wrapper around an `ng-content` block and has no content itself. The popover is positioned via its `toggle` method, which accepts an `Event` and positions itself off of the `EventTarget`. If the toggle method is called with an event, and the popover is currently closed, the popover opens and aligns to the event target. If the toggle method is called, and the popover is open or no event is passed in, the popover will close.
#### Selector: particle-popover
#### Inputs
- `offset` the number of pixels to offset the popover from its target
- `width` the width of the popover (any valid CSS measurement, default `auto`)
- `height` the height of the popover (any valid CSS measurement, default `auto`)
#### Outputs
- `opened` event emitted on popover open
- `closed` event emitted on popover close

## ParticleProfilePicModule
### ProfilePicComponent
The profile pic component displays a round image with a tooltip description to act as a profile picture.
#### Usage
The profile pic component accepts an image URL and displays it.
#### Selector: particle-profile-pic
#### Inputs
- `size` the size of the picture
- `margin` the CSS margin
- `width` the width of the picture
- `height` the height of the picture
- `toolTip` text to pass as the content of the image tooltip

## ParticlePushContainerModule
### PushContainerComponent
The push container component serves as a side menu (left or right) which display dynamic content
#### Usage
The push container component accepts dynamic content in between its tags and displays it.
#### Selector: particle-push-container
#### Inputs
- `width` the number of pixels wide
- `showSidePanel` whether to be open on page load (default `false`)
- `mainContentId` the ID of the main content that will be pushed when the component opens
- `side` open from the left or right
- `topOffset` top offset to account for a nav bar
- `closeOnResize` whether to close the component on window resize (default `false`)
- `backgroundColorClass` the CSS class to apply to the background of the component
- `breakpoint` the breakpoint passed which the push container will fill the entire view
- `hideCloseButton` whether to hide the push container close button (default `false`)
- `alwaysShowClose` whether to show the close button in desktop view (default `false`)
#### Outputs
- `opened` event emitted on push container open
- `closed` event emitted on push container close

## ParticleRichTextModule
### RichTextComponent
The rich text component is an Angular wrapper around a Quill rich text editor.
#### Usage
The rich text component accepts an HTML paragraph as a string through either its value input or through one/two-way data-binding via `ngModel`. To read in the value of the editor, you can listen for its `ngModelChange` event (if using `ngModel`) or its `textChanged` event. The value emitted from the component is stringified HTML representing the value of the user's input. Model updates on editor input.
#### Selector: particle-rich-text
#### Inputs
- `value` setter for the internal value of the component
- `doHideShow` whether to show the rich text controls
- `height` the height of the editor
- `readonly` whether the editor is readonly
- `placeholder` the placeholder to display in the editor if no input
- `toolbarClassList` CSS class list to apply to the editor toolbar
- `editorClassList` CSS class list to apply to the editor
#### Outputs
- `textChanged` event emitted on text change, emits an object in the following format: `{ htmlValue: string, textValue: string, delta: any, source: any }`
- `selectionChange` event emitted on editor selection change
- `init` event emitted on editor init

## ParticleSliderModule
### SliderComponent
The slider component allows for the user to select a number from a range using an HTML5 range input or through an HTML5 number input.
#### Usage
The slider component accepts a number through either its value input or through one/two-way data-binding via `ngModel`. To read in the value of the component, you can listen for its `ngModelChange` event (if using `ngModel`) or its `input` event. The value emitted from the component is the number selected/input by the user. Model updates on range or number input's `input` event or on the number input's `blur` event.
#### Selector: particle-slider
#### Inputs
- `value` setter for the internal value of the component
- `min` setter for the minimum value of the selectable range (default 0)
- `max` setter for the maximum value of the selectable range (default 100)
- `step` setter for the step size of the number range (default 1)
- `unit` setter for the unit represented by the component value (purely for display purposes)
- `disabled` whether the component is disabled
- `ariaLabel` a string to append to the aria-label for the range/number input
- `inputClassList` class-list to assign to the number input
#### Outputs
- `input` event emitted on range/number input's `input` event, emits the current value of the component

## ParticleTooltipModule
### TooltipDirective
The tooltip directive allows for a tooltip to be displayed around an HTML element.
#### Usage
The tooltip directive accepts text to display and sets up mouse listeners to show the tooltip on host mouse enter hide on host mouse leave.
#### Selector: particleTooltip
#### Inputs
- `particleTooltip` the tooltip text
- `tooltipPosition` `'left' | 'right' | 'top' | 'bottom'`
- `tooltipDisabled` whether the tooltip is disabled

## ParticleWeekPickerModule
### WeekPickerComponent
The week picker component allows for a user to select a week of the year via a calendar widget.
#### Usage
The week picker accepts input through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the week picker, you can listen for its `ngModelChange` event (if using `ngModel`) or its `weekSelected` event. The value emitted from the component is an object in the form of `{ start: Date, end: Date }` (representing the interval of the selected week). Model updates on week select.
#### Selector: particle-week-select
#### Inputs
- `value` setter for the internal value of the component
- `disabled` whether the component is disabled
- `dateRange` object in the form of `{ start: Date, end: Date }` that represents the valid date selection range for the calendar widget
- `inputClassList` CSS class list to apply to the week display input
- `calendarButtonClassList` CSS class list to apply to the calendar widget button
- `ariaLabel` aria label to apply to the component
- `dateFormat` the Angular date pipe format to apply to the selected week preview
#### Outputs
- `weekSelected` event emitted on week select, emits the selected week in the following format: `{ start: Date, end: Date }`


## ParticleAccordionModule
### AccordionComponent
The accordion component allows for a user to add content within tabs which can expand/collapse the window which contains the content.
#### Usage
The accordion component accepts any a text header for each accordion tab with children that contains the content of each accordion tab.
#### Selector: particle-accordion
This selector is a parent wrapper of the following selector which contains each item
#### Inputs
- `multiple` a boolean attribute that allows the user to change the mode of accordion tabs to either display multiple tabs at once or only display one tab at a time.

#### Selector: particle-accordion-item
#### Inputs
- `header` contains the header text value of each accordion tab
- `particleAccordionContent` value goes under ng-template that associates its children to be the content of the accordion item
- `disabled` whether the accordion item is disabled

## Usage
`npm install @entake/particle`

Component listing and usage coming soon.

## Further Help

For more help, please reach out to `nick@entake.io`.
