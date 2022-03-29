import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Theme, ThemeFont} from '../models/theme.model';
import {ThemeChangeDetectionService} from './theme-change-detection.service';
import {LocalStorageService} from '../../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {

  /**
   * Prefix used to build the key for local storage of the theme
   */
  private readonly THEME_KEY = 'theme';

  /**
   * A private BehaviorSubject to store the loaded themes
   */
  private themes = new BehaviorSubject<Theme[]>([]);

  private $selectedTheme = new BehaviorSubject<Theme>(null as any);

  get selectedTheme(): Observable<Theme> {
    return this.$selectedTheme.asObservable();
  }


  /**
   * Key for the product this is deployed into
   */
  protected applicationName: string = null as any;

  /**
   * Constructor
   *
   * @param localStorageService
   * @param themeChangeDetectionService
   */
  constructor(
    private localStorageService: LocalStorageService,
    private themeChangeDetectionService: ThemeChangeDetectionService
  ) {
  }

  /**
   * Converts a JSON property name to snake case
   *
   * @param prop
   */
  private toSnakeCase(prop: string): string {
    return prop.split(/(?=[A-Z])/).join('_').toLowerCase();
  }

  /**
   * For the given color, it'll lighten or darken the color by the percentage supplied. Positive percent will lighten, negative to darken.
   *
   * @param color
   * @param percent
   */
  private lightenDarkenColor(color: string, percent: number): string {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + percent;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }

    let b = ((num >> 8) & 0x00FF) + percent;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }

    let g = (num & 0x0000FF) + percent;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }

    let newColor = (g | (b << 8) | (r << 16)).toString(16);

    while (newColor.length < 6) {
      newColor = '0' + newColor;
    }

    return (usePound ? '#' : '') + newColor;
  }

  /**
   * Converts a hex value to a Javascript object with r,g, and b variables.
   *
   * @param hex
   */
  private hexToRgb(hex: string): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Generates a random hex color
   */
  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  /**
   * On App Initialization (in app.component.ts, ngOnInit) call this to load themes and apply the user selected theme or default theme.
   *
   * @param applicationName
   * @param themes
   */
  appInit(applicationName: string, themes: Theme[]): void {
      if (!applicationName) {
        throw new Error('Application Name was not supplied.');
      }

      this.applicationName = applicationName;
      this.themes.next(themes);
      this.applySettings();
  }

  /**
   * Return the themes for the current app
   */
  getThemes(): Observable<Theme[]> {
    return this.themes;
  }

  /**
   * Apply the selected theme
   */
  applySettings(): void {
    const settings = this.getTheme();
    this.$selectedTheme.next(settings);
    this.changeColors(settings);
  }

  /**
   * Constructs a theme object based on another theme object
   *
   * @param theme
   */
  generateTheme(theme?: Theme): Theme {
    let newTheme: Theme = {} as Theme;
    if (theme) {
      for (const prop of Object.keys(theme)) {
        // @ts-ignore
        newTheme[prop] = theme[prop];
      }
    } else {
      newTheme = this.themes.getValue().find(theTheme => theTheme.isDefault) as Theme;
    }

    return newTheme;
  }

  /**
   * Returns a list of the color classes specifically based on the properties of the theme model
   */
  getClassesFromTheme(theme: Theme): string[] {
    const classes = [];
    for (const prop of Object.keys(theme)) {
      if (prop.toLowerCase().includes('bg') || prop.toLowerCase().includes('color')) {
        classes.push(prop.split(/(?=[A-Z])/).join('_').toLowerCase());
      }
    }

    return classes;
  }

  /**
   * Returns the user selected theme from local storage
   */
  getTheme(): Theme {
    const themeId = this.localStorageService.getObject(this.applicationName + this.THEME_KEY);
    let defaultTheme = this.themes.value.filter(theme => theme.isDefault)[0];

    for (const theme of this.themes.value) {
      if (theme.themeId === themeId) {
        return theme;
      }
    }

    return defaultTheme;
  }

  /**
   * Persists the user selected theme in local storage
   *
   * @param settings
   */
  saveTheme(settings: Theme): void {
    this.$selectedTheme.next(settings);
    this.localStorageService.putObject(this.applicationName + this.THEME_KEY, settings.themeId);
  }

  /**
   * Writes the theme information to a style tag in the header so that the theme is applied.
   *
   * @param theme
   */
  changeColors(theme: Theme): void {
    const style = document.createElement('style');

    let rootVars = ':root {';
    rootVars += `--menu-color: ${theme.menuColor};`;
    rootVars += `--nav-color: ${theme.navColor};`;
    rootVars += `--footer-color: ${theme.footerColor};`;
    rootVars += `--body-color: ${theme.bodyColor};`;
    rootVars += `--page-container-color: ${theme.pageContainerColor};`;
    rootVars += `--dialog-header-color: ${theme.dialogHeaderColor};`;
    rootVars += `--dialog-body-color: ${theme.dialogBodyColor};`;
    rootVars += `--push-container-color: ${theme.pushContainerColor};`;
    rootVars += `--bg-red-color: ${theme.bgRed};`;
    rootVars += `--bg-orange-color: ${theme.bgOrange};`;
    rootVars += `--bg-yellow-color: ${theme.bgYellow};`;
    rootVars += `--bg-green-color: ${theme.bgGreen};`;
    rootVars += `--bg-blue-color: ${theme.bgBlue};`;
    rootVars += `--bg-purple-color: ${theme.bgPurple};`;
    rootVars += `--bg-brown-color: ${theme.bgBrown};`;
    rootVars += `--bg-grey-color: ${theme.bgGrey};`;
    rootVars += '}';

    style.appendChild(document.createTextNode(rootVars));

    for (const prop of Object.keys(theme)) {
      if (prop.toLowerCase().includes('bg') || prop.toLowerCase().includes('color')) {
        // @ts-ignore
        const value = theme[prop] as string;

        const color = value.startsWith('#') ? value : '#' + value;
        this.generateColors(style, color, this.toSnakeCase(prop));
      }
    }

    for (const extension of theme.extension) {
      this.generateColors(style, extension.color.startsWith('#') ? extension.color : '#' + extension.color, extension.className);
    }

    if (this.isDarkTheme(theme.bodyColor)) {
      style.appendChild(document.createTextNode(`.bg_overlay{background-color:rgba(255,255,255,0.05);color:#FFFFFF;}`));
      style.appendChild(document.createTextNode(`.bg_overlay_rev{background-color:rgba(0,0,0,0.05);color:#FFFFFF;}`));
      style.appendChild(document.createTextNode(`.brdr{border:1px solid rgba(150,150,150,0.5);}`));
    } else {
      style.appendChild(document.createTextNode(`.bg_overlay{background-color:rgba(255,255,255,0.1);color:#111111;}`));
      style.appendChild(document.createTextNode(`.bg_overlay_rev{background-color:rgba(0,0,0,0.1);color:#111111;}`));
      style.appendChild(document.createTextNode(`.brdr{border:1px solid rgba(150,150,150,0.5);}`));
    }

    const head = document.head || document.getElementsByTagName('head')[0];

    for (const child of <any>head.childNodes) {
      if ((child as Element).innerHTML && (child as Element).innerHTML.startsWith('.menu_color')) {
        head.removeChild(child);
        break;
      }
    }

    this.addFonts(theme, head, style);
    head.appendChild(style);
    this.themeChangeDetectionService.changeTheme();
  }

  private addFonts(theme: Theme, head: HTMLHeadElement, style: HTMLStyleElement): void {
    let defaultFont: ThemeFont = null as any;
    for (const font of theme.fonts) {
      if (font.isDefault) {
        defaultFont = font;
      }

      if (!this.fontExists(head, font)) {
        let element: HTMLLinkElement = document.createElement('link');
        if (font.source === 'adobe') {
          element.setAttribute('href', `https://use.typekit.net/${font.id}.css`);
        } else {
          element.setAttribute('href', `https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}&display=swap`);
        }
        element.setAttribute('rel', 'stylesheet');
        head.appendChild(element);
      }
    }

    style.appendChild(document.createTextNode(`html * { font-family: ${defaultFont.name}, ${defaultFont.isSerif ? 'serif' : 'sans-serif'}; }`));
  }

  private fontExists(head: HTMLHeadElement, font: ThemeFont): boolean {
    for (const child of <any>head.childNodes) {
      if (child.href && font.source === 'adobe' && child.href.indexOf(font.id) > -1) {
        return true;
      } else if (child.href && child.href.indexOf(font.name.replace(' ', '+')) > -1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determines the contrast between a given color and its auto-selected text color
   *
   * @param color
   */
  getContrast(color: string): number {
    const colorRgb = this.hexToRgb(color);
    const textColorRgb = this.hexToRgb(this.getTextColor(color));
    return this.contrast(colorRgb, textColorRgb);
  }

  /**
   * Calculates luminance
   *
   * @param r
   * @param g
   * @param b
   */
  private luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  private isDarkTheme(color: string): boolean {
    const rgb = this.hexToRgb(color);
    return (this.luminance(rgb.r, rgb.g, rgb.b) * 100) < 50;
  }

  /**
   * Calculates the contrast
   *
   * @param rgb1
   * @param rgb2
   */
  private contrast(rgb1: any, rgb2: any): number {
    let contrast = (this.luminance(rgb1.r, rgb1.g, rgb1.b) + 0.05)
      / (this.luminance(rgb2.r, rgb2.g, rgb2.b) + 0.05);

    if (contrast < 1) {
      contrast = (this.luminance(rgb2.r, rgb2.g, rgb2.b) + 0.05)
        / (this.luminance(rgb1.r, rgb1.g, rgb1.b) + 0.05);
    }

    return contrast;
  }

  /**
   * Returns the maximally contrasting text color for the supplied background color
   *
   * @param color
   */
  getTextColor(color: string): string {
    const rgb = this.hexToRgb(color);
    let textRgb = this.hexToRgb('#FFFFFF');
    const whiteContrast = this.contrast(textRgb, rgb);

    textRgb = this.hexToRgb('#222222');
    const blackContrast = this.contrast(textRgb, rgb);

    // 7 is the contrast ratio for WCAG AAA, if we're less than that, go full black for max contrast
    if (blackContrast > whiteContrast && blackContrast < 7) {
      return '#000000';
    }

    return whiteContrast > blackContrast ? '#FFFFFF' : '#222222';
  }

  /**
   * Generates the CSS for each of the colors in the theme. Will write the base color and 9 light and dark variants of the given color.
   *
   * @param style
   * @param color
   * @param className
   */
  private generateColors(style: HTMLStyleElement, color: string, className: string): void {
    if (!color) {
      return;
    }

    let textColor = this.getTextColor(color);
    style.appendChild(document.createTextNode(`.${className}{background-color: ${color};color: ${textColor};fill: currentColor;}`));
    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, i * 10);
      textColor = this.getTextColor(newColor);

      style.appendChild(
        document.createTextNode(`.${className}_light_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`));
    }

    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, 0 - (i * 10));
      textColor = this.getTextColor(newColor);

      style.appendChild(
        document.createTextNode(`.${className}_dark_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`));
    }
  }

}
