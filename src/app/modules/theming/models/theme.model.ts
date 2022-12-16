export interface Theme {
  themeId: string;
  isDefault: boolean;
  name: string;
  layoutColors: ThemeLayoutColors;
  layoutVariables: ThemeLayoutVariables;
  inputVariables: ThemeInputVariables;
  colorPalette: ThemeColorPalette;
  buttonColorPalette: ThemeButtonColorPalette;
  fonts: Array<ThemeFont>;
  accessibility: ThemeAccessibility;
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

export interface ThemeButtonColorPalette {
  okButtonColor: string;
  cancelButtonColor: string;
  deleteButtonColor: string;
  saveButtonColor: string;
  nextButtonColor: string;
  previousButtonColor: string;
  openButtonColor: string;
  closeButtonColor: string;
}

export interface ThemeLayoutVariables {
  headerHeight: string;
  footerHeight: string;
  menuWidth?: string;
}

export interface ThemeInputVariables {
  inputText: string;
  inputHeight: string;
  inputBgColor: string;
  inputBorderColor: string;
  inputBorderSize: string;
  inputBorderRadius: string;
  inputPadding: string;
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

export interface ThemeAccessibility {
  enabled: boolean;
  highlightColor: string;
  highlightThickness: string;
  highlightOffset: string;
  hoverEnabled: boolean;
}
