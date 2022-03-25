export interface Theme {
  themeId: string;
  isDefault: boolean;
  name: string;
  menuColor: string;
  navColor: string;
  footerColor: string;
  bodyColor: string;
  pageContainerColor: string;
  dialogHeaderColor: string;
  dialogBodyColor: string;
  pushContainerColor: string;
  bgRed: string;
  bgOrange: string;
  bgYellow: string;
  bgGreen: string;
  bgBlue: string;
  bgPurple: string;
  bgBrown: string;
  bgGrey: string;
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
