import { Box, Button, Paper, Switch, Typography } from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../../Context/SettingContext";
import { colorPresets } from "../../Theme/getThemeAndColor";
import { useTheme } from "@emotion/react";

const Setting = () => {
  const theme = useTheme();
  const {
    handleChangeColor,
    handleChangeTheme,
    isFullScreen,
    exitFullScreen,
    enterFullScreen,
    color,
    dark,
  } = useContext(ThemeContext);
  const styles = {
    height: "fit-content",
    padding: "8px",
    position: "sticky",
    top: "80px",
    boxShadow: "none",
  };
  return (
    <Paper
      style={{
        ...styles,
        backgroundColor: theme.palette.background.paper,
        border: theme.palette.border,
      }}
    >
      <Typography fontWeight={"bold"} marginBottom={"16px"} marginTop={"12px"}>
        Settings
      </Typography>
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
    </Paper>
  );
};

export default Setting;
