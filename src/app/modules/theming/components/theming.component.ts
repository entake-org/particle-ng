import {Component, OnInit, Input} from '@angular/core';
import {ThemingService} from '../services/theming.service';
import {Theme} from '../models/theme.model';
import {map} from 'rxjs/operators';
import {DropdownOption} from '../../dropdown/models/dropdown-option.model';
import {ThemingText} from '../../../shared/models/particle-component-text.model';

/**
 * This will produce a dropdown that can be embedded to allow a user to choose their theme.
 */
@Component({
  selector: 'particle-theming',
  templateUrl: './theming.component.html'
})
export class ThemingComponent implements OnInit {

  /**
   * Override class for the embedded dropdown
   */
  @Input()
  selectClass: string = null as any;

  /**
   * ID for the embedded dropdown (allows for linking a label)
   */
  @Input()
  selectId: string = null as any;

  @Input()
  text: ThemingText = {
    placeholder: 'Select a theme...'
  }

  /**
   * Selected Theme ID
   */
  themeId: string = null as any;

  /**
   * List of available themes
   */
  options$ = this.themingService.getThemes().pipe(
    map(
    themes => {
      const options: Array<DropdownOption> = [];
      for (const theme of themes) {
        options.push({
          label: theme.name,
          value: theme.themeId,
          disabled: false,
          dataContext: {
            'colorValue': theme.layoutColors ? theme.layoutColors.headerColor : '#FFFFFF'
          }
        } as DropdownOption);
      }

      return options;
    }
  ));

  themes$ = this.themingService.getThemes();

  selectedTheme$ = this.themingService.selectedTheme;

  /**
   * Constructor
   *
   * @param themingService
   */
  constructor(
    private themingService: ThemingService
  ) {}

  ngOnInit(): void {
    this.themeId = this.themingService.getTheme().themeId;
  }

  /**
   * Update the user's selected theme
   */
  changeTheme(selectedValue: string | number, themes: Array<Theme>): void {
    let newTheme;
    for (const theme of themes) {
      if (theme.themeId === selectedValue) {
        newTheme = theme;
        break;
      }
    }

    if (newTheme) {
      this.themingService.saveTheme(newTheme);
      this.themingService.changeColors(newTheme);
    }
  }

}
