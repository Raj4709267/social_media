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
  // GREEN (Chat App Primary Color)
  {
    name: "green",
    lighter: "#D0FFD1",
    light: "#76F276",
    main: "#00B200",
    dark: "#008B00",
    darker: "#005A00",
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
  // TEAL
  {
    name: "teal",
    lighter: "#D2F7F7",
    light: "#79E2E2",
    main: "#00B7B7",
    dark: "#008080",
    darker: "#004D4D",
  },
  // PINK
  {
    name: "pink",
    lighter: "#FFD7E5",
    light: "#FF89A8",
    main: "#FF2D55",
    dark: "#B31E4D",
    darker: "#7A1036",
    contrastText: "#fff",
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
  // ORANGE
  {
    name: "orange",
    lighter: "#FEF4D4",
    light: "#FED680",
    main: "#fda92d",
    dark: "#B66816",
    darker: "#793908",
  },
  // INDIGO
  {
    name: "indigo",
    lighter: "#D5E5FF",
    light: "#91A7FF",
    main: "#3F51B5",
    dark: "#1A237E",
    darker: "#0D47A1",
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
