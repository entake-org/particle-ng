export interface Theme {
  themeId: number;
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
  overlayStyle: string;
  overlayStyleAlt1: string;
  overlayStyleAlt2: string;
  bgRed: string;
  bgOrange: string;
  bgYellow: string;
  bgGreen: string;
  bgBlue: string;
  bgPurple: string;
  bgBrown: string;
  bgGrey: string;
  extension: Array<ThemeExtension>;
}

export interface ThemeExtension {
  className: string;
  color: string;
}
