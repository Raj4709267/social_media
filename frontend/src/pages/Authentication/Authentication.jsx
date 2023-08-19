import React from "react";
import { auth, provider } from "../../firebase/config";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import {
  SignInForm,
  SignUpForm,
} from "../../Components/Authentication/Authentication";
import style from "./Authentication.module.css";
import { Box, Paper } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import Logo from "../../Components/Logo/Logo";
const Authentication = () => {
  const [currentPage, setCurrentPage] = useState("signup");
  const dispatch = useDispatch();
  const handleGoogleSignin = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        // setUser(res.user);
        const payload = {
          email: res.user.email,
          password: "",
          name: res.user.displayName,
          throughGoogle: true,
          avatar: res.user.photoURL,
        };
        // dispatch(signupUser(payload));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Paper
      style={{
        margin: "auto",
        marginTop: "10%",
        padding: "24px",
      }}
      className={style.authentication_container}
    >
      <Box>
        <Logo />
      </Box>
      <Box width="100%">
        {currentPage === "signup" ? <SignUpForm /> : <SignInForm />}
      </Box>

      {/* <Box margin="12px 0">Or</Box>

      <Box>
        <Button
          variant="contained"
          startIcon={<FcGoogle />}
          // onClick={handleGoogleSignin}
          sx={{
            background: "white",
            color: "black",
            "&:hover": {
              background: "#ebedfd",
            },
          }}
        >
          Register with Google
        </Button>
      </Box> */}
      <Box
        width="100%"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"4px"}
        marginTop={"12px"}
      >
        {currentPage === "signup"
          ? "Already have account?"
          : "Need an account?"}
        {currentPage === "signup" ? (
          <Button
            onClick={() => {
              setCurrentPage("signin");
              dispatch({ type: "CLEAR_MESSAGES" });
            }}
          >
            Sign in
          </Button>
        ) : (
          <Button
            onClick={() => {
              setCurrentPage("signup");
              dispatch({ type: "CLEAR_MESSAGES" });
            }}
          >
            Sign up
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default Authentication;
