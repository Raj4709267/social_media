import { Box, Button, Switch } from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../../Context/SettingContext";
import { colorPresets } from "../../Theme/getThemeAndColor";

const Setting = () => {
  const {
    handleChangeColor,
    handleChangeTheme,
    isFullScreen,
    exitFullScreen,
    enterFullScreen,
    color,
    dark,
  } = useContext(ThemeContext);
  return (
    <Box>
      <Box
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Switch
          checked={dark}
          onChange={() => handleChangeTheme()}
          color="primary"
        />
        <span>{dark ? "Disable Dark Mode" : "Enable Dark Mode"}</span>
      </Box>
      <Box
        style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
      >
        <Switch
          checked={isFullScreen}
          onChange={isFullScreen ? exitFullScreen : enterFullScreen}
          color="primary"
        />
        <span>{isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}</span>
      </Box>
      <Box style={{ display: "flex", marginTop: "10px" }}>
        {colorPresets.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleChangeColor(index)}
            sx={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              margin: "5px",
              backgroundColor: item.main,
              cursor: "pointer",
              border:
                color === index
                  ? `2px solid ${dark ? "white" : "black"}`
                  : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Setting;
