import { Box, Button } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../Context/SettingContext";

const Setting = () => {
  const {
    handleChangeColor,
    handleChangeTheme,
    isFullScreen,
    enterFullScreen,
    exitFullScreen,
  } = useContext(ThemeContext);

  return (
    <div>
      <Button onClick={() => handleChangeTheme()}>click</Button>
      {[0, 1, 2, 3, 4, 5].map((num) => {
        return (
          <Box key={num} onClick={() => handleChangeColor(num)}>
            {num}
          </Box>
        );
      })}
      <div>
        <button onClick={isFullScreen ? exitFullScreen : enterFullScreen}>
          {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        </button>
        {/* Your component content goes here */}
      </div>
    </div>
  );
};

export default Setting;
