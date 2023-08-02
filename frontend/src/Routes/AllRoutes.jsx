import React from "react";
import { Route, Routes, redirect } from "react-router-dom";
import Home from "../pages/Home/Home";
import Chat from "../pages/Chat/Chat";
import ErrorPage from "../pages/Error/ErrorPage";
import { useSelector } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import Authentication from "../pages/Authentication/Authentication";
import Setting from "../pages/Setting/Setting";
import Welcome from "../pages/Welcome/Welcome";

const AllRoutes = () => {
  const { isAuth } = useSelector((store) => store.AuthReducer);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Setting />
          </PrivateRoute>
        }
      />

      <Route path="/authentication" element={<Authentication />} />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
};

export default AllRoutes;
