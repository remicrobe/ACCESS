import { ThemeDefinition } from "vuetify";

// String that represents the name of the theme I am using
export const LIGHT_THEME = "light";
// Light mode theme
export const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#084B83",
    secondary: "#EAEAEA",
    error: twColors.red[500],
    info: "#737373",
    success: twColors.emerald[500],
    warning: twColors.amber[500],
  },
};

// String that represents the name of the dark theme I am using
export const DARK_THEME = "dark";
// Dark mode theme
export const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#084B83",
    secondary: "#EAEAEA",
    error: twColors.red[500],
    info: "#737373",
    success: twColors.emerald[500],
    warning: twColors.amber[500],
  },
};
