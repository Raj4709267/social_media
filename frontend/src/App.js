import { useSelector } from "react-redux";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import AllRoutes from "./Routes/AllRoutes";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeContext } from "./Context/SettingContext";
import getThemeAndColor from "./Theme/getThemeAndColor";
import Setting from "./pages/Setting/Setting";
import { ToastContainer } from "react-toastify";

// const lightTheme = createTheme(themes.light);
// const darkTheme = createTheme(themes.dark);

function App() {
  const { isAuth } = useSelector((store) => store.AuthReducer);
  const { dark, color } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);
  return (
    <ThemeProvider
      theme={
        dark
          ? getThemeAndColor("dark", color)
          : getThemeAndColor("light", color)
      }
    >
      <CssBaseline />
      <Box className="App">
        {isAuth ? (
          <Box className="sidebar_container">
            <Sidebar />{" "}
          </Box>
        ) : null}
        <Box className="main-container">
          {isAuth ? <Navbar /> : null}
          <Box className="main-body-container">
            <AllRoutes />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={dark ? "dark" : "light"}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
