import { purple, red } from "@mui/material/colors";
import { createTheme } from "@mui/material";

export const colorPresets = [
  // DEFAULT
  {
    name: "default",
    lighter: "#64b5f6",
    light: "#42a5f5",
    main: "#1976d2",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  // PURPLE
  {
    name: "purple",
    lighter: "#EBD6FD",
    light: "#B985F4",
    main: "#7635dc",
    dark: "#431A9E",
    darker: "#200A69",
    contrastText: "#fff",
  },
  // CYAN
  {
    name: "cyan",
    lighter: "#D1FFFC",
    light: "#76F2FF",
    main: "#1CCAFF",
    dark: "#0E77B7",
    darker: "#053D7A",
  },
  // BLUE
  {
    name: "blue",
    lighter: "#D1E9FC",
    light: "#76B0F1",
    main: "#2065D1",
    dark: "#103996",
    darker: "#061B64",

    contrastText: "#fff",
  },
  // ORANGE
  {
    name: "orange",
    lighter: "#FEF4D4",
    light: "#FED680",
    main: "#fda92d",
    dark: "#B66816",
    darker: "#793908",
  },
  // RED
  {
    name: "red",
    lighter: "#FFE3D5",
    light: "#FFC1AC",
    main: "#FF3030",
    dark: "#B71833",
    darker: "#7A0930",
    contrastText: "#fff",
  },
];

// const themes = {
//   light: {
//     palette: {
//       mode: "light",
//     },
//   },
//   dark: {
//     palette: {
//       mode: "dark",
//     },
//   },
// };

const getThemeAndColor = (theme, color) => {
  const customTheme = createTheme({
    palette: {
      mode: theme,
      primary: { ...colorPresets[color] },
      common: { semiBlack: "#2f3337", black: "#000", white: "#fff" },
      background: {
        default: theme === "light" ? "#f0f2f5" : "#17181c",
        paper: theme === "light" ? "#ffffff" : "#1e1f24",
        lighter: theme === "light" ? "#fefefe" : "#27292f",
        extra: theme === "light" ? "#f0f2f5" : "#3a3b3c",
      },
      border: theme === "light" ? "1px solid #e7ebf3" : "1px solid #464646",
    },
  });
  return customTheme;
};

export default getThemeAndColor;
