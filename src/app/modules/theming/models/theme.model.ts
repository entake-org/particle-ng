export interface Theme {
  themeId: string;
  isDefault: boolean;
  name: string;
  menuColor: string;
  headerColor: string;
  footerColor: string;
  bodyColor: string;
  contentColor: string;
  bgRed: string;
  bgOrange: string;
  bgYellow: string;
  bgGreen: string;
  bgBlue: string;
  bgPurple: string;
  bgBrown: string;
  bgGrey: string;
  headerHeight: string;
  footerHeight: string;
  extension: Array<ThemeExtension>;
  fonts: Array<ThemeFont>;
}

export interface ThemeExtension {
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
