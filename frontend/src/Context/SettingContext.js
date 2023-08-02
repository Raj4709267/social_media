import { createContext, useEffect, useRef, useState } from "react";

export const ThemeContext = createContext();

const CustomThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const [color, setColor] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleChangeTheme = () => {
    setDark((pre) => !pre);
  };

  const handleChangeColor = (newColor) => {
    setColor(newColor);
  };

  const enterFullScreen = () => {
    const appContainer = document.documentElement;
    if (appContainer.requestFullscreen) {
      appContainer.requestFullscreen();
    } else if (appContainer.mozRequestFullScreen) {
      appContainer.mozRequestFullScreen();
    } else if (appContainer.webkitRequestFullscreen) {
      appContainer.webkitRequestFullscreen();
    } else if (appContainer.msRequestFullscreen) {
      appContainer.msRequestFullscreen();
    }

    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange
      );
    };
  }, []);
  return (
    <ThemeContext.Provider
      value={{
        dark,
        color,
        handleChangeTheme,
        handleChangeColor,
        isFullScreen,
        enterFullScreen,
        exitFullScreen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { CustomThemeProvider };
