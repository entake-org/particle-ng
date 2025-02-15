import { Injectable, inject } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Theme, ThemeFont, Z_INDEX_LAYERS} from '../models/theme.model';
import {ThemeChangeDetectionService} from './theme-change-detection.service';
import {LocalStorageService} from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemingService {
  private localStorageService = inject(LocalStorageService);
  private themeChangeDetectionService = inject(ThemeChangeDetectionService);


  // PSA: ORDER MATTERS, DO NOT MOVE ITEMS AROUND
  private readonly defaultZIndexes: Array<string> = [
    Z_INDEX_LAYERS.BASE,
    Z_INDEX_LAYERS.FRAME,
    Z_INDEX_LAYERS.OVERLAY,
    Z_INDEX_LAYERS.DIALOG,
    Z_INDEX_LAYERS.NOTIFICATION
  ];

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
   * Converts a JSON property name to snake case
   *
   * @param prop
   */
  private toSnakeCase(prop: string): string {
    return prop.split(/(?=[A-Z])/).join('_').toLowerCase();
  }

  private toKebabCase(prop: string): string {
    return prop.split(/(?=[A-Z])/).join('-').toLowerCase();
  }

  private convertUnderscoreToDash(prop: string): string {
    return prop.split('_').join('-').toLowerCase();
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
   * Returns the user selected theme from local storage
   */
  getTheme(): Theme {
    const themeId = this.localStorageService.getObject(this.applicationName + this.THEME_KEY);
    const defaultTheme = this.themes.value.filter(theme => theme.isDefault)[0];

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
   * @param prefix
   */
  changeColors(theme: Theme, prefix?: string): void {
    if (!prefix) {
      prefix = '';
    }

    this.removeThemeFromHeader(prefix);

    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.setAttribute('id', (prefix ? prefix + '-' : '') + 'particle-theme');
    head.appendChild(style);

    const styleSheet = style.sheet as CSSStyleSheet;

    let rootVars = ':root {';

    // Render the color palette styles
    if (theme.colorPalette) {
      for (const prop of Object.keys(theme.colorPalette)) {
        if (prop !== 'extension') {
          const value = (theme.colorPalette as any)[prop] as string;

          const color = this.addHashmark(value);
          this.generateColors(styleSheet, color, prefix + this.toSnakeCase(prop));

          rootVars += `--${prefix}${this.toKebabCase(prop)}-color: ${color};`;
        }
      }

      for (const extension of theme.colorPalette.extension) {
        if (extension.textColor && !extension.color) {
          styleSheet.insertRule(`.${prefix}${extension.className}{color: ${this.addHashmark(extension.textColor)};}`);
        }

        if (extension.color) {
          if (!extension.textColor) {
            this.generateColors(styleSheet, this.addHashmark(extension.color as string), prefix + extension.className);
          } else {
            styleSheet.insertRule(`.${prefix}${extension.className}{background-color: ${this.addHashmark(extension.color)};color: ${this.addHashmark(extension.textColor)};fill: currentColor;}`);
          }

          rootVars += `--${prefix}${this.convertUnderscoreToDash(extension.className)}: ${this.addHashmark(extension.color as string)};`;
        }
      }
    }

    // Render the layout color styles
    if (theme.layoutColors) {
      for (const prop of Object.keys(theme.layoutColors)) {
        const value = (theme.layoutColors as any)[prop] as string;

        const color = value.startsWith('#') ? value : '#' + value;
        this.generateColors(styleSheet, color, prefix + this.toSnakeCase(prop));
        rootVars += `--${prefix}${this.toKebabCase(prop)}: ${color};`;
      }

      if (this.isDarkTheme(theme.layoutColors.bodyColor)) {
        styleSheet.insertRule(`.${prefix}bg_overlay{background-color:rgba(255,255,255,0.05);color:inherit;}`);
        styleSheet.insertRule(`.${prefix}bg_overlay_rev{background-color:rgba(0,0,0,0.05);color:inherit;}`);
        styleSheet.insertRule(`.${prefix}brdr{border:1px solid rgba(150,150,150,0.5);}`);
      } else {
        styleSheet.insertRule(`.${prefix}bg_overlay{background-color:rgba(255,255,255,0.1);color:inherit;}`);
        styleSheet.insertRule(`.${prefix}bg_overlay_rev{background-color:rgba(0,0,0,0.04);color:inherit;}`);
        styleSheet.insertRule(`.${prefix}brdr{border:1px solid rgba(150,150,150,0.5);}`);
      }
    }

    if (theme.accessibility && theme.accessibility.enabled) {
      const outlineColor = theme.accessibility.highlightColor.startsWith('#') ? theme.accessibility.highlightColor : '#' + theme.accessibility.highlightColor;
      styleSheet.insertRule(`.${prefix}access{outline: ${outlineColor} ${theme.accessibility.highlightThickness} solid !important;outline-color: transparent !important;transition:all 0.3s ease-in-out;}`);
      styleSheet.insertRule(`.${prefix}access:focus{outline: ${outlineColor} ${theme.accessibility.highlightThickness} solid !important;outline-offset: ${theme.accessibility.highlightOffset};}`);

      if (theme.accessibility.hoverEnabled) {
        styleSheet.insertRule(`.${prefix}access:hover{outline: ${outlineColor} ${theme.accessibility.highlightThickness} solid !important;outline-offset: ${theme.accessibility.highlightOffset};}`);
      }
    }

    // Render the button color styles
    if (theme.buttonColorPalette) {
      for (const prop of Object.keys(theme.buttonColorPalette)) {
        const value = (theme.buttonColorPalette as any)[prop] as string;

        const color = value.startsWith('#') ? value : '#' + value;
        this.generateColors(styleSheet, color, prefix + this.toSnakeCase(prop));

        rootVars += `--${prefix}${this.toKebabCase(prop)}: ${color};`;
      }
    }

    if (theme.stylingVariables) {
      if (theme.stylingVariables.inputTextSize) {
        styleSheet.insertRule(`.${prefix}ptl_input_text_size{font-size: ${theme.stylingVariables.inputTextSize};}`);
      }

      if (theme.stylingVariables.inputLabelSize) {
        styleSheet.insertRule(`.${prefix}ptl_input_label_size{font-size: ${theme.stylingVariables.inputLabelSize};}`);
      }

      if (theme.stylingVariables.inputBgColor) {
        styleSheet.insertRule(`.${prefix}ptl_input_bg_color{background-color: ${this.addHashmark(theme.stylingVariables.inputBgColor)};color: ${this.getTextColor(theme.stylingVariables.inputBgColor)}}`);
      }

      if (theme.stylingVariables.borderColor) {
        styleSheet.insertRule(`.${prefix}ptl_brdr_color{border-color: ${this.addHashmark(theme.stylingVariables.borderColor)};}`);
        rootVars += `--${prefix}ptl-brdr-color: ${this.addHashmark(theme.stylingVariables.borderColor)};`;
      }

      if (theme.stylingVariables.borderSize) {
        styleSheet.insertRule(`.${prefix}ptl_brdr_size{border-width: ${theme.stylingVariables.borderSize};border-style:solid;}`);
        rootVars += `--${prefix}ptl-brdr-size: ${theme.stylingVariables.borderSize};`;
      }

      if (theme.stylingVariables.borderRadius) {
        styleSheet.insertRule(`.${prefix}ptl_brdr_radius{border-radius: ${theme.stylingVariables.borderRadius};}`);
        rootVars += `--${prefix}ptl-brdr-radius: ${theme.stylingVariables.borderRadius};`;
      }

      if (theme.stylingVariables.inputHeight) {
        styleSheet.insertRule(`.${prefix}ptl_input_height{height: ${theme.stylingVariables.inputHeight};}`);
      }

      if (theme.stylingVariables.inputPadding) {
        styleSheet.insertRule(`.${prefix}ptl_input_padding{padding: ${theme.stylingVariables.inputPadding};}`);
      }

      if (theme.stylingVariables.tooltipTextSize || theme.stylingVariables.tooltipBackgroundColor) {
        const bgColor = theme.stylingVariables.tooltipBackgroundColor;
        const textSize = theme.stylingVariables.tooltipTextSize;
        const borderSize = theme.stylingVariables.tooltipBorderSize;
        const borderColor = theme.stylingVariables.tooltipBorderColor;
        const caretSize = theme.stylingVariables.tooltipCaretSize ?? '6px';

        let tooltipStyle = '.particle_tooltip{';

        if (bgColor) {
          const textColor = this.getTextColor(bgColor);
          tooltipStyle += `color: ${textColor};`;
          tooltipStyle += `background-color: ${bgColor};`;
        }

        if (borderColor && borderSize) {
          tooltipStyle += `border: ${borderSize} solid ${borderColor};`;
        }

        if (textSize) {
          tooltipStyle += 'font-size: ' + textSize + ';';
        }

        tooltipStyle += '}';
        styleSheet.insertRule(tooltipStyle);

        let caretStyleColor: string = null as any;
        if (borderColor && borderSize) {
          caretStyleColor = borderColor;
        } else if (bgColor) {
          caretStyleColor = bgColor;
        }

        if (caretStyleColor) {
          styleSheet.insertRule(`.particle_tooltip.right::after{border-color: transparent ${caretStyleColor} transparent transparent;margin-top: -${caretSize};border-width: ${caretSize};}`);
          styleSheet.insertRule(`.particle_tooltip.left::after{border-color: transparent transparent transparent ${caretStyleColor};margin-top: -${caretSize};border-width: ${caretSize};}`);
          styleSheet.insertRule(`.particle_tooltip.top::after{border-color: ${caretStyleColor} transparent transparent transparent;margin-left: -${caretSize};border-width: ${caretSize};}`);
          styleSheet.insertRule(`.particle_tooltip.bottom::after{border-color: transparent transparent ${caretStyleColor} transparent;margin-left: -${caretSize};border-width: ${caretSize};}`);
        }
      }
    }

    // Write the fonts to the header
    if (prefix === '') {
      this.addFonts(theme, head, styleSheet);
      rootVars = this.createZIndexes(rootVars, theme.zIndexList as Array<string>);
    }

    rootVars += '}';
    styleSheet.insertRule(rootVars);


    this.themeChangeDetectionService.changeTheme();
  }

  private addHashmark(color: string): string {
    return color.startsWith('#') ? color : '#' + color;
  }

  private addFonts(theme: Theme, head: HTMLHeadElement, styleSheet: CSSStyleSheet): void {
    if (!theme.fonts) {
      return;
    }

    let defaultFont: ThemeFont = null as any;
    for (const font of theme.fonts) {
      if (font.isDefault || theme.fonts.length === 1) {
        defaultFont = font;
      }

      if (!this.fontExists(head, font)) {
        const element: HTMLLinkElement = document.createElement('link');
        if (font.source === 'adobe') {
          element.setAttribute('href', `https://use.typekit.net/${font.id}.css`);
        } else {
          element.setAttribute('href', `https://fonts.googleapis.com/css?family=${font.name.replace(' ', '+')}&display=swap`);
        }
        element.setAttribute('rel', 'stylesheet');
        head.appendChild(element);
      }
    }

    styleSheet.insertRule(`html * { font-family: ${defaultFont.name}, ${defaultFont.isSerif ? 'serif' : 'sans-serif'}; }`);
  }

  private fontExists(head: HTMLHeadElement, font: ThemeFont): boolean {
    for (const child of head.childNodes as any) {
      if (child.href && font.source === 'adobe' && child.href.indexOf(font.id) > -1) {
        return true;
      } else if (child.href && child.href.indexOf(font.name.replace(' ', '+')) > -1) {
        return true;
      }
    }

    return false;
  }

  removeThemeFromHeader(prefix: string): void {
    const head = document.head || document.getElementsByTagName('head')[0];

    for (const child of head.childNodes as any) {
      if ((child as Element).id === (prefix ? prefix + '-' : '') + 'particle-theme') {
        head.removeChild(child);
        break;
      }
    }
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
  private generateColors(styleSheet: CSSStyleSheet, color: string, className: string): void {
    if (!color) {
      return;
    }

    let textColor = this.getTextColor(color);
    styleSheet.insertRule(`.${className}{background-color: ${color};color: ${textColor};fill: currentColor;}`);
    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, i * 10);
      textColor = this.getTextColor(newColor);

      styleSheet.insertRule(`.${className}_light_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`);
    }

    for (let i = 1; i < 10; i++) {
      const newColor = this.lightenDarkenColor(color, 0 - (i * 10));
      textColor = this.getTextColor(newColor);

      styleSheet.insertRule(`.${className}_dark_${i}{background-color: ${newColor};color: ${textColor};fill: currentColor;}`);
    }
  }

  getDefaultZIndexes(): Array<string> {
    return this.defaultZIndexes;
  }

  private createZIndexes(rootVars: string, zIndexes: Array<string>): string {
    let zIndexesToCreate = this.defaultZIndexes;

    if (zIndexes) {
      if (zIndexes.includes(Z_INDEX_LAYERS.BASE)
        && zIndexes.includes(Z_INDEX_LAYERS.FRAME)
        && zIndexes.includes(Z_INDEX_LAYERS.OVERLAY)
        && zIndexes.includes(Z_INDEX_LAYERS.DIALOG)
        && zIndexes.includes(Z_INDEX_LAYERS.NOTIFICATION)
      ) {
        zIndexesToCreate = zIndexes;
      } else {
        console.warn('THEMING: Z Index List missing required layers, ignoring provided list.');
      }
    }

    let i = 0;
    for (const zIndex of zIndexesToCreate) {
      rootVars += `--z-${zIndex}: ${i++};`;
    }

    return rootVars;
  }

}
