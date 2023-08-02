import React from "react";
import { auth, provider } from "../../firebase/config";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  SignInForm,
  SignUpForm,
} from "../../Components/Authentication/Authentication";
import { signupUser } from "../../Redux/AuthReducer/action";
import style from "./Authentication.module.css";
import { Avatar, Box } from "@mui/material";

const Authentication = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("signup");
  const dispatch = useDispatch();
  const handleGoogleSignin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        setUser(res.user);
        const payload = {
          email: res.user.email,
          password: "",
          name: res.user.displayName,
          throughGoogle: true,
          avatar: res.user.photoURL,
        };
        dispatch(signupUser(payload));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleLogout = () => {
    setUser(null);
  };
  return (
    <div style={{ width: "500px", margin: "auto", marginTop: "10%" }}>
      <Box>
        <img src="/logo.png" alt="logo" width={"100px"} />
      </Box>
      <div>{currentPage === "signup" ? <SignUpForm /> : <SignInForm />}</div>
      <div>
        {currentPage === "signup" ? (
          <Button onClick={() => setCurrentPage("signin")}>
            Already have account?
          </Button>
        ) : (
          <Button onClick={() => setCurrentPage("signup")}>Register Now</Button>
        )}
      </div>
      <div>
        <Button onClick={handleGoogleSignin} variant="contained">
          sign in with google
        </Button>
      </div>
    </div>
  );
};

export default Authentication;
