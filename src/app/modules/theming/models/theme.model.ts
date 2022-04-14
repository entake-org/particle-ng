export interface Theme {
  themeId: string;
  isDefault: boolean;
  name: string;
  layoutColors: ThemeLayoutColors;
  layoutVariables: ThemeLayoutVariables;
  colorPalette: ThemeColorPalette;
  fonts: Array<ThemeFont>;
}

export interface ThemeLayoutColors {
  menuColor: string;
  headerColor: string;
  footerColor: string;
  bodyColor: string;
  contentColor: string;
}

export interface ThemeColorPalette {
  bgRed: string;
  bgOrange: string;
  bgYellow: string;
  bgGreen: string;
  bgBlue: string;
  bgPurple: string;
  bgBrown: string;
  bgGrey: string;

  extension: Array<ThemeColorPaletteExtension>;
}

export interface ThemeLayoutVariables {
  headerHeight: string;
  footerHeight: string;
  menuWidth?: string;
}

export interface ThemeColorPaletteExtension {
  className: string;
  color: string;
}

export interface ThemeFont {
  name: string;
  id?: string;
  source?: 'google' | 'adobe';
  isDefault?: boolean;
  isSerif?: boolean;
}
