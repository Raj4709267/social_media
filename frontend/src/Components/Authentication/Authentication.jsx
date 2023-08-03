import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { signinUser, signupUser } from "../../Redux/AuthReducer/action";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorPopup from "../ErrorPopup/ErrorPopup";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );
  const dispatch = useDispatch();
  const { isLoading, errorMessage, message } = useSelector(
    (store) => store.AuthReducer
  );

  const handleSignUp = (e) => {
    dispatch({ type: "CLEAR_MESSAGES" });
    e.preventDefault();
    // Perform sign-up logic here
    let payload = {
      email,
      password,
      name,
      avatar,
      throughGoogle: false,
    };
    dispatch(signupUser(payload));
  };

  return (
    <form onSubmit={handleSignUp}>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required={true}
      />
      <TextField
        type="text"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required={true}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required={true}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "100%", marginTop: "24px" }}
        startIcon={
          isLoading ? <CircularProgress color="inherit" size="20px" /> : null
        }
      >
        Sign Up
      </Button>
      {errorMessage && !message && (
        <Typography color={"red"} textAlign={"center"} marginTop={"4px"}>
          {errorMessage}
        </Typography>
      )}
      {message && !errorMessage && (
        <Typography color={"green"} textAlign={"center"} marginTop={"4px"}>
          {message}
        </Typography>
      )}
    </form>
  );
};

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isLoading, errorMessage } = useSelector((store) => store.AuthReducer);

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Perform sign-in logic here
    const payload = { email, password };

    dispatch(signinUser(payload));
  };

  return (
    <form onSubmit={handleSignIn}>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required={true}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required={true}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: "100%", marginTop: "24px" }}
        startIcon={
          isLoading ? <CircularProgress color="inherit" size="20px" /> : null
        }
      >
        Sign In
      </Button>
      {errorMessage && (
        <Typography color={"red"} textAlign={"center"} marginTop={"4px"}>
          {errorMessage}
        </Typography>
      )}
    </form>
  );
};

export { SignUpForm, SignInForm };
