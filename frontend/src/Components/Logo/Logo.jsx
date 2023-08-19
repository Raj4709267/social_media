import React from "react";
import style from "./Logo.module.css";
import { useTheme } from "@emotion/react";

const Logo = () => {
  const theme = useTheme();
  const isLightTheme = theme.palette.mode === "light"; // Check if the theme is light
  const textShadowStyle = {
    textShadow: isLightTheme
      ? "1px 1px 2px rgba(0, 0, 0, 0.2)" // Light shadow for light theme
      : "1px 1px 2px rgba(255, 255, 255, 0.2)", // Dark shadow for dark theme
  };

  return (
    <div className={style.logoContainer}>
      <span
        style={{
          ...textShadowStyle,
          color: theme.palette.primary.main,
        }}
      >
        Town
      </span>
      <span style={textShadowStyle}>Talk</span>
    </div>
  );
};

export default Logo;
